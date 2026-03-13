"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCustomerStore } from "@/features/customer/store";
import { customerApi, type ProductDTO, type RestaurantDTO } from "@/shared/api/contracts/customer";

export default function RestaurantDetailPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const addToCart = useCustomerStore((s) => s.addToCart);

  const [restaurant, setRestaurant] = useState<RestaurantDTO>();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const response = await customerApi.getRestaurantMenu(restaurantId);
        setRestaurant(response.data.data.restaurant);
        setProducts(response.data.data.products);
      } catch {
        setError("Restaurant menüsü getirilemedi.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [restaurantId]);

  if (loading) return <section className="card">Yükleniyor...</section>;
  if (error) return <section className="card">{error}</section>;
  if (!restaurant) return <section className="card">Restaurant bulunamadı.</section>;

  return (
    <section className="card">
      <h1>{restaurant.name} Menü</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> ({p.price}₺) - {p.description}
            <button onClick={() => addToCart(p)}>Sepete Ekle</button>
          </li>
        ))}
      </ul>
      <Link href="/customer/cart">Cart’a Git</Link>
    </section>
  );
}
