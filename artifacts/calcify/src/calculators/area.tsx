import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

const UNITS: Record<string, number> = { "m²": 1, "km²": 1e6, "cm²": 0.0001, "mm²": 1e-6, "ft²": 0.092903, "in²": 0.00064516, "yd²": 0.836127, "ac": 4046.86, "ha": 10000, "mi²": 2.59e6 };

export function AreaConverter({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [value, setValue] = useState("1"); const [from, setFrom] = useState("m²");
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return;
    const inM2 = v * UNITS[from];
    const r: Record<string, string> = {};
    Object.entries(UNITS).forEach(([unit, factor]) => { r[unit] = formatNumber(inM2 / factor, 6); });
    setResult(r);
    save({ value, from }, r);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1"><Label>Area</Label><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} data-testid="input-area" /></div>
        <div className="w-28"><Label>Unit</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(UNITS).map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <button onClick={convert} className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors" data-testid="button-convert-area">Convert</button>
      {result && (
        <ResultCard>{Object.entries(result).map(([k, v]) => <ResultDisplay key={k} label={k} value={v} />)}</ResultCard>
      )}
    </div>
  );
}
