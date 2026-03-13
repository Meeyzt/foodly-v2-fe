"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { customerApi, type RestaurantDTO } from "@/shared/api/contracts/customer";

export default function ExplorePage() {
  const [restaurants, setRestaurants] = useState<RestaurantDTO[]>([]);
  const [nearby, setNearby] = useState(false);
  const [popular, setPopular] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const response = await customerApi.getExplore({
          nearby: nearby || undefined,
          popular: popular || undefined,
        });

        setRestaurants(response.data.data.items);
      } catch {
        setError("Explore listesi getirilemedi.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [nearby, popular]);

  const emptyMessage = useMemo(() => {
    if (nearby && popular) return "Yakınında ve popüler restoran bulunamadı.";
    if (nearby) return "Yakınında restoran bulunamadı.";
    if (popular) return "Popüler restoran bulunamadı.";
    return "Restoran bulunamadı.";
  }, [nearby, popular]);

  return (
    <section className="card">
      <h1>Explore</h1>
      <label>
        <input type="checkbox" checked={nearby} onChange={(e) => setNearby(e.target.checked)} /> Yakınındakiler
      </label>
      <label>
        <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} /> Popüler
      </label>

      {loading ? <p>Yükleniyor...</p> : null}
      {error ? <p>{error}</p> : null}

      {!loading && !error && restaurants.length === 0 ? <p>{emptyMessage}</p> : null}

      <ul>
        {restaurants.map((r) => (
          <li key={r.id}>
            <strong>{r.name}</strong> - {r.tags.join(", ")} <Link href={`/customer/restaurants/${r.id}`}>Menü</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
