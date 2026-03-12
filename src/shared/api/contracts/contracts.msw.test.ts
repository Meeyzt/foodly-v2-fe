import { describe, expect, it } from "vitest";
import { login, me } from "@/shared/api/contracts/auth";
import { customerApi } from "@/shared/api/contracts/customer";
import { managerApi } from "@/shared/api/contracts/manager";
import { staffApi } from "@/shared/api/contracts/staff";

describe("API contracts + MSW handlers", () => {
  it("auth login + me", async () => {
    const auth = await login({ email: "admin@foodly.app", password: "password123" });
    expect(auth.success).toBe(true);
    expect(auth.data.accessToken).toContain("mock-token");

    localStorage.setItem("auth_token", auth.data.accessToken);
    const profile = await me();
    expect(profile.success).toBe(true);
    expect(profile.data.email).toContain("foodly.app");
  });

  it("customer endpoints", async () => {
    const explore = await customerApi.getExplore({ nearby: true });
    expect(explore.data.success).toBe(true);
    expect(explore.data.data.items.length).toBeGreaterThan(0);

    const menu = await customerApi.getRestaurantMenu("r-1");
    expect(menu.data.data.products[0].id).toBe("p-1");

    const order = await customerApi.createOrder({
      tableId: "t-12",
      mergeIfOpenTableOrder: false,
      items: [{ productId: "p-1", quantity: 1 }],
    });
    expect(order.data.data.orderId).toBe("ord-101");

    const history = await customerApi.getOrderHistory();
    expect(history.data.data.total).toBeGreaterThan(0);
  });

  it("manager endpoints", async () => {
    const branches = await managerApi.getBranches();
    expect(branches.data.data.total).toBeGreaterThan(0);

    const menus = await managerApi.getMenus("b-1");
    expect(menus.data.data.items[0].id).toBe("m-1");

    const categories = await managerApi.getCategories("m-1");
    expect(categories.data.data.items[0].id).toBe("c-1");

    const products = await managerApi.getProducts("c-1");
    expect(products.data.data.items[0].id).toBe("p-1");
  });

  it("staff endpoints", async () => {
    const qr = await staffApi.resolveQr({ qrRaw: "table:12" });
    expect(qr.data.data.tableId).toBe("t-12");

    const tableOrder = await staffApi.createTableOrder({
      tableId: "t-12",
      items: [{ productId: "p-1", quantity: 1 }],
    });
    expect(tableOrder.data.data.orderId).toBe("ord-staff-1");

    const summary = await staffApi.getDailySummary("b-1", "2026-03-12");
    expect(summary.data.data.orderCount).toBeGreaterThan(0);
  });
});
