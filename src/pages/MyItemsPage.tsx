import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { dataService } from '../services/dataService';
import { Item, CATEGORIES } from '../types';
import { useAuth } from '../context/AuthContext';

export default function MyItemsPage() {
  const { user, isLoggedIn } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user) setItems(dataService.getItemsByUser(user.id));
  }, [user]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const handleToggle = (id: string) => {
    dataService.toggleStatus(id);
    setItems(dataService.getItemsByUser(user!.id));
  };

  const handleDelete = (id: string) => {
    dataService.deleteItem(id);
    setDeleteId(null);
    setItems(dataService.getItemsByUser(user!.id));
  };

  return (
    <div className="min-h-screen bg-cork-50">
      <div className="bg-white border-b-2 border-warmgreen-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📋</span>
            <h1 className="text-3xl font-extrabold text-gray-900">My Flyers</h1>
          </div>
          <p className="text-gray-500 ml-12">Manage the flyers you've posted to the community board</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-cork-200 overflow-hidden">
            <div className="divide-y divide-cork-100">
              {items.map(item => {
                const catInfo = CATEGORIES.find(c => c.value === item.category);
                return (
                  <div key={item.id} className="p-4 hover:bg-cork-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl border ${
                        item.type === 'lost' ? 'bg-sunset-50 border-sunset-200' : 'bg-warmgreen-50 border-warmgreen-200'
                      }`}>{catInfo?.icon || '📦'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-800">{item.title}</h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                                item.type === 'lost' ? 'bg-sunset-100 text-sunset-700' : 'bg-warmgreen-100 text-warmgreen-700'
                              }`}>{item.type}</span>
                              <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                              <span className="text-xs text-gray-400">{format(parseISO(item.date), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                          <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                            item.status === 'resolved' ? 'bg-warmgreen-100 text-warmgreen-700' : 'bg-sunset-100 text-sunset-700'
                          }`}>{item.status === 'resolved' ? '🤝 Reunited' : '👀 Looking'}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-1">{item.description}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Link to={`/items/${item.id}`} className="text-xs text-warmgreen-700 font-semibold flex items-center gap-1 px-3 py-1.5 bg-warmgreen-50 rounded-full hover:bg-warmgreen-100 border border-warmgreen-200">
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                          <Link to={`/post?edit=${item.id}`} className="text-xs text-gray-600 font-semibold flex items-center gap-1 px-3 py-1.5 bg-cork-50 rounded-full hover:bg-cork-100 border border-cork-200">
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </Link>
                          <button onClick={() => handleToggle(item.id)}
                            className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full border ${
                              item.status === 'resolved' ? 'text-sunset-700 bg-sunset-50 border-sunset-200' : 'text-warmgreen-700 bg-warmgreen-50 border-warmgreen-200'
                            }`}>{item.status === 'resolved' ? '↩️ Reopen' : '🤝 Reunited'}</button>
                          <button onClick={() => setDeleteId(item.id)}
                            className="text-xs text-red-500 font-semibold flex items-center gap-1 px-3 py-1.5 bg-red-50 rounded-full hover:bg-red-100 border border-red-200">
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-cork-300">
            <span className="text-5xl block mb-4">📭</span>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No flyers yet</h3>
            <p className="text-gray-500 mb-6">You haven't posted any flyers to the community board.</p>
            <Link to="/post" className="inline-flex items-center gap-2 px-6 py-3 bg-warmgreen-600 text-white rounded-full font-bold hover:bg-warmgreen-700 transition-colors">
              <Plus className="w-4 h-4" /> Post Your First Flyer
            </Link>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-cork-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Remove This Flyer?</h3>
            <p className="text-gray-500 text-center mb-6">It will be permanently removed from the board.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border-2 border-cork-300 rounded-full text-gray-600 font-semibold hover:bg-cork-50">Keep It</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
