import { useRef } from 'react';
import Button from '../UI/Button';


const SyllabusForm = ({
    formData,
    handleChange,
    handleFileChange,
    handleSubmit,
    isLoading,
    editId,
    resetForm,
    file,
    departments = [] // New prop
}) => {
    return (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm sticky top-24 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                    {editId ? 'Edit Syllabus' : 'Add New Syllabus'}
                </h2>
                {editId && (
                    <button onClick={resetForm} className="text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors">Cancel</button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Subject Details</label>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <input name="subjectCode" placeholder="Code (e.g. CS101)" value={formData.subjectCode} onChange={handleChange} className="input-field rounded-xl" required />
                        <input name="subjectName" placeholder="Subject Name" value={formData.subjectName} onChange={handleChange} className="input-field rounded-xl" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <select name="department" value={formData.department} onChange={handleChange} className="input-field rounded-xl cursor-pointer" required>
                            <option value="">Select Dept</option>
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                        <input name="semester" placeholder="Sem (1-8)" value={formData.semester} onChange={handleChange} className="input-field rounded-xl" required type="number" min="1" max="8" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Upload Syllabus (PDF)</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                            {file ? (
                                <>
                                    <svg className="w-8 h-8 mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <p className="text-sm text-slate-700 font-medium truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-slate-500">Click to change</p>
                                </>
                            ) : (
                                <>
                                    <svg className="w-8 h-8 mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="text-sm text-slate-500 group-hover:text-slate-700"><span className="font-semibold text-blue-600">Click to upload</span> PDF</p>
                                    <p className="text-xs text-slate-400">PDF files only (MAX. 5MB)</p>
                                </>
                            )}
                        </div>
                        <input type="file" onChange={handleFileChange} accept="application/pdf" className="hidden" />
                    </label>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Description</label>
                    <textarea name="content" placeholder="Brief description of the syllabus outline..." value={formData.content} onChange={handleChange} className="input-field h-28 resize-none rounded-xl" required />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 ${editId ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'}`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Processing...
                        </span>
                    ) : (editId ? 'Update Syllabus' : 'Add Syllabus')}
                </Button>
            </form>
        </div>
    );
};

export default SyllabusForm;
