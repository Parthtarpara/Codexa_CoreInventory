import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useUIStore } from '../../store/useUIStore';

export const CustomCursor = () => {
    const hoverState = useUIStore(s => s.cursorHoverState);
    const cursorRef = useRef(null);
    const [sparkles, setSparkles] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    const onMouseMove = useCallback((e) => {
        if (!cursorRef.current) return;

        const { clientX: x, clientY: y } = e;

        // Move main diamond
        gsap.to(cursorRef.current, {
            x, y,
            duration: 0.1,
            ease: "power2.out"
        });

        // Add a sparkle
        const id = Math.random().toString(36).substr(2, 9);
        setSparkles(prev => [...prev.slice(-12), { id, x, y }]);

        // Check for interactive elements to hide custom cursor
        const target = e.target;
        const isInput = target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable ||
            target.tagName === 'SELECT';

        setIsVisible(!isInput);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [onMouseMove]);

    // Handle sparkle cleanup
    useEffect(() => {
        const timer = setInterval(() => {
            setSparkles(prev => prev.slice(1));
        }, 150);
        return () => clearInterval(timer);
    }, []);

    // Diamond size & style based on hover
    let size = "w-2.5 h-2.5";
    let glow = "shadow-[0_0_10px_rgba(245,196,0,0.8)]";

    if (hoverState === 'button' || hoverState === 'link') {
        size = "w-4 h-4";
        glow = "shadow-[0_0_15px_rgba(245,196,0,1)]";
    }

    if (!isVisible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden hidden md:block mix-blend-screen">
            {/* Sparkle Trail */}
            {sparkles.map((s) => (
                <div
                    key={s.id}
                    className="absolute w-1 h-1 bg-accent-yellow rounded-full animate-sparkle"
                    style={{ left: s.x, top: s.y, transform: 'translate(-50%, -50%)' }}
                />
            ))}

            {/* Main Diamond Cursor */}
            <div
                ref={cursorRef}
                className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent-yellow ${size} ${glow} transition-all duration-200`}
            />
        </div>
    );
};

