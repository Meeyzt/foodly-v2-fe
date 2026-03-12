import { httpClient } from "@/shared/api/http-client";
import type { ApiResponse } from "@/shared/types/api";

type CreateOrderPayload = {
  tableId: string;
  items: Array<{ productId: string; quantity: number; note?: string }>;
};

const createOrderContract = (payload: CreateOrderPayload) =>
  httpClient.post<ApiResponse<{ orderId: string }>>("/staff/orders", payload);

const createOrderMockFallback = (payload: CreateOrderPayload) =>
  httpClient.post<ApiResponse<{ orderId: string }>>("/staff/table-orders", payload);

export const staffApi = {
  resolveQr: (payload: { qrRaw: string }) => httpClient.post<ApiResponse<{ tableId: string }>>("/staff/scan/resolve", payload),
  createTableOrder: async (payload: CreateOrderPayload) => {
    try {
      return await createOrderContract(payload);
    } catch {
      return createOrderMockFallback(payload);
    }
  },
  getDailySummary: (branchId: string, day: string) =>
    httpClient.get<ApiResponse<{ gross: number; orderCount: number; cancelCount: number }>>("/staff/daily-summary", {
      params: { branchId, day },
    }),
};
