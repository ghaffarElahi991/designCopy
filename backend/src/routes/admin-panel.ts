import { randomBytes } from "node:crypto";
import { Router } from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { renderAdmin } from "../lib/views";
import { importProductsFromCsv, importProductsFromCsvFresh } from "../lib/import-products";
import {
  requireAdminPage,
  redirectIfLoggedIn,
  AdminSession,
} from "../middleware/admin-session";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.includes("csv") || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// Login
router.get("/login", redirectIfLoggedIn, (req, res) => {
  renderAdmin(res, "login", {
    title: "Admin Login",
    error: req.query.error,
  });
});

router.post("/login", redirectIfLoggedIn, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== "ADMIN") {
      return res.redirect("/admin/login?error=Invalid+credentials");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.redirect("/admin/login?error=Invalid+credentials");
    }

    const session = req.session as AdminSession;
    session.userId = user.id;
    session.role = user.role;
    session.name = user.name;

    res.redirect("/admin/products");
  } catch {
    res.redirect("/admin/login?error=Login+failed");
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

// Dashboard redirect
router.get("/", requireAdminPage, (_req, res) => {
  res.redirect("/admin/products");
});

const orderStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
function orderCsrf(req: import("express").Request) {
  const session = req.session as AdminSession & { orderCsrf?: string };
  return session.orderCsrf ||= randomBytes(32).toString("hex");
}

router.get("/orders", requireAdminPage, async (req, res) => {
  const search = String(req.query.search || "").trim().slice(0, 200);
  const status = orderStatuses.find(value => value === req.query.status);
  const page = Math.max(1, Math.min(100000, Math.floor(Number(req.query.page) || 1)));
  const where = { ...(status ? { status } : {}), ...(search ? { OR: [
    { orderNumber: { contains: search, mode: "insensitive" as const } },
    { customerName: { contains: search, mode: "insensitive" as const } },
    { customerEmail: { contains: search, mode: "insensitive" as const } },
  ] } : {}) };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip: (page - 1) * 20, take: 20,
      select: { id: true, orderNumber: true, customerName: true, customerEmail: true, userId: true,
        paymentStatus: true, status: true, createdAt: true, total: true, trackingUrl: true } }),
    prisma.order.count({ where }),
  ]);
  renderAdmin(res, "orders", { title: "Orders", adminName: (req.session as AdminSession).name,
    orders, search, status: status || "", statuses: orderStatuses, total, page, totalPages: Math.ceil(total / 20) });
});

router.get("/orders/:id", requireAdminPage, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(404).send("Order not found");
  const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { product: { select: { name: true, primaryImageUrl: true } } } } } });
  if (!order) return res.status(404).send("Order not found");
  renderAdmin(res, "order-detail", { title: order.orderNumber, adminName: (req.session as AdminSession).name,
    order, statuses: orderStatuses, csrf: orderCsrf(req), saved: req.query.saved === "1",
    siteUrl: process.env.FRONTEND_URL || "https://silkshadow.store" });
});

router.post("/orders/:id/tracking", requireAdminPage, async (req, res) => {
  if (!req.body.csrf || req.body.csrf !== orderCsrf(req)) return res.status(403).send("Please reload the order page and try again.");
  const id = Number(req.params.id);
  const status = orderStatuses.find(value => value === req.body.status);
  if (!Number.isSafeInteger(id) || id <= 0 || !status) return res.status(400).send("Invalid order or status");
  const trackingUrl = String(req.body.trackingUrl || "").trim();
  if (trackingUrl) {
    try {
      const url = new URL(trackingUrl);
      if (url.protocol !== "https:" || url.username || url.password || trackingUrl.length > 2048) throw new Error();
    } catch { return res.status(400).send("Enter a valid HTTPS courier tracking URL. Go back to correct it."); }
  }
  const order = await prisma.order.findUnique({ where: { id }, select: { paymentStatus: true } });
  if (!order) return res.status(404).send("Order not found");
  if (["SHIPPED", "DELIVERED"].includes(status) && order.paymentStatus !== "PAID") return res.status(400).send("Payment must be confirmed before marking an order shipped or delivered.");
  await prisma.order.update({ where: { id }, data: { trackingUrl: trackingUrl || null, status } });
  res.redirect(`/admin/orders/${id}?saved=1`);
});

