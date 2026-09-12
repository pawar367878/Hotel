import { jsPDF } from 'jspdf';
import { Order, RestaurantSettings, MenuItem, MenuCategory } from '../types';

export function downloadBillPdf(order: Order, settings: RestaurantSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 27, 24);
  doc.text('12 MAVAL', pageWidth / 2, y, { align: 'center' });

  y += 7;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(180, 83, 9); // Gold/Amber
  doc.text('"Assal Chulichya Khandani Parampara"', pageWidth / 2, y, { align: 'center' });

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  const splitAddress = doc.splitTextToSize(settings.address, pageWidth - 40);
  doc.text(splitAddress, pageWidth / 2, y, { align: 'center' });
  y += splitAddress.length * 4.5;

  doc.text(`Phone: ${settings.phone}  |  WhatsApp: ${settings.whatsapp}`, pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setDrawColor(217, 119, 6); // Amber divider
  doc.setLineWidth(0.6);
  doc.line(15, y, pageWidth - 15, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text('BILL / ORDER RECEIPT', pageWidth / 2, y, { align: 'center' });

  // Order & Customer Details Box
  y += 8;
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, 'D');

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(55, 65, 81);

  doc.text(`Order No: `, 20, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.text(order.orderNumber, 40, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.text(`Date & Time: ${orderDate} at ${orderTime}`, pageWidth - 20, y + 6, { align: 'right' });

  doc.text(`Customer: `, 20, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.text(order.customerName, 40, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.text(`Phone: ${order.phone}`, pageWidth - 20, y + 13, { align: 'right' });

  doc.text(`Order Type: `, 20, y + 20);
  doc.setFont('helvetica', 'bold');
  doc.text(order.orderType, 42, y + 20);

  if (order.orderType === 'Delivery' && order.address) {
    doc.setFont('helvetica', 'normal');
    doc.text(`Address: ${order.address.substring(0, 45)}...`, 80, y + 20);
  } else if (order.tableNumber) {
    doc.setFont('helvetica', 'normal');
    doc.text(`Table: ${order.tableNumber}`, 80, y + 20);
  }

  // Items Table Header
  y += 35;
  doc.setFillColor(217, 119, 6);
  doc.rect(15, y, pageWidth - 30, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Item Description', 20, y + 5.5);
  doc.text('Qty', 115, y + 5.5, { align: 'center' });
  doc.text('Price (INR)', 145, y + 5.5, { align: 'right' });
  doc.text('Total (INR)', pageWidth - 20, y + 5.5, { align: 'right' });

  y += 8;

  // Items Rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(31, 41, 55);

  order.items.forEach((item, index) => {
    // Zebra striping
    if (index % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(15, y, pageWidth - 30, 7.5, 'F');
    }

    doc.text(item.dishName, 20, y + 5);
    doc.text(item.quantity.toString(), 115, y + 5, { align: 'center' });
    doc.text(`₹${item.price.toFixed(2)}`, 145, y + 5, { align: 'right' });
    doc.text(`₹${item.total.toFixed(2)}`, pageWidth - 20, y + 5, { align: 'right' });

    y += 7.5;
  });

  // Totals Section
  y += 4;
  doc.setDrawColor(209, 213, 219);
  doc.line(15, y, pageWidth - 15, y);

  y += 6;
  const totalsX = pageWidth - 65;
  const valuesX = pageWidth - 20;

  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, y);
  doc.text(`₹${order.subtotal.toFixed(2)}`, valuesX, y, { align: 'right' });

  if (order.discount > 0) {
    y += 5.5;
    doc.setTextColor(22, 101, 52);
    doc.text(`Discount (${order.appliedCoupon || 'Special'}):`, totalsX, y);
    doc.text(`- ₹${order.discount.toFixed(2)}`, valuesX, y, { align: 'right' });
    doc.setTextColor(31, 41, 55);
  }

  if (order.tax > 0) {
    y += 5.5;
    doc.text(`GST / Tax (${settings.taxGstPercentage}%):`, totalsX, y);
    doc.text(`₹${order.tax.toFixed(2)}`, valuesX, y, { align: 'right' });
  }

  if (order.deliveryCharge > 0) {
    y += 5.5;
    doc.text('Delivery Charge:', totalsX, y);
    doc.text(`₹${order.deliveryCharge.toFixed(2)}`, valuesX, y, { align: 'right' });
  }

  y += 7;
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.5);
  doc.line(totalsX - 5, y - 2, pageWidth - 15, y - 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(180, 83, 9);
  doc.text('Grand Total:', totalsX, y + 3.5);
  doc.text(`₹${order.grandTotal.toFixed(2)}`, valuesX, y + 3.5, { align: 'right' });

  // Footer Note
  y += 24;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text('Thank you for dining at 12 Maval!', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'italic');
  doc.text('"Assal Chavicha Punha Anand Ghya."', pageWidth / 2, y, { align: 'center' });

  doc.save(`12-Maval-Dining-Invoice-${order.orderNumber}.pdf`);
}

export function downloadMenuPdf(
  categories: MenuCategory[],
  menuItems: MenuItem[],
  settings: RestaurantSettings
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 18;

  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - 18) {
      doc.addPage();
      y = 18;
      // mini header on subsequent pages
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(180, 83, 9);
      doc.text('12 MAVAL  |  DINING MENU', pageWidth / 2, 12, { align: 'center' });
      doc.setDrawColor(229, 231, 235);
      doc.line(15, 14, pageWidth - 15, 14);
    }
  };

  // Header Banner
  doc.setFillColor(28, 25, 23); // Dark stone
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(251, 191, 36); // Rich Gold
  doc.text('12 MAVAL', pageWidth / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(254, 243, 199);
  doc.text('"Assal Chulichya Khandani Parampara" — Wood Fired Heritage Kitchen', pageWidth / 2, 23, {
    align: 'center',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(214, 211, 209);
  doc.text(`${settings.address}  •  Call: ${settings.phone}`, pageWidth / 2, 30, { align: 'center' });

  y = 48;

  // Categories Loop
  categories.forEach((cat) => {
    const itemsInCat = menuItems.filter(
      (m) =>
        m.category.toLowerCase().trim() === cat.name.toLowerCase().trim() ||
        m.category.toLowerCase().includes(cat.name.toLowerCase()) ||
        cat.name.toLowerCase().includes(m.category.toLowerCase())
    );

    if (itemsInCat.length === 0) return;

    checkPageBreak(25);

    // Category banner
    doc.setFillColor(245, 245, 244);
    doc.roundedRect(15, y, pageWidth - 30, 8, 1.5, 1.5, 'F');
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.4);
    doc.roundedRect(15, y, pageWidth - 30, 8, 1.5, 1.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9);
    doc.text(cat.name.toUpperCase(), 20, y + 5.5);

    y += 12;

    itemsInCat.forEach((dish) => {
      checkPageBreak(16);

      // Veg or Non-Veg dot
      doc.setFillColor(dish.isVegetarian ? 34 : 220, dish.isVegetarian ? 197 : 38, dish.isVegetarian ? 94 : 38);
      doc.circle(20, y + 2.5, 1.6, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(17, 24, 39);
      doc.text(dish.name, 25, y + 3.5);

      // Price
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 83, 9);
      doc.text(`₹${dish.price}`, pageWidth - 20, y + 3.5, { align: 'right' });

      // Description
      if (dish.description) {
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(107, 114, 128);
        const splitDesc = doc.splitTextToSize(dish.description, pageWidth - 55);
        doc.text(splitDesc, 25, y + 1.5);
        y += splitDesc.length * 3.8 + 2;
      } else {
        y += 6;
      }
    });

    y += 4;
  });

  // Footer on final page
  checkPageBreak(20);
  y += 6;
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageWidth - 15, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text('All rates are inclusive of applicable taxes. Freshly prepared for Table Dining.', pageWidth / 2, y, {
    align: 'center',
  });

  doc.save('12-Maval-Dining-Menu.pdf');
}
