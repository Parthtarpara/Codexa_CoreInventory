import { forwardRef } from 'react';
import { useUIStore } from '../../store/useUIStore';

export const Input = forwardRef(({
    label,
    error,
    leftIcon,
    className = '',
    wrapperClassName = '',
    ...props
}, ref) => {
    const setHover = useUIStore(s => s.setCursorHoverState);

    return (
        <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
            {label && <label className="text-sm text-text-secondary font-medium">{label}</label>}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    onMouseEnter={() => setHover('link')}
                    onMouseLeave={() => setHover('default')}
                    className={`w-full bg-elevated border border-border text-white px-3 py-2 
            focus:outline-none focus:border-accent-yellow focus:shadow-[0_0_8px_rgba(245,196,0,0.2)] 
            transition-all placeholder:text-neutral-600
            ${leftIcon ? 'pl-9' : ''} 
            ${error ? 'border-danger focus:border-danger focus:shadow-[0_0_8px_rgba(255,68,68,0.2)]' : ''} 
            ${className}`}
                    {...props}
                />
            </div>

            {error && <span className="text-xs text-danger">{error}</span>}
        </div>
    );
});
Input.displayName = 'Input';
