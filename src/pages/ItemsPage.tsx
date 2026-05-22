import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Item, FilterState, CATEGORIES } from '../types';
import ItemCard from '../components/ItemCard';

const defaultFilters: FilterState = {
  type: 'all',
  category: 'all',
  status: 'all',
  searchQuery: '',
  sortBy: 'newest',
  dateFrom: undefined,
  dateTo: undefined,
};

export default function ItemsPage() {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setAllItems(dataService.getAllItems());
  }, []);

  const filteredItems = useMemo(() => {
    return dataService.getFilteredItems(filters);
  }, [filters, allItems]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = filters.type !== 'all' || filters.category !== 'all' ||
    filters.status !== 'all' || filters.searchQuery.trim() !== '' ||
    filters.dateFrom || filters.dateTo;

  return (
    <div className="min-h-screen bg-cork-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-warmgreen-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📌</span>
            <h1 className="text-3xl font-extrabold text-gray-900">Community Board</h1>
          </div>
          <p className="text-gray-500 ml-12">Browse all lost and found flyers from the neighborhood</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-cork-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cork-400" />
              <input
                type="text"
                placeholder="Search the board — try a description, location, or color..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-cork-50 border border-cork-200 rounded-xl text-sm focus:ring-2 focus:ring-warmgreen-400 focus:border-warmgreen-400 outline-none transition-all"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(f => ({ ...f, searchQuery: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <select
                value={filters.type}
                onChange={(e) => setFilters(f => ({ ...f, type: e.target.value as FilterState['type'] }))}
                className="px-4 py-3 bg-cork-50 border border-cork-200 rounded-xl text-sm focus:ring-2 focus:ring-warmgreen-400 outline-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="lost">🔍 Lost</option>
                <option value="found">📦 Found</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value as FilterState['sortBy'] }))}
                className="px-4 py-3 bg-cork-50 border border-cork-200 rounded-xl text-sm focus:ring-2 focus:ring-warmgreen-400 outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                  showFilters || hasActiveFilters
                    ? 'bg-warmgreen-100 text-warmgreen-800 border border-warmgreen-300'
                    : 'bg-cork-50 text-gray-600 border border-cork-200 hover:bg-cork-100'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-sunset-500 rounded-full"></span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-cork-100">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(f => ({ ...f, category: e.target.value as FilterState['category'] }))}
                    className="w-full px-3 py-2.5 bg-cork-50 border border-cork-200 rounded-lg text-sm focus:ring-2 focus:ring-warmgreen-400 outline-none"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(f => ({ ...f, status: e.target.value as FilterState['status'] }))}
                    className="w-full px-3 py-2.5 bg-cork-50 border border-cork-200 rounded-lg text-sm focus:ring-2 focus:ring-warmgreen-400 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="open">🟢 Still Looking</option>
                    <option value="resolved">🤝 Reunited</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value || undefined }))}
                    className="w-full px-3 py-2.5 bg-cork-50 border border-cork-200 rounded-lg text-sm focus:ring-2 focus:ring-warmgreen-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value || undefined }))}
                    className="w-full px-3 py-2.5 bg-cork-50 border border-cork-200 rounded-lg text-sm focus:ring-2 focus:ring-warmgreen-400 outline-none"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-sunset-600 hover:text-sunset-700 font-medium flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            📋 Showing <span className="font-bold text-gray-700">{filteredItems.length}</span> {filteredItems.length === 1 ? 'flyer' : 'flyers'} on the board
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>

        {/* Cork Board Container */}
        <div className="cork-bg rounded-3xl p-4 sm:p-6 shadow-inner min-h-[400px]">
          {filteredItems.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/80 rounded-2xl border-2 border-dashed border-cork-300">
              <span className="text-6xl block mb-4">🔍</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Nothing on the board</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {hasActiveFilters
                  ? 'Try changing your search or filters to see more results.'
                  : 'The community board is empty. Be the first to post!'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-warmgreen-100 text-warmgreen-800 rounded-full font-medium hover:bg-warmgreen-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
