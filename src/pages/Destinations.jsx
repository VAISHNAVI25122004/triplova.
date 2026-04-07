import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Globe2, MapPin, Loader2, Cloud, Heart, BookOpen } from 'lucide-react';
import { continentsAPI } from '../services/api';

const IMG_BASE = 'https://triplova.com/triplova-project/api/admin/';

// Fallback images for continents
const continentFallbacks = {
    africa: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&auto=format&fit=crop&q=80',
    asia: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80',
    europe: 'https://plus.unsplash.com/premium_photo-1688410049290-d7394cc7d5df?w=800&auto=format&fit=crop&q=80',
    'north america': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=800&auto=format&fit=crop&q=80',
    'south america': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=80',
    australia: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&auto=format&fit=crop&q=80',
    antarctica: 'https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=800&auto=format&fit=crop&q=80',
};

// Continent-specific accent colors
const continentColors = [
    'from-blue-900/90 to-indigo-900/80',
    'from-amber-900/90 to-orange-900/80',
    'from-emerald-900/90 to-teal-900/80',
    'from-purple-900/90 to-violet-900/80',
    'from-rose-900/90 to-pink-900/80',
    'from-cyan-900/90 to-sky-900/80',
];

// Static categories to show alongside API continents
const staticCategories = [
    { name: 'Honeymoon Packages', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop', icon: Heart, link: '/premium' },
    { name: 'Europe Tour Packages', image: 'https://plus.unsplash.com/premium_photo-1688410049290-d7394cc7d5df?w=600&auto=format&fit=crop&q=60', icon: Cloud, link: '/premium' },
    { name: 'Educational Tours', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=60', icon: BookOpen, link: '/premium' },
];

const Destinations = () => {
    const [continents, setContinents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContinents = async () => {
            try {
                setLoading(true);
                const res = await continentsAPI.getAll();
                if (res && res.status === 'success' && Array.isArray(res.data)) {
                    setContinents(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch continents:', err);
                setError('Failed to load destinations. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchContinents();
    }, []);

    const getContinentImage = (continent) => {
        if (continent.image) {
            const img = continent.image;
            if (img.startsWith('http') || img.startsWith('blob:')) return img;
            return `${IMG_BASE}${img}`;
        }
        return continentFallbacks[continent.name?.toLowerCase()] || continentFallbacks.asia;
    };

    return (
        <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Header */}
            <div className="pt-28 pb-14 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-primary-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] bg-[#FFCE00] rounded-full blur-[100px]"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                            <Globe2 className="w-6 h-6 text-[#FFCE00]" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Explore Destinations</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">Discover the most breathtaking places across every continent, curated just for you.</p>
                </div>
            </div>

            {/* Continents Section (Dynamic from API) */}
            <section className="py-16 bg-white flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Section Title */}
                    <div className="mb-12">
                        <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">By Continent</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Explore by Region</h2>
                        <p className="text-gray-500 mt-3 max-w-xl">Choose a continent to discover all available destinations and travel packages.</p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                            <span className="ml-4 text-gray-500 text-lg font-medium">Loading destinations...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-16">
                            <p className="text-red-500 text-lg font-medium">{error}</p>
                        </div>
                    )}

                    {/* Continents Grid */}
                    {!loading && !error && (
                        <>
                            {continents.length > 0 ? (
                                <div className={`grid gap-6 mb-12 ${continents.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : continents.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                                    {continents.map((continent, index) => {
                                        const colorScheme = continentColors[index % continentColors.length];
                                        return (
                                            <Link
                                                key={continent.id}
                                                to={`/destinations/${continent.name.toLowerCase()}`}
                                                className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                                            >
                                                <img
                                                    src={getContinentImage(continent)}
                                                    alt={continent.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = continentFallbacks[continent.name?.toLowerCase()] || continentFallbacks.asia;
                                                    }}
                                                />
                                                <div className={`absolute inset-0 bg-gradient-to-t ${colorScheme}`}></div>
                                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="bg-[#FFCE00] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                            <MapPin className="w-3 h-3 inline-block -mt-0.5 mr-1" />
                                                            Continent
                                                        </span>
                                                    </div>
                                                    <h3 className="text-3xl font-bold text-white mb-2 capitalize">{continent.name}</h3>
                                                    <div className="flex justify-between items-center text-white/90">
                                                        <span className="text-sm font-medium opacity-80">Tap to explore destinations</span>
                                                        <span className="flex items-center gap-1 text-sm font-bold bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full group-hover:bg-[#FFCE00] group-hover:text-black transition-all duration-300">
                                                            Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 mb-12">
                                    <Globe2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">No continents available yet. Check back soon!</p>
                                </div>
                            )}

                            {/* Static Category Cards */}
                            <div className="mb-8">
                                <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Curated Experiences</span>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">Special Collections</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {staticCategories.map((cat, index) => {
                                    const Icon = cat.icon;
                                    return (
                                        <Link
                                            key={index}
                                            to={cat.link}
                                            className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                                        >
                                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-md">{cat.name}</h3>
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-[#FFCE00] group-hover:text-black transition-all">
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Destinations;
