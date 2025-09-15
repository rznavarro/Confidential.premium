import React from 'react';
import { ArrowRight, Users } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { teams } from '../../data/teams';
import { User } from '../../types';

interface TeamSelectionProps {
  user: User;
  onSelectTeam: (teamId: string) => void;
}

export const TeamSelection: React.FC<TeamSelectionProps> = ({ user, onSelectTeam }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Selecciona tu equipo de trabajo
          </h1>
          <p className="text-slate-400">
            Hola <span className="text-cyan-400 font-semibold">{user.name}</span>, 
            elige el equipo al que quieres acceder
          </p>
        </div>

        <div className="grid gap-4 md:gap-6">
          {teams.map((team) => (
            <Card key={team.id} hover onClick={() => onSelectTeam(team.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${team.color}20`, border: `2px solid ${team.color}` }}
                  >
                    {team.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {team.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>Supervisor: {team.supervisor}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {team.members.length} {team.members.length === 1 ? 'miembro' : 'miembros'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </Card>
          ))}
        </div>

        {user.role === 'Supervisor' && (
          <div className="mt-6">
            <Card className="border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <span className="text-amber-400 text-lg">👨‍💼</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Vista de Supervisor</h3>
                  <p className="text-slate-400 text-sm">Accede directamente sin código de equipo</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};