import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import StudentHeader from '../components/StudentHeader';

const SyllabusDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [syllabus, setSyllabus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getNftUrl = (path) => {
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        return `${baseUrl}/${path}`;
    };

    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
                const { data } = await api.get(`/subjects/${id}`);
                setSyllabus(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load syllabus details.');
            } finally {
                setLoading(false);
            }
        };
        fetchSyllabus();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <StudentHeader />
            <div className="flex-1 flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading details...</p>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <StudentHeader />
            <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Subject Not Found</h2>
                <p className="text-slate-500 mb-6">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    if (!syllabus) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <StudentHeader />

            <main className="flex-1 container mx-auto px-6 py-8 max-w-5xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </div>
                    Back to Catalog
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                    {/* Header Section */}
                    <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex flex-wrap gap-3 mb-5">
                            {syllabus.department && (
                                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {syllabus.department.name}
                                </span>
                            )}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${syllabus.type === 'General' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                {syllabus.type}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-mono font-bold border border-slate-800 shadow-sm">
                                {syllabus.code}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight">
                            {syllabus.name}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            <span className="text-slate-400">Faculty:</span> {syllabus.facultyAssigned?.fullName || 'Not Assigned'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                        {/* Content Section */}
                        <div className="lg:col-span-2 p-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 00-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                Course Outline
                            </h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                                <p className="whitespace-pre-wrap font-sans text-sm md:text-base">
                                    {syllabus.content || "No outline provided for this syllabus."}
                                </p>
                            </div>
                        </div>

                        {/* Sidebar / Actions */}
                        <div className="lg:col-span-1 p-8 bg-slate-50/30">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Resources</h3>

                            {syllabus.pdfPath ? (
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">Syllabus Document</p>
                                            <p className="text-xs text-slate-500 mt-0.5">PDF Format</p>
                                        </div>
                                    </div>
                                    <a
                                        href={getNftUrl(syllabus.pdfPath)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow"
                                    >
                                        Download / View
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center">
                                    <p className="text-sm text-slate-500 font-medium">No PDF document available.</p>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Metadata</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Last Updated</p>
                                        <p className="text-xs font-medium text-slate-600 font-mono">
                                            {new Date(syllabus.updatedAt || syllabus.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Subject ID</p>
                                        <p className="text-xs font-medium text-slate-600 font-mono truncate" title={syllabus._id}>
                                            {syllabus._id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SyllabusDetails;
