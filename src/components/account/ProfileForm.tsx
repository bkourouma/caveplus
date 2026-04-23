"use client";

import { useState } from "react";
import type { AccountProfile } from "@/lib/server/account";

type ProfileFormProps = {
  initialProfile: AccountProfile;
};

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [name, setName] = useState(initialProfile.name);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [whatsappOptIn, setWhatsappOptIn] = useState(initialProfile.whatsappOptIn);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          phone,
          whatsappOptIn
        })
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Impossible de mettre a jour le profil.");
      }

      setMessage("Profil mis a jour.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Une erreur est survenue.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
      <input
        className="h-12 rounded-xl border border-mist bg-white px-4"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <input className="h-12 rounded-xl border border-mist bg-white px-4" value={initialProfile.email} readOnly />
      <input
        className="h-12 rounded-xl border border-mist bg-white px-4"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="+225..."
      />
      <label className="flex items-center gap-3 text-sm text-charcoal">
        <input
          type="checkbox"
          checked={whatsappOptIn}
          onChange={(event) => setWhatsappOptIn(event.target.checked)}
          className="h-4 w-4"
        />
        Recevoir les confirmations et offres WhatsApp
      </label>
      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <button
        type="submit"
        disabled={isSaving}
        className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream disabled:opacity-60"
      >
        {isSaving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
