import { rest } from "msw";
import type { ApiResponse } from "@/shared/types/api";

export const staffHandlers = [
  rest.post("*/staff/scan/resolve", async (req, res, ctx) => {
    const payload = (await req.json()) as { qrRaw: string };
    if (!payload.qrRaw) {
      return res(ctx.status(400), ctx.json({ success: false, message: "qrRaw is required" }));
    }
    return res(ctx.json({ success: true, data: { tableId: "t-12" } } satisfies ApiResponse<{ tableId: string }>));
  }),

  rest.post("*/staff/table-orders", async (req, res, ctx) => {
    const payload = (await req.json()) as { tableId: string; items: Array<{ productId: string; quantity: number; note?: string }> };
    if (!payload.tableId || payload.items.length < 1) {
      return res(ctx.status(400), ctx.json({ success: false, message: "Invalid order" }));
    }

    return res(ctx.json({ success: true, data: { orderId: "ord-staff-1" } } satisfies ApiResponse<{ orderId: string }>));
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
