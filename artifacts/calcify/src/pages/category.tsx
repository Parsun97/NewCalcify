import { useParams, Link } from "wouter";
import * as Icons from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalculatorCard } from "@/components/calculator-card";
import { useListCalculators, useListCategories, useListFavorites } from "@workspace/api-client-react";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const { data: calculators, isLoading } = useListCalculators({ category: slug });
  const { data: categories } = useListCategories();
  const { data: favorites } = useListFavorites();
  const favSlugs = new Set(favorites?.map((f) => f.calculatorSlug) ?? []);

  const category = categories?.find((c) => c.slug === slug);
  const IconComponent = category
    ? ((Icons as Record<string, React.ComponentType<{ className?: string }>>)[category.icon] ?? Icons.Calculator)
    : Icons.Calculator;

  const categoryIconColors: Record<string, string> = {
    math: "text-violet-600 dark:text-violet-400",
    finance: "text-emerald-600 dark:text-emerald-400",
    health: "text-rose-600 dark:text-rose-400",
    conversion: "text-amber-600 dark:text-amber-400",
    date: "text-sky-600 dark:text-sky-400",
    statistics: "text-indigo-600 dark:text-indigo-400",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Button asChild variant="ghost" size="sm" className="gap-1.5 mb-6 -ml-2 text-muted-foreground hover:text-foreground">
        <Link href="/calculators">
          <ArrowLeft className="h-3.5 w-3.5" />
          All calculators
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        {category ? (
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-muted`}>
            <IconComponent className={`h-6 w-6 ${categoryIconColors[slug] ?? "text-muted-foreground"}`} />
          </div>
        ) : (
          <Skeleton className="h-12 w-12 rounded-xl" />
        )}
        <div>
          {category ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{category.description}</p>
            </>
          ) : (
            <>
              <Skeleton className="h-7 w-40 mb-1" />
              <Skeleton className="h-4 w-64" />
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : (calculators ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No calculators found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(calculators ?? []).map((calc) => (
            <CalculatorCard
              key={calc.slug}
              calculator={calc}
              isFavorited={favSlugs.has(calc.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
