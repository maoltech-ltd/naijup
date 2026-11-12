"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { fetchFxRates, fetchMarketEquity, fetchMarketSnapshot } from "@/src/redux/slice/marketSlice";
import { NbsIndicator, useNbsIndicators } from "../Hooks/useNbsIndicators";
import { useCbnKeyRates } from "../Hooks/useCbnKeyRates";
import { MarketPulseSkeleton } from "./MarketPulseSkeleton";

// "Market Pulse" card on the homepage. A tiny dependency-free slider
// (no Swiper runtime/CSS) with tabs, arrows, swipe, pause-on-hover and an
// autoplay progress bar. Slides are only shown for data that loaded, so one
// failing source no longer hides the whole widget.

const AUTOPLAY_MS = 6000;

const nf = (value: number, digits = 2) =>
  value.toLocaleString("en-NG", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const compact = (value: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(value);

const signed = (value: number, digits = 2) => `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`;

// A rise in inflation or fuel prices hurts households, so "up" is shown red.
const costTone = (direction?: NbsIndicator["direction"]) =>
  direction === "up"
    ? "text-red-600 dark:text-red-400"
    : direction === "down"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-gray";

const changeTone = (value: number) =>
  value > 0 ? "text-emerald-600 dark:text-emerald-400" : value < 0 ? "text-red-600 dark:text-red-400" : "text-gray";

type Row = { key: string; label: React.ReactNode; value: React.ReactNode; change?: React.ReactNode };
type Slide = { key: string; tab: string; title: string; note?: string; rows: Row[] };

function Rows({ rows }: { rows: Row[] }) {
  return (
    <ul className="divide-y divide-dark/[0.07] dark:divide-light/10">
      {rows.map((row) => (
        <li key={row.key} className="flex h-10 items-center justify-between gap-3 text-sm">
          <span className="min-w-0 truncate font-medium text-dark/70 dark:text-light/70">{row.label}</span>
          <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
            <span className="font-semibold text-dark dark:text-light">{row.value}</span>
            {row.change}
          </span>
        </li>
      ))}
    </ul>
  );
}

const MarketSwiper = () => {
  const dispatch = useAppDispatch();
  const fx = useSelector((state: RootState) => state.fx);
  const snapshot = useSelector((state: RootState) => state.snapshot);
  const equity = useSelector((state: RootState) => state.equity);
  const { data: nbs } = useNbsIndicators();
  const { data: cbn } = useCbnKeyRates();

  useEffect(() => {
    if (fx.status === "idle") dispatch(fetchFxRates());
    if (snapshot.status === "idle") dispatch(fetchMarketSnapshot());
    if (equity.status === "idle") dispatch(fetchMarketEquity());
  }, [dispatch, fx.status, snapshot.status, equity.status]);

  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = [];

    const fxRows = Object.entries(fx.data?.fx_rates || {})
      .filter(([k, v]) => k.includes("_to_NGN") && typeof v === "number")
      .slice(0, 5)
      .map(([k, v]) => ({ key: k, label: k.replace("_to_NGN", ""), value: `₦${nf(v)}` }));
    if (fxRows.length) list.push({ key: "fx", tab: "FX", title: "Naira exchange rates", note: "₦ per unit", rows: fxRows });

    const s = snapshot.data;
    if (s && typeof s.ASI === "number") {
      list.push({
        key: "ngx",
        tab: "NGX",
        title: "NGX market snapshot",
        rows: [
          { key: "asi", label: "All-Share Index", value: nf(s.ASI) },
          { key: "cap", label: "Market cap", value: `₦${compact(s.CAP)}` },
          { key: "value", label: "Value traded", value: `₦${compact(s.VALUE)}` },
          { key: "vol", label: "Volume", value: compact(s.VOLUME) },
          { key: "deals", label: "Deals", value: s.DEALS.toLocaleString() },
        ],
      });
    }

    const pct = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? (
        <span className={`w-16 text-right text-xs font-semibold ${changeTone(n)}`}>{signed(n)}%</span>
      ) : null;
    };

    const gainers = equity.data?.top_gainers?.slice(0, 5) || [];
    if (gainers.length) {
      list.push({
        key: "gainers",
        tab: "Gainers",
        title: "Top gainers",
        rows: gainers.map((g: any) => ({ key: String(g.ID ?? g.SYMBOL), label: g.SYMBOL, value: "", change: pct(g.PERCENTAGE_CHANGE) })),
      });
    }

    const losers = equity.data?.top_losers?.slice(0, 5) || [];
    if (losers.length) {
      list.push({
        key: "losers",
        tab: "Losers",
        title: "Top losers",
        rows: losers.map((l: any) => ({ key: String(l.ID ?? l.SYMBOL), label: l.SYMBOL, value: "", change: pct(l.PERCENTAGE_CHANGE) })),
      });
    }

    const trades = equity.data?.top_trades?.slice(0, 5) || [];
    if (trades.length) {
      list.push({
        key: "trades",
        tab: "Most traded",
        title: "Most traded by volume",
        rows: trades.map((t: any) => ({ key: String(t.Id ?? t.Symbol), label: t.Symbol, value: compact(Number(t.Volume) || 0) })),
      });
    }

    const headline = nbs?.inflation?.headline;
    if (headline) {
      const components = (nbs?.inflation?.components || []).filter((i) => i.code !== "ALL_ITEMS").slice(0, 4);
      const row = (i: NbsIndicator, label: React.ReactNode) => ({
        key: i.code,
        label,
        value: `${i.value.toFixed(2)}%`,
        change:
          i.change !== null ? (
            <span className={`w-14 text-right text-xs font-semibold ${costTone(i.direction)}`}>{signed(i.change)}</span>
          ) : null,
      });
      list.push({
        key: "inflation",
        tab: "Inflation",
        title: "Inflation (NBS)",
        note: headline.period || undefined,
        rows: [row(headline, <span className="font-semibold text-dark dark:text-light">Headline y/y</span>), ...components.map((c) => row(c, c.label))],
      });
    }

    if (nbs?.petroleum?.length) {
      list.push({
        key: "fuel",
        tab: "Fuel",
        title: "Fuel prices (NBS)",
        note: nbs.petroleum[0]?.period || undefined,
        rows: nbs.petroleum.slice(0, 5).map((i) => ({
          key: i.code,
          label: <span title={i.name || i.label}>{i.code}</span>,
          value: `₦${nf(i.value)}`,
          change:
            i.change_percent !== null ? (
              <span className={`w-14 text-right text-xs font-semibold ${costTone(i.direction)}`}>{signed(i.change_percent, 1)}%</span>
            ) : null,
        })),
      });
    }

    if (cbn?.rates?.length) {
      list.push({
        key: "cbn",
        tab: "CBN",
        title: "CBN key rates",
        rows: cbn.rates.slice(0, 5).map((r) => ({
          key: r.code,
          label: r.label,
          value: r.unit === "NGN" ? `₦${nf(r.value)}` : `${r.value.toFixed(2)}%`,
        })),
      });
    }

    return list;
  }, [fx.data, snapshot.data, equity.data, nbs, cbn]);

  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tick, setTick] = useState(0); // restarts the progress bar animation
  const touchX = useRef<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const count = slides.length;
  const current = Math.min(active, Math.max(count - 1, 0));
  const playing = count > 1 && !hovered && !userPaused && !reducedMotion;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const go = useCallback(
    (index: number) => {
      if (!count) return;
      setActive(((index % count) + count) % count);
      setTick((t) => t + 1);
    },
    [count]
  );

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (document.visibilityState === "visible") go(current + 1);
      else setTick((t) => t + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, current, tick, go]);

  // Keep the active tab in view on small screens without scrolling the page.
  useEffect(() => {
    const strip = tabsRef.current;
    const tab = strip?.children[current] as HTMLElement | undefined;
    if (strip && tab) {
      strip.scrollTo({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
    }
  }, [current]);

  const loading = [fx.status, snapshot.status, equity.status].some((st) => st === "idle" || st === "loading");
  if (!count && loading) return <MarketPulseSkeleton />;

  if (!count) {
    return (
      <div className="flex min-h-[200px] flex-col items-start justify-center gap-3 rounded-2xl border border-dashed border-dark/15 p-6 text-sm text-gray dark:border-light/15 dark:text-light/60">
        Market data is temporarily unavailable.
        <Link href="/market" className="font-semibold text-accent underline underline-offset-4 dark:text-accentDark">
          Open the markets page
        </Link>
      </div>
    );
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Market pulse"
      className="overflow-hidden rounded-2xl border border-dark/10 bg-surface-light dark:border-light/10 dark:bg-surface-dark"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-dark dark:text-light">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Market pulse
        </h3>
        <Link
          href="/market"
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline dark:text-accentDark"
        >
          Full markets <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div
        ref={tabsRef}
        role="tablist"
        aria-label="Market data"
        className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pt-3"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-controls={`pulse-${slide.key}`}
            onClick={() => go(i)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              i === current
                ? "bg-dark text-light dark:bg-light dark:text-dark"
                : "bg-dark/[0.05] text-dark/70 hover:bg-dark/10 dark:bg-light/10 dark:text-light/70 dark:hover:bg-light/15"
            }`}
          >
            {slide.tab}
          </button>
        ))}
      </div>

      <div
        className="relative h-[252px] overflow-hidden"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
        }}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.key}
              id={`pulse-${slide.key}`}
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${slide.title}`}
              aria-hidden={i !== current}
              className="h-full w-full shrink-0 px-5 pt-4"
            >
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <p className="text-base font-bold text-dark dark:text-light">{slide.title}</p>
                {slide.note && <p className="shrink-0 text-xs text-gray dark:text-light/50">{slide.note}</p>}
              </div>
              <Rows rows={slide.rows} />
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex h-[52px] items-center justify-between border-t border-dark/10 px-3 dark:border-light/10">
        {/* Autoplay progress */}
        {playing && (
          <span
            key={`${current}-${tick}`}
            aria-hidden
            className="absolute left-0 top-0 h-0.5 bg-accent dark:bg-accentDark"
            style={{ animation: `pulse-progress ${AUTOPLAY_MS}ms linear forwards` }}
          />
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(current - 1)}
            aria-label="Previous market slide"
            className="rounded-full p-2 text-dark/70 transition hover:bg-dark/5 hover:text-dark dark:text-light/70 dark:hover:bg-light/10 dark:hover:text-light"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(current + 1)}
            aria-label="Next market slide"
            className="rounded-full p-2 text-dark/70 transition hover:bg-dark/5 hover:text-dark dark:text-light/70 dark:hover:bg-light/10 dark:hover:text-light"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {count > 1 && !reducedMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? "Resume autoplay" : "Pause autoplay"}
              className="rounded-full p-2 text-dark/70 transition hover:bg-dark/5 hover:text-dark dark:text-light/70 dark:hover:bg-light/10 dark:hover:text-light"
            >
              {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          )}
        </div>
        <span className="pr-2 text-xs font-medium tabular-nums text-gray dark:text-light/50">
          {current + 1} / {count}
        </span>
      </div>
    </section>
  );
};

export default MarketSwiper;
