import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DownloadIcon, HomeIcon, MailIcon, CheckIcon, AlertTriangleIcon } from 'lucide-react';

interface Props {
  pdfBlob: Blob | null;
  clientEmail: string;
  emailStatus: 'sent' | 'failed' | 'pending';
  onRestart: () => void;
}

/* Confetti particle */
const COLORS = ['#044D8C', '#F2D230', '#D9AA1E', '#D99414', '#0D0D0D', '#055fad'];

function Particle({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      initial={{ y: 0, x, opacity: 1, scale: 1, rotate: 0 }}
      animate={{ y: 320, opacity: 0, scale: 0.3, rotate: 720 }}
      transition={{ duration: 2.5, delay, ease: 'easeIn' }}
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: 10,
        height: 10,
        borderRadius: 2,
        backgroundColor: color,
        pointerEvents: 'none',
      }}
    />
  );
}

export function ConfirmationScreen({ pdfBlob, clientEmail, emailStatus, onRestart }: Props) {
  const [showParticles, setShowParticles] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowParticles(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: i * 0.06,
    x: (Math.random() - 0.5) * 400,
    color: COLORS[i % COLORS.length],
  }));

  const handleReDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requerimientos-software.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #EFF6FF 100%)' }}>
      <div className="max-w-md w-full text-center relative">
        {/* Confetti */}
        <AnimatePresence>
          {showParticles && (
            <div className="absolute inset-0 overflow-visible pointer-events-none">
              {particles.map(p => (
                <Particle key={p.id} delay={p.delay} x={p.x} color={p.color} />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Check circle animation */}
        <div className="relative flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: '#ffffff',
              border: '4px solid #10B981',
              boxShadow: '0 20px 40px rgba(16,185,129,0.3)'
            }}
          >
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
            >
              <CheckIcon size={44} className="text-green-500" strokeWidth={3} />
            </motion.div>
          </motion.div>

          {/* Ripple rings */}
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: 'easeOut' }}
            className="absolute w-24 h-24 rounded-full border-2" style={{ borderColor: '#10B981' }}
          />
          <motion.div
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ delay: 0.4, duration: 1.4, ease: 'easeOut' }}
            className="absolute w-24 h-24 rounded-full border-2" style={{ borderColor: '#10B981' }}
          />
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-900 mb-3"
          style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.2 }}
        >
          {emailStatus === 'failed' ? 'Documento generado correctamente' : '¡Hemos recibido tu formulario!'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="text-gray-500 mb-8"
          style={{ fontSize: '1rem', lineHeight: 1.7 }}
        >
          {emailStatus === 'failed' ? (
            <>
              Tu documento se generó correctamente, pero no pudimos enviar la copia por correo.
              Puedes descargarlo ahora y volver a intentar el envío después.
            </>
          ) : (
            <>
              Tu formulario fue enviado correctamente. También enviamos una copia a{' '}
              <strong className="text-gray-700">{clientEmail || 'tu correo'}</strong>.
              Si deseas guardar el documento haz clic en el botón de abajo.
            </>
          )}
        </motion.p>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-left">
            <DownloadIcon size={18} className="mb-2" style={{ color: '#044D8C' }} />
            <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>Documento listo</p>
            <p className="text-gray-400 text-xs mt-0.5">Disponible para descargar</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-left">
            {emailStatus === 'failed' ? (
              <AlertTriangleIcon size={18} className="mb-2" style={{ color: '#d97706' }} />
            ) : (
              <MailIcon size={18} className="mb-2" style={{ color: '#044D8C' }} />
            )}
            <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>
              {emailStatus === 'failed' ? 'Correo pendiente' : 'Correo enviado'}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              {emailStatus === 'failed' ? 'Descarga disponible para no perder el documento' : 'A ti y al equipo'}
            </p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={handleReDownload}
            disabled={!pdfBlob}
            className="flex-1 flex items-center justify-center gap-2 text-white px-5 py-3 rounded-xl transition-all shadow-md"
            style={{ background: '#044D8C', boxShadow: '0 4px 14px rgba(4,77,140,0.3)', fontWeight: 600 }}
            onMouseEnter={e => (e.currentTarget.style.background = '#033d70')}
            onMouseLeave={e => (e.currentTarget.style.background = '#044D8C')}
          >
            <DownloadIcon size={16} />
            Descargar Documento
          </button>

          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 px-5 py-3 rounded-xl transition-all"
            style={{ fontWeight: 500 }}
          >
            <HomeIcon size={16} />
            Volver al inicio
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-gray-400 text-xs mt-6"
        >
          Nuestro equipo revisará tu solicitud y se pondrá en contacto pronto.
        </motion.p>
      </div>
    </div>
  );
}