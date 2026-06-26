interface ContextMenuDividerProps {
  id: string;
}

export function ContextMenuDivider({ id }: ContextMenuDividerProps) {
  return (
    <div
      key={id}
      className="my-1 border-t border-neutral-200 dark:border-neutral-700"
    />
  );
}
