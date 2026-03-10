import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function BackgroundVideo({ src, className = '', style = {}, isActive = true }) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;

        const performPlay = async () => {
            if (!isActive || !video) return;
            try {
                video.muted = true;
                const promise = video.play();
                if (promise) await promise;
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Autoplay blocked:', err);
            }
        };

        const setupVideo = () => {
            if (Hls.isSupported()) {
                if (hlsRef.current) hlsRef.current.destroy();
                const hls = new Hls({ autoStartLoad: true, enableWorker: false });
                hlsRef.current = hls;
                hls.attachMedia(video);
                hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(src));
                hls.on(Hls.Events.MANIFEST_PARSED, performPlay);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.addEventListener('loadedmetadata', performPlay);
            }
        };

        const teardownVideo = () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            if (video) {
                video.pause();
                video.removeAttribute('src');
                video.load();
                video.removeEventListener('loadedmetadata', performPlay);
            }
        };

        if (isActive) {
            setupVideo();
            performPlay();
        } else {
            teardownVideo();
        }

        return teardownVideo;
    }, [src, isActive]);

    return (
        <video
            ref={videoRef}
            className={className}
            style={style}
            muted
            loop
            playsInline
        />
    );
}
