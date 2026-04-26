"use client";

interface Props {
  value: number;
}

const PerformanceBadge = ({ value }: Props) => {
  const color =
    value > 0 ? "bg-green-100 text-green-700" :
    value < 0 ? "bg-red-100 text-red-700" :
    "bg-gray-100 text-gray-600";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
      {value.toFixed(2)}%
    </span>
  );
};

export default PerformanceBadge;
