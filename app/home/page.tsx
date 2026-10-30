"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { ArrowRight, LogOut, MessageCircle, Plus, Search, ThumbsUp } from "lucide-react";

type FeedbackItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  comments?: unknown[];
  upvotes?: string[];
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "feature",
    priority: "medium",
  });

  async function loadFeedback() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    const response = await fetch(`/api/feedback?${params}`);
    if (response.ok) setItems((await response.json()).items);
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") loadFeedback();
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  async function createFeedback(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Unable to create feedback");
    } else {
      setForm({
        title: "",
        description: "",
        category: "feature",
        priority: "medium",
      });
      await loadFeedback();
    }
    setSubmitting(false);
  }

  if (status === "loading")
    return <main className="min-h-screen bg-[#f8f9fb]" />;
  if (status !== "authenticated") {
    if (typeof window !== "undefined") window.location.replace("/sign-in");
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/home" className="flex items-center gap-2 font-bold">
            <span className="flex size-9 items-center justify-center rounded-lg bg-slate-950 text-white">
              <MessageCircle className="size-4" />
            </span>
            Feedback
          </Link>
          <div className="flex items-center gap-3">
            {session.user.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-violet-700"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Plus className="size-5 text-violet-600" />
            <h1 className="text-xl font-bold">Submit feedback</h1>
          </div>
          <form onSubmit={createFeedback} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">Title</label>
              <input
                required
                minLength={3}
                maxLength={120}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                placeholder="Brief summary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                placeholder="Explain the feedback in detail"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
                >
                  <option value="feature">Feature</option>
                  <option value="bug">Bug</option>
                  <option value="improvement">Improvement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <button
              disabled={submitting}
              className="h-11 w-full rounded-xl bg-slate-950 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit feedback"}
            </button>
          </form>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-bold">Your feedback</h1>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadFeedback()}
                  placeholder="Search"
                  className="h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-violet-500"
                />
              </div>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">All</option>
                <option value="bug">Bugs</option>
                <option value="feature">Features</option>
                <option value="improvement">Improvements</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              No feedback found.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <Link
                  key={item._id}
                  href={`/feedback/${item._id}`}
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-bold group-hover:text-violet-700">
                        {item.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-slate-300 group-hover:text-violet-600" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {item.category}
                    </span>
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                      {item.status}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      {item.priority}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-slate-400">
                      <ThumbsUp className="size-3.5" /> {item.upvotes?.length || 0}
                      <MessageCircle className="ml-2 size-3.5" /> {item.comments?.length || 0}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
