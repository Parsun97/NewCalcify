export interface CalculatorMeta {
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  icon: string;
  tags: string[];
  isFeatured: boolean;
}

export interface CategoryMeta {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { slug: "math", name: "Math", description: "Essential math calculators for everyday calculations", icon: "Calculator" },
  { slug: "finance", name: "Finance", description: "Financial planning and investment calculators", icon: "DollarSign" },
  { slug: "health", name: "Health", description: "Health and fitness metric calculators", icon: "Heart" },
  { slug: "conversion", name: "Unit Conversion", description: "Convert between units of measurement", icon: "ArrowLeftRight" },
  { slug: "date", name: "Date & Time", description: "Date, time, and age calculators", icon: "Calendar" },
  { slug: "statistics", name: "Statistics", description: "Statistical analysis and probability calculators", icon: "BarChart2" },
];

export const CALCULATORS: CalculatorMeta[] = [
  // Math
  { slug: "percentage", name: "Percentage Calculator", description: "Calculate percentages, percentage change, and percentage of a number", category: "Math", categorySlug: "math", icon: "Percent", tags: ["math", "percentage", "ratio"], isFeatured: true },
  { slug: "fraction", name: "Fraction Calculator", description: "Add, subtract, multiply, and divide fractions with step-by-step solutions", category: "Math", categorySlug: "math", icon: "Divide", tags: ["math", "fraction", "arithmetic"], isFeatured: false },
  { slug: "average", name: "Average Calculator", description: "Calculate mean, sum, and count of a set of numbers", category: "Math", categorySlug: "math", icon: "BarChart2", tags: ["math", "average", "mean"], isFeatured: false },
  { slug: "exponent", name: "Exponent Calculator", description: "Calculate powers and exponents including square roots and cube roots", category: "Math", categorySlug: "math", icon: "Superscript", tags: ["math", "exponent", "power"], isFeatured: false },
  { slug: "scientific", name: "Scientific Calculator", description: "Full-featured scientific calculator with trigonometry and logarithms", category: "Math", categorySlug: "math", icon: "Calculator", tags: ["math", "scientific", "trigonometry"], isFeatured: true },

  // Finance
  { slug: "mortgage", name: "Mortgage Calculator", description: "Calculate monthly mortgage payments, total interest, and amortization schedule", category: "Finance", categorySlug: "finance", icon: "Home", tags: ["finance", "mortgage", "loan", "real estate"], isFeatured: true },
  { slug: "compound-interest", name: "Compound Interest Calculator", description: "Calculate how your investments grow with compound interest over time", category: "Finance", categorySlug: "finance", icon: "TrendingUp", tags: ["finance", "investment", "interest", "savings"], isFeatured: true },
  { slug: "loan", name: "Loan Calculator", description: "Calculate monthly loan payments, total cost, and interest for any loan", category: "Finance", categorySlug: "finance", icon: "CreditCard", tags: ["finance", "loan", "payment", "interest"], isFeatured: false },
  { slug: "roi", name: "ROI Calculator", description: "Calculate return on investment and annualized ROI percentage", category: "Finance", categorySlug: "finance", icon: "PieChart", tags: ["finance", "roi", "investment", "return"], isFeatured: false },
  { slug: "savings", name: "Savings Calculator", description: "Project your savings growth with regular contributions", category: "Finance", categorySlug: "finance", icon: "PiggyBank", tags: ["finance", "savings", "goal", "interest"], isFeatured: false },
  { slug: "tip", name: "Tip Calculator", description: "Calculate tip amount and split bills between multiple people", category: "Finance", categorySlug: "finance", icon: "Receipt", tags: ["finance", "tip", "restaurant", "split"], isFeatured: false },
  { slug: "currency", name: "Currency Converter", description: "Convert between major world currencies using reference exchange rates", category: "Finance", categorySlug: "finance", icon: "RefreshCw", tags: ["finance", "currency", "exchange", "conversion"], isFeatured: false },

  // Health
  { slug: "bmi", name: "BMI Calculator", description: "Calculate your Body Mass Index and understand your weight category", category: "Health", categorySlug: "health", icon: "Activity", tags: ["health", "bmi", "weight", "fitness"], isFeatured: true },
  { slug: "calorie", name: "Calorie Calculator", description: "Calculate your daily caloric needs based on activity level and goals", category: "Health", categorySlug: "health", icon: "Flame", tags: ["health", "calorie", "nutrition", "diet"], isFeatured: true },
  { slug: "ideal-weight", name: "Ideal Weight Calculator", description: "Find your ideal body weight range based on height and frame size", category: "Health", categorySlug: "health", icon: "Scale", tags: ["health", "weight", "ideal", "fitness"], isFeatured: false },
  { slug: "body-fat", name: "Body Fat Calculator", description: "Estimate your body fat percentage using body measurements", category: "Health", categorySlug: "health", icon: "User", tags: ["health", "body fat", "fitness", "composition"], isFeatured: false },
  { slug: "pregnancy", name: "Due Date Calculator", description: "Calculate your estimated due date and pregnancy milestones", category: "Health", categorySlug: "health", icon: "Baby", tags: ["health", "pregnancy", "due date", "baby"], isFeatured: false },

  // Conversion
  { slug: "length", name: "Length Converter", description: "Convert between meters, feet, inches, miles, kilometers, and more", category: "Unit Conversion", categorySlug: "conversion", icon: "Ruler", tags: ["conversion", "length", "distance", "metric"], isFeatured: false },
  { slug: "weight", name: "Weight Converter", description: "Convert between kilograms, pounds, ounces, grams, and more", category: "Unit Conversion", categorySlug: "conversion", icon: "Weight", tags: ["conversion", "weight", "mass", "metric"], isFeatured: false },
  { slug: "temperature", name: "Temperature Converter", description: "Convert between Celsius, Fahrenheit, and Kelvin", category: "Unit Conversion", categorySlug: "conversion", icon: "Thermometer", tags: ["conversion", "temperature", "celsius", "fahrenheit"], isFeatured: true },
  { slug: "area", name: "Area Converter", description: "Convert between square meters, acres, square feet, hectares, and more", category: "Unit Conversion", categorySlug: "conversion", icon: "Square", tags: ["conversion", "area", "square", "metric"], isFeatured: false },
  { slug: "speed", name: "Speed Converter", description: "Convert between mph, km/h, m/s, knots, and more", category: "Unit Conversion", categorySlug: "conversion", icon: "Gauge", tags: ["conversion", "speed", "velocity", "mph"], isFeatured: false },

  // Date & Time
  { slug: "age", name: "Age Calculator", description: "Calculate exact age in years, months, and days from a birthdate", category: "Date & Time", categorySlug: "date", icon: "CalendarDays", tags: ["date", "age", "birthday", "years"], isFeatured: true },
  { slug: "date-diff", name: "Date Difference Calculator", description: "Calculate the exact difference between two dates", category: "Date & Time", categorySlug: "date", icon: "CalendarRange", tags: ["date", "difference", "days", "duration"], isFeatured: false },
  { slug: "time-zone", name: "Time Zone Converter", description: "Convert times across major world time zones instantly", category: "Date & Time", categorySlug: "date", icon: "Globe", tags: ["date", "time zone", "world clock", "utc"], isFeatured: false },

  // Statistics
  { slug: "mean-median-mode", name: "Mean, Median & Mode", description: "Calculate mean, median, mode, and range of a dataset", category: "Statistics", categorySlug: "statistics", icon: "BarChart", tags: ["statistics", "mean", "median", "mode"], isFeatured: false },
  { slug: "standard-deviation", name: "Standard Deviation", description: "Calculate standard deviation, variance, and summary statistics", category: "Statistics", categorySlug: "statistics", icon: "Activity", tags: ["statistics", "standard deviation", "variance"], isFeatured: false },
  { slug: "probability", name: "Probability Calculator", description: "Calculate probabilities for common statistical distributions", category: "Statistics", categorySlug: "statistics", icon: "Shuffle", tags: ["statistics", "probability", "chance", "odds"], isFeatured: false },
];
