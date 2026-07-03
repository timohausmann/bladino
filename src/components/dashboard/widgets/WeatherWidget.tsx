import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/Input';
import { getWeatherLabelKey } from '@/utils/weatherCode';
import { useWeatherStore } from '@/stores/weatherStore';
import {
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardWidget } from '../DashboardWidget';
import { useWeather } from './useWeather';

function WeatherIcon({ weatherCode }: { weatherCode: number }) {
  const className = 'text-amber-500 dark:text-amber-400';
  const size = 44;

  if (weatherCode === 0)
    return <Sun size={size} className={className} aria-hidden />;
  if (weatherCode <= 3) {
    return <CloudSun size={size} className={className} aria-hidden />;
  }
  if (weatherCode <= 48) {
    return (
      <CloudFog size={size} className="text-muted-foreground" aria-hidden />
    );
  }
  if (weatherCode <= 67) {
    return <CloudRain size={size} className="text-sky-500" aria-hidden />;
  }
  if (weatherCode <= 77) {
    return <CloudSnow size={size} className="text-sky-300" aria-hidden />;
  }
  if (weatherCode <= 82) {
    return <CloudRain size={size} className="text-sky-500" aria-hidden />;
  }
  if (weatherCode <= 99) {
    return <Zap size={size} className="text-violet-500" aria-hidden />;
  }

  return <Cloud size={size} className="text-muted-foreground" aria-hidden />;
}

function formatLocationLabel(name: string, country?: string) {
  if (!country || country === name) return name;
  return `${name}, ${country}`;
}

interface LocationChipProps {
  label: string;
  onEdit: () => void;
}

/** Tappable location — reads as part of the weather readout, not a separate control. */
function LocationChip({ label, onEdit }: LocationChipProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onEdit}
      className="text-muted-foreground hover:text-foreground mt-2 rounded-full px-2 py-0.5 text-xs underline decoration-transparent transition-colors hover:decoration-current"
      aria-label={t('dashboard:weatherChangeLocation')}
    >
      {label}
    </button>
  );
}

interface LocationFormProps {
  onClose: () => void;
}

function LocationForm({ onClose }: LocationFormProps) {
  const { t } = useTranslation();
  const locationQuery = useWeatherStore((store) => store.locationQuery);
  const setLocationQuery = useWeatherStore((store) => store.setLocationQuery);
  const [draft, setDraft] = useState(locationQuery);

  const handleSave = () => {
    setLocationQuery(draft);
    onClose();
  };

  return (
    <form
      className="mx-auto mt-3 flex w-full max-w-xs flex-col gap-2 text-left"
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      <Input
        value={draft}
        onChange={setDraft}
        label={t('dashboard:weatherLocationLabel')}
        placeholder={t('dashboard:weatherLocationPlaceholder')}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          effect="none"
          onClick={onClose}
        >
          {t('common:cancel')}
        </Button>
        <Button
          type="submit"
          size="sm"
          variant="primary"
          effect="none"
          disabled={!draft.trim()}
        >
          {t('dashboard:weatherSaveLocation')}
        </Button>
      </div>
    </form>
  );
}

interface WeatherBodyProps {
  weatherCode: number;
  temperature: number;
  locationName: string;
  locationCountry?: string;
}

function WeatherBody({
  weatherCode,
  temperature,
  locationName,
  locationCountry,
}: WeatherBodyProps) {
  const { t } = useTranslation();
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const locationLabel = formatLocationLabel(locationName, locationCountry);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <WeatherIcon weatherCode={weatherCode} />
        <p className="text-foreground mt-2 text-3xl font-bold tabular-nums">
          {Math.round(temperature)}°C
        </p>
        <p className="text-muted-foreground text-sm">
          {t(getWeatherLabelKey(weatherCode))}
        </p>

        {isEditingLocation ? (
          <LocationForm onClose={() => setIsEditingLocation(false)} />
        ) : (
          <LocationChip
            label={locationLabel}
            onEdit={() => setIsEditingLocation(true)}
          />
        )}
      </div>

      <a
        href="https://open-meteo.com/"
        target="_blank"
        rel="noreferrer noopener"
        className="text-muted-foreground shrink-0 text-center text-[10px] underline decoration-transparent hover:decoration-current"
      >
        {t('dashboard:weatherAttribution')}
      </a>
    </div>
  );
}

/**
 * Live weather widget backed by Open-Meteo.
 */
export function WeatherWidget() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useWeather();

  return (
    <DashboardWidget title={t('dashboard:weather')}>
      {isLoading && (
        <p className="text-muted-foreground flex h-full items-center justify-center text-sm">
          {t('dashboard:weatherLoading')}
        </p>
      )}

      {isError && (
        <p className="text-muted-foreground flex h-full items-center justify-center text-sm">
          {t('dashboard:weatherLoadFailed')}
        </p>
      )}

      {data && (
        <WeatherBody
          weatherCode={data.weatherCode}
          temperature={data.temperature}
          locationName={data.location.name}
          locationCountry={data.location.country}
        />
      )}
    </DashboardWidget>
  );
}
