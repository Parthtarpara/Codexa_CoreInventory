import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, Box } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useSearch } from '../../hooks/useSearch';
import toast from 'react-hot-toast';

export const CategoriesPage = () => {
    const { categories, products, addCategory, updateCategory, deleteCategory } = useInventoryStore();

    // States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm, debouncedTerm] = useSearch('', 300);

    // Filtering Logic
    const filteredData = useMemo(() => {
        return categories.filter(c => 
            c.name.toLowerCase().includes(debouncedTerm.toLowerCase())
        );
    }, [categories, debouncedTerm]);

    // Action Handlers
    const handleView = (category) => {
        setSelectedCategory(category);
        setIsViewModalOpen(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category? This might affect products using it.')) {
            deleteCategory(id);
            toast.success('Category deleted successfully');
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: info => <span className="font-orbitron text-accent-yellow">{info.getValue()}</span>
        },
        {
            accessorKey: 'name',
            header: 'Category Name',
            cell: info => <span className="font-medium text-white">{info.getValue()}</span>
        },
        {
            id: 'productCount',
            header: 'Products',
            cell: info => {
                const count = products.filter(p => p.category === info.row.original.id).length;
                return <span className="text-text-secondary">{count} items</span>;
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: info => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleView(info.row.original)}
                        className="p-1.5 text-text-secondary hover:text-white bg-elevated rounded transition-colors"
                    >
                        <Eye size={14} />
                    </button>
                    <button 
                        onClick={() => handleEdit(info.row.original)}
                        className="p-1.5 text-text-secondary hover:text-accent-yellow bg-elevated rounded transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => handleDelete(info.row.original.id)}
                        className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 bg-elevated rounded transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )
        }
    ], [products, deleteCategory]);

    return (
        <PageWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">Categories Manager</h2>
                    <p className="text-text-secondary">Organize your item catalog with logical groupings.</p>
                </div>

                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={16} className="mr-2" /> Add Category
                </Button>
            </div>

            <Card className="mb-6 py-3 px-4">
                <div className="max-w-md">
                    <Input
                        leftIcon={<Search size={16} />}
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            <Table
                data={filteredData}
                columns={columns}
                pageSize={10}
            />

            {/* View Modal */}
            <Modal 
                isOpen={isViewModalOpen} 
                onClose={() => setIsViewModalOpen(false)} 
                title="Category Details"
            >
                {selectedCategory && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-elevated border border-border rounded">
                            <Box size={32} className="text-accent-yellow" />
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedCategory.name}</h3>
                                <p className="text-sm text-text-secondary">ID: {selectedCategory.id}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Associated Products</h4>
                            <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-2">
                                {products.filter(p => p.category === selectedCategory.id).length > 0 ? (
                                    products.filter(p => p.category === selectedCategory.id).map(p => (
                                        <div key={p.id} className="flex justify-between items-center p-2 bg-primary border border-border/50 rounded">
                                            <span className="text-sm text-white">{p.name}</span>
                                            <span className="text-xs font-orbitron text-accent-yellow">{p.sku}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-text-secondary italic">No products assigned to this category.</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-border">
                            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Modal */}
            <Modal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                title="Add New Category"
            >
                <form className="space-y-4" onSubmit={e => {
                    e.preventDefault();
                    const name = e.target.name.value;
                    addCategory({ id: `CAT-${Date.now()}`, name });
                    toast.success('Category created successfully');
                    setIsAddModalOpen(false);
                }}>
                    <Input name="name" label="Category Name" placeholder="E.g. Electronics" required />
                    <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border">
                        <Button type="button" variant="ghost" className="border-border" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Category</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                title="Edit Category"
            >
                {selectedCategory && (
                    <form className="space-y-4" onSubmit={e => {
                        e.preventDefault();
                        const name = e.target.name.value;
                        updateCategory(selectedCategory.id, { name });
                        toast.success('Category updated successfully');
                        setIsEditModalOpen(false);
                    }}>
                        <Input name="name" label="Category Name" defaultValue={selectedCategory.name} required />
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
