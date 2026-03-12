"use client";

import Link from "next/link";
import { useState } from "react";
import { useCustomerStore } from "@/features/customer/store";

export default function ExplorePage() {
  const restaurants = useCustomerStore((s) => s.restaurants);
  const [nearby, setNearby] = useState(false);
  const [popular, setPopular] = useState(false);

  const filtered = restaurants.filter((r) => (!nearby || r.nearby) && (!popular || r.popular));

  return (
    <section className="card">
      <h1>Explore</h1>
      <label><input type="checkbox" checked={nearby} onChange={(e) => setNearby(e.target.checked)} /> Nearby</label>
      <label><input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} /> Popular</label>
      <ul>
        {filtered.map((r) => (
          <li key={r.id}>
            <strong>{r.name}</strong> - {r.tags.join(", ")} <Link href={`/customer/restaurants/${r.id}`}>Menü</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
