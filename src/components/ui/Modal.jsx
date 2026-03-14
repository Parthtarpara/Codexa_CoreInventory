import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
    const setHover = useUIStore(s => s.setCursorHoverState);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`relative w-full ${maxWidth} bg-surface border border-accent-yellow shadow-[0_0_40px_rgba(245,196,0,0.1)] flex flex-col max-h-[90vh]`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-primary/50">
                            <h2 className="text-lg font-orbitron text-accent-yellow">{title}</h2>
                            <button
                                onClick={onClose}
                                onMouseEnter={() => setHover('button')}
                                onMouseLeave={() => setHover('default')}
                                className="p-1 text-text-secondary hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
