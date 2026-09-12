import {
  PublicDataResponse,
  Order,
  OrderType,
  OrderStatus,
  TableReservation,
  MenuItem,
  MenuCategory,
  SpecialDish,
  GalleryItem,
  ReviewItem,
  OfferItem,
  RestaurantSettings,
  WebsiteContent,
} from '../types';

const getAuthHeader = () => {
  const token = localStorage.getItem('h12m_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Public APIs
  async getPublicData(): Promise<PublicDataResponse> {
    const res = await fetch('/api/public-data');
    if (!res.ok) throw new Error('Failed to fetch public data');
    return res.json();
  },

  async createOrder(payload: {
    customerName: string;
    phone: string;
    orderType: OrderType;
    address?: string;
    specialInstructions?: string;
    tableNumber?: string;
    couponCode?: string;
    items: { dishId: string; quantity: number }[];
  }): Promise<{ success: boolean; order: Order }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  // Table Reservations
  async createReservation(payload: {
    customerName: string;
    phone: string;
    guestCount: number;
    reservationDate: string;
    timeSlot: string;
    seatingArea: string;
    tableNumber?: string;
    specialRequests?: string;
  }): Promise<{ success: boolean; reservation: TableReservation }> {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to book table');
    return data;
  },

  async getReservations(): Promise<TableReservation[]> {
    const res = await fetch('/api/admin/reservations', {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch reservations');
    return res.json();
  },

  async updateReservationStatus(
    id: string,
    status: 'Confirmed' | 'Completed' | 'Cancelled'
  ): Promise<{ success: boolean; reservation: TableReservation }> {
    const res = await fetch(`/api/admin/reservations/${id}/status`, {
      method: 'PUT',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update reservation');
    return data;
  },

  // Admin Auth APIs
  async adminLogin(usernameOrPassword: string, maybePassword?: string) {
    const username = maybePassword !== undefined ? usernameOrPassword : 'admin';
    const password = maybePassword !== undefined ? maybePassword : usernameOrPassword;

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  adminLogout() {
    localStorage.removeItem('h12m_admin_token');
  },

  async adminVerify(): Promise<boolean> {
    const token = localStorage.getItem('h12m_admin_token');
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/verify', {
        headers: getAuthHeader(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async adminChangePassword(oldPassword: string, newPassword: string, newName?: string) {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ oldPassword, newPassword, newName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update password');
    return data;
  },

  // Admin Data & Management
  async adminGetAllData() {
    const res = await fetch('/api/admin/all-data', {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load admin data');
    return res.json();
  },

  async adminUpdateSettings(settings: Partial<RestaurantSettings>) {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data.settings;
  },

  async adminUpdateContent(content: Partial<WebsiteContent>) {
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(content),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update content');
    return data.content;
  },

  async adminGetOrders(): Promise<Order[]> {
    const res = await fetch('/api/admin/orders', {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load orders');
    return res.json();
  },

  async adminUpdateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status');
    return data.order;
  },

  // Menu items CRUD
  async adminAddMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const res = await fetch('/api/admin/menu/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to add dish');
    return res.json();
  },

  async adminUpdateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`/api/admin/menu/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update dish');
    return res.json();
  },

  async adminDeleteMenuItem(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/menu/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete dish');
    return true;
  },

  // Categories CRUD
  async adminAddCategory(cat: Omit<MenuCategory, 'id'>): Promise<MenuCategory> {
    const res = await fetch('/api/admin/menu/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(cat),
    });
    if (!res.ok) throw new Error('Failed to add category');
    return res.json();
  },

  async adminUpdateCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory> {
    const res = await fetch(`/api/admin/menu/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  async adminDeleteCategory(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/menu/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return true;
  },

  // Special Dishes CRUD
  async adminAddSpecialDish(dish: Omit<SpecialDish, 'id'>): Promise<SpecialDish> {
    const res = await fetch('/api/admin/special-dishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(dish),
    });
    if (!res.ok) throw new Error('Failed to add special dish');
    return res.json();
  },

  async adminUpdateSpecialDish(id: string, updates: Partial<SpecialDish>): Promise<SpecialDish> {
    const res = await fetch(`/api/admin/special-dishes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update special dish');
    return res.json();
  },

  async adminDeleteSpecialDish(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/special-dishes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete special dish');
    return true;
  },

  // Gallery CRUD
  async adminAddGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to add gallery item');
    return res.json();
  },

  async adminUpdateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update gallery item');
    return res.json();
  },

  async adminDeleteGalleryItem(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete gallery item');
    return true;
  },

  // Reviews CRUD
  async adminAddReview(item: Omit<ReviewItem, 'id'>): Promise<ReviewItem> {
    const res = await fetch('/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to add review');
    return res.json();
  },

  async adminUpdateReview(id: string, updates: Partial<ReviewItem>): Promise<ReviewItem> {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update review');
    return res.json();
  },

  async adminDeleteReview(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete review');
    return true;
  },

  // Offers CRUD
  async adminAddOffer(item: Omit<OfferItem, 'id'>): Promise<OfferItem> {
    const res = await fetch('/api/admin/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to add offer');
    return res.json();
  },

  async adminUpdateOffer(id: string, updates: Partial<OfferItem>): Promise<OfferItem> {
    const res = await fetch(`/api/admin/offers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update offer');
    return res.json();
  },

  async adminDeleteOffer(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/offers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete offer');
    return true;
  },

  // File / Image Upload
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Image upload failed');
    return data.url;
  },

  // Aliases for unified calling convention
  getOrders() {
    return this.adminGetOrders();
  },
  updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.adminUpdateOrderStatus(orderId, status);
  },
  updateSettings(settings: Partial<RestaurantSettings>) {
    return this.adminUpdateSettings(settings);
  },
  updateContent(content: Partial<WebsiteContent>) {
    return this.adminUpdateContent(content);
  },
  changePassword(newPassword: string) {
    return this.adminChangePassword('', newPassword);
  },
  createMenuItem(item: Omit<MenuItem, 'id'>) {
    return this.adminAddMenuItem(item);
  },
  updateMenuItem(id: string, updates: Partial<MenuItem>) {
    return this.adminUpdateMenuItem(id, updates);
  },
  deleteMenuItem(id: string) {
    return this.adminDeleteMenuItem(id);
  },
  createCategory(cat: Omit<MenuCategory, 'id'>) {
    return this.adminAddCategory(cat);
  },
  updateCategory(id: string, updates: Partial<MenuCategory>) {
    return this.adminUpdateCategory(id, updates);
  },
  deleteCategory(id: string) {
    return this.adminDeleteCategory(id);
  },
  createSpecialDish(dish: Omit<SpecialDish, 'id'>) {
    return this.adminAddSpecialDish(dish);
  },
  updateSpecialDish(id: string, updates: Partial<SpecialDish>) {
    return this.adminUpdateSpecialDish(id, updates);
  },
  deleteSpecialDish(id: string) {
    return this.adminDeleteSpecialDish(id);
  },
  createGalleryItem(item: Omit<GalleryItem, 'id'>) {
    return this.adminAddGalleryItem(item);
  },
  deleteGalleryItem(id: string) {
    return this.adminDeleteGalleryItem(id);
  },
  async submitPublicReview(data: { name: string; rating: number; comment: string; visitType?: string }) {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit review');
    }
    return res.json();
  },

  createReview(item: Partial<ReviewItem>) {
    const token = localStorage.getItem('h12m_admin_token');
    if (token) {
      return this.adminAddReview(item as Omit<ReviewItem, 'id'>);
    }
    return this.submitPublicReview({
      name: item.name || item.customerName || 'Guest',
      rating: item.rating || 5,
      comment: item.comment || item.reviewText || '',
      visitType: item.visitType || 'Verified Diner',
    });
  },
  updateReview(id: string, updates: Partial<ReviewItem>) {
    return this.adminUpdateReview(id, updates);
  },
  deleteReview(id: string) {
    return this.adminDeleteReview(id);
  },
  createOffer(item: Omit<OfferItem, 'id'>) {
    return this.adminAddOffer(item);
  },
  updateOffer(id: string, updates: Partial<OfferItem>) {
    return this.adminUpdateOffer(id, updates);
  },
  deleteOffer(id: string) {
    return this.adminDeleteOffer(id);
  },
};
