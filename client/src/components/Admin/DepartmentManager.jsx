import { useState } from 'react';
import api from '../../utils/api';

const DepartmentManager = ({ departments, fetchDepartments }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await api.post('/departments', { name, description });
            setMessage({ type: 'success', text: 'Department added successfully!' });
            setName('');
            setDescription('');
            fetchDepartments();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add department' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This might affect users and subjects linked to this department.')) {
            try {
                await api.delete(`/departments/${id}`);
                fetchDepartments();
            } catch (error) {
                alert('Failed to delete department');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Manage Departments</h3>

            {/* Add Department Form */}
            <form onSubmit={handleSubmit} className="mb-8 flex gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex-grow">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-700 h-10"
                        placeholder="e.g. Computer Science"
                    />
                </div>
                <div className="flex-grow">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description (Optional)</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-700 h-10"
                        placeholder="Short description"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg h-10 shadow-sm active:scale-95 transition-all"
                >
                    {loading ? 'Adding...' : 'Add Dept'}
                </button>
            </form>

            {message && (
                <div className={`p-3 mb-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {message.text}
                </div>
            )}

            {/* Departments List */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.length > 0 ? (
                            departments.map((dept) => (
                                <tr key={dept._id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3 font-bold text-slate-800">{dept.name}</td>
                                    <td className="px-4 py-3">{dept.description || '-'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleDelete(dept._id)}
                                            className="text-red-600 hover:text-red-800 font-bold text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-4 py-8 text-center text-slate-400 font-medium">
                                    No departments found. Add one above.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DepartmentManager;
