"use client";

import { canCrudMenu } from "@/features/manager/permissions";

export default function ManagerMenuPage() {
  const allowed = canCrudMenu();

  return (
    <section className="card">
      <h1>Menu CRUD Layout</h1>
      <p>Liste + create/edit drawer pattern sprint-2’de işlenecek.</p>
      <button disabled={!allowed}>Create Menu</button>
    </section>
  );
}
