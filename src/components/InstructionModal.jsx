import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, ArrowDownLeft, MapPin, Truck, Repeat, Settings2, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: <Package className="text-accent-yellow" size={24} />,
    title: "Step 1 — Add Products",
    description: "Create products with SKU, category, and unit of measure. This allows the system to track inventory accurately."
  },
  {
    icon: <ArrowDownLeft className="text-accent-yellow" size={24} />,
    title: "Step 2 — Receive Inventory",
    description: "Use the Receipts section when new goods arrive from suppliers. Entering quantities automatically increases stock levels."
  },
  {
    icon: <Globe className="text-accent-yellow" size={24} />,
    title: "Step 3 — Track Stock Across Locations",
    description: "Each product can exist in different warehouses or locations. Inventorium shows exactly where every unit is stored."
  },
  {
    icon: <Truck className="text-accent-yellow" size={24} />,
    title: "Step 4 — Process Deliveries",
    description: "When items are shipped to customers, create a Delivery Order. Stock will automatically decrease based on the quantity delivered."
  },
  {
    icon: <Repeat className="text-accent-yellow" size={24} />,
    title: "Step 5 — Transfer Inventory",
    description: "Move products between warehouses or internal locations using Transfers. This keeps location tracking accurate."
  },
  {
    icon: <Settings2 className="text-accent-yellow" size={24} />,
    title: "Step 6 — Adjust Inventory",
    description: "If physical stock differs from the system count, use Stock Adjustments to correct the quantity while keeping a record in the movement ledger."
  },
  {
    icon: <BarChart3 className="text-accent-yellow" size={24} />,
    title: "Step 7 — Monitor Everything from the Dashboard",
    description: "The dashboard provides a real-time overview of total inventory, low stock alerts, incoming receipts, and outgoing deliveries."
  }
];

export const InstructionModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-black border border-border rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-orbitron font-bold text-white uppercase tracking-wider">
                How CoreInventory Works
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-yellow/10 flex items-center justify-center border border-accent-yellow/20 group-hover:border-accent-yellow/50 transition-colors">
                    {step.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-rajdhani font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer shadow fade */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
