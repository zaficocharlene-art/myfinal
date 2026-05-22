import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MapPin, Trash2, Edit, Eye, Plus, RotateCcw, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { Item, Stats, CATEGORIES } from '../types';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<Stats>({ totalItems: 0, lostItems: 0, foundItems: 0, resolvedItems: 0, openItems: 0 });
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<'items' | 'users'>('items');

  const loadData = () => { setItems(dataService.getAllItems()); setStats(dataService.getStats()); };
  useEffect(() => { loadData(); }, []);

  if (!isAdmin) return <Navigate to="/" replace />;

  const filteredItems = items.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const handleToggleStatus = (id: string) => { dataService.toggleStatus(id); loadData(); };
  const handleDelete = (id: string) => { dataService.deleteItem(id); setDeleteId(null); loadData(); };
  const handleResetData = () => { dataService.resetData(); loadData(); };

  const resolvedPercentage = stats.totalItems > 0 ? Math.round((stats.resolvedItems / stats.totalItems) * 100) : 0;
  const categoryBreakdown = CATEGORIES.map(cat => ({ ...cat, count: items.filter(i => i.category === cat.value).length })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);
  const allUsers = authService.getAllUsers();

  return (
    <div className="min-h-screen bg-cork-50">
      <div className="bg-white border-b-2 border-warmgreen-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🛡️</span>
                <h1 className="text-3xl font-extrabold text-gray-900">Admin Panel</h1>
              </div>
              <p className="text-gray-500 mt-1 ml-12">Manage the entire community board</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleResetData} className="px-4 py-2.5 bg-cork-100 text-cork-700 rounded-full text-sm font-semibold hover:bg-cork-200 border border-cork-300 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Reset Demo
              </button>
              <Link to="/post" className="px-6 py-2.5 bg-gradient-to-r from-warmgreen-500 to-warmgreen-600 text-white rounded-full text-sm font-bold shadow-md flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Flyer
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Flyers', value: stats.totalItems, emoji: '📋', bg: 'bg-white', border: 'border-cork-200' },
            { label: 'Lost Items', value: stats.lostItems, emoji: '🔍', bg: 'bg-sunset-50', border: 'border-sunset-200' },
            { label: 'Found Items', value: stats.foundItems, emoji: '📦', bg: 'bg-warmgreen-50', border: 'border-warmgreen-200' },
            { label: 'Still Looking', value: stats.openItems, emoji: '👀', bg: 'bg-sky-50', border: 'border-sky-200' },
            { label: 'Reunited!', value: stats.resolvedItems, emoji: '🤝', bg: 'bg-yellow-50', border: 'border-yellow-200' },
          ].map(({ label, value, emoji, bg, border }) => (
            <div key={label} className={`${bg} rounded-2xl p-5 shadow-sm border ${border} ${label === 'Reunited!' ? 'col-span-2 lg:col-span-1' : ''}`}>
              <span className="text-2xl block mb-2">{emoji}</span>
              <p className="text-2xl font-extrabold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-cork-100 rounded-full p-1 mb-6 w-fit">
          <button onClick={() => setTab('items')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${tab === 'items' ? 'bg-white text-warmgreen-800 shadow-sm' : 'text-gray-500'}`}>📋 All Flyers</button>
          <button onClick={() => setTab('users')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${tab === 'users' ? 'bg-white text-warmgreen-800 shadow-sm' : 'text-gray-500'}`}>👥 Users ({allUsers.length})</button>
        </div>

        {tab === 'users' ? (
          /* Users List */
          <div className="bg-white rounded-2xl shadow-sm border border-cork-200 overflow-hidden">
            <div className="divide-y divide-cork-100">
              {allUsers.map(u => (
                <div key={u.id} className="p-4 flex items-center gap-4 hover:bg-cork-50/50 transition-colors">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold ${u.role === 'admin' ? 'bg-sunset-500' : 'bg-warmgreen-500'}`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800">{u.name}</p>
                    <p className="text-sm text-gray-500 truncate">{u.email}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-sunset-100 text-sunset-700' : 'bg-warmgreen-100 text-warmgreen-700'}`}>
                    {u.role === 'admin' ? '🛡️ Admin' : '👤 Member'}
                  </span>
                  <span className="text-xs text-gray-400">{dataService.getItemsByUser(u.id).length} flyers</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                  <div className="flex bg-cork-100 rounded-full p-1">
                    {(['all', 'lost', 'found'] as const).map(t => (
                      <button key={t} onClick={() => setFilterType(t)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filterType === t ? 'bg-white text-warmgreen-800 shadow-sm' : 'text-gray-500'}`}>
                        {t === 'all' ? '📋 All' : t === 'lost' ? '🔍 Lost' : '📦 Found'}
                      </button>
                    ))}
                  </div>
                  <div className="flex bg-cork-100 rounded-full p-1">
                    {(['all', 'open', 'resolved'] as const).map(s => (
                      <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filterStatus === s ? 'bg-white text-warmgreen-800 shadow-sm' : 'text-gray-500'}`}>
                        {s === 'all' ? 'Any Status' : s === 'open' ? '👀 Looking' : '🤝 Reunited'}
                      </button>
                    ))}
                  </div>
                  <div className="ml-auto text-sm text-gray-400 self-center font-medium">{filteredItems.length} flyers</div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-cork-200 overflow-hidden">
                {filteredItems.length > 0 ? (
                  <div className="divide-y divide-cork-100">
                    {filteredItems.map(item => {
                      const catInfo = CATEGORIES.find(c => c.value === item.category);
                      const poster = allUsers.find(u => u.id === item.postedBy);
                      return (
                        <div key={item.id} className="p-4 hover:bg-cork-50/50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl border ${item.type === 'lost' ? 'bg-sunset-50 border-sunset-200' : 'bg-warmgreen-50 border-warmgreen-200'}`}>{catInfo?.icon || '📦'}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${item.type === 'lost' ? 'bg-sunset-100 text-sunset-700' : 'bg-warmgreen-100 text-warmgreen-700'}`}>{item.type}</span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                                    <span className="text-xs text-gray-400">{format(parseISO(item.date), 'MMM dd, yyyy')}</span>
                                    {poster && <span className="text-xs text-blue-500 flex items-center gap-1"><Users className="w-3 h-3" /> {poster.name}</span>}
                                  </div>
                                </div>
                                <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${item.status === 'resolved' ? 'bg-warmgreen-100 text-warmgreen-700' : 'bg-sunset-100 text-sunset-700'}`}>
                                  {item.status === 'resolved' ? '🤝 Reunited' : '👀 Looking'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-2 line-clamp-1">{item.description}</p>
                              <div className="flex items-center gap-2 mt-3">
                                <Link to={`/items/${item.id}`} className="text-xs text-warmgreen-700 font-semibold flex items-center gap-1 px-3 py-1.5 bg-warmgreen-50 rounded-full hover:bg-warmgreen-100 border border-warmgreen-200"><Eye className="w-3.5 h-3.5" /> View</Link>
                                <Link to={`/post?edit=${item.id}`} className="text-xs text-gray-600 font-semibold flex items-center gap-1 px-3 py-1.5 bg-cork-50 rounded-full hover:bg-cork-100 border border-cork-200"><Edit className="w-3.5 h-3.5" /> Edit</Link>
                                <button onClick={() => handleToggleStatus(item.id)} className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full border ${item.status === 'resolved' ? 'text-sunset-700 bg-sunset-50 border-sunset-200' : 'text-warmgreen-700 bg-warmgreen-50 border-warmgreen-200'}`}>
                                  {item.status === 'resolved' ? '↩️ Reopen' : '🤝 Reunited'}
                                </button>
                                <button onClick={() => setDeleteId(item.id)} className="text-xs text-red-500 font-semibold flex items-center gap-1 px-3 py-1.5 bg-red-50 rounded-full hover:bg-red-100 border border-red-200"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <span className="text-5xl block mb-4">📭</span>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Board is empty</h3>
                    <Link to="/post" className="inline-flex items-center gap-2 px-6 py-3 bg-warmgreen-600 text-white rounded-full font-semibold"><Plus className="w-4 h-4" /> Post First Flyer</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">💚 Community Score</h3>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f2dbb7" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#cg)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${resolvedPercentage} ${100 - resolvedPercentage}`} />
                    <defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3a9a40" /><stop offset="100%" stopColor="#5bb860" /></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-gray-800">{resolvedPercentage}%</span>
                    <span className="text-[10px] text-gray-400 font-bold">REUNITED</span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500"><span className="font-bold text-warmgreen-700">{stats.resolvedItems}</span> of {stats.totalItems} reunited</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">📁 By Category</h3>
                <div className="space-y-2">
                  {categoryBreakdown.map(cat => (
                    <div key={cat.value} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-cork-50">
                      <div className="flex items-center gap-2"><span className="text-lg">{cat.icon}</span><span className="text-sm text-gray-700 font-medium">{cat.label}</span></div>
                      <span className="text-sm font-bold text-warmgreen-800 bg-warmgreen-50 px-2.5 py-0.5 rounded-full border border-warmgreen-200">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-cork-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Remove This Flyer?</h3>
            <p className="text-gray-500 text-center mb-6">Permanently remove from the board.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border-2 border-cork-300 rounded-full text-gray-600 font-semibold hover:bg-cork-50">Keep</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
