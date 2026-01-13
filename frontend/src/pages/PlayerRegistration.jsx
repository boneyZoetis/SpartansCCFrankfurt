import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Shield, AlertCircle, Send } from 'lucide-react';
import { API_URL } from '../config';

const JoinRequestForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Batsman',
        experience: '',
        legalConsent: false,
        website: '' // Honeypot
    });

    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return "Full Name is required";
        if (!formData.email.trim()) return "Email is required";
        if (!formData.phone.trim()) return "Phone number is required";
        if (!formData.legalConsent) return "You must agree to the data privacy declaration.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            setPopupMessage(error);
            setShowPopup(true);
            return;
        }

        setStatus('submitting');

        try {
            const res = await fetch(`${API_URL}/api/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                window.scrollTo(0, 0);
            } else {
                setPopupMessage('Failed to submit request. Please try again.');
                setShowPopup(true);
                setStatus('idle');
            }
        } catch (err) {
            console.error(err);
            setPopupMessage('Server connection failed. Please check your internet.');
            setShowPopup(true);
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="bg-[#111] p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/10">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Request Sent!</h2>
                    <p className="text-gray-400 mb-8">
                        Thank you for your interest in Spartans Cricket Club! <br />
                        We have received your details and will get back to you shortly.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-8 py-3 bg-[#e31e24] text-white rounded-xl font-semibold hover:bg-[#c4181d] transition-colors w-full"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#e31e24]/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Content Container */}
            <div className="relative max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Join The Club
                    </h1>
                    <p className="text-xl text-gray-400">
                        Become a part of the Spartans family. Fill out the form below.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all placeholder-gray-600"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all placeholder-gray-600"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all placeholder-gray-600"
                                    placeholder="+49 123 456789"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Preferred Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all cursor-pointer"
                                >
                                    <option>Batsman</option>
                                    <option>Bowler</option>
                                    <option>All Rounder</option>
                                    <option>Wicket Keeper</option>
                                    <option>Supporter / Fan</option>
                                </select>
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Cricket Experience (Optional)</label>
                            <textarea
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all placeholder-gray-600 resize-none"
                                placeholder="Tell us about your previous clubs or playing style..."
                            />
                        </div>

                        {/* Honeypot Field (Hidden) */}
                        <div style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                            <label htmlFor="website">Website</label>
                            <input
                                type="text"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                tabIndex="-1"
                                autoComplete="off"
                            />
                        </div>

                        {/* Legal Consent */}
                        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-4">
                            <Shield className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                            <div className="space-y-3">
                                <h3 className="text-yellow-500 font-semibold text-sm">Data Privacy Declaration (DSGVO)</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    By submitting this form, I agree that Spartans Cricket Club may process my personal data for the purpose of membership application and communication, in accordance with the
                                    <span className="font-semibold text-gray-300"> German Data Protection Regulation (DSGVO)</span>. I confirm that the information provided is accurate.
                                </p>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="legalConsent"
                                            checked={formData.legalConsent}
                                            onChange={handleChange}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/5 checked:border-[#e31e24] checked:bg-[#e31e24] transition-all"
                                        />
                                        <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3.5 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors select-none">
                                        I Agree and Consent *
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-[#e31e24] hover:bg-[#c4181d] text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#e31e24]/20"
                        >
                            {status === 'submitting' ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Application
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Error Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animation-fade-in">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl transform animation-scale-in">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Action Required</h3>
                        <p className="text-gray-400 mb-6">{popupMessage}</p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="bg-[#e31e24] hover:bg-[#c4181d] text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
                        >
                            Okay, I'll fix it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinRequestForm;
