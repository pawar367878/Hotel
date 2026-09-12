export interface MenuItem {
  id: string;
  name: string;
  marathiName: string;
  description: string;
  price: number;
  category: string;
  image: string;
  badge?: 'Bestseller' | 'Popular' | 'Chef Special' | 'Fresh' | 'New' | '';
  isAvailable: boolean;
  isVegetarian: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy' | 'Extra Spicy';
  prepTime?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  marathiName: string;
  icon?: string;
  order: number;
}

export interface SpecialDish {
  id: string;
  name: string;
  marathiName: string;
  description: string;
  price: number;
  image: string;
  badge: string;
  order: number;
  isActive: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption?: string;
  order?: number;
  isActive?: boolean;
}

export interface ReviewItem {
  id: string;
  customerName?: string;
  name?: string;
  reviewText?: string;
  comment?: string;
  rating: number;
  visitType?: string;
  customerPhoto?: string;
  date?: string;
  isActive?: boolean;
}

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  couponCode: string;
  minOrderAmount?: number;
  startDate: string;
  endDate: string;
  image?: string;
  isActive: boolean;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  marathiTagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  openingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  currencySymbol: string;
  taxGstPercentage: number;
  taxEnabled: boolean;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  acceptingOrders: boolean;
}

export interface WebsiteContent {
  hero: {
    heading: string;
    marathiHeading: string;
    subtitle: string;
    image: string;
    badgeText: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  about: {
    heading: string;
    marathiHeading: string;
    description: string;
    image: string;
    features: string[];
    buttonText: string;
    buttonLink: string;
  };
  experience: {
    heading: string;
    subheading: string;
    chulhaTradition: string;
    freshMasala: string;
    familyAtmosphere: string;
  };
  familySection: {
    heading: string;
    description: string;
    image: string;
    stats: { label: string; value: string }[];
  };
  galleryHeading: {
    title: string;
    subtitle: string;
  };
  reviewsHeading: {
    title: string;
    subtitle: string;
  };
  contactSection: {
    title: string;
    subtitle: string;
    note: string;
  };
  footer: {
    aboutText: string;
    copyrightText: string;
  };
}

export interface CartItem {
  dish: MenuItem;
  quantity: number;
}

export type OrderType = 'Dine-In' | 'Takeaway' | 'Delivery';
export type OrderStatus = 'New' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface OrderItem {
  id: string;
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  orderType: OrderType;
  address?: string;
  specialInstructions?: string;
  tableNumber?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  appliedCoupon?: string;
  tax: number;
  deliveryCharge: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TableReservation {
  id: string;
  reservationNumber: string;
  customerName: string;
  phone: string;
  guests: number;
  date: string;
  timeSlot: string;
  seatingSection: string;
  tableNumber: string;
  specialRequests?: string;
  status: 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface PublicDataResponse {
  settings: RestaurantSettings;
  content: WebsiteContent;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  specialDishes: SpecialDish[];
  gallery: GalleryItem[];
  reviews: ReviewItem[];
  offers: OfferItem[];
  reservations?: TableReservation[];
}
