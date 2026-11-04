import type { Citizen, CitizenStatus } from '../../../entities/citizen/types';

export type { CitizenStatus };

export interface KpiSummary {
  totalCitizens: number;
  activeCount: number;
  beneficiariesCount: number;
  pensionersCount: number;
  pendingReviewCount: number;
}

export interface AgeGroups {
  groups: string;
  count: number;
}

export interface StatusDistribution {
  status: CitizenStatus;
  label: string;
  count: number;
  percentage: number;
}

export interface MonthlyDynamicsSlice {
  month: string;
  year: number;
  registrations: number;
}

export interface DashboardStats {
  kpi: KpiSummary;
  monthlyDynamics: MonthlyDynamicsSlice[];
  ageGroups: AgeGroups[];
  statusDistribution: StatusDistribution[];
  recentCitizens: Citizen[];
}
