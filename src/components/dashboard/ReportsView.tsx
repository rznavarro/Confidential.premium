import React, { useState } from 'react';
import { Plus, Trash2, FileText, Linkedin, MessageSquare, TrendingUp, Calendar, Download, Send } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { User as UserType } from '../../types';
import { getReportsByUser, deleteReport } from '../../data/metrics';
import { ReportForm } from './ReportForm';
import { generateReportPDF, downloadPDF, shareToWhatsApp } from '../../utils/pdfGenerator';

interface ReportsViewProps {
  user: UserType;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ user }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reports, setReports] = useState(() => getReportsByUser(user.id));

  const refreshReports = () => {
    setReports(getReportsByUser(user.id));
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      deleteReport(reportId);
      refreshReports();
    }
  };

  const handleDownloadReport = async (report: any) => {
    try {
      const blob = await generateReportPDF(report, user);
      const filename = `Reporte_${report.period.replace(/\s+/g, '_')}_${report.id}.pdf`;
      downloadPDF(blob, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    }
  };

  const handleShareReport = async (report: any) => {
    try {
      const blob = await generateReportPDF(report, user);
      const filename = `Reporte_${report.period.replace(/\s+/g, '_')}_${report.id}.pdf`;
      await shareToWhatsApp(blob, filename, 'reporte');
    } catch (error) {
      console.error('Error sharing report:', error);
      alert('Error al compartir el reporte. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            Mis Reportes
          </h2>
          <p className="text-slate-400">
            Galería de todos tus reportes de actividad
          </p>
        </div>
        <Button onClick={() => setShowReportForm(true)}>
          <Plus className="w-4 h-4" />
          Crear Reporte
        </Button>
      </div>

      {reports.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map(report => (
            <Card key={report.id} className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{report.period}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{report.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownloadReport(report)}
                    className="p-1 text-cyan-400 hover:bg-cyan-500/20 rounded transition-colors"
                    title="Descargar PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShareReport(report)}
                    className="p-1 text-green-400 hover:bg-green-500/20 rounded transition-colors"
                    title="Enviar por WhatsApp"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    title="Eliminar Reporte"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-400">LinkedIn</span>
                  </div>
                  <span className="text-blue-400 font-semibold">{report.linkedinContacts}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-slate-400">Mensajes</span>
                  </div>
                  <span className="text-indigo-400 font-semibold">{report.messagesSent}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-400">Respuestas</span>
                  </div>
                  <span className="text-green-400 font-semibold">{report.responses}</span>
                </div>

                {report.meetings !== undefined && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-slate-400">Reuniones</span>
                    </div>
                    <span className="text-purple-400 font-semibold">{report.meetings}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50">
                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    Tasa de respuesta: {report.messagesSent > 0 ? Math.round((report.responses / report.messagesSent) * 100) : 0}%
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hay reportes creados</h3>
            <p className="text-slate-400 mb-6">
              Comienza creando tu primer reporte para trackear tu actividad
            </p>
            <Button onClick={() => setShowReportForm(true)}>
              <Plus className="w-4 h-4" />
              Crear mi primer reporte
            </Button>
          </div>
        </Card>
      )}

      {showReportForm && (
        <ReportForm
          user={user}
          onClose={() => setShowReportForm(false)}
          onReportCreated={refreshReports}
        />
      )}
    </div>
  );
};