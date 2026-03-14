import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    ArrowRightLeft,
    Plus,
    Search,
    Filter,
    Eye,
    FileCheck2,
    X,
    Calendar,
    Warehouse,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronDown,
    SlidersHorizontal
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useSearch } from '../../hooks/useSearch';
import { formatDate, formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

export const OperationsPage = ({ type }) => {
    // Config based on type
    const config = {
        receipts: {
            title: 'Inbound Receipts',
            desc: 'Manage incoming supply, vendor POs, and GRNs.',
            icon: <ArrowDownToLine size={24} className="text-success" />,
            actionText: 'New Receipt',
            dataKey: 'receipts', // from store
            color: 'text-success'
        },
        deliveries: {
            title: 'Outbound Deliveries',
            desc: 'Track customer orders, dispatch, and shipping DOs.',
            icon: <ArrowUpFromLine size={24} className="text-danger" />,
            actionText: 'New Delivery',
            dataKey: 'deliveries',
            color: 'text-danger'
        },
        transfers: {
            title: 'Internal Transfers',
            desc: 'Monitor stock movement between network warehouses.',
            icon: <ArrowRightLeft size={24} className="text-warning" />,
            actionText: 'Request Transfer',
            dataKey: 'transactions', // Filter transactions for 'Transfer'
            color: 'text-warning'
        },
        adjustments: {
            title: 'Stock Adjustments',
            desc: 'Log reconciliations, damages, and manual counts.',
            icon: <SlidersHorizontal size={24} className="text-accent-yellow" />,
            actionText: 'Log Adjustment',
            dataKey: 'transactions', // Filter transactions for 'Adjustment'
            color: 'text-accent-yellow'
        }
    }[type];

    const store = useInventoryStore();
    const [searchTerm, setSearchTerm, debouncedTerm] = useSearch('', 300);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Filter States
    const [statusFilter, setStatusFilter] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('');
    const [dateFilter, setDateFilter] = useState(''); // Today, Last 7 Days, etc

    // Dynamic Filter Options
    const dynamicOptions = useMemo(() => {
        if (type === 'receipts') {
            const suppliers = [...new Set(store.receipts.map(r => r.supplier).filter(Boolean))];
            return [
                { value: '', label: 'All Suppliers' },
                ...suppliers.map(s => ({ value: s, label: s }))
            ];
        }
        if (type === 'deliveries') {
            const customers = [...new Set(store.deliveries.map(d => d.customer).filter(Boolean))];
            return [
                { value: '', label: 'All Customers' },
                ...customers.map(c => ({ value: c, label: c }))
            ];
        }
        return [
            { value: '', label: 'All Hubs' },
            ...store.warehouses.map(w => ({ value: w.id, label: w.name }))
        ];
    }, [type, store.receipts, store.deliveries, store.warehouses]);

    // Get and filter data
    const data = useMemo(() => {
        let rawData = [];
        if (type === 'receipts' || type === 'deliveries') {
            rawData = store[config.dataKey] || [];
        } else {
            rawData = store.transactions?.filter(t => t.type.toLowerCase() === type.slice(0, -1)) || [];
        }

        return rawData.filter(item => {
            const searchStr = `${item.id || ''} ${item.reference || ''} ${item.supplier || item.customer || ''}`.toLowerCase();
            const matchSearch = searchStr.includes(debouncedTerm.toLowerCase());
            
            const matchStatus = statusFilter ? item.status === statusFilter : true;
            
            // Dynamic Entity Filter (Supplier, Customer, or Warehouse)
            let matchEntity = true;
            if (warehouseFilter) {
                if (type === 'receipts') {
                    matchEntity = item.supplier === warehouseFilter;
                } else if (type === 'deliveries') {
                    matchEntity = item.customer === warehouseFilter;
                } else {
                    matchEntity = item.warehouse === warehouseFilter || item.origin === warehouseFilter || item.destination === warehouseFilter;
                }
            }
            
            // Simplified date filtering for demo
            let matchDate = true;
            if (dateFilter === 'today') {
                const today = new Date().toISOString().split('T')[0];
                matchDate = item.date.startsWith(today);
            } else if (dateFilter === '7d') {
                const limit = new Date();
                limit.setDate(limit.getDate() - 7);
                matchDate = new Date(item.date) >= limit;
            }

            return matchSearch && matchStatus && matchEntity && matchDate;
        });
    }, [store, type, config.dataKey, debouncedTerm, statusFilter, warehouseFilter, dateFilter]);

    // Dynamic Columns
    const columns = useMemo(() => {
        const baseCols = [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: info => <span className="font-orbitron font-medium text-white">{info.getValue()}</span>
            },
            {
                accessorKey: 'date',
                header: 'Date',
                cell: info => <span className="text-text-secondary">{formatDate(info.getValue(), 'DD MMM YYYY')}</span>
            }
        ];

        if (type === 'receipts') {
            baseCols.push(
                { accessorKey: 'reference', header: 'Reference PO', cell: info => <span className="font-orbitron text-accent-yellow">{info.getValue()}</span> },
                { accessorKey: 'supplier', header: 'Supplier' },
                { accessorKey: 'warehouse', header: 'Destination', cell: info => store.warehouses.find(w => w.id === info.getValue())?.name },
                { accessorKey: 'items', header: 'Lines', cell: info => info.getValue()?.length || 0 },
                { accessorKey: 'status', header: 'Status', cell: info => <Badge status={info.getValue()} /> }
            );
        } else if (type === 'deliveries') {
            baseCols.push(
                { accessorKey: 'reference', header: 'Order Ref', cell: info => <span className="font-orbitron text-accent-yellow">{info.getValue()}</span> },
                { accessorKey: 'customer', header: 'Customer' },
                { accessorKey: 'warehouse', header: 'Origin', cell: info => store.warehouses.find(w => w.id === info.getValue())?.name },
                { accessorKey: 'items', header: 'Lines', cell: info => info.getValue()?.length || 0 },
                { accessorKey: 'status', header: 'Status', cell: info => <Badge status={info.getValue()} /> }
            );
        } else {
            // Transfers & Adjustments (Transactions format)
            baseCols.push(
                { accessorKey: 'reference', header: 'Reference', cell: info => <span className="font-orbitron text-accent-yellow">{info.getValue()}</span> },
                { accessorKey: 'productId', header: 'Product', cell: info => store.products.find(p => p.id === info.getValue())?.name },
                {
                    accessorKey: 'qtyChange', header: 'Qty Change', cell: info => {
                        const val = info.getValue();
                        return <span className={`font-orbitron font-bold ${val > 0 ? 'text-success' : val < 0 ? 'text-danger' : 'text-text-secondary'}`}>{val > 0 ? `+${val}` : val}</span>
                    }
                },
                { accessorKey: 'user', header: 'Operator' }
            );
        }

        // Actions
        baseCols.push({
            id: 'actions',
            header: 'Actions',
            cell: info => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => {
                            setSelectedItem(info.row.original);
                            setIsViewModalOpen(true);
                        }}
                        className="p-1.5 text-text-secondary hover:text-white bg-elevated rounded transition-colors"
                    >
                        <Eye size={14} />
                    </button>
                    <button 
                        onClick={() => {
                            setSelectedItem(info.row.original);
                            setIsEditModalOpen(true);
                        }}
                        className="p-1.5 text-text-secondary hover:text-accent-yellow bg-elevated rounded transition-colors"
                    >
                        <FileCheck2 size={14} />
                    </button>
                </div>
            )
        });

        return baseCols;
    }, [type, store]);

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-elevated border border-border flex items-center justify-center">
                        {config.icon}
                    </div>
                    <div>
                        <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">{config.title}</h2>
                        <p className="text-text-secondary">{config.desc}</p>
                    </div>
                </div>

                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} className="mr-2" /> {config.actionText}
                </Button>
            </div>

            <Card className="mb-6 overflow-hidden">
                <div className="py-3 px-4 flex items-center gap-4">
                    <div className="w-full max-w-md">
                        <Input
                            leftIcon={<Search size={16} />}
                            placeholder={`Search ${type}...`}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button 
                        variant="ghost" 
                        className={`border-border ml-auto transition-all ${showFilters ? 'bg-accent-yellow/10 border-accent-yellow/50 text-accent-yellow' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={16} className="mr-2" /> 
                        {showFilters ? 'Hide Filters' : 'Filters'}
                        {(statusFilter || warehouseFilter || dateFilter) && !showFilters && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-accent-yellow" />
                        )}
                    </Button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 bg-primary/30"
                        >
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <Select 
                                    label="Status"
                                    options={[
                                        { value: '', label: 'All Statuses' },
                                        { value: 'Completed', label: 'Completed' },
                                        { value: 'Processing', label: 'Processing' },
                                        { value: 'Pending', label: 'Pending' },
                                        { value: 'Cancelled', label: 'Cancelled' }
                                    ]}
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                />
                                <Select 
                                    label={`${type === 'receipts' ? 'Supplier' : type === 'deliveries' ? 'Customer' : 'Facility'}`}
                                    options={dynamicOptions}
                                    value={warehouseFilter}
                                    onChange={e => setWarehouseFilter(e.target.value)}
                                />
                                <Select 
                                    label="Time Range"
                                    options={[
                                        { value: '', label: 'Anytime' },
                                        { value: 'today', label: 'Today' },
                                        { value: '7d', label: 'Last 7 Days' },
                                        { value: '30d', label: 'Last 30 Days' }
                                    ]}
                                    value={dateFilter}
                                    onChange={e => setDateFilter(e.target.value)}
                                />
                                <div className="flex items-end">
                                    <Button 
                                        variant="ghost" 
                                        className="w-full border-border hover:text-danger hover:border-danger/30"
                                        onClick={() => {
                                            setStatusFilter('');
                                            setWarehouseFilter('');
                                            setDateFilter('');
                                        }}
                                    >
                                        <X size={14} className="mr-2" /> Clear All
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            <Table
                data={data}
                columns={columns}
                pageSize={15}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={config.actionText}>
                <div className="flex flex-col items-center justify-center py-12 text-center text-text-secondary">
                    <SlidersHorizontal size={48} className="mb-4 opacity-20" />
                    <p>Workflow form for {config.actionText} goes here.</p>
                    <p className="text-xs mt-2">The system is currently configured for read-access to operations.</p>
                    <Button className="mt-6" onClick={() => setIsModalOpen(false)}>Acknowledged</Button>
                </div>
            </Modal>

            {/* View Modal */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Operation Audit Card">
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{config.title} Record</h3>
                                <p className="text-sm font-orbitron text-accent-yellow uppercase">{selectedItem.id}</p>
                            </div>
                            <Badge status={selectedItem.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-surface border border-border/30 rounded">
                                <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Log Date</div>
                                <div className="text-white flex items-center gap-2"><Calendar size={12} /> {formatDate(selectedItem.date)}</div>
                            </div>
                            <div className="p-3 bg-surface border border-border/30 rounded">
                                <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Reference ID</div>
                                <div className="text-white font-mono">{selectedItem.reference || 'N/A'}</div>
                            </div>
                        </div>

                        <div className="p-4 bg-primary border border-border/50 rounded">
                            <h4 className="text-[10px] text-text-secondary uppercase tracking-widest mb-3 border-b border-border/50 pb-1">Entity Details</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-xs text-text-secondary">{type === 'receipts' ? 'Supplier' : type === 'deliveries' ? 'Customer' : 'Operator'}</div>
                                    <div className="text-white font-medium">{selectedItem.supplier || selectedItem.customer || selectedItem.user || 'Internal'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-secondary">Facility Hub</div>
                                    <div className="text-white font-medium flex items-center gap-1">
                                        <Warehouse size={12} /> {store.warehouses.find(w => w.id === selectedItem.warehouse)?.name || 'HQ Zone'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedItem.items && (
                            <div className="space-y-3">
                                <h4 className="text-[10px] text-text-secondary uppercase tracking-widest">Line Item Manifesto</h4>
                                {selectedItem.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 bg-elevated/30 border border-border/40 rounded">
                                        <div>
                                            <div className="text-sm text-white font-medium">{store.products.find(p => p.id === item.productId)?.name || 'Unknown Product'}</div>
                                            <div className="text-[10px] text-text-secondary font-orbitron uppercase">{item.productId}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-orbitron font-bold text-white">{item.quantity} Units</div>
                                            {item.unitPrice && <div className="text-[10px] text-accent-yellow">{formatCurrency(item.quantity * item.unitPrice)}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-border">
                            <Button onClick={() => setIsViewModalOpen(false)}>Close Audit</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit Modal (Approval/Status Update) */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify Status">
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="p-4 bg-accent-yellow/5 border border-accent-yellow/20 rounded text-center">
                            <p className="text-sm text-text-secondary">You are modifying the execution status for</p>
                            <p className="text-lg font-bold text-white mt-1">{selectedItem.id}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                            {['Pending', 'Processing', 'Completed', 'Cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        // Normally we'd call the store update here
                                        toast.success(`Status updated to ${status}`);
                                        setIsEditModalOpen(false);
                                    }}
                                    className={`p-3 rounded border text-left flex items-center justify-between transition-all group
                                        ${selectedItem.status === status 
                                            ? 'bg-accent-yellow/10 border-accent-yellow text-accent-yellow' 
                                            : 'bg-primary border-border text-white hover:border-accent-yellow/50'}`}
                                >
                                    <span className="font-medium">{status}</span>
                                    {selectedItem.status === status ? <CheckCircle2 size={16} /> : <ChevronDown size={14} className="opacity-0 group-hover:opacity-100" />}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-border mt-6">
                            <Button variant="ghost" className="border-border mr-3" onClick={() => setIsEditModalOpen(false)}>Discard</Button>
                            <Button onClick={() => setIsEditModalOpen(false)}>Synchronize</Button>
                        </div>
                    </div>
                )}
            </Modal>

        </PageWrapper>
    );
};
