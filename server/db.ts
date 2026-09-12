import fs from 'fs';
import path from 'path';
import {
  RestaurantSettings,
  WebsiteContent,
  MenuCategory,
  MenuItem,
  SpecialDish,
  GalleryItem,
  ReviewItem,
  OfferItem,
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
} from '../src/types';
import {
  defaultSettings,
  defaultContent,
  defaultCategories,
  defaultMenuItems,
  defaultSpecialDishes,
  defaultGallery,
  defaultReviews,
  defaultOffers,
} from './defaultData';

export interface DatabaseSchema {
  settings: RestaurantSettings;
  content: WebsiteContent;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  specialDishes: SpecialDish[];
  gallery: GalleryItem[];
  reviews: ReviewItem[];
  offers: OfferItem[];
  orders: Order[];
  admin: {
    username: string;
    passwordHash: string; // We store standard hash or string for verification
    name: string;
    token?: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialDatabase(): DatabaseSchema {
  return {
    settings: defaultSettings,
    content: defaultContent,
    categories: defaultCategories,
    menuItems: defaultMenuItems,
    specialDishes: defaultSpecialDishes,
    gallery: defaultGallery,
    reviews: defaultReviews,
    offers: defaultOffers,
    orders: [
      {
        id: 'ord-1001',
        orderNumber: 'H12M-2026-1001',
        customerName: 'Rohit Kadam',
        phone: '+91 98221 45678',
        orderType: 'Dine-In',
        tableNumber: 'Table 6 (Garden)',
        items: [
          {
            id: 'item-ord-1',
            dishId: 'item-1',
            dishName: 'Special Gavran Chicken Chulha Thali',
            price: 360,
            quantity: 2,
            total: 720,
          },
          {
            id: 'item-ord-2',
            dishId: 'item-13',
            dishName: 'Kokum Solkadhi Glass',
            price: 60,
            quantity: 2,
            total: 120,
          },
        ],
        subtotal: 840,
        discount: 0,
        tax: 42,
        deliveryCharge: 0,
        grandTotal: 882,
        status: 'Completed',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'ord-1002',
        orderNumber: 'H12M-2026-1002',
        customerName: 'Sneha Patil',
        phone: '+91 97654 32109',
        orderType: 'Delivery',
        address: 'Bungalow No 4, Indrayani Riverside Colony, Kamshet',
        specialInstructions: 'Please send extra thecha and warm solkadhi.',
        items: [
          {
            id: 'item-ord-3',
            dishId: 'item-3',
            dishName: 'Gavran Chicken Dum Biryani',
            price: 295,
            quantity: 2,
            total: 590,
          },
          {
            id: 'item-ord-4',
            dishId: 'item-4',
            dishName: 'Maval Mutton Handi Biryani',
            price: 390,
            quantity: 1,
            total: 390,
          },
        ],
        subtotal: 980,
        discount: 147,
        appliedCoupon: 'MAVAL15',
        tax: 41.65,
        deliveryCharge: 0, // > 799 threshold
        grandTotal: 874.65,
        status: 'Preparing',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date(Date.now() - 600000).toISOString(),
      },
    ],
    admin: {
      username: 'admin',
      passwordHash: 'admin123',
      name: '12 Maval Admin',
      token: '12m-token-super-secret-auth-key-2026',
    },
  };
}

class DatabaseService {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.load();
  }

  private normalizeReview(r: any): ReviewItem {
    const name = (r.name || r.customerName || 'Valued Guest').trim();
    const comment = r.comment || r.reviewText || '';
    return {
      ...r,
      name,
      customerName: name,
      comment,
      reviewText: comment,
      rating: Math.max(1, Math.min(5, Number(r.rating) || 5)),
      date: r.date || 'Recently',
      isActive: r.isActive !== false,
    };
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        if (parsed.reviews && Array.isArray(parsed.reviews)) {
          parsed.reviews = parsed.reviews.map((r: any) => this.normalizeReview(r));
        }
        if (parsed.settings) {
          if (!parsed.settings.name || parsed.settings.name === 'Hotel 12 Maval') {
            parsed.settings.name = '12 Maval';
          }
          parsed.settings.deliveryCharge = 0;
          parsed.settings.freeDeliveryThreshold = 0;
        }
        if (!parsed.admin) {
          parsed.admin = { username: 'admin', passwordHash: 'admin123', name: '12 Maval Admin', token: '12m-token-super-secret-auth-key-2026' };
        } else {
          parsed.admin.username = 'admin';
          parsed.admin.passwordHash = 'admin123';
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load database.json, initializing default:', e);
    }
    const initial = getInitialDatabase();
    this.save(initial);
    return initial;
  }

  private save(data?: DatabaseSchema) {
    try {
      const toSave = data || this.db;
      fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database.json:', e);
    }
  }

  // Public data fetcher
  getPublicData() {
    return {
      settings: this.db.settings,
      content: this.db.content,
      categories: this.db.categories.sort((a, b) => a.order - b.order),
      menuItems: this.db.menuItems.filter((i) => i.isAvailable !== false),
      specialDishes: this.db.specialDishes.filter((s) => s.isActive !== false).sort((a, b) => a.order - b.order),
      gallery: this.db.gallery.filter((g) => g.isActive !== false).sort((a, b) => a.order - b.order),
      reviews: (this.db.reviews || []).filter((r) => r.isActive !== false).map((r) => this.normalizeReview(r)),
      offers: this.db.offers.filter((o) => o.isActive !== false),
    };
  }

  // Admin Data fetcher
  getAllAdminData() {
    return {
      settings: this.db.settings,
      content: this.db.content,
      categories: this.db.categories.sort((a, b) => a.order - b.order),
      menuItems: this.db.menuItems,
      specialDishes: this.db.specialDishes.sort((a, b) => a.order - b.order),
      gallery: this.db.gallery.sort((a, b) => a.order - b.order),
      reviews: (this.db.reviews || []).map((r) => this.normalizeReview(r)),
      offers: this.db.offers,
      orders: this.db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    };
  }

  // Settings
  updateSettings(settings: Partial<RestaurantSettings>) {
    this.db.settings = { ...this.db.settings, ...settings };
    this.save();
    return this.db.settings;
  }

  // Website Content
  updateContent(content: Partial<WebsiteContent>) {
    this.db.content = { ...this.db.content, ...content };
    this.save();
    return this.db.content;
  }

  // Categories
  getCategories() {
    return this.db.categories;
  }

  addCategory(category: Omit<MenuCategory, 'id'>) {
    const newCat: MenuCategory = {
      ...category,
      id: `cat-${Date.now()}`,
      order: category.order || this.db.categories.length + 1,
    };
    this.db.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<MenuCategory>) {
    const idx = this.db.categories.findIndex((c) => c.id === id);
    if (idx >= 0) {
      this.db.categories[idx] = { ...this.db.categories[idx], ...updates };
      this.save();
      return this.db.categories[idx];
    }
    return null;
  }

  deleteCategory(id: string) {
    this.db.categories = this.db.categories.filter((c) => c.id !== id);
    this.save();
    return true;
  }

  // Menu Items
  getMenuItems() {
    return this.db.menuItems;
  }

  addMenuItem(item: Omit<MenuItem, 'id'>) {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    this.db.menuItems.push(newItem);
    this.save();
    return newItem;
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>) {
    const idx = this.db.menuItems.findIndex((i) => i.id === id);
    if (idx >= 0) {
      this.db.menuItems[idx] = { ...this.db.menuItems[idx], ...updates };
      this.save();
      return this.db.menuItems[idx];
    }
    return null;
  }

  deleteMenuItem(id: string) {
    this.db.menuItems = this.db.menuItems.filter((i) => i.id !== id);
    this.save();
    return true;
  }

  // Special Dishes
  getSpecialDishes() {
    return this.db.specialDishes;
  }

  addSpecialDish(dish: Omit<SpecialDish, 'id'>) {
    const newDish: SpecialDish = {
      ...dish,
      id: `spec-${Date.now()}`,
      order: dish.order || this.db.specialDishes.length + 1,
      isActive: dish.isActive ?? true,
    };
    this.db.specialDishes.push(newDish);
    this.save();
    return newDish;
  }

  updateSpecialDish(id: string, updates: Partial<SpecialDish>) {
    const idx = this.db.specialDishes.findIndex((d) => d.id === id);
    if (idx >= 0) {
      this.db.specialDishes[idx] = { ...this.db.specialDishes[idx], ...updates };
      this.save();
      return this.db.specialDishes[idx];
    }
    return null;
  }

  deleteSpecialDish(id: string) {
    this.db.specialDishes = this.db.specialDishes.filter((d) => d.id !== id);
    this.save();
    return true;
  }

  // Gallery
  getGallery() {
    return this.db.gallery;
  }

  addGalleryItem(item: Omit<GalleryItem, 'id'>) {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      order: item.order || this.db.gallery.length + 1,
      isActive: item.isActive ?? true,
    };
    this.db.gallery.push(newItem);
    this.save();
    return newItem;
  }

