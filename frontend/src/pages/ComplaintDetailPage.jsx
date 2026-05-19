import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import AIAnalysisPanel from '../components/AIAnalysisPanel';
import StatusBadge from '../components/StatusBadge';
import { ArrowLeft, MapPin, Clock, User, Mail, Tag, Trash2, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null); // Local-only, resets each visit
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        setComplaint(res.data);
        setNewStatus(res.data.status);
      } catch (err) {
        toast.error('Failed to load complaint');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post('/ai/analyze', { complaintId: id });
      setAnalysis(res.data.analysis); // Store in local state only
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === complaint.status) return;
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/complaints/${id}`, { status: newStatus });
      setComplaint(res.data.complaint);
      toast.success('Status updated!');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    setDeleting(true);
    try {
      await api.delete(`/complaints/${id}`);
      toast.success('Complaint deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  if (!complaint) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm font-medium mb-6 group" style={{ color: 'var(--text-secondary)' }} id="back-button">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </motion.button>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left - Complaint Details */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{complaint.title}</h1>
              <StatusBadge status={complaint.status} />
            </div>

            <p className="leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{complaint.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { icon: User, label: 'Submitted by', value: complaint.name },
                { icon: Mail, label: 'Email', value: complaint.email },
                { icon: Tag, label: 'Category', value: complaint.category },
                { icon: MapPin, label: 'Location', value: complaint.location },
                { icon: Clock, label: 'Filed on', value: formatDate(complaint.createdAt) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Status Update */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Update Status</h3>
            <div className="flex flex-wrap gap-3">
              {statuses.map((s) => (
                <button key={s} onClick={() => setNewStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    newStatus === s ? 'gradient-bg text-white shadow-lg shadow-indigo-500/20' : ''
                  }`}
                  style={newStatus !== s ? { backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' } : {}}
                  id={`status-${s.replace(/\s+/g, '-').toLowerCase()}`}>
                  {s}
                </button>
              ))}
            </div>
            {newStatus !== complaint.status && (
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={handleStatusUpdate} disabled={updatingStatus}
                className="btn-primary mt-4 flex items-center gap-2" id="save-status">
                {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Status</>}
              </motion.button>
            )}
          </motion.div>

          {/* Delete */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Permanently delete this complaint</p>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleDelete} disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                id="delete-complaint">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Delete</>}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right - AI Analysis */}
        <div className="lg:col-span-2">
          <AIAnalysisPanel analysis={analysis} loading={analyzing} onAnalyze={handleAnalyze} />
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
