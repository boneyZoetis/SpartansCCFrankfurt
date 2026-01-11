import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('matches'); // 'matches' or 'players'
    const [matches, setMatches] = useState([]);
    const [players, setPlayers] = useState([]);
    const [playerSearchQuery, setPlayerSearchQuery] = useState({ text: '', filter: 'active' });
    const [gallerySearchQuery, setGallerySearchQuery] = useState('');

    // Modal State
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);

    const [stats, setStats] = useState({
        matchesWon: 0,
        activePlayers: 0,
        championships: 0
    });

    const [statsForm, setStatsForm] = useState({
        matchesWon: 0,
        activePlayers: 0,
        championships: 0
    });

    const [achievements, setAchievements] = useState([]);
    const [showAchievementModal, setShowAchievementModal] = useState(false);

    // Gallery State
    const [galleryItems, setGalleryItems] = useState([]);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [galleryForm, setGalleryForm] = useState({
        category: '',
        subCategory: '',
        caption: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [existingCategories, setExistingCategories] = useState([]);

    const [achievementForm, setAchievementForm] = useState({
        title: '',
        achievementYear: '',
        type: 'TROPHY'
    });

    // Form State
    const [matchForm, setMatchForm] = useState({
        opponent: '',
        matchDate: '',
        matchTime: '',
        venue: '',
        status: 'Upcoming', // Default
        result: 'VS'
    });
    // Add edit state for matches
    const [editingMatchId, setEditingMatchId] = useState(null);

    const [playerForm, setPlayerForm] = useState({
        name: '',
        role: 'Batsman',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm medium',
        matches: 0,
        runs: 0,
        wickets: 0,
        imageUrl: '' // Only used for displaying existing image
    });
    const [selectedPlayerFile, setSelectedPlayerFile] = useState(null);

    // Add edit state for players
    const [editingPlayerId, setEditingPlayerId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/login');
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const matchesRes = await fetch(API_URL + '/api/matches');
            const matchesData = await matchesRes.json();
            // Sort matches: Newest first (Descending order of date)
            matchesData.sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));
            setMatches(matchesData);

            const playersRes = await fetch(API_URL + '/api/players');
            const playersData = await playersRes.json();
            setPlayers(playersData);

            const statsRes = await fetch(API_URL + '/api/stats');
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                if (statsData) {
                    setStats({
                        matchesWon: statsData.matchesWon,
                        activePlayers: statsData.activePlayers,
                        championships: statsData.championships
                    });
                }
            }

            const achievementsRes = await fetch(API_URL + '/api/achievements');
            const achievementsData = await achievementsRes.json();
            setAchievements(achievementsData);

            // Fetch Gallery Items
            const galleryRes = await fetch(API_URL + '/api/gallery');
            const galleryData = await galleryRes.json();
            setGalleryItems(galleryData);

            // Extract unique categories
            const categories = [...new Set(galleryData.map(item => item.category))];
            setExistingCategories(categories);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleStatsSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting stats:", statsForm); // DEBUG
        try {
            const res = await fetch(API_URL + '/api/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(statsForm)
            });
            if (res.ok) {
                setShowStatsModal(false);
                alert('Stats updated successfully!');
                fetchData();
            } else {
                alert('Failed to update stats');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating stats');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };

    const deleteMatch = async (id) => {
        if (window.confirm('Are you sure you want to delete this match?')) {
            await fetch(`${API_URL}/api/matches/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    const deletePlayer = async (id) => {
        if (window.confirm('Are you sure you want to delete this player?')) {
            await fetch(`${API_URL}/api/players/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    const handleMatchSubmit = async (e) => {
        e.preventDefault();
        // Combine date and time to ISO format
        // Assuming matchDate is YYYY-MM-DD and matchTime is HH:MM
        const dateTime = `${matchForm.matchDate}T${matchForm.matchTime || '00:00'}:00`;

        const payload = { ...matchForm, matchDate: dateTime };
        // Remove temporary time field from payload
        delete payload.matchTime;

        try {
            let url = API_URL + '/api/matches';
            let method = 'POST';

            if (editingMatchId) {
                url = `${API_URL}/api/matches/${editingMatchId}`;
                method = 'PUT';
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowMatchModal(false);
                setMatchForm({ opponent: '', matchDate: '', matchTime: '', venue: '', status: 'Upcoming', result: 'VS' });
                setEditingMatchId(null);
                fetchData();
            } else {
                alert('Failed to save match');
            }
        } catch (error) {
            console.error(error);
            alert('Error adding match');
        }
    };

    const handlePlayerSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', playerForm.name);
        formData.append('role', playerForm.role);
        formData.append('battingStyle', playerForm.battingStyle);
        formData.append('bowlingStyle', playerForm.bowlingStyle);
        formData.append('matches', playerForm.matches);
        formData.append('runs', playerForm.runs);
        formData.append('wickets', playerForm.wickets);

        if (selectedPlayerFile) {
            formData.append('image', selectedPlayerFile);
        }

        try {
            let url = API_URL + '/api/players';
            let method = 'POST';

            if (editingPlayerId) {
                url = `${API_URL}/api/players/${editingPlayerId}`;
                method = 'PUT';
            }

            const res = await fetch(url, {
                method: method,
                // Content-Type is auto-set for FormData
                body: formData
            });

            if (res.ok) {
                setShowPlayerModal(false);
                setPlayerForm({ name: '', role: 'Batsman', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm medium', matches: 0, runs: 0, wickets: 0, imageUrl: '' });
                setSelectedPlayerFile(null);
                setEditingPlayerId(null);
                fetchData();
            } else {
                alert('Failed to save player');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving player');
        }
    };

    const deleteAchievement = async (id) => {
        if (window.confirm('Are you sure you want to delete this achievement?')) {
            await fetch(`${API_URL}/api/achievements/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    const handleAchievementSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(API_URL + '/api/achievements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(achievementForm)
            });
            if (res.ok) {
                setShowAchievementModal(false);
                setAchievementForm({ title: '', achievementYear: '', type: 'TROPHY' });
                fetchData();
            } else {
                alert('Failed to add achievement');
            }
        } catch (error) {
            console.error(error);
            alert('Error adding achievement');
        }
    };

    const handleGallerySubmit = async (e) => {
        e.preventDefault();
        const categoryToUse = isNewCategory ? newCategory : galleryForm.category;

        if (!categoryToUse) {
            alert("Please select or enter a category");
            return;
        }
        if (!selectedFile) {
            alert("Please select an image file");
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('caption', galleryForm.caption);
        formData.append('category', categoryToUse);
        if (galleryForm.subCategory) {
            formData.append('subCategory', galleryForm.subCategory);
        }

        try {
            const res = await fetch(API_URL + '/api/gallery', {
                method: 'POST',
                // Content-Type header is auto-set by browser for FormData
                body: formData
            });
            if (res.ok) {
                setShowGalleryModal(false);
                setGalleryForm({ category: '', subCategory: '', caption: '' });
                setSelectedFile(null);
                setNewCategory('');
                setIsNewCategory(false);
                fetchData();
            } else {
                alert('Failed to add gallery item');
            }
        } catch (error) {
            console.error(error);
            alert('Error adding gallery item');
        }
    };

    const deleteGalleryItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            await fetch(`${API_URL}/api/gallery/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    return (
        <div style={{ fontFamily: '"Inter", sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Top Header */}
            <header style={{
                backgroundColor: '#7c3aed', // Purple as per screenshot
                color: 'white',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>⚡ Spartans Admin Dashboard</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>

                    <button
                        onClick={handleLogout}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Tabs */}
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('matches')}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: activeTab === 'matches' ? '#7c3aed' : 'white',
                            color: activeTab === 'matches' ? 'white' : '#374151',
                            border: activeTab === 'matches' ? 'none' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        Matches
                    </button>
                    <button
                        onClick={() => setActiveTab('players')}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: activeTab === 'players' ? '#7c3aed' : 'white',
                            color: activeTab === 'players' ? 'white' : '#374151',
                            border: activeTab === 'players' ? 'none' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        Players
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: activeTab === 'stats' ? '#7c3aed' : 'white',
                            color: activeTab === 'stats' ? 'white' : '#374151',
                            border: activeTab === 'stats' ? 'none' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        Club Stats
                    </button>
                    <button
                        onClick={() => setActiveTab('achievements')}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: activeTab === 'achievements' ? '#7c3aed' : 'white',
                            color: activeTab === 'achievements' ? 'white' : '#374151',
                            border: activeTab === 'achievements' ? 'none' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        Achievements
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: activeTab === 'gallery' ? '#7c3aed' : 'white',
                            color: activeTab === 'gallery' ? 'white' : '#374151',
                            border: activeTab === 'gallery' ? 'none' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        Gallery
                    </button>
                </div>

                {/* Content Area */}
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>
                            {activeTab === 'matches' ? 'Manage Matches' :
                                activeTab === 'players' ? 'Manage Players' :
                                    activeTab === 'achievements' ? 'Manage Achievements' :
                                        activeTab === 'gallery' ? 'Manage Gallery' : 'Manage Club Stats'}
                        </h2>
                        {activeTab !== 'stats' && (
                            <button
                                onClick={() => {
                                    if (activeTab === 'matches') {
                                        setMatchForm({ opponent: '', matchDate: '', matchTime: '', venue: '', status: 'Upcoming', result: 'VS' });
                                        setEditingMatchId(null);
                                        setShowMatchModal(true);
                                    }
                                    else if (activeTab === 'players') {
                                        setPlayerForm({ name: '', role: 'Batsman', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm medium', matches: 0, runs: 0, wickets: 0, imageUrl: '' });
                                        setSelectedPlayerFile(null);
                                        setEditingPlayerId(null);
                                        setShowPlayerModal(true);
                                    }
                                    else if (activeTab === 'achievements') setShowAchievementModal(true);
                                    else if (activeTab === 'gallery') setShowGalleryModal(true);
                                }}
                                style={{
                                    backgroundColor: '#7c3aed',
                                    color: 'white',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                + Add {activeTab === 'matches' ? 'Match' : activeTab === 'players' ? 'Player' : activeTab === 'gallery' ? 'Image' : 'Achievement'}
                            </button>
                        )}
                    </div>

                    {/* Search Bar for Players */}
                    {activeTab === 'players' && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="text"
                                placeholder="Search players by name..."
                                value={playerSearchQuery.text}
                                onChange={(e) => setPlayerSearchQuery(prev => ({ ...prev, text: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="text"
                                placeholder="Search gallery by Category or SubCategory..."
                                value={gallerySearchQuery}
                                onChange={(e) => setGallerySearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    )}

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                {activeTab === 'matches' ? (
                                    <>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Opponent</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Date & Time</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Venue</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Status</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Actions</th>
                                    </>
                                ) : activeTab === 'players' ? (
                                    <>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Name</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Role</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Batting Style</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Actions</th>
                                    </>
                                ) : activeTab === 'achievements' ? (
                                    <>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Title</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Year</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Type</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Actions</th>
                                    </>
                                ) : activeTab === 'gallery' ? (
                                    <>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Image</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Category</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Sub Category</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Caption</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Actions</th>
                                    </>
                                ) : (
                                    <>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Matches Won</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Active Players</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Championships</th>
                                        <th style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem', fontWeight: '600' }}>Actions</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {activeTab === 'matches' ? (
                                matches.map(match => (
                                    <tr key={match.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{match.opponent}</td>
                                        <td style={{ padding: '1rem' }}>{new Date(match.matchDate).toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>{match.venue}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                backgroundColor: match.status === 'Completed' ? '#d1fae5' : (match.status === 'Live' ? '#fee2e2' : '#dbeafe'),
                                                color: match.status === 'Completed' ? '#065f46' : (match.status === 'Live' ? '#b91c1c' : '#1e40af')
                                            }}>
                                                {match.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => {
                                                    const dateObj = new Date(match.matchDate);
                                                    const dateStr = dateObj.toISOString().split('T')[0];
                                                    const timeStr = dateObj.toTimeString().split(' ')[0].substring(0, 5);

                                                    setMatchForm({
                                                        opponent: match.opponent,
                                                        matchDate: dateStr,
                                                        matchTime: timeStr,
                                                        venue: match.venue,
                                                        status: match.status,
                                                        result: match.result || ''
                                                    });
                                                    setEditingMatchId(match.id);
                                                    setShowMatchModal(true);
                                                }}
                                                style={{ padding: '0.4rem 0.8rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => deleteMatch(match.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : activeTab === 'players' ? (
                                <>
                                    {/* Sub-tabs for Active vs Pending */}
                                    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                                        <button
                                            onClick={() => setPlayerSearchQuery(prev => ({ ...prev, filter: 'active' }))}
                                            style={{
                                                fontWeight: !playerSearchQuery.filter || playerSearchQuery.filter === 'active' ? 'bold' : 'normal',
                                                color: !playerSearchQuery.filter || playerSearchQuery.filter === 'active' ? '#7c3aed' : '#6b7280',
                                                border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem'
                                            }}
                                        >
                                            Active Players
                                        </button>
                                        <button
                                            onClick={() => setPlayerSearchQuery(prev => ({ ...prev, filter: 'pending' }))}
                                            style={{
                                                fontWeight: playerSearchQuery.filter === 'pending' ? 'bold' : 'normal',
                                                color: playerSearchQuery.filter === 'pending' ? '#eab308' : '#6b7280',
                                                border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem',
                                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                                            }}
                                        >
                                            Pending Approvals
                                            {players.filter(p => !p.approved).length > 0 && (
                                                <span style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '99px' }}>
                                                    {players.filter(p => !p.approved).length}
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                    {players
                                        .filter(player => {
                                            const matchesSearch = player.name.toLowerCase().includes((playerSearchQuery.text || '').toLowerCase());
                                            const isPending = !player.approved; // Assumes backend sends 'approved' field
                                            const showPending = playerSearchQuery.filter === 'pending';

                                            if (showPending) return isPending && matchesSearch;
                                            return !isPending && matchesSearch; // Default show active
                                        })
                                        .map(player => (
                                            <tr key={player.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: !player.approved ? '#fffbeb' : 'white' }}>
                                                <td style={{ padding: '1rem', fontWeight: '500' }}>{player.name}</td>
                                                <td style={{ padding: '1rem' }}>{player.role}</td>
                                                <td style={{ padding: '1rem' }}>{player.battingStyle}</td>
                                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                    {!player.approved && (
                                                        <button
                                                            onClick={async () => {
                                                                if (window.confirm(`Approve ${player.name} to join the squad?`)) {
                                                                    try {
                                                                        const res = await fetch(`${API_URL}/api/players/${player.id}/approve`, { method: 'PUT' });
                                                                        if (res.ok) {
                                                                            alert('Player Approved!');
                                                                            fetchData();
                                                                        } else alert('Approval failed');
                                                                    } catch (e) { console.error(e); alert('Error'); }
                                                                }
                                                            }}
                                                            style={{ padding: '0.4rem 0.8rem', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setPlayerForm(player);
                                                            setSelectedPlayerFile(null);
                                                            setEditingPlayerId(player.id);
                                                            setShowPlayerModal(true);
                                                        }}
                                                        style={{ padding: '0.4rem 0.8rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button onClick={() => deletePlayer(player.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                </>
                            ) : activeTab === 'achievements' ? (
                                achievements.map(ach => (
                                    <tr key={ach.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{ach.title}</td>
                                        <td style={{ padding: '1rem' }}>{ach.achievementYear}</td>
                                        <td style={{ padding: '1rem' }}>{ach.type}</td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => deleteAchievement(ach.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : activeTab === 'gallery' ? (
                                galleryItems
                                    .filter(item =>
                                        (item.category && item.category.toLowerCase().includes(gallerySearchQuery.toLowerCase())) ||
                                        (item.subCategory && item.subCategory.toLowerCase().includes(gallerySearchQuery.toLowerCase()))
                                    )
                                    .map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '1rem', width: '120px' }}>
                                                <img src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : API_URL + item.imageUrl) : ''} alt={item.caption} style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: '500' }}>{item.category}</td>
                                            <td style={{ padding: '1rem' }}>{item.subCategory || '-'}</td>
                                            <td style={{ padding: '1rem' }}>{item.caption}</td>
                                            <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => deleteGalleryItem(item.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{stats.matchesWon}</td>
                                    <td style={{ padding: '1rem' }}>{stats.activePlayers}</td>
                                    <td style={{ padding: '1rem' }}>{stats.championships}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => {
                                                setStatsForm(stats);
                                                setShowStatsModal(true);
                                            }}
                                            style={{ padding: '0.4rem 0.8rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {((activeTab === 'matches' && matches.length === 0) || (activeTab === 'players' && players.length === 0) || (activeTab === 'gallery' && galleryItems.length === 0)) && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                            No {activeTab} found. Click Add to create one.
                        </div>
                    )}
                </div>
            </div>

            {/* MATCH MODAL */}
            {
                showMatchModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>{editingMatchId ? 'Edit Match' : 'Add New Match'}</h3>
                            <form onSubmit={handleMatchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input type="text" placeholder="Opponent Name" required
                                    value={matchForm.opponent} onChange={e => setMatchForm({ ...matchForm, opponent: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input type="date" required
                                        value={matchForm.matchDate} onChange={e => setMatchForm({ ...matchForm, matchDate: e.target.value })}
                                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                    <input type="time" required
                                        value={matchForm.matchTime} onChange={e => setMatchForm({ ...matchForm, matchTime: e.target.value })}
                                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                                <input type="text" placeholder="Venue" required
                                    value={matchForm.venue} onChange={e => setMatchForm({ ...matchForm, venue: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <select
                                    value={matchForm.status} onChange={e => setMatchForm({ ...matchForm, status: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Live">Live</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <input type="text" placeholder="Result / Current Status"
                                    value={matchForm.result} onChange={e => setMatchForm({ ...matchForm, result: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" style={{ flex: 1, backgroundColor: '#7c3aed', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Match</button>
                                    <button type="button" onClick={() => setShowMatchModal(false)} style={{ flex: 1, backgroundColor: '#e5e7eb', color: 'black', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* PLAYER MODAL */}
            {
                showPlayerModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>{editingPlayerId ? 'Edit Player' : 'Add New Player'}</h3>
                            <form onSubmit={handlePlayerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input type="text" placeholder="Player Name" required
                                    value={playerForm.name} onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <select
                                    value={playerForm.role} onChange={e => setPlayerForm({ ...playerForm, role: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                    <option value="Batsman">Batsman</option>
                                    <option value="Bowler">Bowler</option>
                                    <option value="All-rounder">All-rounder</option>
                                    <option value="Wicketkeeper">Wicketkeeper</option>
                                    <option value="Captain">Captain</option>
                                </select>
                                <input type="text" placeholder="Batting Style (e.g. Right-hand bat)"
                                    value={playerForm.battingStyle} onChange={e => setPlayerForm({ ...playerForm, battingStyle: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <input type="text" placeholder="Bowling Style (e.g. Right-arm fast)"
                                    value={playerForm.bowlingStyle} onChange={e => setPlayerForm({ ...playerForm, bowlingStyle: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="number" placeholder="Matches" style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        value={playerForm.matches} onChange={e => setPlayerForm({ ...playerForm, matches: parseInt(e.target.value) || 0 })}
                                    />
                                    <input type="number" placeholder="Runs" style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        value={playerForm.runs} onChange={e => setPlayerForm({ ...playerForm, runs: parseInt(e.target.value) || 0 })}
                                    />
                                    <input type="number" placeholder="Wickets" style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        value={playerForm.wickets} onChange={e => setPlayerForm({ ...playerForm, wickets: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#666' }}>Profile Image</label>
                                    <input type="file" accept="image/*"
                                        onChange={e => setSelectedPlayerFile(e.target.files[0])}
                                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                    {playerForm.imageUrl && !selectedPlayerFile && (
                                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Current image: {playerForm.imageUrl.split('/').pop()}</p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" style={{ flex: 1, backgroundColor: '#7c3aed', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Player</button>
                                    <button type="button" onClick={() => setShowPlayerModal(false)} style={{ flex: 1, backgroundColor: '#e5e7eb', color: 'black', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* STATS MODAL */}
            {
                showStatsModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Update Club Stats</h3>
                            <form onSubmit={handleStatsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Matches Won</label>
                                    <input type="number" required
                                        value={statsForm.matchesWon} onChange={e => setStatsForm({ ...statsForm, matchesWon: parseInt(e.target.value) || 0 })}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Active Players</label>
                                    <input type="number" required
                                        value={statsForm.activePlayers} onChange={e => setStatsForm({ ...statsForm, activePlayers: parseInt(e.target.value) || 0 })}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Championships</label>
                                    <input type="number" required
                                        value={statsForm.championships} onChange={e => setStatsForm({ ...statsForm, championships: parseInt(e.target.value) || 0 })}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" style={{ flex: 1, backgroundColor: '#7c3aed', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update Stats</button>
                                    <button type="button" onClick={() => setShowStatsModal(false)} style={{ flex: 1, backgroundColor: '#e5e7eb', color: 'black', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* ACHIEVEMENT MODAL */}
            {
                showAchievementModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Add Achievement</h3>
                            <form onSubmit={handleAchievementSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input type="text" placeholder="Title (e.g. League Champions)" required
                                    value={achievementForm.title} onChange={e => setAchievementForm({ ...achievementForm, title: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <input type="text" placeholder="Year (e.g. 2023)" required
                                    value={achievementForm.achievementYear} onChange={e => setAchievementForm({ ...achievementForm, achievementYear: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <select
                                    value={achievementForm.type} onChange={e => setAchievementForm({ ...achievementForm, type: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                    <option value="TROPHY">Trophy</option>
                                    <option value="MEDAL">Medal</option>
                                    <option value="STAR">Star</option>
                                    <option value="AWARD">Award</option>
                                </select>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" style={{ flex: 1, backgroundColor: '#7c3aed', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Achievement</button>
                                    <button type="button" onClick={() => setShowAchievementModal(false)} style={{ flex: 1, backgroundColor: '#e5e7eb', color: 'black', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* GALLERY MODAL */}
            {
                showGalleryModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Add Gallery Image</h3>
                            <form onSubmit={handleGallerySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4b5563' }}>Field / Category</label>
                                    {!isNewCategory ? (
                                        <select
                                            value={galleryForm.category}
                                            onChange={(e) => {
                                                if (e.target.value === 'NEW_CATEGORY_OPTION') {
                                                    setIsNewCategory(true);
                                                    setGalleryForm({ ...galleryForm, category: '' });
                                                } else {
                                                    setGalleryForm({ ...galleryForm, category: e.target.value });
                                                }
                                            }}
                                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        >
                                            <option value="">Select Category</option>
                                            {existingCategories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                            <option value="NEW_CATEGORY_OPTION" style={{ fontWeight: 'bold', color: '#7c3aed' }}>+ Add New Field</option>
                                        </select>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                type="text"
                                                placeholder="Enter new field name"
                                                autoFocus
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => { setIsNewCategory(false); setNewCategory(''); }}
                                                style={{ padding: '0px 10px', fontSize: '0.8rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4b5563' }}>Sub Category</label>
                                    <input
                                        type="text"
                                        placeholder="Enter sub category (e.g. 2023, Finals)"
                                        value={galleryForm.subCategory || ''}
                                        onChange={(e) => setGalleryForm({ ...galleryForm, subCategory: e.target.value })}
                                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>

                                <input type="file" accept="image/*" required
                                    onChange={e => setSelectedFile(e.target.files[0])}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <input type="text" placeholder="Caption (Optional)"
                                    value={galleryForm.caption} onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" style={{ flex: 1, backgroundColor: '#7c3aed', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Image</button>
                                    <button type="button" onClick={() => setShowGalleryModal(false)} style={{ flex: 1, backgroundColor: '#e5e7eb', color: 'black', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default AdminDashboard;
