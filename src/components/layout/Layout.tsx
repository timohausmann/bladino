import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

/**
 * Main layout component with header and content area
 */
export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 py-8">
                <div className="container max-w-3xl mx-auto px-4">
                    {children}
                </div>
            </main>
        </div>
    );
} 