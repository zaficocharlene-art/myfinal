import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, ArrowRight, Heart, Clock, Users, HandHeart, Megaphone } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Item, Stats } from '../types';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const postLink = isLoggedIn ? '/post' : '/login';
  const [stats, setStats] = useState<Stats>({ totalItems: 0, lostItems: 0, foundItems: 0, resolvedItems: 0, openItems: 0 });
  const [recentItems, setRecentItems] = useState<Item[]>([]);

  useEffect(() => {
    setStats(dataService.getStats());
    setRecentItems(dataService.getRecentItems(6));
  }, []);

  return (
    <div className="min-h-screen bg-cork-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-warmgreen-800 via-warmgreen-700 to-warmgreen-900">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-warmgreen-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-warmgreen-400/10 rounded-full blur-3xl"></div>
          {/* Houses silhouette */}
          <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
            <svg viewBox="0 0 1440 120" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,120 L0,80 L40,80 L40,60 L60,40 L80,60 L80,80 L120,80 L120,50 L150,20 L180,50 L180,80 L220,80 L220,70 L240,50 L260,70 L260,80 L320,80 L320,45 L360,15 L400,45 L400,80 L440,80 L440,65 L460,45 L480,65 L480,80 L540,80 L540,55 L570,25 L600,55 L600,80 L660,80 L660,40 L700,10 L740,40 L740,80 L780,80 L780,70 L800,50 L820,70 L820,80 L880,80 L880,35 L920,5 L960,35 L960,80 L1020,80 L1020,60 L1050,30 L1080,60 L1080,80 L1140,80 L1140,50 L1170,20 L1200,50 L1200,80 L1260,80 L1260,65 L1290,35 L1320,65 L1320,80 L1380,80 L1380,55 L1410,25 L1440,55 L1440,120 Z"/>
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm mb-8 border border-white/20">
              <span className="text-lg">🏘️</span>
              Your Neighborhood's Helping Hand
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Lost It in the{' '}
              <span className="text-yellow-300">Neighborhood?</span>
              <br />
              Let's Bring It Home.
            </h1>

            <p className="text-lg sm:text-xl text-warmgreen-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              NeighborFind connects our community. Post what you've lost or found,
              and let neighbors help reunite belongings with their owners. Together, we look out for each other.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={postLink}
                className="inline-flex items-center justify-center gap-2 bg-sunset-500 hover:bg-sunset-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-sunset-400"
              >
                <Megaphone className="w-5 h-5" />
                I Lost Something
              </Link>
              <Link
                to={postLink}
                className="inline-flex items-center justify-center gap-2 bg-warmgreen-500 hover:bg-warmgreen-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-warmgreen-400"
              >
                <HandHeart className="w-5 h-5" />
                I Found Something
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/70 text-sm">
              <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-red-400" /> Community Powered</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-yellow-300" /> Instant Posting</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-300" /> 100% Free</span>
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fdf8f0"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-cork-50 py-12 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Items Reported', value: stats.totalItems, emoji: '📋', bg: 'bg-white', border: 'border-cork-200' },
              { label: 'Neighbors Searching', value: stats.lostItems, emoji: '🔍', bg: 'bg-sunset-50', border: 'border-sunset-200' },
              { label: 'Items Found', value: stats.foundItems, emoji: '📦', bg: 'bg-warmgreen-50', border: 'border-warmgreen-200' },
              { label: 'Reunited! 🎉', value: stats.resolvedItems, emoji: '🤝', bg: 'bg-yellow-50', border: 'border-yellow-200' },
            ].map(({ label, value, emoji, bg, border }) => (
              <div key={label} className={`${bg} rounded-2xl p-5 sm:p-6 shadow-sm border ${border} hover:shadow-md transition-shadow`}>
                <span className="text-3xl block mb-2">{emoji}</span>
                <p className="text-3xl font-extrabold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold text-warmgreen-600 uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
              Neighbors Helping Neighbors
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Three simple steps to help reunite lost belongings in our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-sunset-200 via-warmgreen-200 to-sky-200"></div>

            {[
              {
                step: '1',
                emoji: '📌',
                title: 'Pin a Flyer',
                description: 'Describe what was lost or found — add details like location, date, color, and a photo. Post it to the community board.',
                color: 'bg-sunset-50 border-sunset-200',
                dotColor: 'bg-sunset-500',
              },
              {
                step: '2',
                emoji: '👀',
                title: 'Neighbors Look',
                description: 'Community members browse the board, search for matching items, and keep an eye out in the neighborhood.',
                color: 'bg-warmgreen-50 border-warmgreen-200',
                dotColor: 'bg-warmgreen-500',
              },
              {
                step: '3',
                emoji: '🤝',
                title: 'Reunite & Celebrate',
                description: 'When a match is found, neighbors connect directly. Items are returned, and we all feel the community spirit!',
                color: 'bg-sky-50 border-sky-200',
                dotColor: 'bg-sky-500',
              },
            ].map(({ step, emoji, title, description, color, dotColor }) => (
              <div key={step} className="relative group">
                <div className="flex justify-center mb-4 relative z-10">
                  <div className={`w-12 h-12 ${dotColor} rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow-lg border-4 border-white`}>
                    {step}
                  </div>
                </div>
                <div className={`${color} border rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 h-full`}>
                  <span className="text-4xl block mb-4">{emoji}</span>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
                  <p className="text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Board Preview */}
      <section className="py-16 sm:py-20 bg-cork-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="text-sm font-bold text-warmgreen-600 uppercase tracking-widest">Community Board</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-2">
                Latest from the Neighborhood
              </h2>
              <p className="text-lg text-gray-500">
                Recent lost and found reports from your neighbors
              </p>
            </div>
            <Link
              to="/items"
              className="inline-flex items-center gap-2 text-warmgreen-700 hover:text-warmgreen-800 font-bold group"
            >
              View Full Board
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cork board container */}
          <div className="cork-bg rounded-3xl p-6 sm:p-8 shadow-inner">
            {recentItems.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentItems.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/50 rounded-2xl">
                <span className="text-5xl block mb-4">📭</span>
                <p className="text-white text-lg font-semibold">No items posted yet. Be the first neighbor to help!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative cork-bg rounded-3xl p-10 sm:p-14 shadow-2xl overflow-hidden">
            {/* Decorative pins */}
            <div className="absolute top-4 left-6 w-4 h-4 bg-red-500 rounded-full shadow-md border-2 border-red-300"></div>
            <div className="absolute top-6 right-8 w-4 h-4 bg-yellow-400 rounded-full shadow-md border-2 border-yellow-300"></div>
            <div className="absolute bottom-8 left-10 w-4 h-4 bg-blue-500 rounded-full shadow-md border-2 border-blue-300"></div>
            <div className="absolute bottom-5 right-12 w-4 h-4 bg-warmgreen-500 rounded-full shadow-md border-2 border-warmgreen-300"></div>

            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-lg border-2 border-dashed border-cork-300">
              <span className="text-5xl block mb-4">💌</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                Every Item Has a Story
              </h2>
              <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
                Behind every lost item is a worried neighbor. Your post could be the one that brings it home.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={postLink}
                  className="inline-flex items-center justify-center gap-2 bg-warmgreen-600 hover:bg-warmgreen-700 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  {isLoggedIn ? 'Post to the Board' : 'Sign In to Post'}
                </Link>
                <Link
                  to="/items"
                  className="inline-flex items-center justify-center gap-2 bg-cork-100 hover:bg-cork-200 text-cork-800 border-2 border-cork-300 px-8 py-3.5 rounded-full font-bold transition-all"
                >
                  <Search className="w-5 h-5" />
                  Browse the Board
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-cork-50 border-t border-cork-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '⚡', title: 'Instant Posts', desc: 'Items show up on the board immediately for maximum visibility' },
              { emoji: '🔍', title: 'Smart Search', desc: 'Search by description, location, category, color, or brand' },
              { emoji: '🛡️', title: 'Safe & Local', desc: 'Built for neighborhoods — connect with people near you' },
              { emoji: '💚', title: 'Community Spirit', desc: 'Powered by the kindness of neighbors helping neighbors' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-cork-200 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warmgreen-900 text-warmgreen-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl">🏘️</span>
            <span className="text-xl font-extrabold text-white">NeighborFind</span>
          </div>
          <p className="text-sm text-warmgreen-300">Bringing lost items home — one neighborhood at a time.</p>
          <div className="flex justify-center gap-6 mt-4 text-xs text-warmgreen-400">
            <span>Made with 💚 for the community</span>
          </div>
          <p className="text-xs mt-4 text-warmgreen-600">© 2025 NeighborFind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
