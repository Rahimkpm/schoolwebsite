import React, { useState, useEffect } from 'react';
import {
  SchoolSettings,
  Notice,
  AdmissionEnquiry,
  AcademicStage,
  Facility,
  GalleryItem,
  AuditLog
} from '../types/index.ts';
import {
  Shield,
  X,
  LogOut,
  Users,
  Bell,
  Image as ImageIcon,
  Settings,
  Building,
  GraduationCap,
  History,
  Lock,
  Plus,
  Trash2,
  Edit,
  Save,
  Download,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
  initialSettings: SchoolSettings;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onRefreshData,
  initialSettings
}) => {
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('school_admin_token'));
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'enquiries' | 'notices' | 'gallery' | 'facilities' | 'academics' | 'settings' | 'audit' | 'security'
  >('overview');

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [academics, setAcademics] = useState<AcademicStage[]>([]);
  const [settingsForm, setSettingsForm] = useState<SchoolSettings>(initialSettings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Enquiries filter & search
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all');

  // Notice Form State
  const [editingNotice, setEditingNotice] = useState<Partial<Notice> | null>(null);

  // Gallery Form State
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    category: 'Classroom',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    description: ''
  });

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch admin data on tab change or token set
  useEffect(() => {
    if (token && isOpen) {
      loadAllAdminData();
    }
  }, [token, isOpen]);

  const loadAllAdminData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [resStats, resEnq, resNot, resGal, resFac, resAcad, resLogs] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/enquiries', { headers }),
        fetch('/api/notices', { headers }),
        fetch('/api/gallery', { headers }),
        fetch('/api/facilities', { headers }),
        fetch('/api/academics', { headers }),
        fetch('/api/admin/audit-logs', { headers })
      ]);

      if (resStats.ok) setStats(await resStats.json());
      if (resEnq.ok) setEnquiries(await resEnq.json());
      if (resNot.ok) setNotices(await resNot.json());
      if (resGal.ok) setGallery(await resGal.json());
      if (resFac.ok) setFacilities(await resFac.json());
      if (resAcad.ok) setAcademics(await resAcad.json());
      if (resLogs.ok) setAuditLogs(await resLogs.json());
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setToken(data.token);
      localStorage.setItem('school_admin_token', data.token);
      setLoginPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        // ignore
      }
    }
    setToken(null);
    localStorage.removeItem('school_admin_token');
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Enquiries Operations
  const handleUpdateEnquiryStatus = async (id: string, status: string, notes?: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, ...(notes !== undefined ? { notes } : {}) })
      });
      if (res.ok) {
        showFeedback('success', 'Enquiry status updated.');
        loadAllAdminData();
      }
    } catch (err) {
      showFeedback('error', 'Failed to update enquiry.');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showFeedback('success', 'Enquiry deleted.');
        loadAllAdminData();
      }
    } catch (err) {
      showFeedback('error', 'Failed to delete enquiry.');
    }
  };

  const exportEnquiriesToCSV = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export.');
      return;
    }
    const headers = ['ID', 'Date', 'Parent Name', 'Student Name', 'Applying Class', 'Phone', 'Email', 'Status', 'Notes', 'Message'];
    const rows = enquiries.map((e) => [
      e.id,
      new Date(e.createdAt).toLocaleDateString(),
      `"${e.parentName.replace(/"/g, '""')}"`,
      `"${e.studentName.replace(/"/g, '""')}"`,
      `"${e.applyingClass}"`,
      `"${e.phone}"`,
      `"${e.email || ''}"`,
      e.status,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ideal_School_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Notices Operations
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingNotice || !editingNotice.title || !editingNotice.category) return;

    try {
      const isNew = !editingNotice.id;
      const url = isNew ? '/api/admin/notices' : `/api/admin/notices/${editingNotice.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingNotice)
      });

      if (res.ok) {
        showFeedback('success', isNew ? 'Notice published.' : 'Notice updated.');
        setEditingNotice(null);
        loadAllAdminData();
        onRefreshData();
      } else {
        showFeedback('error', 'Failed to save notice.');
      }
    } catch (err) {
      showFeedback('error', 'Error occurred saving notice.');
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!token || !window.confirm('Delete this circular notice?')) return;
    try {
      const res = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showFeedback('success', 'Notice deleted.');
        loadAllAdminData();
        onRefreshData();
      }
    } catch (err) {
      showFeedback('error', 'Failed to delete notice.');
    }
  };

  // Gallery Operations
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newGalleryItem.title || !newGalleryItem.imageUrl) return;

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newGalleryItem)
      });
      if (res.ok) {
        showFeedback('success', 'Photo added to gallery.');
        setNewGalleryItem({
          title: '',
          category: 'Classroom',
          date: new Date().toISOString().split('T')[0],
          imageUrl: '',
          description: ''
        });
        loadAllAdminData();
        onRefreshData();
      }
    } catch (err) {
      showFeedback('error', 'Failed to add gallery photo.');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!token || !window.confirm('Delete this photo?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showFeedback('success', 'Gallery item deleted.');
        loadAllAdminData();
        onRefreshData();
      }
    } catch (err) {
      showFeedback('error', 'Failed to delete gallery item.');
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        showFeedback('success', 'School settings updated successfully.');
        onRefreshData();
      }
    } catch (err) {
      showFeedback('error', 'Failed to update settings.');
    }
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) {
      showFeedback('error', 'New passwords do not match.');
      return;
    }
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', 'Password successfully changed.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showFeedback('error', data.error || 'Failed to update password.');
      }
    } catch (err) {
      showFeedback('error', 'Error changing password.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-[#064E3B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 rounded-lg">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg leading-tight">
                School Staff & CMS Administration
              </h2>
              <p className="text-xs text-emerald-200">
                Ideal Global Islamic English Medium School, Kamalapuram
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-xs text-white rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Global Feedback Alert */}
        {feedback && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between ${
              feedback.type === 'success' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
            }`}
          >
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Not Authenticated: Login Screen */}
        {!token ? (
          <div className="p-8 sm:p-12 flex-1 flex items-center justify-center bg-[#FAF8F5]">
            <div className="max-w-md w-full bg-white p-8 rounded-xl border border-stone-200 shadow-md">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-emerald-50 text-[#064E3B] rounded-full mx-auto flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Staff Authentication
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter authorized administrator credentials to manage website notices, enquiries, and settings.
                </p>
              </div>

              {loginError && (
                <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Default: <code className="bg-stone-100 px-1 py-0.5 rounded text-slate-700">admin</code> / <code className="bg-stone-100 px-1 py-0.5 rounded text-slate-700">ideal2026</code>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 px-4 bg-[#064E3B] hover:bg-[#065F46] text-white font-semibold text-sm rounded-md transition-colors cursor-pointer disabled:opacity-70"
                >
                  {loginLoading ? 'Verifying...' : 'Sign In to Admin Portal'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Workspace */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-stone-50">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-white border-r border-stone-200 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              {[
                { id: 'overview', label: 'Overview', icon: Building },
                { id: 'enquiries', label: 'Admissions', count: enquiries.filter((e) => e.status === 'pending').length, icon: Users },
                { id: 'notices', label: 'Notices & Circulars', count: notices.length, icon: Bell },
                { id: 'gallery', label: 'Gallery Photos', count: gallery.length, icon: ImageIcon },
                { id: 'facilities', label: 'Facilities', count: facilities.length, icon: Building },
                { id: 'academics', label: 'Academics', icon: GraduationCap },
                { id: 'settings', label: 'Site Settings', icon: Settings },
                { id: 'audit', label: 'Audit Logs', icon: History },
                { id: 'security', label: 'Security', icon: Lock }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-emerald-100/70 text-[#064E3B]'
                        : 'text-slate-600 hover:bg-stone-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${isActive ? 'bg-[#064E3B] text-white' : 'bg-stone-200 text-slate-700'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="hidden md:block mt-auto pt-4 border-t border-stone-200">
                <button
                  onClick={loadAllAdminData}
                  className="w-full px-3 py-2 text-xs text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-stone-50/50">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Administrative Overview
                    </h3>
                    <p className="text-xs text-slate-500">
                      Live metrics and recent school administrative records.
                    </p>
                  </div>

                  {/* Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-stone-200">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                        Pending Enquiries
                      </span>
                      <span className="text-2xl font-bold text-amber-600 mt-1 block">
                        {stats?.pendingEnquiries ?? 0}
                      </span>
                      <span className="text-[11px] text-slate-400">Needs parent contact</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-stone-200">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                        Total Enquiries
                      </span>
                      <span className="text-2xl font-bold text-slate-900 mt-1 block">
                        {stats?.totalEnquiries ?? 0}
                      </span>
                      <span className="text-[11px] text-slate-400">Admissions 2026–27</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-stone-200">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                        Active Notices
                      </span>
                      <span className="text-2xl font-bold text-[#064E3B] mt-1 block">
                        {stats?.publishedNotices ?? 0}
                      </span>
                      <span className="text-[11px] text-slate-400">Published circulars</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-stone-200">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                        Gallery Media
                      </span>
                      <span className="text-2xl font-bold text-slate-900 mt-1 block">
                        {stats?.totalGallery ?? 0}
                      </span>
                      <span className="text-[11px] text-slate-400">Photos displayed</span>
                    </div>
                  </div>

                  {/* Latest Enquiries Preview */}
                  <div className="bg-white p-6 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display font-bold text-base text-slate-900">
                        Latest Admission Enquiries
                      </h4>
                      <button
                        onClick={() => setActiveTab('enquiries')}
                        className="text-xs text-[#064E3B] font-semibold hover:underline cursor-pointer"
                      >
                        View all enquiries →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 text-slate-400 uppercase tracking-wider">
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Student</th>
                            <th className="pb-2">Class</th>
                            <th className="pb-2">Parent / Phone</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {enquiries.slice(0, 5).map((e) => (
                            <tr key={e.id} className="hover:bg-stone-50">
                              <td className="py-2.5 text-slate-500">
                                {new Date(e.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-2.5 font-semibold text-slate-800">{e.studentName}</td>
                              <td className="py-2.5 text-[#064E3B] font-medium">{e.applyingClass}</td>
                              <td className="py-2.5 text-slate-600">
                                {e.parentName} · {e.phone}
                              </td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  e.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : e.status === 'contacted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {e.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ENQUIRIES */}
              {activeTab === 'enquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        Admission Enquiries ({enquiries.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Review, update statuses, and add staff consultation notes.
                      </p>
                    </div>

                    <button
                      onClick={exportEnquiriesToCSV}
                      className="px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-slate-700 text-xs font-semibold rounded-md flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Download className="w-4 h-4 text-[#064E3B]" />
                      <span>Export to CSV</span>
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search student, parent, phone..."
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-[#064E3B]"
                      />
                    </div>

                    <select
                      value={enquiryStatusFilter}
                      onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-stone-300 rounded-md"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="admitted">Admitted</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Enquiries Table */}
                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 border-b border-stone-200 text-slate-500 uppercase tracking-wider">
                          <tr>
                            <th className="p-3">Student & Class</th>
                            <th className="p-3">Parent & Contact</th>
                            <th className="p-3">Message / Notes</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {enquiries
                            .filter((e) => {
                              const matchSearch =
                                e.studentName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                                e.parentName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                                e.phone.includes(enquirySearch);
                              const matchStatus =
                                enquiryStatusFilter === 'all' || e.status === enquiryStatusFilter;
                              return matchSearch && matchStatus;
                            })
                            .map((e) => (
                              <tr key={e.id} className="hover:bg-stone-50/70">
                                <td className="p-3">
                                  <div className="font-semibold text-slate-900">{e.studentName}</div>
                                  <div className="text-[11px] text-[#064E3B] font-medium">{e.applyingClass}</div>
                                  <div className="text-[10px] text-slate-400">
                                    {new Date(e.createdAt).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="text-slate-800 font-medium">{e.parentName}</div>
                                  <a href={`tel:${e.phone}`} className="text-emerald-700 hover:underline block">
                                    {e.phone}
                                  </a>
                                  {e.email && <div className="text-slate-400 text-[11px]">{e.email}</div>}
                                </td>
                                <td className="p-3 max-w-xs">
                                  {e.message && <p className="text-slate-600 italic mb-1">"{e.message}"</p>}
                                  <div className="flex items-center gap-1 mt-1">
                                    <input
                                      type="text"
                                      defaultValue={e.notes || ''}
                                      placeholder="Add staff note..."
                                      onBlur={(ev) => handleUpdateEnquiryStatus(e.id, e.status, ev.target.value)}
                                      className="text-[11px] px-2 py-1 bg-stone-50 border border-stone-200 rounded w-full"
                                    />
                                  </div>
                                </td>
                                <td className="p-3">
                                  <select
                                    value={e.status}
                                    onChange={(ev) => handleUpdateEnquiryStatus(e.id, ev.target.value)}
                                    className="text-[11px] font-semibold px-2 py-1 rounded border border-stone-300 bg-white"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="admitted">Admitted</option>
                                    <option value="archived">Archived</option>
                                  </select>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => handleDeleteEnquiry(e.id)}
                                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NOTICES */}
              {activeTab === 'notices' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        Notices & Circulars ({notices.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Publish, update, or remove school circulars.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setEditingNotice({
                          title: '',
                          category: 'Circular',
                          date: new Date().toISOString().split('T')[0],
                          description: '',
                          isPinned: false,
                          isPublished: true
                        })
                      }
                      className="px-3.5 py-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Notice</span>
                    </button>
                  </div>

                  {/* Create / Edit Form Modal / Inline Box */}
                  {editingNotice && (
                    <form onSubmit={handleSaveNotice} className="p-6 bg-white rounded-xl border border-stone-300 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                        <h4 className="font-display font-bold text-base text-slate-900">
                          {editingNotice.id ? 'Edit Notice Circular' : 'Create New Notice Circular'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingNotice(null)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Circular Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Schedule for First Term Assessment"
                            value={editingNotice.title || ''}
                            onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#064E3B]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Category *
                          </label>
                          <select
                            value={editingNotice.category || 'Circular'}
                            onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value as any })}
                            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                          >
                            <option value="Admission">Admission</option>
                            <option value="Examination">Examination</option>
                            <option value="Event">Event</option>
                            <option value="Circular">Circular</option>
                            <option value="Holiday">Holiday</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={editingNotice.date || ''}
                            onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                          <input
                            type="checkbox"
                            id="pinNotice"
                            checked={Boolean(editingNotice.isPinned)}
                            onChange={(e) => setEditingNotice({ ...editingNotice, isPinned: e.target.checked })}
                            className="rounded text-[#064E3B]"
                          />
                          <label htmlFor="pinNotice" className="text-xs font-medium text-slate-700 cursor-pointer">
                            Pin notice at top
                          </label>
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                          <input
                            type="checkbox"
                            id="pubNotice"
                            checked={Boolean(editingNotice.isPublished)}
                            onChange={(e) => setEditingNotice({ ...editingNotice, isPublished: e.target.checked })}
                            className="rounded text-[#064E3B]"
                          />
                          <label htmlFor="pubNotice" className="text-xs font-medium text-slate-700 cursor-pointer">
                            Published to public website
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Notice Description & Details *
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Provide the complete circular announcement text..."
                          value={editingNotice.description || ''}
                          onChange={(e) => setEditingNotice({ ...editingNotice, description: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingNotice(null)}
                          className="px-4 py-2 text-xs text-slate-700 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-[#065F46] rounded cursor-pointer"
                        >
                          Save Notice
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Notices */}
                  <div className="space-y-3">
                    {notices.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 bg-white rounded-xl border border-stone-200 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {n.category}
                            </span>
                            {n.isPinned && (
                              <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Pinned
                              </span>
                            )}
                            <span className="text-xs text-slate-400">{n.date}</span>
                            {!n.isPublished && (
                              <span className="text-[10px] font-bold uppercase text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                                Draft (Unpublished)
                              </span>
                            )}
                          </div>
                          <h4 className="font-display font-bold text-sm text-slate-900">{n.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-2">{n.description}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingNotice(n)}
                            className="p-1.5 text-stone-500 hover:text-[#064E3B] cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(n.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Manage Gallery Photos ({gallery.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add, update, or remove school activity photographs.
                    </p>
                  </div>

                  {/* Add Photo Form */}
                  <form onSubmit={handleAddGalleryItem} className="p-5 bg-white rounded-xl border border-stone-200 space-y-4">
                    <h4 className="font-display font-bold text-sm text-slate-900">Add New Photo to Gallery</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Science Day Demonstration"
                          value={newGalleryItem.title}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                        <select
                          value={newGalleryItem.category}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                        >
                          <option value="Classroom">Classroom</option>
                          <option value="Academic">Academic</option>
                          <option value="Events">Events</option>
                          <option value="Sports">Sports</option>
                          <option value="Campus">Campus</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL or Path *</label>
                        <input
                          type="text"
                          required
                          placeholder="/src/assets/images/..."
                          value={newGalleryItem.imageUrl}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Optional)</label>
                      <input
                        type="text"
                        placeholder="Brief description of the event or activity..."
                        value={newGalleryItem.description}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-xs font-semibold rounded cursor-pointer"
                    >
                      Upload / Add to Gallery
                    </button>
                  </form>

                  {/* Photos Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map((g) => (
                      <div key={g.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden relative group">
                        <img
                          src={g.imageUrl}
                          alt={g.title}
                          referrerPolicy="no-referrer"
                          className="h-32 w-full object-cover"
                        />
                        <div className="p-3">
                          <span className="text-[10px] text-[#064E3B] font-semibold block">{g.category}</span>
                          <h5 className="font-semibold text-xs text-slate-900 truncate">{g.title}</h5>
                        </div>
                        <button
                          onClick={() => handleDeleteGallery(g.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-700 text-white rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: FACILITIES */}
              {activeTab === 'facilities' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Manage Campus Facilities ({facilities.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update facility descriptions, highlights, and images.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {facilities.map((fac) => (
                      <div key={fac.id} className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-[#064E3B] uppercase tracking-wider">
                              {fac.category}
                            </span>
                            <h4 className="font-display font-bold text-base text-slate-900">{fac.name}</h4>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
                        <div className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2 rounded">
                          Highlight: {fac.highlight}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: ACADEMICS */}
              {activeTab === 'academics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Academics & Curricular Tiers
                    </h3>
                    <p className="text-xs text-slate-500">
                      Review educational stage configurations and prescribed subjects.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {academics.map((stage) => (
                      <div key={stage.id} className="bg-white p-6 rounded-xl border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-base text-slate-900">{stage.stage}</h4>
                          <span className="text-xs text-slate-500">{stage.ageGroup}</span>
                        </div>
                        <p className="text-xs text-slate-600">{stage.summary}</p>
                        <div>
                          <span className="text-[11px] font-semibold text-slate-700 block mb-1">Prescribed Subjects:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {stage.subjects.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-stone-100 text-slate-700 text-[11px] rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      School Configuration & Website Settings
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update contact numbers, address, announcements, and leadership messages.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
                    <h4 className="font-display font-semibold text-sm text-slate-900 border-b border-stone-100 pb-2">
                      Announcement Bar
                    </h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="annActive"
                        checked={settingsForm.announcementActive}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })}
                      />
                      <label htmlFor="annActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Display announcement bar at top of website
                      </label>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Announcement Text
                      </label>
                      <input
                        type="text"
                        value={settingsForm.announcement}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
                    <h4 className="font-display font-semibold text-sm text-slate-900 border-b border-stone-100 pb-2">
                      Contact & Location Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={settingsForm.phone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Official Email
                        </label>
                        <input
                          type="email"
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        School Campus Address
                      </label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Office Working Hours
                      </label>
                      <input
                        type="text"
                        value={settingsForm.workingHours}
                        onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
                    <h4 className="font-display font-semibold text-sm text-slate-900 border-b border-stone-100 pb-2">
                      Leadership Message & History
                    </h4>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Head of Institution / Principal Message
                      </label>
                      <textarea
                        rows={3}
                        value={settingsForm.principalMessage}
                        onChange={(e) => setSettingsForm({ ...settingsForm, principalMessage: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        School History & Founding Purpose
                      </label>
                      <textarea
                        rows={3}
                        value={settingsForm.schoolHistory}
                        onChange={(e) => setSettingsForm({ ...settingsForm, schoolHistory: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#064E3B] hover:bg-[#065F46] text-white text-xs font-semibold rounded-md shadow-sm cursor-pointer"
                  >
                    Save All Website Settings
                  </button>
                </form>
              )}

              {/* TAB 8: AUDIT LOGS */}
              {activeTab === 'audit' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Audit Trail & Activity Log
                    </h3>
                    <p className="text-xs text-slate-500">
                      Track changes made to notices, enquiries, settings, and staff access.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-slate-500 uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Timestamp</th>
                          <th className="p-3">Action</th>
                          <th className="p-3">Details</th>
                          <th className="p-3">User</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-stone-50">
                            <td className="p-3 text-slate-500 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="p-3 font-semibold text-[#064E3B]">{log.action}</td>
                            <td className="p-3 text-slate-700 font-sans">{log.details}</td>
                            <td className="p-3 text-slate-500">{log.adminUser}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 9: SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-md">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      Administrator Password
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update the staff login password to maintain system security.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        New Password (min 6 characters)
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#064E3B] hover:bg-[#065F46] text-white text-xs font-semibold rounded cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
