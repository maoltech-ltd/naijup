export const NAIRA_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

export function formatNaira(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "₦0.00";
  return NAIRA_FORMATTER.format(value);
}

export function formatPercent(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "0.00%";
  return `${value.toFixed(digits)}%`;
}

interface FutureValueOfSavingsInput {
  principal: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
}

interface FutureValueOfSavingsResult {
  futureValue: number;
  totalContributed: number;
  totalInterest: number;
}

/**
 * Ordinary annuity future value: FV = P(1+i)^n + C * [((1+i)^n - 1) / i]
 * i = monthly rate, n = number of months. Contributions are assumed at month-end.
 */
export function futureValueOfSavings({
  principal,
  monthlyContribution,
  annualRatePercent,
  years,
}: FutureValueOfSavingsInput): FutureValueOfSavingsResult {
  const months = Math.max(0, Math.round(years * 12));
  const i = annualRatePercent / 100 / 12;

  let futureValue: number;
  if (i === 0) {
    futureValue = principal + monthlyContribution * months;
  } else {
    const growth = Math.pow(1 + i, months);
    futureValue = principal * growth + monthlyContribution * ((growth - 1) / i);
  }

  const totalContributed = principal + monthlyContribution * months;
  const totalInterest = futureValue - totalContributed;

  return { futureValue, totalContributed, totalInterest };
}

/**
 * Compound annual growth rate between two point-in-time values over a holding period.
 */
export function cagr(beginningValue: number, endingValue: number, days: number): number | null {
  if (beginningValue <= 0 || days <= 0) return null;
  return (Math.pow(endingValue / beginningValue, 365 / days) - 1) * 100;
}

interface TreasuryBillPricingInput {
  faceValue: number;
  discountRatePercent: number;
  days: number;
}

interface TreasuryBillPricingResult {
  purchasePrice: number;
  discountAmount: number;
  trueYield: number | null;
}

/**
 * Discount-basis pricing used by Nigerian Treasury Bills:
 * price = face * (1 - rate% * days/365); trueYield reflects the actual return on the discounted price.
 */
export function treasuryBillPricing({
  faceValue,
  discountRatePercent,
  days,
}: TreasuryBillPricingInput): TreasuryBillPricingResult {
  const purchasePrice = faceValue * (1 - (discountRatePercent / 100) * (days / 365));
  const discountAmount = faceValue - purchasePrice;
  const trueYield = purchasePrice > 0 ? (discountAmount / purchasePrice) * (365 / days) * 100 : null;

  return { purchasePrice, discountAmount, trueYield };
}

export function daysBetween(from: string, to: string): number {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) return 0;
  return Math.max(0, Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)));
}

export function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
