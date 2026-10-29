"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Search,
} from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  async function loadFeedback() {
    const params = new URLSearchParams({
      page: String(page),
      limit: "8",
      sort: "newest",
    });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (category) params.set("category", category);
    const response = await fetch(`/api/feedback?${params}`);
    if (response.ok) {
      const data = await response.json();
      setItems(data.items);
      setPages(data.pages || 1);
    }
  }

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/admin/stats")
      .then((response) => response.ok && response.json())
      .then(setStats);
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") loadFeedback();
  }, [status, page, statusFilter, category]); // eslint-disable-line react-hooks/exhaustive-deps

  async function changeStatus(id: string, nextStatus: string) {
    const response = await fetch(`/api/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (response.ok) loadFeedback();
  }

  if (status === "loading")
    return <main className="min-h-screen bg-[#f8f9fb]" />;
  if (status !== "authenticated")
    return <main className="min-h-screen bg-[#f8f9fb]" />;
  if (session.user.role !== "admin")
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f9fb] text-slate-600">
        Admin access required.
      </main>
    );

  const statusCounts = stats?.byStatus || [];
  const openCount =
    statusCounts.find((row: any) => row._id === "open")?.count || 0;
  const resolvedCount =
    statusCounts.find((row: any) => row._id === "resolved")?.count || 0;

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/home" className="flex items-center gap-2 font-bold">
            <span className="flex size-9 items-center justify-center rounded-lg bg-slate-950 text-white">
              <MessageCircle className="size-4" />
            </span>
            Feedback Admin
          </Link>
          <Link
            href="/home"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"
          >
            <ArrowLeft className="size-4" /> User dashboard
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-bold">Admin dashboard</h1>
        </div>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Total feedback
              </p>
              <BarChart3 className="size-5 text-violet-600" />
            </div>
            <p className="mt-2 text-3xl font-bold">
              {stats?.totals?.total || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Open items</p>
              <Clock3 className="size-5 text-amber-500" />
            </div>
            <p className="mt-2 text-3xl font-bold">{openCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Resolved</p>
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <p className="mt-2 text-3xl font-bold">{resolvedCount}</p>
          </div>
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && loadFeedback()}
                placeholder="Search feedback"
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(event.target.value);
              }}
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
            >
              <option value="">All statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={category}
              onChange={(event) => {
                setPage(1);
                setCategory(event.target.value);
              }}
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
            >
              <option value="">All categories</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
              <option value="improvement">Improvement</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Feedback</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/feedback/${item._id}`}
                        className="font-semibold hover:text-violet-700"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {item.category}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {item.priority}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={item.status}
                        onChange={(event) =>
                          changeStatus(item._id, event.target.value)
                        }
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <p className="p-10 text-center text-sm text-slate-500">
                No feedback found.
              </p>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="text-sm font-semibold disabled:text-slate-300"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {page} of {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((value) => value + 1)}
              className="text-sm font-semibold disabled:text-slate-300"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
