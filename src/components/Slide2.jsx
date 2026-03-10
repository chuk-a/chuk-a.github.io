import React from 'react';
import { BackgroundVideo } from './BackgroundVideo';
import { Logo } from './Logo';
import { BlurReveal, WordByWordReveal } from './AnimatedText';
import { StatCard } from './StatCard';

export function Slide2({ isActive, activationCount }) {
    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden">
            <BackgroundVideo
                src="https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8"
                className="absolute inset-0 w-full h-full object-cover"
                isActive={isActive}
            />

            <div key={activationCount} className="relative z-10 w-full h-full flex flex-col pointer-events-none">
                {isActive && (
                    <div className="pointer-events-auto w-full h-full flex flex-col relative pt-[3.5%]">
                        {/* Top Bar */}
                        <BlurReveal delay={0.05} className="px-[5%] flex justify-between items-start w-full absolute top-[3.5%] left-0 right-0">
                            <Logo />
                            <div className="text-[#80838e] text-[20px] leading-[1.4]">02</div>
                        </BlurReveal>

                        {/* Content area */}
                        <div className="flex flex-col flex-1 justify-between pt-[4%] pb-[5%] px-[5%] mt-[36px]">

                            {/* Upper section */}
                            <div className="max-w-[85%] mt-8">
                                <BlurReveal delay={0.15}>
                                    <p
                                        className="text-[#80838e] mb-4"
                                        style={{ fontSize: 'clamp(12px, 1.2vw, 18px)' }}
                                    >
                                        My Philosophy
                                    </p>
                                </BlurReveal>

                                <h2
                                    className="text-white leading-[1.04] font-heading"
                                    style={{ fontSize: 'clamp(22px, 3.5vw, 56px)' }}
                                >
                                    <WordByWordReveal
                                        text="I build intuitive digital experiences that solve complex problems through clean code and user-centric design"
                                        baseDelay={0.25}
                                        stagger={0.035}
                                        duration={0.55}
                                    />
                                </h2>
                            </div>

                            {/* Stat cards */}
                            <div className="flex gap-4 w-full mt-12">
                                <StatCard index={0} value="100%" label="Commitment to quality" />
                                <StatCard index={1} value="24/7" label="Continuous learning" />
                                <StatCard index={2} value="∞" label="Creative solutions" />
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
