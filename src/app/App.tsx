import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';

import type { FormData } from '@/types/form';
import { initialFormData } from '@/types/form';
import { generatePDF } from '@utils/pdfGenerator';
import { sendFormEmail } from '@utils/emailService';
import { hasValidAccess } from '@utils/accessService';

import { AccessCodeScreen } from './components/AccessCodeScreen';
import { ProgressBar } from './components/ProgressBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StepGeneralInfo } from './components/StepGeneralInfo';
import { StepProblem } from './components/StepProblem';
import { StepObjective } from './components/StepObjective';
import { StepFunctionalities } from './components/StepFunctionalities';
import { StepUsers } from './components/StepUsers';
import { StepReferences } from './components/StepReferences';
import { StepBudget } from './components/StepBudget';
import { StepReview } from './components/StepReview';
import { ConfirmationScreen } from './components/ConfirmationScreen';

const TOTAL_STEPS = 8;

export default function App() {
  const [hasAccess, setHasAccess] = useState(hasValidAccess());
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0=welcome, 1-8=form, 9=confirmation
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [emailStatus, setEmailStatus] = useState<'sent' | 'failed' | 'pending'>('pending');

  const update = (updates: Partial<FormData>) =>
    setFormData(prev => ({ ...prev, ...updates }));

  const next = () => {
    // Si está en el WelcomeScreen (paso 0) y no tiene acceso, mostrar modal
    if (currentStep === 0 && !hasAccess) {
      setShowAccessModal(true);
      return;
    }
    setCurrentStep(s => s + 1);
  };

  const back = () => setCurrentStep(s => Math.max(0, s - 1));
  const goTo = (step: number) => setCurrentStep(step);

  const handleAccessGranted = () => {
    setHasAccess(true);
    setShowAccessModal(false);
    setCurrentStep(1); // Ir al primer paso del formulario
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Generar PDF (async, sin abrir pestaña)
      const blob = await generatePDF(formData);
      setPdfBlob(blob);

      // 2. Enviar email
      try {
        const emailResult = await sendFormEmail({
          clientEmail: formData.email,
          clientName: formData.fullName,
          company: formData.company,
          pdfBlob: blob,
        });

        if (emailResult.success) {
          setEmailStatus('sent');
          toast.success('Formulario enviado y correo despachado correctamente.');
        } else {
          setEmailStatus('failed');
          toast.error(emailResult.message || 'El documento se generó, pero no se pudo enviar el correo.');
        }
      } catch (emailErr) {
        console.error('Error enviando correo:', emailErr);
        setEmailStatus('failed');
        toast.error('El documento se generó, pero falló el envío del correo.');
      }

      // 3. Ir directo a pantalla de confirmación
      setCurrentStep(9);
    } catch (err) {
      console.error('Error al procesar formulario:', err);
      const message = err instanceof Error && err.message
        ? err.message
        : 'Hubo un error al generar el documento. Por favor intenta de nuevo.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setFormData(initialFormData);
    setPdfBlob(null);
    setEmailStatus('pending');
  };

  /* ── WELCOME ── */
  if (currentStep === 0) {
    return (
      <>
        <WelcomeScreen onStart={next} />
        {showAccessModal && (
          <AccessCodeScreen 
            onAccessGranted={handleAccessGranted}
            onClose={() => setShowAccessModal(false)}
          />
        )}
        <Toaster position="bottom-center" richColors />
      </>
    );
  }

  /* ── CONFIRMATION ── */
  if (currentStep === 9) {
    return (
      <>
        <ConfirmationScreen
          pdfBlob={pdfBlob}
          clientEmail={formData.email}
          emailStatus={emailStatus}
          onRestart={handleRestart}
        />
        <Toaster position="bottom-center" richColors />
      </>
    );
  }

  /* ── FORM STEPS ── */
  const shared = { data: formData, onChange: update };

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* Sticky progress bar */}
        <div className="sticky top-0 z-40">
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>

        {/* Step content */}
        <div className="py-4">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepGeneralInfo
                key={1} {...shared}
                onNext={next}
                onBack={() => setCurrentStep(0)}
              />
            )}
            {currentStep === 2 && (
              <StepProblem key={2} {...shared} onNext={next} onBack={back} />
            )}
            {currentStep === 3 && (
              <StepObjective key={3} {...shared} onNext={next} onBack={back} />
            )}
            {currentStep === 4 && (
              <StepFunctionalities key={4} {...shared} onNext={next} onBack={back} />
            )}
            {currentStep === 5 && (
              <StepUsers key={5} {...shared} onNext={next} onBack={back} />
            )}
            {currentStep === 6 && (
              <StepReferences key={6} {...shared} onNext={next} onBack={back} />
            )}
            {currentStep === 7 && (
              <StepBudget key={7} {...shared} onNext={next} onBack={back} />
            )}
            {currentStep === 8 && (
              <StepReview
                key={8}
                data={formData}
                onEdit={goTo}
                onSubmit={handleSubmit}
                onBack={back}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      <Toaster position="bottom-center" richColors />
    </>
  );
}
