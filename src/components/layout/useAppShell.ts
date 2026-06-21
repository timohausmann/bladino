import { useMatches } from '@tanstack/react-router';

export type LayoutMode = 'feed' | 'masterDetail' | 'fullWidth';

interface RouteStaticData {
    fixedViewport?: boolean;
    layoutMode?: LayoutMode;
}

/**
 * Whether the current route is under the authenticated layout (shows nav rail).
 */
export function useIsAuthenticatedShell(): boolean {
    return useMatches().some(match => match.routeId === '/_authenticated');
}

/**
 * Resolves layout mode from the deepest matching route with staticData.layoutMode.
 */
export function useLayoutMode(): LayoutMode {
    const matches = useMatches();

    for (let index = matches.length - 1; index >= 0; index -= 1) {
        const layoutMode = (matches[index].staticData as RouteStaticData | undefined)?.layoutMode;
        if (layoutMode) {
            return layoutMode;
        }
    }

    return 'feed';
}

/**
 * Whether the current route opts into fixed viewport scrolling (html/body lock).
 */
export function useFixedViewport(enabled?: boolean): boolean {
    const matches = useMatches();
    const fromRoute = matches.some(
        match => (match.staticData as RouteStaticData | undefined)?.fixedViewport,
    );

    return enabled ?? fromRoute;
}
