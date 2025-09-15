import React from 'react';
import { LogOut, Crown, Shield, Star } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Card';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'CEO':
      return <Crown className="w-5 h-5 text-yellow-400" />;
    case 'Supervisor':
      return <Shield className="w-5 h-5 text-purple-400" />;
    default:
      return <Star className="w-5 h-5 text-cyan-400" />;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'CEO':
      return 'from-yellow-500 to-amber-500';
    case 'Supervisor':
      return 'from-purple-500 to-violet-500';
    default:
      return 'from-cyan-500 to-blue-500';
  }
};

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <Logo size="md" />
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-slate-600"
            />
            <div className="hidden md:block">
              <p className="text-white font-semibold">{user.name}</p>
              <div className="flex items-center gap-2">
                {getRoleIcon(user.role)}
                <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getRoleBadgeColor(user.role)} text-white font-medium`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </header>
  );
};