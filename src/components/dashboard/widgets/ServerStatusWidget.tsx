import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { DashboardWidget } from '../DashboardWidget';
import { useServerStatus } from './useServerStatus';

type LedColor = 'cyan' | 'rose';

interface StatusLedProps {
  color: LedColor;
}

const LED_COLOR_CLASS: Record<LedColor, string> = {
  cyan: 'bg-cyan-400',
  rose: 'bg-rose-500',
};

const LABEL_CLASS =
  'text-muted-foreground text-[10px] font-semibold tracking-wide uppercase';

const BODY_CLASS =
  'flex h-full flex-wrap items-center justify-center gap-x-4 gap-y-1.5';

/** Small flat round indicator — no glow. */
function StatusLed({ color }: StatusLedProps) {
  return (
    <span
      className={clsx(
        'border-foreground/20 h-1.5 w-1.5 shrink-0 rounded-full border',
        LED_COLOR_CLASS[color],
      )}
      aria-hidden
    />
  );
}

interface StatusRowProps {
  label: string;
  color: LedColor;
}

function StatusRow({ label, color }: StatusRowProps) {
  return (
    <span
      className="inline-flex items-center gap-2"
      role="status"
      aria-label={label}
    >
      <StatusLed color={color} />
      <span className={LABEL_CLASS}>{label}</span>
    </span>
  );
}

function StatusMessage({ label }: { label: string }) {
  return (
    <span className={LABEL_CLASS} role="status">
      {label}
    </span>
  );
}

interface ServiceStatusProps {
  server: boolean;
  database: boolean;
}

function ServiceStatus({ server, database }: ServiceStatusProps) {
  const { t } = useTranslation();

  return (
    <>
      <StatusRow
        label={t('dashboard:serverStatusServer')}
        color={server ? 'cyan' : 'rose'}
      />
      <StatusRow
        label={t('dashboard:serverStatusDatabase')}
        color={database ? 'cyan' : 'rose'}
      />
    </>
  );
}

/**
 * Polls /isalive and shows per-service LEDs when reachable,
 * or a single gray status message for browser offline / network errors.
 */
export function ServerStatusWidget() {
  const { t } = useTranslation();
  const { isBrowserOnline, data, isLoading, isError } = useServerStatus();

  let content;

  if (!isBrowserOnline) {
    content = (
      <StatusMessage label={t('dashboard:serverStatusYouAreOffline')} />
    );
  } else if (isLoading) {
    content = <StatusMessage label={t('dashboard:serverStatusChecking')} />;
  } else if (isError || !data) {
    content = <StatusMessage label={t('dashboard:serverStatusNetworkError')} />;
  } else {
    content = <ServiceStatus server={data.server} database={data.database} />;
  }

  return (
    <DashboardWidget title={t('dashboard:serverStatus')}>
      <div className={BODY_CLASS}>{content}</div>
    </DashboardWidget>
  );
}
