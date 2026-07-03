import { fetchWeatherForLocation } from '@/lib/openMeteo';
import { useWeatherStore } from '@/stores/weatherStore';
import { useQuery } from '@tanstack/react-query';

const WEATHER_STALE_TIME_MS = 30 * 60 * 1000;

/** Loads current weather for the persisted dashboard location query. */
export function useWeather() {
  const locationQuery = useWeatherStore((store) => store.locationQuery);

  return useQuery({
    queryKey: ['weather', locationQuery],
    queryFn: () => fetchWeatherForLocation(locationQuery),
    staleTime: WEATHER_STALE_TIME_MS,
  });
}
