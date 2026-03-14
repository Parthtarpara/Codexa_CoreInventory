import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useUIStore } from '../../store/useUIStore';

export const CustomCursor = () => {
    const hoverState = useUIStore(s => s.cursorHoverState);

    const dotRef = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        if (!dotRef.current || !ringRef.current) return;

        const xDot = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" });
        const yDot = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" });

        // Ring has more lag
        const xRing = gsap.quickTo(ringRef.current, "x", { duration: 0.3, ease: "power3" });
        const yRing = gsap.quickTo(ringRef.current, "y", { duration: 0.3, ease: "power3" });

        const onMouseMove = (e) => {
            // clientX/Y gives position relative to viewport
            xDot(e.clientX);
            yDot(e.clientY);
            xRing(e.clientX);
            yRing(e.clientY);
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    // Determine styles based on hover state
    let ringClass = "w-9 h-9 rounded-full border border-accent-yellow/50 bg-transparent transition-all duration-300";
    let dotClass = "w-3 h-3 bg-accent-yellow rounded-full transition-all duration-300";

    switch (hoverState) {
        case 'button':
            ringClass = "w-12 h-12 rounded-full border border-accent-yellow bg-accent-yellow/10 transition-all duration-300 scale-110";
            dotClass = "w-2 h-2 bg-accent-yellow rounded-full transition-all duration-300 opacity-50";
            break;
        case 'card':
            ringClass = "w-12 h-12 rounded border border-accent-yellow/50 bg-transparent transition-all duration-300 rotate-45";
            dotClass = "w-3 h-3 bg-accent-yellow rounded transition-all duration-300 rotate-45";
            break;
        case 'link':
            ringClass = "w-6 h-6 rounded-full border border-accent-yellow/30 bg-transparent transition-all duration-300 scale-75";
            dotClass = "w-4 h-4 bg-accent-yellow rounded-full transition-all duration-300 scale-125";
            break;
        case 'table-row':
            ringClass = "w-20 h-2 rounded border border-accent-yellow/30 bg-transparent transition-all duration-300";
            dotClass = "w-4 h-1 bg-accent-yellow rounded transition-all duration-300";
            break;
        default:
            break;
    }

    // Hide default cursor in CSS but this ensures we don't interfere with clicks
    return (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden hidden md:block mix-blend-difference">
            <div
                ref={ringRef}
                className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 ${ringClass}`}
            />
            <div
                ref={dotRef}
                className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(245,196,0,0.8)] ${dotClass}`}
            />
        </div>
    );
};
