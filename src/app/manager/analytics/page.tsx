"use client";

import { useMemo, useState } from "react";
import { managerApi, type BusinessAnalyticsSummary } from "@/shared/api/contracts/manager";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }).format(amount);
}

function formatPercent(value: number) {
  return `%${value.toFixed(1)}`;
}

function toIsoDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function getDefaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 6);

  return { from: toIsoDate(from), to: toIsoDate(to) };
}

export default function ManagerAnalyticsPage() {
  const [branchId, setBranchId] = useState("b-1");
  const defaultRange = getDefaultRange();
  const [from, setFrom] = useState(defaultRange.from);
  const [to, setTo] = useState(defaultRange.to);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  const [summary, setSummary] = useState<BusinessAnalyticsSummary>();

  const cancelRate = useMemo(() => {
    if (!summary || summary.orderCount === 0) return 0;
    return (summary.cancelCount / summary.orderCount) * 100;
  }, [summary]);

  const loadDashboard = async () => {
    if (!branchId.trim() || !from.trim() || !to.trim()) {
      setMessage("Şube ve tarih aralığı zorunludur.");
      return;
    }

    setLoading(true);
    setMessage(undefined);

    try {
      const response = await managerApi.getBusinessAnalytics({
        branchId: branchId.trim(),
        from: from.trim(),
        to: to.trim(),
      });
      setSummary(response.data.data);
      setMessage("Analitik metrikler yüklendi.");
    } catch {
      setSummary(undefined);
      setMessage("Analitik metrikler alınamadı. Endpoint/contract doğrulaması gerekli.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h1>İşletme Analitik Dashboard</h1>
      <p>Şube bazında ciro, sipariş ve iptal performansını takip edin.</p>

      <label>
        Şube Id
        <input value={branchId} onChange={(event) => setBranchId(event.target.value)} />
      </label>
      <label>
        Başlangıç
        <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
      </label>
      <label>
        Bitiş
        <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
      </label>

      <button type="button" onClick={() => void loadDashboard()} disabled={loading}>
        {loading ? "Yükleniyor..." : "Metrikleri Getir"}
      </button>

      {summary ? (
        <article aria-label="İşletme Analitik Metrikleri" style={{ marginTop: 16 }}>
          <p>Brüt Ciro: {formatCurrency(summary.grossRevenue)}</p>
          <p>Sipariş Adedi: {summary.orderCount}</p>
          <p>Ortalama Sepet: {formatCurrency(summary.avgBasket)}</p>
          <p>İptal Oranı: {formatPercent(cancelRate)}</p>

          <h2 style={{ marginTop: 16 }}>En Çok Satan Ürünler</h2>
          <ul>
            {summary.topProducts.map((item) => (
              <li key={item.productId}>
                {item.productName} — {item.quantity} adet — {formatCurrency(item.revenue)}
              </li>
            ))}
          </ul>
        </article>
      ) : null}

      {message ? <p>{message}</p> : null}
    </section>
  );
}
