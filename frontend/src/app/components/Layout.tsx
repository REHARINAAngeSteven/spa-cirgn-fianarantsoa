import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, Users, ClipboardList, History, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { KeyboardShortcuts } from './KeyboardShortcuts';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  title?: string;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'ADMIN';

  const chargeSpaPages = [
    { id: 'dashboard', label: 'Dashboard Unité', icon: ClipboardList, shortcut: 'Ctrl+1' },
    { id: 'gestion-spa', label: 'Gestion SPA', icon: Users, shortcut: 'Ctrl+2' },
    { id: 'passation', label: 'Passation de Service', icon: Shield, shortcut: 'Ctrl+3' },
  ];

  const adminPages = [
    { id: 'validation', label: 'Centre de Validation', icon: Shield, shortcut: 'Ctrl+1' },
    { id: 'comptes', label: 'Gestion des Comptes', icon: Users, shortcut: 'Ctrl+2' },
    { id: 'personnel', label: 'Gestion du Personnel', icon: Users, shortcut: 'Ctrl+3' },
    { id: 'historique', label: 'Historiques & Audit', icon: History, shortcut: 'Ctrl+4' },
    { id: 'referentiels', label: 'Référentiels', icon: Settings, shortcut: 'Ctrl+5' },
  ];

  const pages = isAdmin ? adminPages : chargeSpaPages;

  // Raccourcis clavier pour la navigation
  const shortcuts = [
    ...pages.map((page, index) => ({
      key: `Ctrl+${index + 1}`,
      description: `Naviguer vers ${page.label}`,
      action: () => onNavigate(page.id),
    })),
    {
      key: 'Ctrl+L',
      description: 'Se déconnecter',
      action: logout,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-5">
              
              <img
                src="/Logo2.jpg"
                alt="Logo CIRGN"
                className="w-10 h-10 object-contain rounded-full"
              />
              
              <div>
                <h2 className="text-sidebar-foreground">Système de gestion SPA</h2>
                <p className="text-xs text-muted-foreground">Tableau de bord du SPA</p>
              </div>
            </div>

          </div>
          <div className="text-sm">
            <p className="text-sidebar-foreground">Login: {currentUser.login}</p>

            <p className="text-xs text-muted-foreground">Unite: {currentUser.unite_id}</p>
            <p className="text-xs text-sidebar-primary mt-1">
              Rôle: {isAdmin ? 'Administrateur' : 'Chargé SPA'}
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => onNavigate(page.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-md mb-1 transition-colors ${
                  currentPage === page.id
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{page.label}</span>
                </div>
                <kbd className="text-xs opacity-50">{page.shortcut}</kbd>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcuts shortcuts={shortcuts} />
    </div>
  );
}