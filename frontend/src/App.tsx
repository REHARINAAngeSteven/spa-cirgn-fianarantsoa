import { useState, useEffect } from 'react';
import { useAuth } from '../src/app/context/AuthContext';
import { LoginPage } from '../src/app/components/LoginPage';
import { Layout } from '../src/app/components/Layout';

// Chargé SPA
import { DashboardUnite } from '../src/app/components/charge-spa/DashboardUnite';
import { GestionSPA } from '../src/app/components/charge-spa/GestionSPA';
import { PassationService } from '../src/app/components/charge-spa/PassationService';

// Admin
import { CentreValidation } from '../src/app/components/admin/CentreValidation';
import { GestionComptes } from '../src/app/components/admin/GestionComptes';
import { GestionPersonnel } from '../src/app/components/admin/GestionPersonnel';
import { HistoriquesAudit } from '../src/app/components/admin/HistoriquesAudit';
import { Referentiels } from '../src/app/components/admin/Referentiels';

function AppContent() {
  const { currentUser, isAuthenticated } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setCurrentPage(isAdmin ? 'validation' : 'dashboard');
    }
  }, [currentUser, isAdmin]);

  if (!isAuthenticated || !currentUser) {
    return <LoginPage />;
  }

  if (!currentPage) {
    return null;
  }

  const renderPage = () => {
    if (isAdmin) {
      switch (currentPage) {
        case 'validation':
          return <CentreValidation />;
        case 'comptes':
          return <GestionComptes />;
        case 'personnel':
          return <GestionPersonnel />;
        case 'historique':
          return <HistoriquesAudit />;
        case 'referentiels':
          return <Referentiels />;
        default:
          return <CentreValidation />;
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardUnite />;
      case 'gestion-spa':
        return <GestionSPA />;
      case 'passation':
        return <PassationService />;
      default:
        return <DashboardUnite />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
export default AppContent;