import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './layouts/Layout';
import HomePage from './pages/home';
import StatsPage from './pages/stats';
import SettingsPage from './pages/settings';
import DatabaseInitializer from './gates/DatabaseInitializer';
import { QueryClient, QueryClientProvider } from 'react-query';
import AccidentPage from './pages/accident';
import { enableMapSet } from 'immer';

const queryClient = new QueryClient();
enableMapSet();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<DatabaseInitializer />}>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/accident/:id" element={<AccidentPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}