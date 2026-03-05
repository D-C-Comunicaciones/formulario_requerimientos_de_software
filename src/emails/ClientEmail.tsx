import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ClientEmailProps {
  clientName: string;
}

export const ClientEmail = ({ clientName }: ClientEmailProps) => (
  <Html>
    <Head />
    <Preview>Hemos recibido tu formulario de requerimientos de software</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={heading}>✅ Formulario Recibido</Heading>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>
            Hola <strong>{clientName}</strong>,
          </Text>
          
          <Text style={paragraph}>
            Hemos recibido exitosamente tu formulario de requerimientos de software.
          </Text>
          
          <Text style={paragraph}>
            Nuestro equipo revisará la información proporcionada y nos pondremos en contacto contigo pronto para discutir los próximos pasos.
          </Text>
          
          <Text style={paragraph}>
            Adjunto encontrarás una copia en PDF de tu formulario para tus registros.
          </Text>

          <Section style={highlightBox}>
            <Text style={highlightText}>
              💡 <strong>Próximos pasos:</strong>
            </Text>
            <Text style={listItem}>
              1️⃣ Revisaremos tu solicitud en las próximas 24-48 horas
            </Text>
            <Text style={listItem}>
              2️⃣ Te contactaremos para agendar una reunión inicial
            </Text>
            <Text style={listItem}>
              3️⃣ Discutiremos el alcance y presupuesto del proyecto
            </Text>
          </Section>

          <Text style={paragraph}>
            <strong>¡Gracias por confiar en nosotros!</strong>
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Este es un correo automático, por favor no respondas a este mensaje.
          </Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} Formulario de Requerimientos. Todos los derechos reservados.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ClientEmail;

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
  backgroundColor: '#4F46E5',
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

const greeting = {
  fontSize: '18px',
  lineHeight: '28px',
  marginBottom: '16px',
  color: '#1f2937',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '16px',
  color: '#4b5563',
};

const highlightBox = {
  backgroundColor: '#EEF2FF',
  borderLeft: '4px solid #4F46E5',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '24px',
  marginBottom: '24px',
};

const highlightText = {
  fontSize: '16px',
  color: '#4F46E5',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const listItem = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#4b5563',
  margin: '8px 0',
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
