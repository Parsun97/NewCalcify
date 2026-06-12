import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

const ACTIVITY = [
  { value: "1.2", label: "Sedentary (little/no exercise)" },
  { value: "1.375", label: "Lightly active (1–3 days/week)" },
  { value: "1.55", label: "Moderately active (3–5 days/week)" },
  { value: "1.725", label: "Very active (6–7 days/week)" },
  { value: "1.9", label: "Super active (physical job)" },
];

export function CalorieCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [age, setAge] = useState("30"); const [weight, setWeight] = useState("70"); const [height, setHeight] = useState("175");
  const [sex, setSex] = useState("male"); const [activity, setActivity] = useState("1.55");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const a = parseFloat(age), w = parseFloat(weight), h = parseFloat(height);
    if ([a, w, h].some(isNaN)) return;
    const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * parseFloat(activity);
    const r = {
      bmr: formatNumber(bmr, 0) + " kcal",
      maintenance: formatNumber(tdee, 0) + " kcal",
      mildLoss: formatNumber(tdee - 250, 0) + " kcal",
      loss: formatNumber(tdee - 500, 0) + " kcal",
      mildGain: formatNumber(tdee + 250, 0) + " kcal",
      gain: formatNumber(tdee + 500, 0) + " kcal",
    };
    setResult(r);
    save({ age, weightKg: weight, heightCm: height, sex, activityLevel: activity }, r);
  };

  return (
    <div className="space-y-4">
      <RadioGroup value={sex} onValueChange={setSex} className="flex gap-4">
        <div className="flex items-center gap-1.5"><RadioGroupItem value="male" id="male" /><Label htmlFor="male">Male</Label></div>
        <div className="flex items-center gap-1.5"><RadioGroupItem value="female" id="female" /><Label htmlFor="female">Female</Label></div>
      </RadioGroup>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>Age</Label><Input type="number" value={age} onChange={(e) => setAge(e.target.value)} data-testid="input-age" /></div>
        <div><Label>Weight (kg)</Label><Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} data-testid="input-weight" /></div>
        <div><Label>Height (cm)</Label><Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} data-testid="input-height" /></div>
      </div>
      <div>
        <Label>Activity level</Label>
        <Select value={activity} onValueChange={setActivity}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{ACTIVITY.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-calories">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Basal Metabolic Rate (BMR)" value={result.bmr} />
          <ResultDisplay label="Maintenance calories" value={result.maintenance} />
          <ResultDisplay label="Mild weight loss (−0.25kg/wk)" value={result.mildLoss} />
          <ResultDisplay label="Weight loss (−0.5kg/wk)" value={result.loss} />
          <ResultDisplay label="Mild weight gain (+0.25kg/wk)" value={result.mildGain} />
          <ResultDisplay label="Weight gain (+0.5kg/wk)" value={result.gain} />
        </ResultCard>
      )}
    </div>
  );
}
