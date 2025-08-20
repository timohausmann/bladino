import * as Accordion from '@radix-ui/react-accordion';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface AccordionContentProps {
    children: ReactNode;
    className?: string;
}

/**
 * AccordionContent - Expandable content wrapper for each accordion item
 * Provides consistent padding and styling for the content area
 * Includes smooth height animations using Radix CSS custom properties
 */
export function AccordionContent({ children, className = '' }: AccordionContentProps) {
    return (
        <Accordion.Content
            className={twMerge(
                'px-4 pb-4 overflow-hidden',
                'bg-neutral-100 dark:bg-neutral-700',
                'data-[state=open]:animate-[radixSlideDown_300ms_ease-out]',
                'data-[state=closed]:animate-[radixSlideUp_300ms_ease-out]',
                'will-change-[height,padding-bottom]',
                className
            )}
        >
            {children}
        </Accordion.Content>
    );
}
