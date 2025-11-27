import GooglePlacesTextInput from './GooglePlacesTextInput';

export default GooglePlacesTextInput;

// Export types
export type {
  GooglePlacesAccessibilityLabels,
  GooglePlacesTextInputProps,
  GooglePlacesTextInputRef,
  GooglePlacesTextInputStyles,
  Place,
  PlaceDetailsFields,
  PlacePrediction,
  PlaceStructuredFormat,
  SuggestionTextProps,
} from './GooglePlacesTextInput';

// Export API functions and hooks
export {
  fetchNearbyPlaces,
  fetchPlaceDetails,
  fetchPredictions,
  reverseGeocode,
} from './services/googlePlacesApi';

export { useNearbyPlaces } from './services/useNearbyPlaces';

export type {
  FetchNearbyPlacesParams,
  GeocodeResult,
  NearbyPlacesResult,
  ReverseGeocodeParams,
  ReverseGeocodeResult,
} from './services/googlePlacesApi';

export type { UseNearbyPlacesReturn } from './services/useNearbyPlaces';
