import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function MortgageCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [homePrice, setHomePrice] = useState("400000");
  const [downPct, setDownPct] = useState("20");
  const [rate, setRate] = useState("7.0");
  const [years, setYears] = useState("30");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const P = parseFloat(homePrice) * (1 - parseFloat(downPct) / 100);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if ([P, r, n].some(isNaN) || r <= 0) return;
    const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = M * n;
    const totalInterest = totalPaid - P;
    const r2 = {
      monthlyPayment: "$" + formatNumber(M),
      loanAmount: "$" + formatNumber(P),
      totalPaid: "$" + formatNumber(totalPaid),
      totalInterest: "$" + formatNumber(totalInterest),
      downPayment: "$" + formatNumber(parseFloat(homePrice) * (parseFloat(downPct) / 100)),
    };
    setResult(r2);
    save({ homePrice, downPaymentPct: downPct, interestRate: rate, loanTermYears: years }, r2);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="mort-price">Home price ($)</Label>
          <Input id="mort-price" type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} data-testid="input-home-price" />
        </div>
        <div>
          <Label htmlFor="mort-down">Down payment (%)</Label>
          <Input id="mort-down" type="number" value={downPct} onChange={(e) => setDownPct(e.target.value)} data-testid="input-down-payment" />
        </div>
        <div>
          <Label htmlFor="mort-rate">Annual interest rate (%)</Label>
          <Input id="mort-rate" type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} data-testid="input-interest-rate" />
        </div>
        <div>
          <Label htmlFor="mort-years">Loan term (years)</Label>
          <Input id="mort-years" type="number" value={years} onChange={(e) => setYears(e.target.value)} data-testid="input-loan-term" />
        </div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-mortgage">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Monthly payment" value={result.monthlyPayment} />
          <ResultDisplay label="Loan amount" value={result.loanAmount} />
          <ResultDisplay label="Down payment" value={result.downPayment} />
          <ResultDisplay label="Total interest" value={result.totalInterest} />
          <ResultDisplay label="Total cost" value={result.totalPaid} />
        </ResultCard>
      )}
    </div>
  );
}
