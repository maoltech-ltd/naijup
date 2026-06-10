const MarketCoverSection = () => {
  return (
    <section className="w-full border-b border-slate-200 bg-slate-950 py-12 text-white dark:border-slate-800">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
            Nigeria market data
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            NaijUp Market Watch
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Follow NGN rates, NGX movement, equities, bonds, ETFs, and crypto
            prices in one focused dashboard.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {["FX rates", "NGX snapshot", "Equities", "Bonds & ETFs"].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <span className="font-semibold text-white">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketCoverSection;
