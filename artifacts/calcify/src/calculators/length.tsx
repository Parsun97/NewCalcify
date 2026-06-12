import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

const UNITS: Record<string, number> = {
  m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, "in": 0.0254, yd: 0.9144, nm: 1852, ly: 9.461e15,
};

export function LengthConverter({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [value, setValue] = useState("1"); const [from, setFrom] = useState("m");
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return;
    const inMeters = v * UNITS[from];
    const r: Record<string, string> = {};
    Object.entries(UNITS).forEach(([unit, factor]) => { r[unit] = formatNumber(inMeters / factor, 6); });
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
      <button onClick={convert} className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors" data-testid="button-convert-length">Convert</button>
      {result && (
        <ResultCard>
          {Object.entries(result).map(([unit, val]) => <ResultDisplay key={unit} label={unit} value={val} />)}
        </ResultCard>
      )}
    </div>
  );
}
