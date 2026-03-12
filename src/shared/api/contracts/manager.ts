import { httpClient } from "@/shared/api/http-client";
import type { ApiResponse, Paginated } from "@/shared/types/api";

type Entity = { id: string; name: string };

export const managerApi = {
  getBranches: () => httpClient.get<ApiResponse<Paginated<Entity>>>("/manager/branches"),
  getMenus: (branchId: string) => httpClient.get<ApiResponse<Paginated<Entity>>>("/manager/menus", { params: { branchId } }),
  getCategories: (menuId: string) =>
    httpClient.get<ApiResponse<Paginated<Entity>>>("/manager/categories", { params: { menuId } }),
  getProducts: (categoryId: string) =>
    httpClient.get<ApiResponse<Paginated<Entity>>>("/manager/products", { params: { categoryId } }),
};
