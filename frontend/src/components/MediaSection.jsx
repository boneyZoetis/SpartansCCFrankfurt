import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { ChevronLeft, ChevronRight, Camera, X, Play } from 'lucide-react';

export default function MediaSection() {
    const [lightbox, setLightbox] = useState({ isOpen: false, index: 0, images: [] });
    // This state controls the "album" view modal
    const [activeAlbum, setActiveAlbum] = useState(null);
    const [mediaGroups, setMediaGroups] = useState([]); // List of main Categories

    useEffect(() => {
        fetch(API_URL + '/api/gallery')
            .then(res => res.json())
            .then(data => {
                // 1. Group by Category
                const groups = {};
                data.forEach(item => {
                    const cat = item.category || 'General';
                    const sub = item.subCategory || 'General';
                    const imageUrl = item.imageUrl.startsWith('http') ? item.imageUrl : API_URL + item.imageUrl;

                    if (!groups[cat]) {
                        groups[cat] = {
                            title: cat,
                            subCategories: {},
                            coverImage: imageUrl // Default cover
                        };
                    }

                    if (!groups[cat].subCategories[sub]) {
                        groups[cat].subCategories[sub] = [];
                    }

                    groups[cat].subCategories[sub].push({ url: imageUrl, caption: item.caption });
                });

                // Convert to array
                const sessions = Object.values(groups).map(g => ({
                    ...g,
                    // Convert subCategories object to array for easier rendering
                    subSessions: Object.keys(g.subCategories).map(subKey => ({
                        title: subKey,
                        images: g.subCategories[subKey]
                    }))
                }));

                setMediaGroups(sessions);
            })
            .catch(err => console.error("Error fetching gallery:", err));
    }, []);

    // Open Lightbox
    const openLightbox = (images, index) => {
        setLightbox({ isOpen: true, index, images });
    };

    const closeLightbox = () => {
        setLightbox({ ...lightbox, isOpen: false });
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setLightbox(prev => ({ ...prev, index: (prev.index + 1) % prev.images.length }));
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setLightbox(prev => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }));
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightbox.isOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') setLightbox(prev => ({ ...prev, index: (prev.index + 1) % prev.images.length }));
            if (e.key === 'ArrowLeft') setLightbox(prev => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightbox.isOpen]);

    return (
        <section style={{ padding: '6rem 0', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div className="container">
                {/* Hero / Intro */}
                <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
                    <h3 style={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1.5rem'
                    }}>
                        Media Gallery <Camera size={48} color="var(--secondary-color)" style={{ filter: 'drop-shadow(0 0 15px rgba(255,165,0,0.4))' }} />
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7' }}>
                        Capturing the spirit of Spartans. Relive our journey through every boundary, wicket, and celebration.
                    </p>
                </div>

                {/* Categories List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                    {mediaGroups.map((group, groupIdx) => (
                        <div key={groupIdx}>
                            {/* Category Title with Accent */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '2.5rem',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid #334155'
                            }}>
                                <div style={{ width: '6px', height: '40px', backgroundColor: 'var(--secondary-color)', borderRadius: '4px', boxShadow: '0 0 10px var(--secondary-color)' }}></div>
                                <h3 style={{
                                    fontSize: '2.25rem',
                                    fontWeight: '700',
                                    color: 'white',
                                    margin: 0,
                                    letterSpacing: '-0.5px'
                                }}>
                                    {group.title}
                                </h3>
                            </div>

                            {/* Albums Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
                                {group.subSessions.map((album, albumIdx) => (
                                    <div
                                        key={albumIdx}
                                        onClick={() => setActiveAlbum(album)}
                                        style={{
                                            backgroundColor: '#1e293b',
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            border: '1px solid #334155'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-10px)';
                                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.4)';
                                            e.currentTarget.style.borderColor = 'var(--secondary-color)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
                                            e.currentTarget.style.borderColor = '#334155';
                                        }}
                                    >
                                        {/* Image Container */}
                                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                            <img
                                                src={album.images[0]?.url}
                                                alt={album.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div style={{
                                                position: 'absolute', inset: 0,
                                                background: 'linear-gradient(to top, rgba(15,23,42,0.8), transparent)',
                                                opacity: 0.8
                                            }}></div>

                                            {/* Photo Count Badge */}
                                            <div style={{
                                                position: 'absolute', top: '15px', right: '15px',
                                                backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                                                padding: '6px 12px', borderRadius: '20px',
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                fontSize: '0.85rem', fontWeight: '600', color: 'white',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                <Camera size={14} color="var(--secondary-color)" /> {album.images.length}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '1.5rem', position: 'relative' }}>
                                            <h4 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                                                {album.title}
                                            </h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--secondary-color)', boxShadow: '0 0 5px var(--secondary-color)' }}></div>
                                                View Album
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Album Detail Modal */}
            {activeAlbum && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.98)',
                    zIndex: 900,
                    padding: '2rem',
                    overflowY: 'auto'
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>{activeAlbum.title}</h2>
                                <p style={{ color: '#94a3b8' }}>{activeAlbum.images.length} Photos</p>
                            </div>
                            <button
                                onClick={() => setActiveAlbum(null)}
                                style={{ background: '#334155', border: 'none', borderRadius: '50%', color: 'white', padding: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                                onMouseOver={(e) => e.target.style.background = '#475569'}
                                onMouseOut={(e) => e.target.style.background = '#334155'}
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Grid of Images in Album */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {activeAlbum.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => openLightbox(activeAlbum.images, idx)}
                                    style={{
                                        height: '250px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.3)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.caption}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                    />
                                    {/* Hover info overlay */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                        padding: '1.5rem 1rem 1rem',
                                        opacity: 0,
                                        transition: 'opacity 0.3s'
                                    }}
                                        onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                        onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                                    >
                                        <p style={{ color: 'white', fontSize: '0.9rem', margin: 0 }}>{img.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox Modal (Top Layer) */}
            {lightbox.isOpen && (
                <div
                    onClick={closeLightbox}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.99)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <button
                        onClick={closeLightbox}
                        style={{ position: 'absolute', top: '30px', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: '12px' }}
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={prevImage}
                        style={{ position: 'absolute', left: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: '16px', backdropFilter: 'blur(5px)' }}
                    >
                        <ChevronLeft size={36} />
                    </button>

                    <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '95vw', maxHeight: '95vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={lightbox.images[lightbox.index].url}
                            alt={lightbox.images[lightbox.index].caption}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '85vh',
                                borderRadius: '8px',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                border: '1px solid #334155'
                            }}
                        />
                        {lightbox.images[lightbox.index].caption && (
                            <h3 style={{ marginTop: '1.5rem', color: 'white', fontSize: '1.25rem', fontWeight: '500', textAlign: 'center', maxWidth: '800px' }}>
                                {lightbox.images[lightbox.index].caption}
                            </h3>
                        )}
                        <div style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            {lightbox.index + 1} / {lightbox.images.length}
                        </div>
                    </div>

                    <button
                        onClick={nextImage}
                        style={{ position: 'absolute', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: '16px', backdropFilter: 'blur(5px)' }}
                    >
                        <ChevronRight size={36} />
                    </button>
                </div>
            )}
        </section>
    );
}
