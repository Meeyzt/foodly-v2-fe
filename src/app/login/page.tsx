"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setSession } from "@/features/auth/session";
import { allRoles, roleHome, type UserRole } from "@/shared/auth/roles";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("Customer");
  const router = useRouter();

  return (
    <section className="card">
      <h1>Foodly Login (MVP mock)</h1>
      <p>Role seçimi sprint-1 boyunca mock authentication ile ilerler.</p>
      <label>
        Role
        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
          {allRoles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={() => {
          setSession("mock-token", role);
          router.push(roleHome[role]);
        }}
      >
        Continue as {role}
      </button>
    </section>
  );
}
