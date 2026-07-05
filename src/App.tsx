import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Layout } from '@/components/layout/Layout';
import { Toaster } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Outlet />
          </Layout>
          <Toaster />
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
