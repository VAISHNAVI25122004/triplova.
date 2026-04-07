
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Map, Calendar, Compass, Search, Plane } from 'lucide-react';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-neutral-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                            T
                        </div>
                        <span className="font-bold text-gray-900 text-lg tracking-tight">Triplova</span>
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">User</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
                            <a href="#" className="hover:text-primary-600 transition-colors">Home</a>
                            <a href="#" className="text-primary-600">Dashboard</a>
                            <a href="#" className="hover:text-primary-600 transition-colors">My Trips</a>
                            <a href="#" className="hover:text-primary-600 transition-colors">Favorites</a>
                        </nav>
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Guest'}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Hero Search */}
                <section className="relative rounded-3xl overflow-hidden h-[300px] shadow-xl group">
                    <img
                        src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2070&auto=format&fit=crop"
                        alt="Travel Hero"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full max-w-2xl">
                        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-md">Find Your Not-So-Known Paradise</h2>
                        <p className="text-white/80 mb-6 drop-shadow-sm">Discover hidden gems and book your next unforgettable journey with ease.</p>

                        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl flex gap-2 shadow-2xl">
                            <div className="flex-1 flex items-center px-4 bg-white rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                                <Map className="w-5 h-5 text-gray-400 mr-2" />
                                <input type="text" placeholder="Where to?" className="w-full py-3 outline-none text-gray-700 font-medium placeholder:font-normal" />
                            </div>
                            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2">
                                <Search className="w-5 h-5" /> Search
                            </button>
                        </div>
                    </div>
                </section>

                {/* Stats / Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">My Bookings</h3>
                        <p className="text-gray-500 text-sm mb-4">You have 2 upcoming trips to Bali and Tokyo.</p>
                        <a href="#" className="text-primary-600 font-medium text-sm hover:underline">View Details &rarr;</a>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                            <Compass className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Travel Recommendations</h3>
                        <p className="text-gray-500 text-sm mb-4">Based on your recent search for 'Islands'.</p>
                        <a href="#" className="text-primary-600 font-medium text-sm hover:underline">Explore Now &rarr;</a>
                    </div>

                    <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Plane className="w-32 h-32 transform translate-x-8 -translate-y-8" />
                        </div>
                        <h3 className="text-lg font-bold mb-1 relative z-10">Premium Member</h3>
                        <p className="text-primary-100 text-sm mb-6 relative z-10">Enjoy 15% off on your next booking.</p>
                        <button className="bg-white text-primary-700 px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:bg-gray-50 transition-colors relative z-10">
                            Upgrade Plan
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default UserDashboard;
