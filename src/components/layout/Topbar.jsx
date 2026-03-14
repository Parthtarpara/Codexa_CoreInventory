import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const Topbar = () => {
    const [pageTitle, setPageTitle] = useState('Dashboard');
    const location = useLocation();
    const { toggleNotifications, setCursorHoverState } = useUIStore();

    useEffect(() => {
        // Determine title from path
        const path = location.pathname.split('/').pop() || 'dashboard';
        const title = path.charAt(0).toUpperCase() + path.slice(1);

        // Convert hyphens or camel case to spaces
        setPageTitle(title.replace(/-/g, ' '));
    }, [location]);

    return (
        <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border flex flex-col justify-center px-6 sticky top-0 z-20">
            <div className="flex items-center justify-between w-full h-full">
                {/* Left: Title & Breadcrumb */}
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-orbitron font-medium text-white">{pageTitle}</h1>
                    <div className="hidden md:flex items-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                        <span>CoreInventory</span>
                        <span className="mx-2">/</span>
                        <span className="text-accent-yellow">{pageTitle}</span>
                    </div>
                </div>

                {/* Center: Global Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products, SKUs, or orders... (Tap /)"
                        className="w-full bg-elevated border border-border rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-yellow focus:shadow-[0_0_10px_rgba(245,196,0,0.15)] transition-all placeholder:text-text-secondary"
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleNotifications}
                        onMouseEnter={() => setCursorHoverState('button')}
                        onMouseLeave={() => setCursorHoverState('default')}
                        className="relative p-2 text-text-secondary hover:text-white bg-elevated rounded-full border border-border hover:border-accent-yellow/50 transition-colors"
                    >
                        <Bell size={18} />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full border border-surface"></span>
                    </button>
                </div>
            </div>
        </header>
    );
};
