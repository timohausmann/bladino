import {
  ButtonExperimentZone,
  ButtonLabControls,
  ButtonVariantMatrix,
  type ButtonLabState,
} from '@/components/lab/ButtonLabControls';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * DEV-only playground for Button variants, effects, and interactions.
 * Route: /lab/button
 */
export function ButtonLab() {
  const { t } = useTranslation();
  const [state, setState] = useState<ButtonLabState>({
    variant: 'primary',
    appearance: 'filled',
    effect: 'glow',
    loading: false,
    disabled: false,
    label: t('common:buttonLab.defaultLabel'),
    iconId: 'send',
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-medium tracking-wide text-cyan-500 uppercase">
            {t('common:devOnly')}
          </p>
          <h1 className="text-3xl font-bold">{t('common:buttonLab.title')}</h1>
          <p className="text-muted-foreground">
            {t('common:buttonLab.description')}
          </p>
        </header>

        <ButtonLabControls
          state={state}
          onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
        />

        <ButtonVariantMatrix />

        <ButtonExperimentZone />
      </div>
    </div>
  );
}
