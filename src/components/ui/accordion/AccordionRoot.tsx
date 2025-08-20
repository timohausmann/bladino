import * as Accordion from '@radix-ui/react-accordion';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface AccordionRootProps {
    children: ReactNode;
    type?: 'single' | 'multiple';
    collapsible?: boolean;
    className?: string;
}

/**
 * AccordionRoot - Wrapper component for the entire accordion
 * Provides a single rounded border around all items with proper spacing
 */
export function AccordionRoot({
    children,
    type = 'single',
    collapsible = true,
    className = ''
}: AccordionRootProps) {
    return (
        <Accordion.Root
            type={type}
            collapsible={collapsible}
            className={twMerge(
                'border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden',
                className
            )}
        >
            {children}
        </Accordion.Root>
    );
}
