import { useState } from "react";
import { Link } from "wouter";
import { Clock, Trash2, X, Calculator, ArrowRight, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useListHistory, useDeleteHistory, useClearHistory, getListHistoryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { usePro } from "@/use-pro";
import { UpgradeModal } from "@/components/upgrade-modal";

export default function History() {
  const { data: history, isLoading } = useListHistory({ limit: 50 });
  const deleteHistory = useDeleteHistory();
  const clearHistory = useClearHistory();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isPro, loading: proLoading } = usePro();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleDelete = (id: number) => {
    deleteHistory.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListHistoryQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to delete entry", variant: "destructive" });
      },
    });
  };

  const handleClear = () => {
    clearHistory.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListHistoryQueryKey() });
        toast({ title: "History cleared" });
      },
      onError: () => {
        toast({ title: "Failed to clear history", variant: "destructive" });
      },
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (!proLoading && !isPro) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-2 mb-8">
          <Clock className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Calculation History</h1>
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
              Upgrade to Pro to sync your calculation history across all devices and never lose your work.
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Calculation History
            <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your recent calculations</p>
        </div>
        {history && history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={handleClear}
            disabled={clearHistory.isPending}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !history || history.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <Clock className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">No calculations yet</h3>
            <p className="text-sm text-muted-foreground">Use a calculator and your results will appear here</p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/calculators">
              Browse calculators
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="group flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-card hover:border-border transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Calculator className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/calculator/${entry.calculatorSlug}`}>
                    <span className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                      {entry.calculatorName}
                    </span>
                  </Link>
                  <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(entry.inputs as Record<string, unknown>).slice(0, 3).map(([k, v]) => (
                    <Badge key={k} variant="secondary" className="text-xs font-normal px-2 py-0.5">
                      {k}: {String(v)}
                    </Badge>
                  ))}
                  {Object.entries(entry.result as Record<string, unknown>).slice(0, 2).map(([k, v]) => (
                    <Badge key={k} className="text-xs font-normal px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                      {k}: {String(v)}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => handleDelete(entry.id)}
                disabled={deleteHistory.isPending}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
