import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Deal, Report, User } from '../types';

export const generateReportPDF = async (report: Report, user: User): Promise<Blob> => {
  // Create a temporary div for the report content
  const reportElement = document.createElement('div');
  reportElement.style.width = '800px';
  reportElement.style.padding = '40px';
  reportElement.style.backgroundColor = '#ffffff';
  reportElement.style.fontFamily = 'Inter, sans-serif';
  reportElement.style.color = '#000000';
  reportElement.style.position = 'absolute';
  reportElement.style.left = '-9999px';
  reportElement.style.top = '0';

  // Create the report content HTML
  reportElement.innerHTML = `
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #4338ca, #06b6d4); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 20px; font-weight: bold;">V</span>
        </div>
        <h1 style="font-size: 32px; font-weight: 800; margin: 0; background: linear-gradient(135deg, #4338ca, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VORTEXIA</h1>
      </div>
      <h2 style="font-size: 24px; font-weight: 600; margin: 0; color: #1e293b;">REPORTE DE ACTIVIDAD</h2>
      <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0;">Sistema de Gestión de Ventas</p>
    </div>

    <div style="background: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
      <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: #1e293b;">Información del Reporte</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Período:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${report.period}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Fecha de Creación:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${report.createdAt.toLocaleDateString('es-ES')}</p>
        </div>
      </div>
    </div>

    <div style="background: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
      <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: #1e293b;">Datos del Vendedor</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Nombre:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${user.name}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Cargo:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${user.role}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Email:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${user.email}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Código:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${user.accessCode}</p>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 32px;">
      <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 20px 0; color: #1e293b;">Métricas de Actividad</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #06b6d4); padding: 20px; border-radius: 12px; color: white;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 16px;">👥</span>
            </div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 500; opacity: 0.9;">Contactos LinkedIn</h4>
          </div>
          <p style="margin: 0; font-size: 32px; font-weight: 700;">${report.linkedinContacts}</p>
        </div>

        <div style="background: linear-gradient(135deg, #8b5cf6, #a855f7); padding: 20px; border-radius: 12px; color: white;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 16px;">💬</span>
            </div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 500; opacity: 0.9;">Mensajes Enviados</h4>
          </div>
          <p style="margin: 0; font-size: 32px; font-weight: 700;">${report.messagesSent}</p>
        </div>

        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 12px; color: white;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 16px;">📈</span>
            </div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 500; opacity: 0.9;">Respuestas Recibidas</h4>
          </div>
          <p style="margin: 0; font-size: 32px; font-weight: 700;">${report.responses}</p>
        </div>

        ${report.meetings !== undefined ? `
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; border-radius: 12px; color: white;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 16px;">📅</span>
            </div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 500; opacity: 0.9;">Reuniones</h4>
          </div>
          <p style="margin: 0; font-size: 32px; font-weight: 700;">${report.meetings}</p>
        </div>
        ` : ''}
      </div>
    </div>

    <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 32px;">
      <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 12px 0; color: #1e293b;">Análisis de Rendimiento</h3>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 14px; color: #64748b;">Tasa de Respuesta:</span>
        <span style="font-size: 18px; font-weight: 700; color: #059669;">
          ${report.messagesSent > 0 ? Math.round((report.responses / report.messagesSent) * 100) : 0}%
        </span>
      </div>
    </div>

    <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
        Documento generado automáticamente por el Sistema Vortexia
      </p>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">
        ${new Date().toLocaleDateString('es-ES')} - ${new Date().toLocaleTimeString('es-ES')}
      </p>
    </div>
  `;

  document.body.appendChild(reportElement);

  try {
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output('blob');
  } finally {
    document.body.removeChild(reportElement);
  }
};

