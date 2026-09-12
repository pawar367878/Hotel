import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Camera, X, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const { gallery } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    gallery.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [gallery]);

  const filteredGallery = useMemo(() => {
    if (selectedCategory === 'All') return gallery;
    return gallery.filter((item) => item.category === selectedCategory);
  }, [gallery, selectedCategory]);

  return (
    <section id="gallery" className="py-20 bg-stone-900/40 border-t border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Visual Glimpse</span>
          </div>
          <h2 className="font-marathi text-3xl sm:text-4xl font-extrabold text-amber-400 mb-1">
            हॉटेल १२ मावळ छायाचित्रे
          </h2>
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-100">
            Ambience, Hearth & Food Gallery
          </h3>
          <p className="text-stone-400 text-sm mt-2">
            Step into our lush garden seating, watch the wood-fired chulha smoke rise, and take in the authentic village kitchen spirit.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-850 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative h-64 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 cursor-pointer shadow-lg hover:border-amber-500/60 transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {item.category}
                </span>
                <h4 className="font-heading text-sm font-bold text-stone-100 line-clamp-1">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.caption}
                  </p>
                )}
              </div>

              <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-950/70 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-stone-950/80 text-stone-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activePhoto.image}
              alt={activePhoto.title}
              className="max-h-[75vh] w-auto object-contain mx-auto"
            />

            <div className="p-4 bg-stone-950 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-base font-bold text-stone-100">
                  {activePhoto.title}
                </h4>
                <span className="text-xs text-amber-400 font-semibold px-2 py-0.5 rounded bg-stone-900">
                  {activePhoto.category}
                </span>
              </div>
              {activePhoto.caption && (
                <p className="text-xs text-stone-400 mt-1">{activePhoto.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
