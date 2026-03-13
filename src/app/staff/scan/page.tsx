"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { staffApi } from "@/shared/api/contracts/staff";

export default function StaffScanPage() {
  const router = useRouter();
  const [qrInput, setQrInput] = useState("table:T-12");
  const [resolvedTableId, setResolvedTableId] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [resolving, setResolving] = useState(false);

  const resolveQr = async () => {
    const qrRaw = qrInput.trim();
    if (!qrRaw) {
      setMessage("QR içeriği zorunludur.");
      setResolvedTableId(undefined);
      return;
    }

    setResolving(true);
    setMessage(undefined);

    try {
      const response = await staffApi.resolveQr({ qrRaw });
      const tableId = response.data.data.tableId;
      setResolvedTableId(tableId);
      setMessage(`Masa çözüldü: ${tableId}`);
    } catch {
      setResolvedTableId(undefined);
      setMessage("QR doğrulanamadı. Lütfen tekrar deneyin.");
    } finally {
      setResolving(false);
    }
  };

  return (
    <section className="card">
      <h1>QR Tarama</h1>
      <p>Mobil tarayıcıdan gelen QR raw değeri backend ile çözülür ve masa siparişi ekranına taşınır.</p>

      <label>
        QR Raw
        <input value={qrInput} onChange={(e) => setQrInput(e.target.value)} placeholder="Örn: table:T-12" />
      </label>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={() => void resolveQr()} disabled={resolving}>
          {resolving ? "Çözülüyor..." : "QR Çöz"}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/staff/table-orders?tableId=${encodeURIComponent(resolvedTableId ?? "")}`)}
          disabled={!resolvedTableId}
        >
          Masa Siparişi Aç
        </button>
      </div>

      {message ? <p>{message}</p> : null}
    </section>
  );
}
