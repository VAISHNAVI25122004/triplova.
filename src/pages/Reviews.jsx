import React from 'react';
import Navbar from '../components/Navbar';
import { Star } from 'lucide-react';

const Reviews = () => {
    return (
        <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
            <Navbar />

            <section className="pt-32 pb-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Testimonials</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Traveler Stories</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Don't just take our word for it. Hear what our delighted travelers have to say about their unforgettable journeys with Triplova.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                        {/* Review 4 - Added to fill grid */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="flex text-yellow-500 mb-4 gap-1">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6 italic">"I've traveled with many agencies, but Triplova's attention to detail is unmatched. The local guides were incredibly knowledgeable."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" alt="User" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Olivia Wilson</h4>
                                    <p className="text-gray-400 text-xs">Traveled to Italy</p>
                                </div>
                            </div>
                        </div>

                        {/* Review 5 - Added to fill grid */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="flex text-yellow-500 mb-4 gap-1">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6 italic">"Seamless booking process and excellent customer service. They helped us customize our family trip to suit our kids' needs perfectly."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop" alt="User" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">James Peterson</h4>
                                    <p className="text-gray-400 text-xs">Traveled to Australia</p>
                                </div>
                            </div>
                        </div>

                        {/* Review 6 - Added to fill grid */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="flex text-yellow-500 mb-4 gap-1">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6 italic">"The Educational tour for our university group was well-organized and insightful. Great balance of learning and leisure."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop" alt="User" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Prof. Alan Grant</h4>
                                    <p className="text-gray-400 text-xs">University Tour</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Reviews;
