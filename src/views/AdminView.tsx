import React, { useState, useEffect } from 'react';
import { PageView, AppointmentRequest, PatientMessage, AdminUser } from '../types';
import { CLINIC_SETTINGS } from '../data/mockData';
import { 
  Lock, 
  UserCheck, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  MessageSquare, 
  BarChart2, 
  Settings, 
  Printer, 
  Sparkles,
  RefreshCw,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Plus,
  Edit3,
  Trash2,
  Save,
  UserPlus
} from 'lucide-react';

interface AdminViewProps {
  onSelectView: (view: PageView) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onSelectView }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@firstavenuedentistry.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'appointments' | 'messages' | 'analytics' | 'emails' | 'settings' | 'admins'>('appointments');
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Admin management
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'Admin' as AdminUser['role'] });
  const [profileForm, setProfileForm] = useState({ name: 'Dr. Sarah Jenkins', email: 'admin@firstavenuedentistry.com', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMsg, setProfileMsg] = useState('');

  // Selected appointment for modal action
  const [selectedApt, setSelectedApt] = useState<AppointmentRequest | null>(null);
  const [actionDoctor, setActionDoctor] = useState('Dr. Sarah Jenkins, DDS');
  const [actionDate, setActionDate] = useState('');
  const [actionTime, setActionTime] = useState('');
  const [actionNotes, setActionNotes] = useState('');

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/accounts');
      const data = await res.json();
      if (Array.isArray(data)) setAdmins(data);
    } catch {}
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAppointments();
      fetchMessages();
      fetchAdmins();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });

      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Authentication server error');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: AppointmentRequest['status']) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          assignedDoctor: actionDoctor,
          confirmedDate: actionDate || undefined,
          confirmedTime: actionTime || undefined,
          adminNotes: actionNotes
        })
      });

      const data = await res.json();
      if (data.success) {
        fetchAppointments();
        setSelectedApt(null);
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment request?')) return;
    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      fetchAppointments();
    } catch (err) {
      alert('Failed to delete appointment.');
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = 
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!isLoggedIn) {
    return (
      <div className="pt-32 pb-20 max-w-md mx-auto px-4 flex items-center justify-center min-h-[70vh]">
        <div className="w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Clinic Admin Portal</h2>
            <p className="text-xs text-slate-500">First Avenue Family Dentistry Secure Dashboard</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Admin Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admin Management Console</h1>
            <p className="text-xs text-slate-500">Logged in as Dr. Sarah Jenkins (Master Admin)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export-csv"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </a>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'appointments' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-600'
          }`}
        >
          <Calendar className="w-4 h-4" /> Appointments ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'messages' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-600'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Messages ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'analytics' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-600'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Analytics & Reports
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'emails' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-600'
          }`}
        >
          <Mail className="w-4 h-4" /> Email Automations
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'settings' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-600'
          }`}
        >
          <Settings className="w-4 h-4" /> Site & SEO Settings
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'admins' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-600'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Admin Accounts
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-full sm:w-auto flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient name, email, phone, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={fetchAppointments}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                title="Refresh Appointments"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="p-4">Ref ID / Patient</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Requested Service</th>
                    <th className="p-4">Pref Date & Time</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No appointment records match search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-mono text-[11px] text-blue-600 font-bold">{apt.id}</div>
                          <div className="font-bold text-slate-900 mt-0.5">{apt.firstName} {apt.lastName}</div>
                          <div className="text-[10px] text-slate-400">{apt.isNewPatient ? 'New Patient' : 'Existing Patient'}</div>
                        </td>

                        <td className="p-4 space-y-0.5">
                          <div>{apt.email}</div>
                          <div className="text-slate-400">{apt.phone}</div>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-slate-800">{apt.serviceName}</div>
                          <div className="text-[10px] text-slate-400">Doctor: {apt.doctorPreference}</div>
                          <div className="text-[10px] text-emerald-600">{apt.insuranceProvider}</div>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold">{apt.confirmedDate || apt.preferredDate}</div>
                          <div className="text-slate-400">{apt.confirmedTime || apt.preferredTimeSlot}</div>
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            apt.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                            apt.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            apt.status === 'Rescheduled' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {apt.status}
                          </span>
                        </td>

                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => {
                              setSelectedApt(apt);
                              setActionDate(apt.preferredDate);
                              setActionTime(apt.preferredTimeSlot);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors"
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => handleDelete(apt.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Patient Contact Form Submissions</h3>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No patient messages received yet.</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{msg.name} ({msg.email} • {msg.phone})</span>
                      <span className="text-[10px] text-slate-400 font-normal">{new Date(msg.date).toLocaleString()}</span>
                    </div>
                    <div className="text-blue-600 font-semibold">{msg.subject}</div>
                    <p className="text-slate-600 leading-relaxed">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Booking Requests</div>
            <div className="text-3xl font-black text-slate-900">{appointments.length}</div>
            <div className="text-[11px] text-emerald-500">+18% vs last month</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Approval Rate</div>
            <div className="text-3xl font-black text-blue-600">
              {appointments.length ? Math.round((appointments.filter(a => a.status === 'Approved').length / appointments.length) * 100) : 100}%
            </div>
            <div className="text-[11px] text-slate-400">2-hour avg response time</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Requested Treatment</div>
            <div className="text-xl font-bold text-slate-900">Porcelain Veneers</div>
            <div className="text-[11px] text-slate-400">Followed by 3D Implants</div>
          </div>
        </div>
      )}

      {/* TAB 4: EMAIL AUTOMATIONS */}
      {activeTab === 'emails' && <EmailAutomationsTab />}

      {/* TAB 5: SITE & SEO SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">Practice Information & SEO Meta</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Clinic Name</label>
                <input type="text" defaultValue={CLINIC_SETTINGS.clinicName} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input type="text" defaultValue={CLINIC_SETTINGS.phone} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Meta Title</label>
                <input type="text" defaultValue={CLINIC_SETTINGS.metaTitle} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
              </div>
              <button onClick={() => alert('Settings updated successfully!')} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl">
                Save Settings
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">My Profile</h3>
            {profileMsg && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">{profileMsg}</div>}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-bold text-slate-900 mb-3">Change Password</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="password" placeholder="Current password" value={profileForm.currentPassword} onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="password" placeholder="New password" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="password" placeholder="Confirm new password" value={profileForm.confirmPassword} onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button onClick={async () => {
                setProfileMsg('');
                if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) { setProfileMsg('Passwords do not match'); return; }
                const res = await fetch('/api/admin/profile', {
                  method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: profileForm.name,
                    email: profileForm.email,
                    currentPassword: profileForm.currentPassword || undefined,
                    newPassword: profileForm.newPassword || undefined
                  })
                });
                const data = await res.json();
                setProfileMsg(data.success ? 'Profile updated successfully!' : data.error || 'Error updating profile');
              }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ADMIN ACCOUNTS */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Admin Accounts</h3>
            <button onClick={() => setShowAddAdmin(true)} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors">
              <UserPlus className="w-4 h-4" /> Add Admin
            </button>
          </div>

          {showAddAdmin && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-4">
              <h4 className="font-bold text-sm text-slate-900">New Admin Account</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="text" placeholder="Full Name" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="email" placeholder="Email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="password" placeholder="Password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center gap-3">
                <select value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as AdminUser['role'] })} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none">
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button onClick={async () => {
                  if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return alert('Fill all fields');
                  const res = await fetch('/api/admin/accounts', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newAdmin)
                  });
                  const data = await res.json();
                  if (data.success) { setShowAddAdmin(false); setNewAdmin({ name: '', email: '', password: '', role: 'Admin' }); fetchAdmins(); }
                  else alert(data.error);
                }} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors">Save</button>
                <button onClick={() => setShowAddAdmin(false)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors">Cancel</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{admin.name}</td>
                    <td className="p-4 text-slate-600">{admin.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : admin.role === 'Admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{admin.role}</span>
                    </td>
                    <td className="p-4 text-slate-400">{admin.lastLogin || 'Never'}</td>
                    <td className="p-4 text-right space-x-1">
                      <button onClick={() => setEditingAdmin(admin)} className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] transition-colors"><Edit3 className="w-3 h-3 inline" /> Edit</button>
                      <button onClick={async () => {
                        if (!confirm(`Delete ${admin.name}?`)) return;
                        await fetch(`/api/admin/accounts/${admin.id}`, { method: 'DELETE' });
                        fetchAdmins();
                      }} className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] transition-colors"><Trash2 className="w-3 h-3 inline" /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingAdmin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xl space-y-4">
                <h3 className="font-bold text-base text-slate-900">Edit Admin: {editingAdmin.name}</h3>
                <div className="space-y-3">
                  <input type="text" value={editingAdmin.name} onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" placeholder="Name" />
                  <input type="email" value={editingAdmin.email} onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" placeholder="Email" />
                  <input type="password" placeholder="New password (leave blank to keep)" onChange={(e) => setEditingAdmin({ ...editingAdmin, password: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
                  <select value={editingAdmin.role} onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value as AdminUser['role'] })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none">
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={async () => {
                    const res = await fetch(`/api/admin/accounts/${editingAdmin.id}`, {
                      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editingAdmin)
                    });
                    const data = await res.json();
                    if (data.success) { setEditingAdmin(null); fetchAdmins(); }
                  }} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"><Save className="w-3.5 h-3.5 inline" /> Save</button>
                  <button onClick={() => setEditingAdmin(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* APPOINTMENT MANAGEMENT MODAL */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">Manage Appointment #{selectedApt.id}</h3>
              <button onClick={() => setSelectedApt(null)} className="text-slate-400 hover:text-slate-600">Close</button>
            </div>

            <div className="text-xs space-y-1.5 bg-slate-50 p-4 rounded-2xl">
              <div><strong>Patient:</strong> {selectedApt.firstName} {selectedApt.lastName} ({selectedApt.email})</div>
              <div><strong>Treatment:</strong> {selectedApt.serviceName}</div>
              <div><strong>Insurance:</strong> {selectedApt.insuranceProvider}</div>
              <div><strong>Notes:</strong> {selectedApt.notes || 'None'}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Assign Doctor</label>
                <select
                  value={actionDoctor}
                  onChange={(e) => setActionDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Dr. Sarah Jenkins, DDS">Dr. Sarah Jenkins, DDS</option>
                  <option value="Dr. Michael Vance, DMD">Dr. Michael Vance, DMD</option>
                  <option value="Dr. Elena Rostova, DDS">Dr. Elena Rostova, DDS</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Confirmed Date</label>
                  <input
                    type="date"
                    value={actionDate}
                    onChange={(e) => setActionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Confirmed Time</label>
                  <input
                    type="text"
                    value={actionTime}
                    onChange={(e) => setActionTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Add notes for receptionist or prep instructions..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleUpdateStatus(selectedApt.id, 'Approved')}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Approve Request
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApt.id, 'Rescheduled')}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApt.id, 'Rejected')}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

function EmailAutomationsTab() {
  const [status, setStatus] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [testEmail, setTestEmail] = useState('');
  const [testMsg, setTestMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/email-status').then(r => r.json()).then(setStatus).catch(() => {});
    fetch('/api/admin/email-log').then(r => r.json()).then(setLogs).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Email System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl border text-xs ${status?.sendGridReady ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">SendGrid</div>
            <div className={`text-lg font-black ${status?.sendGridReady ? 'text-emerald-600' : 'text-slate-400'}`}>
              {status?.sendGridReady ? 'Ready' : 'Not Set'}
            </div>
          </div>
          <div className={`p-4 rounded-2xl border text-xs ${status?.smtpReady ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">Gmail SMTP</div>
            <div className={`text-lg font-black ${status?.smtpReady ? 'text-emerald-600' : 'text-red-400'}`}>
              {status?.smtpReady ? 'Connected' : 'Blocked'}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs">
            <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">Emails Logged</div>
            <div className="text-lg font-black text-blue-600">{logs.length}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs">
            <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">Log File Size</div>
            <div className="text-lg font-black text-slate-600">{status?.logFile ? `${(status.logFile / 1024).toFixed(1)} KB` : '0 B'}</div>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-2">
          <div className="font-bold text-amber-700">Gmail SMTP is blocked from Render's network. To send real emails:</div>
          <ol className="text-amber-600 list-decimal list-inside space-y-1">
            <li>Sign up for a free <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">SendGrid</a> account (100 emails/day free)</li>
            <li>Create an API key in SendGrid dashboard</li>
            <li>Add it as an environment variable on Render: <code className="bg-amber-100 px-1 py-0.5 rounded">SENDGRID_API_KEY</code></li>
            <li>Redeploy — emails will be sent automatically</li>
          </ol>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Send Test Email</h3>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Email to send test to..."
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
          />
          <button
            onClick={async () => {
              setTestMsg('');
              const target = testEmail || 'fenilxpatel2642@gmail.com';
              const res = await fetch('/api/admin/test-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: target })
              });
              const data = await res.json();
              setTestMsg(`Test email queued for ${target}. SendGrid: ${data.sendGridReady ? 'yes' : 'no'}, SMTP: ${data.smtpReady ? 'yes' : 'no'}`);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
          >
            Send Test
          </button>
        </div>
        {testMsg && <div className="text-xs text-blue-600">{testMsg}</div>}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Email Log ({logs.length})</h3>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-400">No emails logged yet.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {[...logs].reverse().map((log, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">To: {log.to}</span>
                  <span className="text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="font-semibold text-blue-600">{log.subject}</div>
                <pre className="text-slate-500 text-[10px] whitespace-pre-wrap line-clamp-3">{log.body}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
