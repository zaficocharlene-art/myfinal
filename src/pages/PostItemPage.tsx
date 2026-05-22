import { useState } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle, CheckCircle, Megaphone, HandHeart } from 'lucide-react';
import { dataService } from '../services/dataService';
import { ItemFormData, CATEGORIES } from '../types';
import { useAuth } from '../context/AuthContext';

const initialFormData: ItemFormData = {
  type: 'lost',
  title: '',
  description: '',
  category: 'other',
  location: '',
  date: new Date().toISOString().split('T')[0],
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  imageUrl: '',
  reward: '',
  color: '',
  brand: '',
};

export default function PostItemPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { user, isAdmin, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState<ItemFormData>(() => {
    if (editId) {
      const item = dataService.getItemById(editId);
      if (item) {
        return {
          type: item.type, title: item.title, description: item.description, category: item.category,
          location: item.location, date: item.date, contactName: item.contactName, contactEmail: item.contactEmail,
          contactPhone: item.contactPhone, imageUrl: item.imageUrl || '', reward: item.reward || '',
          color: item.color || '', brand: item.brand || '',
        };
      }
    }
    return {
      ...initialFormData,
      contactName: user?.name || '',
      contactEmail: user?.email || '',
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // Check if user can edit this item
  if (editId) {
    const item = dataService.getItemById(editId);
    if (item && !isAdmin && item.postedBy !== user?.id) {
      return <Navigate to="/items" replace />;
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 20) newErrors.description = 'Please provide at least 20 characters';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Your name is required';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
    }
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editId) {
      dataService.updateItem(editId, formData);
    } else {
      dataService.createItem(formData, user!.id);
    }
    setSubmitted(true);
    setTimeout(() => navigate('/items'), 2000);
  };

  const handleChange = (field: keyof ItemFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cork-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border-2 border-warmgreen-200">
          <div className="w-20 h-20 bg-warmgreen-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-warmgreen-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{editId ? 'Flyer Updated!' : '📌 Pinned to the Board!'}</h2>
          <p className="text-gray-500 mb-6">{editId ? 'Your flyer has been updated.' : 'Your flyer is now on the community board!'}</p>
          <div className="w-8 h-8 border-4 border-warmgreen-200 border-t-warmgreen-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cork-50">
      <div className="bg-white border-b-2 border-warmgreen-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-warmgreen-700 text-sm mb-4"><ArrowLeft className="w-4 h-4" /> Go Back</button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📝</span>
            <h1 className="text-3xl font-extrabold text-gray-900">{editId ? 'Edit Your Flyer' : 'Post a Flyer'}</h1>
          </div>
          <p className="text-gray-500 ml-12">{editId ? 'Update the details on your community flyer' : 'Tell your neighbors what happened'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Type */}
          <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">What happened?</h2>
            <p className="text-sm text-gray-400 mb-4">Let the neighborhood know</p>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => handleChange('type', 'lost')}
                className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 ${formData.type === 'lost' ? 'border-sunset-400 bg-sunset-50 shadow-lg scale-[1.02]' : 'border-gray-200 hover:border-cork-300 bg-gray-50'}`}>
                <Megaphone className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'lost' ? 'text-sunset-600' : 'text-gray-400'}`} />
                <span className={`font-bold block text-lg ${formData.type === 'lost' ? 'text-sunset-700' : 'text-gray-700'}`}>I Lost Something</span>
                <p className="text-xs text-gray-400 mt-1">Help me find it!</p>
              </button>
              <button type="button" onClick={() => handleChange('type', 'found')}
                className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 ${formData.type === 'found' ? 'border-warmgreen-400 bg-warmgreen-50 shadow-lg scale-[1.02]' : 'border-gray-200 hover:border-cork-300 bg-gray-50'}`}>
                <HandHeart className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'found' ? 'text-warmgreen-600' : 'text-gray-400'}`} />
                <span className={`font-bold block text-lg ${formData.type === 'found' ? 'text-warmgreen-700' : 'text-gray-700'}`}>I Found Something</span>
                <p className="text-xs text-gray-400 mt-1">Is this yours?</p>
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">📦 Item Details</h2>
            <p className="text-sm text-gray-400 mb-5">Describe it so neighbors can recognize it</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">What is it? <span className="text-sunset-500">*</span></label>
                <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)}
                  placeholder='e.g., "Black iPhone with clear case"'
                  className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-400 bg-red-50' : 'border-cork-200 bg-cork-50'} focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm`} />
                {errors.title && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category <span className="text-sunset-500">*</span></label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.value} type="button" onClick={() => handleChange('category', cat.value)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${formData.category === cat.value ? 'border-warmgreen-400 bg-warmgreen-50 text-warmgreen-800 shadow-sm ring-1 ring-warmgreen-300' : 'border-cork-200 bg-cork-50 text-gray-600 hover:border-cork-300'}`}>
                      <span className="text-xl block mb-1">{cat.icon}</span>{cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tell us more <span className="text-sunset-500">*</span></label>
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe any distinguishing features..." rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-400 bg-red-50' : 'border-cork-200 bg-cork-50'} focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm resize-none`} />
                <div className="flex justify-between mt-1">
                  {errors.description ? <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.description}</p> : <span />}
                  <span className={`text-xs ${formData.description.length < 20 ? 'text-gray-400' : 'text-warmgreen-600'}`}>{formData.description.length}/20 min</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Color</label>
                  <input type="text" value={formData.color || ''} onChange={(e) => handleChange('color', e.target.value)} placeholder="e.g., Black, Red"
                    className="w-full px-4 py-3 rounded-xl border border-cork-200 bg-cork-50 focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Brand</label>
                  <input type="text" value={formData.brand || ''} onChange={(e) => handleChange('brand', e.target.value)} placeholder="e.g., Apple, Nike"
                    className="w-full px-4 py-3 rounded-xl border border-cork-200 bg-cork-50 focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Photo URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="url" value={formData.imageUrl || ''} onChange={(e) => handleChange('imageUrl', e.target.value)} placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-cork-200 bg-cork-50 focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm" />
              </div>

              {formData.type === 'lost' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Reward <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text" value={formData.reward || ''} onChange={(e) => handleChange('reward', e.target.value)} placeholder="e.g., ₱500, Free lunch!"
                    className="w-full px-4 py-3 rounded-xl border border-cork-200 bg-cork-50 focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm" />
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">📍 Where & When</h2>
            <p className="text-sm text-gray-400 mb-5">Help neighbors know where to look</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Location <span className="text-sunset-500">*</span></label>
                <input type="text" value={formData.location} onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., SM City Manila, near entrance"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.location ? 'border-red-400 bg-red-50' : 'border-cork-200 bg-cork-50'} focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm`} />
                {errors.location && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Date {formData.type === 'lost' ? 'Lost' : 'Found'} <span className="text-sunset-500">*</span></label>
                <input type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.date ? 'border-red-400 bg-red-50' : 'border-cork-200 bg-cork-50'} focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm`} />
                {errors.date && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.date}</p>}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">👤 Your Contact Info</h2>
            <p className="text-sm text-gray-400 mb-5">So neighbors can reach you</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Your Name <span className="text-sunset-500">*</span></label>
                <input type="text" value={formData.contactName} onChange={(e) => handleChange('contactName', e.target.value)} placeholder="Your name"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.contactName ? 'border-red-400 bg-red-50' : 'border-cork-200 bg-cork-50'} focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm`} />
                {errors.contactName && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.contactName}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email <span className="text-sunset-500">*</span></label>
                  <input type="email" value={formData.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} placeholder="you@email.com"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.contactEmail ? 'border-red-400 bg-red-50' : 'border-cork-200 bg-cork-50'} focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm`} />
                  {errors.contactEmail && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.contactEmail}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone <span className="text-sunset-500">*</span></label>
                  <input type="tel" value={formData.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} placeholder="0917-123-4567"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.contactPhone ? 'border-red-400 bg-red-50' : 'border-cork-200 bg-cork-50'} focus:ring-2 focus:ring-warmgreen-400 outline-none text-sm`} />
                  {errors.contactPhone && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.contactPhone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-full border-2 border-cork-300 text-gray-600 font-semibold hover:bg-cork-100 transition-colors">Cancel</button>
            <button type="submit"
              className={`px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 text-white ${formData.type === 'lost' ? 'bg-gradient-to-r from-sunset-500 to-sunset-600' : 'bg-gradient-to-r from-warmgreen-500 to-warmgreen-600'}`}>
              <Send className="w-4 h-4" /> {editId ? 'Update Flyer' : '📌 Pin to Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
