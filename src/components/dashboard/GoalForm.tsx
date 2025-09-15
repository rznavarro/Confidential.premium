import React, { useState } from 'react';
import { X, Target, DollarSign, MessageSquare, Calendar, User, FileText } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { Goal, GoalFormData, User as UserType } from '../../types';
import { createGoal } from '../../data/goals';
import { users, getUsersByTeam } from '../../data/users';

interface GoalFormProps {
  user: UserType;
  onClose: () => void;
  onGoalCreated: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ user, onClose, onGoalCreated }) => {
  const [formData, setFormData] = useState<GoalFormData>({
    assignedTo: '',
    salesTarget: 0,
    prospectingTarget: 0,
    prospectingStrategy: '',
    deadline: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get team members based on user role
  const getTeamMembers = (): UserType[] => {
    if (user.role === 'CEO') {
      return users.filter(u => u.id !== user.id);
    } else if (user.role === 'Supervisor' && user.team) {
      return getUsersByTeam(user.team);
    }
    return [];
  };

  const teamMembers = getTeamMembers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newGoal: Goal = {
      id: Date.now().toString(),
      ...formData,
      assignedBy: user.id,
      deadline: new Date(formData.deadline),
      status: 'active',
      createdAt: new Date()
    };

    createGoal(newGoal);
    onGoalCreated();
    onClose();
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof GoalFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Asignar Meta y Estrategia</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Asignar a
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <select
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              >
                <option value="">Seleccionar miembro del equipo</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Meta de Ventas (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  value={formData.salesTarget}
                  onChange={(e) => handleInputChange('salesTarget', Number(e.target.value))}
                  placeholder="50000"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Meta de Prospección (contactos)
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  value={formData.prospectingTarget}
                  onChange={(e) => handleInputChange('prospectingTarget', Number(e.target.value))}
                  placeholder="100"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Fecha Límite
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Estrategia de Prospección Recomendada
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <textarea
                value={formData.prospectingStrategy}
                onChange={(e) => handleInputChange('prospectingStrategy', e.target.value)}
                placeholder="Describe la estrategia recomendada para alcanzar las metas..."
                rows={4}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Notas Adicionales (Opcional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas adicionales, contexto o instrucciones específicas..."
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !formData.assignedTo || !formData.salesTarget || !formData.prospectingTarget || !formData.deadline || !formData.prospectingStrategy}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Asignando Meta...
              </>
            ) : (
              'Asignar Meta y Estrategia'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};