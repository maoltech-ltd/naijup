"use client";

import { useCallback, useEffect, useState } from "react";
import AdminProtectedRoute from "@/src/components/AdminProtectedRoute";
import { canAccessAdminReports } from "@/src/utils/adminAccess";
import {
  PremiumSettings,
  PremiumSubscriber,
  formatNaira,
  getAdminPremiumSettings,
  getAdminSubscribers,
  saveAdminPremiumSettings,
  updateAdminSubscriber,
} from "@/src/utils/premium";

const input =
  "w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-white";
const button =
  "rounded-full bg-dark px-4 py-2 text-sm font-semibold text-light transition hover:opacity-90 disabled:opacity-50 dark:bg-light dark:text-dark";

function apiError(e: any) {
  const data = e?.response?.data;
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    return Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`).join("; ");
  }
  return e?.message || "Request failed.";
}

function formatDate(value: string | null) {
  return value
    ? new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : "—";
}

function PlanFields({
  label,
  prefix,
  values,
  onChange,
}: {
  label: string;
  prefix: "monthly" | "yearly";
  values: PremiumSettings;
  onChange: (field: keyof PremiumSettings, value: any) => void;
}) {
  const enabledKey = `${prefix}_enabled` as const;
  const priceKey = `${prefix}_price` as const;
  const daysKey = `${prefix}_days` as const;
  return (
    <fieldset className="rounded-xl border border-dark/10 p-4 dark:border-light/10">
      <legend className="px-1 font-semibold">{label}</legend>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={values[enabledKey]} onChange={(e) => onChange(enabledKey, e.target.checked)} />
        Offer this plan
      </label>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-sm">
          Price (₦)
          <input
            type="number"
            min={0}
            className={`${input} mt-1`}
            value={values[priceKey]}
            onChange={(e) => onChange(priceKey, Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          Access length (days)
          <input
            type="number"
            min={1}
            className={`${input} mt-1`}
            value={values[daysKey]}
            onChange={(e) => onChange(daysKey, Number(e.target.value))}
          />
        </label>
      </div>
    </fieldset>
  );
}

function PremiumAdmin({ token }: { token: string }) {
  const [settings, setSettings] = useState<PremiumSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("active");
  const [query, setQuery] = useState("");
  const [subscribers, setSubscribers] = useState<PremiumSubscriber[]>([]);
  const [counts, setCounts] = useState({ active: 0, expired: 0 });
  const [grantEmail, setGrantEmail] = useState("");
  const [grantDays, setGrantDays] = useState(30);

  useEffect(() => {
    getAdminPremiumSettings(token).then(setSettings).catch((e) => setError(apiError(e)));
  }, [token]);

  const loadSubscribers = useCallback(() => {
    getAdminSubscribers(token, filter, query)
      .then((data) => {
        setSubscribers(data.results);
        setCounts(data.counts);
      })
      .catch((e) => setError(apiError(e)));
  }, [token, filter, query]);

  useEffect(() => {
    const timer = setTimeout(loadSubscribers, 250);
    return () => clearTimeout(timer);
  }, [loadSubscribers]);

  const flash = (message: string) => {
    setError("");
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      setSettings(await saveAdminPremiumSettings(token, settings));
      flash("Premium settings saved. New checkouts use these prices now.");
    } catch (e) {
      setError(apiError(e));
    } finally {
      setSaving(false);
    }
  };

  const change = async (target: { userId?: number; email?: string }, body: any, message: string) => {
    try {
      await updateAdminSubscriber(token, target, body);
      flash(message);
      loadSubscribers();
    } catch (e) {
      setError(apiError(e));
    }
  };

  const setField = (field: keyof PremiumSettings, value: any) =>
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 text-dark dark:text-light">
      <h1 className="text-2xl font-bold md:text-3xl">Premium management</h1>
      <p className="mt-1 text-sm text-dark/60 dark:text-light/60">
        Price changes apply to new checkouts only; existing members keep the access they paid for.
      </p>

      {notice && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">{notice}</p>}
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</p>}

      <section className="mt-8">
        <h2 className="text-lg font-bold">Pricing &amp; expiry</h2>
        {settings ? (
          <>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <PlanFields label="Yearly plan" prefix="yearly" values={settings} onChange={setField} />
              <PlanFields label="Monthly plan" prefix="monthly" values={settings} onChange={setField} />
            </div>
            <label className="mt-4 block max-w-sm text-sm">
              Send an expiry reminder this many days before access ends (0 = off)
              <input
                type="number"
                min={0}
                max={60}
                className={`${input} mt-1`}
                value={settings.reminder_days_before}
                onChange={(e) => setField("reminder_days_before", Number(e.target.value))}
              />
            </label>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button type="button" className={button} onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save settings"}
              </button>
              {settings.updated_at && (
                <span className="text-xs text-dark/60 dark:text-light/60">
                  Last changed {formatDate(settings.updated_at)}{settings.updated_by ? ` by ${settings.updated_by}` : ""}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-dark/60 dark:text-light/60">
              Yearly works out to {formatNaira(Math.round(settings.yearly_price / 12))} a month.
            </p>
          </>
        ) : (
          <p className="mt-4 text-sm text-dark/60 dark:text-light/60">Loading…</p>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-bold">Members</h2>
        <p className="mt-1 text-sm text-dark/60 dark:text-light/60">
          {counts.active} active · {counts.expired} expired. Access ends automatically at the expiry date.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-dark/10 p-4 dark:border-light/10">
          <label className="min-w-[220px] flex-1 text-sm">
            Grant or extend Premium by email
            <input className={`${input} mt-1`} type="email" value={grantEmail} onChange={(e) => setGrantEmail(e.target.value)} placeholder="reader@example.com" />
          </label>
          <label className="w-28 text-sm">
            Days
            <input className={`${input} mt-1`} type="number" min={1} value={grantDays} onChange={(e) => setGrantDays(Number(e.target.value))} />
          </label>
          <button
            type="button"
            className={button}
            disabled={!grantEmail}
            onClick={() => change({ email: grantEmail }, { extend_days: grantDays }, `Added ${grantDays} days for ${grantEmail}.`)}
          >
            Grant
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["active", "expiring", "expired", ""].map((value) => (
            <button
              key={value || "all"}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                filter === value ? "bg-dark text-light dark:bg-light dark:text-dark" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {value ? value[0].toUpperCase() + value.slice(1) : "All"}
            </button>
          ))}
          <input className={`${input} max-w-xs`} placeholder="Search email or username" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-dark/10 text-xs uppercase text-dark/60 dark:border-light/10 dark:text-light/60">
              <tr>
                <th className="py-2 pr-3">Member</th>
                <th className="py-2 pr-3">Plan</th>
                <th className="py-2 pr-3">Expires</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.user_id} className="border-b border-dark/5 dark:border-light/5">
                  <td className="py-2 pr-3">
                    <div className="font-medium">{s.email}</div>
                    <div className="text-xs text-dark/60 dark:text-light/60">{s.username}</div>
                  </td>
                  <td className="py-2 pr-3 capitalize">{s.plan || "—"}</td>
                  <td className="py-2 pr-3">{formatDate(s.current_period_end)}</td>
                  <td className="py-2 pr-3">
                    <span className={s.is_active ? "text-emerald-700 dark:text-emerald-400" : "text-dark/50 dark:text-light/50"}>
                      {s.is_active ? "Active" : "Expired"}
                    </span>
                  </td>
                  <td className="space-x-3 whitespace-nowrap py-2">
                    <button type="button" className="text-sm font-semibold text-accent dark:text-accentDark" onClick={() => change({ userId: s.user_id }, { extend_days: 30 }, `Extended ${s.email} by 30 days.`)}>
                      +30 days
                    </button>
                    <button type="button" className="text-sm font-semibold text-accent dark:text-accentDark" onClick={() => change({ userId: s.user_id }, { extend_days: 365 }, `Extended ${s.email} by 365 days.`)}>
                      +1 year
                    </button>
                    {s.is_active && (
                      <button
                        type="button"
                        className="text-sm font-semibold text-red-600 dark:text-red-400"
                        onClick={() => {
                          if (window.confirm(`End Premium for ${s.email} now?`)) {
                            change({ userId: s.user_id }, { revoke: true }, `Ended Premium for ${s.email}.`);
                          }
                        }}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!subscribers.length && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-dark/60 dark:text-light/60">No members match.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default function AdminPremiumPage() {
  return (
    <AdminProtectedRoute>
      {({ user }: any) =>
        user?.token && canAccessAdminReports(user.userEmail) ? <PremiumAdmin token={user.token} /> : null
      }
    </AdminProtectedRoute>
  );
}
