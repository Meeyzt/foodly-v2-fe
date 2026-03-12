"use client";

import { useEffect } from "react";
import { enableApiMocking } from "@/shared/api/mock-adapter";

export function MockProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void enableApiMocking();
  }, []);

  return <>{children}</>;
}
