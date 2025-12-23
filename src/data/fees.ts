import { getLatestDataForYear } from "../utils/getLatestDataForYear";

export type FeesLoansAndGrants = {
  tuition: number;
  maintenanceLoan: number;
  maintenanceGrant: number;
  postGraduateLoan: number;
};

export type FeesLoansAndGrantsByYear = Record<number, FeesLoansAndGrants>;

export const FEES_LOANS_AND_GRANTS_BY_YEAR: FeesLoansAndGrantsByYear = {
  1998: {
    tuition: 1000,
    maintenanceLoan: 0,
    maintenanceGrant: 0,
    postGraduateLoan: 0,
  },
  2006: {
    tuition: 3000,
    maintenanceLoan: 5000,
    maintenanceGrant: 0,
    postGraduateLoan: 0,
  },
  2009: {
    tuition: 3000,
    maintenanceLoan: 3564,
    maintenanceGrant: 2906,
    postGraduateLoan: 0,
  },
  2012: {
    tuition: 9000,
    maintenanceLoan: 5500,
    maintenanceGrant: 3250,
    postGraduateLoan: 0,
  },
  2013: {
    tuition: 9000,
    maintenanceLoan: 5555,
    maintenanceGrant: 3250,
    postGraduateLoan: 0,
  },
  2014: {
    tuition: 9000,
    maintenanceLoan: 5740,
    maintenanceGrant: 3250,
    postGraduateLoan: 0,
  },
  2015: {
    tuition: 9000,
    maintenanceLoan: 5740,
    maintenanceGrant: 3387,
    postGraduateLoan: 0,
  },
  2016: {
    tuition: 9000,
    maintenanceLoan: 8200,
    maintenanceGrant: 0,
    postGraduateLoan: 10000, // Postgraduate loan introduced in 2016
  },
  2017: {
    tuition: 9250,
    maintenanceLoan: 8430,
    maintenanceGrant: 0,
    postGraduateLoan: 10000,
  },
  2023: {
    tuition: 9535,
    maintenanceLoan: 10227,
    maintenanceGrant: 0,
    postGraduateLoan: 12167,
  },
  2024: {
    tuition: 9535,
    maintenanceLoan: 10227,
    maintenanceGrant: 0,
    postGraduateLoan: 12471,
  },
  2025: {
    tuition: 9535,
    maintenanceLoan: 10544,
    maintenanceGrant: 0,
    postGraduateLoan: 12858,
  },
};

export const getFeesForYear = (year: number): FeesLoansAndGrants => {
  return getLatestDataForYear(year, FEES_LOANS_AND_GRANTS_BY_YEAR);
};
