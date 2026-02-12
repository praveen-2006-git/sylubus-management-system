import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import UserForm from '../components/Admin/UserForm';
import UserList from '../components/Admin/UserList';
import DepartmentManager from '../components/Admin/DepartmentManager';
import SyllabusManager from '../components/Admin/SyllabusManager';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [activeTab, setActiveTab] = useState('subjects'); // 'users', 'departments', 'subjects'
    const [userRefresh, setUserRefresh] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const { data } = await api.get('/departments');
            setDepartments(data);
        } catch (error) {
            console.error("Failed to fetch departments", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Admin Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 w-full px-6 shadow-sm">
                <div className="h-16 flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">A</div>
                        <div>
                            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">System Management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <span className="block text-xs font-bold text-slate-800">{user?.username || 'Admin'}</span>
                            <span className="block text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 rounded-sm inline-block">ADMINISTRATOR</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 text-xs font-bold py-2 px-4 rounded-lg transition-all uppercase tracking-wide shadow-sm hover:shadow-md active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto p-6 max-w-7xl">

                {/* Tabs */}
                <div className="flex space-x-2 mb-6 border-b border-slate-200 pb-1 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('subjects')}
                        className={`px-4 py-2 font-bold text-sm rounded-lg transition-all ${activeTab === 'subjects' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        Subjects
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 font-bold text-sm rounded-lg transition-all ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('departments')}
                        className={`px-4 py-2 font-bold text-sm rounded-lg transition-all ${activeTab === 'departments' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        Departments
                    </button>
                </div>

                {/* Content */}
                <div>
                    {activeTab === 'users' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Create New User</h2>
                                <UserForm departments={departments} onSuccess={() => setUserRefresh(prev => !prev)} />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-slate-800">User Directory</h2>
                                    <button onClick={() => setUserRefresh(prev => !prev)} className="text-sm font-bold text-blue-600 hover:text-blue-800">Refresh</button>
                                </div>
                                <UserList refreshTrigger={userRefresh} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'departments' && (
                        <DepartmentManager departments={departments} fetchDepartments={fetchDepartments} />
                    )}

                    {activeTab === 'subjects' && (
                        <SyllabusManager departments={departments} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
