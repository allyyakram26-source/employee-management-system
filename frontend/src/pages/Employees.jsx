import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config.js';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Edit mode track karne ke liye states
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    status: 'Active'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      if (response.ok) {
        setEmployees(data.data);
      } else {
        toast.error('Failed to fetch employees');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server connection failed!');
    }
  };

  // Modal kholne ka function (Add ya Edit ke liye)
  const handleOpenModal = (employee = null) => {
    if (employee) {
      // Agar employee pass hua hai toh Edit mode hai
      setEditingId(employee._id);
      setFormData({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        status: employee.status
      });
    } else {
      // Agar kuch pass nahi hua toh Add mode hai
      setEditingId(null);
      setFormData({ name: '', email: '', role: '', department: 'Engineering', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  // Handle Add or Update Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${API_BASE_URL}/employees/${editingId}`
        : `${API_BASE_URL}/employees`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (editingId) {
          // List me updated employee ko replace karna
          setEmployees(employees.map(emp => emp._id === editingId ? data.data : emp));
          toast.success('Employee updated successfully!');
        } else {
          // Naya employee list ke shuru me add karna
          setEmployees([data.data, ...employees]);
          toast.success('Employee added successfully!');
        }
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', email: '', role: '', department: 'Engineering', status: 'Active' });
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server connection failed!');
    }
  };

  // Delete Employee Function
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEmployees(employees.filter(emp => emp._id !== id));
        toast.success('Employee deleted successfully!');
      } else {
        toast.error('Failed to delete employee');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server connection failed!');
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employees Directory</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your company employees, roles, and statuses.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-lg shadow-indigo-200 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, role, or department..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-xs"
        />
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-100">
                <th className="py-4 px-6 font-semibold">Employee Name</th>
                <th className="py-4 px-6 font-semibold">Role & Title</th>
                <th className="py-4 px-6 font-semibold">Department</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {emp.name ? emp.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{emp.name}</p>
                        <p className="text-slate-400 text-xs">{emp.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">{emp.role}</td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-medium">
                        {emp.department}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1">
                      {/* Edit Button */}
                      <button 
                        onClick={() => handleOpenModal(emp)}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        title="Edit Employee"
                      >
                        <Edit size={16} />
                      </button>
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(emp._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Employee Details' : 'Add New Employee'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Usman Ali"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="usman@company.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  placeholder="e.g. Frontend Developer"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition text-sm cursor-pointer"
                >
                  {editingId ? 'Update Employee' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}