import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { dbService } from './server/db';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure public uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve public uploads statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `img-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Admin authentication middleware
const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

  if (!token || !dbService.verifySessionToken(token)) {
    res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
    return;
  }
  next();
};

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: '12 Maval API' });
});

// Public Website Data (Settings, Menu, Content, Specialties, Reviews, Offers, Gallery)
app.get('/api/public-data', (_req, res) => {
  try {
    const data = dbService.getPublicData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching public data:', error);
    res.status(500).json({ error: 'Failed to load restaurant data' });
  }
});

// Create Customer Order
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, phone, address, specialInstructions, tableNumber, couponCode, items } = req.body;
    const orderType = req.body.orderType || 'Dine-In';

    if (!customerName || !phone || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Please provide all required order details.' });
      return;
    }

    if (orderType === 'Delivery' && (!address || address.trim().length === 0)) {
      res.status(400).json({ error: 'Delivery address is required for delivery orders.' });
      return;
    }

    const order = dbService.createOrder({
      customerName,
      phone,
      orderType,
      address,
      specialInstructions,
      tableNumber,
      couponCode,
      items,
    });

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    console.error('Error placing order:', error);
    res.status(400).json({ error: error.message || 'Failed to place order.' });
  }
});

// Fetch Single Order by ID or Order Number
app.get('/api/orders/:id', (req, res) => {
  try {
    const order = dbService.getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// Create Table Dining Reservation
app.post('/api/reservations', (req, res) => {
  try {
    const { customerName, phone, guestCount, reservationDate, timeSlot, seatingArea, tableNumber, specialRequests } = req.body;
    if (!customerName || !phone || !reservationDate || !timeSlot) {
      res.status(400).json({ error: 'Please provide name, phone, date, and preferred time slot.' });
      return;
    }
    const reservation = dbService.createReservation({
      customerName,
      phone,
      guestCount: Number(guestCount) || 2,
      reservationDate,
      timeSlot,
      seatingArea: seatingArea || 'Chulha Courtyard',
      tableNumber: tableNumber || 'Table 1',
      specialRequests,
    });
    res.status(201).json({ success: true, reservation });
  } catch (error: any) {
    console.error('Error creating table reservation:', error);
    res.status(500).json({ error: 'Failed to confirm reservation. Please call restaurant directly.' });
  }
});

// Get Reservations (Admin)
app.get('/api/admin/reservations', requireAdmin, (_req, res) => {
  try {
    const reservations = dbService.getReservations();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch table reservations' });
  }
});

// Update Reservation Status (Admin)
app.put('/api/admin/reservations/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const updated = dbService.updateReservationStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }
    res.json({ success: true, reservation: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reservation status' });
  }
});

// Public Customer Review Submission
app.post('/api/reviews', (req, res) => {
  try {
    const { name, customerName, comment, reviewText, rating } = req.body;
    const author = (name || customerName || '').trim();
    const feedback = (comment || reviewText || '').trim();

    if (!author || !feedback) {
      res.status(400).json({ error: 'Please provide both your name and review comments.' });
      return;
    }

    const review = dbService.addReview({
      name: author,
      customerName: author,
      comment: feedback,
      reviewText: feedback,
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      visitType: req.body.visitType || 'Verified Diner',
      isActive: true,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Error submitting public review:', error);
    res.status(500).json({ error: 'Failed to submit review. Please try again.' });
  }
});

// ==========================================
// ADMIN AUTHENTICATION ROUTES
// ==========================================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const result = dbService.verifyAdminCredentials(username, password);
  if (!result.success) {
    res.status(401).json({ error: result.message });
    return;
  }

  res.json(result);
});

// Admin Verify Token
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

  if (token && dbService.verifySessionToken(token)) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

// Admin Change Password
app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  const { oldPassword, newPassword, newName } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400).json({ error: 'Old and new passwords are required' });
    return;
  }
  const result = dbService.changeAdminPassword(oldPassword, newPassword, newName);
  if (!result.success) {
    res.status(400).json({ error: result.message });
    return;
  }
  res.json({ success: true, message: 'Password updated successfully' });
});

// ==========================================
// ADMIN MANAGEMENT ROUTES (PROTECTED)
// ==========================================

// Get All Data for Admin Panel
app.get('/api/admin/all-data', requireAdmin, (_req, res) => {
  try {
    const allData = dbService.getAllAdminData();
    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin data' });
  }
});

// Update Restaurant Settings
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const updated = dbService.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update restaurant settings' });
  }
});

// Update Website CMS Content
app.put('/api/admin/content', requireAdmin, (req, res) => {
  try {
    const updated = dbService.updateContent(req.body);
    res.json({ success: true, content: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update website content' });
  }
});

// Get Orders for Admin
app.get('/api/admin/orders', requireAdmin, (_req, res) => {
  try {
    const orders = dbService.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update Order Status
app.patch('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const updated = dbService.updateOrderStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ success: true, order: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Menu Categories CRUD
app.post('/api/admin/menu/categories', requireAdmin, (req, res) => {
  try {
    const newCat = dbService.addCategory(req.body);
    res.status(201).json(newCat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category' });
  }
});

app.put('/api/admin/menu/categories/:id', requireAdmin, (req, res) => {
  try {
    const updated = dbService.updateCategory(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/admin/menu/categories/:id', requireAdmin, (req, res) => {
  try {
    dbService.deleteCategory(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Menu Items CRUD
app.post('/api/admin/menu/items', requireAdmin, (req, res) => {
  try {
    const newItem = dbService.addMenuItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

app.put('/api/admin/menu/items/:id', requireAdmin, (req, res) => {
  try {
    const updated = dbService.updateMenuItem(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

app.delete('/api/admin/menu/items/:id', requireAdmin, (req, res) => {
  try {
    dbService.deleteMenuItem(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Special Dishes CRUD
app.post('/api/admin/special-dishes', requireAdmin, (req, res) => {
  try {
    const newDish = dbService.addSpecialDish(req.body);
    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add special dish' });
  }
});

app.put('/api/admin/special-dishes/:id', requireAdmin, (req, res) => {
  try {
    const updated = dbService.updateSpecialDish(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update special dish' });
  }
});

app.delete('/api/admin/special-dishes/:id', requireAdmin, (req, res) => {
  try {
    dbService.deleteSpecialDish(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete special dish' });
  }
});

// Gallery CRUD
app.post('/api/admin/gallery', requireAdmin, (req, res) => {
  try {
    const newItem = dbService.addGalleryItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

app.put('/api/admin/gallery/:id', requireAdmin, (req, res) => {
  try {
    const updated = dbService.updateGalleryItem(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

app.delete('/api/admin/gallery/:id', requireAdmin, (req, res) => {
  try {
    dbService.deleteGalleryItem(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// Reviews CRUD
app.post('/api/admin/reviews', requireAdmin, (req, res) => {
  try {
    const newRev = dbService.addReview(req.body);
    res.status(201).json(newRev);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

app.put('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  try {
    const updated = dbService.updateReview(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

app.delete('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  try {
    dbService.deleteReview(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Offers CRUD
app.post('/api/admin/offers', requireAdmin, (req, res) => {
  try {
    const newOffer = dbService.addOffer(req.body);
    res.status(201).json(newOffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add offer' });
  }
});

app.put('/api/admin/offers/:id', requireAdmin, (req, res) => {
  try {
    const updated = dbService.updateOffer(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update offer' });
  }
});

app.delete('/api/admin/offers/:id', requireAdmin, (req, res) => {
  try {
    dbService.deleteOffer(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete offer' });
  }
});

// Image Upload Endpoint (Supports file or base64)
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (req.file) {
      const publicUrl = `/uploads/${req.file.filename}`;
      res.json({ success: true, url: publicUrl });
      return;
    }

    // Check base64 in body
    const { base64, filename } = req.body;
    if (base64) {
      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || 'jpg';
        const buffer = Buffer.from(matches[2], 'base64');
        const fname = `upload-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fname);
        fs.writeFileSync(filePath, buffer);
        res.json({ success: true, url: `/uploads/${fname}` });
        return;
      }
    }

    res.status(400).json({ error: 'No image file or valid base64 provided' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// ==========================================
// VITE OR STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`12 Maval server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
