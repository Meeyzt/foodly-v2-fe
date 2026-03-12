"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCustomerStore } from "@/features/customer/store";

export default function CheckoutPage() {
  const cart = useCustomerStore((s) => s.cart);
  const tableId = useCustomerStore((s) => s.tableId);
  const setTableId = useCustomerStore((s) => s.setTableId);

  const total = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.qty, 0), [cart]);

  return (
    <section className="card">
      <h1>Checkout</h1>
      <p>Same-table multi-order UX: mevcut masa siparişine ekleme.</p>
      <label>
        Table ID
        <input value={tableId} onChange={(e) => setTableId(e.target.value)} />
      </label>
      <p>Total: {total}₺</p>
      <button disabled={cart.length === 0}>Place / Merge Order</button>
      <p>
        Sipariş sonrası <Link href="/customer/orders">Order History</Link>
      </p>
    </section>
  );
}
