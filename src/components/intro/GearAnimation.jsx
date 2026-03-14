import React, { forwardRef } from 'react';

export const GearAnimation = forwardRef(({ className = '' }, ref) => {
    return (
        <div ref={ref} className={`relative flex items-center justify-center ${className}`}>
            {/* Radial Glow */}
            <div className="absolute inset-0 rounded-full bg-accent-yellow/10 blur-[40px] transform scale-150 pointer-events-none" />

            {/* Oscillating Particle Ring */}
            <div className="absolute w-[280px] h-[280px] flex items-center justify-center animate-[spin_60s_linear_infinite]">
                {[...Array(60)].map((_, i) => {
                    const angle = (i * 360) / 60;
                    const delay = Math.random() * 2;
                    const duration = 2 + Math.random() * 2;
                    return (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-accent-yellow/40 rounded-full"
                            style={{
                                '--angle': `${angle}deg`,
                                transform: `rotate(${angle}deg) translateY(-140px)`,
                                animation: `oscillate ${duration}s ease-in-out ${delay}s infinite alternate`
                            }}
                        />
                    );
                })}
            </div>

            <svg
                width="240"
                height="240"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="gear-main filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            >
                <defs>
                    <linearGradient id="gearMetallic" x1="0" y1="0" x2="200" y2="200">
                        <stop offset="0%" stopColor="#8a8a8a" />
                        <stop offset="50%" stopColor="#e0e0e0" />
                        <stop offset="100%" stopColor="#333333" />
                    </linearGradient>
                    <linearGradient id="hubMetallic" x1="100" y1="50" x2="100" y2="150">
                        <stop offset="0%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#3d3d3d" />
                    </linearGradient>
                    <radialGradient id="lensflare" cx="30%" cy="30%" r="50%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                </defs>

                {/* Main Base Ring */}
                <circle cx="100" cy="100" r="85" fill="url(#gearMetallic)" stroke="#1a1a1a" strokeWidth="2" />

                {/* Teeth - 14 teeth */}
                <g stroke="#1a1a1a" strokeWidth="1" fill="url(#gearMetallic)">
                    {[...Array(14)].map((_, i) => (
                        <path
                            key={`tooth-${i}`}
                            d="M90,5 L110,5 L115,15 L85,15 Z"
                            transform={`rotate(${i * (360 / 14)} 100 100)`}
                        />
                    ))}
                </g>

                {/* Inner Cutouts */}
                <circle cx="100" cy="100" r="65" fill="#111" stroke="#333" strokeWidth="4" />
                <circle cx="100" cy="100" r="45" fill="url(#gearMetallic)" />

                {/* Bolt Holes */}
                <g fill="#0a0a0a" stroke="#222" strokeWidth="1">
                    {[...Array(6)].map((_, i) => (
                        <circle
                            key={`bolt-${i}`}
                            cx="100"
                            cy="25"
                            r="6"
                            transform={`rotate(${i * 60} 100 100)`}
                        />
                    ))}
                </g>

                {/* Center Hex Hub */}
                <polygon
                    points="100,65 130,82.5 130,117.5 100,135 70,117.5 70,82.5"
                    fill="url(#hubMetallic)"
                    stroke="#444"
                    strokeWidth="2"
                />
                <circle cx="100" cy="100" r="15" fill="#0a0a0a" stroke="#222" strokeWidth="3" />

                {/* Dynamic Highlight / Flare Overlay */}
                <circle cx="100" cy="100" r="85" fill="url(#lensflare)" className="mix-blend-overlay" />
            </svg>

            {/* Secondary Gear (Bottom right, interlocked) */}
            <div className="absolute -bottom-8 -right-8 w-[100px] h-[100px] filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]">
                <svg viewBox="0 0 100 100" fill="none" className="gear-sub w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="url(#gearMetallic)" stroke="#1a1a1a" strokeWidth="1" />
                    <g fill="url(#gearMetallic)" stroke="#1a1a1a" strokeWidth="0.5">
                        {[...Array(10)].map((_, i) => (
                            <path
                                key={`subtooth-${i}`}
                                d="M45,5 L55,5 L58,10 L42,10 Z"
                                transform={`rotate(${i * 36} 50 50)`}
                            />
                        ))}
                    </g>
                    <circle cx="50" cy="50" r="25" fill="#111" stroke="#333" strokeWidth="2" />
                    <circle cx="50" cy="50" r="10" fill="url(#hubMetallic)" />
                    <circle cx="50" cy="50" r="4" fill="#0a0a0a" />
                </svg>
            </div>

            {/* Animated Light Streak */}
            <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none mix-blend-screen" style={{ clipPath: 'circle(50% at 50% 50%)' }}>
                <div className="w-[150%] h-[20px] bg-white/40 blur-[5px] -rotate-45 absolute top-1/2 left-[-150%] animate-[streak_4s_ease-in-out_infinite]" />
            </div>

            <style>{`
        @keyframes streak {
          0% { left: -150%; top: -10%; }
          30%, 100% { left: 150%; top: 110%; }
        }
        @keyframes oscillate {
          0% { transform: rotate(var(--angle)) translateY(-138px) scale(0.8); opacity: 0.3; }
          100% { transform: rotate(var(--angle)) translateY(-142px) scale(1.2); opacity: 0.6; }
        }
      `}</style>
        </div>
    );
});
GearAnimation.displayName = 'GearAnimation';
