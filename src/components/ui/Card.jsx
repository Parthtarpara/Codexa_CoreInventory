import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';

export const Card = forwardRef(({
    children,
    glowOnHover = false,
    interactive = false,
    className = '',
    ...props
}, ref) => {
    const setHover = useUIStore(s => s.setCursorHoverState);

    const interactionStyles = interactive
        ? 'cursor-pointer transition-all duration-300 hover:-translate-y-1'
        : '';

    const glowStyles = glowOnHover
        ? 'hover:border-accent-yellow hover:shadow-[0_0_16px_rgba(245,196,0,0.12)]'
        : '';

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`bg-surface border border-border p-4 lg:p-6 ${interactionStyles} ${glowStyles} ${className}`}
            onMouseEnter={() => interactive && setHover('card')}
            onMouseLeave={() => interactive && setHover('default')}
            {...props}
        >
            {children}
        </motion.div>
    );
});
Card.displayName = 'Card';
