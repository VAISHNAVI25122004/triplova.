import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, ArrowRight, MapPin, Loader2, List, Grid } from 'lucide-react';
import { childCategoryAPI, IMG_BASE } from '../services/api';

const childCategoryFallbacks = [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80',
];

const SubCategoryDetail = () => {
    const { continentName, categoryName, subCategoryName } = useParams();
    const [childCategories, setChildCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChildCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await childCategoryAPI.getAll();
                if (res && res.status === 'success' && Array.isArray(res.data)) {
                    const filtered = res.data.filter(child => 
                        (child.sub_name || '').toLowerCase() === subCategoryName?.toLowerCase()
                    );
                    setChildCategories(filtered.length > 0 ? filtered : res.data); // Fallback for demo
                } else {
                    setChildCategories([]);
                }
            } catch (err) {
                console.error('Failed to fetch child categories:', err);
                setError('Failed to load details for this sub-category.');
            } finally {
                setLoading(false);
            }
        };
        fetchChildCategories();
    }, [subCategoryName]);

    const getImageUrl = (child, index) => {
        if (child.image && child.image.trim() !== '') {
            const img = child.image;
            if (img.startsWith('http') || img.startsWith('blob:')) return img;
            return `${IMG_BASE}${img}`;
        }
        return childCategoryFallbacks[index % childCategoryFallbacks.length];
    };

    const displaySub = subCategoryName.charAt(0).toUpperCase() + subCategoryName.slice(1);

    return (
        <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Header */}
            <div className="pt-28 pb-14 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] bg-[#FFCE00] rounded-full blur-[120px]"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-4 mb-6 text-sm font-medium">
                        <Link to="/destinations" className="text-gray-400 hover:text-[#FFCE00]">Destinations</Link>
                        <span className="text-gray-600">/</span>
                        <Link to={`/destinations/${continentName}`} className="text-gray-400 hover:text-[#FFCE00] capitalize">{continentName}</Link>
                        <span className="text-gray-600">/</span>
                        <Link to={`/destinations/${continentName}/${categoryName}`} className="text-gray-400 hover:text-[#FFCE00] capitalize">{categoryName}</Link>
                        <span className="text-gray-600">/</span>
                        <span className="text-white capitalize font-bold">{displaySub}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight capitalize">{displaySub}</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Dive deeper into specific types of packages available in {displaySub}.
                    </p>
                </div>
            </div>

            {/* ChildCategories Grid */}
            <section className="py-16 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {childCategories.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {childCategories.map((child, index) => (
                                        <Link 
                                            key={`${child.id || child.child_id}-${index}`}
                                            to={`/destinations/${continentName}/${categoryName}/${subCategoryName}/${(child.name || child.child_name || 'undefined').toLowerCase()}`}
                                            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group group border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
                                        >
                                            <div className="relative h-56 overflow-hidden">
                                                <img 
                                                    src={getImageUrl(child, index)} 
                                                    alt={child.name || child.child_name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{child.name || child.child_name}</h3>
                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Explore the finest selections of {child.name || child.child_name}.</p>
                                                <div className="mt-auto flex items-center justify-end pt-4 border-t border-gray-100">
                                                    <span className="flex items-center gap-1 text-sm font-bold text-primary-600 group-hover:text-primary-700 group-hover:translate-x-1 transition-all">
                                                        Explore Packages <ArrowRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <Grid className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500">No child categories found for this sub-category.</p>
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

export default SubCategoryDetail;
