import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';

const Blog = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Destinations", "Travel Tips", "Food & Drink", "Culture", "Luxury"];

    const blogPosts = [
        {
            id: 1,
            title: "10 Hidden Gems in Bali You Must Visit",
            excerpt: "Move over Kuta and Seminyak. Discover the untouched waterfalls, secret beaches, and jungle retreats that only the locals know about.",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop",
            date: "Oct 12, 2025",
            author: "Sarah Jenkins",
            category: "Destinations",
            readTime: "5 min read"
        },
        {
            id: 2,
            title: "The Ultimate Guide to Solo Travel in Japan",
            excerpt: "From navigating the trains to dining alone in ramen shops. Here is everything you need to know to survive and thrive solo in Japan.",
            image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
            date: "Sep 28, 2025",
            author: "Michael Chang",
            category: "Travel Tips",
            readTime: "8 min read"
        },
        {
            id: 3,
            title: "A Culinary Journey Through the Streets of Cairo",
            excerpt: "Tasting history one bite at a time. We explore the best street food stalls and hidden cafes in Egypt's bustling capital.",
            image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=600&auto=format&fit=crop",
            date: "Sep 15, 2025",
            author: "Amira Youssef",
            category: "Food & Drink",
            readTime: "6 min read"
        },
        {
            id: 4,
            title: "Luxury on a Budget: How to Travel in Style",
            excerpt: "You don't need to be a millionaire to feel like one. Tips on booking business class for less and finding 5-star stays at 3-star prices.",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
            date: "Aug 30, 2025",
            author: "David Miller",
            category: "Luxury",
            readTime: "4 min read"
        },
        {
            id: 5,
            title: "Packing Light: The Art of the Carry-On",
            excerpt: "Stop paying baggage fees and start moving freely. Our definitive guide to packing everything you need in a single bag.",
            image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=600&auto=format&fit=crop",
            date: "Aug 10, 2025",
            author: "Jessica Lee",
            category: "Travel Tips",
            readTime: "5 min read"
        },
        {
            id: 6,
            title: "Understanding Japanese Tea Ceremony Etiquette",
            excerpt: "Dive deep into the Zen philosophy and intricate rituals behind the traditional Japanese tea ceremony.",
            image: "https://media.istockphoto.com/id/578833134/photo/let-me-pour-you-tome-tea.webp?a=1&b=1&s=612x612&w=0&k=20&c=rn0R0YCoMQyhjNocv9WJpr6U9ikEjyK_8A-UhXTtoN0=",
            date: "Jul 22, 2025",
            author: "Kenji Tanaka",
            category: "Culture",
            readTime: "7 min read"
        }
    ];

    const filteredPosts = activeCategory === "All"
        ? blogPosts
        : blogPosts.filter(post => post.category === activeCategory);

    return (
        <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <header className="relative py-24 bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                        alt="Blog Hero"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pt-10">
                    <div className="inline-block py-1 px-3 bg-white/10 backdrop-blur-md rounded-full text-primary-300 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10 animate-fade-in-down">
                        The Triplova Journal
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif animate-fade-in-up">
                        Stories from the Road
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-100">
                        Inspiration, guides, and tips for your next great adventure.
                    </p>
                </div>
            </header>

            {/* Category Filter */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
                    <div className="flex space-x-2 md:justify-center min-w-max">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                                ${activeCategory === cat
                                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Grid */}
            <section className="py-10 md:py-16 bg-gray-50 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <div key={post.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 cursor-pointer">
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 uppercase tracking-wider shadow-sm">
                                        {post.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 md:p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-medium">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex justify-between items-center pt-6 border-t border-gray-50 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                                                {post.author.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">{post.author}</span>
                                        </div>
                                        <span className="text-primary-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                                            Read More <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-bold text-gray-400">No stories found in this category yet.</h3>
                            <button onClick={() => setActiveCategory("All")} className="mt-4 text-primary-600 font-medium hover:underline">View all stories</button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="bg-white py-10 border-t border-gray-100">
                <div className="w-full max-w-[35%] min-w-[320px] mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Never Miss a Story</h2>
                    <p className="text-gray-500 mb-8 mx-auto">Get the best travel tips, hidden gems, and exclusive deals delivered straight to your inbox.</p>
                    <div className="flex flex-col gap-3 w-full mx-auto">
                        <input type="email" placeholder="Your email address" className="w-full px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 bg-gray-50 text-center" />
                        <button className="bg-gray-900 text-white w-full px-8 py-3 rounded-full font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