// Products list
router.get("/products", requireAdminPage, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = 20;
  const search = String(req.query.search || "").trim();
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { brand: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { category: { select: { name: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    renderAdmin(res, "products", {
      title: "Products",
      products: products.map((p) => ({
        ...p,
        price: Number(p.price),
        categoryName: p.category.name,
      })),
      message: req.query.message,
      error: req.query.error,
      adminName: (req.session as AdminSession).name,
      search,
      page,
      totalPages,
      total,
    });
  } catch {
    renderAdmin(res, "products", {
      title: "Products",
      products: [],
      error: "Failed to load products",
      adminName: (req.session as AdminSession).name,
      search,
      page: 1,
      totalPages: 1,
      total: 0,
    });
  }
});

// CSV import (must be before /products/:id routes)
router.get("/products/import", requireAdminPage, (req, res) => {
  renderAdmin(res, "import", {
    title: "Import CSV",
    message: req.query.message,
    error: req.query.error,
    adminName: (req.session as AdminSession).name,
  });
});

router.post(
  "/products/import",
  requireAdminPage,
  upload.single("csv"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.redirect("/admin/products/import?error=Please+select+a+CSV+file");
      }

      const csv = req.file.buffer.toString("utf-8");
      const replaceAll = req.body.replaceAll === "on";
      let clearedSummary = "";
      let result: Awaited<ReturnType<typeof importProductsFromCsv>>;

      if (replaceAll) {
        const freshResult = await importProductsFromCsvFresh(csv);
        clearedSummary = `Cleared ${freshResult.cleared.productsDeleted} products. `;
        result = freshResult;
      } else {
        result = await importProductsFromCsv(csv);
      }

      const msg = encodeURIComponent(
        clearedSummary +
          `Import done: ${result.created} created, ${result.updated} updated` +
          (result.errors.length ? `, ${result.errors.length} errors` : "")
      );
      res.redirect(`/admin/products?message=${msg}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Import failed";
      res.redirect(`/admin/products/import?error=${encodeURIComponent(message)}`);
    }
  }
);

// Add product form
router.get("/products/new", requireAdminPage, async (req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  renderAdmin(res, "product-form", {
    title: "Add Product",
    product: null,
    categories,
    adminName: (req.session as AdminSession).name,
  });
});

// Create product
router.post("/products", requireAdminPage, async (req, res) => {
  try {
    await prisma.product.create({
      data: {
        categoryId: Number(req.body.categoryId),
        name: req.body.name,
        shortDescription: req.body.shortDescription,
        brand: req.body.brand,
        price: Number(req.body.price),
        stock: Number(req.body.stock) || 0,
        rating: Number(req.body.rating) || 0,
        reviewCount: Number(req.body.reviewCount) || 0,
        primaryImageUrl: req.body.primaryImageUrl,
        secondaryImageUrl: req.body.secondaryImageUrl || null,
        description: req.body.description,
        status: req.body.status || "In Stock",
        isNewArrival: req.body.isNewArrival === "on",
        isBestSeller: req.body.isBestSeller === "on",
        colors: parseList(req.body.colors || ""),
        sizes: parseList(req.body.sizes || "One Size"),
      },
    });
    res.redirect("/admin/products?message=Product+created");
  } catch {
    res.redirect("/admin/products/new?error=Failed+to+create+product");
  }
});

// Edit product form
router.get("/products/:id/edit", requireAdminPage, async (req, res) => {
  const id = Number(req.params.id);
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    return res.redirect("/admin/products?error=Product+not+found");
  }

  renderAdmin(res, "product-form", {
    title: "Edit Product",
    product: { ...product, price: Number(product.price) },
    categories,
    adminName: (req.session as AdminSession).name,
  });
});

// Update product
router.post("/products/:id", requireAdminPage, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.product.update({
      where: { id },
      data: {
        categoryId: Number(req.body.categoryId),
        name: req.body.name,
        shortDescription: req.body.shortDescription,
        brand: req.body.brand,
        price: Number(req.body.price),
        stock: Number(req.body.stock) || 0,
        rating: Number(req.body.rating) || 0,
        reviewCount: Number(req.body.reviewCount) || 0,
        primaryImageUrl: req.body.primaryImageUrl,
        secondaryImageUrl: req.body.secondaryImageUrl || null,
        description: req.body.description,
        status: req.body.status || "In Stock",
        isNewArrival: req.body.isNewArrival === "on",
        isBestSeller: req.body.isBestSeller === "on",
        colors: parseList(req.body.colors || ""),
        sizes: parseList(req.body.sizes || "One Size"),
      },
    });
    res.redirect("/admin/products?message=Product+updated");
  } catch {
    res.redirect(`/admin/products/${id}/edit?error=Failed+to+update`);
  }
});

// Delete product
router.post("/products/:id/delete", requireAdminPage, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.product.delete({ where: { id } });
    res.redirect("/admin/products?message=Product+deleted");
  } catch {
    res.redirect("/admin/products?error=Could+not+delete+product");
  }
});

export default router;
