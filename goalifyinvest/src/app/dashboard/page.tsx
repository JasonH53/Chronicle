"use client";
import { useEffect, useState } from "react";

type Goal = {
  id: string;
  name: string;
  targetAmountCents: number;
  portfolioId: string;
};

export default function DashboardPage() {
  const [userId, setUserId] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadGoals() {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/goals?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to load goals");
      setGoals(data.goals);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // no-op initial
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Your goals</h1>
      <div className="flex gap-2">
        <input
          className="w-full rounded border p-2"
          placeholder="Your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={loadGoals} className="rounded bg-black px-4 py-2 text-white">
          Load
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <div className="rounded border bg-red-50 p-3 text-red-800">{error}</div>}
      <ul className="space-y-4">
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
      </ul>
    </div>
  );
}

function centsToDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

function GoalCard({ goal }: { goal: Goal }) {
  const [portfolio, setPortfolio] = useState<{ current_value_cents: number } | null>(null);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function fetchPortfolio() {
    const res = await fetch(`/api/portfolios/${goal.portfolioId}`);
    const data = await res.json();
    if (res.ok) setPortfolio(data.portfolio);
  }

  async function addFunds() {
    setBusy(true);
    setMsg(null);
    try {
      const amountCents = Math.round(Number(amount) * 100);
      const res = await fetch(`/api/portfolios/${goal.portfolioId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents }),
      });
      if (!res.ok) throw new Error("Transfer failed");
      await fetchPortfolio();
      setMsg("Transfer complete");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = portfolio?.current_value_cents ?? 0;
  const pct = Math.max(0, Math.min(100, Math.round((current / goal.targetAmountCents) * 100)));

  return (
    <li className="rounded border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-medium">{goal.name}</h2>
        <span className="text-sm text-gray-600">${centsToDollars(current)} / ${centsToDollars(goal.targetAmountCents)}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded bg-gray-200">
        <div className="h-full bg-black" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="number"
          className="w-40 rounded border p-2"
          placeholder="Amount ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button disabled={busy} onClick={addFunds} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
          {busy ? "Transferring..." : "Add Funds"}
        </button>
      </div>
      {msg && <p className="mt-2 text-sm text-gray-700">{msg}</p>}
    </li>
  );
}


