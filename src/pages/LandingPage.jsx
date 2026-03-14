import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, PackageOpen, Layers, BellRing, FileText, ArrowLeftRight, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useUIStore } from '../store/useUIStore';
import { InstructionModal } from '../components/InstructionModal';
import { InfoModal } from '../components/InfoModal';

export const LandingPage = () => {
    const navigate = useNavigate();
    const setHover = useUIStore(s => s.setCursorHoverState);
    const headlineRef = useRef(null);
    const containerRef = useRef(null);
    const [isInstructionOpen, setIsInstructionOpen] = useState(false);
    const [infoModalData, setInfoModalData] = useState({ isOpen: false, title: '', content: '' });

    const { scrollY } = useScroll();

    // Parallax Transforms
    const yHero = useTransform(scrollY, [0, 500], [0, -100]);
    const yGlobe = useTransform(scrollY, [0, 500], [0, 50]);
    const yStats1 = useTransform(scrollY, [0, 500], [0, -80]);
    const yStats2 = useTransform(scrollY, [0, 500], [0, -120]);
    const yStats3 = useTransform(scrollY, [0, 500], [0, -40]);
    const opacityHero = useTransform(scrollY, [0, 300], [1, 0.5]);

    // Hero headline reveal
    useEffect(() => {
        if (!headlineRef.current) return;
        const lines = headlineRef.current.querySelectorAll('.hero-line');

        gsap.fromTo(lines,
            { y: 50, opacity: 0, rotateX: -45 },
            { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.6 }
        );
    }, []);

    const features = [
        { title: 'Real-Time Stock Tracking', desc: 'Monitor inventory levels across all locations instantly.', icon: <Clock size={24} /> },
        { title: 'Multi-Warehouse Management', desc: 'Control multiple zones and hubs from a single pane of glass.', icon: <Layers size={24} /> },
        { title: 'Low Stock Alerts', desc: 'Predictive notifications prevent stockouts before they happen.', icon: <BellRing size={24} /> },
        { title: 'Receipt & Delivery Orders', desc: 'Streamline incoming supply and outgoing shipments.', icon: <PackageOpen size={24} /> },
        { title: 'Internal Transfers', desc: 'Track stock movement seamlessly between facilities.', icon: <ArrowLeftRight size={24} /> },
        { title: 'Full Stock Ledger', desc: 'Immutable audit trails for every single inventory transaction.', icon: <FileText size={24} /> }
    ];

    const floatingStats = [
        { value: '12,400+', label: 'SKUs Tracked', delay: 0.6 },
        { value: '99.8%', label: 'Stock Accuracy', delay: 0.8 },
        { value: '< 2s', label: 'Sync Latency', delay: 1.0 }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-primary min-h-screen text-white overflow-x-hidden pt-6"
        >
            {/* Navbar (Landing) */}
            <nav className="container mx-auto px-6 h-16 flex items-center justify-between border-b border-white/5 relative z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent-yellow border border-accent-yellow flex items-center justify-center rounded">
                        <span className="font-orbitron font-bold text-black text-sm">CI</span>
                    </div>
                    <span className="font-orbitron font-bold text-white tracking-wide">CoreInventory</span>
                </div>
                <div className="hidden md:flex gap-6">
                    <button 
                        className="text-sm text-text-secondary hover:text-white transition-colors" 
                        onMouseEnter={() => setHover('link')} 
                        onMouseLeave={() => setHover('default')}
                        onClick={() => setInfoModalData({ 
                            isOpen: true, 
                            title: 'Features', 
                            content: [
                                'Real-Time Sync: Infrastructure that updates stock levels across all zones in under 2 seconds.',
                                'Multi-Warehouse Visibility: One pane of glass for all your global or regional distribution hubs.',
                                'Predictive Alerts: AI-driven notifications that prevent stockouts before they impact your customers.',
                                'Immutable Audit Ledger: A complete, cryptographic trail of every single inventory movement.'
                            ]
                        })}
                    >
                        Features
                    </button>
                    <button 
                        className="text-sm text-text-secondary hover:text-white transition-colors" 
                        onMouseEnter={() => setHover('link')} 
                        onMouseLeave={() => setHover('default')}
                        onClick={() => setInfoModalData({ 
                            isOpen: true, 
                            title: 'Solutions', 
                            content: [
                                '3PL & Logistics: Scalable multi-tenant visibility for complex third-party distribution.',
                                'Manufacturing: Track raw materials to finished goods with precise location tracking.',
                                'E-Commerce: High-velocity stock sync for Shopify, Amazon, and custom storefronts.',
                                'Retail Networks: Manage internal transfers and local stock across hundreds of branch locations.'
                            ]
                        })}
                    >
                        Solutions
                    </button>
                    <button 
                        className="text-sm text-text-secondary hover:text-white transition-colors" 
                        onMouseEnter={() => setHover('link')} 
                        onMouseLeave={() => setHover('default')}
                        onClick={() => setInfoModalData({ 
                            isOpen: true, 
                            title: 'Pricing', 
                            content: [
                                { tier: 'Starter', details: 'Free forever. Up to 100 SKUs, single warehouse location, basic stock tracking, and community support.' },
                                { tier: 'Professional', details: '$49/month. Unlimited SKUs, multi-warehouse sync, predictive alerts, and advanced reporting tools.' },
                                { tier: 'Enterprise', details: 'Custom pricing. Dedicated support, full API access, custom integrations, and 24/7 priority response.' }
                            ]
                        })}
                    >
                        Pricing
                    </button>
                </div>
                <Button variant="ghost" onClick={() => navigate('/auth/login')} className="border-border">Sign In</Button>
            </nav>

            <main>
                {/* HERO SECTION */}
                <section className="container mx-auto px-6 py-20 lg:py-32">
                    {/* Asymmetric CSS Grid: 12-column */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">

                        {/* Left Content (cols 1-7, overlaps 8) */}
                        <div className="lg:col-span-7 lg:col-start-1 relative z-20 pr-4">
                            <div ref={headlineRef} className="text-5xl md:text-7xl lg:text-[5.5rem] font-rajdhani font-bold leading-[0.9] tracking-tight mb-8 perspective-[1000px]">
                                <div className="hero-line overflow-hidden py-1"><div className="text-white">Every Unit.</div></div>
                                <div className="hero-line overflow-hidden py-1"><div className="text-white">Every Location.</div></div>
                                <div className="hero-line overflow-hidden py-1"><div className="text-accent-yellow text-glow md:text-[6rem]">Total Control.</div></div>
                            </div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="text-text-secondary text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-space"
                            >
                                CoreInventory gives warehouse teams real-time visibility across stock, transfers, and deliveries — built for operations that cannot afford to guess.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Button size="lg" onClick={() => navigate('/app')} className="group font-bold text-black border-accent-yellow">
                                    Enter the System <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="lg" 
                                    className="border-white/20 hover:border-accent-yellow hover:text-accent-yellow"
                                    onClick={() => setIsInstructionOpen(true)}
                                >
                                    See How It Works
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right Visual (cols 6-12) */}
                        <div className="lg:col-span-7 lg:col-start-6 relative z-10 lg:-ml-12 mt-16 lg:mt-0 perspective-[1200px]">
                            {/* Dot Grid Background */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] rounded-full opacity-50 blur-[2px]"></div>

                            {/* Abstract Isometric Illustration */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotateX: 20, rotateY: -10 }}
                                animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                                className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-surface border border-border rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center -rotate-3"
                            >
                                {/* Yellow Scan Line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-accent-yellow z-30 shadow-[0_0_15px_rgba(245,196,0,1)] animate-[scan_4s_linear_infinite]" />
                                <style>{`@keyframes scan { 0% { top: 0; opacity: 1; } 95% { top: 100%; opacity: 1; } 100% { top: 100%; opacity: 0; } }`}</style>

                                {/* Shelving SVG abstract */}
                                <svg width="80%" height="80%" viewBox="0 0 400 300" className="opacity-80 drop-shadow-2xl">
                                    {/* Shelves */}
                                    <path d="M50 250 L350 250 M50 200 L350 200 M50 150 L350 150 M50 100 L350 100 M50 50 L350 50" stroke="#333" strokeWidth="4" />
                                    <path d="M50 50 L50 250 M150 50 L150 250 M250 50 L250 250 M350 50 L350 250" stroke="#222" strokeWidth="8" />
                                    {/* Boxes */}
                                    <rect x="60" y="210" width="80" height="38" fill="url(#boxGradients)" stroke="#1a1a1a" />
                                    <rect x="160" y="200" width="80" height="48" fill="url(#boxGradients)" stroke="#1a1a1a" />
                                    <rect x="60" y="160" width="60" height="38" fill="url(#boxGradients)" stroke="#1a1a1a" />
                                    <rect x="260" y="110" width="80" height="38" fill="url(#boxGradients)" className="stroke-accent-yellow stroke-2" />
                                    {/* Accents & barcodes */}
                                    <rect x="270" y="120" width="10" height="15" fill="#f5c400" />
                                    <rect x="285" y="120" width="5" height="15" fill="#fff" />
                                    <rect x="295" y="120" width="15" height="15" fill="#fff" />

                                    <defs>
                                        <linearGradient id="boxGradients" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#444" />
                                            <stop offset="100%" stopColor="#222" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </motion.div>

                            {/* Floating Stat Cards relative to the illustration */}
                            {floatingStats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: stat.delay }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`absolute bg-[#111111] border-t-2 border-t-accent-yellow border border-border p-4 rounded shadow-xl text-center z-40 transform hover:border-accent-yellow w-36
                    ${i === 0 ? 'top-[10%] -left-8 md:-left-16' :
                                            i === 1 ? 'top-[45%] -right-4 md:-right-8' :
                                                'bottom-[15%] left-[10%] md:left-4'}`}
                                >
                                    <div className="text-xl md:text-2xl font-orbitron font-bold text-white tracking-widest leading-none mb-1">{stat.value}</div>
                                    <div className="text-[10px] text-text-secondary uppercase">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* SOCIAL PROOF BAR */}
                <section className="w-full border-y border-white/5 bg-primary/50 overflow-hidden py-4">
                    <div className="whitespace-nowrap flex gap-4 pr-4 text-text-secondary/60 text-sm tracking-widest font-space font-medium uppercase animate-[marquee_20s_linear_infinite] select-none">
                        Trusted by warehouse teams across 40+ countries • Global Logistics Inc • APEX Distribution • Zenith Manufacturing • CoreInventory Intelligence • Precision Systems • Trusted by warehouse teams across 40+ countries • Global Logistics Inc • APEX Distribution •
                    </div>
                    <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
                </section>

                {/* FEATURES SECTION (Below Hero) */}
                <section className="container mx-auto px-6 py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-rajdhani font-bold text-white mb-4">Command Your Inventory</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">From multi-zone warehouses to individual SKUs, track everything through our unified data platform.</p>
                    </div>

                    {/* 3x2 Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                onMouseEnter={() => setHover('card')}
                                onMouseLeave={() => setHover('default')}
                                className="bg-surface border border-border p-8 rounded hover:border-accent-yellow/50 hover:shadow-[0_0_30px_rgba(245,196,0,0.08)] transition-all group"
                            >
                                <div className="text-accent-yellow mb-6 bg-accent-yellow/10 w-12 h-12 flex items-center justify-center rounded group-hover:bg-accent-yellow group-hover:text-black transition-colors">
                                    {feat.icon}
                                </div>
                                <h3 className="text-xl font-orbitron text-white mb-3">{feat.title}</h3>
                                <p className="text-text-secondary leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-white/5 py-8 mt-12 bg-surface/50">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-accent-yellow border border-accent-yellow flex items-center justify-center rounded shrink-0">
                            <span className="font-orbitron font-bold text-black text-[10px]">CI</span>
                        </div>
                        <span className="font-orbitron font-bold text-white opacity-80 text-sm">CoreInventory</span>
                    </div>
                    <div className="flex gap-6 text-sm text-text-secondary">
                        <a href="#" className="hover:text-white transition-colors" onMouseEnter={() => setHover('link')} onMouseLeave={() => setHover('default')}>Support</a>
                        <a href="#" className="hover:text-white transition-colors" onMouseEnter={() => setHover('link')} onMouseLeave={() => setHover('default')}>Terms</a>
                        <a href="#" className="hover:text-white transition-colors" onMouseEnter={() => setHover('link')} onMouseLeave={() => setHover('default')}>Privacy</a>
                    </div>
                    <div className="text-text-secondary text-sm">
                        &copy; 2025 CoreInventory
                    </div>
                </div>
            </footer>
            <InstructionModal 
                isOpen={isInstructionOpen} 
                onClose={() => setIsInstructionOpen(false)} 
            />
            <InfoModal 
                isOpen={infoModalData.isOpen}
                onClose={() => setInfoModalData({ ...infoModalData, isOpen: false })}
                title={infoModalData.title}
                content={infoModalData.content}
            />
        </motion.div>
    );
};
