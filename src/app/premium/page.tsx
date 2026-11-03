"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import {
  PENDING_REFERENCE_KEY,
  PremiumPlan,
  PremiumStatus,
  formatNaira,
  getPremiumPlans,
  getPremiumStatus,
  setNewPostEmails,
  startPremiumCheckout,
} from "@/src/utils/premium";

const PERKS = [
  "Full access to every premium post",
  "The Investment Analysis section: ratings, price targets and research",
  "An email whenever a new post goes live",
];

function errorText(error: any) {
  return error?.response?.data?.detail || error?.message || "Something went wrong. Please try again.";
}

export default function PremiumPage() {
  const user = useSelector((state: RootState) => state.user);
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [status, setStatus] = useState<PremiumStatus | null>(null);
  const [busyPlan, setBusyPlan] = useState("");
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPremiumPlans()
      .then((data) => setPlans(data.plans))
      .catch(() => setError("Couldn't load plans. Please refresh the page."));
  }, []);

  useEffect(() => {
    if (!user?.token) {
      setStatus(null);
      return;
    }
    getPremiumStatus(user.token).then(setStatus).catch(() => setStatus(null));
  }, [user?.token]);

  const subscribe = async (plan: string) => {
    setError("");
    setBusyPlan(plan);
    try {
      const { reference, checkout_url } = await startPremiumCheckout(user.token, plan);
      try {
        sessionStorage.setItem(PENDING_REFERENCE_KEY, reference);
      } catch {}
      window.location.href = checkout_url;
    } catch (e) {
      setError(errorText(e));
      setBusyPlan("");
    }
  };

  const toggleEmails = async () => {
    if (!status) return;
    setSavingPrefs(true);
    try {
      setStatus(await setNewPostEmails(user.token, !status.notify_new_posts));
    } catch (e) {
      setError(errorText(e));
    } finally {
      setSavingPrefs(false);
    }
  };

  const activeUntil = status?.is_subscribed && status.current_period_end
    ? new Date(status.current_period_end).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const monthly = plans.find((p) => p.code === "monthly");

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 text-dark dark:text-light md:py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">NaijUp Premium</p>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">Read everything on NaijUp</h1>
      <ul className="mt-6 space-y-2">
        {PERKS.map((perk) => (
          <li key={perk} className="flex gap-2 text-dark/80 dark:text-light/80">
            <span aria-hidden="true" className="text-amber-600 dark:text-amber-300">✓</span>
            {perk}
          </li>
        ))}
      </ul>

      {activeUntil && (
        <div className="mt-8 rounded-2xl border border-emerald-300/60 bg-emerald-50 p-5 dark:border-emerald-400/30 dark:bg-emerald-400/5">
          <p className="font-semibold">Your Premium is active until {activeUntil}.</p>
          <p className="mt-1 text-sm text-dark/70 dark:text-light/70">Paying again adds time on top of your current period.</p>
          <label className="mt-4 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={status?.notify_new_posts ?? true}
              onChange={toggleEmails}
              disabled={savingPrefs}
              className="h-4 w-4 rounded"
            />
            Email me when a new post goes live
          </label>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => {
          const perMonth = plan.code === "yearly" ? Math.round(plan.amount / 12) : null;
          const saving = plan.code === "yearly" && monthly
            ? Math.round(100 - (plan.amount / (monthly.amount * 12)) * 100)
            : 0;
          return (
            <div key={plan.code} className="flex flex-col rounded-2xl border border-dark/10 p-6 dark:border-light/10">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold">{plan.name}</h2>
                {saving > 0 && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
                    Save {saving}%
                  </span>
                )}
              </div>
              <p className="mt-3 text-3xl font-bold">
                {formatNaira(plan.amount)}
                <span className="text-base font-medium text-dark/60 dark:text-light/60"> / {plan.days} days</span>
              </p>
              {perMonth && (
                <p className="mt-1 text-sm text-dark/60 dark:text-light/60">About {formatNaira(perMonth)} a month</p>
              )}
              <div className="mt-6 flex-1" />
              {user?.token ? (
                <button
                  type="button"
                  onClick={() => subscribe(plan.code)}
                  disabled={!!busyPlan}
                  className="rounded-full bg-dark px-6 py-3 text-sm font-semibold text-light transition hover:opacity-90 disabled:opacity-60 dark:bg-light dark:text-dark"
                >
                  {busyPlan === plan.code ? "Opening checkout…" : activeUntil ? "Extend" : "Subscribe"}
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="rounded-full bg-dark px-6 py-3 text-center text-sm font-semibold text-light transition hover:opacity-90 dark:bg-light dark:text-dark"
                >
                  Sign in to subscribe
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-dark/60 dark:text-light/60">
        One-off payment by card or bank transfer. Premium doesn&apos;t renew automatically.
      </p>
    </main>
  );
}
