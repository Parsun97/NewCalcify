import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultCard, ResultDisplay, formatNumber, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function combination(n: number, r: number): number {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function ProbabilityCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [favourable, setFavourable] = useState("3"); const [total, setTotal] = useState("6");
  const [pA, setPA] = useState("0.5"); const [pB, setPB] = useState("0.3");
  const [n, setN] = useState("10"); const [k, setK] = useState("3"); const [p, setP] = useState("0.5");
  const [result1, setResult1] = useState<null | Record<string, string>>(null);
  const [result2, setResult2] = useState<null | Record<string, string>>(null);
  const [result3, setResult3] = useState<null | Record<string, string>>(null);

  const calcBasic = () => {
    const f = parseFloat(favourable), t = parseFloat(total);
    if ([f, t].some(isNaN) || t === 0) return;
    const prob = f / t;
    const r = { probability: formatNumber(prob, 4), percentage: formatNumber(prob * 100, 2) + "%", odds: `${f}:${t - f}` };
    setResult1(r);
    save({ favourable, total }, r);
  };

  const calcEvents = () => {
    const a = parseFloat(pA), b = parseFloat(pB);
    if ([a, b].some(isNaN)) return;
    const r = {
      "P(A or B)": formatNumber(a + b - a * b, 4),
      "P(A and B)": formatNumber(a * b, 4),
      "P(not A)": formatNumber(1 - a, 4),
      "P(not B)": formatNumber(1 - b, 4),
    };
    setResult2(r);
    save({ pA, pB }, r);
  };

  const calcBinomial = () => {
    const nv = parseInt(n), kv = parseInt(k), pv = parseFloat(p);
    if ([nv, kv, pv].some(isNaN) || kv > nv) return;
    const prob = combination(nv, kv) * Math.pow(pv, kv) * Math.pow(1 - pv, nv - kv);
    const mean = nv * pv;
    const r = { "P(X = k)": formatNumber(prob, 6), mean: formatNumber(mean), stdDev: formatNumber(Math.sqrt(mean * (1 - pv))) };
    setResult3(r);
    save({ n, k, p }, r);
  };

  return (
    <Tabs defaultValue="basic">
      <TabsList className="mb-4">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="events">Two events</TabsTrigger>
        <TabsTrigger value="binomial">Binomial</TabsTrigger>
      </TabsList>
      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Favourable outcomes</Label><Input type="number" value={favourable} onChange={(e) => setFavourable(e.target.value)} data-testid="input-favourable" /></div>
          <div><Label>Total outcomes</Label><Input type="number" value={total} onChange={(e) => setTotal(e.target.value)} data-testid="input-total" /></div>
        </div>
        <Button onClick={calcBasic} className="w-full" data-testid="button-calc-basic-prob">Calculate</Button>
        {result1 && <ResultCard>{Object.entries(result1).map(([k, v]) => <ResultDisplay key={k} label={k} value={v} />)}</ResultCard>}
      </TabsContent>
      <TabsContent value="events" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>P(A)</Label><Input type="number" step="0.01" min="0" max="1" value={pA} onChange={(e) => setPA(e.target.value)} data-testid="input-pa" /></div>
          <div><Label>P(B)</Label><Input type="number" step="0.01" min="0" max="1" value={pB} onChange={(e) => setPB(e.target.value)} data-testid="input-pb" /></div>
        </div>
        <Button onClick={calcEvents} className="w-full" data-testid="button-calc-events-prob">Calculate</Button>
        {result2 && <ResultCard>{Object.entries(result2).map(([k, v]) => <ResultDisplay key={k} label={k} value={v} />)}</ResultCard>}
      </TabsContent>
      <TabsContent value="binomial" className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><Label>Trials (n)</Label><Input type="number" value={n} onChange={(e) => setN(e.target.value)} data-testid="input-n" /></div>
          <div><Label>Successes (k)</Label><Input type="number" value={k} onChange={(e) => setK(e.target.value)} data-testid="input-k" /></div>
          <div><Label>Probability (p)</Label><Input type="number" step="0.01" min="0" max="1" value={p} onChange={(e) => setP(e.target.value)} data-testid="input-p" /></div>
        </div>
        <Button onClick={calcBinomial} className="w-full" data-testid="button-calc-binomial">Calculate</Button>
        {result3 && <ResultCard>{Object.entries(result3).map(([k, v]) => <ResultDisplay key={k} label={k} value={v} />)}</ResultCard>}
      </TabsContent>
    </Tabs>
  );
}
