import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ManagerAnalyticsPage from "./page";

describe("ManagerAnalyticsPage", () => {
  it("loads and renders dashboard metrics", async () => {
    render(<ManagerAnalyticsPage />);

    fireEvent.click(screen.getByRole("button", { name: "Metrikleri Getir" }));

    await screen.findByText("Brüt Ciro: ₺128.450,00");
    expect(screen.getByText("Sipariş Adedi: 426")).toBeInTheDocument();
    expect(screen.getByText("Ortalama Sepet: ₺301,53")).toBeInTheDocument();
    expect(screen.getByText("İptal Oranı: %2.6")).toBeInTheDocument();
    expect(screen.getByText(/Classic Burger — 138 adet — ₺44.160,00/)).toBeInTheDocument();
  });
});
