import { useState, useEffect } from 'react';

export function useSearch(initialValue = '', delay = 300) {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [debouncedTerm, setDebouncedTerm] = useState(initialValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, delay]);

    return [searchTerm, setSearchTerm, debouncedTerm];
}
