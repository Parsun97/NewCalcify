import { useQueryClient } from "@tanstack/react-query";
import { useSaveHistory, getListHistoryQueryKey } from "@workspace/api-client-react";

export interface UseCalculatorHistoryProps {
  calculatorSlug: string;
  calculatorName: string;
}

export function useCalculatorHistory({ calculatorSlug, calculatorName }: UseCalculatorHistoryProps) {
  const saveHistory = useSaveHistory();
  const queryClient = useQueryClient();

  const save = (inputs: Record<string, unknown>, result: Record<string, unknown>) => {
    saveHistory.mutate(
      { data: { calculatorSlug, calculatorName, inputs, result } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListHistoryQueryKey() });
        },
      },
    );
  };

  return { save };
}

export function ResultDisplay({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">
        {value}{unit && <span className="text-muted-foreground font-normal ml-1">{unit}</span>}
      </span>
    </div>
  );
}

export function ResultCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
      {children}
    </div>
  );
}

export function formatNumber(n: number, decimals = 2): string {
  if (!isFinite(n)) return "N/A";
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}
