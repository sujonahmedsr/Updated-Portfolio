"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Edit3,
  Plus,
  Trash2,
  Wallet,
  FileText,
  Target,
  Search,
  Calendar,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Tag,
  Hash,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";

type Expense = {
  _id: string;
  title: string;
  amount: number;
  category: string;
  tags?: string[];
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

type Milestone = {
  title: string;
  dueAt: string;
  completedAt?: string | null;
};

type Goal = {
  _id: string;
  title: string;
  description?: string;
  startsAt: string;
  dueAt: string;
  progress: number;
  status: "active" | "completed" | "paused";
  milestones: Milestone[];
  hiddenAt?: string | null;
};

type Tab = "expenses" | "notes" | "goals";
type GoalViewMode = "cards" | "tasks";

const PRESET_TAGS = [
  "Hosting",
  "Domain",
  "Software",
  "Freelance",
  "Food",
  "Hardware",
  "Marketing",
  "Office",
  "Travel",
  "Personal",
];

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const dateInput = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

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

  // Data states
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Loading & Background Sync state
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [readOnly, setReadOnly] = useState(false);

  // Search & Filter
  const [expenseSearch, setExpenseSearch] = useState("");
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState("all");
  const [expenseTagFilter, setExpenseTagFilter] = useState("all");
  const [noteSearch, setNoteSearch] = useState("");
  const [goalStatusFilter, setGoalStatusFilter] = useState<"all" | "active" | "completed">("all");
  const [goalViewMode, setGoalViewMode] = useState<GoalViewMode>("cards");
  const [tasksFilter, setTasksFilter] = useState<"all" | "pending" | "completed">("all");

  // Expense modal form tags state
  const [expenseTags, setExpenseTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");

  // Modals & Editing
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Inline quick task addition per goal
  const [inlineTaskTitle, setInlineTaskTitle] = useState<Record<string, string>>({});
  const [inlineTaskDate, setInlineTaskDate] = useState<Record<string, string>>({});

  // Confirmation Delete Modal
  const [confirmDelete, setConfirmDelete] = useState<{
    kind: "expenses" | "notes" | "goals" | "milestone";
    id: string;
    title: string;
    parentGoal?: Goal;
    milestoneIndex?: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // In-memory cache for instant switches
  const dataCache = useRef<
    Map<
      string,
      {
        expenses: Expense[];
        total: number;
        notes: Note[];
        goals: Goal[];
      }
    >
  >(new Map());

  // Check auth session
  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setReadOnly(payload.session?.role === "viewer"))
      .catch(() => setReadOnly(true));
  }, []);

  // Fetch / Refresh data (Permanent items only, no archived views)
  const refresh = useCallback(
    async (isBackground = false) => {
      const cacheKey = `${month}-active`;

      if (dataCache.current.has(cacheKey)) {
        const cached = dataCache.current.get(cacheKey)!;
        setExpenses(cached.expenses);
        setExpenseTotal(cached.total);
        setNotes(cached.notes);
        setGoals(cached.goals);
        setInitialLoading(false);
      } else if (!isBackground) {
        setInitialLoading(true);
      }

      setIsSyncing(true);
      try {
        const [expenseData, noteData, goalData] = await Promise.all([
          privateRequest<{ result: Expense[]; summary: { total: number } }>(
            `expenses?month=${month}&view=active`
          ),
          privateRequest<Note[]>(`notes?month=${month}&view=active`),
          privateRequest<Goal[]>(`goals?view=active`),
        ]);

        const nextExpenses = expenseData.result || [];
        const nextTotal = expenseData.summary?.total || 0;
        const nextNotes = noteData || [];
        const nextGoals = goalData || [];

        setExpenses(nextExpenses);
        setExpenseTotal(nextTotal);
        setNotes(nextNotes);
        setGoals(nextGoals);

        dataCache.current.set(cacheKey, {
          expenses: nextExpenses,
          total: nextTotal,
          notes: nextNotes,
          goals: nextGoals,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not load private data"
        );
      } finally {
        setInitialLoading(false);
        setIsSyncing(false);
      }
    },
    [month]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // Running expenses calculation
  const runningExpenses = useMemo(() => {
    let running = 0;
    return [...expenses]
      .sort((a, b) => +new Date(a.spentAt) - +new Date(b.spentAt))
      .map((expense) => {
        running += expense.amount;
        return { ...expense, running };
      });
  }, [expenses]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(expenses.map((e) => e.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [expenses]);

  // Available tags list
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => {
      e.tags?.forEach((t) => set.add(t));
    });
    return ["all", ...Array.from(set)];
  }, [expenses]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return runningExpenses.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        (e.note && e.note.toLowerCase().includes(expenseSearch.toLowerCase())) ||
        e.category.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        (e.tags &&
          e.tags.some((t) =>
            t.toLowerCase().includes(expenseSearch.toLowerCase())
          ));
      const matchCategory =
        expenseCategoryFilter === "all" || e.category === expenseCategoryFilter;
      const matchTag =
        expenseTagFilter === "all" ||
        (e.tags && e.tags.includes(expenseTagFilter));
      return matchSearch && matchCategory && matchTag;
    });
  }, [
    runningExpenses,
    expenseSearch,
    expenseCategoryFilter,
    expenseTagFilter,
  ]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
        n.content.toLowerCase().includes(noteSearch.toLowerCase())
    );
  }, [notes, noteSearch]);

  // Filtered goals
  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (goalStatusFilter === "all") return true;
      if (goalStatusFilter === "completed") {
        return g.status === "completed" || g.progress === 100;
      }
      return g.status !== "completed" && g.progress < 100;
    });
  }, [goals, goalStatusFilter]);

  // Flattened Action Tasks list across all goals
  const allActionTasks = useMemo(() => {
    const list: {
      goalId: string;
      goalTitle: string;
      goal: Goal;
      milestone: Milestone;
      index: number;
    }[] = [];
    goals.forEach((goal) => {
      goal.milestones?.forEach((m, idx) => {
        list.push({
          goalId: goal._id,
          goalTitle: goal.title,
          goal,
          milestone: m,
          index: idx,
        });
      });
    });

    return list.filter((item) => {
      if (tasksFilter === "all") return true;
      if (tasksFilter === "completed") return Boolean(item.milestone.completedAt);
      return !item.milestone.completedAt;
    });
  }, [goals, tasksFilter]);

  // Total Task metrics
  const totalTasksCount = useMemo(() => {
    return goals.reduce((acc, g) => acc + (g.milestones?.length || 0), 0);
  }, [goals]);

  const completedTasksCount = useMemo(() => {
    return goals.reduce(
      (acc, g) =>
        acc + (g.milestones?.filter((m) => m.completedAt)?.length || 0),
      0
    );
  }, [goals]);

  // Navigation helpers
  const moveMonth = (delta: number) => {
    const [year, monthNumber] = month.split("-").map(Number);
    setMonth(monthKey(new Date(year, monthNumber - 1 + delta, 1)));
  };

  const setThisMonth = () => {
    setMonth(monthKey(new Date()));
  };

  // Actions
  const openExpenseModal = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setExpenseTags(expense.tags || []);
    } else {
      setEditingExpense(null);
      setExpenseTags([]);
    }
    setCustomTagInput("");
    setExpenseModalOpen(true);
  };

  const toggleExpenseTag = (tag: string) => {
    setExpenseTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const clean = customTagInput.trim().replace(/^#/, "");
    if (!clean) return;
    if (!expenseTags.includes(clean)) {
      setExpenseTags((prev) => [...prev, clean]);
    }
    setCustomTagInput("");
  };

  const saveExpense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      ...data,
      amount: Number(data.amount),
      tags: expenseTags,
      spentAt: new Date(`${data.spentAt}T12:00:00`).toISOString(),
    };
    try {
      await privateRequest(
        editingExpense ? `expenses/${editingExpense._id}` : "expenses",
        {
          method: editingExpense ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        }
      );
      setEditingExpense(null);
      setExpenseModalOpen(false);
      toast.success(editingExpense ? "Expense updated" : "Expense recorded");
      dataCache.current.clear();
      await refresh(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save expense"
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
      setNoteModalOpen(false);
      toast.success(editingNote ? "Note updated" : "Daily note captured");
      dataCache.current.clear();
      await refresh(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save note"
      );
    }
  };

  const saveGoal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const rawMilestones = String(data.milestones || "")
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
      milestones: editingGoal
        ? editingGoal.milestones.length > 0 && rawMilestones.length === 0
          ? editingGoal.milestones
          : rawMilestones
        : rawMilestones,
    };
    try {
      await privateRequest(editingGoal ? `goals/${editingGoal._id}` : "goals", {
        method: editingGoal ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      setEditingGoal(null);
      setGoalModalOpen(false);
      toast.success(editingGoal ? "Goal updated" : "Goal initiated successfully");
      dataCache.current.clear();
      await refresh(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save goal"
      );
    }
  };

  const updateGoal = async (goal: Goal, changes: Partial<Goal>) => {
    try {
      setGoals((prev) =>
        prev.map((g) => (g._id === goal._id ? { ...g, ...changes } : g))
      );
      await privateRequest(`goals/${goal._id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      dataCache.current.clear();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update goal"
      );
      await refresh(true);
    }
  };

  const toggleMilestone = async (goal: Goal, milestoneIndex: number) => {
    const updatedMilestones = goal.milestones.map((m, idx) => {
      if (idx === milestoneIndex) {
        return {
          ...m,
          completedAt: m.completedAt ? null : new Date().toISOString(),
        };
      }
      return m;
    });

    const completedCount = updatedMilestones.filter((m) => m.completedAt).length;
    const autoProgress = updatedMilestones.length
      ? Math.round((completedCount / updatedMilestones.length) * 100)
      : 0;

    await updateGoal(goal, {
      milestones: updatedMilestones,
      progress: autoProgress,
      status: autoProgress === 100 ? "completed" : "active",
    });
  };

  const handleAddInlineTask = async (goal: Goal) => {
    const title = (inlineTaskTitle[goal._id] || "").trim();
    if (!title) return;
    const dueDate = inlineTaskDate[goal._id]
      ? new Date(`${inlineTaskDate[goal._id]}T12:00:00`).toISOString()
      : goal.dueAt;

    const newMilestone: Milestone = {
      title,
      dueAt: dueDate,
      completedAt: null,
    };

    const updatedMilestones = [...(goal.milestones || []), newMilestone];
    const completedCount = updatedMilestones.filter((m) => m.completedAt).length;
    const autoProgress = Math.round(
      (completedCount / updatedMilestones.length) * 100
    );

    await updateGoal(goal, {
      milestones: updatedMilestones,
      progress: autoProgress,
      status: autoProgress === 100 ? "completed" : "active",
    });

    setInlineTaskTitle((prev) => ({ ...prev, [goal._id]: "" }));
    toast.success("Action task added!");
  };

  // Permanent Delete Confirm Handler
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      if (
        confirmDelete.kind === "milestone" &&
        confirmDelete.parentGoal &&
        confirmDelete.milestoneIndex !== undefined
      ) {
        const goal = confirmDelete.parentGoal;
        const updatedMilestones = goal.milestones.filter(
          (_, idx) => idx !== confirmDelete.milestoneIndex
        );
        const completedCount = updatedMilestones.filter(
          (m) => m.completedAt
        ).length;
        const autoProgress = updatedMilestones.length
          ? Math.round((completedCount / updatedMilestones.length) * 100)
          : 0;

        await updateGoal(goal, {
          milestones: updatedMilestones,
          progress: autoProgress,
          status: autoProgress === 100 ? "completed" : "active",
        });
        toast.success("Action task removed permanently");
      } else {
        await privateRequest(`${confirmDelete.kind}/${confirmDelete.id}`, {
          method: "DELETE",
        });

        if (confirmDelete.kind === "expenses") {
          setExpenses((prev) =>
            prev.filter((e) => e._id !== confirmDelete.id)
          );
        } else if (confirmDelete.kind === "notes") {
          setNotes((prev) => prev.filter((n) => n._id !== confirmDelete.id));
        } else if (confirmDelete.kind === "goals") {
          setGoals((prev) => prev.filter((g) => g._id !== confirmDelete.id));
        }

        toast.success("Item permanently deleted!");
        dataCache.current.clear();
        await refresh(true);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
      );
    } finally {
      setIsDeleting(false);
      setConfirmDelete(null);
    }
  };

  const monthLabel = new Date(`${month}-01T12:00:00`).toLocaleDateString(
    undefined,
    { month: "long", year: "numeric" }
  );

  const tabs: { id: Tab; label: string; icon: any; count: number }[] = [
    {
      id: "expenses",
      label: "Expenses Ledger",
      icon: Wallet,
      count: expenses.length,
    },
    {
      id: "notes",
      label: "Daily Notes",
      icon: FileText,
      count: notes.length,
    },
    {
      id: "goals",
      label: "Goals & Action Tasks",
      icon: Target,
      count: goals.length,
    },
  ];

  const topCategory = useMemo(() => {
    if (!expenses.length) return "None";
    const counts: Record<string, number> = {};
    expenses.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + e.amount;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
  }, [expenses]);

  return (
    <div className="space-y-6 text-[#F5F5F0] font-sans pb-16">
      {/* ─── Top Header Banner ─── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1E1E1E]">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#7CFF6B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PERSONAL WORKSPACE</span>
            {isSyncing && (
              <span className="flex items-center gap-1 text-[10px] text-[#888] ml-2 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin text-[#7CFF6B]" />
                <span>Syncing</span>
              </span>
            )}
          </div>
          <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-bold tracking-tight">
            Financial &amp; Productivity Ledger
          </h1>
          <p className="mt-1 text-xs text-[#888] font-sans">
            Encrypted private expenses with tags, daily notes, and unified
            goals &amp; action tasks.
            {readOnly ? " (Read-only mode active)" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refresh()}
            className="p-2.5 rounded-lg border border-[#222] bg-[#121212] text-[#888] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/30 transition-colors"
            title="Refresh All"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* ─── Tabs & Month Navigation ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div
          role="tablist"
          className="inline-flex rounded-xl border border-[#262626] bg-[#121212] p-1 gap-1"
        >
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-mono transition-all ${
                  active
                    ? "bg-[#7CFF6B]/15 text-[#7CFF6B] font-bold border border-[#7CFF6B]/30 shadow-sm"
                    : "text-[#888] hover:text-[#F5F5F0] hover:bg-[#1A1A1A]"
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    active
                      ? "bg-[#7CFF6B] text-black font-bold"
                      : "bg-[#222] text-[#888]"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Month Selector Controls (for Expenses and Notes) */}
        {tab !== "goals" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveMonth(-1)}
              className="rounded-lg border border-[#262626] bg-[#121212] p-2 text-[#A1A1A1] transition hover:border-[#7CFF6B]/50 hover:text-[#7CFF6B]"
              title="Previous month"
            >
              <ArrowLeft size={14} />
            </button>

            <button
              onClick={setThisMonth}
              className="rounded-lg border border-[#262626] bg-[#121212] px-3 py-1.5 text-xs font-mono text-[#AAA] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/30 transition"
              title="Jump to current month"
            >
              Current
            </button>

            <div className="flex items-center rounded-lg border border-[#262626] bg-[#121212] px-3 py-1.5 gap-2">
              <Calendar size={13} className="text-[#7CFF6B]" />
              <input
                aria-label="Choose month"
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="bg-transparent text-xs font-mono text-[#F5F5F0] outline-none [color-scheme:dark]"
              />
              <span className="hidden sm:inline text-xs font-mono text-[#777] border-l border-[#262626] pl-2">
                {monthLabel}
              </span>
            </div>

            <button
              onClick={() => moveMonth(1)}
              className="rounded-lg border border-[#262626] bg-[#121212] p-2 text-[#A1A1A1] transition hover:border-[#7CFF6B]/50 hover:text-[#7CFF6B]"
              title="Next month"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ─── TAB 1: EXPENSES LEDGER WITH TAG SYSTEM ─── */}
      {tab === "expenses" && (
        <section className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            {initialLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-[#222] bg-[#121212] p-5 space-y-2"
                >
                  <div className="h-3 w-1/2 bg-[#1C1C1C] rounded" />
                  <div className="h-7 w-3/4 bg-[#262626] rounded" />
                </div>
              ))
            ) : (
              <>
                <div className="rounded-xl border border-[#222] bg-[#121212] p-5 relative overflow-hidden">
                  <span className="text-[10px] uppercase text-[#777] tracking-wider block">
                    Total Spent (BDT)
                  </span>
                  <p className="text-2xl sm:text-3xl font-bold text-[#7CFF6B] mt-1 tabular-nums">
                    {currency(expenseTotal)}
                  </p>
                  <span className="text-[10px] text-[#666] mt-1 block">
                    For {monthLabel}
                  </span>
                </div>

                <div className="rounded-xl border border-[#222] bg-[#121212] p-5">
                  <span className="text-[10px] uppercase text-[#777] tracking-wider block">
                    Transactions
                  </span>
                  <p className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] mt-1 tabular-nums">
                    {expenses.length}
                  </p>
                  <span className="text-[10px] text-[#666] mt-1 block">
                    Recorded entries
                  </span>
                </div>

                <div className="rounded-xl border border-[#222] bg-[#121212] p-5">
                  <span className="text-[10px] uppercase text-[#777] tracking-wider block">
                    Average / Entry
                  </span>
                  <p className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] mt-1 tabular-nums">
                    {currency(
                      expenses.length
                        ? Math.round(expenseTotal / expenses.length)
                        : 0
                    )}
                  </p>
                  <span className="text-[10px] text-[#666] mt-1 block">
                    Per transaction
                  </span>
                </div>

                <div className="rounded-xl border border-[#222] bg-[#121212] p-5">
                  <span className="text-[10px] uppercase text-[#777] tracking-wider block">
                    Top Category
                  </span>
                  <p className="text-xl sm:text-2xl font-bold text-[#DDD] mt-1 truncate">
                    {topCategory}
                  </p>
                  <span className="text-[10px] text-[#666] mt-1 block">
                    Highest outlay
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Search, Filter & Action Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
                  />
                  <input
                    type="text"
                    placeholder="Search expenses, notes, or #tags..."
                    value={expenseSearch}
                    onChange={(e) => setExpenseSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#262626] bg-[#121212] text-xs font-mono text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B]"
                  />
                </div>

                {categories.length > 2 && (
                  <div className="hidden md:flex gap-1.5 flex-wrap">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setExpenseCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono capitalize transition ${
                          expenseCategoryFilter === cat
                            ? "bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30"
                            : "bg-[#141414] border border-[#222] text-[#777] hover:text-[#CCC]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!readOnly && (
                <button
                  onClick={() => openExpenseModal()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7CFF6B] px-4 py-2.5 text-xs font-mono font-semibold text-black hover:bg-[#68e057] transition shadow-lg shadow-[#7CFF6B]/10 shrink-0"
                >
                  <Plus size={14} />
                  <span>Record Expense</span>
                </button>
              )}
            </div>

            {/* Tag Filter Pills */}
            {availableTags.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-mono text-[#666] flex items-center gap-1 shrink-0 mr-1">
                  <Tag size={11} className="text-[#7CFF6B]" /> Filter Tags:
                </span>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setExpenseTagFilter(tag)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono transition shrink-0 ${
                      expenseTagFilter === tag
                        ? "bg-[#7CFF6B] text-black font-semibold shadow-sm"
                        : "bg-[#161616] border border-[#262626] text-[#888] hover:text-white"
                    }`}
                  >
                    {tag === "all" ? "All Tags" : `#${tag}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Expenses Table */}
          <div className="rounded-xl border border-[#222] bg-[#121212] overflow-hidden font-mono text-xs">
            {initialLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center justify-between py-2 border-b border-[#1A1A1A]"
                  >
                    <div className="space-y-1.5 w-1/3">
                      <div className="h-4 bg-[#1E1E1E] rounded w-3/4" />
                      <div className="h-2.5 bg-[#181818] rounded w-1/2" />
                    </div>
                    <div className="h-4 bg-[#1E1E1E] rounded w-20" />
                    <div className="h-4 bg-[#1E1E1E] rounded w-24" />
                    <div className="h-4 bg-[#1E1E1E] rounded w-24" />
                  </div>
                ))}
              </div>
            ) : filteredExpenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#161616] border-b border-[#222222] text-[#888] text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Date &amp; Description</th>
                      <th className="py-3 px-4 font-semibold">Category &amp; Tags</th>
                      <th className="py-3 px-4 text-right font-semibold">Amount</th>
                      <th className="py-3 px-4 text-right font-semibold">Running Total</th>
                      {!readOnly && (
                        <th className="py-3 px-4 text-right font-semibold">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]">
                    {filteredExpenses.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-[#161616]/60 transition-colors group"
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-sm text-[#F5F5F0] block">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-[#777] font-sans flex items-center gap-1.5 mt-0.5">
                            <span>{localDate(item.spentAt)}</span>
                            {item.note && (
                              <span className="text-[#999] before:content-['·'] before:mr-1.5">
                                {item.note}
                              </span>
                            )}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="inline-block self-start px-2 py-0.5 rounded-md bg-[#181818] border border-[#262626] text-[10px] text-[#B2B8A5]">
                              {item.category}
                            </span>
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setExpenseTagFilter(t)}
                                    className="px-1.5 py-0.2 rounded text-[10px] bg-[#7CFF6B]/10 text-[#7CFF6B] border border-[#7CFF6B]/20 hover:bg-[#7CFF6B]/20 transition"
                                  >
                                    #{t}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold tabular-nums text-[#F5F5F0]">
                          {currency(item.amount)}
                        </td>

                        <td className="py-3.5 px-4 text-right tabular-nums text-[#7CFF6B] font-semibold">
                          {currency(item.running)}
                        </td>

                        {!readOnly && (
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openExpenseModal(item)}
                                title="Edit expense"
                                className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#1E1E1E] transition"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() =>
                                  setConfirmDelete({
                                    kind: "expenses",
                                    id: item._id,
                                    title: item.title,
                                  })
                                }
                                title="Delete expense permanently"
                                className="p-1.5 rounded-lg text-[#888] hover:text-[#FF5F56] hover:bg-[#FF5F56]/10 transition"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center space-y-3 font-sans">
                <Wallet className="w-10 h-10 text-[#333] mx-auto" />
                <p className="text-[#888] text-sm">
                  {expenseSearch || expenseTagFilter !== "all"
                    ? "No expenses matching current filters"
                    : `No expenses recorded in ${monthLabel}.`}
                </p>
                {!readOnly && (
                  <button
                    onClick={() => openExpenseModal()}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#7CFF6B] px-3.5 py-2 text-xs font-mono font-semibold text-black"
                  >
                    <Plus size={14} /> Add First Expense
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── TAB 2: DAILY NOTES ─── */}
      {tab === "notes" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
              />
              <input
                type="text"
                placeholder="Search notes..."
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#262626] bg-[#121212] text-xs font-mono text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B]"
              />
            </div>

            {!readOnly && (
              <button
                onClick={() => {
                  setEditingNote(null);
                  setNoteModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7CFF6B] px-4 py-2.5 text-xs font-mono font-semibold text-black hover:bg-[#68e057] transition shadow-lg shadow-[#7CFF6B]/10 shrink-0"
              >
                <Plus size={14} />
                <span>Capture Note</span>
              </button>
            )}
          </div>

          {/* Notes Grid */}
          {initialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-[#222] bg-[#121212] p-5 space-y-3"
                >
                  <div className="h-4 bg-[#1E1E1E] rounded w-1/3" />
                  <div className="h-5 bg-[#262626] rounded w-2/3" />
                  <div className="h-16 bg-[#1A1A1A] rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map((note) => (
                <article
                  key={note._id}
                  className="rounded-xl border border-[#222] bg-[#121212] p-5 hover:border-[#7CFF6B]/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-[10px] text-[#7CFF6B] uppercase tracking-wider block">
                          {localDate(note.noteDate)}
                        </span>
                        <h3 className="font-heading text-base font-bold text-[#F5F5F0] mt-0.5">
                          {note.title}
                        </h3>
                      </div>

                      {!readOnly && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingNote(note);
                              setNoteModalOpen(true);
                            }}
                            title="Edit note"
                            className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#1E1E1E] transition"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmDelete({
                                kind: "notes",
                                id: note._id,
                                title: note.title,
                              })
                            }
                            title="Delete note permanently"
                            className="p-1.5 rounded-lg text-[#888] hover:text-[#FF5F56] hover:bg-[#FF5F56]/10 transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap text-xs text-[#B2B8A5] leading-relaxed pt-1">
                      {note.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#222] bg-[#121212] p-12 text-center space-y-3 font-sans">
              <FileText className="w-10 h-10 text-[#333] mx-auto" />
              <p className="text-[#888] text-sm">
                {noteSearch
                  ? `No notes matching "${noteSearch}"`
                  : `No notes found for ${monthLabel}.`}
              </p>
              {!readOnly && (
                <button
                  onClick={() => {
                    setEditingNote(null);
                    setNoteModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7CFF6B] px-3.5 py-2 text-xs font-mono font-semibold text-black"
                >
                  <Plus size={14} /> Write First Note
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* ─── TAB 3: UNIFIED GOALS & ACTION TASKS HUB ─── */}
      {tab === "goals" && (
        <section className="space-y-6">
          {/* Top Hub Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            <div className="rounded-xl border border-[#222] bg-[#121212] p-4">
              <span className="text-[10px] uppercase text-[#777] tracking-wider block">
                Active Goals
              </span>
              <p className="text-2xl font-bold text-[#7CFF6B] mt-1 tabular-nums">
                {goals.filter((g) => g.status !== "completed" && g.progress < 100).length}
              </p>
              <span className="text-[10px] text-[#666] mt-0.5 block">
                In progression
              </span>
            </div>

            <div className="rounded-xl border border-[#222] bg-[#121212] p-4">
              <span className="text-[10px] uppercase text-[#777] tracking-wider block">
                Completed Goals
              </span>
              <p className="text-2xl font-bold text-[#F5F5F0] mt-1 tabular-nums">
                {goals.filter((g) => g.status === "completed" || g.progress === 100).length}
              </p>
              <span className="text-[10px] text-[#666] mt-0.5 block">
                Achieved milestones
              </span>
            </div>

            <div className="rounded-xl border border-[#222] bg-[#121212] p-4">
              <span className="text-[10px] uppercase text-[#777] tracking-wider block">
                Total Action Tasks
              </span>
              <p className="text-2xl font-bold text-[#F5F5F0] mt-1 tabular-nums">
                {totalTasksCount}
              </p>
              <span className="text-[10px] text-[#666] mt-0.5 block">
                Across all roadmaps
              </span>
            </div>

            <div className="rounded-xl border border-[#222] bg-[#121212] p-4">
              <span className="text-[10px] uppercase text-[#777] tracking-wider block">
                Task Completion Rate
              </span>
              <p className="text-2xl font-bold text-[#7CFF6B] mt-1 tabular-nums">
                {totalTasksCount > 0
                  ? Math.round((completedTasksCount / totalTasksCount) * 100)
                  : 0}
                %
              </p>
              <span className="text-[10px] text-[#666] mt-0.5 block">
                {completedTasksCount}/{totalTasksCount} checked off
              </span>
            </div>
          </div>

          {/* Control Bar: View Mode + Filters + New Goal */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-[#1E1E1E]">
            {/* View Mode Toggle: Goal Cards vs All Tasks Board */}
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl border border-[#262626] bg-[#121212] p-1">
                <button
                  onClick={() => setGoalViewMode("cards")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition ${
                    goalViewMode === "cards"
                      ? "bg-[#7CFF6B]/15 text-[#7CFF6B] font-bold border border-[#7CFF6B]/30"
                      : "text-[#888] hover:text-[#CCC]"
                  }`}
                >
                  <Layers size={13} />
                  <span>Roadmap Cards</span>
                </button>
                <button
                  onClick={() => setGoalViewMode("tasks")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition ${
                    goalViewMode === "tasks"
                      ? "bg-[#7CFF6B]/15 text-[#7CFF6B] font-bold border border-[#7CFF6B]/30"
                      : "text-[#888] hover:text-[#CCC]"
                  }`}
                >
                  <ListTodo size={13} />
                  <span>All Action Tasks</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#222] text-[#888]">
                    {totalTasksCount}
                  </span>
                </button>
              </div>

              {/* Sub-filters depending on view mode */}
              {goalViewMode === "cards" ? (
                <div className="hidden md:flex items-center gap-1 font-mono text-[11px]">
                  {(["all", "active", "completed"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setGoalStatusFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition ${
                        goalStatusFilter === filter
                          ? "bg-[#1C1C1C] text-[#7CFF6B] border border-[#7CFF6B]/20 font-bold"
                          : "text-[#777] hover:text-[#CCC]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-1 font-mono text-[11px]">
                  {(["all", "pending", "completed"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTasksFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition ${
                        tasksFilter === filter
                          ? "bg-[#1C1C1C] text-[#7CFF6B] border border-[#7CFF6B]/20 font-bold"
                          : "text-[#777] hover:text-[#CCC]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!readOnly && (
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setGoalModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#7CFF6B] px-4 py-2.5 text-xs font-mono font-semibold text-black hover:bg-[#68e057] transition shadow-lg shadow-[#7CFF6B]/10 shrink-0"
              >
                <Plus size={14} />
                <span>Define New Goal</span>
              </button>
            )}
          </div>

          {/* VIEW MODE 1: ROADMAP & GOAL CARDS */}
          {goalViewMode === "cards" && (
            <div className="space-y-5">
              {initialLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-2xl border border-[#222] bg-[#121212] p-6 space-y-4"
                    >
                      <div className="h-5 bg-[#1E1E1E] rounded w-1/3" />
                      <div className="h-3 bg-[#181818] rounded w-full" />
                      <div className="h-2 bg-[#262626] rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredGoals.length > 0 ? (
                <div className="relative space-y-5 before:absolute before:bottom-3 before:left-[14px] before:top-3 before:w-px before:bg-[#262626]">
                  {filteredGoals.map((goal) => {
                    const remaining = Math.ceil(
                      (+new Date(goal.dueAt) - now) / 86400000
                    );
                    const overdue = remaining < 0 && goal.status !== "completed";
                    const isComplete =
                      goal.status === "completed" || goal.progress === 100;
                    const goalTasks = goal.milestones || [];
                    const completedTasks = goalTasks.filter(
                      (m) => m.completedAt
                    ).length;

                    return (
                      <article
                        key={goal._id}
                        className="relative pl-8 sm:pl-9 transition-all"
                      >
                        {/* Timeline Node */}
                        <span
                          className={`absolute left-1.5 top-6 h-4 w-4 rounded-full border-4 border-[#0E0E0E] ${
                            isComplete
                              ? "bg-[#7CFF6B]"
                              : overdue
                              ? "bg-[#FF5F56]"
                              : "bg-[#7CFF6B]"
                          }`}
                        />

                        <div className="rounded-2xl border border-[#222] bg-[#121212] p-5 sm:p-6 space-y-5 hover:border-[#7CFF6B]/30 transition-all">
                          {/* Header: Title, Objectives & Actions */}
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1 max-w-xl">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">
                                  {goal.title}
                                </h3>
                                {isComplete && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30">
                                    <CheckCircle2 size={12} /> COMPLETED
                                  </span>
                                )}
                              </div>
                              {goal.description && (
                                <p className="text-xs text-[#888] font-sans leading-relaxed">
                                  {goal.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full ${
                                  isComplete
                                    ? "bg-[#7CFF6B]/10 text-[#7CFF6B] border border-[#7CFF6B]/30"
                                    : overdue
                                    ? "bg-[#FF5F56]/10 text-[#FF5F56] border border-[#FF5F56]/30"
                                    : "bg-[#1E1E1E] text-[#AAA] border border-[#333]"
                                }`}
                              >
                                <Clock3 size={12} />
                                {isComplete
                                  ? "Goal Achieved"
                                  : overdue
                                  ? `${Math.abs(remaining)} days overdue`
                                  : `${remaining} days remaining`}
                              </span>

                              {!readOnly && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingGoal(goal);
                                      setGoalModalOpen(true);
                                    }}
                                    title="Edit goal"
                                    className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#1E1E1E] transition"
                                  >
                                    <Edit3 size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setConfirmDelete({
                                        kind: "goals",
                                        id: goal._id,
                                        title: goal.title,
                                      })
                                    }
                                    title="Delete goal permanently"
                                    className="p-1.5 rounded-lg text-[#888] hover:text-[#FF5F56] hover:bg-[#FF5F56]/10 transition"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar & Slider */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono text-[#888]">
                              <span className="flex items-center gap-1.5">
                                <TrendingUp size={12} className="text-[#7CFF6B]" />
                                <span>Goal Execution Progress</span>
                              </span>
                              <span className="text-[#7CFF6B] font-bold">
                                {goal.progress}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-[#1A1A1A] rounded-full overflow-hidden border border-[#262626]">
                              <div
                                className="h-full bg-gradient-to-r from-[#7CFF6B] to-[#5ec74f] transition-all duration-300"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>

                            {!readOnly && (
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] font-mono text-[#555]">
                                  Adjust progress:
                                </span>
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
                                  className="w-32 accent-[#7CFF6B] cursor-pointer"
                                />
                              </div>
                            )}
                          </div>

                          {/* Integrated Action Tasks Checklist */}
                          <div className="pt-3 border-t border-[#1C1C1C] space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-[#888] flex items-center gap-1.5">
                                <ListTodo size={13} className="text-[#7CFF6B]" />
                                <span>Action Tasks &amp; Milestones</span>
                                <span className="text-[#7CFF6B] font-bold">
                                  ({completedTasks}/{goalTasks.length})
                                </span>
                              </span>
                            </div>

                            {/* Task Items */}
                            {goalTasks.length > 0 ? (
                              <div className="space-y-1.5 font-mono text-xs">
                                {goalTasks.map((milestone, index) => {
                                  const done = Boolean(milestone.completedAt);
                                  const taskDueDays = Math.ceil(
                                    (+new Date(milestone.dueAt) - now) / 86400000
                                  );
                                  const taskOverdue = taskDueDays < 0 && !done;

                                  return (
                                    <div
                                      key={index}
                                      className={`flex items-center justify-between p-2.5 rounded-xl border transition group ${
                                        done
                                          ? "border-[#7CFF6B]/20 bg-[#7CFF6B]/5 text-[#7CFF6B]"
                                          : "border-[#1F1F1F] bg-[#141414] text-[#AAA] hover:border-[#333]"
                                      }`}
                                    >
                                      <div
                                        onClick={() =>
                                          !readOnly && toggleMilestone(goal, index)
                                        }
                                        className="flex items-center gap-2.5 flex-1 cursor-pointer"
                                      >
                                        <div
                                          className={`h-4 w-4 rounded flex items-center justify-center border text-[10px] transition-all ${
                                            done
                                              ? "border-[#7CFF6B] bg-[#7CFF6B] text-black font-bold"
                                              : "border-[#444] bg-transparent text-transparent hover:border-[#7CFF6B]"
                                          }`}
                                        >
                                          ✓
                                        </div>
                                        <span
                                          className={`text-xs ${
                                            done
                                              ? "line-through text-[#666]"
                                              : "text-[#EEE]"
                                          }`}
                                        >
                                          {milestone.title}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span
                                          className={`text-[10px] px-2 py-0.5 rounded ${
                                            done
                                              ? "text-[#666] bg-black/20"
                                              : taskOverdue
                                              ? "text-[#FF5F56] bg-[#FF5F56]/10"
                                              : "text-[#777] bg-[#1A1A1A]"
                                          }`}
                                        >
                                          {localDate(milestone.dueAt)}
                                        </span>

                                        {!readOnly && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setConfirmDelete({
                                                kind: "milestone",
                                                id: `${goal._id}-${index}`,
                                                title: milestone.title,
                                                parentGoal: goal,
                                                milestoneIndex: index,
                                              });
                                            }}
                                            title="Delete action task"
                                            className="opacity-0 group-hover:opacity-100 p-1 text-[#666] hover:text-[#FF5F56] transition"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-xs text-[#555] font-mono italic">
                                No action tasks defined yet for this goal.
                              </p>
                            )}

                            {/* Inline Quick Action Task Adder */}
                            {!readOnly && (
                              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    placeholder="+ Add an action task to this goal..."
                                    value={inlineTaskTitle[goal._id] || ""}
                                    onChange={(e) =>
                                      setInlineTaskTitle((prev) => ({
                                        ...prev,
                                        [goal._id]: e.target.value,
                                      }))
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        void handleAddInlineTask(goal);
                                      }
                                    }}
                                    className="w-full rounded-xl border border-[#222] bg-[#141414] px-3 py-1.5 text-xs text-[#F5F5F0] placeholder-[#555] outline-none focus:border-[#7CFF6B]"
                                  />
                                </div>
                                <input
                                  type="date"
                                  value={
                                    inlineTaskDate[goal._id] ||
                                    dateInput(new Date(goal.dueAt))
                                  }
                                  onChange={(e) =>
                                    setInlineTaskDate((prev) => ({
                                      ...prev,
                                      [goal._id]: e.target.value,
                                    }))
                                  }
                                  className="rounded-xl border border-[#222] bg-[#141414] px-2.5 py-1.5 text-xs font-mono text-[#AAA] outline-none [color-scheme:dark]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddInlineTask(goal)}
                                  className="rounded-xl bg-[#1F1F1F] hover:bg-[#7CFF6B] hover:text-black border border-[#2A2A2A] px-3 py-1.5 text-xs font-mono text-[#DDD] transition shrink-0"
                                >
                                  Add Task
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Footer Window */}
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#555] pt-1">
                            <span>
                              Window: {localDate(goal.startsAt)} → {localDate(goal.dueAt)}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-[#222] bg-[#121212] p-12 text-center space-y-3 font-sans">
                  <Target className="w-10 h-10 text-[#333] mx-auto" />
                  <p className="text-[#888] text-sm">
                    No active or scheduled goals found.
                  </p>
                  {!readOnly && (
                    <button
                      onClick={() => {
                        setEditingGoal(null);
                        setGoalModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#7CFF6B] px-3.5 py-2 text-xs font-mono font-semibold text-black"
                    >
                      <Plus size={14} /> Create First Goal
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: ALL ACTION TASKS BOARD */}
          {goalViewMode === "tasks" && (
            <div className="rounded-2xl border border-[#222] bg-[#121212] p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
                <div className="flex items-center gap-2">
                  <ListTodo size={16} className="text-[#7CFF6B]" />
                  <span className="font-heading text-sm font-bold text-[#F5F5F0]">
                    Action Tasks Agenda ({allActionTasks.length} tasks)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(["all", "pending", "completed"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTasksFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition text-[11px] ${
                        tasksFilter === filter
                          ? "bg-[#7CFF6B] text-black font-bold"
                          : "bg-[#181818] border border-[#262626] text-[#888] hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {allActionTasks.length > 0 ? (
                <div className="divide-y divide-[#1A1A1A]">
                  {allActionTasks.map((item, i) => {
                    const done = Boolean(item.milestone.completedAt);
                    const taskDueDays = Math.ceil(
                      (+new Date(item.milestone.dueAt) - now) / 86400000
                    );
                    const taskOverdue = taskDueDays < 0 && !done;

                    return (
                      <div
                        key={`${item.goalId}-${item.index}-${i}`}
                        className={`flex items-center justify-between py-3 px-2 rounded-lg transition hover:bg-[#161616] group ${
                          done ? "opacity-70" : ""
                        }`}
                      >
                        <div
                          onClick={() =>
                            !readOnly && toggleMilestone(item.goal, item.index)
                          }
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                        >
                          <div
                            className={`h-4 w-4 rounded flex items-center justify-center border text-[10px] transition-all ${
                              done
                                ? "border-[#7CFF6B] bg-[#7CFF6B] text-black font-bold"
                                : "border-[#444] bg-transparent text-transparent hover:border-[#7CFF6B]"
                            }`}
                          >
                            ✓
                          </div>
                          <div>
                            <span
                              className={`text-xs block ${
                                done
                                  ? "line-through text-[#666]"
                                  : "text-[#EEE] font-medium"
                              }`}
                            >
                              {item.milestone.title}
                            </span>
                            <span className="text-[10px] text-[#7CFF6B]/70 font-sans block mt-0.5">
                              From Roadmap: {item.goalTitle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              done
                                ? "text-[#666] bg-[#161616]"
                                : taskOverdue
                                ? "text-[#FF5F56] bg-[#FF5F56]/10 border border-[#FF5F56]/20 font-bold"
                                : "text-[#AAA] bg-[#1A1A1A]"
                            }`}
                          >
                            {taskOverdue
                              ? `Overdue (${localDate(item.milestone.dueAt)})`
                              : localDate(item.milestone.dueAt)}
                          </span>

                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDelete({
                                  kind: "milestone",
                                  id: `${item.goal._id}-${item.index}`,
                                  title: item.milestone.title,
                                  parentGoal: item.goal,
                                  milestoneIndex: item.index,
                                })
                              }
                              title="Delete action task"
                              className="opacity-0 group-hover:opacity-100 p-1 text-[#666] hover:text-[#FF5F56] transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center text-[#666]">
                  <p>No action tasks matching &quot;{tasksFilter}&quot;.</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ─── MODAL: ADD / EDIT EXPENSE WITH TAG SYSTEM ─── */}
      {expenseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setExpenseModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[#262626] bg-[#0E0E0E] p-6 space-y-5 shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                {editingExpense ? "Edit Expense" : "Record New Expense"}
              </h2>
              <button
                onClick={() => setExpenseModalOpen(false)}
                className="p-1.5 rounded-lg text-[#666] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form
              key={editingExpense?._id || "new-expense"}
              onSubmit={saveExpense}
              className="space-y-4 text-xs font-sans"
            >
              <Field
                name="title"
                label="Description / Item Name"
                defaultValue={editingExpense?.title}
                placeholder="e.g. Domain renewal, Team lunch, Vercel subscription..."
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
                  placeholder="0.00"
                  required
                />
                <Field
                  name="category"
                  label="Category"
                  defaultValue={editingExpense?.category}
                  placeholder="Software, Food, Tools..."
                  required
                />
              </div>

              {/* Tag System Section */}
              <div className="space-y-2 rounded-xl border border-[#222] bg-[#141414] p-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-[#AAA] flex items-center gap-1.5">
                    <Tag size={12} className="text-[#7CFF6B]" />
                    <span>Expense Tags</span>
                  </label>
                  <span className="text-[10px] text-[#666] font-mono">
                    Select or type tags
                  </span>
                </div>

                {/* Selected Tag Badges */}
                <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
                  {expenseTags.length > 0 ? (
                    expenseTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => toggleExpenseTag(tag)}
                          className="hover:text-white"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-[#555] font-mono italic">
                      No tags attached yet
                    </span>
                  )}
                </div>

                {/* Preset Suggestions */}
                <div className="pt-2 border-t border-[#1C1C1C]">
                  <span className="text-[10px] font-mono text-[#666] block mb-1">
                    Quick suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_TAGS.map((tag) => {
                      const selected = expenseTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleExpenseTag(tag)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                            selected
                              ? "bg-[#7CFF6B] text-black font-semibold"
                              : "bg-[#1E1E1E] text-[#888] hover:text-[#CCC] border border-[#282828]"
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Tag Input */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="relative flex-1">
                    <Hash
                      size={12}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555]"
                    />
                    <input
                      type="text"
                      placeholder="Add custom tag..."
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addCustomTag();
                        }
                      }}
                      className="w-full pl-7 pr-2.5 py-1.5 rounded-lg border border-[#282828] bg-[#0E0E0E] text-xs font-mono text-[#F5F5F0] placeholder-[#555] outline-none focus:border-[#7CFF6B]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addCustomTag}
                    className="px-3 py-1.5 rounded-lg bg-[#222] hover:bg-[#7CFF6B] hover:text-black font-mono text-[11px] text-[#AAA] transition"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <Field
                name="spentAt"
                label="Date of Expenditure"
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
                label="Optional Reference Note"
                defaultValue={editingExpense?.note}
                placeholder="Invoice ID, payment method, vendor..."
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1C1C1C]">
                <button
                  type="button"
                  onClick={() => setExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#AAA] hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition shadow-lg shadow-[#7CFF6B]/10"
                >
                  {editingExpense ? "Save Changes" : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD / EDIT NOTE ─── */}
      {noteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setNoteModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[#262626] bg-[#0E0E0E] p-6 space-y-5 shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                {editingNote ? "Edit Daily Note" : "Capture Daily Note"}
              </h2>
              <button
                onClick={() => setNoteModalOpen(false)}
                className="p-1.5 rounded-lg text-[#666] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form
              key={editingNote?._id || "new-note"}
              onSubmit={saveNote}
              className="space-y-4 text-xs font-sans"
            >
              <Field
                name="title"
                label="Note Title"
                defaultValue={editingNote?.title}
                placeholder="Key accomplishments or focus today..."
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
                <span>Content / Reflections</span>
                <textarea
                  name="content"
                  defaultValue={editingNote?.content}
                  required
                  rows={7}
                  placeholder="Record insights, blockers, decisions..."
                  maxLength={12000}
                  className="w-full resize-y rounded-xl border border-[#262626] bg-[#121212] px-3.5 py-2.5 text-sm text-[#F5F5F0] outline-none focus:border-[#7CFF6B]"
                />
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1C1C1C]">
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#AAA] hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition shadow-lg shadow-[#7CFF6B]/10"
                >
                  {editingNote ? "Save Changes" : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: DEFINE / EDIT GOAL ─── */}
      {goalModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setGoalModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[#262626] bg-[#0E0E0E] p-6 space-y-5 shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                {editingGoal ? "Edit Goal Roadmap" : "Define New Goal & Roadmap"}
              </h2>
              <button
                onClick={() => setGoalModalOpen(false)}
                className="p-1.5 rounded-lg text-[#666] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form
              key={editingGoal?._id || "new-goal"}
              onSubmit={saveGoal}
              className="space-y-4 text-xs font-sans"
            >
              <Field
                name="title"
                label="Target Goal"
                defaultValue={editingGoal?.title}
                placeholder="Launch Shopify theme v2, Finish certification..."
                required
              />

              <Field
                name="description"
                label="Objective &amp; Expected Outcome"
                defaultValue={editingGoal?.description}
                placeholder="What does success look like?"
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  name="startsAt"
                  label="Start Date"
                  type="date"
                  defaultValue={
                    editingGoal
                      ? dateInput(new Date(editingGoal.startsAt))
                      : dateInput()
                  }
                  required
                />
                <Field
                  name="dueAt"
                  label="Target Deadline"
                  type="date"
                  defaultValue={
                    editingGoal
                      ? dateInput(new Date(editingGoal.dueAt))
                      : dateInput(new Date(Date.now() + 14 * 86400000))
                  }
                  required
                />
              </div>

              <Field
                name="progress"
                label="Current Progress (0 - 100%)"
                type="number"
                min="0"
                max="100"
                defaultValue={editingGoal ? String(editingGoal.progress) : "0"}
              />

              {!editingGoal && (
                <label className="block space-y-1.5 text-xs text-[#A1A1A1]">
                  <span>Action Tasks (One per line: &quot;Task Title | YYYY-MM-DD&quot;)</span>
                  <textarea
                    name="milestones"
                    rows={3}
                    placeholder={`Design finalized | ${dateInput(new Date(Date.now() + 3 * 86400000))}\nImplementation complete | ${dateInput(new Date(Date.now() + 10 * 86400000))}`}
                    className="w-full resize-y rounded-xl border border-[#262626] bg-[#121212] px-3.5 py-2.5 text-xs font-mono text-[#F5F5F0] outline-none focus:border-[#7CFF6B]"
                  />
                </label>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1C1C1C]">
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#AAA] hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition shadow-lg shadow-[#7CFF6B]/10"
                >
                  {editingGoal ? "Save Changes" : "Create Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CONFIRM PERMANENT DELETE MODAL ─── */}
      <ConfirmModal
        isOpen={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={
          confirmDelete?.kind === "milestone"
            ? "Delete Action Task"
            : confirmDelete?.kind === "expenses"
            ? "Delete Expense Record"
            : confirmDelete?.kind === "notes"
            ? "Delete Daily Note"
            : "Delete Roadmap Goal"
        }
        message="Are you sure you want to permanently delete this? It will be completely removed and cannot be recovered."
        itemName={confirmDelete?.title}
        confirmText="Yes, Delete Permanently"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
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
      <span>{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#262626] bg-[#121212] px-3.5 py-2.5 text-sm text-[#F5F5F0] outline-none focus:border-[#7CFF6B] [color-scheme:dark] transition"
      />
    </label>
  );
}
