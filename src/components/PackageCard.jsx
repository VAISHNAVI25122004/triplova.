import React, { useState } from 'react';
import { Heart, Star, Map, ArrowRight, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, whatsappAPI } from '../services/api';

// Inline WhatsApp SVG icon
const WAIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.107.547 4.084 1.504 5.805L0 24l6.334-1.491A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.802 9.802 0 01-5.014-1.376l-.36-.214-3.727.878.896-3.636-.235-.374A9.799 9.799 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
);

const PackageCard = ({ pkg, isNewArrival = false }) => {
    const { user, authStep } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();
    const [isBooking, setIsBooking] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 6000);
    };

    const imgUrl = pkg.childCategory_image
        ? (pkg.childCategory_image.startsWith('http') || pkg.childCategory_image.startsWith('blob:')
            ? pkg.childCategory_image
            : `https://triplova.com/triplova-project/api/admin/${pkg.childCategory_image}`)
        : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&auto=format&fit=crop&q=60";

    // Unified Booking Logic → send WhatsApp via backend + show toast
    const handleBooking = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || authStep !== 'AUTHENTICATED') {
            navigate('/login');
            return;
        }

        const userPhone = user.phone;
        if (!userPhone || userPhone === 'PENDING_VERIFICATION') {
            showToast('error', '⚠️ Please verify your mobile number first to book a package.');
            return;
        }

        if (isBooking) return;
        setIsBooking(true);

        const name = pkg.childCategory_name || 'Travel Package';
        const location = pkg.location || 'Global';
        const price = pkg.price || 'Contact us';

        // Show immediate "Pop" message as requested
        showToast('success', '✨ Booking Initiated! You will receive a WhatsApp message shortly to confirm your trip and payment details.');

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
        } catch (err) {
            console.error('Booking error:', err);
            showToast('error', '❌ Failed to send WhatsApp message. Please contact support.');
        } finally {
            setTimeout(() => setIsBooking(false), 3000);
        }
    };

    return (
        <>
            {/* Toast Notification (The "Pop" message) */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white text-sm font-bold max-w-md w-[calc(100%-2rem)] animate-bounce-in ${toast.type === 'success' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-red-600'}`}>
                    <div className="shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        {toast.type === 'success' ? '✅' : '❌'}
                    </div>
                    <span className="flex-1 leading-tight">{toast.msg}</span>
                    <button onClick={() => setToast(null)} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
                </div>
            )}

            {/* Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={imgUrl} 
                        alt={pkg.childCategory_name} 
                        loading="lazy" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&auto=format&fit=crop&q=60"; }}
                    />
                    {isNewArrival && (
                        <div className="absolute top-4 left-4">
                            <span className="bg-[#FFCE00] text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider relative overflow-hidden">
                                <span className="relative z-10">New Arrival</span>
                            </span>
                        </div>
                    )}
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(pkg); }}
                        className={`absolute top-4 right-4 w-8 h-8 backdrop-blur-md rounded-full flex items-center justify-center transition-colors ${isInWishlist(pkg) ? 'bg-white text-red-500 shadow-md' : 'bg-white/50 hover:bg-white text-gray-700'}`}
                    >
                        <Heart className={`w-4 h-4 ${isInWishlist(pkg) ? 'fill-current' : ''}`} />
                    </button>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center text-gray-500 text-xs mb-2">
                        <Map className="w-3.5 h-3.5 mr-1 text-primary-500" />
                        <span>{pkg.location || 'Global Destination'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 capitalize line-clamp-1" title={pkg.childCategory_name}>
                        {pkg.childCategory_name}
                    </h3>
                    <div className="flex items-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-3.5 h-3.5 text-[#FFCE00] fill-current" />
                        ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Price</span>
                            <span className="text-lg font-bold text-gray-900">{pkg.price || 'Contact us'}</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors border border-gray-200" title="View Details">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleBooking}
                                disabled={isBooking}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${isBooking
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'}`}
                            >
                                {isBooking ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <MessageCircle className="w-4 h-4" />
                                )}
                                <span>Book Now</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PackageCard;
