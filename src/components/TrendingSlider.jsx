
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, MapPin, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, whatsappAPI } from '../services/api';

const WAIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.107.547 4.084 1.504 5.805L0 24l6.334-1.491A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.802 9.802 0 01-5.014-1.376l-.36-.214-3.727.878.896-3.636-.235-.374A9.799 9.799 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
);

const trendingDestinations = [
    { id: 1, title: "Cappadocia, Turkey", location: "Turkey", image: "https://images.unsplash.com/photo-1559783684-874488c5f42f?w=600&auto=format&fit=crop&q=60", price: "$1,200", rating: 4.9, description: "Float over fairy chimneys in a hot air balloon at sunrise." },
    { id: 2, title: "Petra, Jordan", location: "Jordan", image: "https://images.unsplash.com/photo-1606210122158-eeb10e0823bf?w=600&auto=format&fit=crop&q=60", price: "$1,500", rating: 4.8, description: "Discover the Rose City carved directly into vibrant red sandstone cliffs." },
    { id: 3, title: "Bora Bora", location: "French Polynesia", image: "https://images.unsplash.com/photo-1532408840957-031d8034aeef?q=80&w=1932&auto=format&fit=crop", price: "$2,800", rating: 5.0, description: "Crystal clear waters and luxury huts over the turquoise lagoon." },
    { id: 4, title: "Machu Picchu", location: "Peru", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop", price: "$1,800", rating: 4.9, description: "Explore the ancient Incan citadel set high in the Andes Mountains." },
    { id: 5, title: "Amalfi Coast", location: "Italy", image: "https://images.unsplash.com/photo-1633321088355-d0f8c1eaad48?q=80&w=2070&auto=format&fit=crop", price: "$2,100", rating: 4.7, description: "Stunning coastline with colorful villages and dramatic cliffs." }
];

const TrendingSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [apiData, setApiData] = useState([]);
    const { user, authStep } = useAuth();
    const navigate = useNavigate();
    const [bookingLoading, setBookingLoading] = useState({});
    const [bookingModal, setBookingModal] = useState(null);
    const [toast, setToast] = useState(null);

    React.useEffect(() => {
        import('../services/api').then(({ subCategoryAPI }) => {
            subCategoryAPI.getAll().then(res => {
                if (res && res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
                    setApiData(res.data);
                }
            }).catch(console.error);
        });
    }, []);

    const dataToUse = apiData.length > 0 ? apiData : trendingDestinations;

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % dataToUse.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + dataToUse.length) % dataToUse.length);

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 6000);
    };

    // Unified Booking Logic → send WhatsApp via backend + show toast
    const handleBooking = async (pkg) => {
        if (!user || authStep !== 'AUTHENTICATED') { navigate('/login'); return; }
        const userPhone = user.phone;
        if (!userPhone || userPhone === 'PENDING_VERIFICATION') {
            showToast('error', '⚠️ Please verify your mobile number first to book.');
            return;
        }

        const isApiNode = !!pkg.subcategory_id;
        const name = isApiNode ? pkg.subcategory_name : pkg.title;
        const location = isApiNode ? (pkg.category_name || 'Destination') : pkg.location;
        const price = pkg.price || 'Contact us';
        const pkgKey = pkg.id || pkg.subcategory_id;

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

    const getVisibleItems = () => {
        const items = [];
        if (dataToUse.length === 0) return items;
        for (let i = 0; i < Math.min(3, dataToUse.length); i++) {
            items.push(dataToUse[(currentIndex + i) % dataToUse.length]);
        }
        return items;
    };

    const visibleItems = getVisibleItems();

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* ToastNotification (The "Pop" message) */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white text-sm font-bold max-w-md w-[calc(100%-2rem)] animate-bounce-in ${toast.type === 'success' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-red-600'}`}>
                    <div className="shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        {toast.type === 'success' ? '✅' : '❌'}
                    </div>
                    <span className="flex-1 leading-tight">{toast.msg}</span>
                    <button onClick={() => setToast(null)} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
                </div>
            )}

            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Hot Right Now</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">Trending One</h2>
                        <p className="text-gray-500 mt-3 max-w-xl">Destinations capturing the world's imagination this season.</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all active:scale-95" aria-label="Previous slide">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all active:scale-95" aria-label="Next slide">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {visibleItems.map((item, index) => {
                        const isApiNode = !!item.subcategory_id;
                        const title = isApiNode ? item.subcategory_name : item.title;
                        const desc = isApiNode ? item.subcategory_description : item.description;
                        const loc = isApiNode ? (item.category_name || 'Destination') : item.location;
                        const price = isApiNode ? (item.price || 'Explore') : item.price;
                        const itemId = item.id || item.subcategory_id;

                        let imgUrl = item.image || item.subcategory_image || '';

                        // Handle relative paths from the external API
                        if (imgUrl && !imgUrl.startsWith('http')) {
                            imgUrl = `https://triplova.com/triplova-project/api/admin/${imgUrl}`;
                        }

                        // Final fallbacks for missing images - using high-reliability Unsplash links
                        const fallbackImages = [
                            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=60", // 0: Bora Bora
                            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=60", // 1: Mountains
                            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=60", // 2: Paris (Eiffel)
                            "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&auto=format&fit=crop&q=60", // 3: Venice
                            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=60"  // 4: Bali
                        ];
                        const fallbackImg = fallbackImages[index % fallbackImages.length];
                        const finalImg = imgUrl || fallbackImg;

                        return (
                            <div key={`${itemId}-${index}`}
                                className="group relative h-[400px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                <img
                                    src={finalImg}
                                    alt={title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => { e.target.src = fallbackImg; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-white text-xs font-bold">{(!item.rating || item.rating === '0' || item.rating === 0) ? '4.9' : item.rating}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-2 text-primary-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{loc}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">{desc}</p>
                                    <div className="flex justify-between items-center border-t border-white/10 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <span className="text-white font-bold text-lg">{price}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleBooking(item); }}
                                            className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold cursor-pointer active:scale-95"
                                            disabled={bookingLoading[itemId]}>
                                            {bookingLoading[itemId] ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>Book Now <ArrowRight className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TrendingSlider;
