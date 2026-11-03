import type { Citizen, CitizenStatus } from '../../../entities/citizen/types';

export type { CitizenStatus };

export interface KpiSummary {
    totalCitizens: number;
    totalDeltaPercentage?: number;
    beneficiariesCount: number;
    newThisMonth: number;
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
    registrations: number;
}

export interface DashboardStats {
    kpi: KpiSummary;
    ageGroups: AgeGroups[];
    statusDistribution: StatusDistribution[];
    monthlyDynamics: MonthlyDynamicsSlice[];
    recentCitizens: Citizen[];
}