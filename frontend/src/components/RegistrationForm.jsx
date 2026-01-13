import { useState } from 'react';
import { API_URL } from '../config';

import { useNavigate } from 'react-router-dom';
import { Check, AlertTriangle } from 'lucide-react';

export default function RegistrationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        preferredRole: 'Batsman',
        experienceLevel: 'Amateur',
        legalConsent: false,
        confirm_code: '' // Honeypot field (hidden)
    });
    const [status, setStatus] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState({ show: false, count: 0 });

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Honeypot Check (Anti-Bot)
        // If the hidden 'confirm_code' field has a value, it's likely a bot. Silently fail.
        if (formData.confirm_code) {
            console.log("Bot detected.");
            return;
        }

        // 2. Data Validation
        if (!formData.legalConsent) {
            setStatus('Error: You must accept the data privacy policy.');
            return;
        }

        // Basic Phone Validation (Allows +, -, spaces, (), and digits. Min 7, max 15 chars)
        const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            setStatus('Error: Please enter a valid phone number (e.g. +49 123 456789)');
            return;
        }

        // Prepare data (Exclude honeypot field)
        // Prepare data (Exclude honeypot field)
        const { confirm_code, ...submitData } = formData;

        fetch(API_URL + '/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitData)
        })
            .then(async res => {
                let data;
                try {
                    data = await res.json();
                } catch (e) {
                    data = {};
                }

                if (res.status === 409) {
                    setDuplicateWarning({ show: true, count: data.count || 1 });
                    return;
                }
                if (res.ok) {
                    setStatus('');
                    setFormData({ fullName: '', email: '', phoneNumber: '', preferredRole: 'Batsman', experienceLevel: 'Amateur', legalConsent: false, confirm_code: '' });
                    setShowSuccessModal(true);
                } else {
                    setStatus('Error submitting registration.');
                }
            })
            .catch(() => setStatus('Error submitting registration.'));
    };

    const handleForceSubmit = () => {
        const { confirm_code, ...submitData } = formData;
        fetch(API_URL + '/api/register?force=true', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitData)
        })
            .then(async res => {
                if (res.ok) {
                    setDuplicateWarning({ show: false, count: 0 });
                    setStatus('');
                    setFormData({ fullName: '', email: '', phoneNumber: '', preferredRole: 'Batsman', experienceLevel: 'Amateur', legalConsent: false, confirm_code: '' });
                    setShowSuccessModal(true);
                } else {
                    setStatus('Error processing request.');
                }
            })
            .catch(() => setStatus('Error processing request.'));
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    return (
        <section className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <div style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary-color)', textAlign: 'center' }}>Join the Club</h3>
                {status && !showSuccessModal && <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>{status}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number</label>
                        <input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Preferred Role</label>
                            <select
                                name="preferredRole"
                                value={formData.preferredRole}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                            >
                                <option>Batsman</option>
                                <option>Bowler</option>
                                <option>All-rounder</option>
                                <option>Wicket Keeper</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Experience</label>
                            <select
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                            >
                                <option>Amateur</option>
                                <option>Intermediate</option>
                                <option>Professional</option>
                            </select>
                        </div>
                    </div>

                    {/* Honeypot Field (Hidden from humans, visible to bots) */}
                    <div style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                        <input
                            type="text"
                            name="confirm_code"
                            tabIndex="-1"
                            value={formData.confirm_code}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>


                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            name="legalConsent"
                            id="legalConsent"
                            checked={formData.legalConsent}
                            onChange={handleChange}
                            style={{ marginTop: '0.25rem' }}
                        />
                        <label htmlFor="legalConsent" style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                            I agree to the processing of my personal data in accordance with the
                            <span style={{ fontWeight: 'bold' }}> Data Privacy Policy (DSGVO)</span>.
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                        Register Now
                    </button>
                </form>
            </div >

            {/* Graceful Success Modal */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', maxWidth: '450px', width: '90%',
                        textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <div style={{
                            width: '80px', height: '80px', backgroundColor: '#dcfce7', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                        }}>
                            <Check size={48} color="#166534" strokeWidth={3} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111827' }}>Registration Successful!</h2>
                        <p style={{ color: '#4b5563', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: '1.5' }}>
                            Thank you for your interest. We have received your request and will contact you shortly.
                        </p>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                navigate('/');
                                window.scrollTo(0, 0);
                            }}
                            style={{
                                width: '100%', padding: '0.8rem', backgroundColor: '#166534', color: 'white',
                                border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={e => e.target.style.backgroundColor = '#15803d'}
                            onMouseOut={e => e.target.style.backgroundColor = '#166534'}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            )}

            {/* Duplicate Warning Modal */}
            {duplicateWarning.show && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '400px', width: '90%',
                        textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #f59e0b'
                    }}>
                        <div style={{
                            width: '60px', height: '60px', backgroundColor: '#fef3c7', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                        }}>
                            <AlertTriangle size={32} color="#d97706" strokeWidth={2.5} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#92400e' }}>
                            Duplicate Details Found
                        </h3>
                        <p style={{ color: '#78350f', marginBottom: '1.5rem', fontSize: '1rem' }}>
                            We found <strong>{duplicateWarning.count}</strong> existing request(s) with this email or phone number.
                            <br /><br />
                            Do you want to submit this request anyway?
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setDuplicateWarning({ show: false, count: 0 })}
                                style={{
                                    padding: '0.6rem 1.2rem', backgroundColor: '#e5e7eb', color: '#374151',
                                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleForceSubmit}
                                style={{
                                    padding: '0.6rem 1.2rem', backgroundColor: '#d97706', color: 'white',
                                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
                                }}
                            >
                                Yes, Submit Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section >
    );
}
