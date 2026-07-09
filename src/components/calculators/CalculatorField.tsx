interface CalculatorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  placeholder?: string;
  hint?: string;
  type?: "number" | "date";
}

const CalculatorField = ({
  label,
  value,
  onChange,
  suffix,
  placeholder,
  hint,
  type = "number",
}: CalculatorFieldProps) => {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-light/80">{label}</span>
      <div className="relative">
        <input
          type={type}
          inputMode={type === "number" ? "decimal" : undefined}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-dark dark:text-light"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
    </label>
  );
};

export default CalculatorField;
