import "@/src/app/globals.css";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-white text-gray-900">
      <main className="mx-auto max-w-2xl p-4 sm:p-6">{children}</main>
    </div>
  );
}


