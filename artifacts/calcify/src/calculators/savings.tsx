import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function SavingsCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [initial, setInitial] = useState("1000");
  const [monthly, setMonthly] = useState("200");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const P = parseFloat(initial), m = parseFloat(monthly), r = parseFloat(rate) / 100 / 12, n = parseFloat(years) * 12;
    if ([P, m, r, n].some(isNaN)) return;
    const futureValue = P * Math.pow(1 + r, n) + m * ((Math.pow(1 + r, n) - 1) / r);
    const totalContribs = P + m * n;
    const interest = futureValue - totalContribs;
    const r2 = {
      futureValue: "$" + formatNumber(futureValue),
      totalContributions: "$" + formatNumber(totalContribs),
      interestEarned: "$" + formatNumber(interest),
    };
    setResult(r2);
    save({ initialAmount: initial, monthlyContribution: monthly, annualRate: rate, years }, r2);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Initial deposit ($)</Label><Input type="number" value={initial} onChange={(e) => setInitial(e.target.value)} data-testid="input-initial" /></div>
        <div><Label>Monthly contribution ($)</Label><Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} data-testid="input-monthly" /></div>
        <div><Label>Annual interest rate (%)</Label><Input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} data-testid="input-rate" /></div>
        <div><Label>Duration (years)</Label><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} data-testid="input-years" /></div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-savings">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Future value" value={result.futureValue} />
          <ResultDisplay label="Total contributions" value={result.totalContributions} />
          <ResultDisplay label="Interest earned" value={result.interestEarned} />
        </ResultCard>
      )}
    </div>
  );
}
