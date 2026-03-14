import { useUIStore } from '../../store/useUIStore';
import { motion } from 'framer-motion';

export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
    const setHover = useUIStore(s => s.setCursorHoverState);

    return (
        <div className={`flex items-center gap-1 border-b border-border mb-4 ${className}`}>
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        onMouseEnter={() => setHover('link')}
                        onMouseLeave={() => setHover('default')}
                        className={`relative px-4 py-3 text-sm font-medium transition-colors outline-none
              ${isActive ? 'text-accent-yellow' : 'text-text-secondary hover:text-white'}`}
                    >
                        {tab.label}
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-yellow shadow-[0_0_8px_rgba(245,196,0,0.5)]"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
