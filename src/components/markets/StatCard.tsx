"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
}

const StatCard = ({ label, value, change }: StatCardProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <h3 className="text-2xl font-bold text-dark dark:text-light">{value}</h3>
      {change !== undefined && (
        <p className={`text-sm ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {change >= 0 ? "▲" : "▼"} {change.toFixed(2)}%
        </p>
      )}
    </div>
  );
};

export default StatCard;
