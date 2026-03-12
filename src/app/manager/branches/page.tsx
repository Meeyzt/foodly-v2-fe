"use client";

import { canManageBranches } from "@/features/manager/permissions";

export default function BranchesPage() {
  const allowed = canManageBranches();

  return (
    <section className="card">
      <h1>Branch Selector</h1>
      <select>
        <option>Beşiktaş</option>
        <option>Kadıköy</option>
      </select>
      <button disabled={!allowed}>Add Branch</button>
      {!allowed ? <p>Bu aksiyon yalnızca BusinessAdmin için açık.</p> : null}
    </section>
  );
}
