import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const InfoModal = ({ isOpen, onClose, title, content }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-black border border-border rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <h2 className="text-3xl font-orbitron font-bold text-white tracking-widest uppercase">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-3 text-text-secondary hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X size={28} />
              </button>
            </div>

            {/* Content */}
            <div className="p-10">
              {Array.isArray(content) ? (
                <div className="space-y-6">
                  {content.map((item, idx) => (
                    <div key={idx} className="flex gap-5 items-start group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-yellow mt-2.5 shrink-0 group-hover/item:scale-150 transition-transform" />
                      <div className="space-y-1">
                        {typeof item === 'string' ? (
                          <p className="text-lg text-white/90 font-space leading-relaxed">{item}</p>
                        ) : (
                          <>
                            <h4 className="text-xl font-orbitron font-bold text-accent-yellow">{item.tier}</h4>
                            <p className="text-base text-white/70 font-space leading-relaxed">{item.details}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xl text-white/80 font-space leading-relaxed">
                  {content}
                </p>
              )}
              
              <div className="mt-12 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-accent-yellow text-black font-orbitron font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Understood
                </button>
              </div>
            </div>

            {/* Decorative Corner Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-yellow/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-yellow/10 rounded-full blur-[80px] pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
