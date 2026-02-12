import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const FacultyDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const { data } = await api.get('/subjects');
                setSubjects(data);
            } catch (error) {
                console.error("Failed to fetch subjects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 h-16 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        A
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-800">Academic<span className="text-blue-600">Sys</span></span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider ml-2">
                        Faculty Portal
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800">{user?.fullName}</p>
                        <p className="text-xs text-slate-500 font-medium">{user?.facultyRole} • {user?.department?.name}</p>
                    </div>
                    <button onClick={logout} className="text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">My Subjects</h1>
                    <p className="text-slate-500">Manage your courses and view enrolled students</p>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : subjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <div key={subject._id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                                            {subject.code}
                                        </span>
                                        {subject.type === 'General' && (
                                            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider">
                                                General
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {subject.name}
                                    </h3>
                                    <div className="text-sm text-slate-500 mb-4">
                                        Department of {subject.department?.name || 'General'}
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <button
                                            onClick={() => navigate(`/syllabus/${subject._id}`)}
                                            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            View Syllabus →
                                        </button>
                                        <span className="text-xs font-bold text-slate-400">
                                            {/* Could show enrolled count here if available */}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No Subjects Assigned</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">
                            You currently don't have any subjects assigned to you. Contact the administrator.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FacultyDashboard;
