import * as ToastPrimitive from '@radix-ui/react-toast';
import { twMerge } from 'tailwind-merge';
import styles from './Toast.module.css';

export const ToastProvider = ToastPrimitive.Provider;
export const ToastClose = ToastPrimitive.Close;
export const ToastAction = ToastPrimitive.Action;

interface ToastRootProps {
    children: React.ReactNode;
    className?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    duration?: number;
}

/** Minimal toast panel */
export function ToastRoot({ children, className, ...props }: ToastRootProps) {
    return (
        <ToastPrimitive.Root
            className={twMerge(
                styles.ToastRoot,
                'rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-foreground shadow-lg',
                'dark:border-neutral-700 dark:bg-neutral-900',
                className
            )}
            {...props}
        >
            {children}
        </ToastPrimitive.Root>
    );
}

interface ToastTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function ToastTitle({ children, className }: ToastTitleProps) {
    return (
        <ToastPrimitive.Title className={twMerge('font-medium', className)}>
            {children}
        </ToastPrimitive.Title>
    );
}

interface ToastDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function ToastDescription({ children, className }: ToastDescriptionProps) {
    return (
        <ToastPrimitive.Description className={twMerge('text-muted-foreground', className)}>
            {children}
        </ToastPrimitive.Description>
    );
}

interface ToastViewportProps {
    className?: string;
}

/** Bottom-right container for toast notifications */
export function ToastViewport({ className }: ToastViewportProps) {
    return (
        <ToastPrimitive.Viewport
            className={twMerge(
                styles.ToastViewport,
                'fixed bottom-4 right-4 z-100 flex max-h-screen w-full max-w-sm flex-col items-end gap-2 outline-none',
                className
            )}
        />
    );
}
