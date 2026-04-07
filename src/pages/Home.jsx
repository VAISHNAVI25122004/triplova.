import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TrendingSlider from '../components/TrendingSlider';
import Footer from '../components/Footer';
import { categoryAPI, packageAPI, childCategoryAPI, bookingAPI, whatsappAPI } from '../services/api';
import { ArrowRight, Star, Heart, ShieldCheck, CreditCard, Headphones, Users, Umbrella, Mountain, Building2, Trees, Tent, Landmark, House, Cloud, BookOpen, Map, MessageCircle } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PackageCard from '../components/PackageCard';

const homeImages = [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1688410049290-d7394cc7d5df?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1663790588087-701ee7907ad2?w=600&auto=format&fit=crop&q=60"
];

const heroImages = [
    "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1465778893808-9b3d1b443be4?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&auto=format&fit=crop&q=80"
];

const Home = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [categories, setCategories] = useState([]);
    const [childCategories, setChildCategories] = useState([]);
    const [localPackages, setLocalPackages] = useState([]);
    const [isLoadingPackages, setIsLoadingPackages] = useState(true);
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { user, authStep } = useAuth();
    const navigate = useNavigate();
    const [bookingLoading, setBookingLoading] = useState({});
    const [toast, setToast] = useState(null);           // { type: 'success'|'error', message }
    const [bookingModal, setBookingModal] = useState(null); // selected package for the popup

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 6000);
    };

    // Unified Booking Logic → send WhatsApp via backend + show toast
    const handleBooking = async (pkg) => {
        if (!user || authStep !== 'AUTHENTICATED') {
            navigate('/login');
            return;
        }
        const userPhone = user.phone;
        if (!userPhone || userPhone === 'PENDING_VERIFICATION') {
            showToast('error', '⚠️ Please verify your mobile number first to book a package.');
            return;
        }

        const name = pkg.childCategory_name || pkg.name || 'Travel Package';
        const location = pkg.location || pkg.destination || 'Global';
        const price = pkg.price || 'Contact us';
        const pkgKey = pkg.childCategory_id || pkg.id;

        if (bookingLoading[pkgKey]) return;

        setBookingLoading(prev => ({ ...prev, [pkgKey]: true }));

        // Show immediate "Pop" message as requested
        showToast('success', '✨ Booking Initiated! You will receive a WhatsApp message shortly to confirm your trip and payment details.');

        try {
            // Log booking intent
            await bookingAPI.logIntent({
                user_phone: userPhone,
                package_name: name,
                package_location: location,
                package_price: price
            });

            // Rich WhatsApp message
            const message =
                `✈️ *Confirm Your Triplova Booking*

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
        } catch (error) {
            console.error('Booking error:', error);
            showToast('error', '❌ Failed to send WhatsApp message. Please contact support.');
        } finally {
            setTimeout(() => {
                setBookingLoading(prev => ({ ...prev, [pkgKey]: false }));
            }, 3000);
        }
    };


    useEffect(() => {
        let isMounted = true;

        const fetchPackages = () => {
            // Fetch categories
            categoryAPI.getAll().then(data => {
                if (isMounted && data && data.status === 'success' && Array.isArray(data.data)) {
                    const deletedIds = JSON.parse(localStorage.getItem('triplova_deleted_category_ids') || '[]');
                    const filtered = data.data.filter(cat => !deletedIds.includes(cat.category_id));
                    setCategories([...filtered].reverse());
                }
            }).catch(err => console.error(err));

            // Fetch local packages
            const p1 = packageAPI.getAll()
                .then(res => {
                    if (isMounted && res && res.status === 'success' && Array.isArray(res.data)) {
                        setLocalPackages([...res.data].reverse());
                    }
                })
                .catch(err => {
                    console.log("Local package DB not running or error:", err);
                    if (isMounted) setLocalPackages([]);
                });

            const p2 = childCategoryAPI.getAll().then(res => {
                if (isMounted && res && res.status === 'success' && Array.isArray(res.data)) {
                    const deletedChildIds = JSON.parse(localStorage.getItem('triplova_deleted_child_category_ids') || '[]');
                    let sortedData = [...res.data.filter(child => !deletedChildIds.includes(child.childCategory_id))];
                    if (sortedData.length > 0 && sortedData[0].created_at) {
                        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    } else if (sortedData.length > 0 && (sortedData[0].id || sortedData[0].childCategory_id)) {
                        sortedData.sort((a, b) => (b.id || b.childCategory_id || 0) - (a.id || a.childCategory_id || 0));
                    } else {
                        sortedData.reverse();
                    }
                    setChildCategories(sortedData);
                }
            }).catch(console.error);

            Promise.allSettled([p1, p2]).finally(() => {
                if (isMounted) setIsLoadingPackages(false);
            });
        };

        fetchPackages();

        window.addEventListener('focus', fetchPackages);
        window.addEventListener('storage', fetchPackages);

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', fetchPackages);
            window.removeEventListener('storage', fetchPackages);
        };
    }, []);
    return (
        <div className="font-sans text-gray-900 bg-white">

            {/* ── Toast Notification ── */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold max-w-sm w-[calc(100%-2rem)] animate-fade-in-up ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
                    }`}>
                    <span className="flex-1 leading-snug">{toast.message}</span>
                    <button onClick={() => setToast(null)} className="text-white/70 hover:text-white text-xl leading-none shrink-0">&times;</button>
                </div>
            )}

            <Navbar />

            {/* Hero Section */}
            <header className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
                {/* Image Slider */}
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img
                            src={img}
                            alt={`Hero Travel ${index + 1}`}
                            className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60"></div>
                    </div>
                ))}

                {/* Slider Indicators */}
                <div className="absolute bottom-32 right-8 z-20 flex gap-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <div className="relative h-full flex flex-col justify-center items-center text-center px-4 pt-4">
                    <span className="inline-block py-1 px-3 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest mb-4 border border-white/30 animate-fade-in-down">
                        Explore the World
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg animate-fade-in-up">
                        Discover Your Next <br /> <span className="text-primary-400">Great Adventure</span>
                    </h1>
                    <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto drop-shadow-md animate-fade-in-up delay-100">
                        Experience luxury, culture, and nature like never before.
                    </p>
                </div>


            </header>

            {/* Welcome Section */}
            <section id="about" className="py-8 bg-white text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Welcome to Triplova</h2>
                    <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                        <p>
                            Triplova Pvt. Ltd built on this strong foundation aims to provide great customer satisfaction and an exemplary holiday experience. Planning a once in a lifetime holiday or a yearly corporate retreat? No problem! Triplova can get you what you want and in the minimal time.
                        </p>
                    </div>
                </div>
            </section>

            {/* Destinations Section */}
            <div className="py-10 bg-white text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Our Destinations</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Discover the most breathtaking places around the globe. curated just for you.</p>
            </div>

            <section className="pb-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* India Packages */}
                        <Link to="/destinations" className="relative block h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop" alt="India" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <span className="bg-[#FFCE00] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Popular</span>
                                <h3 className="text-3xl font-bold text-white mb-2">India</h3>
                                <div className="flex justify-between items-center text-white/90">
                                    <span className="text-sm font-medium">Kerala, Rajasthan, Goa & more</span>
                                    <span className="flex items-center gap-1 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full group-hover:bg-[#FFCE00] group-hover:text-black transition-colors">
                                        Explore <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* International Packages */}
                        <Link to="/destinations" className="relative block h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" alt="International" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Global</span>
                                <h3 className="text-3xl font-bold text-white mb-2">International</h3>
                                <div className="flex justify-between items-center text-white/90">
                                    <span className="text-sm font-medium">Dubai, Singapore, Thailand & more</span>
                                    <span className="flex items-center gap-1 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full group-hover:bg-[#FFCE00] group-hover:text-black transition-colors">
                                        Explore <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Honeymoon */}
                        <Link to="/destinations" className="relative block h-80 rounded-2xl overflow-hidden group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop" alt="Honeymoon" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-md">Honeymoon Packages</h3>
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-[#FFCE00] group-hover:text-black transition-all">
                                    <Heart className="w-6 h-6" />
                                </div>
                            </div>
                        </Link>

                        {/* Europe */}
                        <Link to="/destinations" className="relative block h-80 rounded-2xl overflow-hidden group cursor-pointer">
                            <img src="https://plus.unsplash.com/premium_photo-1688410049290-d7394cc7d5df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZXVyb3BlfGVufDB8fDB8fHww" alt="Europe" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-md">Europe Tour Packages</h3>
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-[#FFCE00] group-hover:text-black transition-all">
                                    <Cloud className="w-6 h-6" />
                                </div>
                            </div>
                        </Link>

                        {/* Educational */}
                        <Link to="/destinations" className="relative block h-80 rounded-2xl overflow-hidden group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWR1Y2F0aW9ufGVufDB8fDB8fHww" alt="Education" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-md">Educational Tours</h3>
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-[#FFCE00] group-hover:text-black transition-all mb-4">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="bg-white/20 backdrop-blur-md text-white border border-white/50 px-5 py-2 rounded-full group-hover:bg-[#FFCE00] group-hover:text-black transition-colors text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-300">
                                    View All Packages
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Tour Packages Section */}
            <section id="packages" className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        {categories.slice(0, 3).map((cat, idx) => {
                            const imgUrl = cat.category_image ? (cat.category_image.startsWith('http') ? cat.category_image : `https://triplova.com/triplova-project/api/admin/${cat.category_image}`) : homeImages[idx % homeImages.length];

                            return (
                                <div key={cat.category_id || idx} className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
                                    <img src={imgUrl} alt={cat.category_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-md capitalize">{cat.category_name} Packages</h3>
                                        <span className="bg-[#FFCE00] text-gray-900 text-xs font-bold px-4 py-2 rounded uppercase tracking-wider">
                                            {(cat.subcategories?.length || 0)} Tours
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-8 border-t border-gray-100">
                        <div className="bg-yellow-50 p-6 hover:shadow-xl rounded-3xl transition-all duration-300 group">
                            <div className="w-20 h-20 mx-auto mb-6 relative">
                                <div className="absolute inset-0 border-2 border-[#FFCE00] rounded-full transform rotate-45 group-hover:rotate-12 transition-transform duration-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Users className="w-10 h-10 text-[#FFCE00] fill-current" />
                                </div>
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900 mb-2">50,000+</h3>
                            <p className="text-xl text-gray-600 font-medium">Abroad Trips</p>
                            <p className="text-gray-400 text-sm mt-3 leading-relaxed">For the last decade, we have organized more than 50,000 international itineraries.</p>
                        </div>
                        <div className="bg-yellow-50 p-6 hover:shadow-xl rounded-3xl transition-all duration-300 group">
                            <div className="w-20 h-20 mx-auto mb-6 relative">
                                <div className="absolute inset-0 border-2 border-[#FFCE00] rounded-full transform -rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Star className="w-10 h-10 text-[#FFCE00] fill-current" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-2">Handcrafted <br /> Experiences</h3>
                            <p className="text-gray-400 text-sm mt-3 leading-relaxed">Each and every itinerary is customized according to the taste of the customers.</p>
                        </div>
                        <div className="bg-yellow-50 p-6 hover:shadow-xl rounded-3xl transition-all duration-300 group">
                            <div className="w-20 h-20 mx-auto mb-6 relative">
                                <div className="absolute inset-0 border-2 border-[#FFCE00] rounded-full transform rotate-45 group-hover:-rotate-12 transition-transform duration-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Heart className="w-10 h-10 text-[#FFCE00] fill-current" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-2">Extremely Happy <br /> Travellers</h3>
                            <p className="text-gray-400 text-sm mt-3 leading-relaxed">We hold a record of great customer satisfaction and all customers are retained with us.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Collection */}
            <section id="premium" className="py-20 bg-gray-900 text-white overflow-hidden relative">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-600/30 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-primary-400 font-bold tracking-widest uppercase text-sm mb-2 block">Exclusive Access</span>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">Premium Collection</h2>
                            <p className="text-gray-400 max-w-xl">Curated luxury experiences for the discerning traveler. Unparalleled comfort, privacy, and style.</p>
                        </div>
                        <button onClick={() => alert("Opening VIP Collection...")} className="hidden md:flex items-center gap-2 text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all font-medium">
                            View All VIP Tours <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {childCategories.length > 0 ? childCategories.slice(0, 3).map((child, idx) => {
                            const fallbackImages = [
                                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop", // Luxury Bus
                                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop", // Resort
                                "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1974&auto=format&fit=crop"  // Villa
                            ];
                            const defaultImg = fallbackImages[idx % fallbackImages.length];
                            const imgUrl = child.childCategory_image ? (child.childCategory_image.startsWith('http') ? child.childCategory_image : `https://triplova.com/triplova-project/api/admin/${child.childCategory_image}`) : defaultImg;

                            return (
                                <div key={child.childCategory_id || idx} className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer">
                                    <img 
                                        src={imgUrl} 
                                        alt={child.childCategory_name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        onError={(e) => { e.target.src = defaultImg; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Trending</span>
                                        <h3 className="text-2xl font-bold text-white mb-2 capitalize">{child.childCategory_name}</h3>
                                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{child.childCategory_description || 'Experience absolute seclusion in your own private sanctuary.'}</p>
                                        <div className="flex justify-between items-center border-t border-white/20 pt-4">
                                            <span className="text-white font-bold text-lg">{child.price || 'Contact'} <span className="text-xs text-gray-400 font-normal">/ person</span></span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleBooking(child); }}
                                                disabled={bookingLoading[child.childCategory_id]}
                                                className={`text-sm font-medium flex items-center gap-1 transition-colors ${bookingLoading[child.childCategory_id] ? 'text-gray-500' : 'text-primary-400 hover:text-primary-300'}`}
                                            >
                                                {bookingLoading[child.childCategory_id] ? 'Loading...' : 'Book Now'} <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : (
                            <>
                                {/* Premium Card 1 Fallback */}
                                <div className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer">
                                    <img src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1974&auto=format&fit=crop" alt="Maldives" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Trending</span>
                                        <h3 className="text-2xl font-bold text-white mb-2">Maldives Private Villa</h3>
                                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">Experience absolute seclusion in your own overwater sanctuary with 24/7 butler service.</p>
                                        <div className="flex justify-between items-center border-t border-white/20 pt-4">
                                            <span className="text-white font-bold text-lg">$5,200 <span className="text-xs text-gray-400 font-normal">/ person</span></span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleBooking({ childCategory_id: 'default-p-1', childCategory_name: 'Maldives Private Villa', location: 'Maldives', price: '$5,200' }); }}
                                                className="text-primary-400 text-sm font-medium flex items-center gap-1 hover:text-primary-300 transition-colors"
                                            >
                                                Book Now <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Premium Card 2 Fallback */}
                                <div className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer">
                                    <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" alt="Swiss Alps" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Best Seller</span>
                                        <h3 className="text-2xl font-bold text-white mb-2">Swiss Alps Chalet</h3>
                                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">Ski-in/ski-out luxury chalet with panoramic mountain views and private chef.</p>
                                        <div className="flex justify-between items-center border-t border-white/20 pt-4">
                                            <span className="text-white font-bold text-lg">$4,800 <span className="text-xs text-gray-400 font-normal">/ person</span></span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleBooking({ childCategory_id: 'default-p-2', childCategory_name: 'Swiss Alps Chalet', location: 'Switzerland', price: '$4,800' }); }}
                                                className="text-primary-400 text-sm font-medium flex items-center gap-1 hover:text-primary-300 transition-colors"
                                            >
                                                Book Now <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Premium Card 3 Fallback */}
                                <div className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer">
                                    <img src="https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a3lvdG98ZW58MHx8MHx8fDA%3D" alt="Kyoto" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block border border-white/20">Cultural</span>
                                        <h3 className="text-2xl font-bold text-white mb-2">Kyoto Royal Heritage</h3>
                                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">Exclusive access to ancient temples and private tea ceremonies with geisha.</p>
                                        <div className="flex justify-between items-center border-t border-white/20 pt-4">
                                            <span className="text-white font-bold text-lg">$3,900 <span className="text-xs text-gray-400 font-normal">/ person</span></span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleBooking({ childCategory_id: 'default-p-3', childCategory_name: 'Kyoto Royal Heritage', location: 'Japan', price: '$3,900' }); }}
                                                className="text-primary-400 text-sm font-medium flex items-center gap-1 hover:text-primary-300 transition-colors"
                                            >
                                                Book Now <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Trending One Section */}
            <TrendingSlider />

            {/* Latest Packages Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <span className="text-[#FFCE00] font-bold tracking-widest uppercase text-sm mb-2 block">New Arrivals</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Packages</h2>
                        </div>
                        <button className="hidden md:flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors cursor-pointer">
                            View All Packages <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {isLoadingPackages ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(() => {
                                const defaultLatest = [
                                    {
                                        childCategory_id: 'default-new-1',
                                        childCategory_name: 'Sapphire Beach Resort',
                                        location: 'Maldives',
                                        price: '$1,299',
                                        childCategory_image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&auto=format&fit=crop&q=60'
                                    },
                                    {
                                        childCategory_id: 'default-new-2',
                                        childCategory_name: 'Alpine Mountain Gateway',
                                        location: 'Switzerland',
                                        price: '$2,150',
                                        childCategory_image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&auto=format&fit=crop&q=60'
                                    },
                                    {
                                        childCategory_id: 'default-new-3',
                                        childCategory_name: 'Desert Safari Expedition',
                                        location: 'Dubai',
                                        price: '$899',
                                        childCategory_image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=60'
                                    }
                                ];

                                const userAdded = localPackages.map(p => ({
                                    childCategory_id: p.id || Math.random(),
                                    childCategory_name: p.name,
                                    location: p.destination,
                                    price: p.price,
                                    childCategory_image: p.image
                                }));

                                const queue = [...userAdded, ...defaultLatest].slice(0, 3);
                                return queue.map((pkg, idx) => (
                                    <PackageCard key={pkg.childCategory_id || idx} pkg={pkg} isNewArrival={true} />
                                ));
                            })()}
                        </div>
                    )}
                </div>
            </section>

            {/* Feedbacks / Testimonials */}
            <section id="testimonials" className="py-10 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Testimonials</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Traveler Stories</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Review 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="flex text-yellow-500 mb-4 gap-1">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6 italic">"The trip to Bali was absolutely magical. The villa, the guide, and the itinerary were planned to perfection. Triplova made it all seamless."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" alt="User" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Sarah Jenkins</h4>
                                    <p className="text-gray-400 text-xs">Traveled to Bali</p>
                                </div>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="flex text-yellow-500 mb-4 gap-1">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6 italic">"Premium service from start to finish. The 24/7 support was a lifesaver when our flight was delayed. Highly recommend!"</p>
                            <div className="flex items-center gap-4">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop" alt="User" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Michael Chang</h4>
                                    <p className="text-gray-400 text-xs">Traveled to Japan</p>
                                </div>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="flex text-yellow-500 mb-4 gap-1">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6 italic">"Our honeymoon in Paris was a dream come true. The 'Romantic Getaway' package had everything we wanted and more. Thank you!"</p>
                            <div className="flex items-center gap-4">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop" alt="User" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Emma & David</h4>
                                    <p className="text-gray-400 text-xs">Traveled to Paris</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary-600 rounded-3xl p-8 md:p-16 text-white overflow-hidden relative">
                        {/* Background Patterns */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full mix-blend-overlay filter blur-3xl translate-y-1/3 -translate-x-1/3"></div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 shadow-lg">
                                    <ShieldCheck className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
                                <p className="text-white/80 text-sm leading-relaxed">We prioritize your safety with verified partners and 24/7 support throughout your journey.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 shadow-lg">
                                    <CreditCard className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Best Price Guarantee</h3>
                                <p className="text-white/80 text-sm leading-relaxed">Find a lower price? We'll match it. Making travel accessible to everyone is our mission.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 shadow-lg">
                                    <Headphones className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
                                <p className="text-white/80 text-sm leading-relaxed">Our dedicated team is here to assist you anytime, anywhere. You focus on the fun.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
