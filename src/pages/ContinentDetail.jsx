import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, ArrowRight, MapPin, Loader2, Globe2, Package } from 'lucide-react';
import { continentsAPI } from '../services/api';

const IMG_BASE = 'https://triplova.com/triplova-project/api/admin/';

const categoryFallbacks = [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&auto=format&fit=crop&q=80',
];

const ContinentDetail = () => {
    const { continentName } = useParams();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await continentsAPI.getByContinent(continentName);
                if (res && res.status === 'success' && Array.isArray(res.data)) {
                    setCategories(res.data);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                setError('Failed to load categories for this continent.');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [continentName]);

    const getCategoryImage = (cat, index) => {
        if (cat.image && cat.image.trim() !== '') {
            const img = cat.image;
            if (img.startsWith('http') || img.startsWith('blob:')) return img;
            return `${IMG_BASE}${img}`;
        }
        return categoryFallbacks[index % categoryFallbacks.length];
    };

    const displayName = continentName.charAt(0).toUpperCase() + continentName.slice(1);

    return (
        <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Header */}
            <div className="pt-28 pb-14 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] bg-primary-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] bg-[#FFCE00] rounded-full blur-[100px]"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/destinations"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFCE00] transition-colors mb-6 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to All Destinations
                    </Link>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                            <Globe2 className="w-6 h-6 text-[#FFCE00]" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight capitalize">{displayName}</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Explore all destinations and travel packages available in {displayName}.
                    </p>
                </div>
            </div>

            {/* Categories Section */}
            <section className="py-16 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                            <span className="ml-4 text-gray-500 text-lg font-medium">Loading destinations in {displayName}...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-16">
                            <p className="text-red-500 text-lg font-medium">{error}</p>
                            <Link to="/destinations" className="inline-flex items-center gap-2 text-primary-600 hover:underline mt-4 font-medium">
                                <ArrowLeft className="w-4 h-4" /> Go back to destinations
                            </Link>
                        </div>
                    )}

                    {/* Categories Grid */}
                    {!loading && !error && (
                        <>
                            {categories.length > 0 ? (
                                <>
                                    <div className="mb-10">
                                        <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Destinations</span>
                                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                                            {categories.length} {categories.length === 1 ? 'Destination' : 'Destinations'} in {displayName}
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {categories.map((cat, index) => (
                                                <Link
                                                key={`${cat.id || cat.category_id}-${index}`}
                                                to={`/destinations/${continentName}/${(cat.name || cat.category_name || 'undefined').toLowerCase()}`}
                                                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100 transform hover:-translate-y-1"
                                            >
                                                <div className="relative h-56 overflow-hidden">
                                                    <img
                                                        src={getCategoryImage(cat, index)}
                                                        alt={cat.name || cat.category_name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = categoryFallbacks[index % categoryFallbacks.length];
                                                        }}
                                                    />
                                                    <div className="absolute top-4 left-4">
                                                        <span className="bg-[#FFCE00] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                            {displayName}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 flex flex-col flex-grow">
                                                    <div className="flex items-center text-gray-500 text-sm mb-3">
                                                        <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                                                        <span className="capitalize">{displayName}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{cat.name || cat.category_name}</h3>
                                                    {cat.description && (
                                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{cat.description}</p>
                                                    )}
                                                    <div className="mt-auto flex items-center justify-end pt-4 border-t border-gray-100">
                                                        <span className="flex items-center gap-1 text-sm font-bold text-primary-600 group-hover:text-primary-700 group-hover:translate-x-1 transition-all">
                                                            Explore <ArrowRight className="w-4 h-4" />
                                                        </span>

                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20">
                                    <Package className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No destinations yet</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                                        We're working on adding amazing destinations in {displayName}. Check back soon!
                                    </p>
                                    <Link
                                        to="/destinations"
                                        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
                                    >
                                        <ArrowLeft className="w-5 h-5" /> Explore Other Continents
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ContinentDetail;
