const DEFAULT_GOOGLE_API_URL =
  'https://places.googleapis.com/v1/places:autocomplete';
const DEFAULT_PLACE_DETAILS_URL = 'https://places.googleapis.com/v1/places/';
const DEFAULT_NEARBY_SEARCH_URL =
  'https://places.googleapis.com/v1/places:searchNearby';
const DEFAULT_GEOCODING_URL =
  'https://maps.googleapis.com/maps/api/geocode/json';

interface FetchPredictionsParams {
  text: string;
  apiKey?: string;
  proxyUrl?: string;
  proxyHeaders?: Record<string, string> | null;
  sessionToken?: string | null;
  languageCode?: string;
  includedRegionCodes?: string[];
  locationBias?: Record<string, any>;
  locationRestriction?: Record<string, any>;
  types?: string[];
  biasPrefixText?: (text: string) => string;
}

interface FetchPlaceDetailsParams {
  placeId: string;
  apiKey?: string;
  detailsProxyUrl?: string | null;
  detailsProxyHeaders?: Record<string, string> | null;
  sessionToken?: string | null;
  languageCode?: string;
  detailsFields?: string[];
}

interface PredictionResult {
  error: Error | null;
  predictions: any[];
}

interface PlaceDetailsResult {
  error: Error | null;
  details: any;
}

export interface FetchNearbyPlacesParams {
  latitude: number;
  longitude: number;
  radius: number; // in meters
  apiKey?: string;
  proxyUrl?: string;
  proxyHeaders?: Record<string, string> | null;
  includedTypes?: string[];
  excludedTypes?: string[];
  maxResultCount?: number;
  rankPreference?: 'POPULARITY' | 'DISTANCE';
  languageCode?: string;
  fieldMask?: string[];
}

export interface NearbyPlacesResult {
  error: Error | null;
  places: any[];
}

export interface ReverseGeocodeParams {
  latitude: number;
  longitude: number;
  apiKey?: string;
  proxyUrl?: string;
  proxyHeaders?: Record<string, string> | null;
  language?: string;
  region?: string;
  resultType?: string[];
  locationType?: string[];
}

export interface GeocodeResult {
  formatted_address: string;
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
    viewport: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  place_id: string;
  types: string[];
}

export interface ReverseGeocodeResult {
  error: Error | null;
  results: GeocodeResult[];
  formattedAddress?: string;
  addressComponents?: GeocodeResult['address_components'];
}

/**
 * Fetches place predictions from Google Places API
 */
export const fetchPredictions = async ({
  text,
  apiKey,
  proxyUrl,
  proxyHeaders,
  sessionToken,
  languageCode,
  includedRegionCodes,
  locationBias,
  locationRestriction,
  types = [],
  biasPrefixText,
}: FetchPredictionsParams): Promise<PredictionResult> => {
  if (!text) {
    return { error: null, predictions: [] };
  }

  const processedText = biasPrefixText ? biasPrefixText(text) : text;

  try {
    const API_URL = proxyUrl || DEFAULT_GOOGLE_API_URL;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (proxyUrl && proxyHeaders) {
      Object.entries(proxyHeaders).forEach(([key, value]) => {
        headers[key] = value;
      });
    }

    if (apiKey) {
      headers['X-Goog-Api-Key'] = apiKey;
    }

    const body = {
      input: processedText,
      languageCode,
      ...(sessionToken && { sessionToken }),
      ...(includedRegionCodes &&
        includedRegionCodes.length > 0 && { includedRegionCodes }),
      ...(locationBias && { locationBias }),
      ...(locationRestriction && { locationRestriction }),
      ...(types.length > 0 && { includedPrimaryTypes: types }),
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Error fetching predictions');
    }

    return { error: null, predictions: data.suggestions || [] };
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return { error: error as Error, predictions: [] };
  }
};

/**
 * Fetches place details from Google Places API
 */
export const fetchPlaceDetails = async ({
  placeId,
  apiKey,
  detailsProxyUrl,
  detailsProxyHeaders,
  sessionToken,
  languageCode,
  detailsFields = [],
}: FetchPlaceDetailsParams): Promise<PlaceDetailsResult> => {
  if (!placeId) {
    return { error: null, details: null };
  }

  try {
    const API_URL = detailsProxyUrl
      ? `${detailsProxyUrl}/${placeId}`
      : `${DEFAULT_PLACE_DETAILS_URL}${placeId}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (detailsProxyUrl && detailsProxyHeaders) {
      Object.entries(detailsProxyHeaders).forEach(([key, value]) => {
        headers[key] = value;
      });
    }

    if (apiKey) {
      headers['X-Goog-Api-Key'] = apiKey;
    }

    // Add the required field mask header
    const fieldsToRequest =
      detailsFields.length > 0
        ? detailsFields
        : ['displayName', 'formattedAddress', 'location', 'id'];

    headers['X-Goog-FieldMask'] = fieldsToRequest.join(',');

    // For the Places API v1, the session token is sent as a header
    if (sessionToken) {
      headers['X-Goog-SessionToken'] = sessionToken;
    }

    // Build query parameters - only include language
    const params = new URLSearchParams();
    if (languageCode) {
      params.append('languageCode', languageCode);
    }

    // Append query parameters if needed
    const url = `${API_URL}${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Error fetching place details');
    }

    return { error: null, details: data };
  } catch (error) {
    console.error('Error fetching place details:', error);
    return { error: error as Error, details: null };
  }
};

