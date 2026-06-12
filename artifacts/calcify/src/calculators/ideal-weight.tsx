import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function IdealWeightCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [heightCm, setHeightCm] = useState("170"); const [sex, setSex] = useState("male");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const h = parseFloat(heightCm);
    if (isNaN(h)) return;
    const hIn = h / 2.54;
    const over60 = hIn - 60;
    const devine = sex === "male" ? 50 + 2.3 * over60 : 45.5 + 2.3 * over60;
    const robinson = sex === "male" ? 52 + 1.9 * over60 : 49 + 1.7 * over60;
    const miller = sex === "male" ? 56.2 + 1.41 * over60 : 53.1 + 1.36 * over60;
    const r = {
      devine: formatNumber(devine, 1) + " kg",
      robinson: formatNumber(robinson, 1) + " kg",
      miller: formatNumber(miller, 1) + " kg",
      range: `${formatNumber(Math.min(devine, robinson, miller), 1)}–${formatNumber(Math.max(devine, robinson, miller), 1)} kg`,
    };
    setResult(r);
    save({ heightCm, sex }, r);
  };

  return (
    <div className="space-y-4">
      <RadioGroup value={sex} onValueChange={setSex} className="flex gap-4">
        <div className="flex items-center gap-1.5"><RadioGroupItem value="male" id="iw-male" /><Label htmlFor="iw-male">Male</Label></div>
        <div className="flex items-center gap-1.5"><RadioGroupItem value="female" id="iw-female" /><Label htmlFor="iw-female">Female</Label></div>
      </RadioGroup>
      <div><Label>Height (cm)</Label><Input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} data-testid="input-height" /></div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-ideal-weight">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Devine formula" value={result.devine} />
          <ResultDisplay label="Robinson formula" value={result.robinson} />
          <ResultDisplay label="Miller formula" value={result.miller} />
          <ResultDisplay label="Typical range" value={result.range} />
        </ResultCard>
      )}
    </div>
  );
}
