import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useCounter(endValue, duration = 1.2) {
    const [value, setValue] = useState(0);
    const valRef = useRef({ current: 0 });

    useEffect(() => {
        let cleanEnd = typeof endValue === 'string' ? parseFloat(endValue.replace(/[^0-9.-]+/g, "")) : endValue;
        if (isNaN(cleanEnd)) cleanEnd = 0;

        gsap.to(valRef.current, {
            current: cleanEnd,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
                setValue(valRef.current.current);
            }
        });
    }, [endValue, duration]);

    return value;
}
