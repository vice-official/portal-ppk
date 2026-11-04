import { describe, it, expect } from 'vitest';
import { citizenApi } from './citizenApi';

describe('citizenApi', () => {
  it('выполняет поиск по ФИО, СНИЛС и номеру телефона', async () => {
    const list = await citizenApi.getListOfCitizens({ page: 1, pageSize: 10 });
    const target = list.items[0];

    const bySurname = await citizenApi.getListOfCitizens({
      page: 1,
      pageSize: 10,
      search: target.surname,
    });
    expect(bySurname.items.some((c) => c.id === target.id)).toBe(true);

    const snilsDigits = target.snils.replace(/\D/g, '').slice(0, 6);
    const bySnils = await citizenApi.getListOfCitizens({
      page: 1,
      pageSize: 10,
      search: snilsDigits,
    });
    expect(bySnils.items.some((c) => c.id === target.id)).toBe(true);

    const phoneDigits = target.phoneNumber.replace(/\D/g, '').slice(-4);
    const byPhone = await citizenApi.getListOfCitizens({
      page: 1,
      pageSize: 10,
      search: phoneDigits,
    });
    expect(byPhone.items.some((c) => c.id === target.id)).toBe(true);
  });

  it('корректно валидирует page и pageSize', async () => {
    const resNegative = await citizenApi.getListOfCitizens({ page: -5, pageSize: -20 });
    expect(resNegative.page).toBe(1);
    expect(resNegative.pageSize).toBe(10);

    const resHuge = await citizenApi.getListOfCitizens({ page: 1, pageSize: 500 });
    expect(resHuge.pageSize).toBe(100);
  });

  it('обрабатывает выход за пределы пагинации без ошибок', async () => {
    const resOutOfRange = await citizenApi.getListOfCitizens({ page: 99999, pageSize: 50 });
    expect(resOutOfRange.items).toEqual([]);
    expect(resOutOfRange.filteredCount).toBeGreaterThan(0);
  });

  it('сортирует строковые поля с учетом русской локали', async () => {
    const asc = await citizenApi.getListOfCitizens({
      page: 1,
      pageSize: 10,
      sortBy: 'surname',
      sortOrder: 'ascending',
    });

    for (let i = 0; i < asc.items.length - 1; i++) {
      const cmp = asc.items[i].surname.localeCompare(asc.items[i + 1].surname, 'ru');
      expect(cmp).toBeLessThanOrEqual(0);
    }
  });

  it('сортирует даты рождения хронологически, а не по строковому коду', async () => {
    const asc = await citizenApi.getListOfCitizens({
      page: 1,
      pageSize: 10,
      sortBy: 'dateOfBirth',
      sortOrder: 'ascending',
    });

    for (let i = 0; i < asc.items.length - 1; i++) {
      const tA = new Date(asc.items[i].dateOfBirth).getTime();
      const tB = new Date(asc.items[i + 1].dateOfBirth).getTime();
      expect(tA).toBeLessThanOrEqual(tB);
    }
  });

  it('гарантирует глубокое копирование и изоляцию хранилища', async () => {
    const original = (await citizenApi.getListOfCitizens({ page: 1, pageSize: 1 })).items[0];

    original.name = 'МутированноеИмя';
    if (original.family.length > 0) {
      original.family[0].fullName = 'МутированныйРодственник';
    }

    const fresh = await citizenApi.getCitizenById(original.id);
    expect(fresh?.name).not.toBe('МутированноеИмя');
    if (fresh && fresh.family.length > 0) {
      expect(fresh.family[0].fullName).not.toBe('МутированныйРодственник');
    }
  });

  it('предсказуемо обновляет запись и сохраняет неизменяемый ID', async () => {
    const target = (await citizenApi.getListOfCitizens({ page: 1, pageSize: 1 })).items[0];

    const updated = await citizenApi.updateCitizen(target.id, {
      name: 'НовоеИмя',
      status: 'archived',
      id: 'hacked-id',
    });

    expect(updated.id).toBe(target.id);
    expect(updated.name).toBe('НовоеИмя');
    expect(updated.status).toBe('archived');

    const inDb = await citizenApi.getCitizenById(target.id);
    expect(inDb?.name).toBe('НовоеИмя');
    expect(inDb?.status).toBe('archived');
  });
});
