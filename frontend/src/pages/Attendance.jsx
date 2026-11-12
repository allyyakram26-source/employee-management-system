import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config.js';

export default function Attendance() {
  const todayDate = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Attendance whenever selectedDate changes
  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const fetchAttendance = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/attendance?date=${date}`);
      const data = await response.json();
      if (response.ok) {
        setAttendanceList(data.data);
      } else {
        toast.error('Failed to fetch attendance');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server connection failed!');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Status Function (Backend API call)
  const toggleStatus = async (id, currentStatus) => {
    let nextStatus = 'Present';
    let nextTime = '09:00 AM';

    if (currentStatus === 'Present') {
      nextStatus = 'Late';
      nextTime = '10:30 AM';
    } else if (currentStatus === 'Late') {
      nextStatus = 'Absent';
      nextTime = '-';
    } else {
      nextStatus = 'Present';
      nextTime = '09:00 AM';
    }

    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus, time: nextTime }),
      });

      const data = await response.json();
      if (response.ok) {
        setAttendanceList(attendanceList.map(emp => 
          emp._id === id ? data.data : emp
        ));
        toast.success('Attendance updated!');
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server connection failed!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Date Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance Tracking</h1>
          <p className="text-slate-500 text-sm mt-1">Select a date to check or update employee attendance.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
          <CalendarIcon size={18} className="text-indigo-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent focus:outline-none text-slate-700 font-semibold text-sm cursor-pointer"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <span className="font-semibold text-slate-700 text-sm">
            Showing records for: <span className="text-indigo-600 font-mono">{selectedDate}</span>
          </span>
          <span className="text-xs text-slate-400">Total Employees: {attendanceList.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-100">
                <th className="py-4 px-6 font-semibold">Employee Name</th>
                <th className="py-4 px-6 font-semibold">Designation</th>
                <th className="py-4 px-6 font-semibold">Check-in Time</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Action / Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">Loading attendance...</td>
                </tr>
              ) : attendanceList.length > 0 ? (
                attendanceList.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-slate-800">{emp.name}</td>
                    <td className="py-4 px-6 text-slate-500">{emp.role}</td>
                    <td className="py-4 px-6 font-mono text-xs">{emp.time}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                        emp.status === 'Late' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {emp.status === 'Present' && <CheckCircle2 size={14} />}
                        {emp.status === 'Late' && <Clock size={14} />}
                        {emp.status === 'Absent' && <XCircle size={14} />}
                        <span>{emp.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => toggleStatus(emp._id, emp.status)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium rounded-lg transition text-xs cursor-pointer"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    No employees found in the directory to track attendance.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}