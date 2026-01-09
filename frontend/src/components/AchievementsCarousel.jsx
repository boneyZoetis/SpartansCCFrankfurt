import { useRef, useState, useEffect } from 'react';
import { API_URL } from '../config';
import { ChevronLeft, ChevronRight, Trophy, Medal, Star, Award } from 'lucide-react';

export default function AchievementsCarousel() {
    const [achievements, setAchievements] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetch(API_URL + '/api/achievements')
            .then(res => res.json())
            .then(data => {
                // Map backend data to frontend structure with icons/colors
                const mapped = data.map(item => {
                    let icon, color, border;
                    switch (item.type) {
                        case 'TROPHY': icon = <Trophy size={24} />; color = "#fef3c7"; border = "#f59e0b"; break;
                        case 'MEDAL': icon = <Medal size={24} />; color = "#e0f2fe"; border = "#0ea5e9"; break;
                        case 'STAR': icon = <Star size={24} />; color = "#dcfce7"; border = "#22c55e"; break;
                        case 'AWARD': icon = <Award size={24} />; color = "#f3e8ff"; border = "#a855f7"; break;
                        default: icon = <Trophy size={24} />; color = "#fef3c7"; border = "#f59e0b";
                    }
                    return { ...item, icon, color, border };
                });
                setAchievements(mapped);
            })
            .catch(err => console.error("Error fetching achievements:", err));
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300; // Approx card width
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div style={{ backgroundColor: '#f3f4f6', padding: '2rem', borderRadius: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }}>
            <h4 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🏆</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Club Achievements</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => scroll('left')}
                        style={{ padding: '8px', borderRadius: '50%', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        style={{ padding: '8px', borderRadius: '50%', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </h4>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                style={{
                    display: 'flex',
                    gap: '1rem',
                    overflowX: 'auto',
                    paddingBottom: '1rem',
                    scrollbarWidth: 'none', /* Firefox */
                    msOverflowStyle: 'none'  /* IE/Edge */
                }}
            >
                {achievements.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            minWidth: '260px', // Fixed width for cards
                            flex: '0 0 auto',
                            background: 'white',
                            padding: '1.2rem',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            borderTop: `4px solid ${item.border}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.8rem'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1f2937'
                        }}>
                            {item.icon}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '1rem' }}>{item.title}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>{item.achievementYear}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Drag or scroll to view more
            </div>
        </div>
    );
}
