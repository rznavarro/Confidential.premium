import React, { useState } from 'react';
import { X, Linkedin, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { Report, ReportFormData, User as UserType } from '../../types';
import { createReport } from '../../data/metrics';

interface ReportFormProps {
  user: UserType;
  onClose: () => void;
  onReportCreated: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ user, onClose, onReportCreated }) => {
  const [formData, setFormData] = useState<ReportFormData>({
    linkedinContacts: 0,
    messagesSent: 0,
    responses: 0,
    meetings: user.role === 'CEO' ? 0 : undefined,
    period: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newReport: Report = {
      id: Date.now().toString(),
      ...formData,
      createdBy: user.id,
      createdAt: new Date()
    };

    createReport(newReport);
    onReportCreated();
    onClose();
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof ReportFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Crear Nuevo Reporte</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Período del Reporte
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={formData.period}
                onChange={(e) => handleInputChange('period', e.target.value)}
                placeholder="Ej: Enero 2024, Semana 1"
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contactos de LinkedIn
            </label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="number"
                value={formData.linkedinContacts}
                onChange={(e) => handleInputChange('linkedinContacts', Number(e.target.value))}
                placeholder="0"
                min="0"
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Mensajes Enviados
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="number"
                value={formData.messagesSent}
                onChange={(e) => handleInputChange('messagesSent', Number(e.target.value))}
                placeholder="0"
                min="0"
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Respuestas Recibidas
            </label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="number"
                value={formData.responses}
                onChange={(e) => handleInputChange('responses', Number(e.target.value))}
                placeholder="0"
                min="0"
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              />
            </div>
          </div>

          {user.role === 'CEO' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Reuniones
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  value={formData.meetings || 0}
                  onChange={(e) => handleInputChange('meetings', Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !formData.period}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando Reporte...
              </>
            ) : (
              'Crear Reporte'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};