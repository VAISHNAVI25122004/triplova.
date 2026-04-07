import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" onClick={scrollToTop} className="text-2xl font-bold mb-6 block">Triplova</Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Making travel simple, affordable, and unforgettable since 2026. Join us to explore the world's most beautiful destinations.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-gray-200">Company</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/about" onClick={scrollToTop} className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/careers" onClick={scrollToTop} className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link to="/blog" onClick={scrollToTop} className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/premium" onClick={scrollToTop} className="hover:text-white transition-colors">Premium</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-gray-200">Support</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/contact" onClick={scrollToTop} className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/faqs" onClick={scrollToTop} className="hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" onClick={scrollToTop} className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm relative">
                    <p>&copy; 2026 Triplova Inc. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0 items-center">
                        <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" onClick={scrollToTop} className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/sitemap" onClick={scrollToTop} className="hover:text-white transition-colors">Sitemap</Link>

                        <button
                            onClick={scrollToTop}
                            className="ml-4 w-10 h-10 bg-primary-600/20 text-primary-500 hover:bg-primary-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-primary-500/50 -mt-2 group"
                            title="Back to top"
                        >
                            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
