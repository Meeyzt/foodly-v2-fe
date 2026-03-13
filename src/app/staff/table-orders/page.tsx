"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { staffApi, type TableCheckDetail, type TableOrderDetail } from "@/shared/api/contracts/staff";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }).format(amount);
}

function TableOrdersContent() {
  const searchParams = useSearchParams();
  const scannedTableId = searchParams.get("tableId");

  const [tableId, setTableId] = useState("t-12");
  const [productId, setProductId] = useState("p-1");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string>();
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatingCheck, setGeneratingCheck] = useState(false);
  const [closingCheck, setClosingCheck] = useState(false);
  const [order, setOrder] = useState<TableOrderDetail>();
  const [check, setCheck] = useState<TableCheckDetail>();

  useEffect(() => {
    if (scannedTableId) {
      setTableId(scannedTableId);
      setMessage(`Tarama ile masa seçildi: ${scannedTableId}`);
    }
  }, [scannedTableId]);

  const loadOrder = async (targetTableId: string) => {
    if (!targetTableId.trim()) {
      setMessage("Masa bilgisi zorunludur.");
      return;
    }

    setLoadingOrder(true);
    try {
      const response = await staffApi.getTableOrder(targetTableId.trim());
      setOrder(response.data.data);
      if (check && check.tableId !== targetTableId.trim()) {
        setCheck(undefined);
      }
      setMessage(`Açık masa siparişi yüklendi: ${response.data.data.orderId}`);
    } catch {
      setOrder(undefined);
      setCheck(undefined);
      setMessage("Bu masa için açık sipariş bulunamadı. Yeni satır ekleyebilirsiniz.");
    } finally {
      setLoadingOrder(false);
    }
  };

  const addOrderLine = async () => {
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
      await loadOrder(tableId.trim());
      setMessage(`Sipariş satırı eklendi. Aktif sipariş: ${response.data.data.orderId}`);
      setNote("");
      setQuantity("1");
    } catch {
      setMessage("Sipariş satırı eklenemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  const generateCheck = async () => {
    if (!tableId.trim()) {
      setMessage("Adisyon için masa seçin.");
      return;
    }

    setGeneratingCheck(true);
    try {
      const response = await staffApi.getTableCheck(tableId.trim());
      setCheck(response.data.data);
      setMessage(`Adisyon hazırlandı: ${response.data.data.orderId}`);
    } catch {
      setMessage("Adisyon oluşturulamadı. Önce açık sipariş olmalı.");
    } finally {
      setGeneratingCheck(false);
    }
  };

  const closeCheck = async () => {
    if (!tableId.trim()) {
      setMessage("Tahsilat için masa seçin.");
      return;
    }

    setClosingCheck(true);
    try {
      await staffApi.closeTableCheck(tableId.trim(), { paymentMethod: "CARD" });
      const latestCheck = await staffApi.getTableCheck(tableId.trim());
      setCheck(latestCheck.data.data);
      await loadOrder(tableId.trim());
      setMessage("Adisyon kapatıldı. Masa tahsil edildi.");
    } catch {
      setMessage("Adisyon kapatılamadı.");
    } finally {
      setClosingCheck(false);
    }
  };

  return (
    <section className="card">
      <h1>Masa Bazlı Sipariş Yönetimi</h1>
      <p>Garson, masa için satır ekler; açık siparişi görür; adisyon üretir ve tahsilatla kapatır.</p>

      <label>
        Masa Id
        <input value={tableId} onChange={(event) => setTableId(event.target.value)} />
      </label>
      <button type="button" onClick={() => void loadOrder(tableId)} disabled={loadingOrder}>
        {loadingOrder ? "Yükleniyor..." : "Açık Siparişi Getir"}
      </button>

      <hr style={{ margin: "16px 0" }} />

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
      <button type="button" onClick={() => void addOrderLine()} disabled={submitting}>
        {submitting ? "Ekleniyor..." : "Sipariş Satırı Ekle"}
      </button>

      {order ? (
        <article aria-label="Açık Sipariş Özeti" style={{ marginTop: 16 }}>
          <h2>Açık Sipariş • {order.orderId}</h2>
          <p>
            Durum: {order.status} • Kalem: {order.itemCount} • Tutar: {formatPrice(order.total)}
          </p>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.productName} ({item.productId}) x {item.quantity} = {formatPrice(item.quantity * item.unitPrice)}
                {item.note ? ` • Not: ${item.note}` : ""}
              </li>
            ))}
          </ul>
        </article>
      ) : null}

      <hr style={{ margin: "16px 0" }} />

      <button type="button" onClick={() => void generateCheck()} disabled={generatingCheck}>
        {generatingCheck ? "Hazırlanıyor..." : "Adisyon Oluştur"}
      </button>
      <button type="button" onClick={() => void closeCheck()} disabled={closingCheck || !check || check.status === "PAID"}>
        {closingCheck ? "Kapatılıyor..." : "Adisyonu Tahsil Et ve Kapat"}
      </button>

      {check ? (
        <article aria-label="Adisyon Özeti" style={{ marginTop: 16 }}>
          <h2>Adisyon • {check.orderId}</h2>
          <p>Masa: {check.tableId}</p>
          <p>Ara Toplam: {formatPrice(check.subtotal)}</p>
          <p>Servis Bedeli: {formatPrice(check.serviceCharge)}</p>
          <p>Toplam: {formatPrice(check.total)}</p>
          <p>Durum: {check.status === "PAID" ? "ÖDENDİ" : "AÇIK"}</p>
        </article>
      ) : null}

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
