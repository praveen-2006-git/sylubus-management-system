import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(username, password);
            toast.success('Welcome to Admin Portal');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('[Admin Login Error]', err);
            if (err.code === 'ECONNABORTED') {
                toast.error('Server Timeout: The backend is taking too long to wake up. Please wait 1 minute and try again.');
            } else if (!err.response) {
                toast.error('Network Error: Cannot reach the server. Please check your internet or wait for the server to restart.');
            } else {
                toast.error(err.response?.data?.message || 'Login failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
            <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-lg shadow-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-700 mb-4 border border-slate-200">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-slate-500">Secure access for administrators</p>
                </div>



                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Admin ID"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full justify-center bg-slate-800 hover:bg-slate-900"
                    >
                        {isLoading ? 'Authenticating...' : 'Access Dashboard'}
                    </Button>
                </form>

                <div className="mt-6 text-center pt-6 border-t border-slate-100">
                    <p className="text-slate-500 text-sm">
                        Return to{' '}
                        <Link to="/" className="text-blue-700 font-semibold hover:underline">
                            Student Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
