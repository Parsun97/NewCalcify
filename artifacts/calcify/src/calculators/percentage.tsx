import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

export function PercentageCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [changeResult, setChangeResult] = useState<null | Record<string, string>>(null);

  const calcPercentOf = () => {
    const pct = parseFloat(a), total = parseFloat(b);
    if (!isNaN(pct) && !isNaN(total)) {
      const val = (pct / 100) * total;
      const r = { result: formatNumber(val), expression: `${pct}% of ${total} = ${formatNumber(val)}` };
      setResult(r);
      save({ percentage: pct, of: total }, r);
    }
  };

  const calcChange = () => {
    const from = parseFloat(v1), to = parseFloat(v2);
    if (!isNaN(from) && !isNaN(to) && from !== 0) {
      const change = ((to - from) / Math.abs(from)) * 100;
      const r = {
        change: formatNumber(change) + "%",
        direction: change >= 0 ? "increase" : "decrease",
        absolute: formatNumber(Math.abs(to - from)),
      };
      setChangeResult(r);
      save({ from, to }, r);
    }
  };

  return (
    <Tabs defaultValue="of">
      <TabsList className="mb-4">
        <TabsTrigger value="of">Percent of number</TabsTrigger>
        <TabsTrigger value="change">Percent change</TabsTrigger>
      </TabsList>

      <TabsContent value="of" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="pct-a">Percentage</Label>
            <div className="relative">
              <Input id="pct-a" type="number" placeholder="25" value={a} onChange={(e) => setA(e.target.value)} className="pr-6" data-testid="input-percentage" />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
            </div>
          </div>
          <div>
            <Label htmlFor="pct-b">Of number</Label>
            <Input id="pct-b" type="number" placeholder="200" value={b} onChange={(e) => setB(e.target.value)} data-testid="input-of-number" />
          </div>
        </div>
        <Button onClick={calcPercentOf} className="w-full" data-testid="button-calculate-percentage">Calculate</Button>
        {result && (
          <ResultCard>
            <ResultDisplay label="Result" value={result.result} />
            <p className="text-xs text-muted-foreground mt-2 text-center">{result.expression}</p>
          </ResultCard>
        )}
      </TabsContent>

      <TabsContent value="change" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="pct-v1">Original value</Label>
            <Input id="pct-v1" type="number" placeholder="100" value={v1} onChange={(e) => setV1(e.target.value)} data-testid="input-original-value" />
          </div>
          <div>
            <Label htmlFor="pct-v2">New value</Label>
            <Input id="pct-v2" type="number" placeholder="125" value={v2} onChange={(e) => setV2(e.target.value)} data-testid="input-new-value" />
          </div>
        </div>
        <Button onClick={calcChange} className="w-full" data-testid="button-calculate-change">Calculate</Button>
        {changeResult && (
          <ResultCard>
            <ResultDisplay label="Percent change" value={changeResult.change} />
            <ResultDisplay label="Direction" value={changeResult.direction} />
            <ResultDisplay label="Absolute change" value={changeResult.absolute} />
          </ResultCard>
        )}
      </TabsContent>
    </Tabs>
  );
}
