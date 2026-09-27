"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Edit3,
  EyeOff,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

type Expense = {
  _id: string;
  title: string;
  amount: number;
  category: string;
  spentAt: string;
  note?: string;
  hiddenAt?: string | null;
};
type Note = {
  _id: string;
  title: string;
  content: string;
  noteDate: string;
  hiddenAt?: string | null;
};
type Milestone = { title: string; dueAt: string; completedAt?: string | null };
type Goal = {
  _id: string;
  title: string;
  description?: string;
  startsAt: string;
  dueAt: string;
  progress: number;
  status: "active" | "completed" | "paused";
  milestones: Milestone[];
};
type Tab = "expenses" | "notes" | "goals";

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const dateInput = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const currency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
const localDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

async function privateRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/private/${path}`, {
    ...init,
    cache: "no-store",
    headers: { "content-type": "application/json", ...init?.headers },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Request failed");
  return payload.data as T;
}

export default function PersonalWorkspacePage() {
  const [tab, setTab] = useState<Tab>("expenses");
  const [month, setMonth] = useState(monthKey(new Date()));
  const [showHidden, setShowHidden] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setReadOnly(payload.session?.role === "viewer"))
      .catch(() => setReadOnly(true));
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const view = showHidden ? "hidden" : "active";
      const [expenseData, noteData, goalData] = await Promise.all([
        privateRequest<{ result: Expense[]; summary: { total: number } }>(
          `expenses?month=${month}&view=${view}`,
        ),
        privateRequest<Note[]>(`notes?month=${month}&view=${view}`),
        privateRequest<Goal[]>(`goals?view=${view}`),
      ]);
      setExpenses(expenseData.result);
      setExpenseTotal(expenseData.summary.total);
      setNotes(noteData);
      setGoals(goalData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not load private data",
      );
    } finally {
      setLoading(false);
    }
  }, [month, showHidden]);

  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const runningExpenses = useMemo(() => {
    let running = 0;
    return [...expenses]
      .sort((a, b) => +new Date(a.spentAt) - +new Date(b.spentAt))
      .map((expense) => {
        running += expense.amount;
        return { ...expense, running };
      });
  }, [expenses]);

  const moveMonth = (delta: number) => {
    const [year, monthNumber] = month.split("-").map(Number);
    setMonth(monthKey(new Date(year, monthNumber - 1 + delta, 1)));
  };

  const saveExpense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      ...data,
      amount: Number(data.amount),
      spentAt: new Date(`${data.spentAt}T12:00:00`).toISOString(),
    };
    try {
      await privateRequest(
        editingExpense ? `expenses/${editingExpense._id}` : "expenses",
        {
          method: editingExpense ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
      );
      setEditingExpense(null);
      event.currentTarget.reset();
      toast.success(editingExpense ? "Expense updated" : "Expense added");
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save expense",
      );
    }
  };

  const saveNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      ...data,
      noteDate: new Date(`${data.noteDate}T12:00:00`).toISOString(),
    };
    try {
      await privateRequest(editingNote ? `notes/${editingNote._id}` : "notes", {
        method: editingNote ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      setEditingNote(null);
      event.currentTarget.reset();
      toast.success(editingNote ? "Note updated" : "Note saved");
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save note",
      );
    }
  };

  const saveGoal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const milestones = String(data.milestones || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, dueDate] = line.split("|").map((part) => part.trim());
        return {
          title,
          dueAt: new Date(`${dueDate || data.dueAt}T12:00:00`).toISOString(),
        };
      });
    const payload = {
      ...data,
      progress: Number(data.progress || 0),
      startsAt: new Date(`${data.startsAt}T12:00:00`).toISOString(),
      dueAt: new Date(`${data.dueAt}T12:00:00`).toISOString(),
      milestones,
    };
    try {
      await privateRequest("goals", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      event.currentTarget.reset();
      toast.success("Goal created");
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save goal",
      );
    }
  };

  const hideOrRestore = async (
    kind: "expenses" | "notes" | "goals",
    id: string,
    hidden: boolean,
  ) => {
    try {
      await privateRequest(`${kind}/${id}${hidden ? "/restore" : ""}`, {
        method: hidden ? "POST" : "DELETE",
      });
      toast.success(hidden ? "Item restored" : "Item hidden");
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update item",
      );
    }
  };

  const updateGoal = async (goal: Goal, changes: Partial<Goal>) => {
    try {
      await privateRequest(`goals/${goal._id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update goal",
      );
    }
  };

  const monthLabel = new Date(`${month}-01T12:00:00`).toLocaleDateString(
    undefined,
    { month: "long", year: "numeric" },
  );
  const tabs: { id: Tab; label: string }[] = [
    { id: "expenses", label: "Expenses" },
    { id: "notes", label: "Daily notes" },
    { id: "goals", label: "Goal timeline" },
  ];

  return (
    <div className="space-y-6 text-[#F5F5F0]">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#1E1E1E] pb-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#7CFF6B]">
            Personal workspace
          </p>
          <h1 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
            Personal workspace
          </h1>
          <p className="mt-2 text-sm text-[#A1A1A1]">
            Private expenses, notes, and goals.
            {readOnly ? " Read-only demo." : ""}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-[#A1A1A1]">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(event) => setShowHidden(event.target.checked)}
            className="accent-[#7CFF6B]"
          />{" "}
          Show hidden items
        </label>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          className="inline-flex rounded-md border border-[#262626] bg-[#121212] p-1"
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`rounded px-3 py-2 text-sm transition-colors ${tab === item.id ? "bg-[#7CFF6B]/10 text-[#7CFF6B]" : "text-[#888] hover:text-[#F5F5F0]"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {tab !== "goals" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => moveMonth(-1)}
              className="rounded-md border border-[#262626] bg-[#121212] p-2 text-[#A1A1A1] transition-colors hover:border-[#7CFF6B]/50 hover:text-[#7CFF6B]"
              aria-label="Previous month"
            >
              <ArrowLeft size={16} />
            </button>
            <input
              aria-label="Choose month"
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="rounded-md border border-[#262626] bg-[#121212] px-3 py-2 text-sm text-[#F5F5F0] outline-none focus:border-[#7CFF6B] [color-scheme:dark]"
            />
            <span className="hidden text-sm text-[#A1A1A1] sm:inline">
              {monthLabel}
            </span>
            <button
              onClick={() => moveMonth(1)}
              className="rounded-md border border-[#262626] bg-[#121212] p-2 text-[#A1A1A1] transition-colors hover:border-[#7CFF6B]/50 hover:text-[#7CFF6B]"
              aria-label="Next month"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {tab === "expenses" && (
        <section className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="MONTH TO DATE" value={currency(expenseTotal)} />
              <Metric label="ENTRIES" value={String(expenses.length)} />
              <Metric label="CURRENT MONTH" value={monthLabel} />
            </div>
            <div className="overflow-x-auto border-y border-[#1E1E1E]">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="text-[11px] uppercase text-[#959B8D]">
                  <tr>
                    <th className="py-3 font-medium">Date / item</th>
                    <th className="py-3 font-medium">Category</th>
                    <th className="py-3 text-right font-medium">Amount</th>
                    <th className="py-3 text-right font-medium">
                      Running total
                    </th>
                    {!readOnly && (
                      <th className="py-3 text-right font-medium">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={readOnly ? 4 : 5}
                        className="py-10 text-center text-[#777]"
                      >
                        Loading ledger…
                      </td>
                    </tr>
                  ) : (
                    runningExpenses.map((item) => (
                      <tr key={item._id} className="border-t border-[#292C26]">
                        <td className="py-3">
                          <span className="block text-[#E9E9DF]">
                            {item.title}
                          </span>
                          <span className="text-xs text-[#909687]">
                            {localDate(item.spentAt)}
                            {item.note ? ` · ${item.note}` : ""}
                          </span>
                        </td>
                        <td className="py-3 text-[#B2B8A5]">{item.category}</td>
                        <td className="py-3 text-right tabular-nums">
                          {currency(item.amount)}
                        </td>
                        <td className="py-3 text-right tabular-nums text-[#7CFF6B]">
                          {currency(item.running)}
                        </td>
                        {!readOnly && (
                          <td className="py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingExpense(item)}
                                title="Edit expense"
                                className="p-1.5 text-[#B6BBAA] hover:text-white"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() =>
                                  void hideOrRestore(
                                    "expenses",
                                    item._id,
                                    showHidden,
                                  )
                                }
                                title={
                                  showHidden
                                    ? "Restore expense"
                                    : "Hide expense"
                                }
                                className="p-1.5 text-[#B6BBAA] hover:text-[#E2A79A]"
                              >
                                {showHidden ? (
                                  <RotateCcw size={15} />
                                ) : (
                                  <Trash2 size={15} />
                                )}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                  {!loading && expenses.length === 0 && (
                    <tr>
                      <td
                        colSpan={readOnly ? 4 : 5}
                        className="py-10 text-center text-[#929889]"
                      >
                        No {showHidden ? "hidden " : ""}expenses in this month.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {!readOnly && (
            <form
              key={editingExpense?._id || "new-expense"}
              onSubmit={saveExpense}
              className="h-fit space-y-4 border-l border-[#1E1E1E] pl-0 xl:pl-6"
            >
              <h2 className="font-medium">
                {editingExpense ? "Edit expense" : "Add expense"}
              </h2>
              <Field
                name="title"
                label="Description"
                defaultValue={editingExpense?.title}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  name="amount"
                  label="Amount (BDT)"
                  type="number"
                  min="0.01"
                  step="0.01"
                  defaultValue={editingExpense?.amount}
                  required
                />
                <Field
                  name="category"
                  label="Category"
                  defaultValue={editingExpense?.category}
                  placeholder="Food, travel…"
                  required
                />
              </div>
              <Field
                name="spentAt"
                label="Date"
                type="date"
                defaultValue={
                  editingExpense
                    ? dateInput(new Date(editingExpense.spentAt))
                    : dateInput()
                }
                required
              />
              <Field
                name="note"
                label="Short note"
                defaultValue={editingExpense?.note}
              />
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-2 rounded-md bg-[#7CFF6B] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#68E057]">
                  <Plus size={16} />
                  {editingExpense ? "Save changes" : "Add expense"}
                </button>
                {editingExpense && (
                  <button
                    type="button"
                    onClick={() => setEditingExpense(null)}
                    className="border border-[#454A3F] px-4 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </section>
      )}

      {tab === "notes" && (
        <section className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            {loading ? (
              <p className="py-10 text-center text-[#777]">Loading notes…</p>
            ) : notes.length ? (
              notes.map((note) => (
                <article
                  key={note._id}
                  className="border-b border-[#1E1E1E] py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] text-[#7CFF6B]">
                        {localDate(note.noteDate)}
                      </p>
                      <h2 className="mt-1 text-lg font-medium">{note.title}</h2>
                    </div>
                    {!readOnly && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingNote(note)}
                          title="Edit note"
                          className="p-1.5 text-[#B6BBAA] hover:text-white"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() =>
                            void hideOrRestore("notes", note._id, showHidden)
                          }
                          title={showHidden ? "Restore note" : "Hide note"}
                          className="p-1.5 text-[#B6BBAA] hover:text-[#E2A79A]"
                        >
                          {showHidden ? (
                            <RotateCcw size={15} />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#B6BBAA]">
                    {note.content}
                  </p>
                </article>
              ))
            ) : (
              <p className="py-10 text-center text-[#777]">
                No {showHidden ? "hidden " : ""}notes in this month.
              </p>
            )}
          </div>
          {!readOnly && (
            <form
              key={editingNote?._id || "new-note"}
              onSubmit={saveNote}
              className="h-fit space-y-4 border-l border-[#1E1E1E] pl-0 xl:pl-6"
            >
              <h2 className="font-medium">
                {editingNote ? "Edit daily note" : "Capture a daily note"}
              </h2>
              <Field
                name="title"
                label="Title"
                defaultValue={editingNote?.title}
                required
              />
              <Field
                name="noteDate"
                label="Date"
                type="date"
                defaultValue={
                  editingNote
                    ? dateInput(new Date(editingNote.noteDate))
                    : dateInput()
                }
                required
              />
              <label className="block space-y-1.5 text-xs text-[#A1A1A1]">
                Note
                <textarea
                  name="content"
                  defaultValue={editingNote?.content}
                  required
                  rows={8}
                  maxLength={12000}
                  className="w-full resize-y rounded-md border border-[#262626] bg-[#121212] px-3 py-2.5 text-sm text-white outline-none focus:border-[#7CFF6B]"
                />
              </label>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-2 rounded-md bg-[#7CFF6B] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#68E057]">
                  <Plus size={16} />
                  Save note
                </button>
                {editingNote && (
                  <button
                    type="button"
                    onClick={() => setEditingNote(null)}
                    className="border border-[#454A3F] px-4 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </section>
      )}

      {tab === "goals" && (
        <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="relative space-y-0 before:absolute before:bottom-3 before:left-[9px] before:top-3 before:w-px before:bg-[#41483A]">
            {loading ? (
              <p className="pl-8 py-10 text-[#777]">Loading goals…</p>
            ) : goals.length ? (
              goals.map((goal) => {
                const remaining = Math.ceil(
                  (+new Date(goal.dueAt) - now) / 86400000,
                );
                const overdue = remaining < 0 && goal.status !== "completed";
                return (
                  <article key={goal._id} className="relative pb-7 pl-8">
                    <span
                      className={`absolute left-0 top-1.5 h-[19px] w-[19px] rounded-full border-[5px] border-[#0A0A0A] ${goal.status === "completed" ? "bg-[#7CFF6B]" : overdue ? "bg-[#FF5F56]" : "bg-[#7CFF6B]"}`}
                    />
                    <div className="border-b border-[#1E1E1E] pb-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-medium">
                              {goal.title}
                            </h2>
                            {goal.status === "completed" && (
                              <Check size={15} className="text-[#7CFF6B]" />
                            )}
                          </div>
                          <p className="mt-1 text-sm text-[#A7AD9B]">
                            {goal.description || ""}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 font-mono text-xs ${overdue ? "text-[#FF5F56]" : "text-[#7CFF6B]"}`}
                        >
                          <Clock3 size={13} />
                          {goal.status === "completed"
                            ? "Completed"
                            : overdue
                              ? `${Math.abs(remaining)} days overdue`
                              : `${remaining} days left`}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-1.5 flex-1 bg-[#262626]">
                          <div
                            className="h-full bg-[#7CFF6B] transition-[width]"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-xs text-[#A1A1A1]">
                          {goal.progress}%
                        </span>
                        {!readOnly && (
                          <input
                            aria-label={`Update ${goal.title} progress`}
                            type="range"
                            min="0"
                            max="100"
                            value={goal.progress}
                            onChange={(event) =>
                              void updateGoal(goal, {
                                progress: Number(event.target.value),
                                status:
                                  Number(event.target.value) === 100
                                    ? "completed"
                                    : "active",
                              })
                            }
                            className="w-20 accent-[#7CFF6B]"
                          />
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#777]">
                        <span>
                          {localDate(goal.startsAt)} → {localDate(goal.dueAt)}
                        </span>
                        {!readOnly && (
                          <button
                            onClick={() =>
                              void hideOrRestore("goals", goal._id, showHidden)
                            }
                            title={showHidden ? "Restore goal" : "Hide goal"}
                            className="p-1 hover:text-[#E2A79A]"
                          >
                            {showHidden ? (
                              <RotateCcw size={14} />
                            ) : (
                              <EyeOff size={14} />
                            )}
                          </button>
                        )}
                      </div>
                      {goal.milestones?.length > 0 && (
                        <ol className="mt-4 space-y-2 border-l border-[#41483A] pl-4">
                          {goal.milestones.map((milestone, index) => (
                            <li
                              key={`${milestone.title}-${index}`}
                              className="flex items-center justify-between gap-3 text-xs"
                            >
                              <span
                                className={
                                  milestone.completedAt
                                    ? "text-[#7CFF6B]"
                                    : "text-[#A1A1A1]"
                                }
                              >
                                {milestone.completedAt ? "✓ " : "○ "}
                                {milestone.title}
                              </span>
                              <span className="text-[#858C7A]">
                                {localDate(milestone.dueAt)}
                              </span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="pl-8 py-10 text-[#929889]">
                No goals yet. Give your next milestone a date.
              </p>
            )}
          </div>
          {!readOnly && (
            <form
              onSubmit={saveGoal}
              className="h-fit space-y-4 border-l border-[#1E1E1E] pl-0 xl:pl-6"
            >
              <h2 className="font-medium">Define a goal</h2>
              <Field name="title" label="Goal" required />
              <Field name="description" label="Outcome / context" />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  name="startsAt"
                  label="Start date"
                  type="date"
                  defaultValue={dateInput()}
                  required
                />
                <Field
                  name="dueAt"
                  label="Deadline"
                  type="date"
                  defaultValue={dateInput(new Date(Date.now() + 7 * 86400000))}
                  required
                />
              </div>
              <label className="block space-y-1.5 text-xs text-[#A1A1A1]">
                Starting progress
                <input
                  type="number"
                  name="progress"
                  min="0"
                  max="100"
                  defaultValue="0"
                  className="w-full rounded-md border border-[#262626] bg-[#121212] px-3 py-2.5 text-sm text-white outline-none focus:border-[#7CFF6B]"
                />
              </label>
              <label className="block space-y-1.5 text-xs text-[#A1A1A1]">
                Milestones
                <textarea
                  name="milestones"
                  rows={4}
                  placeholder="Prototype ready | 2026-10-04"
                  className="w-full resize-y rounded-md border border-[#262626] bg-[#121212] px-3 py-2.5 text-sm text-white outline-none focus:border-[#7CFF6B]"
                />
              </label>
              <button className="inline-flex items-center gap-2 rounded-md bg-[#7CFF6B] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#68E057]">
                <Plus size={16} />
                Create goal
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-y border-[#1E1E1E] py-4">
      <p className="font-mono text-[10px] tracking-[0.13em] text-[#777]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-[#F5F5F0]">
        {value}
      </p>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  required,
  min,
  max,
  step,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5 text-xs text-[#A1A1A1]">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#262626] bg-[#121212] px-3 py-2.5 text-sm text-white outline-none focus:border-[#7CFF6B] [color-scheme:dark]"
      />
    </label>
  );
}
