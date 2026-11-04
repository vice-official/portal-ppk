import type { FC } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { CitizensRegistryPage } from '../pages/registry/CitizensRegistryPage';
import { CitizenDetailPage } from '../pages/citizen/CitizenDetailPage';

export const AppRoutes: FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <DashboardPage
            onNavigateToRegistry={() => navigate('/registry')}
            onFilterByStatus={(status) =>
              navigate(status === 'all' ? '/registry' : `/registry?status=${status}`)
            }
            onSelectCitizen={(id) => navigate(`/registry/${id}`)}
          />
        }
      />
      <Route path="/registry" element={<CitizensRegistryPage />} />
      <Route path="/registry/:id" element={<CitizenDetailPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
