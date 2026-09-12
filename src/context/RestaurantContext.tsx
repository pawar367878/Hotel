import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RestaurantSettings,
  WebsiteContent,
  MenuCategory,
  MenuItem,
  SpecialDish,
  GalleryItem,
  ReviewItem,
  OfferItem,
  CartItem,
  Order,
  OrderType,
} from '../types';
import { defaultSettings, defaultContent, defaultCategories, defaultMenuItems, defaultSpecialDishes, defaultGallery, defaultReviews, defaultOffers } from '../../server/defaultData';
import { api } from '../services/api';

interface RestaurantContextType {
  settings: RestaurantSettings;
  content: WebsiteContent;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  specialDishes: SpecialDish[];
  gallery: GalleryItem[];
  reviews: ReviewItem[];
  offers: OfferItem[];
  isLoading: boolean;
  refreshPublicData: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (dish: MenuItem, quantity?: number) => void;
  updateQuantity: (dishId: string, delta: number) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;
  totalCartItems: number;
  subtotal: number;
  appliedCoupon: OfferItem | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discount: number;
  calculateTax: (subtotal: number, discount: number) => number;
  calculateDeliveryCharge: (subtotal: number, orderType: OrderType) => number;
  calculateGrandTotal: (orderType: OrderType) => number;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  confirmedOrder: Order | null;
  setConfirmedOrder: (order: Order | null) => void;
  viewingBillOrder: Order | null;
  setViewingBillOrder: (order: Order | null) => void;
  isPrintMenuOpen: boolean;
  setIsPrintMenuOpen: (open: boolean) => void;

  // Toast
  toast: { message: string; type: 'success' | 'info' | 'error'; visible: boolean };
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Admin Navigation
  isAdminView: boolean;
  setIsAdminView: (view: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings);
  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [categories, setCategories] = useState<MenuCategory[]>(defaultCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [specialDishes, setSpecialDishes] = useState<SpecialDish[]>(defaultSpecialDishes);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [reviews, setReviews] = useState<ReviewItem[]>(defaultReviews);
  const [offers, setOffers] = useState<OfferItem[]>(defaultOffers);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('h12m_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<OfferItem | null>(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [viewingBillOrder, setViewingBillOrder] = useState<Order | null>(null);
  const [isPrintMenuOpen, setIsPrintMenuOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  // Admin state
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash.includes('admin');
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('h12m_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Check admin session on mount
  useEffect(() => {
    api.adminVerify().then((valid) => {
      setIsAdminLoggedIn(valid);
    });
  }, []);

  // Fetch live public data
  const refreshPublicData = async () => {
    try {
      setIsLoading(true);
      const data = await api.getPublicData();
      if (data.settings) setSettings(data.settings);
      if (data.content) setContent(data.content);
      if (data.categories) setCategories(data.categories);
      if (data.menuItems) setMenuItems(data.menuItems);
      if (data.specialDishes) setSpecialDishes(data.specialDishes);
      if (data.gallery) setGallery(data.gallery);
      if (data.reviews) setReviews(data.reviews);
      if (data.offers) setOffers(data.offers);
    } catch (err) {
      console.error('Could not load public data from server, using cached/defaults:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPublicData();
  }, []);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  // Cart operations
  const addToCart = (dish: MenuItem, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { dish, quantity }];
    });
    showToast(`✓ Added "${dish.name}" to cart!`);
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const offer = offers.find((o) => o.isActive && o.couponCode.toUpperCase() === cleanCode);
    if (!offer) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (offer.minOrderAmount && subtotal < offer.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount of ₹${offer.minOrderAmount} required for this coupon.`,
      };
    }
    setAppliedCoupon(offer);
    showToast(`Coupon ${offer.couponCode} applied: ${offer.discountPercentage}% OFF!`);
    return { success: true, message: `Applied ${offer.discountPercentage}% discount!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const discount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discountPercentage) / 100)
    : 0;

  const calculateTax = (sub: number, disc: number) => {
    if (!settings.taxEnabled) return 0;
    const taxable = Math.max(0, sub - disc);
    return Math.round(((taxable * settings.taxGstPercentage) / 100) * 100) / 100;
  };

  const calculateDeliveryCharge = (sub: number, orderType: OrderType) => {
    if (orderType !== 'Delivery') return 0;
    if (sub >= settings.freeDeliveryThreshold) return 0;
    return settings.deliveryCharge;
  };

  const calculateGrandTotal = (orderType: OrderType) => {
    const tax = calculateTax(subtotal, discount);
    const del = calculateDeliveryCharge(subtotal, orderType);
    return Math.round((Math.max(0, subtotal - discount) + tax + del) * 100) / 100;
  };

  return (
    <RestaurantContext.Provider
      value={{
        settings,
        content,
        categories,
        menuItems,
        specialDishes,
        gallery,
        reviews,
        offers,
        isLoading,
        refreshPublicData,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCartItems,
        subtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discount,
        calculateTax,
        calculateDeliveryCharge,
        calculateGrandTotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        confirmedOrder,
        setConfirmedOrder,
        viewingBillOrder,
        setViewingBillOrder,
        isPrintMenuOpen,
        setIsPrintMenuOpen,
        toast,
        showToast,
        isAdminView,
        setIsAdminView,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
