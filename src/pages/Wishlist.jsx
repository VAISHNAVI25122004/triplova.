import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Map, Star, Trash2, ArrowRight } from 'lucide-react';
import { bookingAPI, whatsappAPI } from '../services/api';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { user, authStep } = useAuth();
    const navigate = useNavigate();
    const [isBooking, setIsBooking] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 6000);
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

        if (isBooking) return;
        setIsBooking(true);

        const name = pkg.name || pkg.childCategory_name || pkg.category_name || 'Travel Package';
        const location = pkg.destination || pkg.location || 'Global destination';
        const price = pkg.price || 'Contact Us';
        const pkgKey = pkg.id || pkg.childCategory_id || pkg.category_id;

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

We've received your booking inquiry for *${name}* from your wishlist! 

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
            showToast('error', '❌ Failed to send WhatsApp message.');
        } finally {
            setTimeout(() => setIsBooking(false), 3000);
        }
    };

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

            <div className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-[#FFCE00] mb-4">My Wishlist</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Keep track of all your dream destinations. Ready to book your next adventure?</p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't saved any packages yet. Explore our destinations and find your perfect trip!</p>
                        <Link to="/" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full transition-all">
                            Explore Packages <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlist.map((pkg, index) => {
                            const id = pkg.id || pkg.childCategory_id || pkg.category_id || index;
                            const name = pkg.name || pkg.childCategory_name || pkg.category_name || 'Travel Package';
                            const image = pkg.image || pkg.childCategory_image || pkg.category_image;
                            const location = pkg.destination || pkg.location || 'Global destination';
                            const price = pkg.price || 'Contact Us';

                            const imgUrl = image ? (image.startsWith('http') || image.startsWith('blob:') ? image : `https://triplova.com/triplova-project/api/admin/${image}`) : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&auto=format&fit=crop&q=60";

                            return (
                                <div key={id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
                                    <div className="relative h-56 overflow-hidden">
                                        <img src={imgUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <button
                                            onClick={() => removeFromWishlist(pkg)}
                                            className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-red-50 hover:text-red-500 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 transition-colors shadow-sm"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center text-gray-500 text-sm mb-3">
                                            <Map className="w-4 h-4 mr-1 text-primary-500" />
                                            <span>{location}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 capitalize">{name}</h3>
                                        <div className="flex items-center gap-1 mb-6">
                                            <Star className="w-4 h-4 text-[#FFCE00] fill-current" />
                                            <Star className="w-4 h-4 text-[#FFCE00] fill-current" />
                                            <Star className="w-4 h-4 text-[#FFCE00] fill-current" />
                                            <Star className="w-4 h-4 text-[#FFCE00] fill-current" />
                                            <Star className="w-4 h-4 text-[#FFCE00] fill-current" />
                                        </div>
                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Price</span>
                                                <span className="text-xl font-bold text-gray-900">{price}</span>
                                            </div>
                                            <button
                                                onClick={() => handleBooking(pkg)}
                                                disabled={isBooking}
                                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 ${isBooking ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gray-900 hover:bg-primary-600 hover:text-white text-white hover:shadow-primary-600/30'}`}>
                                                {isBooking ? 'Processing...' : 'Book Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Wishlist;