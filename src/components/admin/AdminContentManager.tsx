import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../services/api';
import { Save, Flame, Image, Type, CheckCircle2, Plus, Trash2 } from 'lucide-react';

export const AdminContentManager: React.FC = () => {
  const { content, refreshPublicData, showToast } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'hero' | 'about'>('hero');
  const [heroForm, setHeroForm] = useState({ ...content.hero });
  const [aboutForm, setAboutForm] = useState({ ...content.about });
  const [newFeature, setNewFeature] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await api.updateContent({ hero: heroForm });
      showToast('✓ Hero section content updated');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update hero', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await api.updateContent({ about: aboutForm });
      showToast('✓ About & Heritage section updated');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update about section', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setAboutForm({
      ...aboutForm,
      features: [...(aboutForm.features || []), newFeature.trim()],
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setAboutForm({
      ...aboutForm,
      features: (aboutForm.features || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-stone-100">Website Content CMS</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Modify text, headlines, imagery, and promotional copy across the homepage
          </p>
        </div>

        <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'hero' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
            }`}
          >
            Hero Banner
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'about' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
            }`}
          >
            About & Heritage
          </button>
        </div>
      </div>

      {activeTab === 'hero' ? (
        /* HERO SECTION FORM */
        <form
          onSubmit={handleSaveHero}
          className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 space-y-6 shadow-xl"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-stone-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>Hero Showcase Section</span>
            </h3>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Hero Content'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Marathi Royal Headline *
              </label>
              <input
                type="text"
                required
                value={heroForm.marathiHeading}
                onChange={(e) => setHeroForm({ ...heroForm, marathiHeading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 font-marathi"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                English Main Headline *
              </label>
              <input
                type="text"
                required
                value={heroForm.heading}
                onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Badge Text (Top Pill)
            </label>
            <input
              type="text"
              value={heroForm.badgeText}
              onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
              placeholder="Since 1994 • Wood-Fired Chulha Special"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Hero Background Image URL
            </label>
            <input
              type="url"
              value={heroForm.image}
              onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-stone-800">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={heroForm.primaryCtaText}
                onChange={(e) => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Secondary CTA Button Label
              </label>
              <input
                type="text"
                value={heroForm.secondaryCtaText}
                onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
              />
            </div>
          </div>
        </form>
      ) : (
        /* ABOUT & HERITAGE FORM */
        <form
          onSubmit={handleSaveAbout}
          className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 space-y-6 shadow-xl"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-stone-100">
              About & Heritage Story
            </h3>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save About Section'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Marathi Heading
              </label>
              <input
                type="text"
                value={aboutForm.marathiHeading}
                onChange={(e) => setAboutForm({ ...aboutForm, marathiHeading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 font-marathi"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                English Heading
              </label>
              <input
                type="text"
                value={aboutForm.heading}
                onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Story / Heritage Description
            </label>
            <textarea
              rows={4}
              value={aboutForm.description}
              onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Heritage Image URL
            </label>
            <input
              type="url"
              value={aboutForm.image}
              onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 font-mono"
            />
          </div>

          {/* Features / Highlights */}
          <div className="pt-2 border-t border-stone-800 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
              Key Heritage Features & Bullet Points
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g. 100% Earthen Pot Slow Cooking"
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-amber-400"
              >
                + Add Point
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {aboutForm.features?.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950 border border-stone-850 text-xs text-stone-200"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{f}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-stone-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
