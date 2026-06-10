const MarketIntroSEOSection = () => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h2 className="text-2xl font-bold mb-4 text-slate-950 dark:text-light">Nigeria Market Overview</h2>
      <p className="max-w-4xl text-gray-700 dark:text-light leading-relaxed">
        Nigeria&rsquo;s financial markets move quickly, and NaijUp Market Watch keeps
        you updated with accurate, real-time insights. Whether you&rsquo;re tracking
        today&rsquo;s Dollar to Naira rate, monitoring NGX stock performance, or
        checking the latest government bonds and ETFs, this dashboard provides a
        clear and detailed breakdown of everything happening in the economy.
        <br /><br />
        Our FX tracker shows live NGN exchange rates such as USD/NGN, EUR/NGN,
        GBP/NGN, MXN/NGN, INR/NGN and more, helping you make smarter financial
        decisions. We also convert major cryptocurrencies into naira, including
        Bitcoin, Ethereum, BNB, Solana, and ADA, giving you access to digital
        asset values at a glance.
        <br /><br />
        For investors, NaijUp provides in-depth NGX data including market
        capitalization, deals, top gainers, top losers, volumes and the most
        traded stocks. Bond investors also get access to the latest performance
        on government and corporate bonds, alongside pricing insights for major
        ETFs like NEWGOLD and STANBICETF30.
        <br /><br />
        Whether you&rsquo;re a trader, analyst, student, or everyday Nigerian looking
        for accurate information, NaijUp Market Watch delivers reliable and
        clear financial insights across multiple asset classes.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
        <a className="rounded-md bg-blue-50 px-3 py-2 hover:bg-blue-100 dark:bg-blue-950/30" href="/categories/economy">Explore Economic Updates</a>
        <a className="rounded-md bg-blue-50 px-3 py-2 hover:bg-blue-100 dark:bg-blue-950/30" href="/categories/finance">Finance Insights</a>
        <a className="rounded-md bg-blue-50 px-3 py-2 hover:bg-blue-100 dark:bg-blue-950/30" href="/market/stocks">Stock Market News</a>
      </div>
    </section>
  );
};

export default MarketIntroSEOSection;
