import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useUIStore } from '../../store/useUIStore';

export const CustomCursor = () => {
    const hoverState = useUIStore(s => s.cursorHoverState);
    const cursorRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);
    const [sparkles, setSparkles] = useState([]);
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!cursorRef.current) return;

        // Centering handle
        gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

        // Zero-duration quickTo for high performance but smooth follow
        // Using duration: 0 for absolute zero lag
        const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0, ease: "none" });
        const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0, ease: "none" });

        const onMouseMove = (e) => {
            const { clientX: x, clientY: y } = e;
            xTo(x);
            yTo(y);

            // Throttle sparkle creation
            const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);
            if (dist > 80) {
                const id = Math.random().toString(36).substring(2, 7);
                setSparkles(prev => [...prev.slice(-6), { id, x, y }]);
                lastPos.current = { x, y };
            }

            // Enhanced hiding logic
            if (e.target) {
                const target = e.target;
                const isInteractive =
                    target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable ||
                    target.closest('input') ||
                    target.closest('textarea') ||
                    target.closest('.search-container') ||
                    target.closest('header .max-w-md'); // Target the search container in Topbar

                setIsVisible(!isInteractive);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setSparkles(prev => prev.length > 0 ? prev.slice(1) : prev);
        }, 400);
        return () => clearInterval(interval);
    }, []);

    const isHovered = hoverState === 'button' || hoverState === 'link';
    const size = isHovered ? 18 : 10;
    const glowOpacity = isHovered ? 0.9 : 0.4;

    if (!isVisible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden hidden md:block mix-blend-screen">
            {sparkles.map((s) => (
                <div
                    key={s.id}
                    className="absolute w-1 h-1 bg-accent-yellow rounded-full animate-sparkle"
                    style={{
                        left: s.x,
                        top: s.y,
                        transform: 'translate(-50%, -50%)',
                        filter: 'blur(1px)',
                        opacity: 0.5
                    }}
                />
            ))}

            <div
                ref={cursorRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: '#F5C400',
                    transform: 'rotate(45deg)', // Centering is via xPercent/yPercent
                    boxShadow: `0 0 20px rgba(245, 196, 0, ${glowOpacity})`,
                    willChange: 'transform',
                    zIndex: 99999,
                    transition: 'width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease'
                }}
            />
        </div>
    );
};

