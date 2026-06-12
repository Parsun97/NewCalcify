import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

const UNITS: Record<string, number> = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, t: 1000, st: 6.35029 };

export function WeightConverter({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [value, setValue] = useState("1"); const [from, setFrom] = useState("kg");
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return;
    const inKg = v * UNITS[from];
    const r: Record<string, string> = {};
    Object.entries(UNITS).forEach(([unit, factor]) => { r[unit] = formatNumber(inKg / factor, 6); });
    setResult(r);
    save({ value, from }, r);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1"><Label>Value</Label><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} data-testid="input-value" /></div>
        <div className="w-28"><Label>Unit</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(UNITS).map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <button onClick={convert} className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors" data-testid="button-convert-weight">Convert</button>
      {result && (
        <ResultCard>{Object.entries(result).map(([unit, val]) => <ResultDisplay key={unit} label={unit} value={val} />)}</ResultCard>
      )}
    </div>
  );
}
