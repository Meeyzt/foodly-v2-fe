import { httpClient } from "@/shared/api/http-client";
import type { ApiResponse } from "@/shared/types/api";

export type TableOrderItemPayload = {
  productId: string;
  quantity: number;
  note?: string;
};

type CreateOrderPayload = {
  tableId: string;
  items: TableOrderItemPayload[];
};

export type TableOrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  note?: string;
};

export type TableOrderDetail = {
  orderId: string;
  tableId: string;
  status: "OPEN" | "CLOSED";
  itemCount: number;
  subtotal: number;
  serviceCharge: number;
  total: number;
  updatedAt: string;
  items: TableOrderItem[];
};

export type TableCheckDetail = {
  tableId: string;
  orderId: string;
  subtotal: number;
  serviceCharge: number;
  total: number;
  printedAt?: string;
  status: "OPEN" | "PAID";
};

const createOrderContract = (payload: CreateOrderPayload) =>
  httpClient.post<ApiResponse<{ orderId: string }>>("/staff/orders", payload);

const createOrderMockFallback = (payload: CreateOrderPayload) =>
  httpClient.post<ApiResponse<{ orderId: string }>>("/staff/table-orders", payload);

const getTableOrderContract = (tableId: string) =>
  httpClient.get<ApiResponse<TableOrderDetail>>(`/staff/table-orders/${encodeURIComponent(tableId)}`);

const getTableOrderFallback = (tableId: string) =>
  httpClient.get<ApiResponse<TableOrderDetail>>("/staff/table-orders/detail", {
    params: { tableId },
  });

const getTableCheckContract = (tableId: string) =>
  httpClient.get<ApiResponse<TableCheckDetail>>(`/staff/table-orders/${encodeURIComponent(tableId)}/check`);

const getTableCheckFallback = (tableId: string) =>
  httpClient.get<ApiResponse<TableCheckDetail>>("/staff/table-orders/check", {
    params: { tableId },
  });

const closeTableCheckContract = (tableId: string, payload: { paymentMethod: string }) =>
  httpClient.post<ApiResponse<{ closed: true }>>(`/staff/table-orders/${encodeURIComponent(tableId)}/check/close`, payload);

const closeTableCheckFallback = (tableId: string, payload: { paymentMethod: string }) =>
  httpClient.post<ApiResponse<{ closed: true }>>("/staff/table-orders/check/close", {
    tableId,
    ...payload,
  });

export type DailySummary = {
  gross: number;
  orderCount: number;
  cancelCount: number;
};

export type StockItem = {
  productId: string;
  productName: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  status: "OK" | "LOW" | "OUT";
  lastUpdatedAt: string;
};

const getDailySummaryContract = (branchId: string, day: string) =>
  httpClient.get<ApiResponse<DailySummary>>("/staff/daily-summary", {
    params: { branchId, day },
  });

const getDailySummaryFallback = (branchId: string, day: string) =>
  httpClient.get<ApiResponse<DailySummary>>("/staff/summary", {
    params: { branchId, day },
  });

const getStockOverviewContract = (branchId: string) =>
  httpClient.get<ApiResponse<{ items: StockItem[] }>>("/staff/stock", {
    params: { branchId },
  });

const getStockOverviewFallback = (branchId: string) =>
  httpClient.get<ApiResponse<{ items: StockItem[] }>>("/staff/inventory", {
    params: { branchId },
  });

export const staffApi = {
  resolveQr: (payload: { qrRaw: string }) => httpClient.post<ApiResponse<{ tableId: string }>>("/staff/scan/resolve", payload),
  createTableOrder: async (payload: CreateOrderPayload) => {
    try {
      return await createOrderContract(payload);
    } catch {
      return createOrderMockFallback(payload);
    }
  },
  getTableOrder: async (tableId: string) => {
    try {
      return await getTableOrderContract(tableId);
    } catch {
      return getTableOrderFallback(tableId);
    }
  },
  getTableCheck: async (tableId: string) => {
    try {
      return await getTableCheckContract(tableId);
    } catch {
      return getTableCheckFallback(tableId);
    }
  },
  closeTableCheck: async (tableId: string, payload: { paymentMethod: string }) => {
    try {
      return await closeTableCheckContract(tableId, payload);
    } catch {
      return closeTableCheckFallback(tableId, payload);
    }
  },
  getDailySummary: async (branchId: string, day: string) => {
    try {
      return await getDailySummaryContract(branchId, day);
    } catch {
      return getDailySummaryFallback(branchId, day);
    }
  },
  getStockOverview: async (branchId: string) => {
    try {
      return await getStockOverviewContract(branchId);
    } catch {
      return getStockOverviewFallback(branchId);
    }
  },
};
