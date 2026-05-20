import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomeRoute } from '@/routes/HomeRoute';
import { ScenarioStageRoute } from '@/routes/ScenarioStageRoute';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/scenario/:id" element={<ScenarioStageRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
