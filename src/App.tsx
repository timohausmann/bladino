import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';

/**
 * Main App component with routing setup
 */
function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