export const generateDealPDF = async (deal: Deal, user: User): Promise<Blob> => {
  const reportElement = document.createElement('div');
  reportElement.style.width = '800px';
  reportElement.style.padding = '40px';
  reportElement.style.backgroundColor = '#ffffff';
  reportElement.style.fontFamily = 'Inter, sans-serif';
  reportElement.style.color = '#000000';
  reportElement.style.position = 'absolute';
  reportElement.style.left = '-9999px';
  reportElement.style.top = '0';

  const profit = user.role === 'CEO' 
    ? deal.servicePrice - (deal.creationCost || 0)
    : deal.commission || 0;

  reportElement.innerHTML = `
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #4338ca, #06b6d4); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 20px; font-weight: bold;">V</span>
        </div>
        <h1 style="font-size: 32px; font-weight: 800; margin: 0; background: linear-gradient(135deg, #4338ca, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">VORTEXIA</h1>
      </div>
      <h2 style="font-size: 24px; font-weight: 600; margin: 0; color: #1e293b;">DEAL COMERCIAL</h2>
      <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0;">Sistema de Gestión de Ventas</p>
    </div>

    <div style="background: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
      <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: #1e293b;">Información del Deal</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">ID del Deal:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">#${deal.id}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Fecha de Creación:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${deal.createdAt.toLocaleDateString('es-ES')}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Estado:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #059669;">
            ${deal.status === 'closed' ? 'Cerrado' : deal.status === 'pending' ? 'Pendiente' : 'Cancelado'}
          </p>
        </div>
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Creado por:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${user.name}</p>
        </div>
      </div>
    </div>

    <div style="background: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
      <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 16px 0; color: #1e293b;">Información del Cliente</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Nombre:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${deal.clientName}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Email:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${deal.email}</p>
        </div>
        <div style="grid-column: 1 / -1;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Teléfono:</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${deal.phone}</p>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 32px;">
      <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 20px 0; color: #1e293b;">Detalles Financieros</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 12px; color: white;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 16px;">💰</span>
            </div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 500; opacity: 0.9;">Precio del Servicio</h4>
          </div>
          <p style="margin: 0; font-size: 28px; font-weight: 700;">$${deal.servicePrice.toLocaleString('es-ES')}</p>
        </div>

        ${deal.creationCost !== undefined ? `
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; border-radius: 12px; color: white;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 16px;">🔧</span>
            </div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 500; opacity: 0.9;">Costo de Creación</h4>
          </div>
          <p style="margin: 0; font-size: 28px; font-weight: 700;">$${deal.creationCost.toLocaleString('es-ES')}</p>
        </div>
        ` : ''}

        ${deal.commission !== undefined ? `
        <div style="background: linear-gradient(135deg, #8b5cf6, #a855f7); padding: 20px; border-radius: 12px; color: white;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 16px;">💎</span>
            </div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 500; opacity: 0.9;">Comisión</h4>
          </div>
          <p style="margin: 0; font-size: 28px; font-weight: 700;">$${deal.commission.toLocaleString('es-ES')}</p>
        </div>
        ` : ''}
      </div>
    </div>

    <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 32px;">
      <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 12px 0; color: #1e293b;">Resumen Financiero</h3>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 14px; color: #64748b;">
          ${user.role === 'CEO' ? 'Ganancia Neta:' : 'Ganancia Personal:'}
        </span>
        <span style="font-size: 24px; font-weight: 700; color: #059669;">
          $${profit.toLocaleString('es-ES')}
        </span>
      </div>
    </div>

    <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
        Documento generado automáticamente por el Sistema Vortexia
      </p>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">
        ${new Date().toLocaleDateString('es-ES')} - ${new Date().toLocaleTimeString('es-ES')}
      </p>
    </div>
  `;

  document.body.appendChild(reportElement);

  try {
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output('blob');
  } finally {
    document.body.removeChild(reportElement);
  }
};

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const shareToWhatsApp = async (blob: Blob, filename: string, type: 'reporte' | 'deal') => {
  try {
    // Convert blob to base64 for sharing
    const reader = new FileReader();
    reader.onload = () => {
      const message = `Hola! Te comparto mi ${type} de Vortexia: ${filename}. 
      
📊 Documento generado desde el Sistema de Gestión de Ventas Vortexia
🕒 ${new Date().toLocaleDateString('es-ES')} - ${new Date().toLocaleTimeString('es-ES')}

¡Saludos!`;

      const whatsappUrl = `https://wa.me/56939054197?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error);
    alert('Error al compartir por WhatsApp. Por favor, intenta nuevamente.');
  }
};