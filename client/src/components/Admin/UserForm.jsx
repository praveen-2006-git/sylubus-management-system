import { useState, useEffect } from 'react';
import api from '../../utils/api';

const UserForm = ({ onSuccess, departments = [] }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        role: 'Student',
        department: '',
        facultyRole: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Set default faculty role to Professor when Faculty is selected
    useEffect(() => {
        if (formData.role === 'Faculty' && !formData.facultyRole) {
            setFormData(prev => ({ ...prev, facultyRole: 'Professor' }));
        }
    }, [formData.role]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Adjust payload based on role
            const payload = { ...formData };
            if (payload.role !== 'Faculty') delete payload.facultyRole;
            if (payload.role === 'Admin') delete payload.department; // Admin might not need dept? 
            // Prompt said: "User... department (Required for Faculty/Student)".

            // We need a proper API endpoint for department creation if we use ObjectIds.
            // If I use the *names* from constants, it won't work if the Schema expects ObjectId.
            // EXISTING SCHEMA: department: ObjectId ref 'Department'.
            // CRITICAL: I need to Create Departments in the DB first or look them up.
            // I should probably add a "Create Department" feature or seed them.
            // For now, I will assume the admin enters a Valid Department ID? No, that's bad UX.
            // I MUST implement Department Management.

            // let's try to post.
            await api.post('/auth/admin/create-user', payload);
            setMessage({ type: 'success', text: 'User created successfully!' });
            setFormData({
                username: '',
                email: '',
                password: '',
                fullName: '',
                role: 'Student',
                department: '',
                facultyRole: ''
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create user' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Create New User</h3>

            {message && (
                <div className={`p-3 mb-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-700 h-10"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email / Username</label>
                        <input
                            type="email"
                            name="username" // Using email as username
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value, email: e.target.value })}
                            required
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-700 h-10"
                            placeholder="email@example.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-700 h-10"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-700 h-10"
                        >
                            <option value="Student">Student</option>
                            <option value="Faculty">Faculty</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>

                {formData.role !== 'Admin' && (
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-700 h-10 cursor-pointer"
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {formData.role === 'Faculty' && (
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Faculty Role</label>
                        <select
                            name="facultyRole"
                            value={formData.facultyRole}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-700 h-10"
                        >
                            <option value="Professor">Professor</option>
                            <option value="HOD">HOD</option>
                        </select>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-md active:scale-95"
                >
                    {loading ? 'Creating...' : 'Create User'}
                </button>
            </form>
        </div>
    );
};

export default UserForm;
