import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';
import { GearAnimation } from '../../components/intro/GearAnimation';

export const AuthLayout = ({ children }) => {
    const setHover = useUIStore(s => s.setCursorHoverState);
    return (
        <div className="min-h-screen bg-primary flex overflow-hidden selection:bg-accent-yellow/30">
            {/* Left Panel - Branding & Visuals (Hidden on small screens) */}
            <div className="hidden lg:flex w-1/2 bg-surface border-r border-border relative flex-col items-center justify-center p-12 overflow-hidden">
                {/* Abstract Background pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }} />

                {/* Animated Gear */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 scale-150 pointer-events-none mix-blend-screen">
                    <GearAnimation />
                </div>

                <div className="relative z-10 w-full max-w-lg mb-auto">
                    <Link 
                        to="/landing"
                        onMouseEnter={() => setHover('link')}
                        onMouseLeave={() => setHover('default')}
                        className="flex items-center gap-3 mb-16 group w-fit hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded overflow-hidden">
                            <img src="/brand-logo.png" alt="CoreInventory" className="w-full h-full object-cover" style={{ filter: 'invert(1) brightness(2)' }} />
                        </div>
                        <span className="font-orbitron font-bold text-white text-xl tracking-wide group-hover:text-accent-yellow transition-colors">CoreInventory</span>
                    </Link>
                </div>

                <div className="relative z-10 w-full max-w-lg mt-auto">
                    <h2 className="text-3xl font-rajdhani font-bold text-white mb-6 leading-tight">
                        "Visibility is the foundation of <br />
                        <span className="text-accent-yellow text-glow">operational excellence.</span>"
                    </h2>
                    <p className="text-text-secondary font-space">
                        Join thousands of warehouse professionals using CoreInventory to eliminate stockouts and perfect order fulfillment.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="w-full max-w-md">
                    {/* Mobile Branding */}
                    <Link 
                        to="/landing"
                        onMouseEnter={() => setHover('link')}
                        onMouseLeave={() => setHover('default')}
                        className="flex lg:hidden items-center justify-center gap-2 mb-12 group hover:opacity-80 transition-opacity"
                    >
                        <div className="w-8 h-8 rounded overflow-hidden">
                            <img src="/brand-logo.png" alt="CoreInventory" className="w-full h-full object-cover" style={{ filter: 'invert(1) brightness(2)' }} />
                        </div>
                        <span className="font-orbitron font-bold text-white tracking-wide group-hover:text-accent-yellow transition-colors">CoreInventory</span>
                    </Link>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={window.location.pathname}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
