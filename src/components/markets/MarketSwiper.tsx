"use client";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { fetchFxRates, fetchMarketEquity, fetchMarketSnapshot } from "@/src/redux/slice/marketSlice";

const MarketSwiper = () => {
  const dispatch = useAppDispatch();

  const fx = useSelector((state: RootState) => state.fx);
  const snapshot = useSelector((state: RootState) => state.snapshot);
  const equity = useSelector((state: RootState) => state.equity);

  useEffect(() => {
    if (fx.status === "idle") dispatch(fetchFxRates());
    if (snapshot.status === "idle") dispatch(fetchMarketSnapshot());
    if (equity.status === "idle") dispatch(fetchMarketEquity());
  }, [dispatch, fx.status, snapshot.status, equity.status]);

  if(fx.status == "loading" || snapshot.status == "loading" || equity.status == "loading"){
    return (<p>Loading stats...</p>)
  }

  if(fx.status == "failed" || snapshot.status === "failed" || equity.status == "failed"){
    return (<p>Failed: {`fx: ${fx.error}` || `snapshot: ${snapshot.error}` || `equity: ${equity.error}`}</p>)
  }

  return (
    <div className="col-span-2 sm:col-span-1 row-span-1 relative">
      <Swiper spaceBetween={16} slidesPerView={1} modules={[Autoplay]} autoplay={{ delay: 4000 }}>
        {/* --- FX Rates --- */}
        <SwiperSlide>
          <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
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
          <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
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
          <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
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
          <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
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
          <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
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
      </Swiper>
    </div>
  );
};

export default MarketSwiper;
