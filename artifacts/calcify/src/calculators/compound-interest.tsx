import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function CompoundInterestCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [n, setN] = useState("12");
  const [monthly, setMonthly] = useState("0");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const P = parseFloat(principal), r = parseFloat(rate) / 100;
    const t = parseFloat(years), nv = parseFloat(n), m = parseFloat(monthly);
    if ([P, r, t, nv].some(isNaN)) return;
    const A = P * Math.pow(1 + r / nv, nv * t) + (m > 0 ? m * ((Math.pow(1 + r / nv, nv * t) - 1) / (r / nv)) : 0);
    const totalContrib = P + m * 12 * t;
    const totalInterest = A - totalContrib;
    const r2 = {
      finalBalance: "$" + formatNumber(A),
      totalInterestEarned: "$" + formatNumber(totalInterest),
      totalContributions: "$" + formatNumber(totalContrib),
    };
    setResult(r2);
    save({ principal, annualRate: rate, years, compoundingFrequency: n, monthlyContribution: monthly }, r2);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Principal ($)</Label>
          <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} data-testid="input-principal" />
        </div>
        <div>
          <Label>Annual rate (%)</Label>
          <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} data-testid="input-rate" />
        </div>
        <div>
          <Label>Years</Label>
          <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} data-testid="input-years" />
        </div>
        <div>
          <Label>Compound frequency</Label>
          <Select value={n} onValueChange={setN}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Annually</SelectItem>
              <SelectItem value="4">Quarterly</SelectItem>
              <SelectItem value="12">Monthly</SelectItem>
              <SelectItem value="365">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label>Monthly contribution ($)</Label>
          <Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} data-testid="input-monthly" />
        </div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-compound">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Final balance" value={result.finalBalance} />
          <ResultDisplay label="Interest earned" value={result.totalInterestEarned} />
          <ResultDisplay label="Total contributions" value={result.totalContributions} />
        </ResultCard>
      )}
    </div>
  );
}
