import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { GearAnimation } from '../components/intro/GearAnimation';
import { useUIStore } from '../store/useUIStore';

export const IntroPage = () => {
    const containerRef = useRef(null);
    const gearRef = useRef(null);
    const textContainerRef = useRef(null);
    const title1Ref = useRef(null);
    const title2Ref = useRef(null);
    const title3Ref = useRef(null);
    const flashRef = useRef(null);
    const initTextRef = useRef(null);

    const [typedText, setTypedText] = useState('');
    const [typedSlogan, setTypedSlogan] = useState('');
    const [phaseDone, setPhaseDone] = useState(false);
    const setIntroShown = useUIStore(s => s.setIntroShown);

    const navigate = useNavigate();
    const timelineRef = useRef(null);

    useEffect(() => {
        // Typing effect for phase 1
        const text = "SYSTEM INITIALIZING...";
        let i = 0;
        const typingInterval = setInterval(() => {
            setTypedText(text.substring(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(typingInterval);
        }, 40);

        // Main GSAP Timeline
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            timelineRef.current = tl;

            // Phase 1 : Boot (Grid & HUD setup)
            tl.from(".hud-corner", { opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.1, ease: 'power2.out' })
                .from(".scan-line", { y: '-10%', opacity: 1, duration: 1.5, ease: 'power1.inOut' }, 0)
                .to(".scan-line", { opacity: 0, duration: 0.2 }, 1.5)
                .to(initTextRef.current, { opacity: 0, duration: 0.3 }, 1.5); // Hide init text

            // Phase 2 : Gear Reveal
            tl.fromTo(gearRef.current,
                { scale: 0, opacity: 0, rotation: -90 },
                { scale: 1, opacity: 1, rotation: 0, duration: 1.5, ease: 'back.out(1.5)' },
                1.5
            );

            // Continuous rotation for gears
            gsap.to('.gear-main', {
                rotation: 360,
                duration: 20,
                ease: 'none',
                repeat: -1
            });
            gsap.to('.gear-sub', {
                rotation: -504,
                duration: 20,
                ease: 'none',
                repeat: -1
            });

            // Phase 3 : Text Reveal
            tl.fromTo(title1Ref.current,
                { opacity: 0, y: 20, filter: 'blur(10px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
                3
            )
                .fromTo(".title-line",
                    { scaleX: 0, transformOrigin: "left center" },
                    { scaleX: 1, duration: 0.6, ease: 'power3.inOut' },
                    3.4
                )
                .fromTo(title2Ref.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.1 },
                    3.8
                )
                .to({ val: 0 }, {
                    val: 32,
                    duration: 1.5,
                    ease: "none",
                    onUpdate: function() {
                        const slogan = "PRECISION INVENTORY INTELLIGENCE";
                        setTypedSlogan(slogan.substring(0, Math.ceil(this.targets()[0].val)));
                    }
                }, 3.8)
                .fromTo(title3Ref.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5, onComplete: () => setPhaseDone(true) },
                    4.5
                );

        }, containerRef);

        return () => {
            clearInterval(typingInterval);
            ctx.revert();
        };
    }, []);

    const handleContinue = () => {
        if (!phaseDone) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setIntroShown(true);
                navigate('/landing');
            }
        });

        // Hide text instantly
        tl.to(textContainerRef.current, { opacity: 0, duration: 0.2 })
            // Roll gears in their respective directions
            .to('.gear-main', {
                rotation: "+=360",
                duration: 1.2,
                ease: 'power3.in'
            }, 0)
            .to('.gear-sub', {
                rotation: "-=504",
                duration: 1.2,
                ease: 'power3.in'
            }, 0)
            // Warp grid background slightly
            .to(".bg-grid", {
                scale: 1.5,
                opacity: 0,
                duration: 1.2,
                ease: 'power2.in'
            }, 0)
            // Fade out the entire screen
            .to(containerRef.current, {
                opacity: 0,
                duration: 1.2,
                ease: 'power2.inOut'
            }, 0);
    };

    // Listen for Enter key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') handleContinue();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [phaseDone, handleContinue]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-primary overflow-hidden flex flex-col items-center justify-center cursor-pointer select-none"
            onClick={handleContinue}
        >
            {/* SVG Grid Background with pulse effect */}
            <div className="bg-grid absolute inset-0 opacity-20 animate-[pulse_8s_infinite]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(245,196,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(245,196,0,0.08) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Scan line */}
            <div className="scan-line absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/5 to-transparent shadow-[0_4px_20px_rgba(255,255,255,0.1)] z-10 opacity-0 pointer-events-none" />

            {/* HUD Corner Brackets */}
            <div className="hud-corner absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-accent-yellow/50" />
            <div className="hud-corner absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-accent-yellow/50" />
            <div className="hud-corner absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-accent-yellow/50" />
            <div className="hud-corner absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-accent-yellow/50" />

            {/* Init Text */}
            <div ref={initTextRef} className="absolute top-8 left-10 font-space text-xs text-text-secondary tracking-widest uppercase z-20">
                {typedText}
                <span className="w-1.5 h-3 ml-1 bg-accent-yellow inline-block animate-pulse" />
            </div>

            <div className="relative z-30 flex flex-col items-center justify-center -mt-10">
                <GearAnimation ref={gearRef} className="mb-12 origin-center" />

                <div ref={textContainerRef} className="flex flex-col items-center">
                    <h1 ref={title1Ref} className="text-4xl md:text-6xl font-orbitron font-bold text-white tracking-wider">
                        COREINVENTORY<span className="text-accent-yellow">.</span>
                    </h1>

                    <div className="title-line w-full h-[2px] bg-gradient-to-r from-transparent via-accent-yellow to-transparent mt-4 mb-6" />

                    <p ref={title2Ref} className="text-sm md:text-base font-space text-text-secondary uppercase tracking-[4px] min-h-[1.5em]">
                        {typedSlogan}
                        {typedSlogan.length > 0 && typedSlogan.length < 32 && (
                            <span className="w-1.5 h-3 ml-1 bg-accent-yellow inline-block animate-pulse" />
                        )}
                    </p>
                </div>
            </div>

            {/* Continue Prompt */}
            <div
                ref={title3Ref}
                className="absolute bottom-16 text-xs text-accent-yellow/70 tracking-widest uppercase font-space animate-pulse"
            >
                [ Press Enter or Tap to Continue ]
            </div>

            {/* Zoom Flash Overlay */}
            <div ref={flashRef} className="fixed inset-0 bg-white z-[100] opacity-0 pointer-events-none" />
        </div>
    );
};
