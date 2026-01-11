import { useState } from 'react';
import { API_URL } from '../config';
import { Camera, Check, AlertCircle } from 'lucide-react';

export default function PlayerRegistration() {
    const [formData, setFormData] = useState({
        name: '',
        role: '', // Changed to empty string to force selection
        battingStyle: '', // Changed to empty string
        bowlingStyle: '', // Changed to empty string
        matches: '',
        runs: '',
        wickets: '',
        bio: '' // Added bio just in case
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [consent, setConsent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Custom Popup State
    const [popup, setPopup] = useState({ show: false, message: '', type: 'error' });

    const bowlingStyles = [
        "Right-arm Fast",
        "Right-arm Fast-Medium",
        "Right-arm Medium",
        "Right-arm Off Spin",
        "Right-arm Leg Spin",
        "Left-arm Fast",
        "Left-arm Medium",
        "Left-arm Orthodox",
        "Left-arm Chinaman (Unorthodox)",
        "None (Pure Batsman/WK)"
    ];

    const showPopup = (msg) => {
        setPopup({ show: true, message: msg, type: 'error' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validate Fields
        if (!formData.name.trim()) return showPopup("Please enter your Full Name.");
        if (!formData.role) return showPopup("Please select a Role from the list.");
        if (!formData.battingStyle) return showPopup("Please select a Batting Style.");
        if (!formData.bowlingStyle) return showPopup("Please select a Bowling Style.");
        if (!image) return showPopup("A Profile Photo is mandatory. Please upload one.");

        // 2. Validate Consent
        if (!consent) {
            return showPopup("Please accept the Legal Consent (DSGVO) checkbox to proceed. This is mandatory by German Law.");
        }

        setSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('role', formData.role);
        data.append('battingStyle', formData.battingStyle);
        data.append('bowlingStyle', formData.bowlingStyle);
        // Default numbers to 0 if empty
        data.append('matches', formData.matches || 0);
        data.append('runs', formData.runs || 0);
        data.append('wickets', formData.wickets || 0);
        if (image) {
            data.append('image', image);
        }

        try {
            const res = await fetch(`${API_URL}/api/players`, {
                method: 'POST',
                body: data
            });

            if (res.ok) {
                setSuccess(true);
                // Reset form
                setFormData({
                    name: '', role: '', battingStyle: '', bowlingStyle: '', matches: '', runs: '', wickets: '', bio: ''
                });
                setImage(null);
                setPreview(null);
                setConsent(false);
            } else {
                showPopup("Failed to submit profile. Server error.");
            }
        } catch (err) {
            console.error(err);
            showPopup("Connection failed. Please check your internet or try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '3rem', borderRadius: '16px', textAlign: 'center', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#eab308', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 20px rgba(234, 179, 8, 0.4)' }}>
                        <Check size={48} color="black" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white' }}>Profile Submitted!</h2>
                    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        Thank you for registering. Your profile is now <strong>Under Review</strong>. <br />
                        Once the Admin verifies and approves your details, you will appear on the main Squad page.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <a href="/" style={{
                            display: 'inline-block',
                            padding: '0.8rem 2rem',
                            backgroundColor: '#334155',
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: '600',
                            borderRadius: '8px',
                            transition: 'background 0.2s'
                        }}
                            onMouseOver={e => e.target.style.backgroundColor = '#475569'}
                            onMouseOut={e => e.target.style.backgroundColor = '#334155'}
                        >
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>

            {/* Custom Popup Modal */}
            {popup.show && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }} onClick={() => setPopup({ ...popup, show: false })}>
                    <div style={{
                        backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '100%',
                        border: '1px solid #ef4444', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }} onClick={e => e.stopPropagation()}>
                        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Action Required</h3>
                        <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>{popup.message}</p>
                        <button
                            onClick={() => setPopup({ ...popup, show: false })}
                            style={{
                                backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 2rem',
                                borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
                            }}
                        >
                            Okay, I'll fix it
                        </button>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <img src="/spartans-logo-transparent.png" alt="Logo" style={{ height: '80px', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(255,165,0,0.3))' }} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Join the Squad
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Create your official Spartans player profile.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)', border: '1px solid #334155' }}>

                    {/* Name */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#e2e8f0' }}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Virat Kohli"
                            style={{ width: '100%', padding: '1rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: 'white', fontSize: '1rem' }}
                        />
                    </div>

                    {/* Photo Upload */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#e2e8f0' }}>Profile Photo <span style={{ color: '#ef4444' }}>*</span></label>
                        <div style={{ padding: '1.5rem', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px dashed #475569', textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '140px', height: '140px', borderRadius: '50%', overflow: 'hidden',
                                    backgroundColor: '#1e293b', border: '4px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {preview ? (
                                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Camera size={48} color="#475569" />
                                    )}
                                </div>
                                <div>
                                    <label style={{
                                        display: 'inline-block', padding: '0.6rem 1.2rem', backgroundColor: '#334155',
                                        color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500',
                                        transition: 'background 0.2s'
                                    }}>
                                        Upload Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setImage(file);
                                                    setPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.8rem' }}>
                                        Required. Please use a clear portrait.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Roles Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#e2e8f0' }}>Role <span style={{ color: '#ef4444' }}>*</span></label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                style={{ width: '100%', padding: '1rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: 'white', fontSize: '1rem', appearance: 'none' }}
                            >
                                <option value="" disabled>Select Role</option>
                                <option>Batsman</option>
                                <option>Bowler</option>
                                <option>All-Rounder</option>
                                <option>Wicket Keeper</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#e2e8f0' }}>Batting Style <span style={{ color: '#ef4444' }}>*</span></label>
                            <select
                                value={formData.battingStyle}
                                onChange={e => setFormData({ ...formData, battingStyle: e.target.value })}
                                style={{ width: '100%', padding: '1rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: 'white', fontSize: '1rem', appearance: 'none' }}
                            >
                                <option value="" disabled>Select Style</option>
                                <option>Right-hand bat</option>
                                <option>Left-hand bat</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#e2e8f0' }}>Bowling Style <span style={{ color: '#ef4444' }}>*</span></label>
                        <select
                            value={formData.bowlingStyle}
                            onChange={e => setFormData({ ...formData, bowlingStyle: e.target.value })}
                            style={{ width: '100%', padding: '1rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: 'white', fontSize: '1rem', appearance: 'none' }}
                        >
                            <option value="" disabled>Select Bowling Style</option>
                            {bowlingStyles.map(style => (
                                <option key={style} value={style}>{style}</option>
                            ))}
                        </select>
                    </div>

                    {/* Stats (Optional but nice to have) */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#e2e8f0' }}>Current Stats <span style={{ fontSize: '0.8rem', color: '#64748b' }}>(Optional - Enter 0 if new)</span></label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div>
                                <input type="number" placeholder="Matches" value={formData.matches} onChange={e => setFormData({ ...formData, matches: e.target.value })} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} />
                            </div>
                            <div>
                                <input type="number" placeholder="Runs" value={formData.runs} onChange={e => setFormData({ ...formData, runs: e.target.value })} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} />
                            </div>
                            <div>
                                <input type="number" placeholder="Wickets" value={formData.wickets} onChange={e => setFormData({ ...formData, wickets: e.target.value })} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white' }} />
                            </div>
                        </div>
                    </div>

                    {/* Legal Consent */}
                    <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(234, 179, 8, 0.05)', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                        <h4 style={{ color: '#eab308', marginTop: 0, marginBottom: '0.8rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={18} /> Legal Consent Required
                        </h4>
                        <label style={{ display: 'flex', gap: '1rem', alignItems: 'start', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={consent}
                                onChange={e => setConsent(e.target.checked)}
                                style={{ marginTop: '4px', width: '24px', height: '24px', accentColor: '#eab308', flexShrink: 0 }}
                            />
                            <span style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                                I confirm that the details and photo provided are mine.
                                I explicitly consent to <strong>Spartans Cricket Club</strong> using this data and photo on their website and social media channels in accordance with the
                                <strong> GDPR (DSGVO)</strong> and <strong>KunstUrhG</strong>.
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            width: '100%', marginTop: '2.5rem', padding: '1.2rem',
                            backgroundColor: submitting ? '#475569' : '#eab308',
                            color: submitting ? '#94a3b8' : 'black',
                            fontWeight: 'bold', fontSize: '1.1rem',
                            border: 'none', borderRadius: '12px', cursor: submitting ? 'wait' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: submitting ? 'none' : '0 4px 6px -1px rgba(234, 179, 8, 0.4)'
                        }}
                    >
                        {submitting ? 'Submitting Profile...' : 'Submit Profile'}
                    </button>

                </form>
            </div>
        </div>
    );
}
