import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Layout } from '@/components/layout/Layout';
import { queryClient } from './lib/queryClient';

function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Outlet />
                </Layout>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
