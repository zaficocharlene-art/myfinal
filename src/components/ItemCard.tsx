import { Link } from 'react-router-dom';
import { MapPin, Calendar, Gift, CheckCircle2 } from 'lucide-react';
import { Item, CATEGORIES } from '../types';
import { format, parseISO } from 'date-fns';

interface ItemCardProps {
  item: Item;
}

// Pin colors for the tack at the top of each card
const pinColors = [
  'bg-red-500',
  'bg-yellow-400',
  'bg-blue-500',
  'bg-warmgreen-500',
  'bg-sunset-500',
  'bg-purple-500',
  'bg-pink-400',
  'bg-teal-500',
];

export default function ItemCard({ item }: ItemCardProps) {
  const categoryInfo = CATEGORIES.find(c => c.value === item.category);
  // Deterministic pin color based on item id
  const pinColor = pinColors[item.id.charCodeAt(0) % pinColors.length];

  return (
    <Link
      to={`/items/${item.id}`}
      className="group block pin-card"
    >
      <div className={`relative bg-white rounded-2xl border-2 overflow-hidden ${
        item.status === 'resolved'
          ? 'border-warmgreen-200 opacity-80'
          : item.type === 'lost'
            ? 'border-sunset-200 hover:border-sunset-400'
            : 'border-warmgreen-200 hover:border-warmgreen-400'
      } shadow-md hover:shadow-xl transition-all duration-300`}>
        
        {/* Pushpin */}
        <div className="absolute top-3 right-4 z-10">
          <div className={`w-5 h-5 ${pinColor} rounded-full shadow-lg border-2 border-white`}></div>
          <div className="w-0.5 h-2 bg-gray-400 mx-auto -mt-0.5"></div>
        </div>

        {/* Type ribbon */}
        <div className={`px-4 py-2 flex items-center gap-2 ${
          item.type === 'lost'
            ? 'bg-sunset-50 border-b border-sunset-100'
            : 'bg-warmgreen-50 border-b border-warmgreen-100'
        }`}>
          <span className="text-lg">{item.type === 'lost' ? '🔍' : '🎉'}</span>
          <span className={`text-xs font-extrabold uppercase tracking-widest ${
            item.type === 'lost' ? 'text-sunset-700' : 'text-warmgreen-700'
          }`}>
            {item.type === 'lost' ? 'Lost — Help Needed!' : 'Found — Is This Yours?'}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl flex-shrink-0 mt-0.5">{categoryInfo?.icon || '📦'}</span>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-800 group-hover:text-warmgreen-700 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h3>
              {item.status === 'resolved' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-warmgreen-700 bg-warmgreen-100 px-2 py-0.5 rounded-full mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Reunited!
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="space-y-1.5">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2 text-warmgreen-400 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2 text-warmgreen-400 flex-shrink-0" />
              <span>{format(parseISO(item.date), 'MMM dd, yyyy')}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-dashed border-gray-200">
            {item.reward ? (
              <span className="flex items-center gap-1 text-xs font-bold text-sunset-600 bg-sunset-50 px-2.5 py-1 rounded-full">
                <Gift className="w-3 h-3" /> Reward: {item.reward}
              </span>
            ) : (
              <span className="text-xs text-gray-400">
                Posted {format(parseISO(item.createdAt), 'MMM dd')}
              </span>
            )}
            <span className="text-warmgreen-600 text-xs font-bold uppercase tracking-wider group-hover:underline">
              Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
