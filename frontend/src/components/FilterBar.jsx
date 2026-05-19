import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';

const categories = ['All','Water Supply','Electricity','Sanitation','Roads','Public Safety','Other'];

const FilterBar = ({ selectedCategory, onCategoryChange, searchQuery, onSearchChange, onSearch, onClear }) => {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <Filter className="w-3.5 h-3.5" /> Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                  (cat === 'All' && !selectedCategory) || cat === selectedCategory
                    ? 'gradient-bg text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-indigo-50 dark:hover:bg-indigo-950/20'
                }`}
                style={!((cat === 'All' && !selectedCategory) || cat === selectedCategory)
                  ? { backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' } : {}}
                id={`filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:w-80">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <Search className="w-3.5 h-3.5" /> Search by Location
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()} placeholder="e.g. Ghaziabad"
                className="input-field text-sm pl-9" id="location-search-input" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onSearch}
              className="btn-primary text-sm px-4" id="search-button">Search</motion.button>
            {searchQuery && (
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={onClear}
                className="p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                style={{ border: '1px solid var(--border-color)' }}>
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;
