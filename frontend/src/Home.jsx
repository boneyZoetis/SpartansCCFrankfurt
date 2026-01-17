import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import PlayerSection from './components/PlayerSection';
import MatchSection from './components/MatchSection';
import RegistrationForm from './components/RegistrationForm';
import MediaSection from './components/MediaSection';
import AchievementsCarousel from './components/AchievementsCarousel';
import { API_URL } from './config';

function Home() {
  const [healthCheck, setHealthCheck] = useState(null);
  const [clubStats, setClubStats] = useState({ matchesWon: '50+', activePlayers: '120', championships: '5' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then(res => res.text())
      .then(data => setHealthCheck(data))
      .catch(() => setHealthCheck('Backend not running'));

    fetch(`${API_URL}/api/stats`)
      .then(res => res.json())
      .then(data => {
        if (data) setClubStats(data);
      })
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Close menu on mobile after click
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header className="home-header">
        <div className="container">
          <h1 className="home-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/spartans-logo-transparent.png"
              alt="Spartans Logo"
              style={{
                height: '75px', // Slightly larger to match new bar height
                marginRight: '15px',
                filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.3))'
              }}
            />
            <span style={{
              fontFamily: '"Impact", "Arial Black", sans-serif',
              fontSize: '2.5rem', // Restored text size
              letterSpacing: '2px',
              textTransform: 'uppercase',
              // Keeping the Premium Styling
              background: 'linear-gradient(180deg, #FFFFFF 20%, #B0C4DE 50%, #FFFFFF 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '1px #1e3a8a',
              filter: 'drop-shadow(2px 2px 0px #000000)' // Slightly smaller shadow
            }}>
              Spartans
            </span>
          </h1>

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            ☰
          </button>

          <nav className={`home-nav ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><button onClick={() => scrollToSection('home')} className="nav-btn">Home</button></li>
              <li><button onClick={() => scrollToSection('about')} className="nav-btn">About</button></li>
              <li><button onClick={() => scrollToSection('media')} className="nav-btn">Media</button></li>
              <li><button onClick={() => scrollToSection('matches')} className="nav-btn">Matches</button></li>
              <li><button onClick={() => scrollToSection('team')} className="nav-btn">Team</button></li>
              <li><button onClick={() => scrollToSection('join')} className="nav-btn highlight">Join Us</button></li>
              <li className="admin-menu-item"><Link to="/login" className="nav-btn" style={{ opacity: 0.6 }}>Admin</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <h2 className="hero-title">
            Welcome to Spartans Cricket Club
          </h2>
          <p className="hero-subtitle">
            Champions on and off the field
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => scrollToSection('matches')}
              className="btn btn-secondary"
              style={{ fontSize: '1rem', padding: '12px 30px' }}
            >
              View Fixtures
            </button>
            <button
              onClick={() => scrollToSection('team')}
              style={{
                background: 'transparent',
                color: 'white',
                padding: '12px 30px',
                fontSize: '1rem',
                fontWeight: '600',
                border: '2px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Meet the Team
            </button>
            <button
              onClick={() => scrollToSection('matches')}
              style={{
                background: '#dc2626', // Red color for Live
                color: 'white',
                padding: '12px 30px',
                fontSize: '1rem',
                fontWeight: '600',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%', display: 'inline-block' }}></span>
              Live Streaming
            </button>
          </div>

          {/* Affiliations */}
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <img
                src="/hcv-logo-transparent.png"
                alt="Hessischer Cricket-Verband"
                style={{ height: '80px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))', opacity: 0.85 }}
              />
              <img
                src="/dcb-logo.png"
                alt="Deutscher Cricket Bund"
                style={{ height: '80px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))', opacity: 0.6 }}
              />
            </div>
            <p style={{
              color: 'white',
              fontSize: '0.9rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              An official member of the Hessischer Cricket-Verband and the Deutscher Cricket Bund
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-section">
        <div className="container stats-container">
          <div className="stat-item">
            <div className="stat-number">{clubStats.matchesWon}+</div>
            <div className="stat-label">Matches Won</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">{clubStats.activePlayers}</div>
            <div className="stat-label">Active Players</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">{clubStats.championships}</div>
            <div className="stat-label">Championships</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '4rem 0', backgroundColor: 'white', scrollMarginTop: '5rem' }}>
        <div className="container">
          <h3 className="text-center mb-4" style={{ fontSize: '3rem', fontWeight: '800', color: '#1e3a8a' }}>
            About Us
          </h3>
          <div className="row justify-content-center mb-5">
            <div className="col-lg-12" style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#333', textAlign: 'center' }}>
              <p className="mb-4">
                Founded in 2021, the Frankfurt Spartans Cricket Club emerged from a shared passion for cricket and an unbreakable team spirit. We are proudly registered under TSV 05 Trebur Verein, giving us a strong foundation within the German sporting community.
              </p>
              <button
                onClick={() => setShowAboutModal(true)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#1e3a8a',
                  border: '2px solid #1e3a8a',
                  padding: '10px 25px',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#1e3a8a'; e.target.style.color = 'white'; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#1e3a8a'; }}
              >
                Read Our Story
              </button>
            </div>
          </div>
          <AchievementsCarousel />
        </div>
      </section>

      {/* Media Section */}
      <div id="media" style={{ paddingBottom: '2rem', scrollMarginTop: '5.5rem' }}>
        <MediaSection />
      </div>

      {/* Matches Section */}
      <div id="matches" style={{ padding: '1.5rem 0', backgroundColor: '#f9fafb', scrollMarginTop: '5.5rem' }}>
        <MatchSection />
      </div>

      {/* Team Section */}
      <div id="team" style={{ scrollMarginTop: '5.5rem' }}>
        <PlayerSection />
      </div>

      {/* Join Us Section */}
      <div id="join" style={{ backgroundColor: 'white', scrollMarginTop: '5.5rem' }}>
        <RegistrationForm />
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--primary-color)', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
        <div className="container">
          <p>&copy; 2025 Spartans Cricket Club. All rights reserved.</p>
        </div>
      </footer>

      {/* About Us Modal */}
      {showAboutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          backdropFilter: 'blur(5px)'
        }}
          onClick={() => setShowAboutModal(false)}
        >
          <div style={{
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '16px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAboutModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '25px',
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#6b7280',
                lineHeight: 1
              }}
            >
              &times;
            </button>

            <h3 style={{ color: '#1e3a8a', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: '800', textAlign: 'center' }}>Our Story</h3>

            <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4b5563', textAlign: 'justify' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Founded in 2021, the Frankfurt Spartans Cricket Club emerged from a shared passion for cricket and an unbreakable team spirit. We are proudly registered under TSV 05 Trebur Verein, giving us a strong foundation within the German sporting community.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                From humble beginnings, the Spartans have grown into a close‑knit team that blends passion, discipline, and camaraderie both on and off the pitch. Our members come from diverse backgrounds, together representing the vibrant multicultural spirit of modern cricket in Germany.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                We actively compete in local and regional leagues, friendly matches, and special tournaments, always striving to deliver our best game while embracing the joy of cricket. Beyond competition, we nurture every player’s journey, from newcomers discovering cricket to seasoned athletes refining their skills, through structured training, mentorship, and match‑day experience.
              </p>
              <p>
                Our dedication goes beyond the boundary ropes. The Spartans proudly contribute to local events, youth programs, and cricket development initiatives, working to grow the sport and inspire the next generation of cricketers.
              </p>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                onClick={() => setShowAboutModal(false)}
                style={{
                  backgroundColor: '#1e3a8a',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
