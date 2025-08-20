import * as Accordion from '@radix-ui/react-accordion';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface AccordionItemProps {
    value: string;
    children: ReactNode;
    className?: string;
}

/**
 * AccordionItem - Individual accordion item wrapper
 * Provides border separation between items and proper spacing
 * Highlights open state with subtle background color
 */
export function AccordionItem({ value, children, className = '' }: AccordionItemProps) {
    return (
        <Accordion.Item
            value={value}
            className={twMerge(
                'border-b border-neutral-200 dark:border-neutral-700 last:border-b-0 transition-colors duration-200',
                'data-[state=open]:bg-neutral-50 dark:data-[state=open]:bg-neutral-700',
                className
            )}
        >
            {children}
        </Accordion.Item>
    );
}
