import React from 'react';
import { motion } from 'motion/react';

const defaultEase = [0.25, 0.1, 0.25, 1];

export function SlideUpLine({ children, delay = 0, duration = 0.7, className = '' }) {
    return (
        <span className={`overflow-hidden inline-block ${className}`}>
            <motion.span
                className="inline-block origin-bottom"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration, delay, ease: defaultEase }}
            >
                {children}
            </motion.span>
        </span>
    );
}

export function WordByWordReveal({ text, baseDelay = 0, stagger = 0.035, duration = 0.55, className = '' }) {
    if (!text) return null;
    const words = text.split(' ');

    return (
        <div className={`inline-block ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="overflow-hidden inline-block mr-[0.27em] align-bottom pb-1 -mb-1">
                    <motion.span
                        className="inline-block origin-bottom"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{
                            duration,
                            delay: baseDelay + i * stagger,
                            ease: defaultEase
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </div>
    );
}

export function BlurReveal({ children, delay = 0, duration = 0.9, className = '' }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration, delay, ease: defaultEase }}
        >
            {children}
        </motion.div>
    );
}
