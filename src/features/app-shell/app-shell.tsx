"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, getRoleFromSession } from "@/features/auth/session";
import { useCustomerStore } from "@/features/customer/store";
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
    { href: "/manager/categories", label: "Categories" },
    { href: "/manager/products", label: "Products" },
  ],
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const role = getRoleFromSession() ?? "Customer";
  const navItems = navByRole[role];
  const pathname = usePathname();
  const router = useRouter();
  const tableId = useCustomerStore((s) => s.tableId);
  const activeTableOrder = useCustomerStore((s) => s.activeTableOrder);

  return (
    <div className="shell">
      <aside className="sidebar">
        <h3>Foodly v2</h3>
        <small>{role}</small>
        {role === "Customer" ? (
          <div style={{ margin: "8px 0", fontSize: 12 }}>
            <div>Masa: {tableId}</div>
            {activeTableOrder ? <div>Aktif sipariş: {activeTableOrder.id}</div> : <div>Aktif sipariş yok</div>}
          </div>
        ) : null}
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
