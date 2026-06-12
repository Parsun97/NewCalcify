import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

const UNITS: Record<string, number> = { "m/s": 1, "km/h": 1 / 3.6, "mph": 0.44704, "kn": 0.514444, "ft/s": 0.3048, "mach": 340.29 };

export function SpeedConverter({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [value, setValue] = useState("100"); const [from, setFrom] = useState("km/h");
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return;
    const inMs = v * UNITS[from];
    const r: Record<string, string> = {};
    Object.entries(UNITS).forEach(([unit, factor]) => { r[unit] = formatNumber(inMs / factor, 4); });
    setResult(r);
    save({ value, from }, r);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1"><Label>Speed</Label><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} data-testid="input-speed" /></div>
        <div className="w-32"><Label>Unit</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(UNITS).map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <button onClick={convert} className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors" data-testid="button-convert-speed">Convert</button>
      {result && (
        <ResultCard>{Object.entries(result).map(([k, v]) => <ResultDisplay key={k} label={k} value={v} />)}</ResultCard>
      )}
    </div>
  );
}
