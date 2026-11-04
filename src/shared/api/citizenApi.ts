import { generateMockCitizens } from '../../mocks/citizensGenerator';
import type { Citizen, GetCitizenParams, PaginatedResponse } from '../../entities/citizen/types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const citizenDb: Citizen[] = generateMockCitizens(500);

export const citizenApi = {
  async getListOfCitizens(params: GetCitizenParams): Promise<PaginatedResponse<Citizen>> {
    await sleep(150);
    let result = [...citizenDb];

    if (params.search && params.search.trim()) {
      const query = params.search.trim().toLowerCase();
      const digitsQuery = query.replace(/\D/g, '');

      result = result.filter((citizen) => {
        const fio = `${citizen.surname} ${citizen.name} ${citizen.patronymic}`.toLowerCase();
        const matchesFio = fio.includes(query);

        const snilsRaw = citizen.snils.toLowerCase();
        const snilsDigits = citizen.snils.replace(/\D/g, '');
        const matchesSnils =
          snilsRaw.includes(query) || (digitsQuery.length > 0 && snilsDigits.includes(digitsQuery));

        const phoneRaw = citizen.phoneNumber.toLowerCase();
        const phoneDigits = citizen.phoneNumber.replace(/\D/g, '');
        const matchesPhone =
          phoneRaw.includes(query) || (digitsQuery.length > 0 && phoneDigits.includes(digitsQuery));

        return matchesFio || matchesSnils || matchesPhone;
      });
    }

    if (params.status && params.status !== 'all') {
      result = result.filter((c) => c.status === params.status);
    }

    if (params.gender && params.gender !== 'all') {
      result = result.filter((c) => c.sex === params.gender);
    }

    if (params.sortBy) {
      const sortBy = params.sortBy;
      const orderFactor = params.sortOrder === 'descending' ? -1 : 1;

      result.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (sortBy === 'dateOfBirth' || sortBy === 'createdAt') {
          const timeA = new Date(valA).getTime();
          const timeB = new Date(valB).getTime();
          if (!isNaN(timeA) && !isNaN(timeB)) {
            return (timeA - timeB) * orderFactor;
          }
        }

        return (
          String(valA).localeCompare(String(valB), 'ru', {
            numeric: true,
            sensitivity: 'base',
          }) * orderFactor
        );
      });
    }

    let page = Number(params.page);
    if (!Number.isInteger(page) || page < 1) page = 1;

    let pageSize = Number(params.pageSize);
    if (!Number.isInteger(pageSize) || pageSize < 1) pageSize = 10;
    else if (pageSize > 100) pageSize = 100;

    const filteredCount = result.length;
    const startIndex = (page - 1) * pageSize;
    const rawItems =
      startIndex >= filteredCount ? [] : result.slice(startIndex, startIndex + pageSize);

    return {
      items: rawItems.map((item) => structuredClone(item)),
      totalCount: citizenDb.length,
      filteredCount,
      page,
      pageSize,
    };
  },

  async getCitizenById(id: string): Promise<Citizen | null> {
    await sleep(150);
    const citizen = citizenDb.find((c) => c.id === id);
    return citizen ? structuredClone(citizen) : null;
  },

  async getAllForAnalytics(): Promise<Citizen[]> {
    await sleep(200);
    return citizenDb.map((c) => structuredClone(c));
  },

  async updateCitizen(id: string, partialData: Partial<Citizen>): Promise<Citizen> {
    await sleep(150);
    const index = citizenDb.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error(`Гражданин с ID ${id} не найден`);
    }

    const current = citizenDb[index];
    const updated: Citizen = {
      ...structuredClone(current),
      ...structuredClone(partialData),
      id: current.id,
      family: partialData.family
        ? structuredClone(partialData.family)
        : structuredClone(current.family),
      education: partialData.education
        ? structuredClone(partialData.education)
        : structuredClone(current.education),
    };

    citizenDb[index] = updated;
    return structuredClone(updated);
  },
};
