"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCustomerStore } from "@/features/customer/store";

export default function RestaurantDetailPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const restaurant = useCustomerStore((s) => s.restaurants.find((r) => r.id === restaurantId));
  const addToCart = useCustomerStore((s) => s.addToCart);

  if (!restaurant) return <section className="card">Restaurant bulunamadı.</section>;

  return (
    <section className="card">
      <h1>{restaurant.name} Menü</h1>
      <ul>
        {restaurant.products.map((p) => (
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
