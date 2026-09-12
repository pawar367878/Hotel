import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../services/api';
import {
  Save,
  Building,
  DollarSign,
  Lock,
  Download,
  CheckCircle2,
  AlertCircle,
  Phone,
  Printer,
  Sliders,
} from 'lucide-react';
import { downloadMenuPdf } from '../../utils/pdfGenerator';

export const AdminSettingsManager: React.FC = () => {
  const { settings, categories, menuItems, refreshPublicData, showToast } = useRestaurant();

  const [form, setForm] = useState({ ...settings });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await api.updateSettings(form);
      showToast('✓ Settings updated successfully');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    if (!newPassword || newPassword.length < 4) {
      setPasswordMsg('Password must be at least 4 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }

    try {
      await api.changePassword(newPassword);
      showToast('✓ Admin password changed successfully');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg('Password updated!');
    } catch (err: any) {
      setPasswordMsg(err.message || 'Failed to change password');
    }
  };

  const handleDownloadMenu = () => {
    downloadMenuPdf(categories, menuItems, settings);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-stone-100">
            System & Business Settings
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure contact coordinates, taxes, delivery rates, admin credentials & live menu assets
          </p>
        </div>

        <button
          onClick={handleDownloadMenu}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-stone-900 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-colors shadow-md"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Generate Menu PDF</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 space-y-6 shadow-xl"
      >
        <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-stone-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span>Restaurant Contact & Profile Information</span>
          </h3>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Restaurant Brand Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Marathi Tagline
            </label>
            <input
              type="text"
              value={form.marathiTagline}
              onChange={(e) => setForm({ ...form, marathiTagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 font-marathi"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Primary Phone (Call & Inquiries) *
            </label>
            <input
              type="text"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              WhatsApp Order Phone (with country code) *
            </label>
            <input
              type="text"
              required
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Opening Hours Display
            </label>
            <input
              type="text"
              value={form.openingHours}
              onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">
            Complete Physical Address (Prints on Bills & Invoices) *
          </label>
          <textarea
            rows={2}
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">
            Google Maps Link
          </label>
          <input
            type="url"
            value={form.googleMapsUrl || ''}
            onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 font-mono"
          />
        </div>

        {/* Dining & Tax Policies */}
        <div className="pt-4 border-t border-stone-800 space-y-4">
          <h3 className="font-heading text-base font-bold text-stone-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Taxes & Dining Billing Rules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <input
                  type="checkbox"
                  id="tax-enabled"
                  checked={form.taxEnabled}
                  onChange={(e) => setForm({ ...form, taxEnabled: e.target.checked })}
                  className="rounded text-amber-500 bg-stone-950"
                />
                <label htmlFor="tax-enabled" className="text-xs font-semibold text-stone-300">
                  Enable GST / Tax on Dining Bills
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={28}
                  step={0.5}
                  value={form.taxGstPercentage}
                  onChange={(e) => setForm({ ...form, taxGstPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500">
                  % GST
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-400">Dine-In Exclusive Mode</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  12 Maval operates exclusively for table dining and reservations. Delivery fees are permanently disabled (₹0).
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Admin Password Change Form */}
      <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 space-y-4 shadow-xl">
        <h3 className="font-heading text-base font-bold text-stone-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Change Admin Password</span>
        </h3>

        {passwordMsg && (
          <p className="text-xs text-amber-400 font-semibold">{passwordMsg}</p>
        )}

        <form onSubmit={handleChangePassword} className="flex flex-col sm:flex-row items-end gap-3 max-w-xl">
          <div className="w-full sm:flex-1">
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 4 characters"
              className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
            />
          </div>

          <div className="w-full sm:flex-1">
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 transition-colors shrink-0"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};
