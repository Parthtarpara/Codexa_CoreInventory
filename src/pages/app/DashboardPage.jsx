import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Plus, ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, SlidersHorizontal, AlertTriangle, Clock } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StockAreaChart } from '../../components/charts/StockAreaChart';
import { CategoryPieChart } from '../../components/charts/CategoryPieChart';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useUIStore } from '../../store/useUIStore';
import { formatDate } from '../../utils/formatters';

export const DashboardPage = () => {
    const { products, transactions, warehouses } = useInventoryStore();
    const setHover = useUIStore(s => s.setCursorHoverState);
    const timelineRef = useRef(null);

    // Calculated Stats
    const totalSkus = products.length;
    const totalValue = products.reduce((acc, p) => acc + (p.unitPrice * p.quantity), 0);
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.reorderPoint).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;

    // Derived Lists
    const lowStockItems = products.filter(p => p.quantity > 0 && p.quantity <= p.reorderPoint).slice(0, 5);
    const recentTx = transactions.slice(0, 8);

    // Activity Timeline Animation
    useEffect(() => {
        if (!timelineRef.current) return;
        const items = timelineRef.current.querySelectorAll('.timeline-item');

        gsap.fromTo(items,
            { opacity: 0, x: -20 },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: timelineRef.current,
                    start: 'top 90%',
                }
            }
        );
    }, []);

    return (
        <PageWrapper>
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <Button variant="ghost" className="border-border hover:border-accent-yellow bg-surface">
                    <ArrowDownToLine size={16} className="mr-2" /> New Receipt
                </Button>
                <Button variant="ghost" className="border-border hover:border-accent-yellow bg-surface">
                    <ArrowUpFromLine size={16} className="mr-2" /> New Delivery
                </Button>
                <Button variant="ghost" className="border-border hover:border-accent-yellow bg-surface">
                    <ArrowRightLeft size={16} className="mr-2" /> Transfer Stock
                </Button>
                <Button variant="ghost" className="border-border hover:border-accent-yellow bg-surface">
                    <SlidersHorizontal size={16} className="mr-2" /> Adjust Stock
                </Button>
            </div>

            {/* TOP ROW: KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <StatCard title="Total SKUs" value={totalSkus} trend={2.4} />
                <StatCard title="Total Stock Value" value={totalValue} type="currency" trend={5.1} />
                <StatCard title="Low Stock Items" value={lowStock} trend={-1.2} warning />
                <StatCard title="Out of Stock" value={outOfStock} danger />
            </div>

            {/* SECOND ROW: AREA CHART + LOW STOCK */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                <div className="lg:col-span-8">
                    <StockAreaChart />
                </div>
                <div className="lg:col-span-4">
                    <Card className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-medium flex items-center">
                                <AlertTriangle size={16} className="text-warning mr-2" />
                                Action Required
                            </h3>
                            <Badge status="Low Stock" />
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {lowStockItems.map(item => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-primary border border-border rounded hover:border-warning/50 transition-colors cursor-pointer"
                                    onMouseEnter={() => setHover('card')}
                                    onMouseLeave={() => setHover('default')}
                                >
                                    <div>
                                        <div className="text-sm font-medium text-white">{item.name}</div>
                                        <div className="text-[10px] text-text-secondary font-orbitron">{item.sku}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-warning font-bold">{item.quantity} left</div>
                                        <div className="text-[10px] text-text-secondary">reorder: {item.reorderPoint}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button variant="ghost" className="w-full mt-4 border-border text-xs">
                            View All Low Stock
                        </Button>
                    </Card>
                </div>
            </div>

            {/* THIRD ROW: PIE CHART + RECENT TX + WAREHOUSES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Category Pie */}
                <div className="h-[400px]">
                    <CategoryPieChart />
                </div>

                {/* Recent Transactions */}
                <Card className="h-[400px] flex flex-col">
                    <h3 className="text-white font-medium mb-4">Recent Movements</h3>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {recentTx.map(tx => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between p-3 bg-primary border border-border rounded"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded ${tx.type === 'Receipt' ? 'bg-success/10 text-success' :
                                            tx.type === 'Delivery' ? 'bg-danger/10 text-danger' :
                                                'bg-warning/10 text-warning'
                                        }`}>
                                        {tx.type === 'Receipt' ? <ArrowDownToLine size={14} /> :
                                            tx.type === 'Delivery' ? <ArrowUpFromLine size={14} /> :
                                                <ArrowRightLeft size={14} />}
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-white">{tx.type}</div>
                                        <div className="text-[10px] text-text-secondary">{formatDate(tx.date, 'DD MMM, HH:mm')}</div>
                                    </div>
                                </div>
                                <div className={`text-sm font-bold font-orbitron ${tx.type === 'Receipt' ? 'text-success' :
                                        tx.type === 'Delivery' ? 'text-danger' :
                                            'text-warning'
                                    }`}>
                                    {tx.qtyChange > 0 ? '+' : ''}{tx.qtyChange}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Warehouse Capacity */}
                <Card className="h-[400px] flex flex-col">
                    <h3 className="text-white font-medium mb-4">Hub Capacities</h3>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {warehouses.map(wh => {
                            const utilPercent = Math.min(100, Math.round((wh.used / wh.capacity) * 100));
                            let barColor = 'bg-accent-yellow';
                            if (utilPercent > 90) barColor = 'bg-danger';
                            else if (utilPercent > 75) barColor = 'bg-warning';

                            return (
                                <div key={wh.id} className="cursor-pointer group" onMouseEnter={() => setHover('link')} onMouseLeave={() => setHover('default')}>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-sm text-white font-medium group-hover:text-accent-yellow transition-colors">{wh.name}</span>
                                        <span className="text-xs font-orbitron text-text-secondary">{utilPercent}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-primary rounded-full overflow-hidden">
                                        <div className={`h-full ${barColor} transition-all duration-1000`} style={{ width: `${utilPercent}%` }} />
                                    </div>
                                    <div className="text-[10px] text-text-secondary mt-1 text-right">
                                        {wh.used.toLocaleString()} / {wh.capacity.toLocaleString()} units
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* BOTTOM ROW: TIMELINE */}
            <h3 className="text-lg font-orbitron font-medium text-white mb-4 mt-12 flex items-center">
                <Clock size={18} className="mr-2 text-accent-yellow" /> Activity Audit
            </h3>
            <Card>
                <div ref={timelineRef} className="flex overflow-x-auto pb-6 pt-4 px-2 space-x-6 custom-scrollbar">
                    {transactions.slice(0, 10).map((tx, idx) => (
                        <div key={tx.id} className="timeline-item flex-none w-64 relative">
                            {/* Connector line */}
                            {idx < 9 && <div className="absolute top-4 left-8 right-[-1.5rem] h-px bg-border/50" />}

                            <div className="flex flex-col gap-3">
                                <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center bg-surface relative z-10
                  ${tx.type === 'Receipt' ? 'text-success border-success/30' :
                                        tx.type === 'Delivery' ? 'text-danger border-danger/30' :
                                            tx.type === 'Transfer' ? 'text-warning border-warning/30' :
                                                'text-accent-yellow border-accent-yellow/30'
                                    }
                `}>
                                    <div className="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                                </div>

                                <div className="bg-primary border border-border p-3 rounded hover:border-accent-yellow/30 transition-colors">
                                    <div className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">{formatDate(tx.date, 'DD MMM YYYY, HH:mm')}</div>
                                    <div className="text-sm font-medium text-white mb-1">{tx.type} • {tx.qtyChange} units</div>
                                    <div className="text-xs text-text-secondary truncate">{tx.user} updated {tx.productId}</div>
                                    <div className="mt-2 text-[10px] font-orbitron bg-elevated px-2 py-1 rounded inline-block text-accent-yellow/80">Ref: {tx.reference}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </PageWrapper>
    );
};
