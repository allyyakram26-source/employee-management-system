import { useState, useEffect } from 'react';
import { Building2, Users, Shield, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config.js';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Icon mapping helper function
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'Shield': return Shield;
      case 'Building2': return Building2;
      default: return Briefcase;
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      const data = await response.json();
      if (response.ok) {
        setDepartments(data.data);
      } else {
        toast.error('Failed to fetch departments');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server connection failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of company departments and team members.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading departments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const IconComp = getIconComponent(dept.icon);
            return (
              <div key={dept._id} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dept.color}`}>
                    <IconComp size={24} />
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {dept.count} Members
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{dept.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Lead: <span className="font-semibold text-slate-700">{dept.head}</span></p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}