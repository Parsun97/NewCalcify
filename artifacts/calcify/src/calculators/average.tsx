import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function AverageCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const nums = input.split(/[\s,;]+/).map(Number).filter((n) => !isNaN(n) && isFinite(n));
    if (nums.length === 0) return;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const freq: Record<number, number> = {};
    nums.forEach((n) => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq).filter(([, v]) => v === maxFreq).map(([k]) => k);
    const r = {
      count: String(nums.length),
      sum: formatNumber(sum),
      mean: formatNumber(mean),
      median: formatNumber(median),
      mode: modes.join(", "),
      min: formatNumber(sorted[0]),
      max: formatNumber(sorted[sorted.length - 1]),
      range: formatNumber(sorted[sorted.length - 1] - sorted[0]),
    };
    setResult(r);
    save({ numbers: input }, r);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="avg-input">Numbers (separated by commas or spaces)</Label>
        <Textarea
          id="avg-input"
          placeholder="e.g. 10, 20, 30, 40, 50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          data-testid="input-numbers"
        />
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-average">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Count" value={result.count} />
          <ResultDisplay label="Sum" value={result.sum} />
          <ResultDisplay label="Mean (Average)" value={result.mean} />
          <ResultDisplay label="Median" value={result.median} />
          <ResultDisplay label="Mode" value={result.mode} />
          <ResultDisplay label="Min" value={result.min} />
          <ResultDisplay label="Max" value={result.max} />
          <ResultDisplay label="Range" value={result.range} />
        </ResultCard>
      )}
    </div>
  );
}
