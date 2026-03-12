"use client";

import { useState } from "react";

export default function StaffScanPage() {
  const [qrInput, setQrInput] = useState("table:T-12");

  return (
    <section className="card">
      <h1>QR Scan (mockable)</h1>
      <p>Device scan yerine sprint-1 mock input kullanılır.</p>
      <input value={qrInput} onChange={(e) => setQrInput(e.target.value)} />
      <button>Start Table Session</button>
    </section>
  );
}
