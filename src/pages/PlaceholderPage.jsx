
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                    We are working hard to bring you this page. Please check back soon!
                </p>
                <div className="w-24 h-1 bg-primary-500 rounded-full mb-8"></div>
                <p className="text-gray-500">
                    In the meantime, explore our <a href="/" className="text-primary-600 hover:underline">popular destinations</a>.
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default PlaceholderPage;
