import { useEffect } from "react";
import { useParams, Link } from "wouter";
import * as Icons from "lucide-react";
import { ArrowLeft, Heart, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalculatorCard } from "@/components/calculator-card";
import { useGetCalculator, useListCalculators, useListFavorites, useAddFavorite, useRemoveFavorite, useTrackUsage, getListFavoritesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { calculatorsRegistry } from "@/lib/calculators";
import { getCalculatorComponent } from "@/calculators";

export default function CalculatorPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: calc, isLoading } = useGetCalculator(slug!, { query: { enabled: !!slug, queryKey: ["calculator", slug] } });
  const { data: allCalcs } = useListCalculators();
  const { data: favorites } = useListFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const trackUsage = useTrackUsage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const isFavorited = favorites?.some((f) => f.calculatorSlug === slug) ?? false;

  useEffect(() => {
    if (slug) {
      trackUsage.mutate({ data: { calculatorSlug: slug } });
    }
  }, [slug]);

  useEffect(() => {
    if (calc) {
      document.title = `${calc.name} - Calcify`;
    }
    return () => { document.title = "Calcify"; };
  }, [calc]);

  const handleFavoriteToggle = () => {
    if (!calc) return;
    if (isFavorited) {
      removeFavorite.mutate({ calculatorSlug: calc.slug }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() });
          toast({ title: "Removed from favorites" });
        },
      });
    } else {
      addFavorite.mutate({ data: { calculatorSlug: calc.slug, calculatorName: calc.name } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() });
          toast({ title: "Added to favorites" });
        },
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    toast({ title: "Link copied to clipboard" });
  };

  const related = (allCalcs ?? [])
    .filter((c) => c.slug !== slug && c.categorySlug === calc?.categorySlug)
    .slice(0, 4);

  const CalculatorComponent = slug ? getCalculatorComponent(slug) : null;
  const IconComponent = calc
    ? ((Icons as Record<string, React.ComponentType<{ className?: string }>>)[calc.icon] ?? Icons.Calculator)
    : Icons.Calculator;

  const categoryColors: Record<string, string> = {
    math: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    finance: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    health: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    conversion: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    date: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    statistics: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
  };

  const favSlugs = new Set(favorites?.map((f) => f.calculatorSlug) ?? []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="gap-1.5 mb-6 -ml-2 text-muted-foreground hover:text-foreground">
        <Link href="/calculators">
          <ArrowLeft className="h-3.5 w-3.5" />
          All calculators
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-80" />
            </div>
          </>
        ) : calc ? (
          <>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${categoryColors[calc.categorySlug] ?? "bg-muted text-muted-foreground"}`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{calc.name}</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">{calc.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={handleFavoriteToggle}
                    disabled={addFavorite.isPending || removeFavorite.isPending}
                    data-testid="button-favorite-toggle"
                  >
                    <Heart className={`h-3.5 w-3.5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
                    {isFavorited ? "Saved" : "Save"}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare} data-testid="button-share">
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Link href={`/category/${calc.categorySlug}`}>
                  <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-muted/80">
                    {calc.category}
                  </Badge>
                </Link>
                {calc.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs font-normal text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10 w-full">
            <p className="text-muted-foreground">Calculator not found.</p>
          </div>
        )}
      </div>

      {/* Calculator widget */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 mb-8 shadow-sm">
        {CalculatorComponent ? (
          <CalculatorComponent calculatorSlug={slug!} calculatorName={calc?.name ?? slug!} />
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <Icons.Construction className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">This calculator is coming soon.</p>
          </div>
        )}
      </div>

      {/* Related calculators */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Related calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map((c) => (
              <CalculatorCard key={c.slug} calculator={c} isFavorited={favSlugs.has(c.slug)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
