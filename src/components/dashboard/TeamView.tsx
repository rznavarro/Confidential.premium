import React from 'react';
import { Users, MessageSquare, Award } from 'lucide-react';
import { Card } from '../ui/Card';
import { User } from '../../types';
import { users, getUsersByTeam } from '../../data/users';

interface TeamViewProps {
  user: User;
}

const TeamMemberCard: React.FC<{ member: User; isCurrentUser: boolean }> = ({ member, isCurrentUser }) => (
  <Card className={`${isCurrentUser ? 'ring-2 ring-cyan-400' : ''}`}>
    <div className="flex items-center gap-4">
      <img
        src={member.avatar}
        alt={member.name}
        className="w-12 h-12 rounded-full border-2 border-slate-600"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-white">{member.name}</h3>
          {isCurrentUser && (
            <span className="text-xs bg-cyan-500 text-white px-2 py-1 rounded-full">TÚ</span>
          )}
        </div>
        <p className="text-sm text-slate-400">{member.role}</p>
        <p className="text-xs text-slate-500 mt-1">{member.email}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-green-400 font-bold text-sm">
          {Math.floor(Math.random() * 30) + 70}% 
        </span>
        <span className="text-xs text-slate-500">Rendimiento</span>
      </div>
    </div>
  </Card>
);

export const TeamView: React.FC<TeamViewProps> = ({ user }) => {
  const getTeamMembers = () => {
    if (user.role === 'CEO') {
      return users.filter(u => u.id !== user.id);
    } else if (user.role === 'Supervisor' && user.team) {
      return getUsersByTeam(user.team);
    } else if (user.team) {
      return getUsersByTeam(user.team);
    }
    return [];
  };

  const teamMembers = getTeamMembers();
  const supervisor = user.supervisor ? users.find(u => u.name === user.supervisor) : null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="w-6 h-6 text-cyan-400" />
          {user.role === 'CEO' ? 'Toda la Organización' : 
           user.role === 'Supervisor' ? 'Mi Equipo' : 'Mi Equipo'}
        </h2>
        <p className="text-slate-400">
          {user.role === 'CEO' 
            ? 'Vista completa del equipo de ventas de Vortexia'
            : user.role === 'Supervisor'
            ? 'Gestiona y supervisa a tu equipo de ventas'
            : `Equipo bajo supervisión de ${user.supervisor}`
          }
        </p>
      </div>

      {/* Supervisor Info (for team members) */}
      {supervisor && user.role !== 'CEO' && user.role !== 'Supervisor' && (
        <div>
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Tu Supervisor</h3>
          <Card>
            <div className="flex items-center gap-4">
              <img
                src={supervisor.avatar}
                alt={supervisor.name}
                className="w-16 h-16 rounded-full border-2 border-purple-500"
              />
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white">{supervisor.name}</h4>
                <p className="text-purple-400 font-medium">{supervisor.role}</p>
                <p className="text-slate-400 text-sm">{supervisor.email}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Team Members */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {user.role === 'Supervisor' ? 'Miembros del Equipo' : 'Compañeros de Equipo'}
          </h3>
          <span className="text-cyan-400 font-medium">
            {teamMembers.length} {teamMembers.length === 1 ? 'miembro' : 'miembros'}
          </span>
        </div>

        <div className="grid gap-4">
          {teamMembers.map(member => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              isCurrentUser={user.id === member.id}
            />
          ))}
        </div>
      </div>

      {/* Team Performance Summary */}
      {user.role === 'Supervisor' && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Resumen del Equipo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{teamMembers.length}</p>
              <p className="text-sm text-slate-400">Miembros</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">87%</p>
              <p className="text-sm text-slate-400">Rendimiento Promedio</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">145</p>
              <p className="text-sm text-slate-400">Ventas del Equipo</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">2°</p>
              <p className="text-sm text-slate-400">Ranking</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};