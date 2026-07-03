export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface WeatherSnapshot {
  temperature: number;
  weatherCode: number;
  location: WeatherLocation;
}

interface GeocodingResponse {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
  }>;
}

interface ForecastResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

/** Resolves a place name to coordinates via Open-Meteo Geocoding. */
export async function geocodeLocation(query: string): Promise<WeatherLocation> {
  const params = new URLSearchParams({
    name: query,
    count: '1',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
  );

  if (!response.ok) {
    throw new Error('Geocoding request failed');
  }

  const data = (await response.json()) as GeocodingResponse;
  const result = data.results?.[0];

  if (!result) {
    throw new Error('Location not found');
  }

  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
  };
}

/** Fetches current conditions for the given coordinates. */
export async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<Pick<WeatherSnapshot, 'temperature' | 'weatherCode'>> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,weather_code',
    timezone: 'auto',
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
  );

  if (!response.ok) {
    throw new Error('Forecast request failed');
  }

  const data = (await response.json()) as ForecastResponse;

  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
  };
}

/** Geocodes a place name and loads the current forecast. */
export async function fetchWeatherForLocation(
  query: string,
): Promise<WeatherSnapshot> {
  const location = await geocodeLocation(query);
  const current = await fetchCurrentWeather(
    location.latitude,
    location.longitude,
  );

  return { ...current, location };
}
