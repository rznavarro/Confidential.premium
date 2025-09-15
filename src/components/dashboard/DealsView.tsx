import React, { useState } from 'react';
import { Plus, Trash2, DollarSign, User, Mail, Phone, Calendar, Download, Send } from 'lucide-react';
import { Card, Button } from '../ui/Card';
import { User as UserType } from '../../types';
import { getDealsByUser, deleteDeal } from '../../data/metrics';
import { DealForm } from './DealForm';
import { generateDealPDF, downloadPDF, shareToWhatsApp } from '../../utils/pdfGenerator';

interface DealsViewProps {
  user: UserType;
}

export const DealsView: React.FC<DealsViewProps> = ({ user }) => {
  const [showDealForm, setShowDealForm] = useState(false);
  const [deals, setDeals] = useState(() => getDealsByUser(user.id));

  const refreshDeals = () => {
    setDeals(getDealsByUser(user.id));
  };

  const handleDeleteDeal = (dealId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este deal?')) {
      deleteDeal(dealId);
      refreshDeals();
    }
  };

  const handleDownloadDeal = async (deal: any) => {
    try {
      const blob = await generateDealPDF(deal, user);
      const filename = `Deal_${deal.clientName.replace(/\s+/g, '_')}_${deal.id}.pdf`;
      downloadPDF(blob, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    }
  };

  const handleShareDeal = async (deal: any) => {
    try {
      const blob = await generateDealPDF(deal, user);
      const filename = `Deal_${deal.clientName.replace(/\s+/g, '_')}_${deal.id}.pdf`;
      await shareToWhatsApp(blob, filename, 'deal');
    } catch (error) {
      console.error('Error sharing deal:', error);
      alert('Error al compartir el deal. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-green-400" />
            Mis Deals
          </h2>
          <p className="text-slate-400">
            Gestiona todos tus deals creados y su información
          </p>
        </div>
        <Button onClick={() => setShowDealForm(true)}>
          <Plus className="w-4 h-4" />
          Crear Deal
        </Button>
      </div>

      {deals.length > 0 ? (
        <div className="grid gap-4">
          {deals.map(deal => (
            <Card key={deal.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{deal.clientName}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{deal.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{deal.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{deal.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">
                      ${deal.servicePrice.toLocaleString()}
                    </p>
                    {deal.commission && (
                      <p className="text-sm text-purple-400">
                        Comisión: ${deal.commission.toLocaleString()}
                      </p>
                    )}
                    {deal.creationCost && (
                      <p className="text-sm text-amber-400">
                        Costo: ${deal.creationCost.toLocaleString()}
                      </p>
                    )}
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      deal.status === 'closed' ? 'bg-green-500/20 text-green-400' :
                      deal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {deal.status === 'closed' ? 'Cerrado' : 
                       deal.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadDeal(deal)}
                      className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors"
                      title="Descargar PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShareDeal(deal)}
                      className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                      title="Enviar por WhatsApp"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDeal(deal.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Eliminar Deal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hay deals creados</h3>
            <p className="text-slate-400 mb-6">
              Comienza creando tu primer deal para comenzar a trackear tus ventas
            </p>
            <Button onClick={() => setShowDealForm(true)}>
              <Plus className="w-4 h-4" />
              Crear mi primer deal
            </Button>
          </div>
        </Card>
      )}

      {showDealForm && (
        <DealForm
          user={user}
          onClose={() => setShowDealForm(false)}
          onDealCreated={refreshDeals}
        />
      )}
    </div>
  );
};