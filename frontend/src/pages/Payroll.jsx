import { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, Clock, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Payroll() {
  const [payrollList, setPayrollList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]); // Real employees dropdown ke liye
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    role: '',
    baseSalary: '',
    bonus: '',
    deductions: '',
    status: 'Pending',
    month: 'November 2026'
  });

  useEffect(() => {
    fetchPayroll();
    fetchEmployees();
  }, []);

  // 1. Fetch Payroll Records
  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/payroll');
      const data = await response.json();
      if (response.ok) {
        setPayrollList(data.data);
      } else {
        toast.error('Failed to fetch payroll data');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server connection failed!');
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Real Employees for Dropdown
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees');
      const data = await response.json();
      if (response.ok) {
        setEmployeesList(data.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  // Handle Employee Selection from Dropdown
  const handleEmployeeSelect = (e) => {
    const selectedEmpId = e.target.value;
    const emp = employeesList.find(item => item._id === selectedEmpId);
    if (emp) {
      setFormData({
        ...formData,
        employeeId: emp._id,
        name: emp.name,
        role: emp.role
      });
    } else {
      setFormData({ ...formData, employeeId: '', name: '', role: '' });
    }
  };

  const calculateNet = (base, bonus, deductions) => {
    return Number(base) + Number(bonus) - Number(deductions);
  };

  const handleAddPayroll = async (e) => {
    e.preventDefault();
    if (!formData.employeeId) {
      toast.error('Please select a valid employee!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setPayrollList([data.data, ...payrollList]);
        setIsModalOpen(false);
        setFormData({ employeeId: '', name: '', role: '', baseSalary: '', bonus: '', deductions: '', status: 'Pending', month: 'November 2026' });
        toast.success('Real-time payroll record added!');
      } else {
        toast.error(data.error || 'Failed to add payroll');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server connection failed!');
    }
  };

  const togglePaymentStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    try {
      const response = await fetch(`http://localhost:5000/api/payroll/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        setPayrollList(payrollList.map(item => 
          item._id === id ? data.data : item
        ));
        toast.success('Payment status updated!');
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
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Salary & Payroll Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage real-time employee salaries, bonuses, and deductions.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-lg shadow-indigo-200 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add Payroll Record</span>
        </button>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-100">
                <th className="py-4 px-6 font-semibold">Employee</th>
                <th className="py-4 px-6 font-semibold">Base Salary</th>
                <th className="py-4 px-6 font-semibold">Bonus</th>
                <th className="py-4 px-6 font-semibold">Deductions</th>
                <th className="py-4 px-6 font-semibold">Net Salary</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">Loading payroll records...</td>
                </tr>
              ) : payrollList.length > 0 ? (
                payrollList.map((item) => {
                  const netSalary = calculateNet(item.baseSalary, item.bonus, item.deductions);
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <p className="text-slate-400 text-xs">{item.role}</p>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-600">${item.baseSalary}</td>
                      <td className="py-4 px-6 font-mono text-emerald-600">+${item.bonus}</td>
                      <td className="py-4 px-6 font-mono text-rose-600">-${item.deductions}</td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">${netSalary}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.status === 'Paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => togglePaymentStatus(item._id, item.status)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium rounded-lg transition text-xs cursor-pointer"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">No payroll records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payroll Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add Real-Time Payroll</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPayroll} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Registered Employee</label>
                <select
                  required
                  value={formData.employeeId}
                  onChange={handleEmployeeSelect}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  <option value="">-- Choose Employee from DB --</option>
                  {employeesList.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Base ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({...formData, baseSalary: e.target.value})}
                    placeholder="1000"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bonus ($)</label>
                  <input
                    type="number"
                    value={formData.bonus}
                    onChange={(e) => setFormData({...formData, bonus: e.target.value})}
                    placeholder="100"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deduct ($)</label>
                  <input
                    type="number"
                    value={formData.deductions}
                    onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                    placeholder="20"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition text-sm cursor-pointer"
                >
                  Save Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}