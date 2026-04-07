import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('triplova_wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('triplova_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (pkg) => {
        setWishlist(prev => {
            if (!prev.find(item => item.id === pkg.id || (pkg.childCategory_id && item.childCategory_id === pkg.childCategory_id) || (pkg.category_id && item.category_id === pkg.category_id))) {
                return [...prev, pkg];
            }
            return prev;
        });
    };

    const removeFromWishlist = (pkg) => {
        setWishlist(prev => prev.filter(item => {
            if (pkg.id) return item.id !== pkg.id;
            if (pkg.childCategory_id) return item.childCategory_id !== pkg.childCategory_id;
            if (pkg.category_id) return item.category_id !== pkg.category_id;
            return true;
        }));
    };

    const toggleWishlist = (pkg) => {
        if (isInWishlist(pkg)) {
            removeFromWishlist(pkg);
        } else {
            addToWishlist(pkg);
        }
    };

    const isInWishlist = (pkg) => {
        return !!wishlist.find(item => {
            if (pkg.id && item.id === pkg.id) return true;
            if (pkg.childCategory_id && item.childCategory_id === pkg.childCategory_id) return true;
            if (pkg.category_id && item.category_id === pkg.category_id) return true;
            return false;
        });
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
