import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PrivateRoute from './components/PrivateRoute';

import StudentHome from './pages/StudentHome';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import SyllabusDetails from './pages/SyllabusDetails';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen flex flex-col font-sans text-slate-100">
                    <div className="flex-grow">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="/login" element={<StudentLogin />} />
                            <Route path="/admin/login" element={<AdminLogin />} />

                            {/* Student Routes */}
                            <Route
                                path="/student/home"
                                element={
                                    <PrivateRoute roles={['Student']}>
                                        <StudentHome />
                                    </PrivateRoute>
                                }
                            />

                            {/* Faculty Routes */}
                            <Route
                                path="/faculty/dashboard"
                                element={
                                    <PrivateRoute roles={['Faculty']}>
                                        <FacultyDashboard />
                                    </PrivateRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <PrivateRoute roles={['Admin']}>
                                        <AdminDashboard />
                                    </PrivateRoute>
                                }
                            />

                            {/* Shared Protected Routes */}
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute roles={['Student', 'Faculty', 'Admin']}>
                                        <Profile />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/syllabus/:id"
                                element={
                                    <PrivateRoute roles={['Student', 'Faculty', 'Admin']}>
                                        <SyllabusDetails />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </div>

                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
