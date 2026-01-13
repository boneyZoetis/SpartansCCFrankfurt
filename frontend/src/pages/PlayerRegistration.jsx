import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle,
    Shield,
    AlertCircle,
    Send,
    User,
    Mail,
    Phone,
    Briefcase,
    FileText
} from 'lucide-react';
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

    const [status, setStatus] = useState('idle');
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
                headers: { 'Content-Type': 'application/json' },
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
                <div className="bg-[#111] p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#e31e24]/5 to-transparent pointer-events-none" />

                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/20">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Request Sent</h2>

                    <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                        <p className="text-gray-300 leading-relaxed">
                            Thank you for your interest in <span className="text-[#e31e24] font-semibold">Spartans Cricket Club</span>!
                            <br /><br />
                            We have received your application. The administration will review your details and contact you shortly.
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-8 py-4 bg-[#e31e24] text-white rounded-xl font-semibold hover:bg-[#c4181d] transition-all transform hover:scale-[1.02] w-full shadow-lg shadow-red-900/20"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-[#e31e24] selection:text-white">
            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#e31e24]/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <div className="relative max-w-2xl mx-auto z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <h1 className="text-5xl font-black mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                            Join The Club
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 font-light">
                        Begin your journey with the Spartans.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e31e24] to-blue-600" />

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section: Personal Details */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" /> Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-gray-300 ml-1 group-focus-within:text-[#e31e24] transition-colors">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#e31e24] transition-colors" />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all placeholder-gray-700"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-gray-300 ml-1 group-focus-within:text-[#e31e24] transition-colors">Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#e31e24] transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all placeholder-gray-700"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-gray-300 ml-1 group-focus-within:text-[#e31e24] transition-colors">Phone *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#e31e24] transition-colors" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all placeholder-gray-700"
                                            placeholder="+49 ..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-gray-300 ml-1 group-focus-within:text-[#e31e24] transition-colors">Role</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#e31e24] transition-colors" />
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all cursor-pointer appearance-none"
                                        >
                                            <option>Batsman</option>
                                            <option>Bowler</option>
                                            <option>All Rounder</option>
                                            <option>Wicket Keeper</option>
                                            <option>Supporter / Fan</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Experience */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Message / Experience
                            </h3>
                            <div className="relative group">
                                <textarea
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all placeholder-gray-700 resize-none leading-relaxed"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>

                        {/* Honeypot */}
                        <div style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                            <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex="-1" autoComplete="off" />
                        </div>

                        {/* Legal Section */}
                        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="w-24 h-24 text-yellow-500 rotate-12" />
                            </div>

                            <div className="flex gap-4 relative z-10">
                                <Shield className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0" />
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-yellow-500 font-bold mb-1">Data Privacy Declaration (DSGVO)</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                                            By submitting this form, I explicitly consent to the processing of my personal data by Spartan Cricket Club e.V. for membership purposes in accordance with Art. 6 GDPR.
                                        </p>
                                    </div>

                                    <label className="flex items-center gap-4 cursor-pointer group/check">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="legalConsent"
                                                checked={formData.legalConsent}
                                                onChange={handleChange}
                                                className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-white/20 bg-black checked:border-[#e31e24] checked:bg-[#e31e24] transition-all"
                                            />
                                            <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-4 h-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-300 group-hover/check:text-white transition-colors">
                                            I accept the Terms & Privacy Policy
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-[#e31e24] hover:bg-[#c4181d] text-white font-bold py-5 rounded-2xl transition-all transform hover:scale-[1.01] flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-[#e31e24]/10"
                        >
                            {status === 'submitting' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Submit Application</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-600 text-sm mt-8">
                    &copy; 2024 Spartans Cricket Club Frankfurt e.V. All rights reserved.
                </p>
            </div>

            {/* Error Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animation-fade-in">
                    <div className="bg-[#1a1a1a] border border-red-500/20 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Details Missing</h3>
                        <p className="text-gray-400 mb-8">{popupMessage}</p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="bg-[#333] hover:bg-[#444] text-white px-8 py-3 rounded-xl font-medium transition-colors w-full"
                        >
                            Review Form
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinRequestForm;
