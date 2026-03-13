import { rest } from "msw";
import type { ApiResponse, Paginated } from "@/shared/types/api";
import type { Entity } from "@/shared/api/contracts/manager";

const branches: Entity[] = [
  { id: "b-1", name: "Kadikoy" },
  { id: "b-2", name: "Besiktas" },
];

const menusByBranch: Record<string, Entity[]> = {
  "b-1": [{ id: "m-1", name: "Main Menu" }],
  "b-2": [{ id: "m-2", name: "Lunch Menu" }],
};

const categoriesByMenu: Record<string, Entity[]> = {
  "m-1": [{ id: "c-1", name: "Burgers" }],
  "m-2": [{ id: "c-2", name: "Bowls" }],
};

const productsByCategory: Record<string, Entity[]> = {
  "c-1": [{ id: "p-1", name: "Classic Burger" }],
  "c-2": [{ id: "p-2", name: "Chicken Bowl" }],
};

const analyticsByBranch: Record<string, { grossRevenue: number; orderCount: number; cancelCount: number; topProducts: Array<{ productId: string; productName: string; quantity: number; revenue: number }> }> = {
  "b-1": {
    grossRevenue: 128_450,
    orderCount: 426,
    cancelCount: 11,
    topProducts: [
      { productId: "p-1", productName: "Classic Burger", quantity: 138, revenue: 44_160 },
      { productId: "p-9", productName: "Cheese Burger", quantity: 112, revenue: 38_080 },
      { productId: "p-3", productName: "Ayran", quantity: 176, revenue: 13_200 },
    ],
  },
  "b-2": {
    grossRevenue: 96_340,
    orderCount: 315,
    cancelCount: 7,
    topProducts: [
      { productId: "p-2", productName: "Chicken Bowl", quantity: 121, revenue: 42_350 },
      { productId: "p-7", productName: "Veggie Bowl", quantity: 87, revenue: 26_100 },
      { productId: "p-8", productName: "Cold Brew", quantity: 152, revenue: 19_760 },
    ],
  },
};

const ok = <T>(data: T): ApiResponse<T> => ({ success: true, data });

