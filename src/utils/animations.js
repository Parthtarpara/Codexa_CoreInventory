import gsap from 'gsap';

export const pageTransitionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export const staggerListVariants = {
    initial: {},
    animate: {
        transition: { staggerChildren: 0.05 }
    }
};

export const listItemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95 }
};
