import { httpClient } from "@/shared/api/http-client";
import type { ApiResponse } from "@/shared/types/api";

export const staffApi = {
  resolveQr: (payload: { qrRaw: string }) => httpClient.post<ApiResponse<{ tableId: string }>>("/staff/scan/resolve", payload),
  createTableOrder: (payload: {
    tableId: string;
    items: Array<{ productId: string; quantity: number; note?: string }>;
  }) => httpClient.post<ApiResponse<{ orderId: string }>>("/staff/table-orders", payload),
  getDailySummary: (branchId: string, day: string) =>
    httpClient.get<ApiResponse<{ gross: number; orderCount: number; cancelCount: number }>>("/staff/daily-summary", {
      params: { branchId, day },
    }),
};
