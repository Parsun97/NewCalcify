import { Link } from "wouter";
import * as Icons from "lucide-react";
import { ArrowRight, Sparkles, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalculatorCard } from "@/components/calculator-card";
import {
  useListCategories,
  useGetTrending,
  useGetRecentlyUsed,
  useGetPlatformStats,
  useListFavorites,
} from "@workspace/api-client-react";
import { calculatorsRegistry } from "@/lib/calculators";

export default function Home() {
  const { data: categories, isLoading: catsLoading } = useListCategories();
  const { data: trending, isLoading: trendLoading } = useGetTrending({ limit: 8 });
  const { data: recentlyUsed } = useGetRecentlyUsed({ limit: 6 });
  const { data: stats } = useGetPlatformStats();
  const { data: favorites } = useListFavorites();
  const favSlugs = new Set(favorites?.map((f) => f.calculatorSlug) ?? []);
  const featured = calculatorsRegistry.filter((c) => c.isFeatured).slice(0, 6);

  const categoryColors: Record<string, string> = {
    math: "from-violet-500/10 to-violet-500/5 border-violet-500/20 hover:border-violet-500/40",
    finance: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
    health: "from-rose-500/10 to-rose-500/5 border-rose-500/20 hover:border-rose-500/40",
    conversion: "from-amber-500/10 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
    date: "from-sky-500/10 to-sky-500/5 border-sky-500/20 hover:border-sky-500/40",
    statistics: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/40",
  };
  const categoryIconColors: Record<string, string> = {
    math: "text-violet-600 dark:text-violet-400",
    finance: "text-emerald-600 dark:text-emerald-400",
    health: "text-rose-600 dark:text-rose-400",
    conversion: "text-amber-600 dark:text-amber-400",
    date: "text-sky-600 dark:text-sky-400",
    statistics: "text-indigo-600 dark:text-indigo-400",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-5 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <Sparkles className="h-3 w-3" />
          {stats ? `${stats.totalCalculators} calculators` : "25+ calculators"} · Free · No sign-up
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Every calculator you need,<br className="hidden sm:block" />{" "}
          <span className="text-primary">in one place</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Fast, precise calculators for math, finance, health, unit conversion, and more.
          Built for people who want answers, not hassle.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild size="lg" className="gap-2">
            <Link href="/calculators">
              Browse all calculators
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/search">Search calculators</Link>
          </Button>
        </div>

        {/* Stats bar */}
        {stats && (
          <div className="flex items-center justify-center gap-6 sm:gap-10 pt-2 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{stats.totalCalculators}+</div>
              <div className="text-xs">Calculators</div>
            </div>
            <div className="h-8 w-px bg-border/60" />
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{stats.totalCategories}</div>
              <div className="text-xs">Categories</div>
            </div>
            <div className="h-8 w-px bg-border/60" />
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">
                {stats.totalCalculations > 0 ? `${stats.totalCalculations}+` : "Free"}
              </div>
              <div className="text-xs">{stats.totalCalculations > 0 ? "Calculations" : "Always"}</div>
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Browse by category</h2>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
            <Link href="/calculators">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        {catsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(categories ?? []).map((cat) => {
              const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[cat.icon] ?? Icons.Calculator;
              return (
                <Link key={cat.slug} href={`/category/${cat.slug}`}>
                  <div
                    className={`group flex flex-col items-center gap-2 p-4 rounded-xl border bg-gradient-to-b transition-all duration-200 cursor-pointer text-center ${categoryColors[cat.slug] ?? "from-muted/50 to-muted/20 border-border hover:border-border/80"}`}
                    data-testid={`card-category-${cat.slug}`}
                  >
                    <IconComponent className={`h-6 w-6 ${categoryIconColors[cat.slug] ?? "text-muted-foreground"}`} />
                    <div>
                      <div className="text-xs font-semibold text-foreground leading-tight">{cat.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{cat.calculatorCount} tools</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured calculators */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Popular calculators</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((calc) => (
            <CalculatorCard
              key={calc.slug}
              calculator={calc}
              isFavorited={favSlugs.has(calc.slug)}
            />
          ))}
        </div>
      </section>

      {/* Trending */}
      {(trending && trending.length > 0) && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">Trending now</h2>
          </div>
          {trendLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(trending ?? []).map((t) => (
                <CalculatorCard
                  key={t.calculator.slug}
                  calculator={t.calculator}
                  isFavorited={favSlugs.has(t.calculator.slug)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recently used */}
      {recentlyUsed && recentlyUsed.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Clock className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">Recently used</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyUsed.map((calc) => (
              <CalculatorCard
                key={calc.slug}
                calculator={calc}
                isFavorited={favSlugs.has(calc.slug)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
