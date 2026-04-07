import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, whatsappAPI } from '../services/api';

const WAIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.107.547 4.084 1.504 5.805L0 24l6.334-1.491A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.802 9.802 0 01-5.014-1.376l-.36-.214-3.727.878.896-3.636-.235-.374A9.799 9.799 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
);

const premiumPackages = [
    { id: 'p1', name: 'Maldives Private Villa', location: 'Maldives', price: '$5,200', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1974&auto=format&fit=crop', badge: 'Trending', badgeClass: 'bg-primary-600', desc: 'Experience absolute seclusion in your own overwater sanctuary with 24/7 butler service.' },
    { id: 'p2', name: 'Swiss Alps Chalet', location: 'Switzerland', price: '$4,800', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop', badge: 'Best Seller', badgeClass: 'bg-purple-600', desc: 'Ski-in/ski-out luxury chalet with panoramic mountain views and private chef.' },
    { id: 'p3', name: 'Kyoto Royal Heritage', location: 'Japan', price: '$3,900', image: 'https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?w=600&auto=format&fit=crop&q=60', badge: 'Cultural', badgeClass: 'bg-white/20 border border-white/20 backdrop-blur-md', desc: 'Exclusive access to ancient temples and private tea ceremonies with geisha.' },
];

const Premium = () => {
    const { user, authStep } = useAuth();
    const navigate = useNavigate();
    const [bookingLoading, setBookingLoading] = useState({});
    const [bookingModal, setBookingModal] = useState(null);
    const [toast, setToast] = useState(null);

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

        const name = pkg.name;
        const location = pkg.location;
        const price = pkg.price;
        const pkgKey = pkg.id;

        if (bookingLoading[pkgKey]) return;
        setBookingLoading(prev => ({ ...prev, [pkgKey]: true }));

        // Show immediate "Pop" message as requested
        showToast('success', '✨ Luxury Trip Initiated! You will receive a WhatsApp message shortly to confirm your booking and get payment details.');

        try {
            await bookingAPI.logIntent({
                user_phone: userPhone,
                package_name: name,
                package_location: location,
                package_price: price
            });

            const message = `✈️ *Confirm Your Triplova Premium Booking*

Dear ${user.name || 'Traveler'}, 🙏

We've received your inquiry for the premium package: *${name}*! 

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
To confirm your premium booking and get payment details, please reply to this message with "CONFIRM". Our dedicated luxury travel concierge will then share:
✅ Secure Payment Link
✅ VVIP Itinerary
✅ Hospitality Vouchers

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
            setTimeout(() => setBookingLoading(prev => ({ ...prev, [pkgKey]: false })), 3000);
        }
    };

    return (
        <div className="font-sans text-gray-900 bg-gray-900 min-h-screen">
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

            <Navbar />
            <section className="pt-32 pb-20 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-600/30 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px]"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-primary-400 font-bold tracking-widest uppercase text-sm mb-2 block">Exclusive Access</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Premium Collection</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Curated luxury experiences for the discerning traveler. Unparalleled comfort, privacy, and style.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {premiumPackages.map(pkg => (
                            <div key={pkg.id}
                                className="group relative h-[500px] rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500">
                                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <span className={`${pkg.badgeClass} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block`}>{pkg.badge}</span>
                                    <h3 className="text-3xl font-bold text-white mb-2">{pkg.name}</h3>
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{pkg.desc}</p>
                                    <div className="flex justify-between items-center border-t border-white/20 pt-4">
                                        <span className="text-white font-bold text-lg">{pkg.price} <span className="text-xs text-gray-400 font-normal">/ person</span></span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleBooking(pkg); }}
                                            className={`bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-primary-600/30 active:scale-95 cursor-pointer ${bookingLoading[pkg.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={bookingLoading[pkg.id]}>
                                            {bookingLoading[pkg.id] ? 'Wait...' : 'Book Now'} <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Premium;
