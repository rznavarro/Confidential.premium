import React from 'react';
import { Crown, Shield, Star, Mail, Phone } from 'lucide-react';
import { Card } from '../ui/Card';
import { users, getCEO, getSupervisors, getUsersByTeam } from '../../data/users';
import { User } from '../../types';

interface OrganizationChartProps {
  currentUser: User;
}

const UserCard: React.FC<{ user: User; isCurrentUser: boolean }> = ({ user, isCurrentUser }) => {
  const { currentUser } = React.useContext(OrganizationContext);
  const showAccessCode = currentUser?.role === 'CEO';

  const getRoleIcon = () => {
    switch (user.role) {
      case 'CEO':
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'Supervisor':
        return <Shield className="w-5 h-5 text-purple-400" />;
      default:
        return <Star className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <Card 
      className={`transition-all duration-300 ${isCurrentUser ? 'ring-2 ring-cyan-400 bg-slate-700/70' : ''}`}
      hover={!isCurrentUser}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-slate-600"
          />
          <div className="absolute -top-1 -right-1">
            {getRoleIcon()}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white">{user.name}</h3>
            {isCurrentUser && (
              <span className="text-xs bg-cyan-500 text-white px-2 py-1 rounded-full">TÚ</span>
            )}
          </div>
          <p className="text-sm text-slate-400 mb-1">{user.role}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{user.email}</span>
            </div>
            {showAccessCode && (
              <div className="flex items-center gap-1">
                <span className="text-cyan-400 font-mono">{user.accessCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const OrganizationContext = React.createContext<{ currentUser: User | null }>({ currentUser: null });

export const OrganizationChart: React.FC<OrganizationChartProps> = ({ currentUser }) => {
  const ceo = getCEO();
  const supervisors = getSupervisors();

  return (
    <OrganizationContext.Provider value={{ currentUser }}>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-400" />
            Organigrama Corporativo
          </h2>
          {currentUser.role === 'CEO' && (
            <p className="text-slate-400 text-sm">
              Como CEO, puedes ver todos los códigos de acceso del equipo
            </p>
          )}
        </div>

        {/* CEO Level */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">DIRECCIÓN EJECUTIVA</h3>
          <div className="max-w-md mx-auto">
            <UserCard user={ceo} isCurrentUser={currentUser.id === ceo.id} />
          </div>
        </div>

        {/* Supervisors Level */}
        <div>
          <h3 className="text-lg font-semibold text-purple-400 mb-4 text-center">SUPERVISORES DE VENTAS</h3>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {supervisors.map(supervisor => (
              <UserCard 
                key={supervisor.id} 
                user={supervisor} 
                isCurrentUser={currentUser.id === supervisor.id} 
              />
            ))}
          </div>
        </div>

        {/* Teams */}
        {supervisors.map(supervisor => {
          const teamMembers = getUsersByTeam(supervisor.team!);
          return (
            <div key={supervisor.team}>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 text-center">
                EQUIPO {supervisor.name.split(' ')[1]?.toUpperCase()}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {teamMembers.map(member => (
                  <UserCard 
                    key={member.id} 
                    user={member} 
                    isCurrentUser={currentUser.id === member.id} 
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* CEO Direct Team */}
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 text-center">EQUIPO DIRECTO CEO</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {getUsersByTeam('equipo-ceo').map(member => (
              <UserCard 
                key={member.id} 
                user={member} 
                isCurrentUser={currentUser.id === member.id} 
              />
            ))}
          </div>
        </div>
      </div>
    </OrganizationContext.Provider>
  );
};