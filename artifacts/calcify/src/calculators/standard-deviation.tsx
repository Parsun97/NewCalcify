import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function StandardDeviationCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [input, setInput] = useState(""); const [type, setType] = useState("population");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const nums = input.split(/[\s,;]+/).map(Number).filter((n) => !isNaN(n) && isFinite(n));
    if (nums.length < 2) return;
    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const sumSqDiff = nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0);
    const variance = type === "population" ? sumSqDiff / n : sumSqDiff / (n - 1);
    const stdDev = Math.sqrt(variance);
    const se = stdDev / Math.sqrt(n);
    const r = {
      mean: formatNumber(mean),
      variance: formatNumber(variance),
      stdDeviation: formatNumber(stdDev),
      standardError: formatNumber(se),
      count: String(n),
      type: type === "population" ? "Population" : "Sample",
    };
    setResult(r);
    save({ dataset: input, type }, r);
  };

  return (
    <div className="space-y-4">
      <RadioGroup value={type} onValueChange={setType} className="flex gap-4">
        <div className="flex items-center gap-1.5"><RadioGroupItem value="population" id="sd-pop" /><Label htmlFor="sd-pop">Population</Label></div>
        <div className="flex items-center gap-1.5"><RadioGroupItem value="sample" id="sd-samp" /><Label htmlFor="sd-samp">Sample</Label></div>
      </RadioGroup>
      <div>
        <Label>Dataset</Label>
        <Textarea placeholder="e.g. 2, 4, 4, 4, 5, 5, 7, 9" value={input} onChange={(e) => setInput(e.target.value)} rows={3} data-testid="input-dataset-sd" />
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-sd">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Mean" value={result.mean} />
          <ResultDisplay label="Std deviation" value={result.stdDeviation} />
          <ResultDisplay label="Variance" value={result.variance} />
          <ResultDisplay label="Std error" value={result.standardError} />
          <ResultDisplay label="Count (n)" value={result.count} />
          <ResultDisplay label="Formula" value={result.type} />
        </ResultCard>
      )}
    </div>
  );
}
