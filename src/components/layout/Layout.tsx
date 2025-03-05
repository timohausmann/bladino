import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

/**
 * Main layout component with header and content area
 */
export function Layout({ children }: LayoutProps) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, padding: '2rem 0' }}>
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
} 