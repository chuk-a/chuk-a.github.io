import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Slide1 } from './components/Slide1';
import { Slide2 } from './components/Slide2';
import { Slide3 } from './components/Slide3';
import { Slide4 } from './components/Slide4';
import { Slide5 } from './components/Slide5';
import { Slide6 } from './components/Slide6';
import { NavigationDots } from './components/NavigationDots';
import { MobileMenu } from './components/MobileMenu';

function Presentation() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const slides = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6];

  // Track activation count for each slide
  const [activationCounts, setActivationCounts] = useState(Array(slides.length).fill(0));
  const prevActiveRef = useRef(activeSlideIndex);

  useEffect(() => {
    if (prevActiveRef.current !== activeSlideIndex) {
      setActivationCounts(prev => {
        const newCounts = [...prev];
        newCounts[activeSlideIndex] += 1;
        return newCounts;
      });
      prevActiveRef.current = activeSlideIndex;
    }
  }, [activeSlideIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
        setActiveSlideIndex(prev => Math.min(prev + 1, slides.length - 1));
      } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        setActiveSlideIndex(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative">
      <div className="w-full h-full relative font-sans">
        {slides.map((SlideComponent, index) => {
          const isActive = index === activeSlideIndex;
          return (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: index === 0 ? 1 : 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{
                zIndex: isActive ? 10 : 0,
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              <SlideComponent
                isActive={isActive}
                activationCount={activationCounts[index]}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="hidden md:block">
        <NavigationDots
          totalSlides={slides.length}
          activeSlideIndex={activeSlideIndex}
          onDotClick={(index) => setActiveSlideIndex(index)}
        />
      </div>

      <MobileMenu
        activeSlideIndex={activeSlideIndex}
        onSlideChange={(index) => setActiveSlideIndex(index)}
      />
    </div>
  );
}

export default Presentation;
