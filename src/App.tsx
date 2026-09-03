import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from '@tanstack/react-router';
import { BackgroundStyleProvider } from '@/components/BackgroundStyleProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Layout } from '@/components/layout/Layout';
import { Toaster } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <ThemeProvider>
      <BackgroundStyleProvider>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <Layout>
              <Outlet />
            </Layout>
            <Toaster />
          </QueryClientProvider>
        </TooltipProvider>
      </BackgroundStyleProvider>
    </ThemeProvider>
  );
}

export default App;
