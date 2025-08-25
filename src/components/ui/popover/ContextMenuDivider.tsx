interface ContextMenuDividerProps {
    id: string;
}

export function ContextMenuDivider({ id }: ContextMenuDividerProps) {
    return (
        <div
            key={id}
            className="border-t border-neutral-200 dark:border-neutral-700 my-1"
        />
    );
}
