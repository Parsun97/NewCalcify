import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function LoanCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [amount, setAmount] = useState("25000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("5");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const P = parseFloat(amount), r = parseFloat(rate) / 100 / 12, n = parseFloat(years) * 12;
    if ([P, r, n].some(isNaN) || r <= 0) return;
    const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = M * n;
    const totalInterest = totalPaid - P;
    const r2 = {
      monthlyPayment: "$" + formatNumber(M),
      totalInterest: "$" + formatNumber(totalInterest),
      totalPaid: "$" + formatNumber(totalPaid),
    };
    setResult(r2);
    save({ loanAmount: amount, annualRate: rate, termYears: years }, r2);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Loan amount ($)</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} data-testid="input-loan-amount" />
        </div>
        <div>
          <Label>Annual rate (%)</Label>
          <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} data-testid="input-rate" />
        </div>
        <div>
          <Label>Term (years)</Label>
          <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} data-testid="input-term" />
        </div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-loan">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Monthly payment" value={result.monthlyPayment} />
          <ResultDisplay label="Total interest" value={result.totalInterest} />
          <ResultDisplay label="Total paid" value={result.totalPaid} />
        </ResultCard>
      )}
    </div>
  );
}
