import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, ArrowRight, Plane, ShieldCheck, Globe2 } from 'lucide-react';

const Login = () => {
    const { login, authStep, setAuthStep, error, googleMockLogin } = useAuth();
    const navigate = useNavigate();

    const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (authStep === 'AUTHENTICATED') {
            navigate(loginType === 'admin' ? '/admin-panel' : '/');
        } else {
            setAuthStep('LOGIN');
        }
    }, [authStep, navigate, loginType, setAuthStep]);

    const handleTabSwitch = (type) => {
        setLoginType(type);
        setAuthStep('LOGIN');
        setEmail('');
        setPassword('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(email, password);
        setIsLoading(false);
        if (success) navigate('/');
    };

    const handleGoogleMockLogin = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        googleMockLogin();
        setIsLoading(false);
        navigate('/admin-panel');
    };

    const isUser = loginType === 'user';

    return (
        <div className="min-h-screen flex w-full bg-gray-50">

            <div className={`hidden lg:flex w-1/2 relative overflow-hidden transition-all duration-1000 ease-in-out ${isUser ? 'bg-blue-900' : 'bg-purple-900'}`}>
                <div className="absolute inset-0">
                    <img
                        src={isUser ? "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" : "https://images.unsplash.com/photo-1519681393798-2f77f80d35de?q=80&w=2070&auto=format&fit=crop"}
                        alt="Background"
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-opacity duration-1000"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${isUser ? 'from-blue-900/90 to-blue-800/90' : 'from-purple-900/90 to-purple-800/90'} mix-blend-multiply transition-colors duration-1000`}></div>
                </div>

                <div className="relative z-10 flex flex-col justify-between p-16 h-full text-white">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Globe2 className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Triplova</span>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            {isUser ? "Explore the world's most beautiful places." : "Manage your platform with confidence."}
                        </h1>
                        <p className="text-lg text-white/80 max-w-md leading-relaxed">
                            {isUser ? "Join our community of over 50,000 travelers and start your next adventure today." : "Secure admin portal for managing bookings, users, and destinations seamlessly."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white relative">
                <div className="w-full max-w-md space-y-8 relative z-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors duration-200 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500">
                            {isUser ? 'Please enter your details to sign in.' : 'Sign in with Google to access admin panel.'}
                        </p>
                    </div>

                    <div className="bg-gray-100 p-1 rounded-xl flex relative">
                        <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out ${loginType === 'user' ? 'left-1' : 'left-[calc(50%+4px)]'}`}></div>
                        <button onClick={() => handleTabSwitch('user')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors relative z-10 ${loginType === 'user' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                            <Plane className="w-4 h-4" /> User
                        </button>
                        <button onClick={() => handleTabSwitch('admin')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors relative z-10 ${loginType === 'admin' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                            <ShieldCheck className="w-4 h-4" /> Admin
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-shake">
                            <div className="bg-red-100 p-1 rounded-full text-red-600 mt-0.5"><ShieldCheck className="w-4 h-4" /></div>
                            <div>
                                <h4 className="text-sm font-semibold text-red-900">Authentication Failed</h4>
                                <p className="text-xs text-red-600 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {!isUser && (
                        <div className="space-y-6 animate-fade-in-up">
                            <button onClick={handleGoogleMockLogin} disabled={isLoading} className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg text-gray-800 font-semibold text-sm transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group">
                                {isLoading ? <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div> : <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                    <span>Sign in with Google</span>
                                </>}
                            </button>
                        </div>
                    )}

                    {isUser && (
                        <div className="space-y-6 animate-fade-in-up">
                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                <div className="space-y-5 flex flex-col gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-5 h-5" />
                                            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" required />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="text-sm font-medium text-gray-700">Password</label>
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-5 h-5" />
                                            <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" required />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full font-bold py-4 rounded-xl text-white shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-70 bg-blue-600 hover:bg-blue-700 shadow-blue-500/30">
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Sign In Firebase <ArrowRight className="w-5 h-5" /></>}
                                </button>
                                <p className="text-gray-500 text-center text-sm mt-6">
                                    Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Create account</Link>
                                </p>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Login;
