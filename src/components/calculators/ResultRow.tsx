interface ResultRowProps {
  label: string;
  value: string;
  emphasis?: boolean;
}

const ResultRow = ({ label, value, emphasis }: ResultRowProps) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0 dark:border-slate-800">
      <span className="text-sm text-gray-500 dark:text-light/70">{label}</span>
      <span
        className={
          emphasis
            ? "text-lg font-bold text-emerald-600"
            : "text-sm font-semibold text-dark dark:text-light"
        }
      >
        {value}
      </span>
    </div>
  );
};

export default ResultRow;
