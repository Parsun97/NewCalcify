import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard, ResultDisplay, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

const ZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Toronto", "America/Vancouver", "America/Sao_Paulo", "Europe/London", "Europe/Paris",
  "Europe/Berlin", "Europe/Moscow", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore",
  "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney", "Pacific/Auckland", "Pacific/Honolulu",
];

export function TimeZoneConverter({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [time, setTime] = useState(new Date().toISOString().slice(0, 16));
  const [from, setFrom] = useState("UTC"); const [to, setTo] = useState("America/New_York");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const convert = () => {
    try {
      const date = new Date(time + (from === "UTC" ? "Z" : ""));
      const converted = date.toLocaleString("en-US", { timeZone: to, dateStyle: "full", timeStyle: "long" });
      const original = date.toLocaleString("en-US", { timeZone: from, dateStyle: "full", timeStyle: "long" });
      const r = { from: original, to: converted };
      setResult(r);
      save({ time, fromZone: from, toZone: to }, r);
    } catch {}
  };

  const dateInputClass = "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-4">
      <div><Label>Date & time</Label><input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} className={dateInputClass} data-testid="input-datetime" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>From timezone</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger data-testid="select-from-tz"><SelectValue /></SelectTrigger>
            <SelectContent>{ZONES.map((z) => <SelectItem key={z} value={z}>{z.replace("_", " ")}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>To timezone</Label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger data-testid="select-to-tz"><SelectValue /></SelectTrigger>
            <SelectContent>{ZONES.map((z) => <SelectItem key={z} value={z}>{z.replace("_", " ")}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={convert} className="w-full" data-testid="button-convert-timezone">Convert</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label={from} value={result.from} />
          <ResultDisplay label={to} value={result.to} />
        </ResultCard>
      )}
    </div>
  );
}
