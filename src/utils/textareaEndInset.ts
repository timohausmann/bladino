/** Right padding per visible w-10 end-adornment slot (icon + gap + offset). */
const INSET_BY_SLOT_COUNT: Record<number, string> = {
  1: 'pr-14',
  2: 'pr-24',
};

export type TextareaEndInsetCounts =
  | number
  | {
      base: number;
      md?: number;
    };

export function getTextareaEndInsetClassName(
  slotCount: TextareaEndInsetCounts,
): string {
  if (typeof slotCount === 'number') {
    return INSET_BY_SLOT_COUNT[slotCount] ?? 'pr-12';
  }

  const base = INSET_BY_SLOT_COUNT[slotCount.base] ?? 'pr-12';
  if (slotCount.md == null) {
    return base;
  }

  const md = INSET_BY_SLOT_COUNT[slotCount.md] ?? 'pr-24';
  return `${base} ${md.replace(/^pr-/, 'md:pr-')}`;
}
