import { citizenApi } from "../../../shared/api/citizenApi";
import type { Citizen, CitizenStatus } from "../../../entities/citizen/types";
import type {
    DashboardStats,
    AgeGroups,
    StatusDistribution,
    MonthlyDynamicsSlice,
} from "../model/types";

const TARGET_DB_CAPACITY = 100_000;
const MS_IN_DAY = 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * MS_IN_DAY;

const STATUS_LABELS: Record<CitizenStatus, string> = {
    active: 'Активные',
    beneficiary: 'Льготники',
    pensioner: 'Пенсионеры',
    underReview: 'На проверке',
    archived: 'В архиве',
} as const;

const MONTH_NAMES = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
] as const;

const calculateAge = (birthDateString: string, referenceDate: Date): number => {
    const birth = new Date(birthDateString);
    let age = referenceDate.getFullYear() - birth.getFullYear();
    const m = referenceDate.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && referenceDate.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

export const aggregateCitizenStats = (
    citizens: Citizen[],
    targetCapacity = TARGET_DB_CAPACITY
): DashboardStats => {
    const sampleSize = citizens.length;
    if (!sampleSize) {
        throw new Error('Dataset is empty: unable to calculate analytics');
    }

    const scale = targetCapacity / sampleSize;
    const now = new Date();
    const thresholdTimestamp = now.getTime() - THIRTY_DAYS_MS;

    let beneficiaries = 0;
    let pendingReview = 0;
    let newThisMonth = 0;

    const cohorts = { '< 18': 0, '18–35': 0, '36–60': 0, '60+': 0 };
    const statusCounters = Object.keys(STATUS_LABELS).reduce<Record<CitizenStatus, number>>(
        (acc, key) => ({ ...acc, [key]: 0 }),
        {} as Record<CitizenStatus, number>
    );
    const monthlyCounters = new Array<number>(12).fill(0);

    for (const citizen of citizens) {
        statusCounters[citizen.status] = (statusCounters[citizen.status] ?? 0) + 1;
        if (citizen.status === 'beneficiary') beneficiaries++;
        if (citizen.status === 'underReview') pendingReview++;

        const createdTimestamp = new Date(citizen.createdAt).getTime();
        if (createdTimestamp >= thresholdTimestamp) {
            newThisMonth++;
        }
        const monthIndex = new Date(citizen.createdAt).getMonth();
        monthlyCounters[monthIndex]++;

        const age = calculateAge(citizen.dateOfBirth, now);
        if (age < 18) cohorts['< 18']++;
        else if (age <= 35) cohorts['18–35']++;
        else if (age <= 60) cohorts['36–60']++;
        else cohorts['60+']++;
    }

    const ageGroups: AgeGroups[] = Object.entries(cohorts).map(([group, count]) => ({
        groups: group,
        count: Math.round(count * scale),
    }));

    const statusDistribution: StatusDistribution[] = (Object.keys(STATUS_LABELS) as CitizenStatus[]).map((status) => {
        const rawCount = statusCounters[status] || 0;
        return {
            status,
            label: STATUS_LABELS[status],
            count: Math.round(rawCount * scale),
            percentage: Number(((rawCount / sampleSize) * 100).toFixed(1)),
        };
    });

    const monthlyDynamics: MonthlyDynamicsSlice[] = monthlyCounters.map((count, index) => ({
        month: MONTH_NAMES[index],
        registrations: Math.round(count * scale),
    }));

    return {
        kpi: {
            totalCitizens: targetCapacity,
            totalDeltaPercentage: 12.4,
            beneficiariesCount: Math.round(beneficiaries * scale),
            newThisMonth: Math.round(newThisMonth * scale),
            pendingReviewCount: Math.round(pendingReview * scale),
        },
        monthlyDynamics,
        ageGroups,
        statusDistribution,
        recentCitizens: citizens.slice(0, 5),
    };
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const citizens = await citizenApi.getAllForAnalytics();
    return aggregateCitizenStats(citizens);
};