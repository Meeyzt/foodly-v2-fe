"use client";

import { useState } from "react";
import { staffApi, type StockItem } from "@/shared/api/contracts/staff";

function statusLabel(status: StockItem["status"]) {
  if (status === "OUT") return "Tükendi";
  if (status === "LOW") return "Kritik";
  return "Yeterli";
}

export default function StaffStockPage() {
  const [branchId, setBranchId] = useState("b-1");
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();

  const loadStock = async () => {
    if (!branchId.trim()) {
      setMessage("Şube bilgisi zorunludur.");
      return;
    }

    setLoading(true);
    setMessage(undefined);

    try {
      const response = await staffApi.getStockOverview(branchId.trim());
      setItems(response.data.data.items);
      setMessage("Stok durumu güncellendi.");
    } catch {
      setItems([]);
      setMessage("Stok verisi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h1>Stok Ekranı</h1>
      <p>Kritik ürünleri hızlıca tespit edip mutfak/tedarik ekibine aktarın.</p>

      <label>
        Şube Id
        <input value={branchId} onChange={(event) => setBranchId(event.target.value)} />
      </label>

      <button type="button" onClick={() => void loadStock()} disabled={loading}>
        {loading ? "Yükleniyor..." : "Stok Durumunu Getir"}
      </button>

      {items.length > 0 ? (
        <ul aria-label="Stok Listesi" style={{ marginTop: 16 }}>
          {items.map((item) => (
            <li key={item.productId}>
              {item.productName} ({item.productId}) • {item.currentStock} {item.unit} / Min: {item.minThreshold} • {statusLabel(item.status)}
            </li>
          ))}
        </ul>
      ) : null}

      {message ? <p>{message}</p> : null}
    </section>
  );
}
