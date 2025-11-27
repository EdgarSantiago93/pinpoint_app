import { useCallback, useState } from 'react';
import {
  fetchNearbyPlaces,
  type FetchNearbyPlacesParams,
  type NearbyPlacesResult,
} from './googlePlacesApi';

export interface UseNearbyPlacesReturn {
  loading: boolean;
  error: Error | null;
  places: any[];
  fetchPlaces: (params: FetchNearbyPlacesParams) => Promise<NearbyPlacesResult>;
}

/**
 * React hook for fetching nearby places with loading state
 * @returns Object containing loading state, error, places, and fetchPlaces function
 */
export const useNearbyPlaces = (): UseNearbyPlacesReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [places, setPlaces] = useState<any[]>([]);

  const fetchPlaces = useCallback(
    async (params: FetchNearbyPlacesParams): Promise<NearbyPlacesResult> => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchNearbyPlaces(params);

        if (result.error) {
          setError(result.error);
          setPlaces([]);
        } else {
          setError(null);
          setPlaces(result.places);
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setPlaces([]);
        return { error, places: [] };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    places,
    fetchPlaces,
  };
};
