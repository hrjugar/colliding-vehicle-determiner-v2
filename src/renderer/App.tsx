import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './layouts/Layout';
import HomePage from './pages/home';
import StatsPage from './pages/stats';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
