import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export function useGSAP(callback, dependencies = []) {
    const scopeRef = useRef(null);

    useLayoutEffect(() => {
        if (!scopeRef.current) return;

        let ctx = gsap.context(() => {
            callback();
        }, scopeRef);

        return () => ctx.revert();
    }, dependencies);

    return scopeRef;
}
