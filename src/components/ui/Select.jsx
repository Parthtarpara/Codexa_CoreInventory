import { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';

export const Select = forwardRef(({
    label,
    options = [],
    value,
    onChange,
    placeholder = "Select option...",
    error,
    className = '',
    wrapperClassName = '',
    ...props
}, ref) => {
    const setHover = useUIStore(s => s.setCursorHoverState);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (val) => {
        if (onChange) {
            onChange({ target: { value: val, name: props.name } });
        }
        setIsOpen(false);
    };

    return (
        <div className={`flex flex-col gap-1.5 ${wrapperClassName}`} ref={containerRef}>
            {label && <label className="text-sm text-text-secondary font-medium">{label}</label>}

            <div className="relative">
                {/* Trigger */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseEnter={() => setHover('link')}
                    onMouseLeave={() => setHover('default')}
                    className={`flex items-center justify-between w-full bg-elevated border border-border text-white px-3 py-2.5 rounded
                        cursor-pointer transition-all hover:border-accent-yellow/50
                        ${isOpen ? 'border-accent-yellow ring-1 ring-accent-yellow shadow-[0_0_12px_rgba(245,196,0,0.1)]' : ''}
                        ${error ? 'border-danger focus:border-danger' : ''} 
                        ${className}`}
                >
                    <span className={`text-sm ${!selectedOption ? 'text-text-secondary' : 'text-white'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-text-secondary"
                    >
                        <ChevronDown size={16} />
                    </motion.div>
                </div>

                {/* Dropdown List */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.ul
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 4, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-elevated border border-border rounded-md shadow-2xl py-1 custom-scrollbar backdrop-blur-xl"
                        >
                            {options.length === 0 ? (
                                <li className="px-4 py-8 text-center text-text-secondary text-sm">No options available</li>
                            ) : (
                                options.map((opt) => (
                                    <li
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        onMouseEnter={() => setHover('link')}
                                        onMouseLeave={() => setHover('default')}
                                        className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors
                                            ${opt.value === value ? 'bg-accent-yellow/10 text-accent-yellow' : 'text-text-secondary hover:bg-white/5 hover:text-white'}
                                        `}
                                    >
                                        <span>{opt.label}</span>
                                        {opt.value === value && <Check size={14} />}
                                    </li>
                                ))
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>

            {error && <span className="text-xs text-danger">{error}</span>}
        </div>
    );
});

Select.displayName = 'Select';

