// Complaint Card component for dashboard list
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, User, Tag, ArrowRight, Brain } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const ComplaintCard = ({ complaint, index }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/complaints/${complaint._id}`)}
      className="card cursor-pointer group"
      id={`complaint-card-${complaint._id}`}
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-lg font-semibold line-clamp-1 group-hover:text-indigo-500 transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {complaint.title}
          </h3>
          <StatusBadge status={complaint.status} size="sm" />
        </div>

        {/* Description */}
        <p
          className="text-sm line-clamp-2 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {complaint.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="inline-flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {complaint.name}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {complaint.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            {complaint.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(complaint.createdAt)}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2">
            {complaint.aiAnalysis?.priority && (
              <PriorityBadge priority={complaint.aiAnalysis.priority} size="sm" />
            )}
            {complaint.aiAnalysis?.source && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Brain className="w-3 h-3" />
                {complaint.aiAnalysis.source === 'ai' ? 'AI' : 'Local'}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ComplaintCard;
