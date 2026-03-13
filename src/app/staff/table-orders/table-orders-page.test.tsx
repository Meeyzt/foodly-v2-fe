import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TableOrdersPage from "./page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "tableId" ? "t-77" : null),
  }),
}));

describe("TableOrdersPage", () => {
  it("prefills table id from qr context, appends line and closes check", async () => {
    render(<TableOrdersPage />);

    expect(await screen.findByDisplayValue("t-77")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Ürün Id"), { target: { value: "p-9" } });
    fireEvent.change(screen.getByLabelText("Adet"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Sipariş Satırı Ekle" }));

    expect(await screen.findByRole("heading", { name: /Açık Sipariş/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Adisyon Oluştur" }));
    expect(await screen.findByRole("heading", { name: /Adisyon/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Adisyonu Tahsil Et ve Kapat" }));
    expect(await screen.findByText("Adisyon kapatıldı. Masa tahsil edildi.")).toBeInTheDocument();
    expect(await screen.findByText("Durum: ÖDENDİ")).toBeInTheDocument();
  });
});
