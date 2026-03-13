import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DailySummaryPage from "./page";

describe("DailySummaryPage", () => {
  it("loads and renders daily metrics", async () => {
    render(<DailySummaryPage />);

    fireEvent.click(screen.getByRole("button", { name: "Günlük Özeti Getir" }));

    await screen.findByText("Brüt Ciro: ₺14.250,00");
    expect(screen.getByText("Sipariş Adedi: 83")).toBeInTheDocument();
    expect(screen.getByText("İptal Adedi: 2")).toBeInTheDocument();
    expect(screen.getByText("İptal Oranı: %2.4")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Stok Ekranını Aç" })).toHaveAttribute("href", "/staff/stock");
  });
});
