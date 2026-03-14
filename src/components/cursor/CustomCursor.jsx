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
        let lastSmoothed = { x: mouse.x, y: mouse.y };
        
        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', onMouseMove);

        // --- Anti-gravity Particles ---
        const particles = Array.from({ length: 200 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vy: -Math.random() * 0.4 - 0.1,
            vx: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 1.5 + 0.5,
            baseAlpha: Math.random() * 0.4 + 0.1,
            phase: Math.random() * Math.PI * 2,
            radiusOffset: Math.random() * 60 - 30, // Randomize repulsion distance
        }));

        let glareParticles = [];
        let animationFrameId;
        let time = 0;

        const render = () => {
            time++;
            lastSmoothed.x = smoothedMouse.x;
            lastSmoothed.y = smoothedMouse.y;
            smoothedMouse.x += (mouse.x - smoothedMouse.x) * 0.3;
            smoothedMouse.y += (mouse.y - smoothedMouse.y) * 0.3;
            const cx = smoothedMouse.x;
            const cy = smoothedMouse.y;
            const isHovered = hoverStateRef.current === 'button' || hoverStateRef.current === 'link';

            ctx.clearRect(0, 0, width, height);

            // 1. Draw Glare Trail
            const speed = Math.hypot(cx - lastSmoothed.x, cy - lastSmoothed.y);
            if (speed > 1 && Math.random() > 0.4) {
                glareParticles.push({
                    x: cx + (Math.random() - 0.5) * 8,
                    y: cy + (Math.random() - 0.5) * 8,
                    vx: -(cx - lastSmoothed.x) * 0.05 + (Math.random() - 0.5) * 0.5,
                    vy: -(cy - lastSmoothed.y) * 0.05 + (Math.random() - 0.5) * 0.5,
                    life: 1.0,
                    size: Math.random() * 3 + 1.5
                });
            }

            ctx.globalCompositeOperation = 'screen';
            for (let i = glareParticles.length - 1; i >= 0; i--) {
                let p = glareParticles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.03;
                if (p.life <= 0) {
                    glareParticles.splice(i, 1);
                    continue;
                }
                ctx.strokeStyle = `rgba(255, 240, 150, ${p.life})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                const currentSize = p.size * p.life;
                ctx.moveTo(p.x - currentSize, p.y);
                ctx.lineTo(p.x + currentSize, p.y);
                ctx.moveTo(p.x, p.y - currentSize);
                ctx.lineTo(p.x, p.y + currentSize);
                ctx.stroke();
            }

            // 2. Draw Anti-Gravity Particles
            ctx.globalCompositeOperation = 'source-over';
            particles.forEach(p => {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                
                // Varied repulsion radius to break the perfect circle
                const repulsionRadius = 150 + p.radiusOffset;
                
                // Individual oscillation on "particular axis"
                const oscillateX = Math.sin(time * 0.02 + p.phase) * 1.5;
                const oscillateY = Math.cos(time * 0.02 + p.phase) * 1.5;

                if (dist < repulsionRadius) {
                    const force = Math.pow((repulsionRadius - dist) / repulsionRadius, 2);
                    p.x += (dx / dist) * force * 5;
                    p.y += (dy / dist) * force * 5;
                } else {
                    p.x += p.vx;
                    p.y += p.vy;
                }

                // Constantly apply individual oscillation for organic feel
                const renderX = p.x + oscillateX;
                const renderY = p.y + oscillateY;

                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;

                ctx.fillStyle = `rgba(245, 196, 0, ${p.baseAlpha})`;
                ctx.beginPath();
                ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // 3. Draw Yellow Glow Halos
            ctx.globalCompositeOperation = 'screen';
            const pulsate = Math.sin(time * 0.1) * 0.2 + 1; // 1.0 to 1.2
            const outerHaloSize = isHovered ? 25 : 15;
            const innerHaloSize = isHovered ? 12 : 8;

            // Outer Yellow Halo
            let glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerHaloSize * pulsate);
            glow.addColorStop(0, 'rgba(245, 196, 0, 0.3)');
            glow.addColorStop(1, 'rgba(245, 196, 0, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(cx, cy, outerHaloSize * pulsate, 0, Math.PI * 2);
            ctx.fill();

            // Inner Yellow Halo
            glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerHaloSize * pulsate);
            glow.addColorStop(0, 'rgba(255, 230, 100, 0.6)');
            glow.addColorStop(1, 'rgba(255, 230, 100, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(cx, cy, innerHaloSize * pulsate, 0, Math.PI * 2);
            ctx.fill();

            // 4. Draw 12 Radiating Glare Lines
            ctx.globalCompositeOperation = 'screen';
            const numLines = 12;
            const baseLen = isHovered ? 15 : 8;
            
            for (let i = 0; i < numLines; i++) {
                const angle = (Math.PI * 2 / numLines) * i;
                const isCardinal = i % 3 === 0;
                // Add varied pulse to lengths based on index
                const linePulse = Math.sin(time * 0.08 + i) * 6;
                const len = (isCardinal ? baseLen * 1.5 : baseLen) + linePulse;
                const endX = cx + Math.cos(angle) * len;
                const endY = cy + Math.sin(angle) * len;

                const lineGlow = ctx.createLinearGradient(cx, cy, endX, endY);
                lineGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                lineGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.strokeStyle = lineGlow;
                ctx.lineWidth = isCardinal ? 1.5 : 0.8;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }

            // 5. Draw Faceted White Diamond Core
            ctx.globalCompositeOperation = 'source-over';
            const s = isHovered ? 5 : 3;
            
            // Bottom Right (Darker grey)
            ctx.fillStyle = '#cccccc';
            ctx.beginPath();
            ctx.moveTo(cx, cy - s);
            ctx.lineTo(cx + s, cy);
            ctx.lineTo(cx, cy + s);
            ctx.lineTo(cx - s, cy);
            ctx.fill();

            // Top Left (Bright White)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(cx, cy - s);
            ctx.lineTo(cx - s, cy);
            ctx.lineTo(cx, cy);
            ctx.fill();

            // Top Right (Mid grey)
            ctx.fillStyle = '#eeeeee';
            ctx.beginPath();
            ctx.moveTo(cx, cy - s);
            ctx.lineTo(cx + s, cy);
            ctx.lineTo(cx, cy);
            ctx.fill();

            // Core Outline
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, cy - s);
            ctx.lineTo(cx + s, cy);
            ctx.lineTo(cx, cy + s);
            ctx.lineTo(cx - s, cy);
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
