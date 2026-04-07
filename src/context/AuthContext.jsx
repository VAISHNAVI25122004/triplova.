import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import app from '../firebase'; // Import initialized firebase app

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
const auth = getAuth(app);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authStep, setAuthStep] = useState('REGISTER');
    const [tempData, setTempData] = useState({ name: '', email: '', phone: '' });
    const [error, setError] = useState('');

    // Use 127.0.0.1 to avoid potential localhost resolution issues on some machines
    const API_URL = 'http://127.0.0.1:5001/api/auth';
    const WHATSAPP_API = 'http://127.0.0.1:5001/api/whatsapp';

    // Track user state via Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Only automatically advance to AUTHENTICATED on a page refresh / cold load.
                // During signup (REGISTER → VERIFY_PHONE_EMAIL), we must NOT override the step,
                // otherwise the phone verification screen is skipped.
                const isActiveSignupFlow = authStep === 'REGISTER' || authStep === 'VERIFY_PHONE_EMAIL';
                if (!isActiveSignupFlow && authStep !== 'AUTHENTICATED') {
                    setAuthStep('AUTHENTICATED');
                }

                try {
                    const res = await userAPI.getProfile(currentUser.email);
                    if (res && res.status === 'success') {
                        setUser({
                            ...res.user,
                            email: currentUser.email,
                            uid: currentUser.uid,
                            name: res.user.name || currentUser.displayName || 'Traveler'
                        });
                    } else {
                        setUser({
                            email: currentUser.email,
                            role: 'user',
                            uid: currentUser.uid,
                            name: currentUser.displayName || 'Traveler'
                        });
                    }
                } catch (e) {
                    console.error("Error fetching profile:", e);
                    if (e instanceof SyntaxError) {
                        console.warn("Received non-JSON response from profile API. Possible proxy/server issue.");
                    }
                    setUser({
                        email: currentUser.email,
                        role: 'user',
                        uid: currentUser.uid,
                        name: currentUser.displayName || 'Traveler'
                    });
                }
            } else {
                setUser((prevUser) => {
                    if (prevUser && prevUser.role === 'admin') return prevUser;
                    return null;
                });
                if (authStep === 'AUTHENTICATED' && user?.role !== 'admin') {
                    setAuthStep('LOGIN');
                }
            }
        });
        return () => unsubscribe();
    }, [authStep]);

    const login = async (email, password) => {
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setAuthStep('AUTHENTICATED');
            return true;
        } catch (err) {
            console.error("Firebase login error:", err);
            setError(err.message || 'Login failed via Firebase.');
            return false;
        }
    };

    const signupWithEmail = async (name, email, password) => {
        setError('');
        let firebaseUser = null;
        let isNewUser = false;
        try {
            try {
                // 1. Create account with Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                firebaseUser = userCredential.user;
                isNewUser = true;
            } catch (authErr) {
                // If the email is already in use, it might be a split-state from a previous failed sync
                if (authErr.code === 'auth/email-already-in-use') {
                    console.log("User already exists in Firebase, attempting to verify password and sync...");
                    try {
                        const loginCred = await signInWithEmailAndPassword(auth, email, password);
                        firebaseUser = loginCred.user;
                        isNewUser = false; // It pre-existed
                    } catch (loginErr) {
                        throw authErr; // throw original "already in use" error if login fails
                    }
                } else {
                    throw authErr;
                }
            }

            // 2. Also save/sync user in our local db so we can link phone later
            try {
                const res = await fetch(`${API_URL}/sync-firebase-user`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone: null })
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.message || 'Failed to sync with local database.');
                }
            } catch (syncErr) {
                console.error("Local DB Sync failed:", syncErr);
                // If this is a fresh signup attempt and it failed to sync, roll back Firebase
                if (isNewUser && firebaseUser) {
                    console.log("Rolling back new Firebase user due to sync failure...");
                    await firebaseUser.delete().catch(delErr => console.error("Rollback delete failed", delErr));
                }
                throw syncErr;
            }

            setTempData({ name, email });
            setAuthStep('VERIFY_PHONE_EMAIL');
            return true;

        } catch (err) {
            console.error("Signup error:", err);
            let friendlyMsg = err.message || 'Failed to create user.';
            
            if (err.code === 'auth/email-already-in-use') {
                friendlyMsg = 'This email is already registered. Please try logging in or use a different email.';
            } else if (err.code === 'auth/weak-password') {
                friendlyMsg = 'Password is too weak. Please use at least 6 characters.';
            } else if (err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
                friendlyMsg = 'Backend server connection failed. Please ensure port 5001 is running.';
            }

            setError(friendlyMsg);
            return false;
        }
    };

    const verifyPhoneEmailUrl = async (user_json_url) => {
        setError('');
        try {
            // Prefer tempData.email, but fall back to the Firebase current user's email
            // to handle cases where tempData is lost due to concurrent state updates.
            const resolvedEmail = tempData.email || auth.currentUser?.email;

            if (!user_json_url || !resolvedEmail) {
                throw new Error('Verification failed: missing email or verification URL. Please try signing up again.');
            }

            const res = await fetch(`${API_URL}/verify-phone-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_json_url, email: resolvedEmail })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert('Account fully activated with a verified mobile number via Phone.Email network!');

            // Re-fetch profile to get phone number
            try {
                const profileRes = await userAPI.getProfile(resolvedEmail);
                if (profileRes && profileRes.status === 'success') {
                    setUser(prev => ({ ...prev, ...profileRes.user }));
                }
            } catch (e) {
                console.error("Profile refresh error:", e);
            }

            setAuthStep('AUTHENTICATED');
            return true;
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to verify Phone.email JSON response');
            return false;
        }
    };

    const sendWhatsAppMessage = async (targetPhone, message) => {
        try {
            const res = await fetch(`${WHATSAPP_API}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: targetPhone, message })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            alert("WhatsApp Message Sent!");
            return true;
        } catch (err) {
            console.error(err);
            alert("Failed to send WhatsApp message");
            return false;
        }
    };

    const googleMockLogin = () => {
        setUser({ email: 'admin@trip.com', role: 'admin', name: 'Admin Google', phone: '9123456789' });
        setAuthStep('AUTHENTICATED');
        setError('');
        return true;
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setAuthStep('LOGIN');
        setTempData({ name: '', email: '', phone: '' });
        setError('');
    };

    const value = {
        user,
        authStep,
        error,
        tempData,
        login,
        signupWithEmail,
        verifyPhoneEmailUrl,
        sendWhatsAppMessage,
        googleMockLogin,
        logout,
        setAuthStep
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
