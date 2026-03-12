import { httpClient } from "@/shared/api/http-client";
import type { ApiResponse, Paginated } from "@/shared/types/api";

export type RestaurantDTO = { id: string; name: string; tags: string[]; isNearby: boolean; isPopular: boolean };
export type ProductDTO = { id: string; name: string; description: string; price: number; imageUrl?: string };
export type OrderDTO = { id: string; status: string; amount: number; reviewEligible: boolean };

export const customerApi = {
  getExplore: (params: { nearby?: boolean; popular?: boolean }) =>
    httpClient.get<ApiResponse<Paginated<RestaurantDTO>>>("/customer/explore", { params }),
  getRestaurantMenu: (restaurantId: string) =>
    httpClient.get<ApiResponse<{ restaurant: RestaurantDTO; products: ProductDTO[] }>>(`/customer/restaurants/${restaurantId}/menu`),
  createOrder: (payload: {
    tableId: string;
    mergeIfOpenTableOrder: boolean;
    items: Array<{ productId: string; quantity: number; note?: string }>;
  }) => httpClient.post<ApiResponse<{ orderId: string }>>("/customer/orders", payload),
  getOrderHistory: () => httpClient.get<ApiResponse<Paginated<OrderDTO>>>("/customer/orders"),
};
