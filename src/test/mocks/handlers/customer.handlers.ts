import { rest } from "msw";
import type { ApiResponse, Paginated } from "@/shared/types/api";
import type { OrderDTO, ProductDTO, RestaurantDTO } from "@/shared/api/contracts/customer";

const restaurants: RestaurantDTO[] = [
  { id: "r-1", name: "Foodly Burger", tags: ["burger"], isNearby: true, isPopular: true },
  { id: "r-2", name: "Anatolian Bowl", tags: ["healthy"], isNearby: false, isPopular: true },
  { id: "r-3", name: "Pasta Loca", tags: ["italian"], isNearby: true, isPopular: false },
];

const productsByRestaurant: Record<string, ProductDTO[]> = {
  "r-1": [{ id: "p-1", name: "Classic Burger", description: "200g beef", price: 290 }],
  "r-2": [{ id: "p-2", name: "Chicken Bowl", description: "rice and veggies", price: 240 }],
  "r-3": [{ id: "p-3", name: "Penne Arrabbiata", description: "spicy tomato", price: 260 }],
};

export const customerHandlers = [
  rest.get("*/customer/explore", (req, res, ctx) => {
    const nearby = req.url.searchParams.get("nearby");
    const popular = req.url.searchParams.get("popular");

    const filtered = restaurants.filter((restaurant) => {
      const byNearby = nearby === null ? true : restaurant.isNearby === (nearby === "true");
      const byPopular = popular === null ? true : restaurant.isPopular === (popular === "true");
      return byNearby && byPopular;
    });

    const response: ApiResponse<Paginated<RestaurantDTO>> = {
      success: true,
      data: { items: filtered, total: filtered.length },
    };

    return res(ctx.json(response));
  }),

  rest.get("*/customer/restaurants/:restaurantId/menu", (req, res, ctx) => {
    const restaurantId = req.params.restaurantId as string;
    const restaurant = restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) {
      return res(ctx.status(404), ctx.json({ success: false, message: "Restaurant not found" }));
    }

    return res(
      ctx.json({
        success: true,
        data: {
          restaurant,
          products: productsByRestaurant[restaurantId] ?? [],
        },
      } satisfies ApiResponse<{ restaurant: RestaurantDTO; products: ProductDTO[] }>),
    );
  }),

  rest.post("*/customer/orders", async (req, res, ctx) => {
    const payload = (await req.json()) as {
      tableId: string;
      mergeIfOpenTableOrder: boolean;
      items: Array<{ productId: string; quantity: number; note?: string }>;
    };

    if (!payload.tableId || payload.items.length === 0) {
      return res(ctx.status(400), ctx.json({ success: false, message: "Invalid order payload" }));
    }

    return res(ctx.json({ success: true, data: { orderId: "ord-101" } } satisfies ApiResponse<{ orderId: string }>));
  }),

  rest.get("*/customer/orders", (_req, res, ctx) => {
    const orders: OrderDTO[] = [
      { id: "ord-101", status: "Completed", amount: 530, reviewEligible: true },
      { id: "ord-100", status: "Cancelled", amount: 120, reviewEligible: false },
    ];

    return res(
      ctx.json({
        success: true,
        data: { items: orders, total: orders.length },
      } satisfies ApiResponse<Paginated<OrderDTO>>),
    );
  }),
];
