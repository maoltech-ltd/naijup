const MarketFAQSection = () => {
  return (
    <section className="mt-14 mb-16 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg">What is NaijUp Market Watch?</h3>
          <p className="text-gray-700 dark:text-gray-300">
            NaijUp Market Watch provides real-time updates on Nigeria’s financial
            markets including FX rates, stocks, bonds, ETFs and cryptocurrencies.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">How often are FX and crypto prices updated?</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Prices update in real-time automatically, ensuring the most accurate
            and current values.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Where does NaijUp get market data?</h3>
          <p className="text-gray-700 dark:text-gray-300">
            We source data from reputable financial APIs, NGX market feeds, and
            verified institutional sources.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Can I use NaijUp for investment decisions?</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Yes — NaijUp provides accurate insights that help improve your
            personal or professional financial analysis.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MarketFAQSection;
