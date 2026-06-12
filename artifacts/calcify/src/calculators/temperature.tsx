import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function TemperatureConverter({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [value, setValue] = useState("100"); const [from, setFrom] = useState("C");
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return;
    let celsius: number;
    if (from === "C") celsius = v;
    else if (from === "F") celsius = (v - 32) * 5 / 9;
    else celsius = v - 273.15;
    const r = {
      Celsius: formatNumber(celsius, 4) + " °C",
      Fahrenheit: formatNumber(celsius * 9 / 5 + 32, 4) + " °F",
      Kelvin: formatNumber(celsius + 273.15, 4) + " K",
    };
    setResult(r);
    save({ value, from }, r);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1"><Label>Temperature</Label><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} data-testid="input-temp" /></div>
        <div className="w-28"><Label>Unit</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="C">Celsius (°C)</SelectItem>
              <SelectItem value="F">Fahrenheit (°F)</SelectItem>
              <SelectItem value="K">Kelvin (K)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <button onClick={convert} className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors" data-testid="button-convert-temp">Convert</button>
      {result && (
        <ResultCard>{Object.entries(result).map(([k, v]) => <ResultDisplay key={k} label={k} value={v} />)}</ResultCard>
      )}
    </div>
  );
}
