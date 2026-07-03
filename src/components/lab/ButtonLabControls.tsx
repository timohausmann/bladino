import {
  Button,
  type ButtonAppearance,
  type ButtonEffect,
  type ButtonVariant,
} from '@/components/ui/button';
import { Send, Trash2, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'dangerous'];
const APPEARANCES: ButtonAppearance[] = ['filled', 'outline'];
const EFFECTS: ButtonEffect[] = ['none', 'glow'];

const ICON_OPTION_IDS = ['none', 'send', 'trash', 'user'] as const;

export interface ButtonLabState {
  variant: ButtonVariant;
  appearance: ButtonAppearance;
  effect: ButtonEffect;
  loading: boolean;
  disabled: boolean;
  label: string;
  iconId: (typeof ICON_OPTION_IDS)[number];
}

interface ButtonLabControlsProps {
  state: ButtonLabState;
  onChange: (patch: Partial<ButtonLabState>) => void;
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-lg border border-black/10 bg-black/5 px-3 py-2 dark:border-white/10 dark:bg-white/5"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-cyan-500"
      />
      {label}
    </label>
  );
}

function useIconOptions() {
  const { t } = useTranslation();

  return [
    {
      id: 'none' as const,
      label: t('common:buttonLab.icons.none'),
      icon: null,
    },
    {
      id: 'send' as const,
      label: t('common:buttonLab.icons.send'),
      icon: <Send size={16} />,
    },
    {
      id: 'trash' as const,
      label: t('common:buttonLab.icons.trash'),
      icon: <Trash2 size={16} />,
    },
    {
      id: 'user' as const,
      label: t('common:buttonLab.icons.user'),
      icon: <UserPlus size={16} />,
    },
  ];
}

export function ButtonLabControls({ state, onChange }: ButtonLabControlsProps) {
  const { t } = useTranslation();
  const iconOptions = useIconOptions();
  const selectedIcon =
    iconOptions.find((option) => option.id === state.iconId)?.icon ?? null;

  return (
    <div className="bg-card space-y-6 rounded-xl border border-black/10 p-6 dark:border-white/10">
      <h2 className="text-lg font-semibold">
        {t('common:buttonLab.liveControls')}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SelectField
          label={t('common:buttonLab.variant')}
          value={state.variant}
          options={VARIANTS.map((v) => ({ value: v, label: v }))}
          onChange={(v) => onChange({ variant: v })}
        />
        <SelectField
          label={t('common:buttonLab.appearance')}
          value={state.appearance}
          options={APPEARANCES.map((a) => ({ value: a, label: a }))}
          onChange={(a) => onChange({ appearance: a })}
        />
        <SelectField
          label={t('common:buttonLab.effect')}
          value={state.effect}
          options={EFFECTS.map((e) => ({ value: e, label: e }))}
          onChange={(e) => onChange({ effect: e })}
        />
        <SelectField
          label={t('common:buttonLab.icon')}
          value={state.iconId}
          options={iconOptions.map((option) => ({
            value: option.id,
            label: option.label,
          }))}
          onChange={(id) => onChange({ iconId: id })}
        />
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-muted-foreground text-xs tracking-wide uppercase">
            {t('common:buttonLab.label')}
          </span>
          <input
            type="text"
            value={state.label}
            onChange={(e) => onChange({ label: e.target.value })}
            className="rounded-lg border border-black/10 bg-black/5 px-3 py-2 dark:border-white/10 dark:bg-white/5"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleField
          label={t('common:buttonLab.loading')}
          checked={state.loading}
          onChange={(loading) => onChange({ loading })}
        />
        <ToggleField
          label={t('common:buttonLab.disabled')}
          checked={state.disabled}
          onChange={(disabled) => onChange({ disabled })}
        />
      </div>

      <div className="flex min-h-[5rem] items-center justify-center rounded-lg border border-dashed border-black/15 p-8 dark:border-white/15">
        <Button
          variant={state.variant}
          appearance={state.appearance}
          effect={state.effect}
          loading={state.loading}
          disabled={state.disabled}
          iconBefore={selectedIcon}
        >
          {state.label}
        </Button>
      </div>
    </div>
  );
}

export function ButtonVariantMatrix() {
  const { t } = useTranslation();

  return (
    <div className="bg-card space-y-4 rounded-xl border border-black/10 p-6 dark:border-white/10">
      <h2 className="text-lg font-semibold">
        {t('common:buttonLab.variantMatrix')}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="text-muted-foreground border-b border-black/10 dark:border-white/10">
              <th className="py-2 pr-4 font-medium">
                {t('common:buttonLab.variant')}
              </th>
              {APPEARANCES.map((a) => (
                <th key={a} className="px-2 py-2 font-medium capitalize">
                  {a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VARIANTS.map((variant) => (
              <tr
                key={variant}
                className="border-b border-black/5 dark:border-white/5"
              >
                <td className="py-4 pr-4 font-medium capitalize">{variant}</td>
                {APPEARANCES.map((appearance) => (
                  <td key={appearance} className="px-2 py-4">
                    <div className="flex w-2/3 max-w-[8.5rem] flex-col gap-2">
                      <Button
                        variant={variant}
                        appearance={appearance}
                        className="w-full"
                      >
                        {t('common:buttonLab.default')}
                      </Button>
                      <Button
                        variant={variant}
                        appearance={appearance}
                        disabled
                        className="w-full"
                      >
                        {t('common:buttonLab.disabled')}
                      </Button>
                      <Button
                        variant={variant}
                        appearance={appearance}
                        loading
                        className="w-full"
                      >
                        {t('common:buttonLab.loading')}
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ButtonExperimentZone() {
  const { t } = useTranslation();

  return (
    <div className="bg-card space-y-4 rounded-xl border border-black/10 p-6 dark:border-white/10">
      <h2 className="text-lg font-semibold">
        {t('common:buttonLab.experimentZone')}
      </h2>
      <p className="text-muted-foreground text-sm">
        {t('common:buttonLab.experimentDescription')}
      </p>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" effect="glow">
          {t('common:buttonLab.glowOnly')}
        </Button>
        <Button variant="primary" effect="none">
          {t('common:buttonLab.noEffect')}
        </Button>
        <Button variant="dangerous" effect="glow" appearance="outline">
          {t('common:buttonLab.dangerOutline')}
        </Button>
        <Button variant="primary" loading>
          {t('common:buttonLab.shimmerLoading')}
        </Button>
        <Button
          variant="primary"
          iconBefore={<Send size={16} />}
          iconAfter={<Send size={16} className="rotate-180" />}
        >
          {t('common:buttonLab.bothIcons')}
        </Button>
      </div>
    </div>
  );
}
