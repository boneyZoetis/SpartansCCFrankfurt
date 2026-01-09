import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { ChevronLeft, ChevronRight, Camera, X } from 'lucide-react';

export default function MediaSection() {
    const [lightbox, setLightbox] = useState({ isOpen: false, index: 0, images: [] });
    // This state controls the "folder" view modal
    const [activeCategory, setActiveCategory] = useState(null);
    const [mediaSessions, setMediaSessions] = useState([]);

    useEffect(() => {
        fetch(API_URL + '/api/gallery')
            .then(res => res.json())
            .then(data => {
                // Group by category
                const groups = data.reduce((acc, item) => {
                    if (!acc[item.category]) {
                        acc[item.category] = [];
                    }
                    const imageUrl = item.imageUrl.startsWith('http') ? item.imageUrl : API_URL + item.imageUrl;
                    acc[item.category].push({ url: imageUrl, caption: item.caption });
                    return acc;
                }, {});

                const sessions = Object.keys(groups).map(category => ({
                    title: category,
                    images: groups[category],
                    // Use the first image as the cover
                    coverImage: groups[category][0]?.url
                }));
                setMediaSessions(sessions);
            })
            .catch(err => console.error("Error fetching gallery:", err));
    }, []);

    // Open Lightbox
    const openLightbox = (index) => {
        setLightbox({ isOpen: true, index, images: activeCategory.images });
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
        <section style={{ padding: '6rem 0', backgroundColor: '#111827', color: 'white' }}>
            <div className="container">
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        Media Gallery <Camera size={40} color="var(--secondary-color)" />
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Relive the best moments from our training camps, championship matches, and community events.
                    </p>
                </div>

                {/* Category Grid (Albums) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {mediaSessions.map((session, index) => (
                        <div
                            key={index}
                            onClick={() => setActiveCategory(session)}
                            style={{
                                backgroundColor: '#1f2937',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.5)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.5)';
                            }}
                        >
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={session.coverImage}
                                    alt={session.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                                    {session.title}
                                </h4>
                                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                                    {session.images.length} Photos
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category/Album Modal */}
            {activeCategory && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    zIndex: 900,
                    padding: '2rem',
                    overflowY: 'auto'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{activeCategory.title}</h2>
                            <button
                                onClick={() => setActiveCategory(null)}
                                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', padding: '10px', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {activeCategory.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => openLightbox(idx)}
                                    style={{
                                        height: '200px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.caption}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                        onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                                        onMouseOut={e => e.target.style.transform = 'scale(1.0)'}
                                    />
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                        padding: '1rem 0.5rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        {img.caption}
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
                        backgroundColor: 'rgba(0, 0, 0, 0.98)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <button
                        onClick={closeLightbox}
                        style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '10px' }}
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={prevImage}
                        style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: '15px' }}
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={lightbox.images[lightbox.index].url}
                            alt={lightbox.images[lightbox.index].caption}
                            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                        />
                        <h3 style={{ marginTop: '1.5rem', color: 'white', fontSize: '1.5rem', fontWeight: '600', textAlign: 'center' }}>
                            {lightbox.images[lightbox.index].caption}
                        </h3>
                        <div style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
                            {lightbox.index + 1} / {lightbox.images.length}
                        </div>
                    </div>

                    <button
                        onClick={nextImage}
                        style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: '15px' }}
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            )}
        </section>
    );
}
