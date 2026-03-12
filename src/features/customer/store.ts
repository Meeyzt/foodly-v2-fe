"use client";

import { create } from "zustand";

export type Product = { id: string; name: string; price: number; description: string };
export type Restaurant = {
  id: string;
  name: string;
  tags: string[];
  nearby: boolean;
  popular: boolean;
  products: Product[];
};

const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Anatolia Grill",
    tags: ["Kebap", "Izgara"],
    nearby: true,
    popular: true,
    products: [
      { id: "p1", name: "Adana Kebap", price: 320, description: "Lavaş, soğan, acılı ezme" },
      { id: "p2", name: "Ayran", price: 45, description: "Ev yapımı" },
    ],
  },
  {
    id: "r2",
    name: "Pasta Point",
    tags: ["İtalyan", "Pizza"],
    nearby: false,
    popular: true,
    products: [{ id: "p3", name: "Margarita", price: 260, description: "İnce hamur" }],
  },
];

type CartItem = Product & { qty: number; note?: string };

type CustomerStore = {
  restaurants: Restaurant[];
  cart: CartItem[];
  tableId: string;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  setOrderNote: (id: string, note: string) => void;
  setTableId: (id: string) => void;
};

export const useCustomerStore = create<CustomerStore>((set) => ({
  restaurants,
  cart: [],
  tableId: "T-12",
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === product.id);
      if (existing) {
        return { cart: state.cart.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)) };
      }
      return { cart: [...state.cart, { ...product, qty: 1 }] };
    }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  setOrderNote: (id, note) => set((state) => ({ cart: state.cart.map((i) => (i.id === id ? { ...i, note } : i)) })),
  setTableId: (tableId) => set({ tableId }),
}));
