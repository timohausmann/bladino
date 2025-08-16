import { twMerge } from 'tailwind-merge';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className }: CardProps) {

    const classes = twMerge(
        "p-4 rounded-xl bg-card text-card-foreground border border-card-border",
        className
    );

    return (
        <div className={classes}>
            {children}
        </div>
    );
}