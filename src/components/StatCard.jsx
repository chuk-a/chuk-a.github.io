import React from 'react';
import { motion } from 'motion/react';

const defaultEase = [0.25, 0.1, 0.25, 1];

export function StatCard({ label, value, index }) {
    return (
        <motion.div
            className="flex flex-1 flex-col gap-3 min-w-0"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.6,
                delay: 0.6 + index * 0.1,
                ease: defaultEase
            }}
        >
            <div
                className="text-white leading-[0.96] tracking-tight"
                style={{ fontSize: 'clamp(32px, 6vw, 96px)' }}
            >
                {value}
            </div>
            <div
                className="text-white leading-[1.4]"
                style={{ fontSize: 'clamp(13px, 1.2vw, 20px)' }}
            >
                {label}
            </div>
        </motion.div>
    );
}
