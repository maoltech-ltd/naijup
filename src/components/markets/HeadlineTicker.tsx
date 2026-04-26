// src/components/market/HeadlineTicker.tsx
"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchHeadlines } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";

export default function HeadlineTicker() {
  const dispatch = useAppDispatch();
  const { data, status } = useSelector((state: RootState) => state.headlines);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchHeadlines());
    }
  }, [dispatch, status]);

  // useEffect(() => {
  //     dispatch(fetchHeadlines());
  // }, [dispatch]);

  if (!data || !data.headlines || data.headlines.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 py-3">
        <div className="flex items-center justify-center text-sm text-gray-500 -400">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading market headlines...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 py-3 group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            Market Headlines
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-light">
          {data.count} updates
        </div>
      </div>

      {/* Ticker Container */}
      <div className="relative overflow-hidden">
        <div className="flex animate-headline-ticker whitespace-nowrap group-hover:animate-pause">
          {data.headlines.concat(data.headlines).map((headline, index) => (
            <HeadlineItem key={index} headline={headline} index={index} />
          ))}
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-blue-50 dark:from-gray-800 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

interface HeadlineItemProps {
  headline: string;
  index: number;
}

function HeadlineItem({ headline, index }: HeadlineItemProps) {
  // Extract timestamp and content from headline format: "[HH:MM] Content"
  const timestampMatch = headline.match(/^\[(\d{1,2}:\d{2})\]\s*(.*)/);
  const time = timestampMatch ? timestampMatch[1] : null;
  const content = timestampMatch ? timestampMatch[2] : headline;

  // Determine color based on content
  const getHeadlineColor = (text: string) => {
    if (text.includes('↑') || text.includes('up') || text.includes('gain') || text.includes('rally')) {
      return 'text-green-600 dark:text-green-400';
    } else if (text.includes('↓') || text.includes('down') || text.includes('drop') || text.includes('decline')) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-700 dark:text-light';
  };

  const colorClass = getHeadlineColor(content);

  return (
    <div className="flex items-center mx-6 py-1">
      {/* Timestamp */}
      {time && (
        <span className="text-xs text-gray-500 dark:text-light font-mono mr-3 bg-white dark:bg-dark px-2 py-1 rounded">
          {time}
        </span>
      )}
      
      {/* Headline Content */}
      <div className={`flex items-center text-sm font-medium ${colorClass}`}>
        {/* Indicator dot */}
        <div className={`w-2 h-2 rounded-full mr-3 ${
          colorClass.includes('green') ? 'bg-green-500' : 
          colorClass.includes('red') ? 'bg-red-500' : 'bg-blue-500'
        }`} />
        
        {content}
      </div>
      
      {/* Separator */}
      <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-dark mx-6" />
    </div>
  );
}