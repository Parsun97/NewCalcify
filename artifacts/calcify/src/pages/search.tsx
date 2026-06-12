import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CalculatorCard } from "@/components/calculator-card";
import { useListCalculators, useListFavorites } from "@workspace/api-client-react";

export default function SearchPage() {
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading } = useListCalculators(
    debouncedQuery ? { q: debouncedQuery } : {},
  );
  const { data: favorites } = useListFavorites();
  const favSlugs = new Set(favorites?.map((f) => f.calculatorSlug) ?? []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-4">Search Calculators</h1>
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            type="search"
            placeholder="Type to search..."
            className="pl-10 h-11 text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="input-search-main"
          />
        </div>
      </div>

      {!debouncedQuery ? (
        <div className="text-center py-16">
          <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Start typing to search across all calculators
          </p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : !results || results.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No results for "{debouncedQuery}"</h3>
          <p className="text-sm text-muted-foreground">
            Try different keywords like "percentage", "mortgage", or "BMI"
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {results.length} result{results.length !== 1 ? "s" : ""} for "{debouncedQuery}"
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((calc) => (
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
