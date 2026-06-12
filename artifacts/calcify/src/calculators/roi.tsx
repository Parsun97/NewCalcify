import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function ROICalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [initial, setInitial] = useState("10000");
  const [final, setFinal] = useState("15000");
  const [years, setYears] = useState("3");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const i = parseFloat(initial), f = parseFloat(final), y = parseFloat(years);
    if ([i, f].some(isNaN) || i === 0) return;
    const roi = ((f - i) / i) * 100;
    const netProfit = f - i;
    const annualized = y > 0 ? (Math.pow(f / i, 1 / y) - 1) * 100 : null;
    const r2 = {
      roi: formatNumber(roi) + "%",
      netProfit: "$" + formatNumber(netProfit),
      ...(annualized !== null ? { annualizedROI: formatNumber(annualized) + "%" } : {}),
    };
    setResult(r2);
    save({ initialInvestment: initial, finalValue: final, years }, r2);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Initial investment ($)</Label>
          <Input type="number" value={initial} onChange={(e) => setInitial(e.target.value)} data-testid="input-initial" />
        </div>
        <div>
          <Label>Final value ($)</Label>
          <Input type="number" value={final} onChange={(e) => setFinal(e.target.value)} data-testid="input-final" />
        </div>
        <div>
          <Label>Duration (years)</Label>
          <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} data-testid="input-years" />
        </div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-roi">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="ROI" value={result.roi} />
          <ResultDisplay label="Net profit" value={result.netProfit} />
          {result.annualizedROI && <ResultDisplay label="Annualized ROI" value={result.annualizedROI} />}
        </ResultCard>
      )}
    </div>
  );
}
