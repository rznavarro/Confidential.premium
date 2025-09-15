import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, MessageSquare, Users, Calendar, Target, Plus, Linkedin, FileText } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { User } from '../../types';
import { generateUserMetrics, generateTeamMetrics, getCompanyMetrics, getDealsByUser } from '../../data/metrics';
import { DealForm } from './DealForm';
import { ReportForm } from './ReportForm';
import { SupervisorActions } from './SupervisorActions';

interface MetricsViewProps {
  user: User;
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}> = ({ title, value, subtitle, icon, color, trend }) => (
  <Card className="relative overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
        {icon}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-green-400 text-sm">
          <TrendingUp className="w-4 h-4" />
          +{trend}%
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-sm text-slate-400">{title}</p>
    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    
    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5 -z-10`} />
  </Card>
);

export const MetricsView: React.FC<MetricsViewProps> = ({ user }) => {
  const [showDealForm, setShowDealForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [metrics, setMetrics] = useState(() => generateUserMetrics(user.id, user.role));
  const [teamEarnings, setTeamEarnings] = useState<number>(0);

  useEffect(() => {
    if (user.team && (user.role === 'Supervisor' || (user.role !== 'CEO' && user.team !== 'equipo-ceo'))) {
      setTeamEarnings(generateTeamMetrics(user.team));
    }
  }, [user.team, user.role]);

  const refreshMetrics = () => {
    setMetrics(generateUserMetrics(user.id, user.role));
    if (user.team && (user.role === 'Supervisor' || (user.role !== 'CEO' && user.team !== 'equipo-ceo'))) {
      setTeamEarnings(generateTeamMetrics(user.team));
    }
  };

  const getMetricsTitle = () => {
    switch (user.role) {
      case 'CEO':
        return 'Métricas Ejecutivas';
      case 'Supervisor':
        return 'Métricas de Supervisión';
      default:
        return 'Mis Métricas de Ventas';
    }
  };

  const userDeals = getDealsByUser(user.id);
  const companyMetrics = user.role === 'CEO' ? getCompanyMetrics() : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{getMetricsTitle()}</h2>
          <p className="text-slate-400">
            {user.role === 'CEO' 
              ? 'Vista ejecutiva del rendimiento general de Vortexia'
              : user.role === 'Supervisor'
              ? 'Tu rendimiento y el de tu equipo'
              : 'Tu rendimiento individual este mes'
            }
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowReportForm(true)}>
            <FileText className="w-4 h-4" />
            Crear Reporte
          </Button>
          <Button onClick={() => setShowDealForm(true)}>
            <Plus className="w-4 h-4" />
            Crear Deal
          </Button>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Contactos LinkedIn"
          value={companyMetrics?.linkedinContacts || metrics.linkedinContacts}
          subtitle="Total acumulado"
          icon={<Linkedin className="w-6 h-6 text-white" />}
          color="from-blue-500 to-cyan-500"
          trend={8}
        />
        
        <MetricCard
          title="Mensajes Enviados"
          value={companyMetrics?.messagesSent || metrics.messagesSent}
          subtitle="Este mes"
          icon={<MessageSquare className="w-6 h-6 text-white" />}
          color="from-indigo-500 to-purple-500"
          trend={12}
        />
        
        <MetricCard
          title="Respuestas Recibidas"
          value={companyMetrics?.responses || metrics.responses}
          subtitle="Tasa de respuesta"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="from-green-500 to-emerald-500"
          trend={5}
        />
        
        <MetricCard
          title="Ganancias Personales"
          value={`$${(companyMetrics?.personalEarnings || metrics.personalEarnings).toLocaleString()}`}
          subtitle="Total acumulado"
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="from-amber-500 to-orange-500"
          trend={15}
        />
      </div>

      {/* CEO Specific Metrics */}
      {user.role === 'CEO' && companyMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Reuniones"
            value={companyMetrics.meetings || 0}
            subtitle="Este mes"
            icon={<Calendar className="w-6 h-6 text-white" />}
            color="from-purple-500 to-pink-500"
            trend={10}
          />
          
          <MetricCard
            title="Ventas Totales"
            value={companyMetrics.sales || 0}
            subtitle="Deals cerrados"
            icon={<Target className="w-6 h-6 text-white" />}
            color="from-cyan-500 to-blue-500"
            trend={18}
          />
          
          <MetricCard
            title="Revenue Diario"
            value={`$${(companyMetrics.dailyRevenue || 0).toLocaleString()}`}
            subtitle={`Mensual: $${(companyMetrics.monthlyRevenue || 0).toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            color="from-green-500 to-teal-500"
            trend={22}
          />
        </div>
      )}

      {/* Team Earnings for Supervisors and Supervised Vendors */}
      {(user.role === 'Supervisor' || (user.role !== 'CEO' && user.team !== 'equipo-ceo')) && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Ganancias del Equipo
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400">${metrics.personalEarnings.toLocaleString()}</p>
              <p className="text-slate-400">Mis Ganancias</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">${teamEarnings.toLocaleString()}</p>
              <p className="text-slate-400">Ganancias del Equipo</p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Deals */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Deals Recientes</h3>
        {userDeals.length > 0 ? (
          <div className="space-y-3">
            {userDeals.slice(-5).map(deal => (
              <div key={deal.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">{deal.clientName}</p>
                  <p className="text-sm text-slate-400">{deal.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">${deal.servicePrice.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{deal.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">No hay deals registrados aún</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => setShowDealForm(true)}
            >
              Crear tu primer deal
            </Button>
          </div>
        )}
      </Card>

      {/* Supervisor Actions */}
      {user.role === 'Supervisor' && (
        <SupervisorActions user={user} />
      )}

      {/* Deal Form Modal */}
      {showDealForm && (
        <DealForm
          user={user}
          onClose={() => setShowDealForm(false)}
          onDealCreated={refreshMetrics}
        />
      )}

      {/* Report Form Modal */}
      {showReportForm && (
        <ReportForm
          user={user}
          onClose={() => setShowReportForm(false)}
          onReportCreated={refreshMetrics}
        />
      )}
    </div>
  );
};