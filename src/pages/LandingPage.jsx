import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, PackageOpen, Layers, BellRing, FileText, ArrowLeftRight, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useUIStore } from '../store/useUIStore';

export const LandingPage = () => {
    const navigate = useNavigate();
    const setHover = useUIStore(s => s.setCursorHoverState);
    const headlineRef = useRef(null);
    const containerRef = useRef(null);

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
            { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.2, ease: "power3.out", delay: 0.2 }
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

    return (
        <div ref={containerRef} className="bg-primary min-h-screen text-white overflow-x-hidden pt-6 relative">

            {/* Navbar (Landing) */}
            <nav className="container mx-auto px-6 h-16 flex items-center justify-between border-b border-white/5 relative z-40 bg-primary/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent-yellow border border-accent-yellow flex items-center justify-center rounded">
                        <span className="font-orbitron font-bold text-black text-sm">CI</span>
                    </div>
                    <span className="font-orbitron font-bold text-white tracking-wide">CoreInventory</span>
                </div>
                <div className="hidden md:flex gap-6">
                    <button className="text-sm text-text-secondary hover:text-white transition-colors" onMouseEnter={() => setHover('link')} onMouseLeave={() => setHover('default')}>Features</button>
                    <button className="text-sm text-text-secondary hover:text-white transition-colors" onMouseEnter={() => setHover('link')} onMouseLeave={() => setHover('default')}>Solutions</button>
                    <button className="text-sm text-text-secondary hover:text-white transition-colors" onMouseEnter={() => setHover('link')} onMouseLeave={() => setHover('default')}>Pricing</button>
                </div>
                <Button variant="ghost" onClick={() => navigate('/auth/login')} className="border-border">Sign In</Button>
            </nav>

            <main className="relative z-20">
                {/* HERO SECTION */}
                <section className="container mx-auto px-6 py-20 lg:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">

                        {/* Left Content */}
                        <motion.div style={{ y: yHero, opacity: opacityHero }} className="lg:col-span-7 lg:col-start-1 relative z-20 pr-4">
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
                                <Button variant="ghost" size="lg" className="border-white/20 hover:border-accent-yellow hover:text-accent-yellow">
                                    See How It Works
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Right Visual */}
                        <div className="lg:col-span-7 lg:col-start-6 relative z-10 lg:-ml-12 mt-16 lg:mt-0 perspective-[1200px]">
                            {/* Dot Grid Background (Slowest Parallax) */}
                            <motion.div
                                style={{ y: yGlobe }}
                                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] rounded-full opacity-50 blur-[2px]"
                            />

                            {/* Abstract Illustration */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotateX: 20, rotateY: -10 }}
                                animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                                style={{ y: yHero }}
                                className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-surface border border-border rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center -rotate-3"
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-accent-yellow z-30 shadow-[0_0_15px_rgba(245,196,0,1)] animate-[scan_4s_linear_infinite]" />
                                <style>{`@keyframes scan { 0% { top: 0; opacity: 1; } 95% { top: 100%; opacity: 1; } 100% { top: 100%; opacity: 0; } }`}</style>
                                <svg width="80%" height="80%" viewBox="0 0 400 300" className="opacity-80 drop-shadow-2xl">
                                    <path d="M50 250 L350 250 M50 200 L350 200 M50 150 L350 150 M50 100 L350 100 M50 50 L350 50" stroke="#333" strokeWidth="4" />
                                    <path d="M50 50 L50 250 M150 50 L150 250 M250 50 L250 250 M350 50 L350 250" stroke="#222" strokeWidth="8" />
                                    <rect x="60" y="210" width="80" height="38" fill="url(#boxGradients)" stroke="#1a1a1a" />
                                    <rect x="160" y="200" width="80" height="48" fill="url(#boxGradients)" stroke="#1a1a1a" />
                                    <rect x="60" y="160" width="60" height="38" fill="url(#boxGradients)" stroke="#1a1a1a" />
                                    <rect x="260" y="110" width="80" height="38" fill="url(#boxGradients)" className="stroke-accent-yellow stroke-2" />
                                    <defs>
                                        <linearGradient id="boxGradients" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#444" />
                                            <stop offset="100%" stopColor="#222" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </motion.div>

                            {/* Floating Stat Cards (Depth Parallax) */}
                            {[yStats1, yStats2, yStats3].map((yVal, i) => {
                                const stats = [
                                    { value: '12,400+', label: 'SKUs Tracked', delay: 0.6 },
                                    { value: '99.8%', label: 'Stock Accuracy', delay: 0.8 },
                                    { value: '< 2s', label: 'Sync Latency', delay: 1.0 }
                                ];
                                const stat = stats[i];
                                return (
                                    <motion.div
                                        key={i}
                                        style={{ y: yVal }}
                                        transition={{ duration: 0.6, delay: stat.delay }}
                                        whileHover={{ scale: 1.1, zIndex: 50 }}
                                        className={`absolute bg-[#111111]/90 backdrop-blur-md border border-border p-4 rounded shadow-xl text-center z-40 transform w-36
                                            ${i === 0 ? 'top-[5%] -left-8 md:-left-16 border-t-2 border-accent-yellow' :
                                                i === 1 ? 'top-[40%] -right-4 md:-right-8 border-r-2 border-accent-yellow' :
                                                    'bottom-[10%] left-[10%] border-l-2 border-accent-yellow'}`}
                                    >
                                        <div className="text-xl md:text-2xl font-orbitron font-bold text-white tracking-widest leading-none mb-1">{stat.value}</div>
                                        <div className="text-[10px] text-text-secondary uppercase">{stat.label}</div>
                                    </motion.div>
                                );
                            })}
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

                {/* FEATURES SECTION */}
                <section className="container mx-auto px-6 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-rajdhani font-bold text-white mb-4">Command Your Inventory</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">From multi-zone warehouses to individual SKUs, track everything through our unified data platform.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ y: -10, borderBottomWidth: 4, borderBottomColor: '#F5C400' }}
                                onMouseEnter={() => setHover('card')}
                                onMouseLeave={() => setHover('default')}
                                className="bg-surface border border-border p-8 rounded hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all group relative overflow-hidden"
                            >
                                <div className="text-accent-yellow mb-6 bg-accent-yellow/10 w-12 h-12 flex items-center justify-center rounded group-hover:bg-accent-yellow group-hover:text-black transition-colors relative z-10">
                                    {feat.icon}
                                </div>
                                <h3 className="text-xl font-orbitron text-white mb-3 relative z-10">{feat.title}</h3>
                                <p className="text-text-secondary leading-relaxed relative z-10">{feat.desc}</p>

                                {/* Background Decorative Accent */}
                                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-accent-yellow/5 rounded-full blur-3xl group-hover:bg-accent-yellow/10 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-white/5 py-8 mt-12 bg-surface/50 relative z-30">
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
                    <div className="text-text-secondary text-sm">&copy; 2025 CoreInventory</div>
                </div>
            </footer>
        </div>
    );
};

