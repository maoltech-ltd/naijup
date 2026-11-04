"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown } from "lucide-react";
import {
  PremiumSettings,
  formatNaira,
  getAdminPremiumSettings,
  saveAdminPremiumSettings,
} from "@/src/utils/premium";

const input =
  "mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-white";

function apiError(e: any) {
  const data = e?.response?.data;
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
      .join("; ");
  }
  return e?.message || "Request failed.";
}

/** Quick editor for Premium fees, shown to super admins on the dashboard.
 *  Full settings (plan lengths, reminders, members) live at /admin/premium. */
export default function PremiumFeeEditor({ token }: { token: string }) {
  const [settings, setSettings] = useState<PremiumSettings | null>(null);
  const [monthly, setMonthly] = useState("");
  const [yearly, setYearly] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const apply = (s: PremiumSettings) => {
    setSettings(s);
    setMonthly(String(s.monthly_price));
    setYearly(String(s.yearly_price));
  };

  useEffect(() => {
    getAdminPremiumSettings(token).then(apply).catch((e) => setError(apiError(e)));
  }, [token]);

  const dirty =
    !!settings && (Number(monthly) !== settings.monthly_price || Number(yearly) !== settings.yearly_price);

  const save = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      apply(
        await saveAdminPremiumSettings(token, {
          monthly_price: Number(monthly),
          yearly_price: Number(yearly),
        })
      );
      setNotice("Premium fees updated. New checkouts use these prices now.");
    } catch (e) {
      setError(apiError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-amber-200 p-4 dark:border-amber-900/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-light">
          <Crown size={18} className="text-amber-600 dark:text-amber-300" />
          Premium fees
        </h3>
        <Link
          href="/admin/premium"
          className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-300"
        >
          All Premium settings &amp; members →
        </Link>
      </div>

      {!settings && !error && <p className="mt-3 text-sm text-gray-500 dark:text-light/60">Loading…</p>}

      {settings && (
        <form
          className="mt-4 flex flex-wrap items-end gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <label className="w-44 text-sm text-gray-700 dark:text-light/80">
            Monthly fee (₦) · {settings.monthly_days} days
            <input
              type="number"
              min={0}
              className={input}
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              disabled={!settings.monthly_enabled}
            />
          </label>
          <label className="w-44 text-sm text-gray-700 dark:text-light/80">
            Yearly fee (₦) · {settings.yearly_days} days
            <input
              type="number"
              min={0}
              className={input}
              value={yearly}
              onChange={(e) => setYearly(e.target.value)}
              disabled={!settings.yearly_enabled}
            />
          </label>
          <button
            type="submit"
            disabled={!dirty || saving || monthly === "" || yearly === ""}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save fees"}
          </button>
        </form>
      )}

      {settings && (
        <p className="mt-2 text-xs text-gray-500 dark:text-light/50">
          Yearly works out to {formatNaira(Math.round(Number(yearly || 0) / 12))} a month. Price changes apply to new
          checkouts only; existing members keep the access they paid for.
          {(!settings.monthly_enabled || !settings.yearly_enabled) && " Disabled plans are edited on the full settings page."}
        </p>
      )}
      {notice && <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
