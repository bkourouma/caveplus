import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { Seo } from "@/components/layout/Seo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const registerPayload = (await registerResponse.json()) as { error?: string };

      if (!registerResponse.ok) {
        throw new Error(registerPayload.error ?? "Inscription impossible.");
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (!signInResult || signInResult.error) {
        throw new Error("Compte cree, mais la connexion automatique a echoue.");
      }

      await fetch("/api/cart/merge", {
        method: "POST"
      });

      await router.push("/compte");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Une erreur est survenue.");
      setIsSubmitting(false);
    }
  }

  return (
    <MainLayout>
      <Seo
        title="Inscription"
        description="Creez votre compte CavePlus pour acheter plus vite et suivre vos commandes."
        pathname="/auth/inscription"
        robots="noindex,nofollow"
      />

      <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="glass-card rounded-[28px] border border-mist p-6">
          <h1 className="font-display text-4xl text-ink">Inscription</h1>
          <form className="mt-6 grid gap-4" onSubmit={handleRegister}>
            <input
              className="h-12 rounded-xl border border-mist bg-white px-4"
              placeholder="Nom complet"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
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
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink disabled:opacity-60"
            >
              {isSubmitting ? "Creation..." : "Creer mon compte"}
            </button>
          </form>
          <p className="mt-6 text-sm text-charcoal/70">
            Deja client ? <Link href="/auth/login" className="text-bordeaux">Connexion</Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
