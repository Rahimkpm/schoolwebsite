import React, { useState } from 'react';
import { GalleryItem } from '../types/index.ts';
import { Maximize2, X, Image as ImageIcon, Calendar } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Classroom', 'Academic', 'Events', 'Campus'];

  const filteredItems =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="gallery" className="py-16 md:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
              School Life & Activities
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              Moments of Learning, Discipline & Growth
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Authentic glimpses into daily learning, computer practicals, library discovery, and moral programs at Ideal Global Islamic English Medium School.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-[#064E3B] shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 rounded-xl border border-stone-200">
            <ImageIcon className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No photos found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveLightbox(item)}
                className="group relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-60 w-full overflow-hidden bg-stone-200">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 bg-white/90 text-slate-900 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-5 h-5 text-[#064E3B]" />
                    </span>
                  </div>

                  <span className="absolute top-3 left-3 bg-stone-900/75 backdrop-blur-xs text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-sm text-slate-900 group-hover:text-[#064E3B] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {item.date && (
                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeLightbox && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setActiveLightbox(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-3 right-3 z-10 p-2 bg-stone-900/70 hover:bg-stone-900 text-white rounded-full transition-colors cursor-pointer"
                aria-label="Close photo"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] bg-stone-950 flex items-center justify-center overflow-hidden">
                <img
                  src={activeLightbox.imageUrl}
                  alt={activeLightbox.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#065F46] block mb-1">
                    {activeLightbox.category} · {activeLightbox.date}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {activeLightbox.title}
                  </h3>
                  {activeLightbox.description && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      {activeLightbox.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setActiveLightbox(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors self-start sm:self-center cursor-pointer"
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
