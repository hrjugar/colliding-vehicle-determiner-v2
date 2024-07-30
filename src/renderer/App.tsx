import { MemoryRouter as Router, Routes, Route, createMemoryRouter, useSearchParams } from 'react-router-dom';
import './App.css';
import Layout from './layouts/Layout';
import HomePage from './pages/home';
import StatsPage from './pages/stats';
import SettingsPage from './pages/settings';
import DatabaseInitializer from './gates/DatabaseInitializer';
import { QueryClient, QueryClientProvider } from 'react-query';
import AccidentPage from './pages/accident';
import { enableMapSet } from 'immer';
import AddPage from './pages/add';

const queryClient = new QueryClient();
enableMapSet();

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const windowType = urlParams.get('windowType');


  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<DatabaseInitializer />}>
            {windowType === "main" ? (
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/accident/:id" element={<AccidentPage />} />
                <Route path="/add" element={<AddPage />} />
              </Route>
            ) : (
              <Route path="/" element={<AddPage />} />
            )}
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}