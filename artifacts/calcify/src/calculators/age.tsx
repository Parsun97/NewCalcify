import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResultCard, ResultDisplay, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function AgeCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [dob, setDob] = useState(""); const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const calculate = () => {
    const birth = new Date(dob), to = new Date(toDate);
    if (isNaN(birth.getTime()) || isNaN(to.getTime())) return;
    let years = to.getFullYear() - birth.getFullYear();
    let months = to.getMonth() - birth.getMonth();
    let days = to.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((to.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const nextBirthday = new Date(to.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < to) nextBirthday.setFullYear(to.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBirthday.getTime() - to.getTime()) / (1000 * 60 * 60 * 24));
    const r = {
      age: `${years} years, ${months} months, ${days} days`,
      totalDays: totalDays.toLocaleString(),
      totalWeeks: totalWeeks.toLocaleString(),
      totalMonths: String(totalMonths),
      daysToNextBirthday: String(daysToNext),
    };
    setResult(r);
    save({ dateOfBirth: dob, toDate }, r);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Date of birth</Label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring" data-testid="input-dob" />
        </div>
        <div>
          <Label>Age at date</Label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring" data-testid="input-to-date" />
        </div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-age">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Age" value={result.age} />
          <ResultDisplay label="Total days lived" value={result.totalDays} />
          <ResultDisplay label="Total weeks" value={result.totalWeeks} />
          <ResultDisplay label="Total months" value={result.totalMonths} />
          <ResultDisplay label="Days to next birthday" value={result.daysToNextBirthday} />
        </ResultCard>
      )}
    </div>
  );
}
