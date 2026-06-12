import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function DateDiffCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [d1, setD1] = useState(""); const [d2, setD2] = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const start = new Date(d1), end = new Date(d2);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;
    const diff = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays % 30;
    const r = {
      difference: `${years > 0 ? years + " years, " : ""}${months > 0 ? months + " months, " : ""}${days} days`,
      totalDays: totalDays.toLocaleString(),
      totalWeeks: Math.floor(totalDays / 7).toLocaleString(),
      totalHours: (totalDays * 24).toLocaleString(),
      direction: end >= start ? "after" : "before",
    };
    setResult(r);
    save({ startDate: d1, endDate: d2 }, r);
  };

  const dateInputClass = "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Start date</Label><input type="date" value={d1} onChange={(e) => setD1(e.target.value)} className={dateInputClass} data-testid="input-start-date" /></div>
        <div><Label>End date</Label><input type="date" value={d2} onChange={(e) => setD2(e.target.value)} className={dateInputClass} data-testid="input-end-date" /></div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-diff">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Difference" value={result.difference} />
          <ResultDisplay label="Total days" value={result.totalDays} />
          <ResultDisplay label="Total weeks" value={result.totalWeeks} />
          <ResultDisplay label="Total hours" value={result.totalHours} />
        </ResultCard>
      )}
    </div>
  );
}
