"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCustomerStore } from "@/features/customer/store";

export default function CheckoutPage() {
  const cart = useCustomerStore((s) => s.cart);
  const tableId = useCustomerStore((s) => s.tableId);
  const setTableId = useCustomerStore((s) => s.setTableId);
  const activeTableOrder = useCustomerStore((s) => s.activeTableOrder);
  const recentlyPlacedOrder = useCustomerStore((s) => s.recentlyPlacedOrder);
  const placeOrMergeOrder = useCustomerStore((s) => s.placeOrMergeOrder);

  const total = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.qty, 0), [cart]);

  const sameTableActive = activeTableOrder?.tableId === tableId;

  return (
    <section className="card">
      <h1>Checkout</h1>
      <p>Masa bağlamı üzerinden yeni sipariş açılır veya mevcut siparişe eklenir.</p>
      <label>
        Table ID
        <input value={tableId} onChange={(e) => setTableId(e.target.value)} />
      </label>

      {sameTableActive ? (
        <p>
          Bu masa için aktif sipariş var: <strong>{activeTableOrder.id}</strong> (merge sayısı: {activeTableOrder.mergedCount})
        </p>
      ) : (
        <p>Bu masa için yeni sipariş açılacak.</p>
      )}

      {cart.length > 0 ? (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} x {item.qty}
              {item.note ? ` — Not: ${item.note}` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p>Sepet boş. Explore’dan ürün ekleyin.</p>
      )}

      <p>Total: {total}₺</p>
      <button disabled={cart.length === 0} onClick={() => placeOrMergeOrder()}>
        {sameTableActive ? "Mevcut Siparişe Ekle" : "Sipariş Ver"}
      </button>

      {recentlyPlacedOrder ? (
        <p>
          {recentlyPlacedOrder.merged ? "Sipariş birleştirildi" : "Sipariş oluşturuldu"}: {recentlyPlacedOrder.orderId} ({recentlyPlacedOrder.itemCount} ürün)
        </p>
      ) : null}

      <p>
        Sipariş sonrası <Link href="/customer/orders">Order History</Link>
      </p>
    </section>
  );
}
