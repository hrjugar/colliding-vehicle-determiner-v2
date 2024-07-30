import { MemoryRouter as Router, Routes, Route, createMemoryRouter, useSearchParams } from 'react-router-dom';
import './App.css';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/home';
import StatsPage from './pages/stats';
import SettingsPage from './pages/settings';
import DatabaseInitializer from './gates/DatabaseInitializer';
import { QueryClient, QueryClientProvider } from 'react-query';
import AccidentPage from './pages/accident';
import { enableMapSet } from 'immer';
import AddPage from './pages/add';
import AddModalLayout from './layouts/AddModalLayout';

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
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/accident/:id" element={<AccidentPage />} />
                <Route path="/add" element={<AddPage />} />
              </Route>
            ) : (
              <Route element={<AddModalLayout />}>
                <Route path="/" element={<AddPage />} />
              </Route>
            )}
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}