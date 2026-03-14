import { useState } from 'react';
import { motion } from 'framer-motion';
import { Warehouse as WarehouseIcon, MapPin, Box, ArrowRight, Settings2, Edit2, Trash2, Plus, Eye } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { WarehouseRadar } from '../../components/charts/WarehouseRadar';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useUIStore } from '../../store/useUIStore';
import toast from 'react-hot-toast';

export const WarehousePage = () => {
    const { warehouses, products, addWarehouse, updateWarehouse, deleteWarehouse } = useInventoryStore();
    const setHover = useUIStore(s => s.setCursorHoverState);
    const [selectedHub, setSelectedHub] = useState(warehouses[0]?.id);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [targetWarehouse, setTargetWarehouse] = useState(null);

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

                <div className="flex gap-3">
                    <Button variant="ghost" className="border-border">
                        <Settings2 size={16} className="mr-2" /> Network Config
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} className="mr-2" /> Add Hub
                    </Button>
                </div>
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
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge status={statusType} />
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTargetWarehouse(wh);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="p-1 text-text-secondary hover:text-accent-yellow bg-primary rounded"
                                                    >
                                                        <Edit2 size={12} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm('Delete facility? This action is permanent.')) {
                                                                deleteWarehouse(wh.id);
                                                                toast.success('Facility decommissioned');
                                                            }
                                                        }}
                                                        className="p-1 text-text-secondary hover:text-danger bg-primary rounded"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
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
            {/* Add Warehouse Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Hub">
                <form className="space-y-4" onSubmit={e => {
                    e.preventDefault();
                    const name = e.target.whName.value;
                    const location = e.target.whLoc.value;
                    const capacity = parseInt(e.target.whCap.value);
                    
                    addWarehouse({
                        id: `WH-${Math.floor(Math.random() * 1000)}`,
                        name,
                        location,
                        capacity,
                        used: 0
                    });
                    
                    toast.success('New hub integrated into network');
                    setIsAddModalOpen(false);
                }}>
                    <Input name="whName" label="Facility Name" placeholder="E.g. Singapore West Hub" required />
                    <Input name="whLoc" label="Location" placeholder="E.g. Jurong, Singapore" required />
                    <Input name="whCap" label="Total Capacity (Units)" type="number" defaultValue={50000} required />
                    
                    <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border">
                        <Button type="button" variant="ghost" className="border-border" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Initialize Hub</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Warehouse Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Hub Config">
                {targetWarehouse && (
                    <form className="space-y-4" onSubmit={e => {
                        e.preventDefault();
                        const updates = {
                            name: e.target.whName.value,
                            location: e.target.whLoc.value,
                            capacity: parseInt(e.target.whCap.value)
                        };
                        updateWarehouse(targetWarehouse.id, updates);
                        toast.success('Hub configuration updated');
                        setIsEditModalOpen(false);
                    }}>
                        <Input name="whName" label="Facility Name" defaultValue={targetWarehouse.name} required />
                        <Input name="whLoc" label="Location" defaultValue={targetWarehouse.location} required />
                        <Input name="whCap" label="Total Capacity" type="number" defaultValue={targetWarehouse.capacity} required />
                        
                        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border">
                            <Button type="button" variant="ghost" className="border-border" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                )}
            </Modal>

        </PageWrapper>
    );
};
