import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../../utils/constants';

const SyllabusTable = ({
    syllabi,
    handleEdit,
    handleDelete,
    isFetching,
    search,
    setSearch,
    department,
    setDepartment
}) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            {/* Search Bar / Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-left w-full sm:w-auto">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Library Catalog</h2>
                    <p className="text-xs text-slate-500 font-medium">Manage existing syllabi</p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto items-center">
                    <div className="relative flex-grow sm:w-64 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            className="input-field pl-10 rounded-xl text-sm py-2.5"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="input-field w-auto cursor-pointer rounded-xl text-sm py-2.5 font-medium text-slate-600"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    >
                        <option value="">All Depts</option>
                        {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                            <th className="px-6 py-4 font-bold text-slate-600 w-24">Code</th>
                            <th className="px-6 py-4 font-bold text-slate-600">Subject Name</th>
                            <th className="px-6 py-4 font-bold text-slate-600 w-24">Dept</th>
                            <th className="px-6 py-4 font-bold text-slate-600 w-20">Sem</th>
                            <th className="px-6 py-4 font-bold text-slate-600 w-44 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isFetching ? (
                            <tr>
                                <td colSpan="5" className="text-center py-16">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-slate-500 font-medium animate-pulse text-sm">Loading library...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : syllabi.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-16">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        </div>
                                        <p className="text-sm font-bold text-slate-600">No syllabi found</p>
                                        <p className="text-xs text-slate-400 mt-1">Add a new syllabus to get started.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            syllabi.map((syllabus) => (
                                <tr key={syllabus._id} className="hover:bg-blue-50/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{syllabus.subjectCode}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                            {syllabus.subjectName}
                                            {syllabus.pdfPath && (
                                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] rounded border border-green-100 font-bold uppercase tracking-wider">
                                                    PDF
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-500 shadow-sm uppercase tracking-wide">
                                            {syllabus.type === 'General' ? 'General' : (syllabus.department?.name || syllabus.department || 'N/A')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-slate-400 bg-slate-50 w-6 h-6 flex items-center justify-center rounded-full">
                                            {syllabus.semester}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => navigate(`/syllabus/${syllabus._id}`)}
                                                className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-all"
                                                title="View"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => handleEdit(syllabus)}
                                                className="text-slate-500 hover:text-orange-600 hover:bg-orange-50 p-1.5 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(syllabus._id)}
                                                className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SyllabusTable;
