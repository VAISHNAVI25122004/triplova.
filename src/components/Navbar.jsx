import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Plane, Search, User, LogOut, Heart, MapPin, ArrowRight } from 'lucide-react';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { packageAPI, childCategoryAPI } from '../services/api';

const initialPackages = [
    { id: 1, name: 'Golden Europe Tour', destination: 'Europe', price: '$2,499' },
    { id: 2, name: 'Bali Paradise', destination: 'Indonesia', price: '$1,299' },
    { id: 3, name: 'Swiss Alps Adventure', destination: 'Switzerland', price: '$3,199' },
    { id: 4, name: 'Japan Cherry Blossom', destination: 'Japan', price: '$2,899' },
    { id: 5, name: 'Dubai Luxury', destination: 'UAE', price: '$4,500' },
    { id: 6, name: 'Maldives Retreat', destination: 'Maldives', price: '$3,800' },
    { id: 'default-new-1', name: 'Sapphire Beach Resort', destination: 'Maldives', price: '$1,299' },
    { id: 'default-new-2', name: 'Alpine Mountain Gateway', destination: 'Switzerland', price: '$2,150' },
    { id: 'default-new-3', name: 'Desert Safari Expedition', destination: 'Dubai', price: '$899' }
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allPackages, setAllPackages] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const { user, logout } = useAuth();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch packages for search auto-suggest globally
    useEffect(() => {
        if (isSearchOpen && allPackages.length === 0) {
            setIsSearching(true);

            Promise.all([
                packageAPI.getAll().catch(err => ({ status: 'error', data: [] })),
                childCategoryAPI.getAll().catch(err => ({ status: 'error', data: [] }))
            ]).then(([localPackagesData, childCategoryData]) => {
                let combined = [...initialPackages];
                const deletedChildIds = JSON.parse(localStorage.getItem('triplova_deleted_child_category_ids') || '[]');

                if (childCategoryData && childCategoryData.status === 'success' && Array.isArray(childCategoryData.data)) {
                    combined = [...combined, ...childCategoryData.data.filter(child => !deletedChildIds.includes(child.childCategory_id))];
                }
                if (localPackagesData && localPackagesData.status === 'success' && Array.isArray(localPackagesData.data)) {
                    combined = [...combined, ...localPackagesData.data];
                }

                setAllPackages(combined);
                setIsSearching(false);
            });
        }
    }, [isSearchOpen, allPackages.length]);

    // Derived filtered packages
    const filteredPackages = allPackages.filter(pkg =>
        (pkg.name && pkg.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pkg.destination && pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Prevent body scroll when search is open
    useEffect(() => {
        if (isSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setSearchQuery('');
        }
    }, [isSearchOpen]);

    // Pages where navbar should have a solid background
    const isSolidNavPage = ['/destinations', '/reviews', '/contact', '/about'].includes(location.pathname);

    // Handle scroll for glass effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Destinations', path: '/destinations' },
        { name: 'Premium', path: '/premium' },
        { name: 'Reviews', path: '/reviews' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            {/* ====== GLOBAL SEARCH OVERLAY ====== */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-md flex items-start justify-center pt-10 sm:pt-24 px-4 animate-fade-in">
                    <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-scale-in">
                        {/* Search Input Area */}
                        <div className="flex items-center p-4 border-b border-gray-100">
                            <Search className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search continents, countries, or packages..."
                                className="flex-1 text-lg sm:text-xl outline-none text-gray-800 placeholder-gray-400 bg-transparent w-full"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0 ml-2"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Auto Suggest Results Area */}
                        <div className="max-h-[60vh] overflow-y-auto bg-gray-50/50">
                            {isSearching ? (
                                <div className="p-12 text-center text-gray-500 flex flex-col items-center animate-pulse">
                                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p>Loading global destinations...</p>
                                </div>
                            ) : searchQuery.trim() === '' ? (
                                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                    <MapPin className="w-12 h-12 text-gray-300 mb-4" />
                                    <p className="font-medium text-gray-600">Type to search for your next adventure</p>
                                    <div className="flex gap-3 mt-6 flex-wrap justify-center">
                                        <button onClick={() => setSearchQuery('Europe')} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors">Europe</button>
                                        <button onClick={() => setSearchQuery('Dubai')} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors">Dubai</button>
                                        <button onClick={() => setSearchQuery('Safari')} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors">Safari</button>
                                    </div>
                                </div>
                            ) : filteredPackages.length > 0 ? (
                                <div className="p-2">
                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Top Results ({filteredPackages.length})</div>
                                    <div className="flex flex-col">
                                        {filteredPackages.map((pkg) => (
                                            <Link
                                                to="/destinations"
                                                key={pkg.id}
                                                onClick={() => setIsSearchOpen(false)}
                                                className="flex items-center gap-4 p-3 hover:bg-white rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-gray-100"
                                            >
                                                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                                    <img src={pkg.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&auto=format&fit=crop&q=60'} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-gray-900 font-bold text-base truncate pr-4 group-hover:text-primary-600 transition-colors">{pkg.name}</h4>
                                                    <div className="flex items-center text-sm text-gray-500 mt-0.5 gap-2">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{pkg.destination || 'Global'}</span>
                                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                        <span className="font-semibold text-gray-700">{pkg.price}</span>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors flex-shrink-0">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                    <Plane className="w-12 h-12 text-gray-300 mb-4 opacity-50" />
                                    <p className="text-lg font-medium text-gray-700">No destinations found matching "{searchQuery}"</p>
                                    <p className="text-sm mt-2">Try adjusting your keywords (e.g., 'Paris', 'Beach', 'Europe')</p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-6 text-primary-600 font-bold hover:underline"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 
              Floating Innovative Navbar 
              - Centered Pill Shape
              - Adaptive Glassmorphism (Dark transparent at top, White frosted on scroll)
            */}
            <nav
                className={`fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 rounded-full transition-all duration-500 border
                ${isScrolled
                        ? 'bg-gray-900/80 backdrop-blur-xl border-white/20 shadow-2xl py-3 px-6'
                        : isSolidNavPage
                            ? 'bg-gray-900/90 backdrop-blur-md border-white/10 py-4 px-8 shadow-xl'
                            : 'bg-black/20 backdrop-blur-md border-white/10 py-4 px-8'
                    }`}
            >
                <div className="flex justify-between items-center">

                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isScrolled ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-white text-primary-600'}`}>
                            <Plane className="w-5 h-5 transform group-hover:rotate-45 transition-transform duration-300" />
                        </div>
                        <span className={`text-xl font-bold tracking-tight hidden sm:block transition-colors duration-300 text-white`}>
                            Trip<span className='text-primary-400'>lova</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-1 bg-transparent p-1 rounded-full">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                ${isScrolled
                                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                                        : 'text-white/90 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => setIsSearchOpen(true)} className={`p-2.5 rounded-full transition-all duration-300 group ${isScrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>

                        <Link to="/wishlist" className="relative p-2.5 rounded-full transition-all duration-300 group">
                            <Heart className={`w-5 h-5 transition-colors ${isScrolled ? 'text-white/80 group-hover:text-red-400' : 'text-white/70 group-hover:text-red-400'}`} />
                            {wishlist.length > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white flex items-center justify-center rounded-full text-[10px] font-bold shadow-md animate-scale-in">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3 pl-2 border-l border-gray-200/20">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isScrolled ? 'bg-white/10' : 'bg-white/10'} transition-colors`}>
                                    <User className={`w-4 h-4 text-white`} />
                                    <span className={`text-sm font-semibold max-w-[100px] truncate text-white`}>
                                        {(user.name || 'User').split(' ')[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    title="Logout"
                                    className={`p-2 rounded-full transition-all ${isScrolled ? 'text-red-300 hover:bg-white/10' : 'text-red-300 hover:bg-white/10 hover:text-red-200'}`}
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg
                                ${isScrolled
                                        ? 'bg-white text-gray-900 hover:bg-gray-50 shadow-black/20'
                                        : 'bg-white text-gray-900 hover:bg-gray-50 shadow-black/20'
                                    }`}
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`md:hidden p-2 rounded-full transition-colors ${isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown (Floating Card) */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 mt-4 w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4 md:hidden animate-scale-in origin-top">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="px-4 py-3 rounded-xl text-gray-600 font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-gray-100 my-2"></div>

                            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-600 font-medium hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-between">
                                <span className="flex items-center gap-2"><Heart className="w-5 h-5" /> Wishlist</span>
                                {wishlist.length > 0 && (
                                    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
                                    <LogOut className="w-5 h-5" /> Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold shadow-lg shadow-gray-900/20 active:scale-[0.98] transition-all"
                                >
                                    Login / Sign Up
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
