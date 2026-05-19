// AI Analysis Panel - Displays AI analysis results for a complaint
import { motion } from 'framer-motion';
import { Brain, Building2, FileText, MessageSquare, Sparkles, Cpu } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

const AIAnalysisPanel = ({ analysis, loading, onAnalyze }) => {
  if (!analysis && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center py-8"
      >
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          AI Complaint Analysis
        </h3>
        <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Use AI to automatically detect priority, suggest the responsible department, generate a summary, and create an auto-response.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAnalyze}
          className="btn-primary inline-flex items-center gap-2"
          id="analyze-button"
        >
          <Sparkles className="w-4 h-4" />
          Analyze with AI
        </motion.button>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Brain className="w-8 h-8 text-white animate-spin" />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          AI is analyzing your complaint...
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          This may take a few seconds
        </p>
      </div>
    );
  }

  const sections = [
    {
      icon: Building2,
      label: 'Recommended Department',
      value: analysis.department,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: FileText,
      label: 'Complaint Summary',
      value: analysis.summary,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: MessageSquare,
      label: 'Auto-Generated Response',
      value: analysis.response,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      isLong: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                AI Analysis Results
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {analysis.source === 'ai' ? (
                    <>
                      <Sparkles className="w-3 h-3" />
                      OpenRouter AI
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3 h-3" />
                      Local Fallback
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <PriorityBadge priority={analysis.priority} size="lg" />
        </div>
      </div>

      {/* Analysis sections */}
      {sections.map((section, i) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="card"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl ${section.bg}`}>
                <Icon className={`w-5 h-5 ${section.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                  {section.label}
                </h4>
                <p
                  className={`text-sm leading-relaxed ${section.isLong ? 'whitespace-pre-line' : 'font-medium'}`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  {section.value}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default AIAnalysisPanel;
