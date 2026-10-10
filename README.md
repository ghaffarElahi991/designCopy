# Silk Shadow E-Commerce

Premium women's fashion e-commerce platform with a **Next.js** frontend and **Node.js (Express)** backend.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, Tailwind CSS, Shadcn-style UI, Lucide React |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT |

## Product Data Schema

Products match your spreadsheet structure:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique product ID |
| category | string | Handbags, Sandals, Heels, etc. |
| name | string | Product name |
| shortDescription | string | Brief description |
| brand | string | Brand or attribute |
| price | number | Price in USD |
| stock | number | Inventory count |
| rating | number | Customer rating (1–5) |
| primaryImageUrl | string | Main product image |
| secondaryImageUrl | string | Hover/gallery image |
| description | string | Full product details |
| status | string | e.g. "In Stock", "New Arrival" |

## Quick Start

### 1. Database setup

PostgreSQL must be running. For local Linux with peer auth, `.env` uses a Unix socket:

```env
PGHOST=/var/run/postgresql
PGUSER=blackhat
PGDATABASE=luxe_fashion
```

```bash
cd backend
npm install
npm run db:setup
```

### 2. Backend

```bash
cd backend
npm run dev
```

API runs at `http://localhost:4000`

### 3. Frontend

```bash
cd frontend
npm run dev
```

Site runs at `http://localhost:3000`

### From project root

```bash
npm run db:setup      # setup database
npm run dev:backend   # start API
npm run dev:frontend  # start site
```

## API Endpoints


| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (filter, sort, search) |
| GET | `/api/products/:id` | Product detail + related items |
| GET | `/api/categories` | All categories |
| GET | `/api/reviews` | Customer reviews |
| POST | `/api/orders` | Place order |
| POST | `/api/orders/validate-coupon` | Validate coupon code |
| POST | `/api/auth/register` | Register customer |
| POST | `/api/auth/login` | Login (JWT) |

### Admin Panel (HTML + Bootstrap)

Simple product management at **http://localhost:4000/admin**

- Login: `admin@luxefashion.com` / `admin123`
- List, add, edit, and delete products
- Runs from the backend folder using plain HTML + Bootstrap 5
- **Import CSV:** `/admin/products/import` — upload Shopify export CSV

### Import products from CSV (CLI)

```bash
cd backend
npm run db:import -- path/to/your-products.csv
```

Shopify CSV format is supported. Rows with the same **URL handle** are grouped into one product; extra rows add more images.

### Admin JSON API (optional, requires JWT + ADMIN role)
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET/POST/PUT/DELETE | `/api/admin/products` | Manage products |
| POST | `/api/admin/products/import` | Bulk import from JSON (spreadsheet format) |
| GET/POST/PUT/DELETE | `/api/admin/categories` | Manage categories |
| GET | `/api/admin/orders` | List orders |
| PATCH | `/api/admin/orders/:id/status` | Update order status |
| GET | `/api/admin/customers` | List customers |
| GET/POST/PATCH | `/api/admin/coupons` | Manage discount codes |

### Product Query Parameters

- `category` — category slug (e.g. `handbags`)
- `search` — search by name, brand, description
- `minPrice` / `maxPrice` — price range
- `sort` — `newest`, `best-selling`, `price-asc`, `price-desc`
- `newArrivals=true` / `bestSellers=true`
- `limit` — max results

## Seed Data

Run `npm run db:seed` in the backend. Includes:

- 6 categories
- 8 sample products
- Customer reviews
- Coupon code: **WELCOME10** (10% off)
- Admin user: `admin@luxefashion.com` / `admin123`

## Pages

- `/` — Homepage (hero, categories, new arrivals, best sellers, reviews, newsletter)
- `/shop` — Product listing with filters
- `/product/[id]` — Product detail
- `/cart` — Shopping cart
- `/checkout` — Checkout form
- `/about` — About us
- `/contact` — Contact form

## Design

- **Fonts:** Playfair Display (headings), Inter (body)
- **Colors:** Blush pink, rose, cream, beige, gold accents
- **Animations:** Subtle hover zoom, fade-in, smooth transitions

## Admin Panel

Open **http://localhost:4000/admin** — simple HTML + Bootstrap pages in `backend/views/admin/`.
# designerBagCopy
# designCopy
