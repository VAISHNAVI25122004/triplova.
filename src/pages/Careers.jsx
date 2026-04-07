import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Globe, Heart, Zap, Coffee, Laptop, Smile } from 'lucide-react';

const Careers = () => {
    const perks = [
        { icon: <Globe className="w-6 h-6 text-blue-500" />, title: "Work From Anywhere", desc: "We are a remote-first company. Work from Bali, Paris, or your living room." },
        { icon: <Heart className="w-6 h-6 text-red-500" />, title: "Comprehensive Health", desc: "Full medical, dental, and vision coverage for you and your dependents." },
        { icon: <Zap className="w-6 h-6 text-yellow-500" />, title: "Unlimited PTO", desc: "We believe in resting hard to work hard. Take the time you need." },
        { icon: <Coffee className="w-6 h-6 text-amber-700" />, title: "Wellness Stipend", desc: "Monthly budget for gym memberships, co-working spaces, or coffee." },
    ];

    const openings = [
        { title: "Senior Frontend Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
        { title: "Product Designer", department: "Design", location: "Remote", type: "Full-time" },
        { title: "Travel Operations Manager", department: "Operations", location: "London / Remote", type: "Full-time" },
        { title: "Customer Success Lead", department: "Support", location: "New York / Remote", type: "Full-time" },
        { title: "Marketing Specialist", department: "Marketing", location: "Remote", type: "Part-time" },
    ];

    return (
        <div className="font-sans text-gray-900 bg-white">
            <Navbar />

            {/* Compact Header & Perks in one view */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Hero Content */}
                    <div className="text-center lg:text-left">
                        <span className="text-primary-600 font-bold tracking-widest uppercase text-xs mb-3 block">Join Our Team</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Build the Future of <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">Travel</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                            We're looking for dreamers, doers, and explorers to help us redefine how the world travels.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all shadow-lg hover:translate-y-[-2px]">
                                View Open Roles
                            </button>
                            <button className="text-gray-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-all">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Right: Condensed Perks Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {perks.map((perk, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 cursor-default">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm text-primary-600">
                                    {perk.icon}
                                </div>
                                <h3 className="font-bold text-base text-gray-900 mb-1">{perk.title}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">{perk.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Openings Section (More Compact) */}
            <section className="py-12 bg-gray-50/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900">Current Openings</h2>
                    </div>

                    <div className="grid gap-3">
                        {openings.map((job, index) => (
                            <div key={index} className="group bg-white border border-gray-200 p-4 rounded-xl hover:border-primary-500 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-base text-gray-900 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Laptop className="w-3 h-3" /> {job.department}</span>
                                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {job.location}</span>
                                    </div>
                                </div>
                                <div className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Culture (Compact Strip) */}
            <section className="py-12 bg-gray-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 text-center mb-8">
                    <h2 className="text-2xl font-bold">Life at Triplova</h2>
                </div>
                <div className="flex gap-4 overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-500">
                    <div className="flex gap-4 animate-scroll">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <img
                                key={item}
                                src={`https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=300&h=200&auto=format&fit=crop`}
                                alt="Culture"
                                className="w-64 h-40 object-cover rounded-xl flex-shrink-0"
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Careers;
