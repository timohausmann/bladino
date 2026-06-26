import {
  Button,
  type ButtonAppearance,
  type ButtonEffect,
  type ButtonVariant,
} from '@/components/ui/button';
import { Send, Trash2, UserPlus } from 'lucide-react';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'dangerous'];
const APPEARANCES: ButtonAppearance[] = ['filled', 'outline'];
const EFFECTS: ButtonEffect[] = ['none', 'glow'];

const ICON_OPTIONS = [
  { id: 'none', label: 'None', icon: null },
  { id: 'send', label: 'Send', icon: <Send size={16} /> },
  { id: 'trash', label: 'Trash', icon: <Trash2 size={16} /> },
  { id: 'user', label: 'UserPlus', icon: <UserPlus size={16} /> },
] as const;

export interface ButtonLabState {
  variant: ButtonVariant;
  appearance: ButtonAppearance;
  effect: ButtonEffect;
  loading: boolean;
  disabled: boolean;
  label: string;
  iconId: (typeof ICON_OPTIONS)[number]['id'];
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

export function ButtonLabControls({ state, onChange }: ButtonLabControlsProps) {
  const selectedIcon =
    ICON_OPTIONS.find((o) => o.id === state.iconId)?.icon ?? null;

  return (
    <div className="bg-card space-y-6 rounded-xl border border-black/10 p-6 dark:border-white/10">
      <h2 className="text-lg font-semibold">Live Controls</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SelectField
          label="Variant"
          value={state.variant}
          options={VARIANTS.map((v) => ({ value: v, label: v }))}
          onChange={(v) => onChange({ variant: v })}
        />
        <SelectField
          label="Appearance"
          value={state.appearance}
          options={APPEARANCES.map((a) => ({ value: a, label: a }))}
          onChange={(a) => onChange({ appearance: a })}
        />
        <SelectField
          label="Effect"
          value={state.effect}
          options={EFFECTS.map((e) => ({ value: e, label: e }))}
          onChange={(e) => onChange({ effect: e })}
        />
        <SelectField
          label="Icon"
          value={state.iconId}
          options={ICON_OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
          onChange={(id) => onChange({ iconId: id })}
        />
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-muted-foreground text-xs tracking-wide uppercase">
            Label
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
          label="Loading"
          checked={state.loading}
          onChange={(loading) => onChange({ loading })}
        />
        <ToggleField
          label="Disabled"
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
  return (
    <div className="bg-card space-y-4 rounded-xl border border-black/10 p-6 dark:border-white/10">
      <h2 className="text-lg font-semibold">Variant Matrix</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="text-muted-foreground border-b border-black/10 dark:border-white/10">
              <th className="py-2 pr-4 font-medium">Variant</th>
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
                        Default
                      </Button>
                      <Button
                        variant={variant}
                        appearance={appearance}
                        disabled
                        className="w-full"
                      >
                        Disabled
                      </Button>
                      <Button
                        variant={variant}
                        appearance={appearance}
                        loading
                        className="w-full"
                      >
                        Loading
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
  return (
    <div className="bg-card space-y-4 rounded-xl border border-black/10 p-6 dark:border-white/10">
      <h2 className="text-lg font-semibold">Experiment Zone</h2>
      <p className="text-muted-foreground text-sm">
        Isolated effect showcases — hover to see the glow animation.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" effect="glow">
          Glow only
        </Button>
        <Button variant="primary" effect="none">
          No effect
        </Button>
        <Button variant="dangerous" effect="glow" appearance="outline">
          Danger outline
        </Button>
        <Button variant="primary" loading>
          Shimmer loading
        </Button>
        <Button
          variant="primary"
          iconBefore={<Send size={16} />}
          iconAfter={<Send size={16} className="rotate-180" />}
        >
          Both icons
        </Button>
      </div>
    </div>
  );
}
