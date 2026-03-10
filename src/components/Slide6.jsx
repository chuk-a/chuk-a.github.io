import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Slide6({ isActive, activationCount }) {
    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-black">
            <video
                src="/capture-8.webm"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <div key={activationCount} className="relative z-10 w-full h-full flex flex-col pointer-events-none">
                {isActive && (
                    <div className="pointer-events-auto w-full h-full flex flex-col pt-[3.5%]">
                        {/* Top Bar */}
                        <div className="px-[5%] flex justify-between items-start w-full">
                            <Logo />
                            <div className="text-[#80838e] text-[20px] leading-[1.4]">06</div>
                        </div>

                        {/* Divider */}
                        <div className="mt-6 px-[5%] w-full">
                            <div className="bg-white/15 h-px w-full" />
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Text content centered */}
                        <div className="w-full px-[5%] pb-[10%] flex flex-col items-center justify-center text-center">
                            <div className="text-[#80838e] mb-4 drop-shadow-md" style={{ fontSize: 'clamp(14px, 1.5vw, 24px)' }}>
                                End of Presentation
                            </div>

                            <div className="text-white leading-[1.04] mb-8 font-heading drop-shadow-lg" style={{ fontSize: 'clamp(32px, 6vw, 120px)' }}>
                                Thank You
                            </div>

                            <p className="text-[#80838e] max-w-[600px] mx-auto mb-12 drop-shadow-md" style={{ fontSize: 'clamp(14px, 1.2vw, 24px)' }}>
                                I appreciate your time. Let's build the future together.
                            </p>

                            <Link
                                to="/blackhole"
                                className="px-8 py-4 bg-white text-black hover:bg-white/90 transition-all rounded-full font-medium inline-flex items-center gap-3 group"
                            >
                                View Gargantua Fullscreen
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
