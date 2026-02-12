import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import StudentHeader from '../components/StudentHeader';

const StudentHome = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All'); // 'All', 'Department', 'General'
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Subjects from API
    useEffect(() => {
        const fetchSubjects = async () => {
            setLoading(true);
            try {
                // Backend handles role-based filtering (Dept + General)
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

    const handleViewSyllabus = (subject) => {
        navigate(`/syllabus/${subject._id}`);
    };

    // Frontend Filtering
    const filteredSubjects = subjects.filter(subject => {
        const matchesSearch =
            subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'All' || subject.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <StudentHeader />

            <main className="flex-1 container mx-auto px-6 py-8">
                {/* Filters Section */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 mb-8 flex flex-wrap items-center gap-4 transition-all hover:shadow-md">
                    <div className="flex-1 min-w-[200px]">
                        {/* Search Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="input-field pl-11 w-full py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl text-sm"
                                placeholder="Search by subject code or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Type Filter */}
                        <div className="relative group">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="input-field w-48 pl-4 pr-10 py-3 cursor-pointer bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none rounded-xl font-medium text-slate-700 text-sm hover:bg-slate-100"
                            >
                                <option value="All">All Types</option>
                                <option value="Department">Department Core</option>
                                <option value="General">General/Common</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500 group-hover:text-slate-700 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end px-1">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Your Subjects</h2>
                            <p className="text-slate-500 text-sm mt-1">
                                {user?.department?.name ? `Department of ${user.department.name}` : 'General Subjects'}
                            </p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1.5 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm">
                            {filteredSubjects.length} SUBJECTS
                        </span>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                    <th className="px-6 py-5 font-bold text-slate-600">Code</th>
                                    <th className="px-6 py-5 font-bold text-slate-600">Subject Name</th>
                                    <th className="px-6 py-5 font-bold text-slate-600">Type</th>
                                    <th className="px-6 py-5 font-bold text-slate-600">Faculty</th>
                                    <th className="px-6 py-5 font-bold text-slate-600 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-24">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-slate-500 font-medium animate-pulse">Loading subjects...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredSubjects.length > 0 ? (
                                    filteredSubjects.map((subject) => (
                                        <tr key={subject._id} className="hover:bg-blue-50/30 transition-colors group cursor-default">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 group-hover:border-blue-200 transition-colors">
                                                    {subject.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-700 text-sm group-hover:text-blue-700 transition-colors">
                                                    {subject.name}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    {subject.department?.name || 'General'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${subject.type === 'General'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}>
                                                    {subject.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {subject.facultyAssigned ? (
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:bg-white group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                                                            {subject.facultyAssigned.fullName.charAt(0)}
                                                        </div>
                                                        <span className="font-medium text-xs">{subject.facultyAssigned.fullName}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleViewSyllabus(subject)}
                                                    className="inline-flex items-center justify-center text-xs font-bold text-white bg-slate-900 group-hover:bg-blue-600 px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-24">
                                            <div className="flex flex-col items-center justify-center text-slate-400 opacity-80 hover:opacity-100 transition-opacity">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                </div>
                                                <p className="text-lg font-bold text-slate-700">No subjects found</p>
                                                <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                                                    You don't have any subjects assigned to your department yet.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentHome;
