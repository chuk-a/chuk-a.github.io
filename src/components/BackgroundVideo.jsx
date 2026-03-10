import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function BackgroundVideo({ src, className = '', style = {} }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        // Strictly enforce muted to appease browser autoplay policies dynamically
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;

        let hls;

        const playVideo = async () => {
            try {
                await video.play();
            } catch (err) {
                console.error("Autoplay failed:", err);
            }
        };

        if (Hls.isSupported()) {
            hls = new Hls({ autoStartLoad: true });
            hls.attachMedia(video);

            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                hls.loadSource(src);
            });

            hls.on(Hls.Events.MANIFEST_PARSED, playVideo);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari fallback
            video.src = src;
            video.addEventListener('loadedmetadata', playVideo);
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
            if (video) {
                video.removeEventListener('loadedmetadata', playVideo);
            }
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            className={className}
            style={style}
            autoPlay
            muted
            loop
            playsInline
        />
    );
}
