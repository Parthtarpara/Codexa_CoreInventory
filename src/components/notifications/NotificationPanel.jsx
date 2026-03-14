import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Package, Truck, AlertTriangle, AlertCircle } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

const mockNotifications = [
    { id: 1, type: 'warning', title: 'Low Stock Alert', desc: 'Hydraulic Press Seal is below reorder point (15 units remaining).', time: '10 min ago' },
    { id: 2, type: 'info', title: 'New Receipt Pending', desc: 'PO-2015 from Supplier A Corp awaits inspection.', time: '1 hour ago' },
    { id: 3, type: 'success', title: 'Delivery Dispatched', desc: 'DO-5012 to Client C Industries has left the facility.', time: '3 hours ago' },
    { id: 4, type: 'system', title: 'System Update', desc: 'Scheduled maintenance next Sunday 02:00 AM.', time: '1 day ago' }
];

export const NotificationPanel = () => {
    const { notificationsOpen, toggleNotifications, setCursorHoverState } = useUIStore();

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle size={18} className="text-warning" />;
            case 'success': return <Package size={18} className="text-success" />;
            case 'info': return <Truck size={18} className="text-blue-400" />;
            default: return <AlertCircle size={18} className="text-text-secondary" />;
        }
    };

    return (
        <AnimatePresence>
            {notificationsOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleNotifications}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-surface border-l border-border z-50 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-primary/40">
                            <div className="flex items-center gap-2 text-white">
                                <Bell size={20} className="text-accent-yellow" />
                                <h3 className="font-orbitron text-lg font-medium">Notifications</h3>
                            </div>
                            <button
                                onClick={toggleNotifications}
                                onMouseEnter={() => setCursorHoverState('button')}
                                onMouseLeave={() => setCursorHoverState('default')}
                                className="p-1.5 text-text-secondary hover:text-white hover:bg-elevated rounded transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                            <div className="flex flex-col gap-2">
                                {mockNotifications.map((notif) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: notif.id * 0.05 }}
                                        onMouseEnter={() => setCursorHoverState('link')}
                                        onMouseLeave={() => setCursorHoverState('default')}
                                        className="p-4 bg-elevated/50 border border-border/50 rounded flex gap-4 hover:bg-elevated hover:border-accent-yellow/30 transition-colors cursor-pointer"
                                    >
                                        <div className="mt-0.5">
                                            {getIcon(notif.type)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-white mb-1">{notif.title}</h4>
                                            <p className="text-xs text-text-secondary mb-2 leading-relaxed">{notif.desc}</p>
                                            <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">{notif.time}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-border bg-primary/40">
                            <button
                                onMouseEnter={() => setCursorHoverState('button')}
                                onMouseLeave={() => setCursorHoverState('default')}
                                className="w-full py-2.5 text-sm font-medium text-accent-yellow bg-accent-yellow/10 border border-accent-yellow/20 rounded hover:bg-accent-yellow hover:text-black transition-colors"
                                onClick={toggleNotifications}
                            >
                                Mark all as read
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
