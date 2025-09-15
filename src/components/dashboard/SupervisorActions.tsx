import React, { useState } from 'react';
import { Eye, Users, TrendingUp, MessageSquare, Target, X } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { User } from '../../types';
import { getUsersByTeam } from '../../data/users';
import { generateUserMetrics } from '../../data/metrics';
import { getGoalsByAssignee } from '../../data/goals';

interface SupervisorActionsProps {
  user: User;
}

const SupervisedMemberCard: React.FC<{ member: User; onSupervise: () => void }> = ({ member, onSupervise }) => {
  const metrics = generateUserMetrics(member.id, member.role);
  
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-12 h-12 rounded-full border-2 border-slate-600"
          />
          <div>
            <h3 className="font-semibold text-white">{member.name}</h3>
            <p className="text-sm text-slate-400">{member.role}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span>Contactos: {metrics.linkedinContacts}</span>
              <span>Ganancias: ${metrics.personalEarnings.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onSupervise}>
          <Eye className="w-4 h-4" />
          Supervisar
        </Button>
      </div>
    </Card>
  );
};

const SupervisionModal: React.FC<{ 
  member: User; 
  onClose: () => void 
}> = ({ member, onClose }) => {
  const metrics = generateUserMetrics(member.id, member.role);
  const memberGoals = getGoalsByAssignee(member.id);
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-16 h-16 rounded-full border-2 border-slate-600"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{member.name}</h2>
              <p className="text-slate-400">{member.role}</p>
              <p className="text-sm text-slate-500">{member.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Metrics Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Métricas Actuales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <p className="text-xl font-bold text-cyan-400">{metrics.linkedinContacts}</p>
                <p className="text-xs text-slate-400">Contactos LinkedIn</p>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <p className="text-xl font-bold text-indigo-400">{metrics.messagesSent}</p>
                <p className="text-xs text-slate-400">Mensajes Enviados</p>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <p className="text-xl font-bold text-green-400">{metrics.responses}</p>
                <p className="text-xs text-slate-400">Respuestas</p>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <p className="text-xl font-bold text-purple-400">${metrics.personalEarnings.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Ganancias</p>
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Objetivos Asignados</h3>
            {memberGoals.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {memberGoals.map(goal => (
                  <div key={goal.id} className="p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-white">
                          ${goal.salesTarget.toLocaleString()} | {goal.prospectingTarget} contactos
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        goal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        new Date() > goal.deadline ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {goal.status === 'completed' ? 'Completado' :
                         new Date() > goal.deadline ? 'Vencido' : 'Activo'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {goal.prospectingStrategy}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Vence: {goal.deadline.toLocaleDateString('es-ES')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-800/30 rounded-lg">
                <Target className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Sin objetivos asignados</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1">
            <MessageSquare className="w-4 h-4" />
            Enviar Mensaje
          </Button>
          <Button variant="secondary" className="flex-1">
            <TrendingUp className="w-4 h-4" />
            Ver Historial
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const SupervisorActions: React.FC<SupervisorActionsProps> = ({ user }) => {
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const teamMembers = user.team ? getUsersByTeam(user.team) : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          Supervisión del Equipo
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Supervisa el rendimiento individual de cada miembro de tu equipo
        </p>
      </div>

      <div className="grid gap-4">
        {teamMembers.map(member => (
          <SupervisedMemberCard
            key={member.id}
            member={member}
            onSupervise={() => setSelectedMember(member)}
          />
        ))}
      </div>

      {selectedMember && (
        <SupervisionModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};