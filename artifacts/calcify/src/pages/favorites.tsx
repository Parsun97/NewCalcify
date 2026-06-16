import { useState } from "react";
import { Link } from "wouter";
import { Heart, X, ArrowRight, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalculatorCard } from "@/components/calculator-card";
import { useListFavorites, useRemoveFavorite, getListFavoritesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { calculatorsRegistry } from "@/lib/calculators";
import { usePro } from "@/use-pro";
import { UpgradeModal } from "@/components/upgrade-modal";

export default function Favorites() {
  const { data: favorites, isLoading } = useListFavorites();
  const removeFavorite = useRemoveFavorite();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isPro, loading: proLoading } = usePro();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleRemove = (calculatorSlug: string) => {
    removeFavorite.mutate({ calculatorSlug }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() });
        toast({ title: "Removed from favorites" });
      },
      onError: () => {
        toast({ title: "Failed to remove", variant: "destructive" });
      },
    });
  };

  const favCalcs = (favorites ?? [])
    .map((fav) => calculatorsRegistry.find((c) => c.slug === fav.calculatorSlug))
    .filter(Boolean) as typeof calculatorsRegistry;

  if (!proLoading && !isPro) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-2 mb-8">
          <Heart className="h-5 w-5 text-rose-500" />
          <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
        </div>

        <div className="text-center py-20 space-y-6 rounded-2xl border border-dashed border-violet-300 bg-violet-50/50 dark:bg-violet-950/10">
          <div className="h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-violet-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Pro Feature
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Upgrade to Pro to save unlimited favorites and access them across all your devices.
            </p>
          </div>
          <Button
            className="gap-2 bg-violet-600 hover:bg-violet-700"
            onClick={() => setShowUpgrade(true)}
          >
            <Crown className="h-4 w-4" />
            Upgrade to Pro — ₹99/month
          </Button>
        </div>

        <UpgradeModal
          open={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          onSuccess={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Favorites
            <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your bookmarked calculators</p>
        </div>
        {favCalcs.length > 0 && (
          <span className="text-sm text-muted-foreground">{favCalcs.length} saved</span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : favCalcs.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center mx-auto">
            <Heart className="h-8 w-8 text-rose-300" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">No favorites yet</h3>
            <p className="text-sm text-muted-foreground">
              Open a calculator and click the heart icon to save it here
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/calculators">
              Browse calculators
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favCalcs.map((calc) => (
            <div key={calc.slug} className="relative">
              <CalculatorCard calculator={calc} isFavorited />
              <button
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:border-destructive/30 transition-all"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(calc.slug); }}
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
