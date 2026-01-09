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
            <div className="col-lg-8 text-center" style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#333' }}>
              <p className="mb-4">
                Founded in 2010, Spartans Cricket Club has been a cornerstone of our community's sporting excellence.
                We bring together passionate cricketers of all skill levels, fostering talent and sportsmanship.
              </p>
              <p>
                With state-of-the-art facilities and experienced coaches, we provide the perfect environment for
                players to develop their skills and compete at the highest levels.
              </p>
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
    </div>
  )
}

export default Home
