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
  maintenanceLoanHome: number;
  maintenanceLoanLondon: number;
  maintenanceGrant: number;
  postGraduateLoan: number;
  placementTuition: number;
  placementMaintenanceLoan: number;
  placementMaintenanceLoanHome: number;
  placementMaintenanceLoanLondon: number;
  placementMaintenanceGrant: number;
}

export type FeesLoansAndGrantsByYear = Record<number, FeesLoansAndGrants>;
