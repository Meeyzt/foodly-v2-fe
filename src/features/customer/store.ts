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

export type CartItem = Product & { qty: number; note?: string };

export type TableOrder = {
  id: string;
  tableId: string;
  items: CartItem[];
  total: number;
  mergedCount: number;
  lastUpdatedAt: string;
};

type PlaceOrderResult = { orderId: string; merged: boolean; total: number; itemCount: number };

type CustomerStore = {
  restaurants: Restaurant[];
  cart: CartItem[];
  tableId: string;
  activeTableOrder?: TableOrder;
  recentlyPlacedOrder?: PlaceOrderResult;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  setOrderNote: (id: string, note: string) => void;
  setTableId: (id: string) => void;
  placeOrMergeOrder: () => PlaceOrderResult | undefined;
};

const calcTotal = (items: CartItem[]) => items.reduce((acc, item) => acc + item.price * item.qty, 0);

const mergeItems = (existing: CartItem[], incoming: CartItem[]): CartItem[] => {
  const map = new Map(existing.map((item) => [item.id, { ...item }]));

  incoming.forEach((item) => {
    const found = map.get(item.id);
    if (!found) {
      map.set(item.id, { ...item });
      return;
    }

    map.set(item.id, {
      ...found,
      qty: found.qty + item.qty,
      note: [found.note, item.note].filter(Boolean).join(" | ") || undefined,
    });
  });

  return Array.from(map.values());
};

const normalizeTableId = (tableId: string) => tableId.trim().toUpperCase();

export const useCustomerStore = create<CustomerStore>((set, get) => ({
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
  setOrderNote: (id, note) =>
    set((state) => ({ cart: state.cart.map((i) => (i.id === id ? { ...i, note: note.trim() || undefined } : i)) })),
  setTableId: (tableId) => set({ tableId: normalizeTableId(tableId) }),
  placeOrMergeOrder: () => {
    const state = get();
    if (state.cart.length === 0) return undefined;

    const tableId = normalizeTableId(state.tableId) || "T-NA";
    const itemCount = state.cart.reduce((acc, item) => acc + item.qty, 0);
    const now = new Date().toISOString();

    const canMerge = state.activeTableOrder?.tableId === tableId;
    const existingOrder = state.activeTableOrder;
    const nextOrder: TableOrder = canMerge && existingOrder
      ? {
          ...existingOrder,
          items: mergeItems(existingOrder.items, state.cart),
          mergedCount: existingOrder.mergedCount + 1,
          lastUpdatedAt: now,
          total: calcTotal(mergeItems(existingOrder.items, state.cart)),
        }
      : {
          id: `${tableId}-${Date.now()}`,
          tableId,
          items: state.cart.map((item) => ({ ...item })),
          mergedCount: 0,
          lastUpdatedAt: now,
          total: calcTotal(state.cart),
        };

    const result: PlaceOrderResult = {
      orderId: nextOrder.id,
      merged: canMerge,
      total: nextOrder.total,
      itemCount,
    };

    set({
      tableId,
      activeTableOrder: nextOrder,
      cart: [],
      recentlyPlacedOrder: result,
    });

    return result;
  },
}));
