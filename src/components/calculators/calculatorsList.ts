import {
  BarChart3,
  Calculator,
  Coins,
  Landmark,
  PiggyBank,
  Receipt,
  Scale,
} from "lucide-react";

export interface CalculatorMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: typeof Calculator;
}

export const calculatorsList: CalculatorMeta[] = [
  {
    slug: "savings",
    title: "Savings Calculator",
    shortTitle: "Savings",
    description: "Project how a lump sum plus monthly deposits grow with compound interest.",
    icon: PiggyBank,
  },
  {
    slug: "pension",
    title: "Pension Calculator",
    shortTitle: "Pension",
    description: "Estimate your Retirement Savings Account (RSA) balance under Nigeria's Contributory Pension Scheme.",
    icon: Landmark,
  },
  {
    slug: "stock-return",
    title: "Stock Return Calculator",
    shortTitle: "Stock Return",
    description: "Work out your total and annualized return on an NGX stock, including dividends.",
    icon: BarChart3,
  },
  {
    slug: "dividend",
    title: "Dividend Calculator",
    shortTitle: "Dividend",
    description: "Calculate gross and net dividend income after withholding tax, plus dividend yield.",
    icon: Coins,
  },
  {
    slug: "investment-comparison",
    title: "Investment Comparison Tool",
    shortTitle: "Compare Investments",
    description: "Compare projected returns across savings, treasury bills, mutual funds, and stocks.",
    icon: Scale,
  },
  {
    slug: "treasury-bill",
    title: "Treasury Bill Calculator",
    shortTitle: "Treasury Bill",
    description: "Compute NTB purchase price, discount earned, and true yield using live CBN auction rates.",
    icon: Receipt,
  },
  {
    slug: "mutual-fund-return",
    title: "Mutual Fund Return Calculator",
    shortTitle: "Mutual Fund",
    description: "Calculate total and annualized return on a mutual fund investment from NAV changes.",
    icon: Calculator,
  },
];

export const getCalculatorMeta = (slug: string) =>
  calculatorsList.find((calculator) => calculator.slug === slug);
