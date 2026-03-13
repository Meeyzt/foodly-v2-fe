"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { staffApi } from "@/shared/api/contracts/staff";

function TableOrdersContent() {
  const searchParams = useSearchParams();

  const [tableId, setTableId] = useState("t-12");
  const [productId, setProductId] = useState("p-1");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const scannedTableId = searchParams.get("tableId");
    if (scannedTableId) {
      setTableId(scannedTableId);
      setMessage(`Tarama ile masa seçildi: ${scannedTableId}`);
    }
  }, [searchParams]);

  const submit = async () => {
    if (!tableId.trim()) {
      setMessage("Masa bilgisi zorunludur.");
      return;
    }

    const qty = Number(quantity);
    if (!productId.trim() || !Number.isInteger(qty) || qty < 1) {
      setMessage("Ürün ve adet bilgisi geçerli olmalı.");
      return;
    }

    setSubmitting(true);
    setMessage(undefined);

    try {
      const response = await staffApi.createTableOrder({
        tableId: tableId.trim(),
        items: [{ productId: productId.trim(), quantity: qty, note: note.trim() || undefined }],
      });
      setMessage(`Sipariş oluşturuldu: ${response.data.data.orderId}`);
      setNote("");
    } catch {
      setMessage("Sipariş oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h1>Masa Siparişi Girişi</h1>
      <p>QR ile çözümlenen masa için sipariş satırı oluşturulur.</p>

      <label>
        Masa Id
        <input value={tableId} onChange={(event) => setTableId(event.target.value)} />
      </label>
      <label>
        Ürün Id
        <input value={productId} onChange={(event) => setProductId(event.target.value)} />
      </label>
      <label>
        Adet
        <input value={quantity} onChange={(event) => setQuantity(event.target.value)} />
      </label>
      <label>
        Not
        <input value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <button type="button" onClick={() => void submit()} disabled={submitting}>
        {submitting ? "Gönderiliyor..." : "Sipariş Oluştur"}
      </button>
      {message ? <p>{message}</p> : null}
    </section>
  );
}

export default function TableOrdersPage() {
  return (
    <Suspense fallback={<section className="card">Yükleniyor...</section>}>
      <TableOrdersContent />
    </Suspense>
  );
}
