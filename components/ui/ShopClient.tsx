"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BuyButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function buy() {
    setBusy(true);
    await fetch("/api/shop", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId }) });
    setBusy(false);
    router.refresh();
  }
  return <button className="game-button px-4 text-sm font-black" onClick={buy} disabled={busy}>{busy ? "Buying" : "Buy"}</button>;
}
