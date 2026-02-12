import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
            <div className="w-full px-6 h-20 flex items-center justify-between gap-4">
                {/* Brand / Logo */}
                <div className="flex items-center gap-3 min-w-fit">
                    <div className="w-10 h-10 bg-blue-800 rounded flex items-center justify-center text-white font-serif font-bold text-xl">
                        U
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">Syllabus Management</h1>
                        <p className="text-xs text-slate-500 font-medium tracking-wide">ACADEMIC PORTAL</p>
                    </div>
                </div>

                {/* User Badge */}
                <div className="min-w-fit flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">{user?.username || 'Student User'}</span>
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-300">
                            {user?.username?.charAt(0).toUpperCase() || 'S'}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                            Student | Read-Only
                        </span>
                        <button
                            onClick={logout}
                            className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-full hover:bg-red-700 transition-colors uppercase tracking-wider"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default StudentHeader;
