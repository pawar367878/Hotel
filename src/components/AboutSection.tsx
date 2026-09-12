import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Flame, CheckCircle2, Award, HeartHandshake } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { content } = useRestaurant();
  const about = content.about;

  return (
    <section id="about" className="py-20 bg-stone-950 border-t border-stone-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-900 group">
              <img
                src={about.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'}
                alt="12 Maval Chulha Heritage"
                className="w-full h-[400px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

              {/* Floating Quote Card */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-stone-950/90 border border-amber-500/40 backdrop-blur-md">
                <p className="font-marathi text-sm sm:text-base font-bold text-amber-400">
                  "चुलीवरचा धूर, गावरान लज्जत आणि आपुलकीचे आदरातिथ्य हीच आमची खरी ओळख."
                </p>
                <p className="text-xs text-stone-300 mt-1 font-heading">
                  — The Maval Culinary Heritage
                </p>
              </div>
            </div>

            {/* Decorative Ember Accent */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Our Heritage Story</span>
              </div>

              <h3 className="font-marathi text-2xl sm:text-3xl font-extrabold text-amber-400 mb-2">
                {about.marathiHeading}
              </h3>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-100 tracking-tight leading-tight">
                {about.heading}
              </h2>
            </div>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {about.description}
            </p>

            {/* Features list */}
            {about.features && about.features.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {about.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-stone-300 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4">
              <a
                href={about.buttonLink || '#menu'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-lg shadow-amber-950/40 active:scale-95"
              >
                <span>{about.buttonText || 'Explore Menu'}</span>
                <Flame className="w-4 h-4 text-stone-950" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
