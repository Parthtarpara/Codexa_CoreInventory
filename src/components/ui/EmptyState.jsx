import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
    title = 'No Data Found',
    message = "There's nothing to display here yet.",
    icon = <PackageOpen size={48} className="text-text-secondary/50" />
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-lg bg-surface/50"
        >
            <div className="mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-orbitron text-white mb-2">{title}</h3>
            <p className="text-text-secondary text-sm max-w-sm">{message}</p>
        </motion.div>
    );
};
