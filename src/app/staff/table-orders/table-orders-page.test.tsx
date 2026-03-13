import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TableOrdersPage from "./page";

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "tableId" ? "t-77" : null),
  }),
}));

describe("TableOrdersPage", () => {
  it("prefills table id from qr context and submits order", async () => {
    render(<TableOrdersPage />);

    expect(await screen.findByDisplayValue("t-77")).toBeInTheDocument();
    expect(screen.getByText("Tarama ile masa seçildi: t-77")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Ürün Id"), { target: { value: "p-9" } });
    fireEvent.change(screen.getByLabelText("Adet"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Sipariş Oluştur" }));

    expect(await screen.findByText("Sipariş oluşturuldu: ord-staff-contract-1")).toBeInTheDocument();
  });
});
