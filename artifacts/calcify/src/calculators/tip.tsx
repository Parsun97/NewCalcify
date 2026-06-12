import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function TipCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [bill, setBill] = useState("50");
  const [tipPct, setTipPct] = useState("18");
  const [people, setPeople] = useState("2");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const presets = [10, 15, 18, 20, 25];

  const calculate = (tipOverride?: number) => {
    const b = parseFloat(bill), t = tipOverride ?? parseFloat(tipPct), p = parseFloat(people);
    if ([b, t, p].some(isNaN) || p < 1) return;
    const tipAmount = b * (t / 100);
    const total = b + tipAmount;
    const perPerson = total / p;
    const r = {
      tipAmount: "$" + formatNumber(tipAmount),
      total: "$" + formatNumber(total),
      perPerson: "$" + formatNumber(perPerson),
    };
    setResult(r);
    save({ billAmount: bill, tipPercentage: t, numberOfPeople: people }, r);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Bill amount ($)</Label><Input type="number" value={bill} onChange={(e) => setBill(e.target.value)} data-testid="input-bill" /></div>
        <div><Label>Number of people</Label><Input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} data-testid="input-people" /></div>
      </div>
      <div>
        <Label>Tip percentage</Label>
        <div className="flex gap-2 mt-1.5 flex-wrap">
          {presets.map((p) => (
            <Button key={p} variant={tipPct === String(p) ? "default" : "outline"} size="sm" onClick={() => { setTipPct(String(p)); calculate(p); }} data-testid={`button-tip-${p}`}>{p}%</Button>
          ))}
        </div>
        <Input type="number" className="mt-2" value={tipPct} onChange={(e) => setTipPct(e.target.value)} placeholder="Custom %" data-testid="input-tip-custom" />
      </div>
      <Button onClick={() => calculate()} className="w-full" data-testid="button-calculate-tip">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Tip amount" value={result.tipAmount} />
          <ResultDisplay label="Total" value={result.total} />
          <ResultDisplay label="Per person" value={result.perPerson} />
        </ResultCard>
      )}
    </div>
  );
}
