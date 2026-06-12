import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function ExponentCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [base, setBase] = useState(""); const [exp, setExp] = useState("");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const b = parseFloat(base), e = parseFloat(exp);
    if (isNaN(b) || isNaN(e)) return;
    const val = Math.pow(b, e);
    const r = { result: formatNumber(val, 6), expression: `${b}^${e} = ${val}` };
    setResult(r);
    save({ base: b, exponent: e }, r);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="exp-base">Base</Label>
          <Input id="exp-base" type="number" placeholder="2" value={base} onChange={(e) => setBase(e.target.value)} data-testid="input-base" />
        </div>
        <div>
          <Label htmlFor="exp-exp">Exponent</Label>
          <Input id="exp-exp" type="number" placeholder="8" value={exp} onChange={(e) => setExp(e.target.value)} data-testid="input-exponent" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Square root of base</Label>
          <div className="h-9 flex items-center px-3 rounded-md border border-border/60 bg-muted text-sm text-muted-foreground">
            {base && !isNaN(parseFloat(base)) ? formatNumber(Math.sqrt(parseFloat(base)), 6) : "—"}
          </div>
        </div>
        <div>
          <Label>Cube root of base</Label>
          <div className="h-9 flex items-center px-3 rounded-md border border-border/60 bg-muted text-sm text-muted-foreground">
            {base && !isNaN(parseFloat(base)) ? formatNumber(Math.cbrt(parseFloat(base)), 6) : "—"}
          </div>
        </div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-exponent">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Result" value={result.result} />
          <p className="text-xs text-muted-foreground mt-2 text-center">{result.expression}</p>
        </ResultCard>
      )}
    </div>
  );
}
