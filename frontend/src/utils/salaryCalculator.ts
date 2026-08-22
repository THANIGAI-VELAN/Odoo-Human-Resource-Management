import { SalaryBreakdown } from '../types/hrms';

export function calculateSalaryStructure(grossWage: number): SalaryBreakdown {
  const gross = Math.max(0, isNaN(grossWage) ? 0 : grossWage);

  // Formulas according to design & Indian payroll standard:
  // Basic Pay = 50% of Gross
  const basicPay = Math.round(gross * 0.5);

  // HRA = 50% of Basic (25% of Gross)
  const hra = Math.round(basicPay * 0.5);

  // Standard Allowance = ~8.334% of Gross or fixed ratio (approx 4,167 for 50,000)
  const standardAllowance = Math.round(gross * 0.08334);

  // Performance Bonus = 8.33% of Basic (approx 2,083 for 25,000 basic)
  const performanceBonus = Math.round(basicPay * 0.0833);

  // Leave Travel Allowance (LTA) = 8.33% of Basic (approx 2,083 for 25,000 basic)
  const lta = Math.round(basicPay * 0.0833);

  // Fixed Allowance (Balancing figure so earnings sum up exactly to Gross)
  const subTotal = basicPay + hra + standardAllowance + performanceBonus + lta;
  const fixedAllowance = Math.max(0, gross - subTotal);

  const totalEarnings = basicPay + hra + standardAllowance + performanceBonus + lta + fixedAllowance;

  // Provident Fund (PF) = 12% of Basic
  const providentFund = Math.round(basicPay * 0.12);

  // Professional Tax (PT) = Statutory ₹200 (for gross >= 15,000, otherwise standard)
  const professionalTax = gross > 10000 ? 200 : 0;

  const totalDeductions = providentFund + professionalTax;
  const estimatedNetPay = totalEarnings - totalDeductions;

  return {
    grossMonthly: gross,
    basicPay,
    hra,
    standardAllowance,
    performanceBonus,
    lta,
    fixedAllowance,
    totalEarnings,
    providentFund,
    professionalTax,
    totalDeductions,
    estimatedNetPay,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount).replace('INR', '₹').trim();
}