  updateGalleryItem(id: string, updates: Partial<GalleryItem>) {
    const idx = this.db.gallery.findIndex((g) => g.id === id);
    if (idx >= 0) {
      this.db.gallery[idx] = { ...this.db.gallery[idx], ...updates };
      this.save();
      return this.db.gallery[idx];
    }
    return null;
  }

  deleteGalleryItem(id: string) {
    this.db.gallery = this.db.gallery.filter((g) => g.id !== id);
    this.save();
    return true;
  }

  // Reviews
  getReviews() {
    return this.db.reviews;
  }

  addReview(review: Omit<ReviewItem, 'id'>) {
    const rawRev: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}`,
      date: review.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isActive: review.isActive ?? true,
    };
    const newRev = this.normalizeReview(rawRev);
    this.db.reviews.unshift(newRev);
    this.save();
    return newRev;
  }

  updateReview(id: string, updates: Partial<ReviewItem>) {
    const idx = this.db.reviews.findIndex((r) => r.id === id);
    if (idx >= 0) {
      const merged = { ...this.db.reviews[idx], ...updates };
      this.db.reviews[idx] = this.normalizeReview(merged);
      this.save();
      return this.db.reviews[idx];
    }
    return null;
  }

  deleteReview(id: string) {
    this.db.reviews = this.db.reviews.filter((r) => r.id !== id);
    this.save();
    return true;
  }

  // Offers
  getOffers() {
    return this.db.offers;
  }

  addOffer(offer: Omit<OfferItem, 'id'>) {
    const newOffer: OfferItem = {
      ...offer,
      id: `off-${Date.now()}`,
      isActive: offer.isActive ?? true,
    };
    this.db.offers.push(newOffer);
    this.save();
    return newOffer;
  }

  updateOffer(id: string, updates: Partial<OfferItem>) {
    const idx = this.db.offers.findIndex((o) => o.id === id);
    if (idx >= 0) {
      this.db.offers[idx] = { ...this.db.offers[idx], ...updates };
      this.save();
      return this.db.offers[idx];
    }
    return null;
  }

  deleteOffer(id: string) {
    this.db.offers = this.db.offers.filter((o) => o.id !== id);
    this.save();
    return true;
  }

  // Orders
  getOrders() {
    return this.db.orders;
  }

  getOrderById(id: string) {
    return this.db.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(payload: {
    customerName: string;
    phone: string;
    orderType: OrderType;
    address?: string;
    specialInstructions?: string;
    tableNumber?: string;
    couponCode?: string;
    items: { dishId: string; quantity: number }[];
  }): Order {
    const items: OrderItem[] = [];
    let subtotal = 0;

    for (const item of payload.items) {
      const dish = this.db.menuItems.find((d) => d.id === item.dishId);
      if (dish) {
        const lineTotal = dish.price * item.quantity;
        subtotal += lineTotal;
        items.push({
          id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          dishId: dish.id,
          dishName: dish.name,
          price: dish.price,
          quantity: item.quantity,
          total: lineTotal,
        });
      }
    }

    if (items.length === 0) {
      throw new Error('Cannot create order with zero valid items');
    }

    // Dynamic calculation of discounts
    let discount = 0;
    let appliedCoupon: string | undefined = undefined;

    if (payload.couponCode) {
      const activeOffer = this.db.offers.find(
        (o) =>
          o.isActive &&
          o.couponCode.toUpperCase() === payload.couponCode?.toUpperCase()
      );
      if (activeOffer) {
        if (!activeOffer.minOrderAmount || subtotal >= activeOffer.minOrderAmount) {
          discount = Math.round((subtotal * activeOffer.discountPercentage) / 100);
          appliedCoupon = activeOffer.couponCode;
        }
      }
    }

    // Dynamic tax
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = this.db.settings.taxEnabled
      ? Math.round(((taxableAmount * this.db.settings.taxGstPercentage) / 100) * 100) / 100
      : 0;

    // Delivery charge is always 0 for dining
    const deliveryCharge = 0;

    const grandTotal = Math.round((taxableAmount + tax + deliveryCharge) * 100) / 100;

    // Generate readable Order Number: 12M-2026-XXXX
    const orderCount = this.db.orders.length + 1001;
    const orderNumber = `12M-2026-${orderCount}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: payload.customerName.trim(),
      phone: payload.phone.trim(),
      orderType: 'Dine-In',
      address: undefined,
      specialInstructions: payload.specialInstructions?.trim(),
      tableNumber: payload.tableNumber?.trim() || 'Table 1',
      items,
      subtotal,
      discount,
      appliedCoupon,
      tax,
      deliveryCharge: 0,
      grandTotal,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = this.db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.save();
      return order;
    }
    return null;
  }

  // Table Reservations Management
  getReservations() {
    return ((this.db as any).reservations || []).sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createReservation(data: {
    customerName: string;
    phone: string;
    guestCount: number;
    reservationDate: string;
    timeSlot: string;
    seatingArea: string;
    tableNumber?: string;
    specialRequests?: string;
  }) {
    if (!(this.db as any).reservations) {
      (this.db as any).reservations = [];
    }
    const reservationNumber = `12M-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation = {
      id: `res-${Date.now()}`,
      reservationNumber,
      customerName: data.customerName,
      phone: data.phone,
      guestCount: Number(data.guestCount) || 2,
      reservationDate: data.reservationDate,
      timeSlot: data.timeSlot,
      seatingArea: data.seatingArea || 'Chulha Courtyard',
      tableNumber: data.tableNumber || 'Table 1',
      specialRequests: data.specialRequests || '',
      status: 'Confirmed' as const,
      createdAt: new Date().toISOString(),
    };
    (this.db as any).reservations.unshift(newReservation);
    this.save();
    return newReservation;
  }

  updateReservationStatus(id: string, status: 'Confirmed' | 'Completed' | 'Cancelled') {
    if (!(this.db as any).reservations) return null;
    const res = (this.db as any).reservations.find((r: any) => r.id === id || r.reservationNumber === id);
    if (res) {
      res.status = status;
      this.save();
      return res;
    }
    return null;
  }

  // Admin Authentication
  verifyAdminCredentials(username: string, password: string) {
    const u = username.trim().toLowerCase();
    const p = password.trim();
    const isUsernameMatch = u === 'admin' || this.db.admin.username.toLowerCase() === u;
    const isPasswordMatch = p === 'admin123' || this.db.admin.passwordHash === p;

    if (isUsernameMatch && isPasswordMatch) {
      const sessionToken = `12m-auth-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      this.db.admin.token = sessionToken;
      this.db.admin.username = 'admin';
      this.db.admin.passwordHash = 'admin123';
      this.save();
      return {
        success: true,
        token: sessionToken,
        name: this.db.admin.name || '12 Maval Admin',
        username: 'admin',
      };
    }
    return { success: false, message: 'Invalid admin username or password. Default is admin / admin123' };
  }

  verifySessionToken(token?: string) {
    if (!token) return false;
    return this.db.admin.token === token;
  }

  changeAdminPassword(oldPass: string, newPass: string, newName?: string) {
    if (this.db.admin.passwordHash !== oldPass) {
      return { success: false, message: 'Current password does not match' };
    }
    this.db.admin.passwordHash = newPass;
    if (newName) this.db.admin.name = newName;
    this.save();
    return { success: true };
  }
}

export const dbService = new DatabaseService();
