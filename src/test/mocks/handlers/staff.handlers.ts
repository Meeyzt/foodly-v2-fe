import { rest } from "msw";
import type { ApiResponse } from "@/shared/types/api";

type StaffOrderPayload = { tableId: string; items: Array<{ productId: string; quantity: number; note?: string }> };

type StaffItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  note?: string;
};

type StaffTableOrder = {
  orderId: string;
  tableId: string;
  status: "OPEN" | "CLOSED";
  updatedAt: string;
  items: StaffItem[];
};

const productCatalog: Record<string, { name: string; unitPrice: number }> = {
  "p-1": { name: "Cheeseburger", unitPrice: 220 },
  "p-2": { name: "Ayran", unitPrice: 45 },
  "p-9": { name: "Mozzarella Sticks", unitPrice: 165 },
};

const tableOrders = new Map<string, StaffTableOrder>();
const tableChecks = new Set<string>();
let orderSeq = 1;
let itemSeq = 1;

const validateOrder = (payload: StaffOrderPayload) => Boolean(payload.tableId) && payload.items.length > 0;

const withTotals = (order: StaffTableOrder) => {
  const subtotal = order.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const serviceCharge = Math.round(subtotal * 0.1);
  return {
    ...order,
    itemCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal,
    serviceCharge,
    total: subtotal + serviceCharge,
  };
};

const upsertTableOrder = (payload: StaffOrderPayload) => {
  const tableId = payload.tableId;
  const existing = tableOrders.get(tableId);
  const order: StaffTableOrder =
    existing ?? {
      orderId: `ord-staff-${orderSeq++}`,
      tableId,
      status: "OPEN",
      updatedAt: new Date().toISOString(),
      items: [],
    };

  for (const line of payload.items) {
    const product = productCatalog[line.productId] ?? { name: `Ürün ${line.productId}`, unitPrice: 100 };
    order.items.push({
      id: `itm-${itemSeq++}`,
      productId: line.productId,
      productName: product.name,
      quantity: line.quantity,
      unitPrice: product.unitPrice,
      note: line.note,
    });
  }

  order.updatedAt = new Date().toISOString();
  tableOrders.set(tableId, order);

  return order;
};

const parseTableIdFromPath = (url: URL, suffix: string) => {
  const marker = "/staff/table-orders/";
  const value = url.pathname.split(marker)[1];
  return value?.replace(suffix, "") ?? "";
};

