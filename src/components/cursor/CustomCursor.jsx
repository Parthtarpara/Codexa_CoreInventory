import { useEffect, useRef } from 'react';
import { useUIStore } from '../../store/useUIStore';

export const CustomCursor = () => {
    const hoverState = useUIStore(s => s.cursorHoverState);
    const canvasRef = useRef(null);
    const hoverStateRef = useRef(hoverState);

    useEffect(() => {
        hoverStateRef.current = hoverState;
    }, [hoverState]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        };
        window.addEventListener('resize', resize);
        resize();

        let mouse = { x: width / 2, y: height / 2 };
        let smoothedMouse = { x: mouse.x, y: mouse.y };
        
        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', onMouseMove);

        const particles = Array.from({ length: 200 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vy: -Math.random() * 0.3 - 0.1,
            vx: (Math.random() - 0.5) * 0.1,
            size: Math.random() * 1.5 + 0.5,
            baseAlpha: Math.random() * 0.4 + 0.1,
        }));

        let animationFrameId;
        let time = 0;

        const drawOpticalFlare = (x, y, angle, length, width, alpha) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.globalCompositeOperation = 'screen';
            
            const gradient = ctx.createLinearGradient(0, 0, length, 0);
            gradient.addColorStop(0, `rgba(245, 196, 0, ${alpha})`);
            gradient.addColorStop(1, 'rgba(245, 196, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, -width);
            ctx.lineTo(length, 0);
            ctx.lineTo(0, width);
            ctx.fill();
            ctx.restore();
        };

        const render = () => {
            time++;
            smoothedMouse.x += (mouse.x - smoothedMouse.x) * 0.3;
            smoothedMouse.y += (mouse.y - smoothedMouse.y) * 0.3;

            ctx.clearRect(0, 0, width, height);
            
            // Draw particles (underneath)
            ctx.globalCompositeOperation = 'source-over';
            particles.forEach(p => {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                const repulsionRadius = 180;
                
                if (dist < repulsionRadius) {
                    const force = Math.pow((repulsionRadius - dist) / repulsionRadius, 2);
                    p.x += (dx / dist) * force * 5;
                    p.y += (dy / dist) * force * 5;
                } else {
                    p.x += p.vx;
                    p.y += p.vy;
                }

                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                ctx.fillStyle = `rgba(245, 196, 0, ${p.baseAlpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            const isHovered = hoverStateRef.current === 'button' || hoverStateRef.current === 'link';
            const cx = smoothedMouse.x;
            const cy = smoothedMouse.y;
            
            // Render optical flares (the 12 lines, but cinematic)
            const numLines = 12;
            const pulse = Math.sin(time * 0.05) * 0.2 + 1;
            
            for (let i = 0; i < numLines; i++) {
                const angle = (Math.PI * 2 / numLines) * i;
                const isCardinal = i % 3 === 0;
                const baseLen = isHovered ? (isCardinal ? 30 : 15) : (isCardinal ? 18 : 8);
                const flareLength = baseLen * pulse;
                const flareWidth = isCardinal ? 1.0 : 0.5;
                const alpha = isCardinal ? 0.8 : 0.4;
                
                drawOpticalFlare(cx, cy, angle, flareLength, flareWidth, alpha);
            }

            // Central Diamond Glow Halo
            ctx.globalCompositeOperation = 'screen';
            const glowGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, isHovered ? 25 : 15);
            glowGradient.addColorStop(0, 'rgba(255, 230, 100, 0.4)');
            glowGradient.addColorStop(1, 'rgba(245, 196, 0, 0)');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(cx, cy, isHovered ? 25 : 15, 0, Math.PI * 2);
            ctx.fill();

            // Geometric Core Diamond
            ctx.globalCompositeOperation = 'source-over';
            const size = isHovered ? 6 : 4;
            
            // Deep gold facet
            ctx.fillStyle = '#b38f00';
            ctx.beginPath();
            ctx.moveTo(cx, cy - size);
            ctx.lineTo(cx + size, cy);
            ctx.lineTo(cx, cy + size);
            ctx.lineTo(cx - size, cy);
            ctx.fill();

            // Bright top-left facet
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(cx, cy - size);
            ctx.lineTo(cx - size, cy);
            ctx.lineTo(cx, cy);
            ctx.fill();

            // Mid top-right facet
            ctx.fillStyle = '#ffe666';
            ctx.beginPath();
            ctx.moveTo(cx, cy - size);
            ctx.lineTo(cx + size, cy);
            ctx.lineTo(cx, cy);
            ctx.fill();

            // Outline for precision
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(cx, cy - size);
            ctx.lineTo(cx + size, cy);
            ctx.lineTo(cx, cy + size);
            ctx.lineTo(cx - size, cy);
            ctx.closePath();
            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[999999] mix-blend-screen"
            style={{ width: '100%', height: '100%' }}
        />
    );
};
