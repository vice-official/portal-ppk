import { describe, it, expect } from 'vitest';
import { aggregateCitizenStats, calculateAge } from './getDashboardStats';
import type { Citizen } from '../../../entities/citizen/types';

const createMockCitizen = (overrides: Partial<Citizen> = {}): Citizen => ({
  id: 'test-id',
  name: 'Иван',
  surname: 'Иванов',
  patronymic: 'Иванович',
  dateOfBirth: '1990-05-15',
  region: 'Москва',
  status: 'active',
  sex: 'male',
  snils: '123-456-789 00',
  inn: '123456789012',
  email: 'ivan@example.com',
  phoneNumber: '+7 (999) 123-45-67',
  passportSeries: '1234',
  passportNumber: '567890',
  whoIssuedPassport: 'МВД',
  dateOfIssued: '2010-06-01',
  registrationAddress: 'г. Москва, ул. Ленина, д. 1',
  residentialAddress: 'г. Москва, ул. Ленина, д. 1',
  family: [],
  education: [],
  createdAt: '2026-05-10T10:00:00.000Z',
  ...overrides,
});

describe('calculateAge', () => {
  it('корректно считает возраст при наступившем дне рождения', () => {
    const ref = new Date('2026-11-04');
    expect(calculateAge('2000-05-15', ref)).toBe(26);
  });

  it('уменьшает возраст на 1, если день рождения ещё не наступил в этом году', () => {
    const ref = new Date('2026-11-04');
    expect(calculateAge('2008-11-05', ref)).toBe(17);
  });
});

describe('aggregateCitizenStats (без искусственного масштабирования)', () => {
  it('корректно рассчитывает все 5 ключевых показателей на реальном датасете', () => {
    const ref = new Date('2026-11-04');
    const citizens: Citizen[] = [
      createMockCitizen({ status: 'active' }),
      createMockCitizen({ status: 'active' }),
      createMockCitizen({ status: 'beneficiary' }),
      createMockCitizen({ status: 'pensioner' }),
      createMockCitizen({ status: 'pensioner' }),
      createMockCitizen({ status: 'underReview' }),
      createMockCitizen({ status: 'archived' }),
    ];

    const stats = aggregateCitizenStats(citizens, ref);

    expect(stats.kpi.totalCitizens).toBe(7);
    expect(stats.kpi.activeCount).toBe(2);
    expect(stats.kpi.beneficiariesCount).toBe(1);
    expect(stats.kpi.pensionersCount).toBe(2);
    expect(stats.kpi.pendingReviewCount).toBe(1);
  });

  it('корректно обрабатывает пустую базу данных без деления на 0', () => {
    const ref = new Date('2026-11-04');
    const stats = aggregateCitizenStats([], ref);

    expect(stats.kpi.totalCitizens).toBe(0);
    expect(stats.kpi.activeCount).toBe(0);
    expect(stats.kpi.beneficiariesCount).toBe(0);
    expect(stats.kpi.pensionersCount).toBe(0);
    expect(stats.kpi.pendingReviewCount).toBe(0);
    expect(stats.recentCitizens).toEqual([]);
    expect(stats.monthlyDynamics).toHaveLength(12);
    expect(stats.statusDistribution.every((s) => s.percentage === 0 && s.count === 0)).toBe(true);
  });

  it('формирует непрерывную динамику за 12 месяцев даже с неполными и пустыми периодами', () => {
    const ref = new Date('2026-03-15T12:00:00.000Z');
    const citizens: Citizen[] = [
      createMockCitizen({ createdAt: '2026-03-01T10:00:00.000Z' }),
      createMockCitizen({ createdAt: '2026-03-05T10:00:00.000Z' }),
      createMockCitizen({ createdAt: '2025-12-10T10:00:00.000Z' }),
    ];

    const stats = aggregateCitizenStats(citizens, ref);

    expect(stats.monthlyDynamics).toHaveLength(12);
    const marSlot = stats.monthlyDynamics[11];
    expect(marSlot.month).toBe('Мар');
    expect(marSlot.registrations).toBe(2);

    const emptySlot = stats.monthlyDynamics[10];
    expect(emptySlot.registrations).toBe(0);
  });

  it('сортирует последние добавленные записи строго по убыванию даты создания', () => {
    const citizens: Citizen[] = [
      createMockCitizen({ id: '1', createdAt: '2026-01-01T00:00:00.000Z' }),
      createMockCitizen({ id: '2', createdAt: '2026-03-01T00:00:00.000Z' }),
      createMockCitizen({ id: '3', createdAt: '2026-02-01T00:00:00.000Z' }),
      createMockCitizen({ id: '4', createdAt: '2026-05-01T00:00:00.000Z' }),
      createMockCitizen({ id: '5', createdAt: '2026-04-01T00:00:00.000Z' }),
      createMockCitizen({ id: '6', createdAt: '2025-12-01T00:00:00.000Z' }),
    ];

    const stats = aggregateCitizenStats(citizens);

    expect(stats.recentCitizens).toHaveLength(5);
    expect(stats.recentCitizens.map((c) => c.id)).toEqual(['4', '5', '2', '3', '1']);
  });
});
