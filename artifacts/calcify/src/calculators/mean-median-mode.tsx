import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function MeanMedianModeCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const nums = input.split(/[\s,;]+/).map(Number).filter((n) => !isNaN(n) && isFinite(n));
    if (nums.length === 0) return;
    const sorted = [...nums].sort((a, b) => a - b);
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const freq: Record<number, number> = {};
    nums.forEach((n) => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq).filter(([, v]) => v === maxFreq).map(([k]) => k);
    const range = sorted[sorted.length - 1] - sorted[0];
    const variance = nums.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / nums.length;
    const r = {
      count: String(nums.length),
      mean: formatNumber(mean),
      median: formatNumber(median),
      mode: modes.join(", "),
      range: formatNumber(range),
      min: formatNumber(sorted[0]),
      max: formatNumber(sorted[sorted.length - 1]),
      variance: formatNumber(variance),
      stdDev: formatNumber(Math.sqrt(variance)),
    };
    setResult(r);
    save({ dataset: input }, r);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Dataset (separated by commas, spaces, or semicolons)</Label>
        <Textarea placeholder="e.g. 4, 7, 13, 2, 7, 5, 9" value={input} onChange={(e) => setInput(e.target.value)} rows={3} data-testid="input-dataset" />
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-mmm">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Count" value={result.count} />
          <ResultDisplay label="Mean" value={result.mean} />
          <ResultDisplay label="Median" value={result.median} />
          <ResultDisplay label="Mode" value={result.mode} />
          <ResultDisplay label="Range" value={result.range} />
          <ResultDisplay label="Variance" value={result.variance} />
          <ResultDisplay label="Std deviation" value={result.stdDev} />
          <ResultDisplay label="Min" value={result.min} />
          <ResultDisplay label="Max" value={result.max} />
        </ResultCard>
      )}
    </div>
  );
}
