import React from 'react';
import { BackgroundVideo } from './BackgroundVideo';
import { Logo } from './Logo';
import { BlurReveal, WordByWordReveal } from './AnimatedText';

export function Slide5({ isActive, activationCount }) {
    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#131318]">
            <BackgroundVideo
                src="https://stream.mux.com/BuGGTsiXq1T00WUb8qfURrHkTCbhrkfFLSv4uAOZzdhw.m3u8"
                className="absolute object-cover"
                style={{ width: '200%', height: '200%', bottom: 0, left: 0 }}
                isActive={isActive}
            />

            <div key={activationCount} className="relative z-10 w-full h-full flex flex-col pointer-events-none">
                {isActive && (
                    <div className="pointer-events-auto w-full h-full flex flex-col pt-[3.5%]">
                        {/* Top Bar */}
                        <BlurReveal delay={0.05} className="px-[5%] flex justify-between items-start w-full">
                            <Logo />
                            <div className="text-[#80838e] text-[20px] leading-[1.4]">05</div>
                        </BlurReveal>

                        {/* Divider */}
                        <div className="mt-6 px-[5%] w-full">
                            <div className="bg-white/15 h-px w-full" />
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Text content at bottom */}
                        <div className="max-w-[55%] px-[5%] pb-[5%]">
                            <BlurReveal delay={0.15}>
                                <div className="text-[#80838e] mb-4" style={{ fontSize: 'clamp(12px, 1.2vw, 26px)' }}>Let's Connect</div>
                            </BlurReveal>

                            <div className="text-white leading-[1.04] mb-8 font-heading" style={{ fontSize: 'clamp(20px, 4vw, 80px)' }}>
                                <WordByWordReveal
                                    text="Looking for new opportunities"
                                    baseDelay={0.25} stagger={0.035} duration={0.55}
                                />
                            </div>

                            <BlurReveal delay={0.6}>
                                <p className="text-[#80838e] max-w-[680px]" style={{ fontSize: 'clamp(12px, 1.1vw, 26px)' }}>
                                    Whether you have a unique project in mind, need to solve a complex engineering problem, or just want to chat about technology and design—my inbox is always open. Let's build something amazing together.
                                </p>
                            </BlurReveal>

                            <BlurReveal delay={0.75}>
                                <div className="mt-8 flex gap-8 text-white font-sans" style={{ fontSize: 'clamp(14px, 1.3vw, 28px)' }}>
                                    <a href="https://x.com/chuka" target="_blank" rel="noreferrer" className="hover:text-[#80838e] transition-colors underline underline-offset-4 decoration-white/20">x.com/chuka</a>
                                    <a href="tel:99029760" className="hover:text-[#80838e] transition-colors underline underline-offset-4 decoration-white/20">tel: 990 29760</a>
                                </div>
                            </BlurReveal>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
