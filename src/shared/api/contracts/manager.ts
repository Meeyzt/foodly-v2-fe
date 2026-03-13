import { httpClient } from "@/shared/api/http-client";
import type { ApiResponse, Paginated } from "@/shared/types/api";

export type Entity = { id: string; name: string };

export type AnalyticsTopProduct = {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
};

export type BusinessAnalyticsSummary = {
  branchId: string;
  from: string;
  to: string;
  grossRevenue: number;
  orderCount: number;
  avgBasket: number;
  cancelCount: number;
  topProducts: AnalyticsTopProduct[];
};

const getBusinessAnalyticsContract = (params: { branchId: string; from: string; to: string }) =>
  httpClient.get<ApiResponse<BusinessAnalyticsSummary>>("/manager/analytics", { params });

const getBusinessAnalyticsFallback = (params: { branchId: string; from: string; to: string }) =>
  httpClient.get<ApiResponse<BusinessAnalyticsSummary>>("/manager/dashboard-metrics", { params });

export const managerApi = {
  getBranches: () => httpClient.get<ApiResponse<Paginated<Entity>>>("/manager/branches"),
  getMenus: (branchId: string) => httpClient.get<ApiResponse<Paginated<Entity>>>("/manager/menus", { params: { branchId } }),
  createMenu: (payload: { branchId: string; name: string }) => httpClient.post<ApiResponse<Entity>>("/manager/menus", payload),
  updateMenu: (menuId: string, payload: { name: string }) => httpClient.put<ApiResponse<Entity>>(`/manager/menus/${menuId}`, payload),
  deleteMenu: (menuId: string) => httpClient.delete<ApiResponse<{ id: string }>>(`/manager/menus/${menuId}`),

  getCategories: (menuId: string) => httpClient.get<ApiResponse<Paginated<Entity>>>("/manager/categories", { params: { menuId } }),
  createCategory: (payload: { menuId: string; name: string }) =>
    httpClient.post<ApiResponse<Entity>>("/manager/categories", payload),
  updateCategory: (categoryId: string, payload: { name: string }) =>
    httpClient.put<ApiResponse<Entity>>(`/manager/categories/${categoryId}`, payload),
  deleteCategory: (categoryId: string) => httpClient.delete<ApiResponse<{ id: string }>>(`/manager/categories/${categoryId}`),

  getProducts: (categoryId: string) =>
    httpClient.get<ApiResponse<Paginated<Entity>>>("/manager/products", { params: { categoryId } }),
  createProduct: (payload: { categoryId: string; name: string }) =>
    httpClient.post<ApiResponse<Entity>>("/manager/products", payload),
  updateProduct: (productId: string, payload: { name: string }) =>
    httpClient.put<ApiResponse<Entity>>(`/manager/products/${productId}`, payload),
  deleteProduct: (productId: string) => httpClient.delete<ApiResponse<{ id: string }>>(`/manager/products/${productId}`),
  getBusinessAnalytics: async (params: { branchId: string; from: string; to: string }) => {
    try {
      return await getBusinessAnalyticsContract(params);
    } catch {
      return getBusinessAnalyticsFallback(params);
    }
  },
};
