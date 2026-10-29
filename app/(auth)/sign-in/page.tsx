"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, MessageCircle } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email/username or password. Please try again.");
      } else {
        router.replace("/home");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return <main className="min-h-screen bg-[#f8f9fb]" />;
  }

  if (session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f9fb] px-4">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <MessageCircle className="size-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-950">You&apos;re signed in</h1>
          <p className="mt-2 text-sm text-slate-500">{session.user?.email}</p>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="mt-6 h-12 w-full rounded-xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f9fb] px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute left-[8%] top-[12%] size-72 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[8%] right-[6%] size-80 rounded-full bg-blue-200/30 blur-3xl" />

      <section className="relative w-full max-w-110 rounded-[28px] border border-slate-200/80 bg-white px-6 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:px-10 sm:py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
            <MessageCircle className="size-5" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-950">Feedback</span>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Sign in to your account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Enter your details to continue to your feedback dashboard.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="mb-2 block text-sm font-semibold text-slate-800">
              Email or username
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-semibold text-slate-800">
                Password
              </label>
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-11 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
            {!isLoading && <ArrowRight className="size-4" />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-violet-700 transition hover:text-violet-900">
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}
