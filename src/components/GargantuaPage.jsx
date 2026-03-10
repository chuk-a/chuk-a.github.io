import React from 'react';
import { BlackHole } from './BlackHole';
import { Link } from 'react-router-dom';

export function GargantuaPage() {
    return (
        <div className="w-full h-screen relative bg-black font-sans overflow-hidden">
            <BlackHole
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute top-8 left-8 z-10 pointer-events-auto">
                <Link to="/" className="text-white/60 hover:text-white transition-colors text-sm mix-blend-difference flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to Presentation
                </Link>
            </div>
        </div>
    );
}
