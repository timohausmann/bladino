import type { NoteEditorViewMode } from '@/components/notes/types';
import { Columns2, Eye, PenLine, type LucideIcon } from 'lucide-react';

export const NOTE_EDITOR_FONT_OPTIONS = ['mono', 'sans'] as const;

export const NOTE_EDITOR_VIEW_MODE_OPTIONS: Array<{
  mode: NoteEditorViewMode;
  icon: LucideIcon;
  labelKey: 'viewModeEdit' | 'viewModePreview' | 'viewModeSplit';
}> = [
  { mode: 'edit', icon: PenLine, labelKey: 'viewModeEdit' },
  { mode: 'preview', icon: Eye, labelKey: 'viewModePreview' },
  { mode: 'split', icon: Columns2, labelKey: 'viewModeSplit' },
];
