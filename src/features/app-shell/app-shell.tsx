"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, getRoleFromSession } from "@/features/auth/session";
import type { UserRole } from "@/shared/auth/roles";

type NavItem = { href: string; label: string };

const navByRole: Record<UserRole, NavItem[]> = {
  Customer: [
    { href: "/customer/explore", label: "Explore" },
    { href: "/customer/cart", label: "Cart" },
    { href: "/customer/orders", label: "Orders" },
  ],
  Staff: [
    { href: "/staff/scan", label: "QR Scan" },
    { href: "/staff/table-orders", label: "Table Orders" },
    { href: "/staff/daily-summary", label: "Daily Summary" },
  ],
  BranchManager: [
    { href: "/manager/menu", label: "Menu" },
    { href: "/manager/categories", label: "Categories" },
    { href: "/manager/products", label: "Products" },
  ],
  BusinessAdmin: [
    { href: "/manager/branches", label: "Branches" },
    { href: "/manager/menu", label: "Menu" },
    { href: "/manager/products", label: "Products" },
  ],
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const role = getRoleFromSession() ?? "Customer";
  const navItems = navByRole[role];
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="shell">
      <aside className="sidebar">
        <h3>Foodly v2</h3>
        <small>{role}</small>
        <nav>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            clearSession();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </aside>
      <section className="content">{children}</section>
    </div>
  );
}
