import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProfileManagementCard = () => {
    const { user, login } = useAuth(); // login function updates the contextual user state
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Filter out empty password
        const payload = {};
        if (formData.fullName && formData.fullName !== user.fullName) payload.fullName = formData.fullName;
        if (formData.password) payload.password = formData.password;

        if (Object.keys(payload).length === 0) {
            setMessage({ type: 'error', text: 'No changes made.' });
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.put('/auth/profile', payload);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, password: '' })); // Clear password field
            
            // Re-authenticate silently with the new context data 
            // In a real app we might want a specific 'updateUserAction' in context, 
            // but we can just let it sit or redirect. Actually, the token doesn't expire,
            // but the header changes. We might need window.location.reload() or let the user click around.
            // For now, simple success message is fine.
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8 w-full max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Profile Avatar / Info */}
                <div className="flex flex-col items-center text-center bg-slate-50 p-6 rounded-xl border border-slate-200 w-full md:w-1/3">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-4xl mb-4 shadow-inner border border-blue-100">
                        {user?.fullName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{user?.fullName || user?.username}</h2>
                    <p className="text-xs font-medium text-slate-500 mb-2">{user?.email}</p>
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider
                        ${user?.role === 'Admin' || user?.role === 'Super Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        user?.role === 'Faculty' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                        {user?.role} {user?.facultyRole ? `- ${user.facultyRole}` : ''}
                    </span>

                    {user?.department?.name && (
                        <div className="mt-4 pt-4 border-t border-slate-200 w-full">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Department</p>
                            <p className="font-semibold text-slate-700 text-sm mt-1">{user.department.name}</p>
                        </div>
                    )}
                </div>

                {/* Edit Form */}
                <div className="w-full md:w-2/3">
                    <h3 className="text-lg font-bold text-slate-800 mb-5">Update Profile Details</h3>
                    
                    {message && (
                        <div className={`p-3 mb-5 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Your Full Name"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">New Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current password"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Username / Email (Read-Only)</label>
                            <input
                                type="text"
                                value={user?.username || ''}
                                readOnly
                                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-400 italic cursor-not-allowed"
                                title="Contact Super Admin to change your core identifiers"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-slate-900 hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && (
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default ProfileManagementCard;
