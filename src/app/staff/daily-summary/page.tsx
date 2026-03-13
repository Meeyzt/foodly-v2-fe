"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { staffApi, type DailySummary } from "@/shared/api/contracts/staff";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }).format(amount);
}

function toIsoDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function DailySummaryPage() {
  const [branchId, setBranchId] = useState("b-1");
  const [day, setDay] = useState(toIsoDate(new Date()));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  const [summary, setSummary] = useState<DailySummary>();

  const cancelRate = useMemo(() => {
    if (!summary || summary.orderCount === 0) return 0;
    return (summary.cancelCount / summary.orderCount) * 100;
  }, [summary]);

  const loadSummary = async () => {
    if (!branchId.trim() || !day.trim()) {
      setMessage("Şube ve tarih bilgisi zorunludur.");
      return;
    }

    setLoading(true);
    setMessage(undefined);

    try {
      const response = await staffApi.getDailySummary(branchId.trim(), day.trim());
      setSummary(response.data.data);
      setMessage("Günlük özet başarıyla yüklendi.");
    } catch {
      setSummary(undefined);
      setMessage("Günlük özet alınamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h1>Günlük Özet</h1>
      <p>Vardiya kapanış öncesi adet/ciro/iptal metriklerini takip edin.</p>

      <label>
        Şube Id
        <input value={branchId} onChange={(event) => setBranchId(event.target.value)} />
      </label>
      <label>
        Gün
        <input type="date" value={day} onChange={(event) => setDay(event.target.value)} />
      </label>

      <button type="button" onClick={() => void loadSummary()} disabled={loading}>
        {loading ? "Yükleniyor..." : "Günlük Özeti Getir"}
      </button>

      {summary ? (
        <article aria-label="Günlük Özet Metrikleri" style={{ marginTop: 16 }}>
          <p>Brüt Ciro: {formatPrice(summary.gross)}</p>
          <p>Sipariş Adedi: {summary.orderCount}</p>
          <p>İptal Adedi: {summary.cancelCount}</p>
          <p>İptal Oranı: %{cancelRate.toFixed(1)}</p>
        </article>
      ) : null}

      <hr style={{ margin: "16px 0" }} />

      <p>Stok durumunu kontrol etmek için stok ekranına geçin.</p>
      <Link href="/staff/stock">Stok Ekranını Aç</Link>

      {message ? <p>{message}</p> : null}
    </section>
  );
}
