import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export const PageWrapper = ({ children, className = '' }) => {
    const containerRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (!containerRef.current) return;

        // GSAP page transition
        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [location.pathname]);

    return (
        <div ref={containerRef} className={`w-full min-h-full py-6 px-4 md:px-6 md:py-8 ${className}`}>
            {children}
        </div>
    );
};
