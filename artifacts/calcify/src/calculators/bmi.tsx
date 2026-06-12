import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function BMICalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [weightKg, setWeightKg] = useState(""); const [heightCm, setHeightCm] = useState("");
  const [weightLb, setWeightLb] = useState(""); const [heightFt, setHeightFt] = useState(""); const [heightIn, setHeightIn] = useState("");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const calcMetric = () => {
    const w = parseFloat(weightKg), h = parseFloat(heightCm) / 100;
    if ([w, h].some(isNaN) || h <= 0) return;
    const bmi = w / (h * h);
    const r = { bmi: formatNumber(bmi, 1), category: getBMICategory(bmi) };
    setResult(r);
    save({ weightKg, heightCm, unit: "metric" }, r);
  };

  const calcImperial = () => {
    const w = parseFloat(weightLb), totalIn = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
    if ([w, totalIn].some(isNaN) || totalIn <= 0) return;
    const bmi = (w / (totalIn * totalIn)) * 703;
    const r = { bmi: formatNumber(bmi, 1), category: getBMICategory(bmi) };
    setResult(r);
    save({ weightLb, heightFt, heightIn, unit: "imperial" }, r);
  };

  const categoryColor: Record<string, string> = {
    "Underweight": "text-sky-600", "Normal weight": "text-emerald-600", "Overweight": "text-amber-600", "Obese": "text-rose-600",
  };

  return (
    <Tabs defaultValue="metric">
      <TabsList className="mb-4"><TabsTrigger value="metric">Metric (kg/cm)</TabsTrigger><TabsTrigger value="imperial">Imperial (lb/ft)</TabsTrigger></TabsList>
      <TabsContent value="metric" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Weight (kg)</Label><Input type="number" placeholder="70" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} data-testid="input-weight-kg" /></div>
          <div><Label>Height (cm)</Label><Input type="number" placeholder="175" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} data-testid="input-height-cm" /></div>
        </div>
        <Button onClick={calcMetric} className="w-full" data-testid="button-calculate-bmi-metric">Calculate BMI</Button>
      </TabsContent>
      <TabsContent value="imperial" className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><Label>Weight (lb)</Label><Input type="number" placeholder="154" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} data-testid="input-weight-lb" /></div>
          <div><Label>Height (ft)</Label><Input type="number" placeholder="5" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} data-testid="input-height-ft" /></div>
          <div><Label>Inches</Label><Input type="number" placeholder="9" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} data-testid="input-height-in" /></div>
        </div>
        <Button onClick={calcImperial} className="w-full" data-testid="button-calculate-bmi-imperial">Calculate BMI</Button>
      </TabsContent>
      {result && (
        <ResultCard>
          <ResultDisplay label="BMI" value={result.bmi} />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Category</span>
            <span className={`text-sm font-semibold ${categoryColor[result.category] ?? ""}`}>{result.category}</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
            <div>Underweight: &lt; 18.5 · Normal: 18.5–24.9 · Overweight: 25–29.9 · Obese: ≥ 30</div>
          </div>
        </ResultCard>
      )}
    </Tabs>
  );
}
