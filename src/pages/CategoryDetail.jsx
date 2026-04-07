import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, ArrowRight, MapPin, Loader2, List, Package } from 'lucide-react';
import { subCategoryAPI, IMG_BASE } from '../services/api';

const subCategoryFallbacks = [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?w=600&auto=format&fit=crop&q=80',
];

const CategoryDetail = () => {
    const { continentName, categoryName } = useParams();
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                // Note: In a real backend, we'd filter subcategories by category Name/Id
                // For now, we'll fetch all and filter client-side if the API doesn't support specific filtering
                const res = await subCategoryAPI.getAll();
                if (res && res.status === 'success' && Array.isArray(res.data)) {
                    // Simple filtering logic - assuming subcategories have a category_name field
                    // Search for either subcategory's native name or a filtered parent name.
                    const filtered = res.data.filter(sub => 
                        (sub.category_name || '').toLowerCase() === categoryName?.toLowerCase()
                    );
                    setSubCategories(filtered.length > 0 ? filtered : res.data); // Fallback to all for demo
                } else {
                    setSubCategories([]);
                }
            } catch (err) {
                console.error('Failed to fetch sub-categories:', err);
                setError('Failed to load sub-categories for this category.');
            } finally {
                setLoading(false);
            }
        };
        fetchSubCategories();
    }, [categoryName]);

    const getImageUrl = (sub, index) => {
        if (sub.image && sub.image.trim() !== '') {
            const img = sub.image;
            if (img.startsWith('http') || img.startsWith('blob:')) return img;
            return `${IMG_BASE}${img}`;
        }
        return subCategoryFallbacks[index % subCategoryFallbacks.length];
    };

    const displayContinent = continentName.charAt(0).toUpperCase() + continentName.slice(1);
    const displayCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    return (
        <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Header */}
            <div className="pt-28 pb-14 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] bg-primary-500 rounded-full blur-[120px]"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <Link to="/destinations" className="text-gray-400 hover:text-[#FFCE00] transition-colors text-sm font-medium">
                            Destinations
                        </Link>
                        <span className="text-gray-600">/</span>
                        <Link to={`/destinations/${continentName}`} className="text-gray-400 hover:text-[#FFCE00] transition-colors text-sm font-medium capitalize">
                            {displayContinent}
                        </Link>
                        <span className="text-gray-600">/</span>
                        <span className="text-white text-sm font-bold capitalize">{displayCategory}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight capitalize">{displayCategory}</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Explore sub-categories and unique experiences in {displayCategory}.
                    </p>
                </div>
            </div>

            {/* SubCategories Section */}
            <section className="py-16 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                            <span className="ml-4 text-gray-500 text-lg font-medium">Loading sub-categories...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-16">
                            <p className="text-red-500 text-lg font-medium">{error}</p>
                            <Link to={`/destinations/${continentName}`} className="inline-flex items-center gap-2 text-primary-600 hover:underline mt-4 font-medium">
                                <ArrowLeft className="w-4 h-4" /> Back to {displayContinent}
                            </Link>
                        </div>
                    )}

                    {/* SubCategories Grid */}
                    {!loading && !error && (
                        <>
                            {subCategories.length > 0 ? (
                                <>
                                    <div className="mb-10">
                                        <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Experiences</span>
                                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                                            {subCategories.length} {subCategories.length === 1 ? 'Sub-Category' : 'Sub-Categories'}
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {subCategories.map((sub, index) => (
                                                <Link
                                                key={`${sub.id || sub.sub_id}-${index}`}
                                                to={`/destinations/${continentName}/${categoryName}/${(sub.name || sub.sub_name || 'undefined').toLowerCase()}`}
                                                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100 transform hover:-translate-y-1"
                                            >
                                                <div className="relative h-56 overflow-hidden">
                                                    <img
                                                        src={getImageUrl(sub, index)}
                                                        alt={sub.name || sub.sub_name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = subCategoryFallbacks[index % subCategoryFallbacks.length];
                                                        }}
                                                    />
                                                </div>
                                                <div className="p-6 flex flex-col flex-grow">
                                                    <div className="flex items-center text-gray-500 text-sm mb-3">
                                                        <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                                                        <span className="capitalize">{displayCategory}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{sub.name || sub.sub_name}</h3>
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
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No sub-categories yet</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                                        Check back later for exciting experiences in {displayCategory}!
                                    </p>
                                    <Link
                                        to={`/destinations/${continentName}`}
                                        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
                                    >
                                        <ArrowLeft className="w-5 h-5" /> Back to {displayContinent}
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

export default CategoryDetail;