export const staffHandlers = [
  rest.post("*/staff/scan/resolve", async (req, res, ctx) => {
    const payload = (await req.json()) as { qrRaw: string };
    if (!payload.qrRaw) {
      return res(ctx.status(400), ctx.json({ success: false, message: "qrRaw is required" }));
    }
    return res(ctx.json({ success: true, data: { tableId: "t-12" } } satisfies ApiResponse<{ tableId: string }>));
  }),

  rest.post("*/staff/orders", async (req, res, ctx) => {
    const payload = (await req.json()) as StaffOrderPayload;
    if (!validateOrder(payload)) {
      return res(ctx.status(400), ctx.json({ success: false, message: "Invalid order" }));
    }

    const order = upsertTableOrder(payload);
    return res(ctx.json({ success: true, data: { orderId: order.orderId } } satisfies ApiResponse<{ orderId: string }>));
  }),

  rest.post("*/staff/table-orders", async (req, res, ctx) => {
    const payload = (await req.json()) as StaffOrderPayload;
    if (!validateOrder(payload)) {
      return res(ctx.status(400), ctx.json({ success: false, message: "Invalid order" }));
    }

    const order = upsertTableOrder(payload);
    return res(ctx.json({ success: true, data: { orderId: order.orderId } } satisfies ApiResponse<{ orderId: string }>));
  }),

  rest.get("*/staff/table-orders/:tableId", (req, res, ctx) => {
    const { tableId } = req.params as { tableId: string };
    const order = tableOrders.get(tableId);
    if (!order) {
      return res(ctx.status(404), ctx.json({ success: false, message: "Open table order not found" }));
    }

    return res(ctx.json({ success: true, data: withTotals(order) }));
  }),

  rest.get("*/staff/table-orders/detail", (req, res, ctx) => {
    const tableId = req.url.searchParams.get("tableId") ?? "";
    const order = tableOrders.get(tableId);
    if (!order) {
      return res(ctx.status(404), ctx.json({ success: false, message: "Open table order not found" }));
    }

    return res(ctx.json({ success: true, data: withTotals(order) }));
  }),

  rest.get("*/staff/table-orders/:tableId/check", (req, res, ctx) => {
    const tableId = parseTableIdFromPath(req.url, "/check");
    const order = tableOrders.get(tableId);
    if (!order) {
      return res(ctx.status(404), ctx.json({ success: false, message: "Adisyon bulunamadı" }));
    }

    const totals = withTotals(order);
    return res(
      ctx.json({
        success: true,
        data: {
          tableId,
          orderId: order.orderId,
          subtotal: totals.subtotal,
          serviceCharge: totals.serviceCharge,
          total: totals.total,
          printedAt: new Date().toISOString(),
          status: tableChecks.has(tableId) ? "PAID" : "OPEN",
        },
      }),
    );
  }),

  rest.get("*/staff/table-orders/check", (req, res, ctx) => {
    const tableId = req.url.searchParams.get("tableId") ?? "";
    const order = tableOrders.get(tableId);
    if (!order) {
      return res(ctx.status(404), ctx.json({ success: false, message: "Adisyon bulunamadı" }));
    }

    const totals = withTotals(order);
    return res(
      ctx.json({
        success: true,
        data: {
          tableId,
          orderId: order.orderId,
          subtotal: totals.subtotal,
          serviceCharge: totals.serviceCharge,
          total: totals.total,
          printedAt: new Date().toISOString(),
          status: tableChecks.has(tableId) ? "PAID" : "OPEN",
        },
      }),
    );
  }),

  rest.post("*/staff/table-orders/:tableId/check/close", async (req, res, ctx) => {
    const tableId = parseTableIdFromPath(req.url, "/check/close");
    const payload = (await req.json()) as { paymentMethod?: string };
    if (!tableOrders.get(tableId)) {
      return res(ctx.status(404), ctx.json({ success: false, message: "Table order not found" }));
    }
    if (!payload.paymentMethod) {
      return res(ctx.status(400), ctx.json({ success: false, message: "paymentMethod is required" }));
    }
    tableChecks.add(tableId);
    const order = tableOrders.get(tableId);
    if (order) {
      order.status = "CLOSED";
      order.updatedAt = new Date().toISOString();
      tableOrders.set(tableId, order);
    }

    return res(ctx.json({ success: true, data: { closed: true } } satisfies ApiResponse<{ closed: true }>));
  }),

  rest.post("*/staff/table-orders/check/close", async (req, res, ctx) => {
    const payload = (await req.json()) as { tableId?: string; paymentMethod?: string };
    if (!payload.tableId || !tableOrders.get(payload.tableId)) {
      return res(ctx.status(404), ctx.json({ success: false, message: "Table order not found" }));
    }
    if (!payload.paymentMethod) {
      return res(ctx.status(400), ctx.json({ success: false, message: "paymentMethod is required" }));
    }
    tableChecks.add(payload.tableId);
    const order = tableOrders.get(payload.tableId);
    if (order) {
      order.status = "CLOSED";
      order.updatedAt = new Date().toISOString();
      tableOrders.set(payload.tableId, order);
    }

    return res(ctx.json({ success: true, data: { closed: true } } satisfies ApiResponse<{ closed: true }>));
  }),

  rest.get("*/staff/daily-summary", (req, res, ctx) => {
    const branchId = req.url.searchParams.get("branchId");
    const day = req.url.searchParams.get("day");
    if (!branchId || !day) {
      return res(ctx.status(400), ctx.json({ success: false, message: "branchId and day are required" }));
    }

    return res(
      ctx.json({
        success: true,
        data: { gross: 14250, orderCount: 83, cancelCount: 2 },
      } satisfies ApiResponse<{ gross: number; orderCount: number; cancelCount: number }>),
    );
  }),
];
