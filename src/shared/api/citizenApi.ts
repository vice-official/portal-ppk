import {generateMockCitizens} from "../../mocks/citizensGenerator.ts";
import type { Citizen, GetCitizenParams, PaginatedResponse } from "../../entities/citizen/types.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let citizenDb: Citizen[] = generateMockCitizens(500);

export const citizenApi = {

   async getListOfCitizens(params: GetCitizenParams): Promise<PaginatedResponse<Citizen>> {
      await sleep(250);
      let result = [...citizenDb];

      if (params.search) {
         result = result.filter((searchString) =>
             (`${searchString.surname} ${searchString.name} ${searchString.patronymic}`)
                 .toLowerCase()
                 .includes(params.search.toLowerCase())
         );
      }

      if (params.status && params.status !== 'all') {
         result = result.filter((value) =>
             (value.status == params.status))
      }

      if (params.gender && params.gender !== 'all') {
         result = result.filter((value) =>
             (value.sex == params.gender));
      }

      if (params.sortBy) {
         const sortBy = params.sortBy;
         const orderFactor = params.sortOrder === 'ascending' ? 1 : -1;
         result = result.sort((a, b) => {
            const valueA = a[sortBy];
            const valueB = b[sortBy];
            return valueA.localeCompare(valueB, 'ru') * orderFactor;
         });
      }

      const filteredCount = result.length;
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const startIndex = (page - 1) * pageSize;

      const items = result.slice(startIndex, startIndex + pageSize);

      return {
         items,
         totalCount: 100_000,
         filteredCount,
         page,
         pageSize,
      };
   },

   async getCitizenById(id: string): Promise<Citizen | null> {
      await sleep(250);
      const citizen = citizenDb.find((citizen) => citizen.id === id);
      return citizen ? { ...citizen } : null;
   },

   async getAllForAnalytics(): Promise<Citizen[]> {
      await sleep(500);
      return [...citizenDb];
   },

   async updateCitizen(id: string, partialData: Partial<Citizen>): Promise<Citizen> {
      await sleep(200);
      const index = citizenDb.findIndex((c) => c.id === id);

      if (index === -1) {
         throw new Error(`Гражданин с ID ${id} не найден`);
      }
      citizenDb[index] = {
         ...citizenDb[index],
         ...partialData,
      };

      return { ...citizenDb[index] };
   }
}

