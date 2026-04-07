import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { contactAPI } from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            // Mapping to general field names, backend might expect typical names
            await contactAPI.submitContact({
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                message: formData.message
            });
            setStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };
    return (
        <div className="font-sans text-gray-900 bg-white min-h-screen">
            <Navbar />

            <section className="pt-32 pb-20 bg-gray-50 flex items-center min-h-[90vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                        {/* Contact Information */}
                        <div>
                            <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Get in Touch</span>
                            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">We'd love to hear from you.</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-12">
                                Whether you have a question about our packages, pricing, or just want to say hello, our team is ready to answer all your questions.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-gray-100 flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Visit Us</h4>
                                        <p className="text-gray-500">123 Travel Street, Suite 404<br />San Francisco, CA 94107</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-gray-100 flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Chat with us</h4>
                                        <p className="text-gray-500">Our friendly team is here to help.</p>
                                        <a href="mailto:hello@triplova.com" className="text-primary-600 font-medium hover:underline">hello@triplova.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-gray-100 flex-shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">Call us</h4>
                                        <p className="text-gray-500">Mon-Fri from 8am to 5pm.</p>
                                        <a href="tel:+15550000000" className="text-primary-600 font-medium hover:underline">+1 (555) 000-0000</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                            {status === 'success' && (
                                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fade-in-up">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-500 text-center max-w-[250px]">Thank you for reaching out. Our team will get back to you shortly.</p>
                                </div>
                            )}
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                        <input type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required placeholder="John" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                        <input type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required placeholder="Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required placeholder="you@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                    <textarea rows="4" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required placeholder="How can we help you?" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"></textarea>
                                </div>
                                {status === 'error' && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                                        Failed to send message. Please try again.
                                    </div>
                                )}
                                <div className="flex flex-col gap-3 mt-4">
                                    <button type="submit" disabled={status === 'loading'} className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2">
                                        {status === 'loading' ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                                        ) : (
                                            <>Send Message <Send className="w-4 h-4" /></>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            firstName: 'Alex',
                                            lastName: 'Carter',
                                            email: 'alex.carter@example.com',
                                            message: 'Hello! I am very interested in booking the Alpine Mountain Gateway package for 2 adults next month. Could you provide some details on upcoming availability and weather conditions? Thank you!'
                                        })}
                                        className="text-xs text-gray-400 hover:text-primary-600 font-medium transition-colors w-fit mx-auto"
                                    >
                                        Auto-fill with mock data
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
