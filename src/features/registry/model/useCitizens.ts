import { useQuery } from '@tanstack/react-query';
import { citizenApi } from '../../../shared/api/citizenApi';
import type { GetCitizenParams, PaginatedResponse, Citizen } from '../../../entities/citizen/types';

export const useCitizens = (params: GetCitizenParams) => {
    return useQuery<PaginatedResponse<Citizen>, Error>({
        queryKey: ['citizens', params],
        queryFn: () => citizenApi.getListOfCitizens(params),
        placeholderData: (prev) => prev,
    });
};