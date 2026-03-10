import React from 'react';

export function NavigationDots({ totalSlides, activeSlideIndex, onDotClick }) {
    return (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => {
                const isActive = index === activeSlideIndex;
                return (
                    <button
                        key={index}
                        onClick={() => onDotClick(index)}
                        className={`transition-all duration-300 rounded-full ${isActive ? 'bg-white w-6 h-2' : 'bg-white/40 w-2 h-2'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                );
            })}
        </div>
    );
}
