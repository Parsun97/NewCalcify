import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function PregnancyCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [lmp, setLmp] = useState("");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const lmpDate = new Date(lmp);
    if (isNaN(lmpDate.getTime())) return;
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280);
    const today = new Date();
    const weeksPregnant = Math.floor((today.getTime() - lmpDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const daysPregnant = Math.floor((today.getTime() - lmpDate.getTime()) / (24 * 60 * 60 * 1000));
    const trimester = weeksPregnant < 13 ? "First" : weeksPregnant < 27 ? "Second" : "Third";
    const r = {
      dueDate: dueDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      weeksPregnant: weeksPregnant >= 0 ? `${weeksPregnant} weeks, ${daysPregnant % 7} days` : "N/A",
      trimester: weeksPregnant >= 0 && weeksPregnant < 42 ? trimester + " trimester" : "N/A",
      conception: new Date(lmpDate.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    };
    setResult(r);
    save({ lastMenstrualPeriod: lmp }, r);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="lmp">Last menstrual period (LMP)</Label>
        <input
          id="lmp"
          type="date"
          value={lmp}
          onChange={(e) => setLmp(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          data-testid="input-lmp"
        />
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-due-date">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Due date" value={result.dueDate} />
          <ResultDisplay label="Weeks pregnant" value={result.weeksPregnant} />
          <ResultDisplay label="Trimester" value={result.trimester} />
          <ResultDisplay label="Estimated conception" value={result.conception} />
        </ResultCard>
      )}
    </div>
  );
}
