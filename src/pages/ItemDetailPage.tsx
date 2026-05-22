import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Tag, User, Mail, Phone, Gift,
  CheckCircle2, Edit, Trash2, Clock, Palette, Award,
  AlertTriangle, Share2
} from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { dataService } from '../services/dataService';
import { Item, CATEGORIES } from '../types';
import { useAuth } from '../context/AuthContext';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, isLoggedIn } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) { const found = dataService.getItemById(id); if (found) setItem(found); }
  }, [id]);

  const canManage = isAdmin || (user && item && item.postedBy === user.id);

  const handleToggleStatus = () => {
    if (item) { const updated = dataService.toggleStatus(item.id); if (updated) setItem(updated); }
  };
  const handleDelete = () => {
    if (item) { dataService.deleteItem(item.id); navigate('/items'); }
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-cork-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border-2 border-cork-200">
          <span className="text-6xl block mb-4">😕</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Flyer Not Found</h2>
          <p className="text-gray-500 mb-6">This flyer might have been taken down.</p>
          <Link to="/items" className="inline-flex items-center gap-2 px-6 py-3 bg-warmgreen-600 text-white rounded-full font-medium hover:bg-warmgreen-700"><ArrowLeft className="w-4 h-4" /> Back to Board</Link>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORIES.find(c => c.value === item.category);
  const isLost = item.type === 'lost';

  return (
    <div className="min-h-screen bg-cork-50">
      <div className={`${isLost ? 'bg-gradient-to-r from-sunset-500 to-sunset-600' : 'bg-gradient-to-r from-warmgreen-500 to-warmgreen-600'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4"><ArrowLeft className="w-4 h-4" /> Back to Board</button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-white/90 text-sm font-bold uppercase tracking-widest">{isLost ? '🔍 Lost — Help Needed' : '🎉 Found — Is This Yours?'}</span>
                {item.status === 'resolved' ? (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold"><CheckCircle2 className="w-3 h-3" /> Reunited!</span>
                ) : (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">Still Looking</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{item.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              </button>
              {canManage && (
                <>
                  <Link to={`/post?edit=${item.id}`} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"><Edit className="w-5 h-5" /></Link>
                  <button onClick={() => setShowDeleteConfirm(true)} className="p-2.5 bg-white/10 hover:bg-red-500/50 text-white rounded-full transition-colors"><Trash2 className="w-5 h-5" /></button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {item.imageUrl && (
              <div className="bg-white rounded-2xl shadow-sm border border-cork-200 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-64 sm:h-80 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-xl">📝</span> Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-xl">📋</span> Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-cork-50 rounded-xl border border-cork-100">
                  <Tag className="w-5 h-5 text-warmgreen-500 mt-0.5 flex-shrink-0" />
                  <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Category</p><p className="text-gray-800 font-medium">{categoryInfo?.icon} {categoryInfo?.label}</p></div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-cork-50 rounded-xl border border-cork-100">
                  <MapPin className="w-5 h-5 text-warmgreen-500 mt-0.5 flex-shrink-0" />
                  <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Location</p><p className="text-gray-800 font-medium">{item.location}</p></div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-cork-50 rounded-xl border border-cork-100">
                  <Calendar className="w-5 h-5 text-warmgreen-500 mt-0.5 flex-shrink-0" />
                  <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date {isLost ? 'Lost' : 'Found'}</p><p className="text-gray-800 font-medium">{format(parseISO(item.date), 'MMMM dd, yyyy')}</p></div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-cork-50 rounded-xl border border-cork-100">
                  <Clock className="w-5 h-5 text-warmgreen-500 mt-0.5 flex-shrink-0" />
                  <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Posted</p><p className="text-gray-800 font-medium">{formatDistanceToNow(parseISO(item.createdAt), { addSuffix: true })}</p></div>
                </div>
                {item.color && (
                  <div className="flex items-start gap-3 p-4 bg-cork-50 rounded-xl border border-cork-100">
                    <Palette className="w-5 h-5 text-warmgreen-500 mt-0.5 flex-shrink-0" />
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Color</p><p className="text-gray-800 font-medium">{item.color}</p></div>
                  </div>
                )}
                {item.brand && (
                  <div className="flex items-start gap-3 p-4 bg-cork-50 rounded-xl border border-cork-100">
                    <Award className="w-5 h-5 text-warmgreen-500 mt-0.5 flex-shrink-0" />
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Brand</p><p className="text-gray-800 font-medium">{item.brand}</p></div>
                  </div>
                )}
                {item.reward && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200 sm:col-span-2">
                    <Gift className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div><p className="text-xs text-yellow-600 font-bold uppercase tracking-wider">🎁 Reward Offered</p><p className="text-yellow-800 font-extrabold text-lg">{item.reward}</p></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Status</h3>
              <div className={`p-4 rounded-xl ${item.status === 'resolved' ? 'bg-warmgreen-50 border border-warmgreen-200' : 'bg-sunset-50 border border-sunset-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.status === 'resolved' ? '🤝' : '👀'}</span>
                  <span className={`font-bold ${item.status === 'resolved' ? 'text-warmgreen-800' : 'text-sunset-800'}`}>{item.status === 'resolved' ? 'Reunited!' : 'Still Looking'}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {item.status === 'resolved' ? 'This item has been returned! 🎉' : isLost ? "This item hasn't been found yet." : 'Waiting to be claimed.'}
                </p>
              </div>
              {canManage && (
                <button onClick={handleToggleStatus}
                  className={`w-full mt-4 py-3 rounded-full font-bold text-sm transition-all ${item.status === 'resolved' ? 'bg-sunset-50 text-sunset-700 border-2 border-sunset-200 hover:bg-sunset-100' : 'bg-warmgreen-50 text-warmgreen-700 border-2 border-warmgreen-200 hover:bg-warmgreen-100'}`}>
                  {item.status === 'resolved' ? '↩️ Mark as Still Looking' : '🤝 Mark as Reunited!'}
                </button>
              )}
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Your Neighbor</h3>
              {!showContact ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-warmgreen-100 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">👤</div>
                  <p className="font-bold text-gray-800 mb-1">{item.contactName}</p>
                  <p className="text-sm text-gray-500 mb-4">Tap below to see how to reach them</p>
                  {isLoggedIn ? (
                    <button onClick={() => setShowContact(true)} className="w-full py-3 bg-gradient-to-r from-warmgreen-500 to-warmgreen-600 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all">
                      👋 Show Contact Info
                    </button>
                  ) : (
                    <Link to="/login" className="block w-full py-3 bg-gradient-to-r from-warmgreen-500 to-warmgreen-600 text-white rounded-full font-bold shadow-md text-center hover:shadow-lg transition-all">
                      🔐 Sign In to See Contact
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-cork-50 rounded-xl border border-cork-100">
                    <User className="w-5 h-5 text-warmgreen-500 flex-shrink-0" />
                    <div><p className="text-xs text-gray-400">Name</p><p className="text-gray-800 font-medium">{item.contactName}</p></div>
                  </div>
                  <a href={`mailto:${item.contactEmail}`} className="flex items-center gap-3 p-3 bg-warmgreen-50 rounded-xl border border-warmgreen-100 hover:bg-warmgreen-100 transition-colors group">
                    <Mail className="w-5 h-5 text-warmgreen-600 flex-shrink-0" />
                    <div><p className="text-xs text-gray-400">Email</p><p className="text-warmgreen-700 font-medium group-hover:underline">{item.contactEmail}</p></div>
                  </a>
                  <a href={`tel:${item.contactPhone}`} className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl border border-sky-100 hover:bg-sky-100 transition-colors group">
                    <Phone className="w-5 h-5 text-sky-600 flex-shrink-0" />
                    <div><p className="text-xs text-gray-400">Phone</p><p className="text-sky-700 font-medium group-hover:underline">{item.contactPhone}</p></div>
                  </a>
                </div>
              )}
            </div>
            <div className="text-center text-xs text-gray-400">Last updated: {format(parseISO(item.updatedAt), 'MMM dd, yyyy HH:mm')}</div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-cork-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-8 h-8 text-red-500" /></div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Take Down This Flyer?</h3>
            <p className="text-gray-500 text-center mb-6">This flyer will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 border-2 border-cork-300 rounded-full text-gray-600 font-semibold hover:bg-cork-50">Keep It</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /> Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
