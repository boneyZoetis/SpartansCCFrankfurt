import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Calendar, MapPin, Search, Filter, PlayCircle, X } from 'lucide-react';

export default function MatchSection() {
    const [allMatches, setAllMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [showConstructionModal, setShowConstructionModal] = useState(false);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // All, Upcoming, Completed, Live
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetch(API_URL + '/api/matches')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Sort: Live, then Upcoming (asc), then Completed (desc)
                    const live = data.filter(m => m.status === 'Live');
                    const upcoming = data.filter(m => m.status === 'Upcoming').sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate));
                    const completed = data.filter(m => m.status === 'Completed').sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));

                    const sortedFullList = [...live, ...upcoming, ...completed];
                    setAllMatches(sortedFullList);

                    // Initial view: Priority Live -> Upcoming -> Completed (Limit 4 total)
                    let initialView = [...live];

                    // Fill remaining slots with upcoming
                    if (initialView.length < 4) {
                        initialView = [...initialView, ...upcoming.slice(0, 4 - initialView.length)];
                    }

                    // Fill remaining slots with completed
                    if (initialView.length < 4) {
                        initialView = [...initialView, ...completed.slice(0, 4 - initialView.length)];
                    }

                    setFilteredMatches(initialView);
                } else {
                    setAllMatches([]);
                }
            })
            .catch(err => {
                console.error("Error fetching matches:", err);
                setAllMatches([]);
            });
    }, []);

    // Effect to handle filtering
    useEffect(() => {
        let result = allMatches;

        // 1. Filter by Status
        if (statusFilter !== 'All') {
            result = result.filter(match => match.status === statusFilter);
        }

        // 2. Filter by Search Query (Opponent or Venue)
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(match =>
                match.opponent.toLowerCase().includes(lowerQuery) ||
                match.venue.toLowerCase().includes(lowerQuery)
            );
        }

        // If no filters active, just show specific default view: Priority Live -> Upcoming -> Completed (Limit 4)
        if (statusFilter === 'All' && searchQuery === '') {
            const live = allMatches.filter(m => m.status === 'Live');
            const upcoming = allMatches.filter(m => m.status === 'Upcoming').sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate));
            const completed = allMatches.filter(m => m.status === 'Completed').sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));

            let defaultView = [...live];

            // User Logic:
            // 1. If Live exists: take 2 upcoming, rest completed. (e.g. 1 Live -> 2 Upcoming, 1 Completed)
            // 2. If No Live: take 2 upcoming, 2 completed.

            // We can generalize: always take up to 2 Upcoming first, then fill rest with Completed.
            // If we run out of one type, we fill with the other to ensure 4 cards if possible.

            const MAX_SLOTS = 4;

            // We already have 'live' matches in defaultView.

            // Step 1: Add up to 2 Upcoming matches
            const upcomingToAdd = upcoming.slice(0, 2);
            defaultView = [...defaultView, ...upcomingToAdd];

            // Step 2: Fill remaining slots with Completed matches
            let slotsRemaining = MAX_SLOTS - defaultView.length;
            if (slotsRemaining > 0) {
                defaultView = [...defaultView, ...completed.slice(0, slotsRemaining)];
            }

            // Step 3: (Fallback) If we still have space (e.g. not enough completed matches), 
            // try to add more Upcoming matches (those we skipped in Step 1)
            slotsRemaining = MAX_SLOTS - defaultView.length;
            if (slotsRemaining > 0 && upcoming.length > 2) {
                const moreUpcoming = upcoming.slice(2, 2 + slotsRemaining);
                defaultView = [...defaultView, ...moreUpcoming];
            }

            // Step 4: (Fallback) If still space, add more Completed (if we skipped any - unlikely given Step 2 unless logic changed)
            // But just in case we change quotas later, it's good to have a generic filler.
            // For now, Step 2 took all needed completed matches.

            setFilteredMatches(defaultView);
        } else {
            setFilteredMatches(result);
        }

    }, [searchQuery, statusFilter, allMatches]);

    return (
        <section className="container" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '6px', height: '32px', backgroundColor: 'var(--secondary-color)', borderRadius: '4px' }}></div>
                    <h3 style={{
                        fontSize: '2rem', // Reduced from 2.5rem
                        margin: 0,
                        fontWeight: '800',
                        background: 'linear-gradient(45deg, var(--primary-color), #2563eb)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Match Fixtures
                    </h3>
                </div>

                {/* Search & Filter Controls */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search..." // Shortened placeholder
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '0.5rem 0.5rem 0.5rem 2rem', // Reduced padding
                                borderRadius: '20px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.85rem',
                                minWidth: '150px' // Reduced width
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Filter size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: '0.5rem 0.5rem 0.5rem 2rem', // Reduced padding
                                borderRadius: '20px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Live">Live</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {Array.isArray(filteredMatches) && filteredMatches.length > 0 ? (
                    filteredMatches.map(match => (
                        <div key={match.id} style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'white',
                            padding: '1rem 1.5rem', // Reduced padding
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            borderLeft: match.status === 'Completed' ? '5px solid #10b981' : (match.status === 'Live' ? '5px solid #ef4444' : '5px solid var(--primary-color)')
                        }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b7280', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={14} />
                                        <span>{match.matchDate ? new Date(match.matchDate).toLocaleDateString() : 'TBA'}</span>
                                    </div>
                                    <span>•</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={14} />
                                        <span>{match.venue}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>Spartans</div> {/* Reduced font size */}
                                    <div style={{ color: '#9ca3af', fontWeight: '600', fontSize: '0.9rem' }}>{match.result === 'VS' ? 'VS' : 'vs'}</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{match.opponent}</div> {/* Reduced font size */}
                                </div>
                                {match.result !== 'VS' && <div style={{ marginTop: '0.4rem', color: '#4b5563', fontStyle: 'italic', fontSize: '0.9rem' }}>{match.result}</div>}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', minWidth: '120px', marginTop: '0.5rem' }}>
                                {match.status === 'Live' && (
                                    <button
                                        onClick={() => setShowConstructionModal(true)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '0.35rem 0.8rem',
                                            backgroundColor: '#dc2626',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
                                            transition: 'all 0.2s ease',
                                            letterSpacing: '0.5px'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <PlayCircle size={14} /> WATCH
                                    </button>
                                )}
                                <span style={{
                                    padding: '0.3rem 0.8rem', // Reduced padding
                                    borderRadius: '9999px',
                                    backgroundColor: match.status === 'Completed' ? '#d1fae5' : (match.status === 'Live' ? '#fee2e2' : '#e0f2fe'),
                                    color: match.status === 'Completed' ? '#047857' : (match.status === 'Live' ? '#b91c1c' : '#0369a1'),
                                    fontWeight: '700',
                                    fontSize: '0.85rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    {match.status === 'Live' && <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#b91c1c' }}></span>}
                                    {match.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem', backgroundColor: 'white', borderRadius: '12px' }}>
                        No matches found matching your filters.
                    </div>
                )}
            </div>

            {/* Show view all hints if filtered */}
            {statusFilter === 'All' && searchQuery === '' && allMatches.length > 5 && (
                <div style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    Showing default view (2 upcoming, 2 recent). Use search or filters to find specific games.
                </div>
            )}
            {/* Simple Under Construction Modal */}
            {showConstructionModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowConstructionModal(false)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>Live Streaming</h3>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                        <p style={{ color: '#6b7280', lineHeight: '1.5' }}>
                            This feature is currently under construction. Please check back later!
                        </p>
                        <button
                            onClick={() => setShowConstructionModal(false)}
                            style={{
                                marginTop: '1.5rem',
                                padding: '0.6rem 1.5rem',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
