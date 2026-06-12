import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53, CHF: 0.89,
  CNY: 7.24, INR: 83.1, MXN: 17.2, BRL: 5.0, KRW: 1330, SGD: 1.34, HKD: 7.82, NOK: 10.6,
};

export function CurrencyCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const a = parseFloat(amount);
    if (isNaN(a)) return;
    const converted = (a / RATES[from]) * RATES[to];
    const r = { result: formatNumber(converted, 4) + " " + to, rate: `1 ${from} = ${formatNumber(RATES[to] / RATES[from], 4)} ${to}` };
    setResult(r);
    save({ amount, from, to }, r);
  };

  const swap = () => { setFrom(to); setTo(from); setResult(null); };

  return (
    <div className="space-y-4">
      <div>
        <Label>Amount</Label>
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} data-testid="input-amount" />
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label>From</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger data-testid="select-from"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(RATES).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon" className="mb-0.5 shrink-0" onClick={swap} data-testid="button-swap"><ArrowLeftRight className="h-4 w-4" /></Button>
        <div className="flex-1">
          <Label>To</Label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger data-testid="select-to"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(RATES).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-currency">Convert</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Converted amount" value={result.result} />
          <ResultDisplay label="Exchange rate" value={result.rate} />
          <p className="text-xs text-muted-foreground mt-2 text-center">Rates are approximate reference rates</p>
        </ResultCard>
      )}
    </div>
  );
}
