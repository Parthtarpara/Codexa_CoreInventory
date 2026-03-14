import { useState } from 'react';
import { motion } from 'framer-motion';
import { Warehouse as WarehouseIcon, MapPin, Box, ArrowRight, Settings2 } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { WarehouseRadar } from '../../components/charts/WarehouseRadar';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useUIStore } from '../../store/useUIStore';

export const WarehousePage = () => {
    const { warehouses, products } = useInventoryStore();
    const setHover = useUIStore(s => s.setCursorHoverState);
    const [selectedHub, setSelectedHub] = useState(warehouses[0]?.id);

    // Get active warehouse details
    const activeWh = warehouses.find(w => w.id === selectedHub) || warehouses[0];

    // Calculate unique products in this warehouse
    const whProducts = products.filter(p => p.warehouse === activeWh.id);
    const totalValue = whProducts.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0);

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">Facilities Overview</h2>
                    <p className="text-text-secondary">Monitor hub capacities, operations, and network health.</p>
                </div>

                <Button variant="ghost" className="border-border">
                    <Settings2 size={16} className="mr-2" /> Network Config
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Left Column - Warehouse List */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {warehouses.map((wh) => {
                            const utilPercent = Math.min(100, Math.round((wh.used / wh.capacity) * 100));
                            const isActive = wh.id === selectedHub;

                            let barColor = 'bg-accent-yellow';
                            let statusText = 'Optimal';
                            let statusType = 'In Stock';

                            if (utilPercent > 90) {
                                barColor = 'bg-danger shadow-[0_0_10px_rgba(244,67,54,0.5)]';
                                statusText = 'Critical';
                                statusType = 'Out of Stock';
                            } else if (utilPercent > 75) {
                                barColor = 'bg-warning shadow-[0_0_10px_rgba(255,152,0,0.5)]';
                                statusText = 'High Traffic';
                                statusType = 'Low Stock';
                            }

                            return (
                                <motion.div
                                    key={wh.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedHub(wh.id)}
                                    onMouseEnter={() => setHover('card')}
                                    onMouseLeave={() => setHover('default')}
                                    className={`cursor-pointer rounded border p-5 transition-all duration-300 relative overflow-hidden group
                    ${isActive
                                            ? 'bg-elevated border-accent-yellow shadow-[0_0_20px_rgba(245,196,0,0.1)]'
                                            : 'bg-surface border-border hover:border-accent-yellow/50'
                                        }`}
                                >
                                    {/* Subtle active glow background */}
                                    {isActive && <div className="absolute inset-0 bg-accent-yellow/5 z-0 pointer-events-none" />}

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded ${isActive ? 'bg-accent-yellow text-black' : 'bg-primary border border-border text-white group-hover:border-accent-yellow/50 transition-colors'}`}>
                                                    <WarehouseIcon size={18} />
                                                </div>
                                                <div>
                                                    <h3 className={`font-orbitron font-bold text-lg leading-none mb-1 ${isActive ? 'text-accent-yellow' : 'text-white'}`}>
                                                        {wh.name}
                                                    </h3>
                                                    <div className="flex items-center text-xs text-text-secondary">
                                                        <MapPin size={10} className="mr-1" /> {wh.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge status={statusType} />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-secondary">Utilization</span>
                                                <span className="font-orbitron font-bold text-white">{utilPercent}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-primary border border-border/50 rounded-full overflow-hidden p-[1px]">
                                                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${utilPercent}%` }} />
                                            </div>
                                            <div className="flex justify-between text-[10px] text-text-secondary font-orbitron tracking-wider">
                                                <span>{wh.used.toLocaleString()} USED</span>
                                                <span>{wh.capacity.toLocaleString()} TOTAL</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column - Radar & Active Hub Details */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="h-[300px]">
                        <WarehouseRadar />
                    </div>

                    <Card className="flex-1 border-accent-yellow/30 bg-elevated/50 shadow-[0_0_30px_rgba(245,196,0,0.05)]">
                        <h3 className="text-xl font-orbitron font-bold text-white mb-2 flex items-center">
                            {activeWh.name} <span className="ml-2 w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
                        </h3>
                        <p className="text-sm text-text-secondary mb-6 flex items-center gap-1">
                            <MapPin size={14} /> {activeWh.location} | Zone {activeWh.id.replace('WH-', '')}
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="p-3 bg-primary border border-border/70 rounded grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Unique SKUs</div>
                                    <div className="text-xl font-orbitron font-bold text-white">{whProducts.length}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Total Value</div>
                                    <div className="text-xl font-orbitron font-bold text-white">${(totalValue / 1000).toFixed(1)}k</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-text-secondary font-medium mb-2 uppercase tracking-wide">Top Categories</div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-yellow" />
                                        <span className="text-sm text-white flex-1">Raw Materials</span>
                                        <span className="text-xs font-orbitron text-text-secondary">45%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        <span className="text-sm text-white flex-1">Finished Goods</span>
                                        <span className="text-xs font-orbitron text-text-secondary">30%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                        <span className="text-sm text-white flex-1">Packaging</span>
                                        <span className="text-xs font-orbitron text-text-secondary">25%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full mt-auto group">
                            View Hub Inventory <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
};
