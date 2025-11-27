import { mapStyle } from '@/constants/theme';
import dayjs from 'dayjs';

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: 'km' | 'mi' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3958.8; // Earth radius

  const toRad = (value: number) => (value * Math.PI) / 180;

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dPhi = toRad(lat2 - lat1);
  const dLambda = toRad(lon2 - lon1);

  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

type Styler = Record<string, string | number | boolean>;

interface MapStyleEntry {
  featureType?: string;
  elementType?: string;
  stylers: Styler[];
}

function toStaticStyleParam(entry: MapStyleEntry): string {
  const parts: string[] = [];

  if (entry.featureType) {
    parts.push(`feature:${entry.featureType}`);
  }
  if (entry.elementType) {
    parts.push(`element:${entry.elementType}`);
  }

  for (const styler of entry.stylers) {
    for (const [key, rawValue] of Object.entries(styler)) {
      let value = rawValue as string | number | boolean;

      if (
        key === 'color' &&
        typeof value === 'string' &&
        value.startsWith('#')
      ) {
        // #ebe3cd -> 0xebe3cd
        value = value.replace('#', '0x');
      }

      parts.push(`${key}:${value}`);
    }
  }

  // style=element:geometry|color:0xebe3cd (URL-encoded when you add to URL)
  return `style=${encodeURIComponent(parts.join('|'))}`;
}

export function buildStaticMapUrl(lat: number, lng: number) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';

  const params: string[] = [];

  // center & zoom
  params.push(`center=${lat},${lng}`);
  params.push('zoom=16');
  params.push('size=500x250');
  params.push('maptype=roadmap');

  // marker at the center
  // const marker = `color:red|label:P|${lat},${lng}`;
  // params.push(`markers=${encodeURIComponent(marker)}`);

  // styles
  const styleParams = mapStyle.map(toStaticStyleParam);
  params.push(...styleParams);

  // api key
  params.push(`key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`);

  return `${baseUrl}?${params.join('&')}`;
}

export const formatDate = (date: Date | null): string => {
  if (!date) return '-';

  const dateDayjs = dayjs(date);
  const today = dayjs();
  const yesterday = dayjs().subtract(1, 'day');

  // Check if today
  if (dateDayjs.isSame(today, 'day')) {
    return 'Hoy';
  }

  // Check if yesterday
  if (dateDayjs.isSame(yesterday, 'day')) {
    return 'Ayer';
  }

  // Check if within last 5 days
  const daysDiff = today.diff(dateDayjs, 'day');
  if (daysDiff > 0 && daysDiff <= 5) {
    return `hace ${daysDiff} ${daysDiff === 1 ? 'día' : 'días'}`;
  }

  // Format as "agosto 18 2004"
  return dateDayjs.format('MMMM D, YYYY');
};
