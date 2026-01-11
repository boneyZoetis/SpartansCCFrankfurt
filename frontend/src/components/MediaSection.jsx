import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { ChevronLeft, ChevronRight, Camera, X } from 'lucide-react';

export default function MediaSection() {
    const [lightbox, setLightbox] = useState({ isOpen: false, index: 0, images: [] });
    // This state controls the "folder" view modal
    const [activeCategory, setActiveCategory] = useState(null); // Stores the selected Category object (title, subCategories: { name: [images] })
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

                {/* Main Category Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {mediaGroups.map((group, index) => (
                        <div
                            key={index}
                            onClick={() => setActiveCategory(group)}
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
                                    src={group.coverImage}
                                    alt={group.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                                    {group.title}
                                </h4>
                                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                                    {group.subSessions.length} Albums
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sub-Category / Album Modal */}
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

                        {/* Iterate over SubCategories */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {activeCategory.subSessions.map((sub, subIdx) => (
                                <div key={subIdx}>
                                    <h3 style={{
                                        fontSize: '1.5rem', fontWeight: '600', color: 'var(--secondary-color)', marginBottom: '1rem',
                                        borderBottom: '1px solid #374151', paddingBottom: '0.5rem'
                                    }}>
                                        {sub.title}
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {sub.images.map((img, imgIdx) => (
                                            <div
                                                key={imgIdx}
                                                onClick={() => openLightbox(sub.images, imgIdx)} // Pass the specific sub-category images to lightbox
                                                style={{
                                                    height: '180px',
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
                                            </div>
                                        ))}
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