const uniqueId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 7)}`;

const findCollectionById = (store: Record<string, Entity[]>, entityId: string) => {
  for (const [key, items] of Object.entries(store)) {
    const index = items.findIndex((item) => item.id === entityId);
    if (index !== -1) return { key, items, index };
  }
  return undefined;
};

export const managerHandlers = [
  rest.get("*/manager/branches", (_req, res, ctx) => res(ctx.json(ok<Paginated<Entity>>({ items: branches, total: branches.length })))),

  rest.get("*/manager/analytics", (req, res, ctx) => {
    const branchId = req.url.searchParams.get("branchId") ?? "";
    const from = req.url.searchParams.get("from") ?? "";
    const to = req.url.searchParams.get("to") ?? "";
    const metrics = analyticsByBranch[branchId] ?? analyticsByBranch["b-1"];
    const avgBasket = metrics.orderCount === 0 ? 0 : Number((metrics.grossRevenue / metrics.orderCount).toFixed(2));

    return res(
      ctx.json(
        ok({
          branchId,
          from,
          to,
          grossRevenue: metrics.grossRevenue,
          orderCount: metrics.orderCount,
          avgBasket,
          cancelCount: metrics.cancelCount,
          topProducts: metrics.topProducts,
        }),
      ),
    );
  }),

  rest.get("*/manager/dashboard-metrics", (req, res, ctx) => {
    const branchId = req.url.searchParams.get("branchId") ?? "";
    const from = req.url.searchParams.get("from") ?? "";
    const to = req.url.searchParams.get("to") ?? "";
    const metrics = analyticsByBranch[branchId] ?? analyticsByBranch["b-1"];
    const avgBasket = metrics.orderCount === 0 ? 0 : Number((metrics.grossRevenue / metrics.orderCount).toFixed(2));

    return res(
      ctx.json(
        ok({
          branchId,
          from,
          to,
          grossRevenue: metrics.grossRevenue,
          orderCount: metrics.orderCount,
          avgBasket,
          cancelCount: metrics.cancelCount,
          topProducts: metrics.topProducts,
        }),
      ),
    );
  }),

  rest.get("*/manager/menus", (req, res, ctx) => {
    const branchId = req.url.searchParams.get("branchId") ?? "";
    const items = menusByBranch[branchId] ?? [];
    return res(ctx.json(ok<Paginated<Entity>>({ items, total: items.length })));
  }),

  rest.post("*/manager/menus", async (req, res, ctx) => {
    const payload = (await req.json()) as { branchId: string; name: string };
    if (!payload.branchId || !payload.name.trim()) {
      return res(ctx.status(400), ctx.json({ success: false, message: "branchId and name required" }));
    }

    const created = { id: uniqueId("m"), name: payload.name.trim() };
    menusByBranch[payload.branchId] = [created, ...(menusByBranch[payload.branchId] ?? [])];
    return res(ctx.json(ok(created)));
  }),

  rest.put("*/manager/menus/:menuId", async (req, res, ctx) => {
    const menuId = req.params.menuId as string;
    const payload = (await req.json()) as { name: string };
    const result = findCollectionById(menusByBranch, menuId);
    if (!result || !payload.name.trim()) {
      return res(ctx.status(400), ctx.json({ success: false, message: "Invalid menu update" }));
    }

    const updated = { ...result.items[result.index], name: payload.name.trim() };
    result.items[result.index] = updated;
    return res(ctx.json(ok(updated)));
  }),

  rest.delete("*/manager/menus/:menuId", (req, res, ctx) => {
    const menuId = req.params.menuId as string;
    const result = findCollectionById(menusByBranch, menuId);
    if (!result) return res(ctx.status(404), ctx.json({ success: false, message: "Menu not found" }));

    result.items.splice(result.index, 1);
    return res(ctx.json(ok({ id: menuId })));
  }),

  rest.get("*/manager/categories", (req, res, ctx) => {
    const menuId = req.url.searchParams.get("menuId") ?? "";
    const items = categoriesByMenu[menuId] ?? [];
    return res(ctx.json(ok<Paginated<Entity>>({ items, total: items.length })));
  }),

  rest.post("*/manager/categories", async (req, res, ctx) => {
    const payload = (await req.json()) as { menuId: string; name: string };
    if (!payload.menuId || !payload.name.trim()) {
      return res(ctx.status(400), ctx.json({ success: false, message: "menuId and name required" }));
    }

    const created = { id: uniqueId("c"), name: payload.name.trim() };
    categoriesByMenu[payload.menuId] = [created, ...(categoriesByMenu[payload.menuId] ?? [])];
    return res(ctx.json(ok(created)));
  }),

  rest.put("*/manager/categories/:categoryId", async (req, res, ctx) => {
    const categoryId = req.params.categoryId as string;
    const payload = (await req.json()) as { name: string };
    const result = findCollectionById(categoriesByMenu, categoryId);
    if (!result || !payload.name.trim()) {
      return res(ctx.status(400), ctx.json({ success: false, message: "Invalid category update" }));
    }

    const updated = { ...result.items[result.index], name: payload.name.trim() };
    result.items[result.index] = updated;
    return res(ctx.json(ok(updated)));
  }),

  rest.delete("*/manager/categories/:categoryId", (req, res, ctx) => {
    const categoryId = req.params.categoryId as string;
    const result = findCollectionById(categoriesByMenu, categoryId);
    if (!result) return res(ctx.status(404), ctx.json({ success: false, message: "Category not found" }));

    result.items.splice(result.index, 1);
    return res(ctx.json(ok({ id: categoryId })));
  }),

  rest.get("*/manager/products", (req, res, ctx) => {
    const categoryId = req.url.searchParams.get("categoryId") ?? "";
    const items = productsByCategory[categoryId] ?? [];
    return res(ctx.json(ok<Paginated<Entity>>({ items, total: items.length })));
  }),

  rest.post("*/manager/products", async (req, res, ctx) => {
    const payload = (await req.json()) as { categoryId: string; name: string };
    if (!payload.categoryId || !payload.name.trim()) {
      return res(ctx.status(400), ctx.json({ success: false, message: "categoryId and name required" }));
    }

    const created = { id: uniqueId("p"), name: payload.name.trim() };
    productsByCategory[payload.categoryId] = [created, ...(productsByCategory[payload.categoryId] ?? [])];
    return res(ctx.json(ok(created)));
  }),

  rest.put("*/manager/products/:productId", async (req, res, ctx) => {
    const productId = req.params.productId as string;
    const payload = (await req.json()) as { name: string };
    const result = findCollectionById(productsByCategory, productId);
    if (!result || !payload.name.trim()) {
      return res(ctx.status(400), ctx.json({ success: false, message: "Invalid product update" }));
    }

    const updated = { ...result.items[result.index], name: payload.name.trim() };
    result.items[result.index] = updated;
    return res(ctx.json(ok(updated)));
  }),

  rest.delete("*/manager/products/:productId", (req, res, ctx) => {
    const productId = req.params.productId as string;
    const result = findCollectionById(productsByCategory, productId);
    if (!result) return res(ctx.status(404), ctx.json({ success: false, message: "Product not found" }));

    result.items.splice(result.index, 1);
    return res(ctx.json(ok({ id: productId })));
  }),
];
