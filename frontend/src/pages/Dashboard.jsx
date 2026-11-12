import { useState, useEffect } from 'react';
import { Users, UserCheck, Building2, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config.js';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalDepartments: 0,
    totalPayroll: 0,
    attendancePercentage: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      const data = await response.json();
      if (response.ok) {
        setStats(data.data);
      } else {
        toast.error('Failed to fetch dashboard stats');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server connection failed!');
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg shadow-indigo-100">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Admin!</h1>
          <p className="text-indigo-100 text-sm mt-1">Here is the real-time overview of your company portal.</p>
        </div>
        <div className="hidden md:block bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium">
          {currentDate}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Employees */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Employees</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {loading ? '...' : stats.totalEmployees}
            </h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-center mt-1">
              <TrendingUp size={14} className="mr-1" /> Live from DB
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        {/* Active Now / Attendance */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Now</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {loading ? '...' : stats.activeEmployees}
            </h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-center mt-1">
              <UserCheck size={14} className="mr-1" /> {stats.attendancePercentage}% Attendance
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <UserCheck size={24} />
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Departments</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {loading ? '...' : stats.totalDepartments}
            </h3>
            <span className="text-xs text-slate-500 mt-1 block">Active Units</span>
          </div>
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
            <Building2 size={24} />
          </div>
        </div>

        {/* Monthly Payroll */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Monthly Payroll</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1 font-mono">
              ${loading ? '...' : stats.totalPayroll.toLocaleString()}
            </h3>
            <span className="text-xs text-indigo-600 font-semibold mt-1 block">Calculated Real-time</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

      </div>

      {/* Quick Activity / Notice Section */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-2">System Status</h3>
        <p className="text-slate-500 text-sm">
          All modules (Authentication, Employees Directory, Attendance Tracking, Departments, and Payroll) are successfully connected with MongoDB database and running in real-time.
        </p>
      </div>
    </div>
  );
}