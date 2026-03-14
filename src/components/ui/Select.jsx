import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const Select = forwardRef(({
    label,
    options = [],
    error,
    className = '',
    wrapperClassName = '',
    ...props
}, ref) => {
    const setHover = useUIStore(s => s.setCursorHoverState);

    return (
        <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
            {label && <label className="text-xs text-white/50 font-orbitron font-bold uppercase tracking-widest">{label}</label>}

            <div className="relative">
                <select
                    ref={ref}
                    onMouseEnter={() => setHover('link')}
                    onMouseLeave={() => setHover('default')}
                    className={`appearance-none w-full bg-elevated border border-border text-white px-3 py-2.5 pr-10 rounded-sm
            focus:outline-none focus:border-accent-yellow focus:shadow-[0_0_12px_rgba(245,196,0,0.15)] 
            transition-all cursor-pointer font-space
            ${error ? 'border-danger focus:border-danger focus:shadow-[0_0_8px_rgba(255,68,68,0.2)]' : ''} 
            ${className}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#1a1a1a] text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                    <ChevronDown size={16} />
                </div>
            </div>

            {error && <span className="text-xs text-danger">{error}</span>}
        </div>
    );
});
Select.displayName = 'Select';
