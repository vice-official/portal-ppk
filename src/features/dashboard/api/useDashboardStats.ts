import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from './getDashboardStats';
import type { DashboardStats } from '../model/types';

export const useDashboardStats = () => {
    return useQuery<DashboardStats, Error>({
        queryKey: ['dashboard', 'stats'],
        queryFn: getDashboardStats,
    });
};