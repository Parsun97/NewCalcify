import { Link } from "wouter";
import * as Icons from "lucide-react";
import type { Calculator } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";

interface CalculatorCardProps {
  calculator: Calculator;
  isFavorited?: boolean;
}

export function CalculatorCard({ calculator, isFavorited }: CalculatorCardProps) {
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[calculator.icon] ?? Icons.Calculator;

  const categoryColors: Record<string, string> = {
    math: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    finance: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    health: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    conversion: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    date: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    statistics: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
  };

  const iconBg = categoryColors[calculator.categorySlug] ?? "bg-muted text-muted-foreground";

  return (
    <Link href={`/calculator/${calculator.slug}`}>
      <div
        className="group relative flex flex-col gap-3 p-4 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer h-full"
        data-testid={`card-calculator-${calculator.slug}`}
      >
        {isFavorited && (
          <div className="absolute top-3 right-3">
            <Icons.Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
          </div>
        )}
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${iconBg} shrink-0`}>
          <IconComponent className="h-4.5 w-4.5" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {calculator.name}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {calculator.description}
          </p>
        </div>
        <div className="mt-auto pt-1">
          <Badge variant="secondary" className="text-xs px-2 py-0.5 font-normal">
            {calculator.category}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
