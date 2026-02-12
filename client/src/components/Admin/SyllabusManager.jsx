import { useState, useEffect } from 'react';
import api from '../../utils/api';
import SyllabusForm from './SyllabusForm';
import SyllabusTable from './SyllabusTable';
import Toast from '../UI/Toast';

const SyllabusManager = ({ departments }) => {
    const [syllabi, setSyllabi] = useState([]);
    const [formData, setFormData] = useState({
        department: '',
        semester: '',
        subjectName: '',
        subjectCode: '',
        content: ''
    });
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [file, setFile] = useState(null);
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        fetchSyllabi();
    }, [search, departmentFilter]);

    const fetchSyllabi = async () => {
        setIsFetching(true);
        try {
            // Updated Endpoint to /subjects
            const { data } = await api.get('/subjects', {
                params: { search, department: departmentFilter }
            });
            // We need to map new Subject schema to old component expectations if they differ?
            // User schema: name, code. Component: subjectName, subjectCode.
            // I should double check what logic getSubjects returns vs what frontend expects.
            // Frontend: subjectName, subjectCode. Backend `Subject`: name, code.
            // I should map them or update components. 
            // Better to standardise on New Schema. 
            // I will Map for now to be safe with existing Table/Form, OR update Table/Form as well.
            // Updating Table/Form is better but more work. 
            // I'll map the data here to match the old frontend structure.
            // Old: subjectName, subjectCode. New: name, code.
            const mappedData = data.map(s => ({
                ...s,
                subjectName: s.name,
                subjectCode: s.code,
                department: s.department // Keep populated object for display
            }));
            setSyllabi(mappedData);
        } catch (error) {
            console.error(error);
            setToast({ message: 'Failed to fetch subjects', type: 'error' });
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = new FormData();
        data.append('department', formData.department);
        data.append('semester', formData.semester);
        // Map back to new schema
        data.append('name', formData.subjectName);
        data.append('code', formData.subjectCode);
        data.append('content', formData.content);
        // Default type: If department is distinct/General logic needed?
        // backend handles type if passed? 
        // For now, we defaulting to Department as per original code.
        // But wait, if user selects a department, it's a Department subject.
        // We need to handle 'General' type creation?
        // User didn't ask for that. Leaving as is.
        data.append('type', 'Department');

        if (file) {
            data.append('pdf', file);
        }

        try {
            if (editId) {
                await api.put(`/subjects/${editId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setToast({ message: 'Subject updated successfully!', type: 'success' });
            } else {
                await api.post('/subjects', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setToast({ message: 'Subject added successfully!', type: 'success' });
            }
            fetchSyllabi();
            resetForm();
        } catch (error) {
            console.error(error);
            setToast({ message: error.response?.data?.message || 'Operation failed', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ department: '', semester: '', subjectName: '', subjectCode: '', content: '' });
        setFile(null);
        setEditId(null);
    };

    const handleEdit = (syllabus) => {
        setFormData({
            department: syllabus.department?._id || syllabus.department, // Extract ID if object
            semester: syllabus.semester,
            subjectName: syllabus.subjectName,
            subjectCode: syllabus.subjectCode,
            content: syllabus.content
        });
        setEditId(syllabus._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await api.delete(`/subjects/${id}`);
                setToast({ message: 'Subject deleted successfully', type: 'success' });
                fetchSyllabi();
            } catch (error) {
                console.error(error);
                setToast({ message: 'Failed to delete subject', type: 'error' });
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
                <SyllabusForm
                    formData={formData}
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    editId={editId}
                    resetForm={resetForm}
                    file={file}
                    departments={departments}
                />
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
                <SyllabusTable
                    syllabi={syllabi}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    isFetching={isFetching}
                    search={search}
                    setSearch={setSearch}
                    department={departmentFilter}
                    setDepartment={setDepartmentFilter}
                />
            </div>
            <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
        </div>
    );
};

export default SyllabusManager;
