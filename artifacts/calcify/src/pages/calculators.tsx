import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalculatorCard } from "@/components/calculator-card";
import { useListCalculators, useListCategories, useListFavorites } from "@workspace/api-client-react";

export default function Calculators() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: calculators, isLoading } = useListCalculators(
    activeCategory ? { category: activeCategory } : {},
  );
  const { data: categories } = useListCategories();
  const { data: favorites } = useListFavorites();
  const favSlugs = new Set(favorites?.map((f) => f.calculatorSlug) ?? []);

  const filtered = (calculators ?? []).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">All Calculators</h1>
        <p className="text-muted-foreground text-sm">
          {calculators?.length ?? 0} calculators across {categories?.length ?? 0} categories
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search calculators..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-calculators"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
            data-testid="button-filter-all"
          >
            All
          </Button>
          {(categories ?? []).map((cat) => (
            <Button
              key={cat.slug}
              variant={activeCategory === cat.slug ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
              data-testid={`button-filter-${cat.slug}`}
            >
              {cat.name}
              <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">
                {cat.calculatorCount}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">No calculators found</h3>
          <p className="text-sm text-muted-foreground">
            Try a different search term or category filter
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => { setSearch(""); setActiveCategory(null); }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-4">
            Showing {filtered.length} calculator{filtered.length !== 1 ? "s" : ""}
            {search && ` for "${search}"`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((calc) => (
              <CalculatorCard
                key={calc.slug}
                calculator={calc}
                isFavorited={favSlugs.has(calc.slug)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
