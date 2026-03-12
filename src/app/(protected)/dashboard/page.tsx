"use client";

import { useAuthStore } from "@/features/auth/model/auth.store";

export default function DashboardPage() {
  const { user, clearSession } = useAuthStore();

  return (
    <section className="card">
      <h1>Dashboard</h1>
      <p>Welcome {user?.name ?? "Foodly user"}.</p>
      <button onClick={clearSession}>Logout</button>
    </section>
  );
}
