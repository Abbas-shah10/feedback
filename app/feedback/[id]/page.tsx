"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, MessageCircle, Save, Send, Trash2, ThumbsUp } from "lucide-react";

type CommentItem = {
  _id: string;
  body: string;
  createdAt: string;
  userId: { username?: string; email?: string } | string;
};

type FeedbackItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  comments?: CommentItem[];
  upvotes?: string[];
};

export default function FeedbackDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [item, setItem] = useState<FeedbackItem | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [voting, setVoting] = useState(false);

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

  async function postComment(event: React.FormEvent) {
    event.preventDefault();
    if (!comment.trim()) return;
    setPostingComment(true);
    setError("");
    const response = await fetch(`/api/feedback/${params.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: comment }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.message || "Unable to post comment");
    else {
      setItem((current) => current ? { ...current, comments: [...(current.comments || []), data.comment] } : current);
      setComment("");
    }
    setPostingComment(false);
  }

  async function toggleVote() {
    if (!item || voting) return;
    setVoting(true);
    const response = await fetch(`/api/feedback/${params.id}/vote`, { method: "POST" });
    if (response.ok) {
      const data = await response.json();
      setItem({ ...item, upvotes: data.hasVoted ? [...(item.upvotes || []), session?.user._id || "voted"] : (item.upvotes || []).filter((id) => id !== session?.user._id) });
    }
    setVoting(false);
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
          {item && (
            <div className="mt-8 border-t border-slate-200 pt-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <MessageCircle className="size-5 text-violet-600" /> Discussion
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{item.comments?.length || 0}</span>
                </h2>
                <button
                  type="button"
                  onClick={toggleVote}
                  disabled={voting}
                  className={`flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${item.upvotes?.includes(session?.user._id || "") ? "border-violet-200 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:border-violet-300"}`}
                >
                  <ThumbsUp className="size-4" /> {item.upvotes?.length || 0}
                </button>
              </div>
              <form onSubmit={postComment} className="flex gap-3">
                <input
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  maxLength={1000}
                  placeholder="Add a comment..."
                  className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
                <button disabled={postingComment || !comment.trim()} className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white hover:bg-violet-700 disabled:opacity-50" aria-label="Post comment">
                  <Send className="size-4" />
                </button>
              </form>
              <div className="mt-5 space-y-4">
                {item.comments?.length ? item.comments.map((entry) => {
                  const author = typeof entry.userId === "string" ? entry.userId : entry.userId?.username || entry.userId?.email || "User";
                  return (
                    <article key={entry._id} className="rounded-xl bg-slate-50 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-800">{author}</p>
                        <time className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString()}</time>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{entry.body}</p>
                    </article>
                  );
                }) : <p className="py-4 text-center text-sm text-slate-400">No comments yet. Start the conversation.</p>}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
