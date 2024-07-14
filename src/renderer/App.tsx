import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './layouts/Layout';
import HomePage from './pages/home';
import StatsPage from './pages/stats';
import SettingsPage from './pages/settings';
import { useSettingsStore } from './stores/useSettingsStore';
import { useEffect } from 'react';

export default function App() {
  const initSettings = useSettingsStore((state) => state.initSettings);

  useEffect(() => {
    initSettings();
  }, [initSettings]);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}