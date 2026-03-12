"use client";

import { useState } from "react";
import { staffApi } from "@/shared/api/contracts/staff";

export default function TableOrdersPage() {
  const [tableId, setTableId] = useState("t-12");
  const [productId, setProductId] = useState("p-1");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!tableId.trim()) {
      setMessage("Table is required.");
      return;
    }

    const qty = Number(quantity);
    if (!productId.trim() || !Number.isInteger(qty) || qty < 1) {
      setMessage("Product and quantity are required.");
      return;
    }

    setSubmitting(true);
    setMessage(undefined);

    try {
      const response = await staffApi.createTableOrder({
        tableId: tableId.trim(),
        items: [{ productId: productId.trim(), quantity: qty, note: note.trim() || undefined }],
      });
      setMessage(`Order created: ${response.data.data.orderId}`);
      setNote("");
    } catch {
      setMessage("Order creation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h1>Table Order Entry</h1>
      <label>
        Table Id
        <input value={tableId} onChange={(event) => setTableId(event.target.value)} />
      </label>
      <label>
        Product Id
        <input value={productId} onChange={(event) => setProductId(event.target.value)} />
      </label>
      <label>
        Quantity
        <input value={quantity} onChange={(event) => setQuantity(event.target.value)} />
      </label>
      <label>
        Note
        <input value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <button type="button" onClick={() => void submit()} disabled={submitting}>
        {submitting ? "Submitting..." : "Create Order"}
      </button>
      {message ? <p>{message}</p> : null}
    </section>
  );
}
