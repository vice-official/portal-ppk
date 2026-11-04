import { citizenApi } from '../../../shared/api/citizenApi';
import type { Citizen, CitizenStatus } from '../../../entities/citizen/types';
import type {
  DashboardStats,
  AgeGroups,
  StatusDistribution,
  MonthlyDynamicsSlice,
} from '../model/types';

export const STATUS_LABELS: Record<CitizenStatus, string> = {
  active: 'Активные',
  beneficiary: 'Льготники',
  pensioner: 'Пенсионеры',
  underReview: 'На проверке',
  archived: 'В архиве',
} as const;

export const MONTH_NAMES = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
] as const;

export const calculateAge = (birthDateString: string, referenceDate: Date): number => {
  const birth = new Date(birthDateString);
  if (isNaN(birth.getTime())) return 0;

  let age = referenceDate.getFullYear() - birth.getFullYear();
  const m = referenceDate.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && referenceDate.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
};

interface MonthSlot {
  year: number;
  month: number;
  key: string;
  label: string;
  count: number;
}

const buildLast12MonthsSlots = (referenceDate: Date): MonthSlot[] => {
  const slots: MonthSlot[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    slots.push({
      year,
      month,
      key,
      label: MONTH_NAMES[month],
      count: 0,
    });
  }
  return slots;
};

export const aggregateCitizenStats = (
  citizens: Citizen[],
  referenceDate = new Date(),
): DashboardStats => {
  const total = citizens.length;

  if (total === 0) {
    const emptySlots = buildLast12MonthsSlots(referenceDate);
    return {
      kpi: {
        totalCitizens: 0,
        activeCount: 0,
        beneficiariesCount: 0,
        pensionersCount: 0,
        pendingReviewCount: 0,
      },
      monthlyDynamics: emptySlots.map((s) => ({
        month: s.label,
        year: s.year,
        registrations: 0,
      })),
      ageGroups: [
        { groups: '< 18', count: 0 },
        { groups: '18–35', count: 0 },
        { groups: '36–60', count: 0 },
        { groups: '60+', count: 0 },
      ],
      statusDistribution: (Object.keys(STATUS_LABELS) as CitizenStatus[]).map((status) => ({
        status,
        label: STATUS_LABELS[status],
        count: 0,
        percentage: 0,
      })),
      recentCitizens: [],
    };
  }

  const monthSlots = buildLast12MonthsSlots(referenceDate);
  const slotMap = new Map<string, MonthSlot>();
  monthSlots.forEach((slot) => slotMap.set(slot.key, slot));

  const cohorts = { '< 18': 0, '18–35': 0, '36–60': 0, '60+': 0 };
  const statusCounters: Record<CitizenStatus, number> = {
    active: 0,
    beneficiary: 0,
    pensioner: 0,
    underReview: 0,
    archived: 0,
  };

  for (const citizen of citizens) {
    if (citizen.status in statusCounters) {
      statusCounters[citizen.status]++;
    }

    const created = new Date(citizen.createdAt);
    if (!isNaN(created.getTime())) {
      const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
      const slot = slotMap.get(key);
      if (slot) {
        slot.count++;
      }
    }

    const age = calculateAge(citizen.dateOfBirth, referenceDate);
    if (age < 18) cohorts['< 18']++;
    else if (age <= 35) cohorts['18–35']++;
    else if (age <= 60) cohorts['36–60']++;
    else cohorts['60+']++;
  }

  const ageGroups: AgeGroups[] = Object.entries(cohorts).map(([group, count]) => ({
    groups: group,
    count,
  }));

  const statusDistribution: StatusDistribution[] = (
    Object.keys(STATUS_LABELS) as CitizenStatus[]
  ).map((status) => {
    const count = statusCounters[status] || 0;
    return {
      status,
      label: STATUS_LABELS[status],
      count,
      percentage: Number(((count / total) * 100).toFixed(1)),
    };
  });

  const monthlyDynamics: MonthlyDynamicsSlice[] = monthSlots.map((slot) => ({
    month: slot.label,
    year: slot.year,
    registrations: slot.count,
  }));

  const recentCitizens = [...citizens]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((c) => structuredClone(c));

  return {
    kpi: {
      totalCitizens: total,
      activeCount: statusCounters.active,
      beneficiariesCount: statusCounters.beneficiary,
      pensionersCount: statusCounters.pensioner,
      pendingReviewCount: statusCounters.underReview,
    },
    monthlyDynamics,
    ageGroups,
    statusDistribution,
    recentCitizens,
  };
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const citizens = await citizenApi.getAllForAnalytics();
  return aggregateCitizenStats(citizens);
};
