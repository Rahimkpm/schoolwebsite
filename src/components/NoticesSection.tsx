import React, { useState } from 'react';
import { Notice } from '../types/index.ts';
import { Bell, Search, Pin, Calendar, Tag, ChevronRight, FileText, X } from 'lucide-react';

interface NoticesSectionProps {
  notices: Notice[];
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({ notices }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalNotice, setActiveModalNotice] = useState<Notice | null>(null);

  const categories = ['All', 'Admission', 'Examination', 'Event', 'Circular', 'Holiday'];

  const filteredNotices = notices.filter((n) => {
    const matchesCat =
      selectedCategory === 'All' || n.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="notices" className="py-16 md:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#065F46] tracking-wider uppercase mb-1">
              <Bell className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Official Circulars & Notice Board</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Notices, Schedules & School Announcements
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Stay informed on admission dates, terminal assessments, holiday notifications, and academic circulars from the school administration.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-[#064E3B]"
            />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#064E3B] text-white font-semibold shadow-2xs'
                  : 'bg-white text-slate-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notices Cards List */}
        {filteredNotices.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
            <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-medium">No circulars match your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs font-semibold text-[#064E3B] underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.map((n) => (
              <div
                key={n.id}
                onClick={() => setActiveModalNotice(n)}
                className={`p-6 rounded-xl border transition-all duration-200 bg-white hover:border-[#064E3B]/60 shadow-2xs hover:shadow-xs cursor-pointer flex flex-col justify-between ${
                  n.isPinned ? 'border-amber-300 ring-1 ring-amber-200' : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#065F46] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {n.category}
                      </span>
                      {n.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Pin className="w-3 h-3 text-amber-600 rotate-45" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>{n.date}</span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#064E3B] transition-colors leading-snug line-clamp-2 mb-2">
                    {n.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {n.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#064E3B] font-semibold">
                  <span>Read circular details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Read Notice Modal */}
        {activeModalNotice && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setActiveModalNotice(null)}
          >
            <div
              className="relative max-w-xl w-full bg-white rounded-xl shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalNotice(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#065F46] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {activeModalNotice.category}
                </span>
                {activeModalNotice.isPinned && (
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    Important Notice
                  </span>
                )}
                <span className="text-xs text-slate-500 ml-auto">{activeModalNotice.date}</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-4">
                {activeModalNotice.title}
              </h3>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-6">
                {activeModalNotice.description}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="text-[11px] text-slate-500">
                  Official release by School Administration
                </span>
                <button
                  onClick={() => setActiveModalNotice(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-800 bg-stone-200 hover:bg-stone-300 rounded-md transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
