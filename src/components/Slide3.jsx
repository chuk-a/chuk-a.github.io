import React from 'react';
import { motion } from 'motion/react';
import { BackgroundVideo } from './BackgroundVideo';
import { Logo } from './Logo';
import { BlurReveal, WordByWordReveal } from './AnimatedText';

const defaultEase = [0.25, 0.1, 0.25, 1];

function Chart() {
    return (
        <motion.div
            className="absolute bottom-[3%] left-0 right-0 top-[40%] text-white pointer-events-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: defaultEase }}
        >
            {/* ChartArea */}
            <div className="absolute bottom-0 right-0 w-[55%] h-[70%]">
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" className="opacity-80">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8238DC" />
                            <stop offset="100%" stopColor="#F75CB7" />
                        </linearGradient>
                        <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F75CB7" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#8238DC" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="dotGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7FBAFF" />
                            <stop offset="100%" stopColor="#536EFB" />
                        </linearGradient>
                        <linearGradient id="opacityLine" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                    </defs>
                    <path d="M0,100 C30,90 40,50 100,10" fill="url(#areaGrad)" />
                    <path d="M0,100 C30,90 40,50 100,10" fill="none" stroke="url(#opacityLine)" strokeWidth="8" />
                    <path d="M0,100 C30,90 40,50 100,10" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
                </svg>

                {/* TopValue */}
                <div className="absolute top-[2%] right-[5%] flex flex-col items-center">
                    <div style={{ fontSize: 'clamp(32px, 4vw, 64px)' }} className="leading-none text-white tracking-tight">127%</div>
                    <div className="w-[2px] h-[50px] bg-white opacity-40 mt-2"></div>
                    <div className="w-4 h-4 rounded-full mt-1" style={{ background: 'linear-gradient(to top right, #7FBAFF, #536EFB)', border: '2px solid white' }}></div>
                </div>

                {/* SectorMarker */}
                <div className="absolute bottom-[22%] left-[44%] flex flex-col items-center">
                    <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center relative" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="text-white font-bold">32%</div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: 'linear-gradient(to top right, #7FBAFF, #536EFB)', border: '2px solid white' }}></div>
                    </div>
                    <div className="w-[2px] h-[40px] bg-white opacity-40 mt-1"></div>
                </div>

                {/* MidDot */}
                <div className="absolute top-[40%] right-[35%] w-3 h-3 rounded-full" style={{ background: 'linear-gradient(to top right, #7FBAFF, #536EFB)', border: '2px solid white' }}></div>
            </div>

            {/* XAxis */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#1a2035] h-[1px] flex justify-between px-[5%] items-end pb-2">
                {['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].map(year => (
                    <div key={year} className="flex flex-col flex-1 items-center relative h-3">
                        <div className="w-px h-full bg-white/20"></div>
                        <div className="absolute top-4 text-[#80838e]" style={{ fontSize: 'clamp(11px, 1vw, 18px)' }}>{year}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export function Slide3({ isActive, activationCount }) {
    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-black">
            <BackgroundVideo
                src="https://stream.mux.com/Gs3wZfrtz6ZfqZqQ02c02Z7lugV00FGZvRpcqFTel66r3g.m3u8"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                style={{ transform: 'scale(-1, -1)' }}
                isActive={isActive}
            />

            <div key={activationCount} className="relative z-10 w-full h-full flex flex-col pointer-events-none">
                {isActive && (
                    <div className="pointer-events-auto w-full h-full flex flex-col">
                        {/* Top Bar */}
                        <BlurReveal delay={0.05} className="px-[5%] pt-[3.5%] flex justify-between items-start w-full absolute top-0 left-0 right-0">
                            <Logo />
                            <div className="text-[#80838e] text-[20px] leading-[1.4]">03</div>
                        </BlurReveal>

                        {/* Content area */}
                        <div className="max-w-[55%] px-[5%] pt-[10%]">
                            <BlurReveal delay={0.15}>
                                <div className="text-[#80838e] mb-4" style={{ fontSize: 'clamp(12px, 1.2vw, 18px)' }}>Focus Areas</div>
                            </BlurReveal>

                            <div className="text-white leading-[1.04] mb-8 font-heading" style={{ fontSize: 'clamp(20px, 3.2vw, 52px)' }}>
                                <WordByWordReveal
                                    text="I specialize in modern web technologies, smart home automation, and creating impactful applications"
                                    baseDelay={0.25} stagger={0.035} duration={0.55}
                                />
                            </div>

                            <BlurReveal delay={0.8}>
                                <p className="text-[#80838e] max-w-[90%]" style={{ fontSize: 'clamp(12px, 1.1vw, 18px)' }}>
                                    With a strong foundation in full-stack development and a passion for IoT integration like Home Assistant, I bridge the gap between robust software engineering and the physical world. Positioned at the forefront of digital solutions.
                                </p>
                            </BlurReveal>
                        </div>

                        <Chart />
                    </div>
                )}
            </div>
        </div>
    );
}
