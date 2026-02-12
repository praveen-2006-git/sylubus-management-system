import { useAuth } from '../context/AuthContext';
import StudentHeader from '../components/StudentHeader';

const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <StudentHeader />

            <main className="flex-1 container mx-auto px-6 py-8 max-w-4xl">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl mb-4 shadow-inner border border-blue-100">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{user?.username}</h2>
                            <span className="mt-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
                                {user?.role || 'Student'}
                            </span>

                            <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Status</span>
                                    <span className="font-medium text-green-600 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Active
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Member Since</span>
                                    <span className="font-medium text-slate-700">Feb 2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Settings / Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Account Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Username</label>
                                    <input
                                        type="text"
                                        value={user?.username || ''}
                                        readOnly
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 font-medium focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Role</label>
                                    <input
                                        type="text"
                                        value={user?.role || 'Student'}
                                        readOnly
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 font-medium focus:outline-none"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value="student@university.edu"
                                        readOnly
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-400 italic focus:outline-none cursor-not-allowed"
                                        title="Email editing is disabled"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preferences Stub */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Email Notifications</p>
                                        <p className="text-xs text-slate-500">Receive updates about new syllabi</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 cursor-not-allowed">
                                        <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Dark Mode</p>
                                        <p className="text-xs text-slate-500">Toggle application theme</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 cursor-not-allowed">
                                        <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <button
                                onClick={logout}
                                className="px-5 py-2.5 border border-red-200 text-red-600 font-bold rounded-xl text-sm hover:bg-red-50 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
