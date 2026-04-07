import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { categoryAPI, contactAPI, packageAPI, childCategoryAPI, userAPI } from '../services/api';
import {
    Users, BarChart3, Map, LogOut, Search, PlusCircle, Settings, Bell,
    Globe2, Ticket, TrendingUp, ArrowUpRight, Plane, Package, DollarSign,
    FileText, UserPlus, Download, Cog, ChevronRight, X, Check, Star, Layers,
    LayoutDashboard, Banknote, HelpCircle, MessageSquare, Trash2, Send, Ban, Menu
} from 'lucide-react';

const initialPackages = [
    { id: 1, name: 'Golden Europe Tour', destination: 'Europe', price: '$2,499', duration: '14 Days', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300&auto=format&fit=crop&q=60', bookings: 1204, trend: '+18%', rating: 4.9 },
    { id: 2, name: 'Bali Paradise', destination: 'Indonesia', price: '$1,299', duration: '7 Days', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&auto=format&fit=crop&q=60', bookings: 982, trend: '+12%', rating: 4.8 },
    { id: 3, name: 'Swiss Alps Adventure', destination: 'Switzerland', price: '$3,199', duration: '10 Days', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&auto=format&fit=crop&q=60', bookings: 756, trend: '+8%', rating: 4.7 },
    { id: 4, name: 'Japan Cherry Blossom', destination: 'Japan', price: '$2,899', duration: '12 Days', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&auto=format&fit=crop&q=60', bookings: 643, trend: '+22%', rating: 4.9 },
    { id: 5, name: 'Dubai Luxury', destination: 'UAE', price: '$4,500', duration: '8 Days', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&auto=format&fit=crop&q=60', bookings: 521, trend: '+15%', rating: 4.6 },
    { id: 6, name: 'Maldives Retreat', destination: 'Maldives', price: '$3,800', duration: '6 Days', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&auto=format&fit=crop&q=60', bookings: 489, trend: '+10%', rating: 4.8 },
];

const recentActivity = [
    { type: 'booking', text: 'Alice M. booked a flight to London.', time: '2 mins ago', color: 'bg-blue-400' },
    { type: 'partner', text: 'New partner SkyHigh Airlines joined.', time: '15 mins ago', color: 'bg-green-400' },
    { type: 'alert', text: 'System alert: Payment Gateway latency high.', time: '1 hour ago', color: 'bg-red-400' },
];

// ============== COMPONENT ==============
const AdminPanel = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [packages, setPackages] = useState(initialPackages);
    const [contacts, setContacts] = useState([]);
    const [showAddPackage, setShowAddPackage] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [newPackage, setNewPackage] = useState({
        name: '', destination: '', price: '', duration: '', image: null
    });
    const [realUsers, setRealUsers] = useState([]);
    const { sendWhatsAppMessage } = useAuth();
    const [whatsappMessage, setWhatsappMessage] = useState("Hello! Your trip details are ready with Triplova.");
    const [actionModal, setActionModal] = useState({ isOpen: false, type: null, user: null });
    const [confirmText, setConfirmText] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchData = () => {
            // Fetch categories and local packages
            Promise.all([
                categoryAPI.getAll().catch(err => ({ status: 'error', data: [] })),
                packageAPI.getAll().catch(err => ({ status: 'error', data: [] })),
                childCategoryAPI.getAll().catch(err => ({ status: 'error', data: [] }))
            ])
                .then(([categoryData, localPackagesData, childCategoryData]) => {
                    if (!isMounted) return;
                    const defaultLatest = [
                        { id: 'default-new-1', name: 'Sapphire Beach Resort', destination: 'Maldives', price: '$1,299', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&auto=format&fit=crop&q=60' },
                        { id: 'default-new-2', name: 'Alpine Mountain Gateway', destination: 'Switzerland', price: '$2,150', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&auto=format&fit=crop&q=60' },
                        { id: 'default-new-3', name: 'Desert Safari Expedition', destination: 'Dubai', price: '$899', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=60' }
                    ];
                    let combined = [...initialPackages, ...defaultLatest];
                    const deletedIds = JSON.parse(localStorage.getItem('triplova_deleted_category_ids') || '[]');
                    const deletedChildIds = JSON.parse(localStorage.getItem('triplova_deleted_child_category_ids') || '[]');

                    if (categoryData && categoryData.status === 'success' && Array.isArray(categoryData.data)) {
                        combined = [...categoryData.data.filter(cat => !deletedIds.includes(cat.category_id))];
                    }
                    if (childCategoryData && childCategoryData.status === 'success' && Array.isArray(childCategoryData.data)) {
                        combined = [...combined, ...childCategoryData.data.filter(child => !deletedChildIds.includes(child.childCategory_id))];
                    }
                    if (localPackagesData && localPackagesData.status === 'success' && Array.isArray(localPackagesData.data)) {
                        combined = [...combined, ...localPackagesData.data];
                    }
                    setPackages(combined.reverse());
                })
                .catch(err => console.error("Failed to fetch packages", err));

            // Fetch contacts
            contactAPI.getAllDetails()
                .then(data => {
                    if (!isMounted) return;
                    if (data && data.status === 'success' && Array.isArray(data.data)) {
                        setContacts(data.data);
                    }
                })
                .catch(err => console.error("Failed to fetch contacts", err));
        };

        fetchData();
        window.addEventListener('focus', fetchData);
        window.addEventListener('storage', fetchData);

        return () => {
            isMounted = false;
            window.removeEventListener('focus', fetchData);
            window.removeEventListener('storage', fetchData);
        };
    }, []);

    useEffect(() => {
        if (activeTab === 'messages') {
            contactAPI.getAllDetails()
                .then(data => {
                    if (data && data.status === 'success' && Array.isArray(data.data)) {
                        setContacts(data.data);
                    }
                })
                .catch(err => console.error("Failed to fetch contacts on tab switch", err));
        }
        if (activeTab === 'users') {
            userAPI.getAll()
                .then(data => {
                    if (data && data.status === 'success') {
                        setRealUsers(data.data);
                    }
                })
                .catch(err => console.error("Failed to fetch users", err));
        }
    }, [activeTab]);

    const handleSendWhatsApp = async (phone) => {
        if (!phone || phone === 'UNVERIFIED') {
            alert("This user does not have a verified phone number.");
            return;
        }
        const confirm = window.confirm(`Send WhatsApp message to ${phone}?`);
        if (confirm) {
            await sendWhatsAppMessage(phone, whatsappMessage);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleUserAction = async () => {
        if (confirmText.toLowerCase() !== 'confirm') {
            alert('Please type Confirm to proceed.');
            return;
        }
        try {
            if (actionModal.type === 'delete') {
                await userAPI.deleteUser(actionModal.user.id);
                setRealUsers(prev => prev.filter(u => u.id !== actionModal.user.id));
            } else if (actionModal.type === 'block' || actionModal.type === 'unblock') {
                const newStatus = actionModal.type === 'block' ? 'blocked' : 'active';
                await userAPI.updateStatus(actionModal.user.id, newStatus);
                setRealUsers(prev => prev.map(u => u.id === actionModal.user.id ? { ...u, status: newStatus } : u));
            }
            setActionModal({ isOpen: false, type: null, user: null });
            setConfirmText("");
        } catch (err) {
            alert('Action failed: ' + err.message);
        }
    };

    const handleAddPackage = async (e) => {
        e.preventDefault();

        // Convert image logic for json-server (simulating object URL or placeholder)
        let imageUrl = '';
        if (newPackage.image) {
            try {
                imageUrl = URL.createObjectURL(newPackage.image);
            } catch (err) { }
        } else {
            imageUrl = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=500&auto=format&fit=crop&q=60';
        }

        const packageData = {
            id: Date.now().toString(),
            name: newPackage.name,
            destination: newPackage.destination,
            price: newPackage.price,
            duration: newPackage.duration,
            trip_type: newPackage.trip_type || 'International',
            image: imageUrl,
            bookings: 0,
            trend: 'New',
            rating: 5.0
        };

        try {
            await packageAPI.create(packageData);

            // Refresh categories & packages
            Promise.all([
                categoryAPI.getAll().catch(err => ({ status: 'error', data: [] })),
                packageAPI.getAll().catch(err => ({ status: 'error', data: [] })),
                childCategoryAPI.getAll().catch(err => ({ status: 'error', data: [] }))
            ]).then(([catData, packData, childData]) => {
                const deletedIds = JSON.parse(localStorage.getItem('triplova_deleted_category_ids') || '[]');
                const deletedChildIds = JSON.parse(localStorage.getItem('triplova_deleted_child_category_ids') || '[]');
                const defaultLatest = [
                    { id: 'default-new-1', name: 'Sapphire Beach Resort', destination: 'Maldives', price: '$1,299', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&auto=format&fit=crop&q=60' },
                    { id: 'default-new-2', name: 'Alpine Mountain Gateway', destination: 'Switzerland', price: '$2,150', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&auto=format&fit=crop&q=60' },
                    { id: 'default-new-3', name: 'Desert Safari Expedition', destination: 'Dubai', price: '$899', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=60' }
                ];
                let combined = [...initialPackages, ...defaultLatest];
                if (catData?.status === 'success' && Array.isArray(catData.data)) {
                    combined = [...catData.data.filter(cat => !deletedIds.includes(cat.category_id))];
                }
                if (childData?.status === 'success' && Array.isArray(childData.data)) {
                    combined = [...combined, ...childData.data.filter(child => !deletedChildIds.includes(child.childCategory_id))];
                }
                if (packData?.status === 'success' && Array.isArray(packData.data)) {
                    combined = [...combined, ...packData.data];
                }
                setPackages(combined.reverse());
            });

            setNewPackage({ name: '', destination: '', price: '', duration: '', image: null });
            setShowAddPackage(false);
        } catch (error) {
            console.error("Failed to add package", error);
            alert("Error adding package. Please try again.");
        }
    };

    const handleDeletePackage = async (e, pkg) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete "${pkg.category_name || pkg.name}"?`)) return;

        try {
            const isLocal = !pkg.category_id && !pkg.childCategory_id; // Simple heuristic: true if it's from our mock backend
            if (isLocal && pkg.id) {
                await packageAPI.delete(pkg.id);
            } else if (pkg.childCategory_id) {
                const formData = new FormData();
                formData.append('id', pkg.childCategory_id);
                formData.append('childCategory_id', pkg.childCategory_id);
                try {
                    await childCategoryAPI.delete(formData);
                } catch (apiError) {
                    console.error("Primary API delete failed", apiError);
                }
                // Fallback for demo: save locally so it's visually deleted
                const deletedChildIds = JSON.parse(localStorage.getItem('triplova_deleted_child_category_ids') || '[]');
                if (!deletedChildIds.includes(pkg.childCategory_id)) {
                    deletedChildIds.push(pkg.childCategory_id);
                    localStorage.setItem('triplova_deleted_child_category_ids', JSON.stringify(deletedChildIds));
                }
            } else if (pkg.category_id) {
                const formData = new FormData();
                formData.append('id', pkg.category_id);
                formData.append('category_id', pkg.category_id);
                try {
                    await categoryAPI.delete(formData);
                } catch (apiError) {
                    console.error("Primary API delete failed, it might require different parameters or is read-only.", apiError);
                }

                // Fallback for demo: save locally so it's visually deleted
                const deletedIds = JSON.parse(localStorage.getItem('triplova_deleted_category_ids') || '[]');
                if (!deletedIds.includes(pkg.category_id)) {
                    deletedIds.push(pkg.category_id);
                    localStorage.setItem('triplova_deleted_category_ids', JSON.stringify(deletedIds));
                }
            }

            // Refresh 
            Promise.all([
                categoryAPI.getAll().catch(err => ({ status: 'error', data: [] })),
                packageAPI.getAll().catch(err => ({ status: 'error', data: [] })),
                childCategoryAPI.getAll().catch(err => ({ status: 'error', data: [] }))
            ]).then(([catData, packData, childData]) => {
                const deletedIds = JSON.parse(localStorage.getItem('triplova_deleted_category_ids') || '[]');
                const deletedChildIds = JSON.parse(localStorage.getItem('triplova_deleted_child_category_ids') || '[]');
                let combined = [];
                if (catData?.status === 'success' && Array.isArray(catData.data)) {
                    combined = [...catData.data.filter(cat => !deletedIds.includes(cat.category_id))];
                }
                if (childData?.status === 'success' && Array.isArray(childData.data)) {
                    combined = [...combined, ...childData.data.filter(child => !deletedChildIds.includes(child.childCategory_id))];
                }
                if (packData?.status === 'success' && Array.isArray(packData.data)) {
                    combined = [...combined, ...packData.data];
                }
                setPackages(combined.reverse());
            });

        } catch (error) {
            console.error("Failed to delete package", error);
            alert("Error deleting package. Please try again.");
        }
    };

    // ============== SIDEBAR ==============
    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Plane },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    ];

    return (
        <div className="flex h-screen overflow-hidden relative" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ======= MOBILE OVERLAY ======= */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ======= SIDEBAR ======= */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] flex-shrink-0 flex flex-col justify-between h-full overflow-y-auto bg-[#0b1120] border-r border-[#1e293b] transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div>
                    {/* Logo */}
                    <div className="px-6 pt-8 pb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                <Globe2 className="w-6 h-6 text-[#0b1120]" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">TravelCmd</h1>
                                <p className="text-slate-500 text-[10px] font-bold tracking-wider uppercase mt-0.5">Admin Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="px-5 space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200
                                    ${activeTab === item.id
                                        ? 'bg-[#0f293e] text-cyan-400'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className="w-[18px] h-[18px]" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* User Profile at Bottom */}
                <div className="p-5 bottom-0 w-full bg-[#0b1120] border-t border-[#1e293b]">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1e293b]/40 border border-white/5 hover:bg-[#1e293b]/60 transition-colors cursor-pointer" onClick={handleLogout} title="Click to Sign Out">
                        <div className="w-10 h-10 rounded-full bg-[#0f172a] shadow-inner flex items-center justify-center text-white text-sm font-bold border border-white/10">
                            {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SJ'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{user?.name || 'Sarah Johnson'}</p>
                            <p className="text-slate-400 text-xs mt-0.5">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ======= MAIN CONTENT ======= */}
            <main className="flex-1 overflow-y-auto min-w-0" style={{ background: 'linear-gradient(135deg, #111827 0%, #0f172a 100%)' }}>
                <div className="p-4 md:p-8">

                    {/* Top Header */}
                    <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                        <div className="flex justify-between items-center w-full md:w-auto">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 tracking-tight">Dashboard Overview</h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-green-500 font-medium text-[10px] md:text-[11px] uppercase tracking-wider">System Online • Global Operations Active</span>
                                </div>
                            </div>
                            <button 
                                className="md:hidden p-2 rounded-lg bg-white/5 text-white active:bg-white/10"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:mr-2">
                                <input
                                    type="text"
                                    placeholder="Search bookings, flights..."
                                    className="pl-9 pr-4 py-2 rounded-lg border border-white/5 bg-[#162032] text-white text-xs w-full md:w-64 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder-slate-500 shadow-inner"
                                />
                                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                            <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                            </button>
                            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                                <HelpCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </header>

                    {/* ======= DASHBOARD TAB ======= */}
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* Left Column */}
                            <div className="xl:col-span-2 space-y-6">
                                {/* Total Revenue Card */}
                                <div className="bg-[#1a2332] rounded-3xl p-6 lg:p-8 border border-white/5 shadow-xl">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <p className="text-slate-400 text-sm mb-1">Total Revenue</p>
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-3xl font-bold text-white tracking-tight">$142,580</h3>
                                                <span className="flex items-center text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                                                    <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex bg-[#0f172a] rounded-lg p-1 border border-white/5">
                                            <button className="px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white rounded-md transition-colors">Week</button>
                                            <button className="px-3.5 py-1.5 text-xs font-bold text-[#0f172a] bg-[#22d3ee] rounded-md shadow-[0_0_10px_rgba(34,211,238,0.4)]">Month</button>
                                        </div>
                                    </div>
                                    {/* Mock Chart */}
                                    <div className="flex items-end gap-3 h-52 mb-8 mt-4 border-b border-white/5 pb-6">
                                        {[40, 50, 45, 65, 55, 75, 95].map((h, i) => (
                                            <div key={i} className={`flex-1 rounded-t-sm transition-all relative group cursor-pointer ${i === 6 ? 'bg-[#22d3ee] shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-[#1e293b] hover:bg-[#334155]'}`} style={{ height: `${h}%` }}>
                                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#0f172a] text-[10px] font-bold py-1 px-2 rounded transition-opacity">
                                                    ${h}k
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Category Text */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Direct Sales</p>
                                            <p className="text-xl font-bold text-white tracking-tight">$89,240</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Affiliate</p>
                                            <p className="text-xl font-bold text-white tracking-tight">$32,110</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Corporate</p>
                                            <p className="text-xl font-bold text-white tracking-tight">$21,230</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Trending Destinations Card */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-400 bg-red-400/10 p-1.5 rounded-lg border border-red-400/20 text-xs">❤️</span>
                                            <h3 className="text-base font-bold text-white">Trending Destinations</h3>
                                        </div>
                                        <button className="text-[#22d3ee] text-xs font-bold hover:text-cyan-300">View All Destinations</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        {[
                                            { name: 'Paris, France', bookings: '1,204', trend: '+18%', image: initialPackages[4].image },
                                            { name: 'Bali, Indonesia', bookings: '982', trend: '+12%', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=60' },
                                            { name: 'Swiss Alps', bookings: '756', trend: '+8%', image: initialPackages[2].image }
                                        ].map((dest, i) => (
                                            <div key={i} className="bg-[#1a2332] rounded-2xl overflow-hidden border border-white/5 group shadow-lg">
                                                <div className="h-32 overflow-hidden relative">
                                                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <h4 className="text-white font-bold text-sm leading-tight">{dest.name}</h4>
                                                        <span className="text-[10px] font-bold text-green-400">{dest.trend}</span>
                                                    </div>
                                                    <p className="text-slate-500 text-[10px]">{dest.bookings} bookings this month</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Active Users */}
                                <div className="bg-[#1a2332] rounded-3xl border border-white/5 p-8 relative shadow-xl">
                                    <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center mb-6 shadow-inner">
                                        <Users className="w-[18px] h-[18px] text-indigo-400" />
                                    </div>
                                    <div className="absolute top-8 right-8 text-slate-500 cursor-pointer hover:text-white">⋮</div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Active Users</p>
                                    <h3 className="text-[28px] font-bold text-white mb-2 tracking-tight">12,450</h3>
                                    <div className="flex items-center gap-1.5 text-[10px]">
                                        <TrendingUp className="w-3 h-3 text-indigo-400" />
                                        <span className="text-indigo-400 font-bold">+12%</span>
                                        <span className="text-slate-500 font-medium">vs last month</span>
                                    </div>
                                </div>

                                {/* Avg Ticket Value */}
                                <div className="bg-[#1a2332] rounded-3xl border border-white/5 p-8 relative shadow-xl">
                                    <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center mb-6 shadow-inner">
                                        <Ticket className="w-[18px] h-[18px] text-amber-500" />
                                    </div>
                                    <div className="absolute top-8 right-8 text-slate-500 cursor-pointer hover:text-white">⋮</div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Avg. Ticket Value</p>
                                    <h3 className="text-[28px] font-bold text-white mb-2 tracking-tight">$458.20</h3>
                                    <div className="flex items-center gap-1.5 text-[10px]">
                                        <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
                                        <span className="text-red-500 font-bold">-2%</span>
                                        <span className="text-slate-500 font-medium">vs last month</span>
                                    </div>
                                </div>

                                {/* System Health */}
                                <div className="bg-[#1a2332] rounded-3xl border border-white/5 p-8 relative flex flex-col items-center shadow-xl">
                                    <div className="w-full flex items-center gap-3 mb-8 text-white font-bold text-sm">
                                        <Layers className="w-[18px] h-[18px] text-[#22d3ee]" />
                                        System Health
                                    </div>

                                    <div className="w-full flex justify-between items-center mb-8 px-1">
                                        <div className="relative w-[100px] h-[100px]">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                                <circle cx="60" cy="60" r="50" fill="none" stroke="#22d3ee" strokeWidth="10" strokeDasharray="314.16" strokeDashoffset="6.28" strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-bold text-white tracking-tight">98%</span>
                                                <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest mt-0.5">Global</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 ml-8 space-y-6">
                                            <div>
                                                <div className="flex justify-between text-[10px] mb-2 font-bold">
                                                    <span className="text-slate-400">Server Load</span>
                                                    <span className="text-[#22d3ee]">32%</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#22d3ee] rounded-full" style={{ width: '32%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] mb-2 font-bold">
                                                    <span className="text-slate-400">API Latency</span>
                                                    <span className="text-amber-500">124ms</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[11px] font-bold">
                                        <Check className="w-3.5 h-3.5" />
                                        All systems operational in 12 regions.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======= USERS TAB (Customer Details) ======= */}
                    {activeTab === 'users' && (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                <h3 className="text-xl font-bold text-white">Customer Details</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                                    <input
                                        type="text"
                                        value={whatsappMessage}
                                        onChange={(e) => setWhatsappMessage(e.target.value)}
                                        placeholder="WhatsApp Template..."
                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500 w-full sm:w-64"
                                    />
                                    <span className="text-slate-400 text-sm flex-shrink-0">{realUsers.length} customers</span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 overflow-hidden"
                                style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' }}
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Customer</th>
                                                <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Contact</th>
                                                <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Bookings</th>
                                                <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Total Spent</th>
                                                <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Status</th>
                                                <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Packages Booked</th>
                                                <th className="px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {realUsers.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                                        <div className="flex flex-col items-center justify-center gap-3">
                                                            <Users size={40} className="opacity-20 flex-shrink-0 mx-auto mb-2" />
                                                            <p>No registered users found</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : realUsers.map((c) => (
                                                <tr key={c.id}
                                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                                >
                                                    <td className="px-6 py-4" onClick={() => setSelectedCustomer(selectedCustomer?.id === c.id ? null : c)}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/10">
                                                                {c.name ? c.name[0].toUpperCase() : 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="text-white text-sm font-semibold">{c.name}</p>
                                                                <p className="text-slate-500 text-xs">ID: #{c.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-slate-300 text-sm">{c.email}</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-slate-500 text-xs">{c.phone}</p>
                                                            {c.phone_verified ? (
                                                                <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 rounded-full border border-green-500/20">Verified</span>
                                                            ) : (
                                                                <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 rounded-full border border-red-500/20">Unverified</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-white text-sm font-medium">{c.totalBookings || 0}</td>
                                                    <td className="px-6 py-4 text-white text-sm font-medium">{c.totalSpent || '$0'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                                                            ${c.status === 'blocked'
                                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                : c.status === 'vip'
                                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                                : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            }`}>
                                                            {c.status === 'blocked' ? 'Blocked' : c.status === 'vip' ? '⭐ VIP' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {(c.bookedPackages || []).map((pkg, idx) => (
                                                                <span key={idx} className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/10">
                                                                    {pkg}
                                                                </span>
                                                            ))}
                                                            {(!c.bookedPackages || c.bookedPackages.length === 0) && <span className="text-slate-600 text-xs italic">No bookings</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSendWhatsApp(c.phone);
                                                                }}
                                                                className={`p-2 rounded-lg transition-all ${c.phone_verified ? 'text-green-400 hover:bg-green-400/10' : 'text-slate-600 cursor-not-allowed opacity-50'}`}
                                                                title={c.phone_verified ? "Send WhatsApp Message" : "Phone not verified"}
                                                            >
                                                                <MessageSquare className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setActionModal({ isOpen: true, type: c.status === 'blocked' ? 'unblock' : 'block', user: c }); setConfirmText(""); }}
                                                                className={`p-2 rounded-lg transition-all hover:bg-yellow-500/10 ${c.status === 'blocked' ? 'text-yellow-500' : 'text-slate-500 hover:text-yellow-400'}`}
                                                                title={c.status === 'blocked' ? "Unblock account" : "Block account"}
                                                            >
                                                                <Ban className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setActionModal({ isOpen: true, type: 'delete', user: c }); setConfirmText(""); }}
                                                                className="p-2 rounded-lg transition-all hover:bg-red-500/10 text-slate-500 hover:text-red-400"
                                                                title="Delete account"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${selectedCustomer?.id === c.id ? 'rotate-90' : ''}`} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Expanded Customer Detail */}
                            {selectedCustomer && (
                                <div className="mt-6 rounded-2xl border border-white/10 p-6 animate-fade-in-up"
                                    style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10" />
                                            <div>
                                                <h4 className="text-lg font-bold text-white">{selectedCustomer.name}</h4>
                                                <p className="text-slate-400 text-sm">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                                            <p className="text-slate-500 text-xs mb-1">Total Bookings</p>
                                            <p className="text-2xl font-bold text-white">{selectedCustomer.totalBookings}</p>
                                        </div>
                                        <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                                            <p className="text-slate-500 text-xs mb-1">Total Spent</p>
                                            <p className="text-2xl font-bold text-white">{selectedCustomer.totalSpent}</p>
                                        </div>
                                        <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                                            <p className="text-slate-500 text-xs mb-1">Status</p>
                                            <p className="text-2xl font-bold text-amber-400">{selectedCustomer.status === 'vip' ? '⭐ VIP' : '● Active'}</p>
                                        </div>
                                    </div>
                                    <h5 className="text-white font-semibold text-sm mb-3">Booked Packages</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCustomer.bookedPackages.map((pkg, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/15">
                                                <Plane className="w-4 h-4 text-cyan-400" />
                                                <span className="text-cyan-300 text-sm font-medium">{pkg}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ======= BOOKINGS TAB (Available Packages + Add Package) ======= */}
                    {activeTab === 'bookings' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Available Packages</h3>
                                <button
                                    onClick={() => setShowAddPackage(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add Package
                                </button>
                            </div>

                            {/* Packages Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                                {packages.map((pkg, idx) => {
                                    const imgUrl = pkg.image || (pkg.category_image ? (pkg.category_image.startsWith('http') || pkg.category_image.startsWith('blob:') ? pkg.category_image : `https://triplova.com/triplova-project/api/admin/${pkg.category_image}`) : 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=60');
                                    return (
                                        <div key={pkg.category_id || pkg.id || idx} className="rounded-2xl border border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300"
                                            style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' }}
                                        >
                                            <div className="h-44 overflow-hidden relative">
                                                <img src={imgUrl} alt={pkg.category_name || pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                                                <button onClick={(e) => handleDeletePackage(e, pkg)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center backdrop-blur-md transition-all z-10 opacity-0 group-hover:opacity-100 shadow-lg border border-red-500/30" title="Delete Package">
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                                                    <span className="text-white text-lg font-bold">{pkg.price || 'Contact us'}</span>
                                                    {(pkg.rating || 0) > 0 && (
                                                        <span className="flex items-center gap-1 text-amber-400 text-xs font-medium bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/20">
                                                            <Star className="w-3 h-3" /> {pkg.rating}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h4 className="text-white font-bold text-base mb-1 capitalize">{pkg.category_name || pkg.childCategory_name || pkg.name}</h4>

                                                <div className="text-slate-400 text-sm mb-3 min-h-[40px] line-clamp-2">
                                                    {pkg.category_description || pkg.childCategory_description || 'No description available for this category.'}
                                                </div>

                                                <div className="flex items-center gap-3 text-slate-400 text-sm mb-3 border-t border-white/5 pt-3">
                                                    <span className="flex items-center gap-1"><Map className="w-3 h-3" /> {pkg.destination || 'Global'}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-500 text-xs">{(pkg.subcategories?.length || pkg.bookings || 0).toLocaleString()} subcategories</span>
                                                    <span className={`text-xs font-bold ${(pkg.trend || 'New') === 'New' ? 'text-blue-400' : 'text-green-400'}`}>
                                                        {pkg.trend || 'New'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* ======= ANALYTICS TAB ======= */}
                    {activeTab === 'analytics' && (
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6">Analytics Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {[
                                    { label: 'Total Revenue', value: '$142,500', change: '+18.2%', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
                                    { label: 'Active Users', value: '12,450', change: '+12%', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                                    { label: 'Bookings Today', value: '234', change: '+5.8%', icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                    { label: 'Avg. Rating', value: '4.8', change: '+0.2', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                                ].map((stat, idx) => (
                                    <div key={idx} className="rounded-2xl border border-white/10 p-6"
                                        style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                            </div>
                                            <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">{stat.change}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                        <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Analytics Chart Placeholder */}
                            <div className="rounded-2xl border border-white/10 p-8 text-center"
                                style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' }}
                            >
                                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <h4 className="text-lg font-bold text-white mb-2">Revenue Charts & Insights</h4>
                                <p className="text-slate-500 text-sm max-w-md mx-auto">Detailed analytics with interactive charts, booking trends, and revenue forecasts will be displayed here.</p>
                            </div>
                        </div>
                    )}

                    {/* ======= MESSAGES TAB ======= */}
                    {activeTab === 'messages' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    Contact Messages
                                    <button
                                        onClick={() => {
                                            contactAPI.getAllDetails().then(data => {
                                                if (data && data.data) setContacts(data.data);
                                            });
                                        }}
                                        className="text-xs bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-full font-medium transition-colors"
                                    >
                                        Refresh
                                    </button>
                                </h3>
                                <span className="text-slate-400 text-sm">{contacts.length} submissions</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mb-8">
                                {contacts.length > 0 ? contacts.map((contact, idx) => (
                                    <div key={contact.id || idx} className="rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row gap-6 hover:border-white/20 transition-all duration-300"
                                        style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' }}
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                            <MessageSquare className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                                                <div>
                                                    <h4 className="text-white font-bold text-base">{contact.name || 'Anonymous User'}</h4>
                                                    <p className="text-slate-400 text-sm font-medium">{contact.email || 'No email provided'}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-slate-500 text-xs">
                                                        {contact.date ? new Date(contact.date).toLocaleDateString() : 'Recent'}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm("Are you sure you want to delete this message?")) {
                                                                contactAPI.deleteContact(contact.id).then(() => {
                                                                    setContacts(contacts.filter(c => c.id !== contact.id));
                                                                });
                                                            }
                                                        }}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors"
                                                        title="Delete Message"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-4 text-slate-300 text-sm border border-white/5">
                                                <p className="whitespace-pre-wrap">{contact.message || contact.details || 'No message body provided.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-16 rounded-2xl border border-white/10" style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' }}>
                                        <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-400 text-base">No contact messages available right now.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* ======= ADD PACKAGE MODAL ======= */}
            {showAddPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
                    <div className="w-full max-w-lg mx-4 rounded-2xl border border-white/10 p-8 shadow-2xl"
                        style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-cyan-400" />
                                Add New Package
                            </h3>
                            <button onClick={() => setShowAddPackage(false)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddPackage} className="space-y-4">
                            <div>
                                <label className="text-slate-400 text-sm mb-1.5 block">Package Name</label>
                                <input
                                    type="text"
                                    value={newPackage.name}
                                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                                    placeholder="e.g. Santorini Dream"
                                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder-slate-600"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm mb-1.5 block">Destination</label>
                                    <input
                                        type="text"
                                        value={newPackage.destination}
                                        onChange={(e) => setNewPackage({ ...newPackage, destination: e.target.value })}
                                        placeholder="e.g. Greece"
                                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder-slate-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-1.5 block">Price</label>
                                    <input
                                        type="text"
                                        value={newPackage.price}
                                        onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                                        placeholder="e.g. $2,499"
                                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder-slate-600"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm mb-1.5 block">Duration</label>
                                    <input
                                        type="text"
                                        value={newPackage.duration}
                                        onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                                        placeholder="e.g. 10 Days"
                                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder-slate-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-1.5 block">Image Upload</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNewPackage({ ...newPackage, image: e.target.files[0] })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddPackage(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Add Package
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* User Action Modal */}
            {actionModal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 p-6 w-full max-w-sm rounded-[24px] shadow-2xl relative animate-scale-in">
                        <h3 className="text-xl font-bold text-white mb-2">
                            {actionModal.type === 'delete' ? 'Delete User' : actionModal.type === 'block' ? 'Block User' : 'Unblock User'}
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Are you sure you want to {actionModal.type} <strong>{actionModal.user?.name || actionModal.user?.email || actionModal.user?.phone}</strong>?<br/>
                            <span className="text-red-400 mt-2 block">
                                Type <strong>Confirm</strong> below to proceed.
                            </span>
                        </p>
                        
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Confirm"
                            className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-cyan-500 transition-all shadow-inner mb-6"
                        />
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setActionModal({ isOpen: false, type: null, user: null }); setConfirmText(""); }}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUserAction}
                                disabled={confirmText.toLowerCase() !== 'confirm'}
                                className={`flex-1 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg transition-all flex items-center justify-center gap-2 
                                ${actionModal.type === 'delete' ? 'bg-gradient-to-r from-red-600 to-rose-700 shadow-red-500/20' : 'bg-gradient-to-r from-yellow-500 to-orange-600 shadow-orange-500/20'} 
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <Check className="w-4 h-4" />
                                {actionModal.type === 'delete' ? 'Delete' : actionModal.type === 'block' ? 'Block' : 'Unblock'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
