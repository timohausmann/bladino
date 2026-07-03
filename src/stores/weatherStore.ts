import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WeatherState {
  locationQuery: string;
  setLocationQuery: (query: string) => void;
}

export const DEFAULT_WEATHER_LOCATION = 'Germany';

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      locationQuery: DEFAULT_WEATHER_LOCATION,
      setLocationQuery: (query) =>
        set({ locationQuery: query.trim() || DEFAULT_WEATHER_LOCATION }),
    }),
    { name: 'bladino.weather' },
  ),
);
