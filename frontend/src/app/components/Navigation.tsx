import React from 'react';
import { Button } from './ui/button';
import { LayoutDashboard, Users, FileText, CheckSquare, UserCog, Database, History, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  // Navigation pour Chargé SPA
  if (currentUser.role === 'CHARGE_SPA') {
    return (
      <nav className="bg-[#1E1E1E] border-b border-[#3A3A3A]">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3">
            <Button
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
              className={`${
                currentPage === 'dashboard'
                  ? 'bg-[#F59E0B] text-black hover:bg-[#D97706]'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate('gestion-spa')}
              className={`${
                currentPage === 'gestion-spa'
                  ? 'bg-[#F59E0B] text-black hover:bg-[#D97706]'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Gestion SPA
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate('passation')}
              className={`${
                currentPage === 'passation'
                  ? 'bg-[#F59E0B] text-black hover:bg-[#D97706]'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Passation
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  // Navigation pour Admin
  if (currentUser.role === 'ADMIN') {
    return (
      <nav className="bg-[#1E1E1E] border-b border-[#3A3A3A]">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto">
            <Button
              variant="ghost"
              onClick={() => onNavigate('validation')}
              className={`${
                currentPage === 'validation'
                  ? 'bg-[#F59E0B] text-black hover:bg-[#D97706]'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Validations
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate('comptes')}
              className={`${
                currentPage === 'comptes'
                  ? 'bg-[#F59E0B] text-black hover:bg-[#D97706]'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Comptes
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate('personnel')}
              className={`${
                currentPage === 'personnel'
                  ? 'bg-[#F59E0B] text-black hover:bg-[#D97706]'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <Database className="w-4 h-4 mr-2" />
              Personnel
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate('historiques')}
              className={`${
                currentPage === 'historiques'
                  ? 'bg-[#F59E0B] text-black hover:bg-[#D97706]'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
              }`}
            >
              <History className="w-4 h-4 mr-2" />
              Historiques
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return null;
};
