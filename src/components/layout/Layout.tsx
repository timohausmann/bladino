import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

/**
 * Main layout component with header and flexible content area
 */
export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col py-28">
                {children}
            </main>
        </div>
    );
} 