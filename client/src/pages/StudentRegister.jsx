import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAuth } from '../context/AuthContext';

const StudentRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        department: ''
    });
    const [departments, setDepartments] = useState([]);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const { data } = await api.get('/departments');
                setDepartments(data);
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/register', { ...formData, role: 'Student' });
            // Auto login after register
            await login(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 my-8">
            <Card className="max-w-md w-full bg-slate-900 border-slate-800 p-8 shadow-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Create Account
                    </h1>
                    <p className="text-slate-400">Join to access syllabus materials</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            className="w-full glass-input p-2.5 bg-slate-950 focus:ring-violet-600/50 text-white border border-slate-800 rounded-lg"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full glass-input p-2.5 bg-slate-950 focus:ring-violet-600/50 text-white border border-slate-800 rounded-lg"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full glass-input p-2.5 bg-slate-950 focus:ring-violet-600/50 text-white border border-slate-800 rounded-lg"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            className="w-full glass-input p-2.5 bg-slate-950 focus:ring-violet-600/50 text-white border border-slate-800 rounded-lg cursor-pointer"
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full glass-input p-2.5 bg-slate-950 focus:ring-violet-600/50 text-white border border-slate-800 rounded-lg"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 mt-2 bg-violet-600 hover:bg-violet-700 font-semibold shadow-sm rounded-lg text-white"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <div className="mt-6 text-center pt-6 border-t border-slate-800">
                    <p className="text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-500 font-semibold hover:text-violet-400 hover:underline transition">
                            Sign in
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default StudentRegister;
