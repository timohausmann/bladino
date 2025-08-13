import { Outlet } from '@tanstack/react-router';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/layout/Layout';

/**
 * Main App component with TanStack Router setup
 */
function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Outlet />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
