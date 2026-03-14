import { motion } from 'framer-motion';
import {
    Home,
    ArrowDownToLine,
    ArrowUpFromLine,
    ArrowRightLeft,
    SlidersHorizontal,
    LayoutDashboard,
    Box,
    MapPin,
    Clock,
    ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAppStore } from '../../store/useAppStore';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useUIStore } from '../../store/useUIStore';

export const HomePage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAppStore();
    const { products, warehouses, transactions } = useInventoryStore();
    const setHover = useUIStore(s => s.setCursorHoverState);

    const stats = [
        { label: 'Active Hubs', value: warehouses.length, icon: <MapPin size={18} /> },
        { label: 'Total Products', value: products.length, icon: <Box size={18} /> },
        { label: 'Recent Trans.', value: transactions.length, icon: <ArrowsDownUp size={18} /> },
    ];

    const quickActions = [
        { label: 'New Receipt', icon: <ArrowDownToLine size={20} />, path: '/app/receipts', color: 'text-success' },
        { label: 'New Delivery', icon: <ArrowUpFromLine size={20} />, path: '/app/deliveries', color: 'text-danger' },
        { label: 'Transfer Stock', icon: <ArrowRightLeft size={20} />, path: '/app/transfers', color: 'text-warning' },
        { label: 'Adjust Stock', icon: <SlidersHorizontal size={20} />, path: '/app/adjustments', color: 'text-accent-yellow' },
        { label: 'View Analytics', icon: <LayoutDashboard size={20} />, path: '/app/analytics', color: 'text-blue-400' },
    ];

    return (
        <PageWrapper>
            {/* Hero Welcome */}
            <div className="mb-10 relative">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-2 text-accent-yellow font-space text-xs uppercase tracking-[0.2em] mb-3">
                        <span className="w-8 h-[1px] bg-accent-yellow" />
                        System Control Hub
                    </div>
                    <h1 className="text-4xl md:text-5xl font-rajdhani font-bold text-white mb-2">
                        Welcome back, <span className="text-accent-yellow text-glow">{currentUser?.name?.split(' ')[0]}</span>.
                    </h1>
                    <p className="text-text-secondary max-w-xl">
                        Everything is operational. Found {products.filter(p => p.quantity <= p.reorderPoint).length} critical stock alerts that require your attention today.
                    </p>
                </motion.div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Quick Actions & Briefing */}
                <div className="lg:col-span-12">
                    <h3 className="text-sm font-orbitron font-medium text-text-secondary uppercase tracking-widest mb-6">Quick Launch</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                        {quickActions.map((action, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                onMouseEnter={() => setHover('button')}
                                onMouseLeave={() => setHover('default')}
                                onClick={() => navigate(action.path)}
                                className="cursor-pointer"
                            >
                                <Card className="flex flex-col items-center justify-center py-8 hover:border-accent-yellow/50 hover:bg-elevated/50 transition-all group">
                                    <div className={`${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                                        {action.icon}
                                    </div>
                                    <span className="text-xs font-orbitron font-medium text-white group-hover:text-accent-yellow transition-colors">{action.label}</span>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Center: System Health & Activity */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="border-accent-yellow/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-orbitron font-bold text-white flex items-center gap-2">
                                <Clock size={16} className="text-accent-yellow" /> Operational Status
                            </h3>
                            <Badge status="In Stock" label="All Systems Online" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">{stat.label}</div>
                                    <div className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                                        <span className="text-accent-yellow opacity-50">{stat.icon}</span>
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card
                            interactive
                            className="h-full border-border/50 hover:border-accent-yellow/30"
                            onClick={() => navigate('/app/stock')}
                            onMouseEnter={() => setHover('card')}
                            onMouseLeave={() => setHover('default')}
                        >
                            <h4 className="text-white font-medium mb-2">Inventory Heatmap</h4>
                            <p className="text-xs text-text-secondary mb-4">Visualize stock distribution across 5 active hubs.</p>
                            <div className="h-24 bg-primary border border-border/30 rounded flex items-center justify-center opacity-40">
                                <MapPin size={32} className="text-accent-yellow" />
                            </div>
                        </Card>
                        <Card
                            interactive
                            className="h-full border-border/50 hover:border-accent-yellow/30"
                            onClick={() => navigate('/app/ledger')}
                            onMouseEnter={() => setHover('card')}
                            onMouseLeave={() => setHover('default')}
                        >
                            <h4 className="text-white font-medium mb-2">Latest Audit</h4>
                            <p className="text-xs text-text-secondary mb-4">View the last 50 inventory transactions recorded.</p>
                            <div className="space-y-2">
                                {transactions.slice(0, 3).map(tx => (
                                    <div key={tx.id} className="flex justify-between items-center text-[10px] border-b border-border/30 pb-1">
                                        <span className="text-white font-orbitron">{tx.reference}</span>
                                        <span className="text-text-secondary uppercase">{tx.type}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right: Personal Briefing */}
                <div className="lg:col-span-4">
                    <Card className="h-full bg-surface/50 border-border/40">
                        <div className="flex flex-col items-center text-center py-6">
                            <img src={currentUser?.avatar} className="w-20 h-20 rounded-full border-2 border-accent-yellow/30 mb-4 shadow-[0_0_20px_rgba(245,196,0,0.15)]" />
                            <h4 className="text-white font-orbitron font-bold uppercase tracking-widest">{currentUser?.name}</h4>
                            <div className="text-xs text-accent-yellow mt-1">{currentUser?.role}</div>

                            <div className="w-full h-px bg-border my-8" />

                            <div className="w-full space-y-6 text-left">
                                <div>
                                    <div className="text-[10px] text-text-secondary uppercase mb-2">Upcoming Tasks</div>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-xs text-white">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-yellow shrink-0 mt-1" />
                                            Approve PO-2015 from Supplier A
                                        </li>
                                        <li className="flex gap-3 text-xs text-white">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-yellow shrink-0 mt-1" />
                                            Review Mumbai Hub utilization
                                        </li>
                                    </ul>
                                </div>

                                <Button variant="ghost" className="w-full text-xs border-border" onClick={() => navigate('/app/settings')}>
                                    Account Settings
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </PageWrapper>
    );
};

// Internal icon helper
const ArrowsDownUp = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" />
    </svg>
);
