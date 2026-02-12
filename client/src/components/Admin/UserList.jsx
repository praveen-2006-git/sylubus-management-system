import { useState, useEffect } from 'react';
import api from '../../utils/api';

const UserList = ({ refreshTrigger }) => {
    const [users, setUsers] = useState([]);
    const [isIOading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, [refreshTrigger]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/auth/admin/users');
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isIOading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin h-6 w-6 border-2 border-slate-900 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 border-dashed text-center text-slate-400">
                <p className="text-sm font-bold">No users found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Dept</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Password (Ref)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                                            {user.fullName?.charAt(0) || user.username.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{user.fullName || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide
                                        ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                            user.role === 'Faculty' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                        {user.role} {user.facultyRole && `(${user.facultyRole})`}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                    {user.department?.name || '-'}
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-400 font-mono" title="Hashed Security Token">
                                    {user.password ? user.password.substring(0, 10) + '...' : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
