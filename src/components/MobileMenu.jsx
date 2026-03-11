import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function MobileMenu({ activeSlideIndex, onSlideChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const slides = [
        { title: "Portfolio", number: "01" },
        { title: "Philosophy", number: "02" },
        { title: "Focus Areas", number: "03" },
        { title: "Experience", number: "04" },
        { title: "Let's Connect", number: "05" },
        { title: "End of Presentation", number: "06" },
    ];

    const handleSlideClick = (index) => {
        onSlideChange(index);
        setIsOpen(false);
    };

    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-6 right-6 z-50 p-2 text-white bg-black/40 backdrop-blur-md rounded-full border border-white/10"
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                <div className="w-6 h-5 flex flex-col justify-between relative">
                    <span className={`w-full h-[2px] bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
                    <span className={`w-full h-[2px] bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                    <span className={`w-full h-[2px] bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
                </div>
            </button>

            {/* Full Screen Overlay Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8"
                    >
                        <div className="flex flex-col gap-8 w-full max-w-sm">
                            {slides.map((slide, index) => {
                                const isActive = index === activeSlideIndex;
                                return (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleSlideClick(index)}
                                        className={`flex items-center justify-between w-full p-4 rounded-xl transition-all ${
                                            isActive 
                                                ? 'bg-white/10 text-white border border-white/20' 
                                                : 'text-[#80838e] hover:text-white hover:bg-white/5 border border-transparent'
                                        }`}
                                    >
                                        <span className="text-sm font-mono opacity-50">{slide.number}</span>
                                        <span className="text-xl font-heading tracking-wide">{slide.title}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
