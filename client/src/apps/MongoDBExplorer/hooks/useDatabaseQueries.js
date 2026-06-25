import { useQuery } from '@tanstack/react-query';
import { 
  getDatabaseStatus, 
  getCollections, 
  getDatabaseStats, 
  getDatabaseHealth,
  getCollectionDocuments,
  getSingleDocument,
  getCollectionSchema,
  getCollectionStats,
  getCollectionIndexes
} from '../../../services/api/databaseApi';

export const useDatabaseStatus = (options = {}) => {
  return useQuery({
    queryKey: ['database', 'status'],
    queryFn: getDatabaseStatus,
    staleTime: 60000,
    ...options,
  });
};

export const useCollections = (options = {}) => {
  return useQuery({
    queryKey: ['database', 'collections'],
    queryFn: getCollections,
    staleTime: 300000,
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
    refetchInterval: 30000,
    ...options,
  });
};

export const useCollectionDocuments = (collection, params = {}, options = {}) => {
  return useQuery({
    queryKey: ['database', 'collection', collection, params],
    queryFn: () => getCollectionDocuments(collection, params),
    enabled: !!collection,
    keepPreviousData: true,
    ...options,
  });
};

export const useSingleDocument = (collection, id, options = {}) => {
  return useQuery({
    queryKey: ['database', 'document', collection, id],
    queryFn: () => getSingleDocument(collection, id),
    enabled: !!collection && !!id,
    ...options,
  });
};

export const useCollectionSchema = (collection, options = {}) => {
  return useQuery({
    queryKey: ['database', 'schema', collection],
    queryFn: () => getCollectionSchema(collection),
    enabled: !!collection,
    staleTime: 300000,
    ...options,
  });
};

export const useCollectionStatsData = (collection, options = {}) => {
  return useQuery({
    queryKey: ['database', 'collectionStats', collection],
    queryFn: () => getCollectionStats(collection),
    enabled: !!collection,
    ...options,
  });
};

export const useCollectionIndexes = (collection, options = {}) => {
  return useQuery({
    queryKey: ['database', 'collectionIndexes', collection],
    queryFn: () => getCollectionIndexes(collection),
    enabled: !!collection,
    ...options,
  });
};
