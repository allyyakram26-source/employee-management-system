import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Departments from './pages/Departments';
import Payroll from './pages/Payroll';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { LayoutDashboard, Users, CalendarCheck, Building, DollarSign, LogOut } from 'lucide-react';

function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-black tracking-wider text-indigo-400">EMS PORTAL</h2>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link to="/" className="flex items-center space-x-3 py-3 px-4 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/employees" className="flex items-center space-x-3 py-3 px-4 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition font-medium">
            <Users size={20} />
            <span>Employees</span>
          </Link>
          <Link to="/attendance" className="flex items-center space-x-3 py-3 px-4 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition font-medium">
            <CalendarCheck size={20} />
            <span>Attendance</span>
          </Link>
          <Link to="/departments" className="flex items-center space-x-3 py-3 px-4 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition font-medium">
            <Building size={20} />
            <span>Departments</span>
          </Link>
          <Link to="/payroll" className="flex items-center space-x-3 py-3 px-4 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition font-medium">
            <DollarSign size={20} />
            <span>Payroll</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link to="/login" className="flex items-center space-x-3 py-2.5 px-4 rounded-xl text-rose-400 hover:bg-slate-800 transition font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex justify-between items-center shadow-xs">
          <h1 className="text-lg font-bold text-slate-800">Management Dashboard</h1>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center font-bold justify-center text-sm">
              AA
            </div>
            <span className="text-sm font-semibold text-slate-700">Ali Akram</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/payroll" element={<Payroll />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}