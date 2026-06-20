import clsx from 'clsx';
import { useMatches } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';

interface LayoutProps {
    children: React.ReactNode;
    /**
     * Locks the app to the viewport height so only inner regions scroll.
     * When omitted, routes can opt in via `staticData.fixedViewport`.
     */
    fixedViewport?: boolean;
}

function useFixedViewport(enabled?: boolean): boolean {
    const matches = useMatches();
    const fromRoute = matches.some(
        match => (match.staticData as { fixedViewport?: boolean } | undefined)?.fixedViewport,
    );

    return enabled ?? fromRoute;
}

/**
 * Main layout component with header and flexible content area.
 */
export function Layout({ children, fixedViewport: fixedViewportProp }: LayoutProps) {
    const fixedViewport = useFixedViewport(fixedViewportProp);

    useEffect(() => {
        const className = 'fixed-viewport';
        if (fixedViewport) {
            document.documentElement.classList.add(className);
            document.body.classList.add(className);
        } else {
            document.documentElement.classList.remove(className);
            document.body.classList.remove(className);
        }

        return () => {
            document.documentElement.classList.remove(className);
            document.body.classList.remove(className);
        };
    }, [fixedViewport]);

    return (
        <div
            className={clsx(
                'flex flex-col',
                fixedViewport ? 'h-dvh overflow-hidden' : 'min-h-screen',
            )}
        >
            <Header />
            <main
                className={clsx(
                    'flex-1 flex flex-col min-h-0',
                    fixedViewport ? 'overflow-hidden pt-28 px-4 pb-6' : 'py-28',
                )}
            >
                {children}
            </main>
        </div>
    );
}
