/** Maps Open-Meteo WMO weather codes to dashboard i18n label keys. */
export function getWeatherLabelKey(weatherCode: number): string {
  if (weatherCode === 0) return 'dashboard:weatherClear';
  if (weatherCode <= 3) return 'dashboard:weatherPartlyCloudy';
  if (weatherCode <= 48) return 'dashboard:weatherFog';
  if (weatherCode <= 67) return 'dashboard:weatherRain';
  if (weatherCode <= 77) return 'dashboard:weatherSnow';
  if (weatherCode <= 82) return 'dashboard:weatherShowers';
  if (weatherCode <= 99) return 'dashboard:weatherThunderstorm';

  return 'dashboard:weatherUnknown';
}
