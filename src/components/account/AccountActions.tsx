"use client";

import { signOut } from "next-auth/react";

export function AccountActions() {
  return (
    <button
      type="button"
      onClick={() => void signOut({ callbackUrl: "/" })}
      className="rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink"
    >
      Se deconnecter
    </button>
  );
}
