import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Root wrapper — controls open state */
export const AlertDialog = AlertDialogPrimitive.Root;

export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export const AlertDialogPortal = AlertDialogPrimitive.Portal;

interface AlertDialogOverlayProps {
  className?: string;
}

/** Semi-transparent backdrop */
export function AlertDialogOverlay({ className }: AlertDialogOverlayProps) {
  return (
    <AlertDialogPrimitive.Overlay
      className={twMerge(
        'fixed inset-0 z-50 bg-black/10 backdrop-blur-sm',
        className,
      )}
    />
  );
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

/** Centered dialog panel */
export function AlertDialogContent({
  children,
  className,
}: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={twMerge(
          'fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2',
          'rounded-xl border border-neutral-200 dark:border-neutral-700',
          'bg-white p-6 shadow-xl dark:bg-neutral-900',
          'focus:outline-none',
          className,
        )}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertDialogHeader({
  children,
  className,
}: AlertDialogHeaderProps) {
  return (
    <div className={clsx('mb-4 flex flex-col gap-2', className)}>
      {children}
    </div>
  );
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertDialogFooter({
  children,
  className,
}: AlertDialogFooterProps) {
  return (
    <div className={clsx('mt-6 flex justify-end gap-2', className)}>
      {children}
    </div>
  );
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertDialogTitle({
  children,
  className,
}: AlertDialogTitleProps) {
  return (
    <AlertDialogPrimitive.Title
      className={twMerge('text-foreground text-lg font-semibold', className)}
    >
      {children}
    </AlertDialogPrimitive.Title>
  );
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertDialogDescription({
  children,
  className,
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      className={twMerge(
        'text-muted-foreground text-sm leading-relaxed',
        className,
      )}
    >
      {children}
    </AlertDialogPrimitive.Description>
  );
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/** Primary confirm button */
export function AlertDialogAction({
  children,
  className,
  onClick,
}: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Action
      onClick={onClick}
      className={twMerge(
        'cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors',
        'bg-black/90 text-white dark:bg-white/90 dark:text-black',
        'hover:bg-black/95 dark:hover:bg-white/95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400',
        className,
      )}
    >
      {children}
    </AlertDialogPrimitive.Action>
  );
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  className?: string;
}

/** Secondary cancel button */
export function AlertDialogCancel({
  children,
  className,
}: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Cancel
      className={twMerge(
        'cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors',
        'text-foreground bg-transparent',
        'hover:bg-black/10 dark:hover:bg-white/10',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400',
        className,
      )}
    >
      {children}
    </AlertDialogPrimitive.Cancel>
  );
}
