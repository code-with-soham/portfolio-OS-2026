import { useQuery } from '@tanstack/react-query';
import { 
  getDatabaseStatus, 
  getCollections, 
  getDatabaseStats, 
  getDatabaseHealth 
} from '../../../services/api/databaseApi';

export const useDatabaseStatus = (options = {}) => {
  return useQuery({
    queryKey: ['database', 'status'],
    queryFn: getDatabaseStatus,
    staleTime: 60000, // 1 minute
    ...options,
  });
};

export const useCollections = (options = {}) => {
  return useQuery({
    queryKey: ['database', 'collections'],
    queryFn: getCollections,
    staleTime: 300000, // 5 minutes (collections don't change often)
    ...options,
  });
};

export const useDatabaseStats = (options = {}) => {
  return useQuery({
    queryKey: ['database', 'stats'],
    queryFn: getDatabaseStats,
    ...options,
  });
};

export const useDatabaseHealth = (options = {}) => {
  return useQuery({
    queryKey: ['database', 'health'],
    queryFn: getDatabaseHealth,
    refetchInterval: 30000, // Check health every 30 seconds
    ...options,
  });
};
