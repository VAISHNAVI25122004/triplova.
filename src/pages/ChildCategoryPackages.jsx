import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, ArrowRight, MapPin, Loader2, Package, Star, MessageCircle } from 'lucide-react';
import { continentsAPI, bookingAPI, whatsappAPI, IMG_BASE } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';

const packageFallbacks = [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80',
];

const ChildCategoryPackages = () => {
    const { continentName, categoryName, subCategoryName, childCategoryName } = useParams();
    const { user, authStep } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();

    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingLoading, setBookingLoading] = useState({});
    const [toast, setToast] = useState(null);

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 6000);
    };

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                setError(null);
                // Now fetching by child category
                const res = await continentsAPI.getByChildCategory(childCategoryName);
                if (res && res.status === 'success' && Array.isArray(res.data)) {
                    setPackages(res.data);
                } else {
                    setPackages([]);
                }
            } catch (err) {
                console.error('Failed to fetch packages:', err);
                setError('Failed to load packages for this selection.');
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, [childCategoryName]);

    const getPackageImage = (pkg, index) => {
        if (pkg.image && pkg.image.trim() !== '') {
            const img = pkg.image;
            if (img.startsWith('http') || img.startsWith('blob:')) return img;
            return `${IMG_BASE}${img}`;
        }
        return packageFallbacks[index % packageFallbacks.length];
    };

    const handleBooking = async (pkg) => {
        if (!user || authStep !== 'AUTHENTICATED') {
            navigate('/login');
            return;
        }

        const userPhone = user.phone;
        if (!userPhone || userPhone === 'PENDING_VERIFICATION') {
            showToast('error', '⚠️ Please verify your mobile number first.');
            return;
        }

        const name = pkg.name || pkg.category_name || childCategoryName || 'Travel Package';
        const location = pkg.destination || pkg.location || continentName || 'Global';
        const price = pkg.price || 'Contact Us';
        const pkgKey = pkg.id || pkg.category_id || name;

        if (bookingLoading[pkgKey]) return;
        setBookingLoading(prev => ({ ...prev, [pkgKey]: true }));

        // Show initial loading state
        showToast('success', '⏳ Processing your booking inquiry...');

        try {
            await bookingAPI.logIntent({
                user_phone: userPhone,
                package_name: name,
                package_location: location,
                package_price: price
            });

            const message = `✈️ *Confirm Your Triplova Booking*

Dear ${user.name || 'Traveler'}, 🙏

We've received your booking inquiry for *${name}*! 

━━━━━━━━━━━━━━━━━━━━━━
🏝️ *Trip Details*
━━━━━━━━━━━━━━━━━━━━━━
🗺️ Package      : ${name}
📍 Destination  : ${location}
💰 Price         : ${price} / person
📅 Booking Date : ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

━━━━━━━━━━━━━━━━━━━━━━
💳 *Payment & Confirmation*
━━━━━━━━━━━━━━━━━━━━━━
To confirm your booking and get payment details, please reply to this message with "CONFIRM". Our team will then share:
✅ Secure Payment Link
✅ Detailed Itinerary
✅ Hotel & Flight Vouchers

🌍 *Triplova – Your Journey, Our Passion!*
_"Making Every Mile Memorable"_`;

            const result = await whatsappAPI.send(userPhone, message);
            if (result.status !== 'success') {
                throw new Error(result.message || 'WhatsApp send failed');
            }

            showToast('success', '✅ WhatsApp Message Sent! Please check your phone to confirm your booking.');
        } catch (err) {
            console.error('Booking error:', err);
            showToast('error', '❌ Failed to send WhatsApp message. Please contact support.');
        } finally {
            setTimeout(() => setBookingLoading(prev => ({ ...prev, [pkgKey]: false })), 3000);
        }
    };

    const displayContinent = continentName ? continentName.charAt(0).toUpperCase() + continentName.slice(1) : '';
    const displayCategory = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : '';
    const displaySub = subCategoryName ? subCategoryName.charAt(0).toUpperCase() + subCategoryName.slice(1) : '';
    const displayChild = childCategoryName ? childCategoryName.charAt(0).toUpperCase() + childCategoryName.slice(1) : '';

    return (
        <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white text-sm font-bold max-w-md w-[calc(100%-2rem)] animate-bounce-in ${toast.type === 'success' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-red-600'}`}>
                    <div className="shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        {toast.type === 'success' ? '✅' : '❌'}
                    </div>
                    <span className="flex-1 leading-tight">{toast.msg}</span>
                    <button onClick={() => setToast(null)} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
                </div>
            )}

            {/* Hero Header */}
            <div className="pt-28 pb-14 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] bg-primary-500 rounded-full blur-[120px]"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-2 mb-6 text-xs sm:text-sm font-medium flex-wrap">
                        <Link to="/destinations" className="text-gray-400 hover:text-[#FFCE00] transition-colors">Destinations</Link>
                        <span className="text-gray-600">/</span>
                        <Link to={`/destinations/${continentName}`} className="text-gray-400 hover:text-[#FFCE00] transition-colors capitalize">{displayContinent}</Link>
                        <span className="text-gray-600">/</span>
                        <Link to={`/destinations/${continentName}/${categoryName}`} className="text-gray-400 hover:text-[#FFCE00] transition-colors capitalize">{displayCategory}</Link>
                        <span className="text-gray-600">/</span>
                        <Link to={`/destinations/${continentName}/${categoryName}/${subCategoryName}`} className="text-gray-400 hover:text-[#FFCE00] transition-colors capitalize">{displaySub}</Link>
                        <span className="text-gray-600">/</span>
                        <span className="text-white font-bold capitalize">{displayChild}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight capitalize">{displayChild}</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Curated travel packages for {displayChild} in {displaySub}.
                    </p>
                </div>
            </div>


            {/* Packages Section */}
            <section className="py-16 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                            <span className="ml-4 text-gray-500 text-lg font-medium">Loading packages...</span>
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div className="text-center py-16">
                            <p className="text-red-500 text-lg font-medium">{error}</p>
                            <Link to={`/destinations/${continentName}`} className="inline-flex items-center gap-2 text-primary-600 hover:underline mt-4 font-medium">
                                <ArrowLeft className="w-4 h-4" /> Back to {displayContinent}
                            </Link>
                        </div>
                    )}

                    {/* Packages Grid */}
                    {!loading && !error && (
                        <>
                            {packages.length > 0 ? (
                                <>
                                    <div className="mb-10">
                                        <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Packages</span>
                                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                                            {packages.length} {packages.length === 1 ? 'Package' : 'Packages'} Available
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {packages.map((pkg, index) => {
                                            const name = pkg.name || pkg.category_name || displayCategory;
                                            const price = pkg.price || 'Contact Us';
                                            const description = pkg.description || `Explore the beauty of ${name}`;
                                            const pkgKey = pkg.id || pkg.category_id || index;

                                            return (
                                                <div
                                                    key={`${pkgKey}-${index}`}
                                                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100"
                                                >
                                                    <div className="relative h-56 overflow-hidden">
                                                        <img
                                                            src={getPackageImage(pkg, index)}
                                                            alt={name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = packageFallbacks[index % packageFallbacks.length];
                                                            }}
                                                        />
                                                        <div className="absolute top-4 left-4">
                                                            <span className="bg-[#FFCE00] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                                {displayContinent}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(pkg); }}
                                                            className={`absolute top-4 right-4 w-8 h-8 backdrop-blur-md rounded-full flex items-center justify-center transition-colors ${isInWishlist(pkg) ? 'bg-white text-red-500 shadow-md' : 'bg-white/50 hover:bg-white text-gray-700'}`}
                                                        >
                                                            <Heart className={`w-4 h-4 ${isInWishlist(pkg) ? 'fill-current' : ''}`} />
                                                        </button>
                                                    </div>
                                                    <div className="p-6 flex flex-col flex-grow">
                                                        <div className="flex items-center text-gray-500 text-sm mb-3">
                                                            <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                                                            <span className="capitalize">{displayCategory}, {displayContinent}</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{name}</h3>
                                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{description}</p>
                                                        <div className="flex items-center gap-1 mb-4">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className="w-4 h-4 text-[#FFCE00] fill-current" />
                                                            ))}
                                                        </div>
                                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Price</span>
                                                                <span className="text-xl font-bold text-gray-900">{price}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleBooking(pkg)}
                                                                disabled={bookingLoading[pkgKey]}
                                                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 ${bookingLoading[pkgKey]
                                                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                                                    : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
                                                                    }`}
                                                            >
                                                                {bookingLoading[pkgKey] ? (
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <MessageCircle className="w-4 h-4" />
                                                                )}
                                                                <span>{bookingLoading[pkgKey] ? 'Sending...' : 'Book Now'}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20">
                                    <Package className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No packages yet</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                                        Packages for {displayCategory} in {displayContinent} are coming soon. Stay tuned!
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

export default ChildCategoryPackages;
