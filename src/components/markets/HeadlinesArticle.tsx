"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchHeadlines } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";
import Link from "next/link";

const HeadlinesArticle: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, status } = useSelector((state: RootState) => state.headlines);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchHeadlines());
    }
  }, [dispatch, status]);

  if (!data || !data.headlines || data.headlines.length === 0) {
    return (
      <article className="col-span-2 sm:col-span-1 row-span-1 relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col h-full justify-center items-center">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-light mb-3">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm">Loading market headlines...</span>
          </div>
        </div>
      </article>
    );
  }

  const formatTime = (headline: string) => {
    const timeMatch = headline.match(/^\[(\d{1,2}:\d{2})\]/);
    return timeMatch ? timeMatch[1] : null;
  };

  const getHeadlineContent = (headline: string) => {
    const contentMatch = headline.match(/^\[\d{1,2}:\d{2}\]\s*(.*)/);
    return contentMatch ? contentMatch[1] : headline;
  };

  const getHeadlineColor = (content: string) => {
    if (content.includes('↑') || content.includes('up') || content.includes('gain') || content.includes('rally')) {
      return 'text-green-600 dark:text-green-400';
    } else if (content.includes('↓') || content.includes('down') || content.includes('drop') || content.includes('decline')) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-700 dark:text-light';
  };

  return (
    <article className="col-span-2 sm:col-span-1 row-span-1 relative group">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <h3 className="font-bold text-lg text-dark dark:text-light">Market Headlines</h3>
          </div>
          <Link 
            href="/market" 
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Headlines List */}
        <div className="flex-1 space-y-3 overflow-hidden">
          {data.headlines.slice(0, 4).map((headline, index) => {
            const time = formatTime(headline);
            const content = getHeadlineContent(headline);
            const colorClass = getHeadlineColor(content);

            return (
              <div 
                key={index}
                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors group/item"
              >
                {/* Time Badge */}
                {time && (
                  <span className="text-xs font-mono bg-white dark:bg-dark text-gray-500 dark:text-light px-2 py-1 rounded flex-shrink-0 mt-0.5">
                    {time}
                  </span>
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-tight ${colorClass} group-hover/item:underline`}>
                    {content}
                  </p>
                </div>

                {/* Indicator */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                  colorClass.includes('green') ? 'bg-green-500' : 
                  colorClass.includes('red') ? 'bg-red-500' : 'bg-blue-500'
                }`} />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center text-xs text-gray-500 dark:text-light">
          <span>Updated {new Date(data.timestamp).toLocaleTimeString()}</span>
          <span>{data.count} headlines</span>
        </div>
      </div>
    </article>
  );
};

export default HeadlinesArticle;