"use client";
import { useState } from "react";

const PORTFOLIO_TYPES = [
  { value: "very_conservative", label: "Very Conservative" },
  { value: "conservative", label: "Conservative" },
  { value: "balanced", label: "Balanced" },
  { value: "growth", label: "Growth" },
];

export default function CreateGoalPage() {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [portfolioType, setPortfolioType] = useState("balanced");
  const [loading, setLoading] = useState(false);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const amountCents = Math.round(Number(targetAmount) * 100);
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name,
          targetAmountCents: amountCents,
          targetDate,
          portfolioType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Create goal failed");
      setGoalId(data.goal.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create your goal</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full rounded border p-2"
          placeholder="Your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Goal name (e.g., Grad Trip)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          className="w-full rounded border p-2"
          placeholder="Target amount (e.g., 3500)"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full rounded border p-2"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
        />
        <select
          className="w-full rounded border p-2"
          value={portfolioType}
          onChange={(e) => setPortfolioType(e.target.value)}
        >
          {PORTFOLIO_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create goal"}
        </button>
      </form>
      {goalId && (
        <div className="rounded border bg-green-50 p-3 text-green-800">
          Goal created! ID: <strong>{goalId}</strong>
        </div>
      )}
      {error && <div className="rounded border bg-red-50 p-3 text-red-800">{error}</div>}
    </div>
  );
}


