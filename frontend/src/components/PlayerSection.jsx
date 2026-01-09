import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function PlayerSection() {
    const [players, setPlayers] = useState([]);
    const [flippedId, setFlippedId] = useState(null);

    useEffect(() => {
        fetch(API_URL + '/api/players')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPlayers(data);
                } else {
                    console.error("API returned non-array:", data);
                    setPlayers([]);
                }
            })
            .catch(err => {
                console.error(err);
                setPlayers([]);
            });
    }, []);

    const handleCardClick = (id) => {
        setFlippedId(flippedId === id ? null : id);
    };

    return (
        <section style={{ padding: '4rem 0', backgroundColor: '#f3f4f6', width: '100%' }}>
            <div className="container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
                <h3 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', color: 'var(--primary-color)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    Meet The Squad
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
                    {Array.isArray(players) && players.length > 0 ? (
                        players.map(player => (
                            <div
                                key={player.id}
                                className={`flip-card ${flippedId === player.id ? 'flipped' : ''}`}
                                onClick={() => handleCardClick(player.id)}
                            >
                                <div className="flip-card-inner">
                                    {/* Front Side */}
                                    <div className="flip-card-front">
                                        <div style={{ height: '75%', position: 'relative' }}>
                                            <img
                                                src={player.imageUrl || 'https://via.placeholder.com/300x300?text=Player'}
                                                alt={player.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                                padding: '2rem 1rem 0.5rem 1rem',
                                                color: 'white'
                                            }}>
                                                <h4 style={{ margin: 0, fontSize: '1.4rem' }}>{player.name}</h4>
                                                <span style={{ color: 'var(--secondary-color)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>{player.role}</span>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '25%', backgroundColor: 'var(--primary-color)', color: 'white' }}>
                                            <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Tap to view stats</div>
                                        </div>
                                    </div>

                                    {/* Back Side */}
                                    <div className="flip-card-back">
                                        <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem' }}>{player.name}</h4>
                                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{player.role}</p>

                                        <div style={{ width: '100%' }}>
                                            <div className="stat-row">
                                                <span className="stat-label">Batting Style</span>
                                                <span className="stat-value">{player.battingStyle}</span>
                                            </div>
                                            <div className="stat-row">
                                                <span className="stat-label">Bowling Style</span>
                                                <span className="stat-value">{player.bowlingStyle}</span>
                                            </div>
                                            <div className="stat-row">
                                                <span className="stat-label">Matches</span>
                                                <span className="stat-value">{player.matches}</span>
                                            </div>
                                            <div className="stat-row">
                                                <span className="stat-label">Runs</span>
                                                <span className="stat-value">{player.runs}</span>
                                            </div>
                                            <div className="stat-row">
                                                <span className="stat-label">Wickets</span>
                                                <span className="stat-value">{player.wickets}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                            No players found. The squad is resting!
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
