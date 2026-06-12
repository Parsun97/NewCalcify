import type { ComponentType } from "react";
import { PercentageCalculator } from "./percentage";
import { FractionCalculator } from "./fraction";
import { AverageCalculator } from "./average";
import { ExponentCalculator } from "./exponent";
import { ScientificCalculator } from "./scientific";
import { MortgageCalculator } from "./mortgage";
import { CompoundInterestCalculator } from "./compound-interest";
import { LoanCalculator } from "./loan";
import { ROICalculator } from "./roi";
import { SavingsCalculator } from "./savings";
import { TipCalculator } from "./tip";
import { CurrencyCalculator } from "./currency";
import { BMICalculator } from "./bmi";
import { CalorieCalculator } from "./calorie";
import { IdealWeightCalculator } from "./ideal-weight";
import { BodyFatCalculator } from "./body-fat";
import { PregnancyCalculator } from "./pregnancy";
import { LengthConverter } from "./length";
import { WeightConverter } from "./weight";
import { TemperatureConverter } from "./temperature";
import { AreaConverter } from "./area";
import { SpeedConverter } from "./speed";
import { AgeCalculator } from "./age";
import { DateDiffCalculator } from "./date-diff";
import { TimeZoneConverter } from "./time-zone";
import { MeanMedianModeCalculator } from "./mean-median-mode";
import { StandardDeviationCalculator } from "./standard-deviation";
import { ProbabilityCalculator } from "./probability";

export interface CalculatorProps {
  calculatorSlug: string;
  calculatorName: string;
}

const registry: Record<string, ComponentType<CalculatorProps>> = {
  percentage: PercentageCalculator,
  fraction: FractionCalculator,
  average: AverageCalculator,
  exponent: ExponentCalculator,
  scientific: ScientificCalculator,
  mortgage: MortgageCalculator,
  "compound-interest": CompoundInterestCalculator,
  loan: LoanCalculator,
  roi: ROICalculator,
  savings: SavingsCalculator,
  tip: TipCalculator,
  currency: CurrencyCalculator,
  bmi: BMICalculator,
  calorie: CalorieCalculator,
  "ideal-weight": IdealWeightCalculator,
  "body-fat": BodyFatCalculator,
  pregnancy: PregnancyCalculator,
  length: LengthConverter,
  weight: WeightConverter,
  temperature: TemperatureConverter,
  area: AreaConverter,
  speed: SpeedConverter,
  age: AgeCalculator,
  "date-diff": DateDiffCalculator,
  "time-zone": TimeZoneConverter,
  "mean-median-mode": MeanMedianModeCalculator,
  "standard-deviation": StandardDeviationCalculator,
  probability: ProbabilityCalculator,
};

export function getCalculatorComponent(slug: string): ComponentType<CalculatorProps> | null {
  return registry[slug] ?? null;
}
