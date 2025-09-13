export default function Home() {
  return (
    <div className="min-h-screen grid place-items-center p-8">
      <main className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-semibold">GoalifyInvest</h1>
        <p className="text-sm text-gray-600">Demystify investing by anchoring it to your real-life goals.</p>
        <div className="flex gap-3 justify-center">
          <a className="rounded bg-black px-4 py-2 text-white" href="/signup">Sign up</a>
          <a className="rounded border px-4 py-2" href="/create-goal">Create Goal</a>
          <a className="rounded border px-4 py-2" href="/dashboard">Dashboard</a>
        </div>
      </main>
    </div>
  );
}
