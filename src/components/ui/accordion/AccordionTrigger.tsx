import * as Accordion from '@radix-ui/react-accordion';
import { ReactNode } from 'react';
import { ChevronDown } from 'react-feather';
import { twMerge } from 'tailwind-merge';

interface AccordionTriggerProps {
    children: ReactNode;
    className?: string;
}

/**
 * AccordionTrigger - Clickable trigger component for each accordion item
 * Includes the header wrapper and consistent styling, hover effects, and chevron icon
 * Rotates chevron when open for better visual feedback
 */
export function AccordionTrigger({ children, className = '' }: AccordionTriggerProps) {
    return (
        <Accordion.Header>
            <Accordion.Trigger
                className={twMerge(
                    'flex w-full items-center justify-between p-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors',
                    'data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-neutral-700',
                    className
                )}
            >
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {children}
                </span>
                <ChevronDown className="h-4 w-4 text-neutral-500 transition-transform duration-200 data-[state=open]:rotate-180" />
            </Accordion.Trigger>
        </Accordion.Header>
    );
}
