import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import {
  createOrder,
  createOrderSchema,
  serializeOrder,
} from "../lib/order-service";

const router = Router();

router.get("/confirmation", async (req, res) => {
  try {
    const orderNumber = String(req.query.orderNumber || "");
    const email = String(req.query.email || "").toLowerCase();

    if (!orderNumber || !email) {
      return res.status(400).json({ error: "Order number and email are required" });
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        customerEmail: { equals: email, mode: "insensitive" },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, primaryImageUrl: true } },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(serializeOrder(order));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const { order } = await createOrder(data);
    res.status(201).json(serializeOrder(order));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }
    if (error instanceof Error) {
      if (error.message.includes("Insufficient stock") || error.message.includes("not found")) {
        return res.status(400).json({ error: error.message });
      }
    }
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.post("/validate-coupon", async (req, res) => {
  try {
    const { code } = z.object({ code: z.string() }).parse(req.body);
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    if (!coupon) {
      return res.status(404).json({ error: "Invalid or expired coupon" });
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
    });
  } catch {
    res.status(400).json({ error: "Invalid coupon code" });
  }
});

export default router;
