"use client";

import { canCrudMenu } from "@/features/manager/permissions";

export default function CategoriesPage() {
  const allowed = canCrudMenu();
  return (
    <section className="card">
      <h1>Category CRUD Layout</h1>
      <button disabled={!allowed}>New Category</button>
    </section>
  );
}
