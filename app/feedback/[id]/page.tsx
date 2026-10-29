"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, MessageCircle, Save, Trash2 } from "lucide-react";

type FeedbackItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
};

export default function FeedbackDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [item, setItem] = useState<FeedbackItem | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch(`/api/feedback/${params.id}`)
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            (await response.json()).message || "Feedback not found",
          );
        setItem(await response.json());
      })
      .catch((error) => setError(error.message));
  }, [params.id, status]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!item) return;
    setSaving(true);
    setError("");
    const response = await fetch(`/api/feedback/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title,
        description: item.description,
        category: item.category,
        priority: item.priority,
        ...(session?.user.role === "admin" ? { status: item.status } : {}),
      }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.message || "Unable to save changes");
    else setItem(data.feedback);
    setSaving(false);
  }

  async function remove() {
    if (!confirm("Delete this feedback permanently?")) return;
    const response = await fetch(`/api/feedback/${params.id}`, {
      method: "DELETE",
    });
    if (response.ok) router.replace("/home");
    else
      setError((await response.json()).message || "Unable to delete feedback");
  }

  if (status === "loading")
    return <main className="min-h-screen bg-[#f8f9fb]" />;

  return (
    <main className="min-h-screen bg-[#f8f9fb] px-4 py-8 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/home"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"
        >
          <ArrowLeft className="size-4" /> Back to feedback
        </Link>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-white">
              <MessageCircle className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                Feedback details
              </p>
              <h1 className="text-xl font-bold">Edit feedback</h1>
            </div>
          </div>
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          {!item ? (
            !error && <p className="text-sm text-slate-500">Loading...</p>
          ) : (
            <form onSubmit={save} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Title
                </label>
                <input
                  value={item.title}
                  onChange={(event) =>
                    setItem({ ...item, title: event.target.value })
                  }
                  required
                  minLength={3}
                  maxLength={120}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>
                <textarea
                  value={item.description}
                  onChange={(event) =>
                    setItem({ ...item, description: event.target.value })
                  }
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={7}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Category
                  </label>
                  <select
                    value={item.category}
                    onChange={(event) =>
                      setItem({ ...item, category: event.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
                  >
                    <option value="bug">Bug</option>
                    <option value="feature">Feature</option>
                    <option value="improvement">Improvement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Priority
                  </label>
                  <select
                    value={item.priority}
                    onChange={(event) =>
                      setItem({ ...item, priority: event.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                {session?.user.role === "admin" && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Status
                    </label>
                    <select
                      value={item.status}
                      onChange={(event) =>
                        setItem({ ...item, status: event.target.value })
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={remove}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="size-4" /> Delete
                </button>
                <button
                  disabled={saving}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  <Save className="size-4" />{" "}
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
