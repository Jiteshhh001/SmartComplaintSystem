import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import FilterBar from '../components/FilterBar';
import { PlusCircle, Inbox, Loader2, BarChart3, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [analyzingAll, setAnalyzingAll] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState({ current: 0, total: 0 });
  const navigate = useNavigate();

  const fetchComplaints = async (category = '') => {
    setLoading(true);
    setIsSearching(false);
    try {
      const params = category ? { category } : {};
      const res = await api.get('/complaints', { params });
      setComplaints(res.data);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const searchByLocation = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setIsSearching(true);
    try {
      const res = await api.get('/complaints/search', { params: { location: searchQuery } });
      setComplaints(res.data);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    fetchComplaints(selectedCategory);
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    fetchComplaints(cat);
  };

  // Analyze all complaints with AI sequentially
  const analyzeAllComplaints = async () => {
    if (analyzingAll || complaints.length === 0) return;
    setAnalyzingAll(true);
    const total = complaints.length;
    setAnalyzeProgress({ current: 0, total });
    let successCount = 0;

    for (let i = 0; i < complaints.length; i++) {
      setAnalyzeProgress({ current: i + 1, total });
      try {
        const res = await api.post('/ai/analyze', { complaintId: complaints[i]._id });
        // Update the complaint in-place with new AI data
        setComplaints((prev) =>
          prev.map((c) =>
            c._id === complaints[i]._id
              ? { ...c, aiAnalysis: res.data.analysis }
              : c
          )
        );
        successCount++;
      } catch (err) {
        console.warn(`Failed to analyze complaint: ${complaints[i].title}`);
      }
    }

    setAnalyzingAll(false);
    toast.success(`AI analyzed ${successCount}/${total} complaints!`);
  };

  // Stats
  const stats = [
    { label: 'Total', value: complaints.length, icon: BarChart3, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Pending', value: complaints.filter(c => c.status === 'Pending').length, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length, icon: Loader2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Complaint Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {isSearching ? `Search results for "${searchQuery}"` : 'Manage and track all registered complaints'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={analyzeAllComplaints} disabled={analyzingAll || complaints.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
            id="quick-ai-button">
            {analyzingAll ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing {analyzeProgress.current}/{analyzeProgress.total}</>
            ) : (
              <><Sparkles className="w-4 h-4 text-amber-500" /> Quick AI Analyze All</>
            )}
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/complaints/new')}
            className="btn-primary flex items-center gap-2" id="new-complaint-button">
            <PlusCircle className="w-4 h-4" /> New Complaint
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="card flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}><Icon className={`w-5 h-5 ${stat.color}`} /></div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearch={searchByLocation} onClear={clearSearch} />
      </div>

      {/* Complaint List */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />
          <p style={{ color: 'var(--text-muted)' }}>Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Inbox className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No complaints found</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {isSearching ? 'Try a different search term' : 'Start by registering a new complaint'}
          </p>
          {!isSearching && (
            <button onClick={() => navigate('/complaints/new')} className="btn-primary inline-flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Register Complaint
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {complaints.map((complaint, i) => (
            <ComplaintCard key={complaint._id} complaint={complaint} index={i} />
          ))}
        </div>
      )}


    </div>
  );
};

export default DashboardPage;
