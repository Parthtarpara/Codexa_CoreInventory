import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
    LayoutDashboard,
    Package,
    Tags,
    Layers,
    ArrowDownToLine,
    ArrowUpFromLine,
    ArrowRightLeft,
    SlidersHorizontal,
    FileText,
    BarChart2,
    Settings,
    LogOut,
    Menu,
    ChevronLeft,
    Home
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAppStore } from '../../store/useAppStore';

const NAV_GROUPS = [
    {
        title: 'OVERVIEW',
        items: [
            { id: 'home', label: 'Home', icon: <Home size={20} />, path: '/app/home' },
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/app/dashboard' }
        ]
    },
    {
        title: 'INVENTORY',
        items: [
            { id: 'products', label: 'Products', icon: <Package size={20} />, path: '/app/products' },
            { id: 'categories', label: 'Categories', icon: <Tags size={20} />, path: '/app/categories' },
            { id: 'warehouse', label: 'Warehouses', icon: <Layers size={20} />, path: '/app/warehouses' },
            { id: 'stock', label: 'Stock Overview', icon: <Package size={20} />, path: '/app/stock' }
        ]
    },
    {
        title: 'OPERATIONS',
        items: [
            { id: 'receipts', label: 'Receipts', icon: <ArrowDownToLine size={20} />, path: '/app/receipts' },
            { id: 'deliveries', label: 'Deliveries', icon: <ArrowUpFromLine size={20} />, path: '/app/deliveries' },
            { id: 'transfers', label: 'Transfers', icon: <ArrowRightLeft size={20} />, path: '/app/transfers' },
            { id: 'adjustments', label: 'Adjustments', icon: <SlidersHorizontal size={20} />, path: '/app/adjustments' }
        ]
    },
    {
        title: 'REPORTS',
        items: [
            { id: 'ledger', label: 'Stock Ledger', icon: <FileText size={20} />, path: '/app/ledger' },
            { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} />, path: '/app/analytics' }
        ]
    },
    {
        title: 'SYSTEM',
        items: [
            { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/app/settings' }
        ]
    }
];

export const Sidebar = () => {
    const { sidebarExpanded, toggleSidebar, setCursorHoverState } = useUIStore();
    const { currentUser, logout } = useAppStore();
    const location = useLocation();
    const navRef = useRef(null);

    // GSAP stagger effect on mount
    useEffect(() => {
        if (navRef.current) {
            const items = navRef.current.querySelectorAll('.nav-item');
            gsap.fromTo(items,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: 0.03,
                    ease: 'power2.out',
                    delay: 0.2
                }
            );
        }
    }, []);

    return (
        <motion.aside
            initial={{ width: 240 }}
            animate={{ width: sidebarExpanded ? 240 : 64 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-screen bg-surface border-r border-border flex flex-col z-30 flex-shrink-0"
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                <Link 
                    to="/landing"
                    onMouseEnter={() => setCursorHoverState('link')}
                    onMouseLeave={() => setCursorHoverState('default')}
                    className="flex items-center gap-3 overflow-hidden whitespace-nowrap group hover:opacity-80 transition-opacity"
                >
                    <div className="w-8 h-8 bg-accent-yellow/10 border border-accent-yellow flex items-center justify-center rounded shrink-0 group-hover:bg-accent-yellow/20 transition-colors">
                        <span className="font-orbitron font-bold text-accent-yellow text-sm">CI</span>
                    </div>
                    {sidebarExpanded && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-orbitron font-bold text-white text-lg tracking-wide group-hover:text-accent-yellow transition-colors"
                        >
                            CoreInventory
                        </motion.span>
                    )}
                </Link>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={toggleSidebar}
                onMouseEnter={() => setCursorHoverState('button')}
                onMouseLeave={() => setCursorHoverState('default')}
                className="absolute -right-3 top-20 w-6 h-6 bg-elevated border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-white hover:border-accent-yellow transition-colors z-40 hidden md:flex"
            >
                {sidebarExpanded ? <ChevronLeft size={14} /> : <Menu size={14} />}
            </button>

            {/* Navigation */}
            <div ref={navRef} className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4 px-2 space-y-6">
                {NAV_GROUPS.map((group, idx) => (
                    <div key={idx} className="nav-group">
                        {sidebarExpanded && (
                            <div className="px-3 mb-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest nav-item select-none">
                                {group.title}
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            {group.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <NavLink
                                        key={item.id}
                                        to={item.path}
                                        onMouseEnter={() => setCursorHoverState('link')}
                                        onMouseLeave={() => setCursorHoverState('default')}
                                        className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200
                      ${isActive
                                                ? 'bg-elevated border-l-2 border-accent-yellow text-accent-yellow shadow-[inset_0_0_12px_rgba(245,196,0,0.05)]'
                                                : 'text-text-secondary border-l-2 border-transparent hover:bg-elevated/50 hover:text-white'
                                            }
                      ${!sidebarExpanded ? 'justify-center px-0' : ''}
                    `}
                                        title={!sidebarExpanded ? item.label : undefined}
                                    >
                                        <span className="shrink-0">{item.icon}</span>
                                        {sidebarExpanded && (
                                            <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-border mt-auto">
                <div className={`flex items-center ${sidebarExpanded ? 'justify-between' : 'justify-center'} gap-3`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img
                            src={currentUser?.avatar}
                            alt={currentUser?.name}
                            className="w-8 h-8 rounded-full border border-border shrink-0"
                        />
                        {sidebarExpanded && (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white truncate w-24">{currentUser?.name}</span>
                                <span className="text-[10px] text-text-secondary uppercase tracking-wider">{currentUser?.role}</span>
                            </div>
                        )}
                    </div>

                    {sidebarExpanded && (
                        <button
                            onClick={logout}
                            onMouseEnter={() => setCursorHoverState('button')}
                            onMouseLeave={() => setCursorHoverState('default')}
                            className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded transition-colors"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};
