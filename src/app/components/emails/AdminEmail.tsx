import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface AdminEmailProps {
  clientName: string;
  clientEmail: string;
  submittedAt: string;
}

export const AdminEmail = ({ 
  clientName, 
  clientEmail,
  submittedAt 
}: AdminEmailProps) => (
  <Html>
    <Head />
    <Preview>Nuevo formulario recibido de {clientName}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={heading}>📋 Nuevo Formulario Recibido</Heading>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={intro}>
            Se ha recibido un nuevo formulario de requerimientos de software.
          </Text>

          {/* Info Box */}
          <Section style={infoBox}>
            <Text style={infoTitle}>Información del Cliente</Text>
            <Hr style={divider} />
            
            <table style={infoTable}>
              <tbody>
                <tr>
                  <td style={labelCell}>
                    <Text style={label}>👤 Cliente:</Text>
                  </td>
                  <td style={valueCell}>
                    <Text style={value}>{clientName}</Text>
                  </td>
                </tr>
                <tr>
                  <td style={labelCell}>
                    <Text style={label}>📧 Email:</Text>
                  </td>
                  <td style={valueCell}>
                    <Text style={value}>{clientEmail}</Text>
                  </td>
                </tr>
                <tr>
                  <td style={labelCell}>
                    <Text style={label}>📅 Fecha:</Text>
                  </td>
                  <td style={valueCell}>
                    <Text style={value}>{submittedAt}</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section style={actionBox}>
            <Text style={actionText}>
              ⚡ <strong>Acción requerida:</strong>
            </Text>
            <Text style={actionItem}>
              • Revisa el PDF adjunto con todos los detalles del formulario
            </Text>
            <Text style={actionItem}>
              • Contacta al cliente en las próximas 24-48 horas
            </Text>
            <Text style={actionItem}>
              • Agenda una reunión inicial para discutir el proyecto
            </Text>
          </Section>

          <Text style={paragraph}>
            El documento PDF con todos los detalles está adjunto a este correo.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Sistema automatizado de formularios
          </Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} Formulario de Requerimientos
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AdminEmail;

// ─────────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────────

const main = {
  backgroundColor: '#f3f4f6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  marginTop: '40px',
  marginBottom: '40px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const header = {
  backgroundColor: '#059669',
  padding: '40px 30px',
  textAlign: 'center' as const,
};

const heading = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
  lineHeight: '1.2',
};

const content = {
  padding: '40px 30px',
};

const intro = {
  fontSize: '17px',
  lineHeight: '28px',
  marginBottom: '24px',
  color: '#1f2937',
  fontWeight: '500',
};

const infoBox = {
  backgroundColor: '#f9fafb',
  border: '2px solid #059669',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '24px',
};

const infoTitle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#059669',
  margin: '0 0 16px 0',
};

const divider = {
  borderColor: '#d1d5db',
  margin: '16px 0',
};

const infoTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const labelCell = {
  paddingRight: '16px',
  paddingTop: '8px',
  paddingBottom: '8px',
  verticalAlign: 'top' as const,
  width: '120px',
};

const valueCell = {
  paddingTop: '8px',
  paddingBottom: '8px',
  verticalAlign: 'top' as const,
};

const label = {
  fontSize: '14px',
  color: '#6b7280',
  fontWeight: '600',
  margin: '0',
};

const value = {
  fontSize: '15px',
  color: '#1f2937',
  fontWeight: '500',
  margin: '0',
};

const actionBox = {
  backgroundColor: '#FEF3C7',
  borderLeft: '4px solid #F59E0B',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '24px',
  marginBottom: '24px',
};

const actionText = {
  fontSize: '16px',
  color: '#92400E',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const actionItem = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#78350F',
  margin: '6px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '16px',
  color: '#4b5563',
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '30px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e5e7eb',
};

const footerText = {
  fontSize: '13px',
  lineHeight: '20px',
  color: '#6b7280',
  margin: '4px 0',
};
