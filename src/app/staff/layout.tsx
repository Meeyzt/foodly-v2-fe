import { AppShell } from "@/features/app-shell/app-shell";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
