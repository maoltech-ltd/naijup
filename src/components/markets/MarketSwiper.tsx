"use client";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { fetchFxRates, fetchMarketEquity, fetchMarketSnapshot } from "@/src/redux/slice/marketSlice";
import { NbsIndicator, useNbsIndicators } from "../Hooks/useNbsIndicators";
import { useCbnKeyRates } from "../Hooks/useCbnKeyRates";

// A rise in inflation or fuel prices hurts households, so "up" is shown red.
const nbsTone = (direction: NbsIndicator["direction"]) =>
  direction === "up" ? "text-red-500" : direction === "down" ? "text-green-500" : "text-gray-500";

const signed = (value: number, digits = 2) => `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`;

const formatCbnRate = (value: number, unit: string) =>
  unit === "NGN"
    ? `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `${value.toFixed(2)}%`;

const MarketSwiper = () => {
  const dispatch = useAppDispatch();

  const fx = useSelector((state: RootState) => state.fx);
  const snapshot = useSelector((state: RootState) => state.snapshot);
  const equity = useSelector((state: RootState) => state.equity);
  // NBS / CBN load independently: their slides appear once data arrives and
  // are simply left out if either source is unavailable.
  const { data: nbs } = useNbsIndicators();
  const { data: cbn } = useCbnKeyRates();
  const inflationHeadline = nbs?.inflation?.headline;
  const inflationComponents = (nbs?.inflation?.components || []).filter((item) => item.code !== "ALL_ITEMS");

  useEffect(() => {
    if (fx.status === "idle") dispatch(fetchFxRates());
    if (snapshot.status === "idle") dispatch(fetchMarketSnapshot());
    if (equity.status === "idle") dispatch(fetchMarketEquity());
  }, [dispatch, fx.status, snapshot.status, equity.status]);

  if(fx.status == "loading" || snapshot.status == "loading" || equity.status == "loading"){
    return (
      <div className="col-span-2 sm:col-span-1 row-span-1 min-h-[190px] rounded-xl bg-dark/5 dark:bg-light/5 skeleton" />
    )
  }

  if(fx.status == "failed" || snapshot.status === "failed" || equity.status == "failed"){
    return (
      <div className="col-span-2 sm:col-span-1 row-span-1 min-h-[190px] rounded-xl border border-dashed border-dark/10 p-4 text-sm text-gray-500 dark:border-light/10 dark:text-light/50">
        Market stats are temporarily unavailable.
      </div>
    )
  }

  // Every slide shares the same min-height so autoplay never reflows the
  // surrounding grid as it cycles between differently-sized slide content.
  const slideClass = "min-h-[190px] p-4 rounded-xl shadow bg-white dark:bg-dark dark:text-light"

  return (
    <div className="col-span-2 sm:col-span-1 row-span-1 relative">
      <Swiper spaceBetween={16} slidesPerView={1} modules={[Autoplay]} autoplay={{ delay: 4000 }}>
        {/* --- FX Rates --- */}
        <SwiperSlide>
          <div className={slideClass}>
            <h3 className="font-bold text-lg mb-2">Currency FX (₦)</h3>
            <div className="grid grid-cols-2 gap-2">
              {fx.data &&
                Object.entries(fx.data.fx_rates)
                  .filter(([k]) => k.includes("_to_NGN"))
                  .map(([currency, rate]) => (
                    <div key={currency} className="text-sm">
                      <p className="text-gray-500">{currency.replace("_to_NGN", "")}</p>
                      <p className="font-bold">{rate.toLocaleString()}</p>
                    </div>
                  ))}
            </div>
          </div>
        </SwiperSlide>

        {/* --- NGX Snapshot --- */}
        <SwiperSlide>
          <div className={slideClass}>
            <h3 className="font-bold text-lg mb-2">NGX Snapshot</h3>
            {snapshot.data && (
              <ul className="text-sm space-y-1">
                <li>ASI: {snapshot.data.ASI.toLocaleString()}</li>
                <li>Deals: {snapshot.data.DEALS.toLocaleString()}</li>
                <li>Volume: {snapshot.data.VOLUME.toLocaleString()}</li>
                <li>Value: ₦{snapshot.data.VALUE.toLocaleString()}</li>
                <li>Market Cap: ₦{snapshot.data.CAP.toLocaleString()}</li>
              </ul>
            )}
          </div>
        </SwiperSlide>

        {/* --- Top Gainers --- */}
        <SwiperSlide>
          <div className={slideClass}>
            <h3 className="font-bold text-lg mb-2">Top Gainers</h3>
            <ul className="text-sm space-y-1">
              {equity.data?.top_gainers?.slice(0, 5).map((g: any) => (
                <li key={g.ID} className="flex justify-between">
                  <span>{g.SYMBOL}</span>
                  <span className="text-green-500">+{g.PERCENTAGE_CHANGE}%</span>
                </li>
              ))}
            </ul>
          </div>
        </SwiperSlide>

        {/* --- Top Losers --- */}
        <SwiperSlide>
          <div className={slideClass}>
            <h3 className="font-bold text-lg mb-2">Top Losers</h3>
            <ul className="text-sm space-y-1">
              {equity.data?.top_losers?.slice(0, 5).map((l: any) => (
                <li key={l.ID} className="flex justify-between">
                  <span>{l.SYMBOL}</span>
                  <span className="text-red-500">{l.PERCENTAGE_CHANGE}%</span>
                </li>
              ))}
            </ul>
          </div>
        </SwiperSlide>

        {/* --- Top Trades --- */}
        <SwiperSlide>
          <div className={slideClass}>
            <h3 className="font-bold text-lg mb-2">Top Trades</h3>
            <ul className="text-sm space-y-1">
              {equity.data?.top_trades?.slice(0, 5).map((t: any) => (
                <li key={t.Id} className="flex justify-between">
                  <span>{t.Symbol}</span>
                  <span>{t.Volume.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </SwiperSlide>
        {/* --- NBS Inflation --- */}
        {inflationHeadline && (
          <SwiperSlide>
            <div className={slideClass}>
              <h3 className="font-bold text-lg mb-2">
                Inflation (NBS){inflationHeadline.period ? ` · ${inflationHeadline.period}` : ""}
              </h3>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-gray-500">Headline (y/y)</span>
                <span className="text-right">
                  <span className="font-bold text-base">{inflationHeadline.value.toFixed(2)}%</span>
                  {inflationHeadline.change !== null && (
                    <span className={`ml-2 text-xs ${nbsTone(inflationHeadline.direction)}`}>
                      {signed(inflationHeadline.change)} pts
                    </span>
                  )}
                </span>
              </div>
              <ul className="mt-2 text-sm space-y-1">
                {inflationComponents.slice(0, 4).map((item) => (
                  <li key={item.code} className="flex justify-between">
                    <span>{item.label}</span>
                    <span>
                      {item.value.toFixed(2)}%
                      {item.change !== null && (
                        <span className={`ml-2 text-xs ${nbsTone(item.direction)}`}>{signed(item.change)}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </SwiperSlide>
        )}

        {/* --- NBS Fuel Prices --- */}
        {!!nbs?.petroleum?.length && (
          <SwiperSlide>
            <div className={slideClass}>
              <h3 className="font-bold text-lg mb-2">Fuel Prices (NBS)</h3>
              <ul className="text-sm space-y-1">
                {nbs.petroleum.slice(0, 5).map((item) => (
                  <li key={item.code} className="flex justify-between gap-2">
                    <span className="truncate" title={item.name || item.label}>
                      {item.code}
                      {item.period && <span className="ml-1 text-xs text-gray-500">{item.period}</span>}
                    </span>
                    <span className="flex-none">
                      ₦{item.value.toLocaleString("en-NG", { maximumFractionDigits: 2 })}
                      {item.change_percent !== null && (
                        <span className={`ml-2 text-xs ${nbsTone(item.direction)}`}>{signed(item.change_percent, 1)}%</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </SwiperSlide>
        )}

        {/* --- CBN Key Rates --- */}
        {!!cbn?.rates?.length && (
          <SwiperSlide>
            <div className={slideClass}>
              <h3 className="font-bold text-lg mb-2">CBN Key Rates</h3>
              <ul className="text-sm space-y-1">
                {cbn.rates.slice(0, 5).map((rate) => (
                  <li key={rate.code} className="flex justify-between gap-2">
                    <span className="truncate">{rate.label}</span>
                    <span className="flex-none font-medium">{formatCbnRate(rate.value, rate.unit)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default MarketSwiper;
