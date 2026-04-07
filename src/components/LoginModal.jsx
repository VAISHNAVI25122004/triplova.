import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Plane, X, ArrowRight, RefreshCw, Github, Globe } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
    const { login, verifyOtp, authStep, error, resendOtp, tempEmail } = useAuth();
    const navigate = useNavigate();

    const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleTabSwitch = (type) => {
        setLoginType(type);
        setEmail('');
        setPassword('');
        setOtp(['', '', '', '', '', '']);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        const success = await login(email, password, loginType);
        setIsLoading(false);
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        const role = verifyOtp(otpValue);
        setIsLoading(false);

        if (role) {
            onClose();
            navigate(role === 'admin' ? '/admin-panel' : '/');
        }
    };

    const isUser = loginType === 'user';
    const themeColor = isUser ? 'primary' : 'purple';
    const bgImage = isUser
        ? "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2070&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in max-h-[90vh]">

                {/* Left Side - Image & Branding */}
                <div className="hidden md:flex w-1/2 relative flex-col justify-end p-12 text-white">
                    <img src={bgImage} alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">Start Your Journey With Us.</h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                            Discover the world's best destinations and create memories that last a lifetime.
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="max-w-sm mx-auto">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
                            <p className="text-gray-500">Please enter your details to sign in.</p>
                        </div>

                        {/* User/Admin Toggle */}
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                            <button
                                onClick={() => handleTabSwitch('user')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${loginType === 'user' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <Plane className="w-4 h-4" /> Traveler
                            </button>
                            <button
                                onClick={() => handleTabSwitch('admin')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${loginType === 'admin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <ShieldCheck className="w-4 h-4" /> Admin
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3 animate-shake">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0"></span>
                                {error}
                            </div>
                        )}

                        {authStep === 'LOGIN' ? (
                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-primary-600 transition-colors" />
                                            <input
                                                type="email"
                                                placeholder={isUser ? "name@example.com" : "admin@company.com"}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 font-medium placeholder:text-gray-400 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-primary-600 transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-12 text-gray-900 font-medium placeholder:text-gray-400 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                        <span className="text-gray-600">Remember me</span>
                                    </label>
                                    <a href="#" className="text-primary-600 font-semibold hover:underline">Forgot Password?</a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-4 rounded-xl font-bold text-white shadow-xl shadow-primary-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2
                                    ${isUser ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:to-primary-600' : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:to-purple-600'}`}
                                >
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                                </button>


                            </form>
                        ) : (
                            <form onSubmit={handleOtpSubmit} className="space-y-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                                        <Mail className="w-8 h-8 text-primary-600" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">Verify your email</h4>
                                    <p className="text-gray-500 text-sm mt-1">
                                        We sent a 6-digit code to <br /><span className="font-semibold text-gray-900">{tempEmail}</span>
                                    </p>
                                </div>

                                <div className="flex justify-between gap-2">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e.target, idx)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !otp[idx] && idx > 0) e.target.previousSibling.focus();
                                            }}
                                            className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isLoading ? "Verifying..." : "Verify & Continue"}
                                </button>

                                <div className="text-center">
                                    <button type="button" onClick={resendOtp} className="text-sm text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2 mx-auto font-medium">
                                        <RefreshCw className="w-4 h-4" /> Resend Code
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                Don't have an account?{' '}
                                <button onClick={() => { onClose(); navigate('/signup'); }} className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
