import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const payload = (await response.json()) as { error?: string; devResetUrl?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Demande impossible.");
      }

      setMessage(
        payload.devResetUrl
          ? `Lien de reinitialisation genere: ${payload.devResetUrl}`
          : "Si un compte existe, un email de reinitialisation vient d'etre envoye."
      );
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MainLayout>
      <Seo
        title="Mot de passe oublie"
        description="Recevez un lien de reinitialisation de mot de passe CavePlus."
        pathname="/auth/mot-de-passe-oublie"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="glass-card rounded-[28px] border border-mist p-6">
          <h1 className="font-display text-4xl text-ink">Mot de passe oublie</h1>
          <p className="mt-3 text-sm leading-6 text-charcoal/74">
            Saisissez votre email et nous vous enverrons un lien de reinitialisation.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <input
              className="h-12 rounded-xl border border-mist bg-white px-4"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {message ? <p className="text-sm text-success">{message}</p> : null}
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream disabled:opacity-60"
            >
              {isSubmitting ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>

          <p className="mt-6 text-sm text-charcoal/70">
            Retour a la <Link href="/auth/login" className="text-bordeaux">connexion</Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
