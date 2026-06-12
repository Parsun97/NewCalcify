import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function BodyFatCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [sex, setSex] = useState("male");
  const [waist, setWaist] = useState(""); const [neck, setNeck] = useState(""); const [height, setHeight] = useState(""); const [hip, setHip] = useState("");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const w = parseFloat(waist), n = parseFloat(neck), h = parseFloat(height), hp = parseFloat(hip);
    if (sex === "male") {
      if ([w, n, h].some(isNaN) || w <= n) return;
      const bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
      const r = { bodyFat: formatNumber(bf, 1) + "%", leanMass: "~" + formatNumber(100 - bf, 1) + "%" };
      setResult(r);
      save({ sex, waistCm: waist, neckCm: neck, heightCm: height }, r);
    } else {
      if ([w, n, h, hp].some(isNaN) || w + hp <= n) return;
      const bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
      const r = { bodyFat: formatNumber(bf, 1) + "%", leanMass: "~" + formatNumber(100 - bf, 1) + "%" };
      setResult(r);
      save({ sex, waistCm: waist, neckCm: neck, hipCm: hip, heightCm: height }, r);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Uses the U.S. Navy body fat formula. Measure all circumferences in cm.</p>
      <RadioGroup value={sex} onValueChange={setSex} className="flex gap-4">
        <div className="flex items-center gap-1.5"><RadioGroupItem value="male" id="bf-male" /><Label htmlFor="bf-male">Male</Label></div>
        <div className="flex items-center gap-1.5"><RadioGroupItem value="female" id="bf-female" /><Label htmlFor="bf-female">Female</Label></div>
      </RadioGroup>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Waist (cm)</Label><Input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} data-testid="input-waist" /></div>
        <div><Label>Neck (cm)</Label><Input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} data-testid="input-neck" /></div>
        {sex === "female" && <div><Label>Hip (cm)</Label><Input type="number" value={hip} onChange={(e) => setHip(e.target.value)} data-testid="input-hip" /></div>}
        <div><Label>Height (cm)</Label><Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} data-testid="input-height" /></div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-bodyfat">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Body fat" value={result.bodyFat} />
          <ResultDisplay label="Lean mass" value={result.leanMass} />
        </ResultCard>
      )}
    </div>
  );
}
