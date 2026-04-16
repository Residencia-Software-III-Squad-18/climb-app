interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  variant?: "default" | "cyan" | "teal" | "cyan-light";
}

export function StatCard({
  title,
  value,
  description,
  variant = "default",
}: StatCardProps) {
  const borderColorMap = {
    default: "",
    cyan: "border-t-4 border-cyan-400",
    teal: "border-t-4 border-teal-500",
    "cyan-light": "border-t-4 border-cyan-300",
  };

  return (
    <div
      className={`bg-white dark:bg-[#1a2532] rounded-lg p-4 shadow ${borderColorMap[variant]}`}
    >
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-[#0e1822] dark:text-white mt-2">
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
}
