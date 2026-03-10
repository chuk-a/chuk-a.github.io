import React from 'react';
import { BackgroundVideo } from './BackgroundVideo';
import { Logo } from './Logo';
import { BlurReveal, SlideUpLine } from './AnimatedText';

export function Slide1({ isActive, activationCount }) {
    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden">
            <BackgroundVideo
                src="https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div key={activationCount} className="relative z-10 w-full h-full flex flex-col pointer-events-none">
                {isActive && (
                    <div className="pointer-events-auto w-full h-full flex flex-col">
                        {/* Top Bar */}
                        <BlurReveal delay={0.1} className="px-[5%] pt-[3.5%] flex justify-between items-start w-full">
                            <Logo />
                            <div className="flex gap-8">
                                {[
                                    { label: "Role", value: "Creative Developer" },
                                    { label: "Focus", value: "Full-Stack & UI/UX" },
                                    { label: "Location", value: "Global" },
                                    { label: "Status", value: "Building things" },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-[2px]">
                                        <span className="text-[#80838e] text-[13px]">{item.label}</span>
                                        <span className="text-white text-[13px]">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </BlurReveal>

                        {/* Divider */}
                        {isActive && (
                            <div className="px-[5%] mt-6 w-full">
                                <div className="bg-white/15 h-px w-full" />
                            </div>
                        )}

                        {/* Title text */}
                        <div className="flex-1 flex items-end px-[5%] pb-[8%]">
                            <h1 className="text-white leading-[0.9] tracking-tight font-heading" style={{ fontSize: 'clamp(48px, 10vw, 140px)' }}>
                                <SlideUpLine delay={0.3} duration={0.7}>Chuka's</SlideUpLine>
                                <br />
                                <SlideUpLine delay={0.4} duration={0.7}>Portfolio</SlideUpLine>
                            </h1>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
