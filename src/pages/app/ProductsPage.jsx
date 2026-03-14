import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, LayoutGrid, List, Edit2, Trash2, Eye } from 'lucide-react';
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
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

export const ProductsPage = () => {
    const { products, categories, warehouses, deleteProduct } = useInventoryStore();

    // States
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm, debouncedTerm] = useSearch('', 300);

    // Filters
    const [categoryFilter, setCategoryFilter] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Filtering Logic
    const filteredData = useMemo(() => {
        return products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
                p.sku.toLowerCase().includes(debouncedTerm.toLowerCase());
            const matchCat = categoryFilter ? p.category === categoryFilter : true;
            const matchWh = warehouseFilter ? p.warehouse === warehouseFilter : true;
            const matchStatus = statusFilter ? p.status === statusFilter : true;

            return matchSearch && matchCat && matchWh && matchStatus;
        });
    }, [products, debouncedTerm, categoryFilter, warehouseFilter, statusFilter]);

    // Table Columns Setup
    const columns = useMemo(() => [
        {
            accessorKey: 'sku',
            header: 'SKU',
            cell: info => <span className="font-orbitron text-accent-yellow">{info.getValue()}</span>
        },
        {
            accessorKey: 'name',
            header: 'Product Name',
            cell: info => <span className="font-medium text-white">{info.getValue()}</span>
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: info => {
                const cat = categories.find(c => c.id === info.getValue());
                return <span className="text-text-secondary">{cat?.name || info.getValue()}</span>;
            }
        },
        {
            accessorKey: 'warehouse',
            header: 'Warehouse',
            cell: info => {
                const wh = warehouses.find(w => w.id === info.getValue());
                return <span className="text-text-secondary">{wh?.name || info.getValue()}</span>;
            }
        },
        {
            accessorKey: 'quantity',
            header: 'Qty',
            cell: info => <span className={`font-orbitron font-bold ${info.getValue() <= info.row.original.reorderPoint ? 'text-warning' : 'text-white'}`}>{info.getValue()}</span>
        },
        {
            accessorKey: 'unitPrice',
            header: 'Unit Price',
            cell: info => <span className="text-text-secondary">{formatCurrency(info.getValue())}</span>
        },
        {
            id: 'totalValue',
            header: 'Total Value',
            cell: info => {
                const row = info.row.original;
                return <span className="text-white font-medium">{formatCurrency(row.quantity * row.unitPrice)}</span>;
            }
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => <Badge status={info.getValue()} />
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: info => (
                <div className="flex items-center gap-2">
                    <button className="p-1.5 text-text-secondary hover:text-white bg-elevated rounded transition-colors tooltip-trigger relative">
                        <Eye size={14} />
                    </button>
                    <button className="p-1.5 text-text-secondary hover:text-accent-yellow bg-elevated rounded transition-colors">
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteProduct(info.row.original.id);
                            toast.success('Product deleted', { style: { background: '#111', color: '#fff', border: '1px solid #1f1f1f' } });
                        }}
                        className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 bg-elevated rounded transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )
        }
    ], [categories, warehouses, deleteProduct]);

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">Products Directory</h2>
                    <p className="text-text-secondary">Manage master item catalog and track stock levels.</p>
                </div>

                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} className="mr-2" /> Add Product
                </Button>
            </div>

            {/* Toolbar */}
            <Card className="mb-6 py-3 px-4 flex flex-col lg:flex-row items-center gap-4">
                <div className="w-full lg:w-1/3">
                    <Input
                        leftIcon={<Search size={16} />}
                        placeholder="Search SKUs or names..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Select
                        options={[{ value: '', label: 'All Categories' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                    />
                    <Select
                        options={[{ value: '', label: 'All Hubs' }, ...warehouses.map(w => ({ value: w.id, label: w.name }))]}
                        value={warehouseFilter}
                        onChange={e => setWarehouseFilter(e.target.value)}
                    />
                    <Select
                        options={[
                            { value: '', label: 'All Status' },
                            { value: 'In Stock', label: 'In Stock' },
                            { value: 'Low Stock', label: 'Low Stock' },
                            { value: 'Out of Stock', label: 'Out of Stock' }
                        ]}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 border-l border-border pl-4">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded transition-colors ${viewMode === 'table' ? 'bg-accent-yellow/10 text-accent-yellow shadow-[inset_0_0_10px_rgba(245,196,0,0.2)]' : 'text-text-secondary hover:text-white'}`}
                    >
                        <List size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('card')}
                        className={`p-2 rounded transition-colors ${viewMode === 'card' ? 'bg-accent-yellow/10 text-accent-yellow shadow-[inset_0_0_10px_rgba(245,196,0,0.2)]' : 'text-text-secondary hover:text-white'}`}
                    >
                        <LayoutGrid size={20} />
                    </button>
                </div>
            </Card>

            {/* Content View */}
            {viewMode === 'table' ? (
                <Table
                    data={filteredData}
                    columns={columns}
                    pageSize={10}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {filteredData.map(product => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card interactive glowOnHover className="h-full flex flex-col group">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge status={product.status} />
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 text-text-secondary hover:text-white bg-elevated rounded"><Edit2 size={12} /></button>
                                            <button className="p-1 text-text-secondary hover:text-danger bg-elevated rounded"><Trash2 size={12} /></button>
                                        </div>
                                    </div>

                                    {/* Image Placeholder */}
                                    <div className="w-full h-32 bg-elevated border border-border/50 rounded mb-3 flex items-center justify-center relative overflow-hidden group-hover:border-accent-yellow/30 transition-colors">
                                        <Package size={32} className="text-border" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-50" />
                                    </div>

                                    <h3 className="text-white font-medium text-sm mb-1 truncate">{product.name}</h3>
                                    <div className="text-[10px] font-orbitron text-accent-yellow mb-2">{product.sku}</div>

                                    <div className="mt-auto pt-3 border-t border-border flex justify-between items-end">
                                        <div>
                                            <div className="text-xs text-text-secondary">Quantity</div>
                                            <div className={`text-lg font-orbitron font-bold ${product.quantity <= product.reorderPoint ? 'text-warning' : 'text-white'}`}>
                                                {product.quantity}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-text-secondary uppercase">{categories.find(c => c.id === product.category)?.name || 'Misc'}</div>
                                            <div className="text-xs text-text-secondary mt-1">{warehouses.find(w => w.id === product.warehouse)?.name || 'HQ'}</div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Add Product Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
                <form className="space-y-4" onSubmit={e => {
                    e.preventDefault();
                    toast.success('Product created successfully', { style: { background: '#111', color: '#fff', border: '1px solid #1f1f1f' } });
                    setIsModalOpen(false);
                }}>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Product Name" placeholder="E.g. Steel Bracket M10" required />
                        <div className="flex items-end gap-2">
                            <Input label="SKU" placeholder="Auto-generated" className="flex-1 font-orbitron text-accent-yellow text-sm" disabled />
                            <Button type="button" variant="ghost" className="border-border">Generate</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Category" options={[{ value: '', label: 'Select Category' }, ...categories.map(c => ({ value: c.id, label: c.name }))]} required />
                        <Select label="Warehouse" options={[{ value: '', label: 'Select Hub' }, ...warehouses.map(w => ({ value: w.id, label: w.name }))]} required />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Initial Qty" type="number" defaultValue={0} min={0} required />
                        <Input label="Reorder Point" type="number" defaultValue={10} min={0} required />
                        <Input label="Unit Price ($)" type="number" step="0.01" defaultValue={0.00} required />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-text-secondary font-medium">Description</label>
                        <textarea
                            rows={3}
                            className="w-full bg-elevated border border-border text-white px-3 py-2 rounded-sm focus:outline-none focus:border-accent-yellow focus:shadow-[0_0_8px_rgba(245,196,0,0.2)] transition-all resize-none custom-scrollbar"
                            placeholder="Detailed product specification..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border">
                        <Button type="button" variant="ghost" className="border-border" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Product</Button>
                    </div>
                </form>
            </Modal>

        </PageWrapper>
    );
};
