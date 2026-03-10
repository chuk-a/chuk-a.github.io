import React from 'react';
import { BackgroundVideo } from './BackgroundVideo';
import { Logo } from './Logo';
import { BlurReveal, WordByWordReveal } from './AnimatedText';

export function Slide4({ isActive, activationCount }) {
    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-black">
            <BackgroundVideo
                src="https://stream.mux.com/PkFsoKeakRLgL01gjf02CRcSbsJ600Z00NvLr9eRZ92pLbA.m3u8"
                className="absolute top-0 bottom-0 right-0 h-full object-cover"
                style={{ left: '400px' }}
            />

            <div key={activationCount} className="relative z-10 w-full h-full flex flex-col pointer-events-none">
                {isActive && (
                    <div className="pointer-events-auto w-full h-full flex flex-col pt-[3.5%]">
                        {/* Top Bar */}
                        <BlurReveal delay={0.05} className="px-[5%] flex justify-between items-start w-full absolute top-[3.5%] left-0 right-0">
                            <Logo />
                            <div className="text-[#80838e] text-[20px] leading-[1.4]">04</div>
                        </BlurReveal>

                        {/* Divider */}
                        <div className="absolute top-[calc(3.5%+52px)] px-[5%] w-full">
                            <div className="bg-white/15 h-px w-full" />
                        </div>

                        <div className="flex flex-col w-full h-full justify-center px-[5%]">
                            <div className="max-w-[65%]">
                                <BlurReveal delay={0.15}>
                                    <div className="text-[#80838e] mb-4" style={{ fontSize: 'clamp(12px, 1.2vw, 26px)' }}>Experience & Skills</div>
                                </BlurReveal>

                                <div className="text-white leading-[1.04] mb-8 font-heading" style={{ fontSize: 'clamp(20px, 4vw, 80px)' }}>
                                    <WordByWordReveal
                                        text="From conceptualization to deployment, I deliver end-to-end solutions that scale"
                                        baseDelay={0.25} stagger={0.035} duration={0.55}
                                    />
                                </div>

                                <BlurReveal delay={1.2}>
                                    <p className="text-[#80838e] max-w-[784px]" style={{ fontSize: 'clamp(12px, 1.1vw, 26px)' }}>
                                        My toolkit includes modern JavaScript frameworks, robust backend architectures, and an eye for design. I've worked on diverse projects ranging from smart home integrations to complex data visualizations.
                                    </p>
                                </BlurReveal>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
