import { rest } from "msw";
import type { ApiResponse, Paginated } from "@/shared/types/api";

type Entity = { id: string; name: string };

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

const ok = <T>(data: T): ApiResponse<T> => ({ success: true, data });

export const managerHandlers = [
  rest.get("*/manager/branches", (_req, res, ctx) => res(ctx.json(ok<Paginated<Entity>>({ items: branches, total: branches.length })))),

  rest.get("*/manager/menus", (req, res, ctx) => {
    const branchId = req.url.searchParams.get("branchId") ?? "";
    const items = menusByBranch[branchId] ?? [];
    return res(ctx.json(ok<Paginated<Entity>>({ items, total: items.length })));
  }),

  rest.get("*/manager/categories", (req, res, ctx) => {
    const menuId = req.url.searchParams.get("menuId") ?? "";
    const items = categoriesByMenu[menuId] ?? [];
    return res(ctx.json(ok<Paginated<Entity>>({ items, total: items.length })));
  }),

  rest.get("*/manager/products", (req, res, ctx) => {
    const categoryId = req.url.searchParams.get("categoryId") ?? "";
    const items = productsByCategory[categoryId] ?? [];
    return res(ctx.json(ok<Paginated<Entity>>({ items, total: items.length })));
  }),
];
