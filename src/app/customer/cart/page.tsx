"use client";

import Link from "next/link";
import { useCustomerStore } from "@/features/customer/store";

export default function CartPage() {
  const cart = useCustomerStore((s) => s.cart);
  const remove = useCustomerStore((s) => s.removeFromCart);
  const setNote = useCustomerStore((s) => s.setOrderNote);

  return (
    <section className="card">
      <h1>Cart</h1>
      {cart.length === 0 ? <p>Cart boş.</p> : null}
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} x {item.qty}
            <button onClick={() => remove(item.id)}>Kaldır</button>
            <input
              placeholder="Sipariş notu"
              value={item.note ?? ""}
              onChange={(e) => setNote(item.id, e.target.value)}
            />
          </li>
        ))}
      </ul>
      <Link href="/customer/checkout">Checkout</Link>
    </section>
  );
}
