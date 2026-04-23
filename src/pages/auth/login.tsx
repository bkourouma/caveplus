import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

export default function LoginPage() {
  const router = useRouter();
  const callbackUrl = typeof router.query.callbackUrl === "string" ? router.query.callbackUrl : "/compte";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCredentialsLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });

    if (!result || result.error) {
      setError("Connexion impossible. Verifiez votre email et votre mot de passe.");
      setIsSubmitting(false);
      return;
    }

    await fetch("/api/cart/merge", {
      method: "POST"
    });

    await router.push(result.url ?? callbackUrl);
  }

  async function handleGoogleLogin() {
    await signIn("google", {
      callbackUrl
    });
  }

  return (
    <MainLayout>
      <Seo
        title="Connexion"
        description="Connectez-vous a CavePlus avec Google ou email."
        pathname="/auth/login"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="glass-card rounded-[28px] border border-mist p-6">
          <h1 className="font-display text-4xl text-ink">Connexion</h1>
          <form className="mt-6 grid gap-4" onSubmit={handleCredentialsLogin}>
            <input
              className="h-12 rounded-xl border border-mist bg-white px-4"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              className="h-12 rounded-xl border border-mist bg-white px-4"
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream disabled:opacity-60"
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="rounded-full border border-mist bg-white px-6 py-3 text-sm font-semibold text-ink"
            >
              Continuer avec Google
            </button>
          </form>
          <p className="mt-6 text-sm text-charcoal/70">
            <Link href="/auth/mot-de-passe-oublie" className="text-bordeaux">Mot de passe oublie ?</Link>
          </p>
          <p className="mt-3 text-sm text-charcoal/70">
            Pas encore de compte ? <Link href="/auth/inscription" className="text-bordeaux">Inscription</Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
