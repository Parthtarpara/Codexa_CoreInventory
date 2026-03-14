import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';

export const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}, ref) => {
    const setHover = useUIStore(s => s.setCursorHoverState);

    const baseStyles = 'inline-flex items-center justify-center font-orbitron transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-accent-yellow text-primary hover:bg-yellow-400 hover:text-black hover:box-glow',
        ghost: 'bg-transparent border border-white/20 text-white hover:border-accent-yellow hover:text-accent-yellow',
        danger: 'bg-danger/10 border border-danger text-danger hover:bg-danger hover:text-white hover:shadow-[0_0_16px_rgba(255,68,68,0.4)]',
        icon: 'p-2 bg-surface hover:bg-elevated text-text-secondary hover:text-white rounded-md border border-border'
    };

    const sizes = {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3',
        icon: '' // size handled by variant
    };

    return (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.97 }}
            whileHover={variant !== 'icon' ? { scale: 1.02 } : { scale: 1.1 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onMouseEnter={() => setHover('button')}
            onMouseLeave={() => setHover('default')}
            {...props}
        >
            {children}
        </motion.button>
    );
});
Button.displayName = 'Button';
