"use client";

import { canCrudMenu } from "@/features/manager/permissions";

export default function ProductsPage() {
  const allowed = canCrudMenu();
  return (
    <section className="card">
      <h1>Product CRUD Layout</h1>
      <button disabled={!allowed}>New Product</button>
    </section>
  );
}
