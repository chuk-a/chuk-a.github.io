import './index.css';
import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GargantuaPage } from './components/GargantuaPage';
import { RadiantPage } from './components/RadiantPage';
import { IpodDannyPage } from './components/IpodDannyPage';

export function VideoBackground() {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;
            video.load();
            const attemptPlay = () => {
                video.play().catch(error => {
                    console.log("Autoplay prevented by browser:", error);
                });
            };
            attemptPlay();

            // Failsafe: attempt to play on first user interaction if blocked
            window.addEventListener('click', attemptPlay, { once: true });
            return () => window.removeEventListener('click', attemptPlay);
        }
    }, []);

    return (
        <>
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="video-background"
            >
                <source src="/gargantua.webm" type="video/webm" />
                <source src="/gargantua_hq.mp4" type="video/mp4" />
            </video>
            <div className="hero-gradient-overlay" />
        </>
    );
}

function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="nav-header">
            <div className="logo">Endurance .</div>
            
            {/* Desktop Links */}
            <div className="nav-links">
                <a href="/#hero" className="nav-link">Horizon</a>
                <Link to="/radiant" className="nav-link">Radiant</Link>
                <a href="/portfolio" className="nav-link">Mission Log</a>
                <a href="/#vessel" className="nav-link">Vessel Specs</a>
                <a href="/weather" className="nav-link">Atmospheric Data</a>
                <a href="/#contact" className="nav-link">Contact Earth</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="mobile-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-nav-links">
                    <a href="/#hero" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Horizon</a>
                    <Link to="/radiant" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Radiant</Link>
                    <a href="/portfolio" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Mission Log</a>
                    <a href="/#vessel" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Vessel Specs</a>
                    <a href="/weather" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Atmospheric Data</a>
                    <a href="/#contact" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Contact Earth</a>
                </div>
            </div>
        </nav>
    );
}

function VesselSpecs() {
    const specs = [
        { title: "Propulsion", detail: "Gravitational Singularity Drive", icon: "⚙️" },
        { title: "Velocity", detail: "0.98c (Relativistic Constant)", icon: "🚀" },
        { title: "Capacity", detail: "12 Crew + 500 Cryo-Pods", icon: "👥" },
        { title: "Endurance", detail: "Infinite (Quantum Fuel Cell)", icon: "🔋" }
    ];

    return (
        <section className="specs-section" id="vessel">
            <h2 className="section-title">Vessel Specifications</h2>
            <div className="specs-grid">
                {specs.map((spec, i) => (
                    <div key={i} className="spec-item">
                        <span className="spec-icon">{spec.icon}</span>
                        <div className="spec-info">
                            <h4>{spec.title}</h4>
                            <p>{spec.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="footer" id="contact">
            <div className="footer-content">
                <div className="footer-logo">Endurance .</div>
                <div className="footer-text">© 2167 interstellar exploration corp. all rights reserved.</div>
                <div className="footer-links">
                    <a href="/weather">Weather Feed</a>
                    <a href="#">Privacy Protocol</a>
                    <a href="#">Security Clearing</a>
                    <a href="#">Signal Support</a>
                </div>
            </div>
        </footer>
    );
}

function LandingPage() {
    useEffect(() => {
        // Smooth scroll behavior fallback for older browsers
        document.querySelectorAll('a[href^="/#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                const id = href.substring(1);
                const element = document.querySelector(id);
                if (element) {
                    e.preventDefault();
                    element.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }, []);

    return (
        <div className="app-container">
            <NavBar />

            {/* Hero Section */}
            <section className="hero-section" id="hero">
                <VideoBackground />

                <div className="hero-content">
                    <h1 className="hero-title">GARGANTUA</h1>
                    <p className="hero-subtitle">Explore the Singularity</p>
                    <button className="cta-button" onClick={() => document.getElementById('mission').scrollIntoView({ behavior: 'smooth' })}>
                        Initiate Launch
                    </button>
                </div>
            </section>

            {/* Content Section (Glassmorphism Cards) */}
            <section className="content-section" id="mission">
                <div className="commander-profile">
                    <div className="profile-label">Mission Commander</div>
                    <h2 className="commander-name">Chuka</h2>
                    <p className="commander-bio">Lead Explorer of the Endurance Mission. Tasked with navigating the singularity and ensuring the survival of the human species through the manipulation of gravity and time.</p>
                </div>

                <h2 className="section-title">Mission Log</h2>
                <div className="feature-grid">

                    <div className="feature-card" style={{ animation: "float 6s ease-in-out infinite" }}>
                        <div className="feature-icon">✧</div>
                        <h3 className="feature-title">Relativity Drive</h3>
                        <p className="feature-text">
                            Harness the immense gravitational field of Gargantua. Time dilation protocols ensure maximum efficiency during deep-space operations.
                        </p>
                    </div>

                    <div className="feature-card" style={{ animation: "float 6s ease-in-out infinite 1s" }}>
                        <div className="feature-icon">⌬</div>
                        <h3 className="feature-title">Tesseract Interface</h3>
                        <p className="feature-text">
                            Communicate across dimensions. Our proprietary 5th-dimensional bridging technology allows data transfer regardless of spacetime coordinates.
                        </p>
                    </div>

                    <div className="feature-card" style={{ animation: "float 6s ease-in-out infinite 2s" }}>
                        <div className="feature-icon">❖</div>
                        <h3 className="feature-title">Cryo-Stasis</h3>
                        <p className="feature-text">
                            Experience zero biological degradation. State-of-the-art life support systems preserve crew viability across millennial voyages.
                        </p>
                    </div>

                </div>
            </section>

            {/* Vessel Specs Section */}
            <VesselSpecs />

            {/* Footer */}
            <Footer />
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/blackhole" element={<GargantuaPage />} />
                <Route path="/radiant" element={<RadiantPage />} />
                <Route path="/ipod-danny" element={<IpodDannyPage />} />
            </Routes>
        </Router>
    );
}

export default App;
