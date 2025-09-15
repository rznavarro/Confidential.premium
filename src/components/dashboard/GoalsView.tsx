import React, { useState } from 'react';
import { Target, Plus, Calendar, DollarSign, MessageSquare, User, CheckCircle, Clock, AlertTriangle, Trash2, Eye } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { User as UserType } from '../../types';
import { getGoalsByAssigner, getGoalsByAssignee, deleteGoal, updateGoalStatus } from '../../data/goals';
import { users } from '../../data/users';
import { GoalForm } from './GoalForm';

interface GoalsViewProps {
  user: UserType;
}

const GoalCard: React.FC<{ 
  goal: any; 
  user: UserType; 
  onDelete: (id: string) => void; 
  onStatusChange: (id: string, status: any) => void;
  showAssignee?: boolean;
}> = ({ goal, user, onDelete, onStatusChange, showAssignee = true }) => {
  const [showDetails, setShowDetails] = useState(false);
  const assignedUser = users.find(u => u.id === goal.assignedTo);
  const assigner = users.find(u => u.id === goal.assignedBy);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'overdue':
        return 'from-red-500 to-rose-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'overdue':
        return 'Vencida';
      default:
        return 'Activa';
    }
  };

  const isOverdue = new Date() > goal.deadline && goal.status === 'active';
  const actualStatus = isOverdue ? 'overdue' : goal.status;

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(actualStatus)} opacity-5`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${getStatusColor(actualStatus)}`}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              {showAssignee && assignedUser && (
                <h3 className="text-lg font-semibold text-white">{assignedUser.name}</h3>
              )}
              {!showAssignee && assigner && (
                <h3 className="text-lg font-semibold text-white">Meta de {assigner.name}</h3>
              )}
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(actualStatus)}
                <span className="text-sm text-slate-400">{getStatusText(actualStatus)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors"
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </button>
            {(user.role === 'CEO' || user.role === 'Supervisor') && (
              <button
                onClick={() => onDelete(goal.id)}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Eliminar meta"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-400">${goal.salesTarget.toLocaleString()}</p>
            <p className="text-xs text-slate-400">Meta de Ventas</p>
          </div>
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <MessageSquare className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-purple-400">{goal.prospectingTarget}</p>
            <p className="text-xs text-slate-400">Contactos Meta</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <Calendar className="w-4 h-4" />
          <span>Fecha límite: {goal.deadline.toLocaleDateString('es-ES')}</span>
        </div>

        {showDetails && (
          <div className="space-y-4 pt-4 border-t border-slate-700/50">
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Estrategia de Prospección:</h4>
              <p className="text-sm text-slate-400 bg-slate-800/30 p-3 rounded-lg">
                {goal.prospectingStrategy}
              </p>
            </div>
            
            {goal.notes && (
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Notas Adicionales:</h4>
                <p className="text-sm text-slate-400 bg-slate-800/30 p-3 rounded-lg">
                  {goal.notes}
                </p>
              </div>
            )}

            <div className="text-xs text-slate-500">
              Creada el {goal.createdAt.toLocaleDateString('es-ES')}
            </div>

            {goal.status === 'active' && (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onStatusChange(goal.id, 'completed')}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Marcar como Completada
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export const GoalsView: React.FC<GoalsViewProps> = ({ user }) => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [assignedGoals, setAssignedGoals] = useState(() => getGoalsByAssigner(user.id));
  const [myGoals, setMyGoals] = useState(() => getGoalsByAssignee(user.id));

  const refreshGoals = () => {
    setAssignedGoals(getGoalsByAssigner(user.id));
    setMyGoals(getGoalsByAssignee(user.id));
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta meta?')) {
      deleteGoal(goalId);
      refreshGoals();
    }
  };

  const handleStatusChange = (goalId: string, status: any) => {
    updateGoalStatus(goalId, status);
    refreshGoals();
  };

  const canAssignGoals = user.role === 'CEO' || user.role === 'Supervisor';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <Target className="w-6 h-6 text-amber-400" />
            {user.role === 'CEO' ? 'Gestión de Objetivos Corporativos' : 
             user.role === 'Supervisor' ? 'Gestión de Objetivos del Equipo' : 
             'Mis Objetivos y Metas'}
          </h2>
          <p className="text-slate-400">
            {user.role === 'CEO' 
              ? 'Asigna y supervisa objetivos para toda la organización'
              : user.role === 'Supervisor'
              ? 'Establece metas y estrategias para tu equipo'
              : 'Revisa tus objetivos asignados y progreso'
            }
          </p>
        </div>
        {canAssignGoals && (
          <Button onClick={() => setShowGoalForm(true)}>
            <Plus className="w-4 h-4" />
            Asignar Meta
          </Button>
        )}
      </div>

      {/* My Goals (for non-CEO/Supervisor users) */}
      {!canAssignGoals && myGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Mis Objetivos Asignados</h3>
          <div className="grid gap-4">
            {myGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                user={user}
                onDelete={handleDeleteGoal}
                onStatusChange={handleStatusChange}
                showAssignee={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Assigned Goals (for CEO/Supervisors) */}
      {canAssignGoals && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {user.role === 'CEO' ? 'Objetivos Asignados a la Organización' : 'Objetivos Asignados a mi Equipo'}
          </h3>
          {assignedGoals.length > 0 ? (
            <div className="grid gap-4">
              {assignedGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  user={user}
                  onDelete={handleDeleteGoal}
                  onStatusChange={handleStatusChange}
                  showAssignee={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No hay objetivos asignados</h3>
                <p className="text-slate-400 mb-6">
                  Comienza asignando objetivos y estrategias a tu equipo
                </p>
                <Button onClick={() => setShowGoalForm(true)}>
                  <Plus className="w-4 h-4" />
                  Asignar primera meta
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* My Goals for CEO/Supervisors */}
      {canAssignGoals && myGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Mis Objetivos Personales</h3>
          <div className="grid gap-4">
            {myGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                user={user}
                onDelete={handleDeleteGoal}
                onStatusChange={handleStatusChange}
                showAssignee={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Goal Statistics */}
      {canAssignGoals && assignedGoals.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Estadísticas de Objetivos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{assignedGoals.length}</p>
              <p className="text-sm text-slate-400">Total Asignados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {assignedGoals.filter(g => g.status === 'completed').length}
              </p>
              <p className="text-sm text-slate-400">Completados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {assignedGoals.filter(g => g.status === 'active').length}
              </p>
              <p className="text-sm text-slate-400">Activos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">
                {assignedGoals.filter(g => new Date() > g.deadline && g.status === 'active').length}
              </p>
              <p className="text-sm text-slate-400">Vencidos</p>
            </div>
          </div>
        </Card>
      )}

      {showGoalForm && (
        <GoalForm
          user={user}
          onClose={() => setShowGoalForm(false)}
          onGoalCreated={refreshGoals}
        />
      )}
    </div>
  );
};