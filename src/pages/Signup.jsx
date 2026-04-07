import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Plane, Phone } from 'lucide-react';

const Signup = () => {
    const { signupWithEmail, verifyPhoneEmailUrl, authStep, setAuthStep, error } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Initial load: Set Auth context step explicitly back to registration
    useEffect(() => {
        setAuthStep('REGISTER');
    }, [setAuthStep]);

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setIsLoading(true);
        await signupWithEmail(name, email, password);
        setIsLoading(false);
    };

    const isInputStep = authStep === 'LOGIN' || authStep === 'REGISTER';

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')` }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden p-8 animate-fade-in-up">

                <div className="flex flex-col items-center mb-8 text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner">
                        <Plane className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                    <p className="text-white/70 text-sm mt-1">Start your journey securely.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 text-sm text-center backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {isInputStep ? (
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/50 outline-none focus:bg-white/20 focus:border-white/30 transition-all font-light"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/50 outline-none focus:bg-white/20 focus:border-white/30 transition-all font-light"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder-white/50 outline-none focus:bg-white/20 focus:border-white/30 transition-all font-light"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/50 outline-none focus:bg-white/20 focus:border-white/30 transition-all font-light"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-blue-900 font-bold py-3.5 rounded-xl hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading
                                ? <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                                : <>Continue <ArrowRight className="w-5 h-5" /></>
                            }
                        </button>

                        <div className="text-center mt-4">
                            <p className="text-white/70 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-white font-medium hover:underline">Log In</Link>
                            </p>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-300 mb-3 border border-green-500/30">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">
                                Verify Mobile Number
                            </h3>
                            <p className="text-white/60 text-sm mt-2">
                                Please verify your Phone Number to fully activate your account.
                            </p>
                        </div>

                        <div className="flex justify-center mt-6">
                            {isLoading ? (
                                <div className="text-center">
                                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-white/80 text-sm">Verifying...</p>
                                </div>
                            ) : (
                                <PhoneEmailButton
                                    clientId={import.meta.env.VITE_PHONE_EMAIL_CLIENT_ID || "17656050864083657808"}
                                    onVerify={async (userObj) => {
                                        setIsLoading(true);
                                        const success = await verifyPhoneEmailUrl(userObj.user_json_url);
                                        setIsLoading(false);
                                        if (success) navigate('/login');
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 text-white/40 text-xs text-center w-full">
                Secured by Firebase Auth &amp; Phone.Email © 2026 Triplova Inc.
            </div>
        </div>
    );
};

/**
 * A dedicated component that loads the Phone.Email script ONLY after
 * its container div is confirmed to be in the DOM (using a callback ref).
 * This fixes the race condition where the script ran before the div existed.
 */
const PhoneEmailButton = ({ clientId, onVerify }) => {
    const containerRef = React.useCallback((node) => {
        if (node !== null) {
            // Remove any stale copies of the script
            const scriptId = 'phone-email-script';
            const oldScript = document.getElementById(scriptId);
            if (oldScript) oldScript.remove();

            // Register the global callback BEFORE the script loads
            window.phoneEmailListener = onVerify;

            // Now inject the script — the div is guaranteed to be in the DOM
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://www.phone.email/sign_in_button_v1.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Keep the global listener up-to-date if the callback prop changes
    useEffect(() => {
        window.phoneEmailListener = onVerify;
        return () => { window.phoneEmailListener = null; };
    }, [onVerify]);

    return (
        <div
            ref={containerRef}
            id="pe_signin_button"
            className="pe_signin_button min-h-[50px] flex items-center justify-center"
            data-client-id={clientId}
        ></div>
    );
};

export default Signup;
