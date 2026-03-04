import { motion } from 'motion/react';
import { ArrowRightIcon, FileTextIcon, CheckCircleIcon, ClipboardListIcon } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const features = [
  { icon: ClipboardListIcon, text: 'Guía paso a paso sin tecnicismos' },
  { icon: FileTextIcon,      text: 'Genera un documento PDF profesional' },
  { icon: CheckCircleIcon,   text: 'Te enviamos una copia a tu correo' },
];

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0D0D0D 0%, #021e3a 50%, #0D0D0D 100%)' }}>
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(4,77,140,0.18)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(217,164,30,0.12)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 max-w-xl w-full text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          className="flex justify-center mb-8"
        >
          <img
            src="/img/logo-horizontal.png"
            alt="Logo"
            className="h-14 w-auto object-contain drop-shadow-[0_2px_12px_rgba(99,102,241,0.35)]"
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8" style={{ background: 'rgba(4,77,140,0.25)', border: '1px solid rgba(242,210,48,0.35)' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#F2D230' }} />
          <span className="text-sm" style={{ color: '#F2D230' }}>Formulario de Requerimientos de Software</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white mb-5"
          style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2 }}
        >
          Cuéntanos cual es tu{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #F2D230, #D99414)' }}>
            necesidad
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-300 mb-10 max-w-md mx-auto"
          style={{ fontSize: '1.05rem', lineHeight: 1.7 }}
        >
          Te hacemos unas preguntas sencillas para entender tu idea o proyecto.
          Al finalizar, generamos automáticamente un documento profesional con todo lo que necesitas.
        </motion.p>

        {/* Feature list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
        >
          {features.map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5"
            >
              <Icon size={15} className="shrink-0" style={{ color: '#F2D230' }} />
              <span className="text-slate-300 text-sm">{text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 text-white px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: '#044D8C', boxShadow: '0 8px 24px rgba(4,77,140,0.45)', fontSize: '1.05rem', fontWeight: 600 }}
            onMouseEnter={e => (e.currentTarget.style.background = '#055fad')}
            onMouseLeave={e => (e.currentTarget.style.background = '#044D8C')}
          >
            Comenzar ahora
            <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-slate-500 text-sm"
        >
          Aproximadamente 5–10 minutos · Sin registro
        </motion.p>
      </motion.div>
    </div>
  );
}
