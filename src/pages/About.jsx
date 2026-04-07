
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Target, Users, Globe, Shield } from 'lucide-react';

const About = () => {
    return (
        <div className="font-sans text-gray-900 bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden flex items-center justify-center">
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                    alt="Team collaboration"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <span className="text-white font-bold tracking-widest uppercase text-sm mb-4 block animate-fade-in-down">Our Story</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in-up">
                        Passionate About <br /> <span className="text-primary-400">Making Travel Easy</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-100">
                        We believe that travel is the only thing you buy that makes you richer. Our mission is to help you explore the world with confidence and ease.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
                            <img
                                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                                alt="Our Mission"
                                className="relative rounded-3xl shadow-2xl z-10 w-full"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs hidden md:block">
                                <p className="text-primary-600 font-bold text-4xl mb-1">10+</p>
                                <p className="text-gray-600 text-sm font-medium">Years of Excellence in Travel</p>
                            </div>
                        </div>
                        <div>
                            <span className="text-primary-600 font-bold tracking-widest uppercase text-xs mb-2 block">Who We Are</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Redefining How You Explore the World</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Triplova was founded in 2026 with a simple goal: to make international travel accessible, affordable, and stress-free for everyone. We started as a small team of travel enthusiasts and have grown into a leading travel tech company.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                Today, we connect travelers with thousands of unique experiences, luxury stays, and local guides across the globe. Our commitment to quality and customer satisfaction remains unchanged.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-2">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-900">Our Mission</h4>
                                    <p className="text-sm text-gray-500">To inspire and enable people to explore the world.</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-900">Our Vision</h4>
                                    <p className="text-sm text-gray-500">To be the world's most trusted and innovative travel partner.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-bold tracking-widest uppercase text-xs mb-2 block">Our Values</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Drives Us</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We obsess over our customers' happiness. Every decision we make is guided by how it serves our travelers.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Safety</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Your safety is our priority. We work only with verified partners and provide 24/7 support for peace of mind.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                                <Globe className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Community</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We believe in the power of travel to bridge cultures and create understanding between people from all walks of life.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-900 text-white py-12 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">Ready to start your journey?</h2>
                    <p className="text-gray-400 mb-8">Join thousands of happy travelers who trust Triplova.</p>
                    <a href="/" className="inline-block bg-primary-600 text-white font-bold py-3 px-8 rounded-full hover:bg-primary-700 transition-colors">
                        Explore Destinations
                    </a>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default About;
