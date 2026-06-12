import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { CalculatorProps } from "./index";

export function ScientificCalculator({ calculatorSlug, calculatorName }: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");
  const [isRad, setIsRad] = useState(true);
  const [prevResult, setPrevResult] = useState<string | null>(null);

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const handleNum = (val: string) => {
    if (display === "0" || prevResult !== null) {
      setDisplay(val);
      setPrevResult(null);
    } else {
      setDisplay(display + val);
    }
  };

  const handleOp = (op: string) => {
    setExpr(display + " " + op + " ");
    setDisplay("0");
    setPrevResult(null);
  };

  const handleEquals = () => {
    try {
      const full = expr + display;
      const result = Function('"use strict"; return (' + full.replace(/×/g, "*").replace(/÷/g, "/") + ")")();
      setDisplay(String(parseFloat(result.toFixed(10))));
      setExpr("");
      setPrevResult(String(result));
    } catch {
      setDisplay("Error");
    }
  };

  const handleFunc = (fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;
    let result: number;
    switch (fn) {
      case "sin": result = Math.sin(isRad ? val : toRad(val)); break;
      case "cos": result = Math.cos(isRad ? val : toRad(val)); break;
      case "tan": result = Math.tan(isRad ? val : toRad(val)); break;
      case "log": result = Math.log10(val); break;
      case "ln": result = Math.log(val); break;
      case "sqrt": result = Math.sqrt(val); break;
      case "x2": result = val * val; break;
      case "1/x": result = 1 / val; break;
      case "abs": result = Math.abs(val); break;
      case "pi": result = Math.PI; break;
      case "e": result = Math.E; break;
      default: return;
    }
    setDisplay(String(parseFloat(result.toFixed(10))));
  };

  const handleClear = () => { setDisplay("0"); setExpr(""); setPrevResult(null); };
  const handleBack = () => setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  const handleDecimal = () => { if (!display.includes(".")) setDisplay(display + "."); };
  const handlePlusMinus = () => setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);

  const btnClass = "h-10 text-sm font-medium rounded-lg transition-all active:scale-95";

  return (
    <div className="space-y-3 max-w-xs mx-auto">
      <div className="flex items-center gap-2 justify-end mb-1">
        <Label className="text-xs text-muted-foreground">DEG</Label>
        <Switch checked={isRad} onCheckedChange={setIsRad} />
        <Label className="text-xs text-muted-foreground">RAD</Label>
      </div>
      <div className="rounded-xl bg-muted/60 border border-border/60 p-3 min-h-[72px] text-right">
        {expr && <div className="text-xs text-muted-foreground mb-1">{expr}</div>}
        <div className="text-2xl font-mono font-semibold overflow-hidden text-ellipsis" data-testid="text-display">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: "sin", action: () => handleFunc("sin") },
          { label: "cos", action: () => handleFunc("cos") },
          { label: "tan", action: () => handleFunc("tan") },
          { label: "C", action: handleClear, className: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
          { label: "log", action: () => handleFunc("log") },
          { label: "ln", action: () => handleFunc("ln") },
          { label: "√", action: () => handleFunc("sqrt") },
          { label: "⌫", action: handleBack },
          { label: "x²", action: () => handleFunc("x2") },
          { label: "1/x", action: () => handleFunc("1/x") },
          { label: "π", action: () => handleFunc("pi") },
          { label: "÷", action: () => handleOp("÷"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
          { label: "7", action: () => handleNum("7") },
          { label: "8", action: () => handleNum("8") },
          { label: "9", action: () => handleNum("9") },
          { label: "×", action: () => handleOp("×"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
          { label: "4", action: () => handleNum("4") },
          { label: "5", action: () => handleNum("5") },
          { label: "6", action: () => handleNum("6") },
          { label: "−", action: () => handleOp("-"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
          { label: "1", action: () => handleNum("1") },
          { label: "2", action: () => handleNum("2") },
          { label: "3", action: () => handleNum("3") },
          { label: "+", action: () => handleOp("+"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
          { label: "+/−", action: handlePlusMinus },
          { label: "0", action: () => handleNum("0") },
          { label: ".", action: handleDecimal },
          { label: "=", action: handleEquals, className: "bg-primary text-primary-foreground hover:bg-primary/90" },
        ].map((btn, i) => (
          <Button
            key={i}
            variant="outline"
            className={`${btnClass} ${btn.className ?? ""}`}
            onClick={btn.action}
            data-testid={`button-calc-${btn.label.replace(/[^a-z0-9]/gi, "")}`}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
