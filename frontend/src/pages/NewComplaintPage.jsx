import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Send, Zap, Loader2, User, Mail, FileText, AlignLeft, Tag, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['Water Supply', 'Electricity', 'Sanitation', 'Roads', 'Public Safety', 'Other'];

const NewComplaintPage = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/complaints', data);
      toast.success('Complaint registered successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = () => {
    setValue('name', 'Rahul Kumar');
    setValue('email', 'rahul@gmail.com');
    setValue('title', 'Water Leakage Issue');
    setValue('description', 'Water pipeline damaged near market area. Continuous water leakage has been observed for the past 3 days causing waterlogging and inconvenience to pedestrians.');
    setValue('category', 'Water Supply');
    setValue('location', 'Ghaziabad');
  };

  const fields = [
    { name: 'name', label: 'Your Name', type: 'text', icon: User, placeholder: 'Rahul Kumar', rules: { required: 'Name is required' } },
    { name: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'rahul@gmail.com', rules: { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } } },
    { name: 'title', label: 'Complaint Title', type: 'text', icon: FileText, placeholder: 'Brief title of your complaint', rules: { required: 'Title is required' } },
    { name: 'location', label: 'Location', type: 'text', icon: MapPin, placeholder: 'City or area', rules: { required: 'Location is required' } },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Register Complaint</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Fill in the details to submit a new complaint</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} onClick={quickFill}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
            id="quick-fill-complaint">
            <Zap className="w-4 h-4 text-amber-500" /> Quick Fill
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.name}>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{field.label}</label>
                  <div className="relative">
                    <input type={field.type} {...register(field.name, field.rules)}
                      className="input-field pl-10" placeholder={field.placeholder} id={`complaint-${field.name}`} />
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  {errors[field.name] && <p className="text-xs text-red-500 mt-1">{errors[field.name].message}</p>}
                </div>
              );
            })}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Tag className="w-4 h-4" /> Category
            </label>
            <select {...register('category', { required: 'Category is required' })}
              className="input-field" id="complaint-category">
              <option value="">Select category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <AlignLeft className="w-4 h-4" /> Description
            </label>
            <textarea {...register('description', { required: 'Description is required' })} rows={5}
              className="input-field resize-none" placeholder="Describe your complaint in detail..."
              id="complaint-description" />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          {/* Mobile quick fill */}
          <button type="button" onClick={quickFill}
            className="sm:hidden w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <Zap className="w-4 h-4 text-amber-500" /> Quick Fill Test Data
          </button>

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit"
            disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2" id="submit-complaint">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Submit Complaint</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default NewComplaintPage;
