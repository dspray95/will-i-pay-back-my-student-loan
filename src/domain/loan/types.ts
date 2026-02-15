import type { LoanPlan } from "../../shared/types";

export interface InterestRateRange {
  min: number;
  max: number;
}

export interface LoanPlanInfo {
  id: LoanPlan;
  label: string;
}

export interface FeesLoansAndGrants {
  tuition: number;
  maintenanceLoan: number;
  maintenanceGrant: number;
  postGraduateLoan: number;
}

export type FeesLoansAndGrantsByYear = Record<number, FeesLoansAndGrants>;
