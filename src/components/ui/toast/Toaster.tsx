import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';
import { ToastProvider, ToastRoot, ToastTitle, ToastViewport } from './Toast';

type ToastItem = {
    id: string;
    title: string;
};

type ToastListener = (item: ToastItem) => void;

const listeners = new Set<ToastListener>();

/** Show a toast notification */
export function toast(title: string) {
    const item = { id: nanoid(), title };
    listeners.forEach((listener) => listener(item));
}

function subscribe(listener: ToastListener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

const TOAST_DURATION = 3000;
/** Matches swipeOut / hide animation duration in Toast.module.css */
const TOAST_REMOVE_DELAY = 150;

/** Mount once at app root to render toasts */
export function Toaster() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        return subscribe((item) => {
            setToasts((current) => [...current, item]);
        });
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((current) => current.filter((item) => item.id !== id));
    }, []);

    return (
        <ToastProvider duration={TOAST_DURATION} swipeDirection="right">
            {toasts.map((item) => (
                <ToastRoot
                    key={item.id}
                    defaultOpen
                    onOpenChange={(open) => {
                        if (!open) {
                            window.setTimeout(() => dismiss(item.id), TOAST_REMOVE_DELAY);
                        }
                    }}
                >
                    <ToastTitle>{item.title}</ToastTitle>
                </ToastRoot>
            ))}
            <ToastViewport />
        </ToastProvider>
    );
}
