import { StatCard } from "@/components/StatCard";

import type { StatData } from "@/mocks/statsData";

type VariantType = "default" | "cyan" | "teal" | "cyan-light";

interface StatsGridProps {
  stats: StatData[];
  variants?: VariantType[];
}

// Variantes padrão do design
const DEFAULT_VARIANTS: VariantType[] = [
  "default",
  "cyan",
  "teal",
  "cyan-light",
];

export function StatsGrid({
  stats,
  variants = DEFAULT_VARIANTS,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          variant={variants[index] || variants[0]}
        />
      ))}
    </div>
  );
}
