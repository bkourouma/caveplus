import { useState } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

type ResetPasswordPageProps = {
  email: string;
  token: string;
};

export const getServerSideProps: GetServerSideProps<ResetPasswordPageProps> = async (context) => {
  const email = typeof context.query.email === "string" ? context.query.email : "";
  const token = typeof context.query.token === "string" ? context.query.token : "";

  return {
    props: {
      email,
      token
    }
  };
};

export default function ResetPasswordPage({
  email,
  token
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          token,
          password
        })
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Reinitialisation impossible.");
      }

      setMessage("Mot de passe mis a jour. Connexion en cours...");

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (signInResult && !signInResult.error) {
        await router.push("/compte");
        return;
      }

      await router.push("/auth/login");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Une erreur est survenue.");
      setIsSubmitting(false);
    }
  }

  return (
    <MainLayout>
      <Seo
        title="Reinitialisation du mot de passe"
        description="Choisissez un nouveau mot de passe CavePlus."
        pathname="/auth/reinitialisation"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="glass-card rounded-[28px] border border-mist p-6">
          <h1 className="font-display text-4xl text-ink">Nouveau mot de passe</h1>
          <p className="mt-3 text-sm leading-6 text-charcoal/74">{email || "Lien incomplet."}</p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <input
              className="h-12 rounded-xl border border-mist bg-white px-4"
              placeholder="Nouveau mot de passe"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <input
              className="h-12 rounded-xl border border-mist bg-white px-4"
              placeholder="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {message ? <p className="text-sm text-success">{message}</p> : null}
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting || !email || !token}
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink disabled:opacity-60"
            >
              {isSubmitting ? "Validation..." : "Mettre a jour le mot de passe"}
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
