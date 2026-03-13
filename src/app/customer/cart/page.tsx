"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCustomerStore } from "@/features/customer/store";

export default function CartPage() {
  const cart = useCustomerStore((s) => s.cart);
  const tableId = useCustomerStore((s) => s.tableId);
  const setTableId = useCustomerStore((s) => s.setTableId);
  const remove = useCustomerStore((s) => s.removeFromCart);
  const setNote = useCustomerStore((s) => s.setOrderNote);

  const total = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.qty, 0), [cart]);

  return (
    <section className="card">
      <h1>Cart</h1>
      <p>Masa bağlamı: <strong>{tableId}</strong></p>
      <label>
        Masa kodu
        <input value={tableId} onChange={(e) => setTableId(e.target.value)} placeholder="örn: T-12" />
      </label>

      {cart.length === 0 ? <p>Cart boş.</p> : null}
      <ul>
        {cart.map((item) => (
          <li key={item.id} style={{ marginBottom: 10 }}>
            {item.name} x {item.qty} ({item.price * item.qty}₺)
            <button onClick={() => remove(item.id)} style={{ marginLeft: 8 }}>
              Kaldır
            </button>
            <input
              placeholder="Sipariş notu (örn: soğansız)"
              value={item.note ?? ""}
              onChange={(e) => setNote(item.id, e.target.value)}
            />
          </li>
        ))}
      </ul>
      <p>Toplam: {total}₺</p>
      <Link href="/customer/checkout">Checkout</Link>
    </section>
  );
}
