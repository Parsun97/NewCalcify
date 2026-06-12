import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard, ResultDisplay, useCalculatorHistory } from "./_base";
import type { CalculatorProps } from "./index";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
function simplify(n: number, d: number) {
  const g = gcd(Math.abs(n), Math.abs(d));
  return { n: n / g, d: d / g };
}

export function FractionCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const { save } = useCalculatorHistory({ calculatorSlug, calculatorName });
  const [n1, setN1] = useState(""); const [d1, setD1] = useState("1");
  const [n2, setN2] = useState(""); const [d2, setD2] = useState("1");
  const [op, setOp] = useState("+");
  const [result, setResult] = useState<null | { num: number; den: number; decimal: string }>(null);

  const calculate = () => {
    const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), d = parseInt(d2);
    if ([a, b, c, d].some(isNaN) || b === 0 || d === 0) return;
    let rn: number, rd: number;
    if (op === "+") { rn = a * d + c * b; rd = b * d; }
    else if (op === "-") { rn = a * d - c * b; rd = b * d; }
    else if (op === "×") { rn = a * c; rd = b * d; }
    else { rn = a * d; rd = b * c; }
    if (rd === 0) return;
    const s = simplify(rn, rd);
    const r = { num: s.n, den: s.d, decimal: (s.n / s.d).toFixed(6) };
    setResult(r);
    save({ fraction1: `${a}/${b}`, op, fraction2: `${c}/${d}` }, { result: `${s.n}/${s.d}`, decimal: r.decimal });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Label>First fraction</Label>
          <div className="flex items-center gap-1.5">
            <Input type="number" placeholder="1" value={n1} onChange={(e) => setN1(e.target.value)} data-testid="input-n1" />
            <span className="text-muted-foreground font-bold">/</span>
            <Input type="number" placeholder="2" value={d1} onChange={(e) => setD1(e.target.value)} data-testid="input-d1" />
          </div>
        </div>
        <div className="w-20 shrink-0">
          <Label>Operation</Label>
          <Select value={op} onValueChange={setOp}>
            <SelectTrigger data-testid="select-operation"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="+">+</SelectItem>
              <SelectItem value="-">−</SelectItem>
              <SelectItem value="×">×</SelectItem>
              <SelectItem value="÷">÷</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label>Second fraction</Label>
          <div className="flex items-center gap-1.5">
            <Input type="number" placeholder="1" value={n2} onChange={(e) => setN2(e.target.value)} data-testid="input-n2" />
            <span className="text-muted-foreground font-bold">/</span>
            <Input type="number" placeholder="3" value={d2} onChange={(e) => setD2(e.target.value)} data-testid="input-d2" />
          </div>
        </div>
      </div>
      <Button onClick={calculate} className="w-full" data-testid="button-calculate-fraction">Calculate</Button>
      {result && (
        <ResultCard>
          <ResultDisplay label="Result" value={`${result.num} / ${result.den}`} />
          <ResultDisplay label="Decimal" value={result.decimal} />
        </ResultCard>
      )}
    </div>
  );
}