/**
 * Fetches nearby places from Google Places API
 * Based on: https://developers.google.com/maps/documentation/places/web-service/nearby-search
 */
export const fetchNearbyPlaces = async ({
  latitude,
  longitude,
  radius,
  apiKey,
  proxyUrl,
  proxyHeaders,
  includedTypes = [],
  excludedTypes = [],
  maxResultCount = 20,
  rankPreference,
  languageCode,
  fieldMask = [
    'places.displayName',
    'places.id',
    'places.location',
    'places.formattedAddress',
    'places.types',
    'places.addressComponents',
  ],
}: FetchNearbyPlacesParams): Promise<NearbyPlacesResult> => {
  if (!latitude || !longitude) {
    return {
      error: new Error('Latitude and longitude are required'),
      places: [],
    };
  }

  if (radius <= 0) {
    return { error: new Error('Radius must be greater than 0'), places: [] };
  }

  try {
    const API_URL = proxyUrl || DEFAULT_NEARBY_SEARCH_URL;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (proxyUrl && proxyHeaders) {
      Object.entries(proxyHeaders).forEach(([key, value]) => {
        headers[key] = value;
      });
    }

    if (apiKey) {
      headers['X-Goog-Api-Key'] = apiKey;
    }

    // FieldMask is required for Nearby Search API
    headers['X-Goog-FieldMask'] = fieldMask.join(',');

    const body: Record<string, any> = {
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius,
        },
      },
      maxResultCount,
    };

    if (includedTypes.length > 0) {
      body.includedTypes = includedTypes;
    }

    if (excludedTypes.length > 0) {
      body.excludedTypes = excludedTypes;
    }

    if (rankPreference) {
      body.rankPreference = rankPreference;
    }

    if (languageCode) {
      body.languageCode = languageCode;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Error fetching nearby places');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { error: null, places: data.places || [] };
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return { error: error as Error, places: [] };
  }
};

/**
 * Reverse geocoding: converts coordinates to a human-readable address
 * Based on: https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding
 */
export const reverseGeocode = async ({
  latitude,
  longitude,
  apiKey,
  proxyUrl,
  proxyHeaders,
  language,
  region,
  resultType,
  locationType,
}: ReverseGeocodeParams): Promise<ReverseGeocodeResult> => {
  if (!latitude || !longitude) {
    return {
      error: new Error('Latitude and longitude are required'),
      results: [],
    };
  }

  try {
    const API_URL = proxyUrl || DEFAULT_GEOCODING_URL;
    const params = new URLSearchParams();

    // Required parameter: latlng
    params.append('latlng', `${latitude},${longitude}`);

    // Optional parameters
    if (apiKey) {
      params.append('key', apiKey);
    }
    if (language) {
      params.append('language', language);
    }
    if (region) {
      params.append('region', region);
    }
    if (resultType && resultType.length > 0) {
      params.append('result_type', resultType.join('|'));
    }
    if (locationType && locationType.length > 0) {
      params.append('location_type', locationType.join('|'));
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (proxyUrl && proxyHeaders) {
      Object.entries(proxyHeaders).forEach(([key, value]) => {
        headers[key] = value;
      });
    }

    const url = `${API_URL}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (data.status === 'REQUEST_DENIED') {
      throw new Error(data.error_message || 'Request denied');
    }

    if (data.status === 'OVER_QUERY_LIMIT') {
      throw new Error('Over query limit');
    }

    if (data.status === 'INVALID_REQUEST') {
      throw new Error(data.error_message || 'Invalid request');
    }

    if (data.status === 'ZERO_RESULTS') {
      return {
        error: null,
        results: [],
      };
    }

    if (data.status !== 'OK') {
      throw new Error(data.error_message || `Unknown error: ${data.status}`);
    }

    const results: GeocodeResult[] = data.results || [];
    const formattedAddress = results[0]?.formatted_address;
    const addressComponents = results[0]?.address_components;

    return {
      error: null,
      results,
      formattedAddress,
      addressComponents,
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return {
      error: error as Error,
      results: [],
    };
  }
};

/**
 * Helper function to generate UUID v4
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
};

/**
 * RTL detection logic
 */
export const isRTLText = (text: string): boolean => {
  if (!text) return false;
  const rtlRegex =
    /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u0870-\u089F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlRegex.test(text);
};
