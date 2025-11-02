# 🛍️ EcomStore - Modern E-commerce with Telemetry

A beautiful, fully-functional e-commerce frontend built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**, featuring built-in **telemetry and monitoring** for real-time system health tracking.

Built for the **Hypernova Hackathon** 🚀

---

## ✨ Features

### 🎨 Design & UI
- **Modern, clean interface** inspired by Shopify + Apple Store aesthetics
- **Pastel blue & purple color scheme** with smooth gradients
- **Fully responsive** design (desktop, tablet, mobile)
- **Smooth animations** and hover effects
- **Tailwind CSS** for rapid styling

### 🛒 E-commerce Functionality
- Product gallery with category filtering
- Individual product detail pages
- Shopping cart with quantity management
- Checkout flow (simulated)
- LocalStorage persistence for cart
- Dynamic cart badge in header

### 📊 Telemetry & Monitoring
- **Real-time system health indicator** in header (green/yellow/red)
- **Monitor Panel** with live metrics:
  - CPU Usage
  - Memory Usage
  - API Response Time
  - Error Count
  - Event Count
- **Comprehensive logging**:
  - User events (clicks, page views, searches)
  - API calls with latency tracking
  - Error reporting with severity levels
- **"Simulate Incident" button** for demo purposes
- All telemetry data logged to console (easily extensible to real backend)

### 🏗️ Architecture
- **Next.js 14 App Router** with TypeScript
- **Client-side rendering** where needed (`'use client'`)
- **Modular component structure**
- **Centralized API layer** (`src/lib/api.ts`)
- **Telemetry service singleton** (`src/lib/telemetry.ts`)
- **Type-safe** throughout

---

## 📂 Project Structure

```
frontend/
├── public/
│   └── images/              # Static assets (if needed)
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with Header, Footer, Monitor
│   │   ├── page.tsx         # Home page with product gallery
│   │   ├── cart/
│   │   │   └── page.tsx     # Shopping cart page
│   │   └── products/
│   │       └── [id]/
│   │           └── page.tsx # Product detail page
│   ├── components/
│   │   ├── Header.tsx       # Navigation + search + cart + health status
│   │   ├── Footer.tsx       # Footer with live timestamp
│   │   ├── ProductCard.tsx  # Individual product card
│   │   ├── ProductGallery.tsx # Product grid with category filter
│   │   ├── CartItem.tsx     # Cart item with quantity controls
│   │   └── MonitorPanel.tsx # Floating telemetry monitor
│   ├── lib/
│   │   ├── api.ts           # API functions (products, cart, checkout)
│   │   └── telemetry.ts     # Telemetry service (logging, metrics, errors)
│   ├── styles/
│   │   └── globals.css      # Global styles + Tailwind setup
│   ├── data/
│   │   └── products.json    # Product catalog (12 sample products)
│   └── tests/
│       └── (future unit tests)
├── tailwind.config.js       # Tailwind configuration
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Dependencies
└── README.md                # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**

### Installation

1. **Navigate to the frontend directory:**
   ```powershell
   cd j:\hypernovahackathon\frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Run the development server:**
   ```powershell
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

That's it! The site should load instantly. 🎉

---

## 🎮 Usage Guide

### Home Page
- Browse all products in a beautiful grid layout
- Filter by category (Electronics, Accessories, Fitness, etc.)
- Click "Add to Cart" on any product
- Click a product card to view details

### Product Detail Page
- View full product information
- See ratings, stock status, and description
- Adjust quantity before adding to cart
- Navigate back to shopping or proceed to cart

### Shopping Cart
- View all items in your cart
- Adjust quantities with +/- buttons
- Remove items with the delete button
- See real-time price calculations (subtotal, tax, total)
- Click "Proceed to Checkout" to complete order (simulated)

### Telemetry Monitor
- Click the **"Monitor"** button in bottom-right corner
- View live system metrics updating every 2 seconds
- Watch CPU, Memory, and Response Time graphs
- See event and error counts
- Click **"Simulate Incident"** to trigger a demo system failure
  - System health will turn red
  - Metrics will spike
  - Auto-recovery after 10 seconds

### Header Status Light
- **Green pulse**: System healthy
- **Yellow pulse**: Performance degraded
- **Red pulse**: System error/incident

---

## 📡 Telemetry Integration Points

All telemetry functions are imported from `src/lib/telemetry.ts`:

### Event Logging
```typescript
import { logEvent } from '@/lib/telemetry';

logEvent('user_action', { 
  action: 'clicked_button', 
  productId: 123 
});
```

### Metric Recording
```typescript
import { recordMetric } from '@/lib/telemetry';

recordMetric('api_latency', 245, 'ms');
```

### Error Reporting
```typescript
import { reportError } from '@/lib/telemetry';

reportError(
  new Error('API failed'), 
  'high', 
  { endpoint: '/api/products' }
);
```

### Current Integration Points:
- ✅ Page views (all pages)
- ✅ Product card clicks
- ✅ Add to cart actions
- ✅ Cart quantity updates
- ✅ Checkout completion
- ✅ API call timing
- ✅ Search queries
- ✅ Component lifecycle events
- ✅ Error boundaries (ready for implementation)

---

## 🔌 Backend Integration Guide

### API Endpoints (Ready to Connect)

All mock API calls in `src/lib/api.ts` can be easily replaced with real fetch calls:

#### Products API
```typescript
// Current: import from JSON
// Replace with:
export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('https://your-backend.com/api/products');
  return response.json();
}
```

#### Cart API
```typescript
// Current: localStorage
// Replace with:
export async function addToCart(product: Product, quantity: number) {
  await fetch('https://your-backend.com/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: product.id, quantity }),
  });
}
```

#### Telemetry API
```typescript
// Current: console.log
// Replace sendToMockAPI() in telemetry.ts with:
private sendToAPI(endpoint: string, data: any): void {
  fetch(`https://your-backend.com${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
```

---

## 🧪 Testing

Unit tests can be added to `src/tests/`. Example structure:

```typescript
// src/tests/telemetry.test.ts
import { logEvent, getMetrics } from '@/lib/telemetry';

describe('Telemetry Service', () => {
  it('should log events', () => {
    logEvent('test_event', { foo: 'bar' });
    // Assert event was logged
  });
});
```

To run tests (after setup):
```powershell
npm test
```

---

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: { /* blue shades */ },
  secondary: { /* purple shades */ },
}
```

### Products
Edit `src/data/products.json` to add/modify products:
```json
{
  "id": 13,
  "name": "Your Product",
  "price": 99.99,
  "description": "...",
  "image": "https://...",
  "category": "Your Category",
  "stock": 50,
  "rating": 4.5
}
```

### Telemetry Thresholds
Edit `src/lib/telemetry.ts` to adjust health status thresholds:
```typescript
if (this.errorCount > 10) {
  this.healthStatus = 'error';
} else if (this.errorCount > 5) {
  this.healthStatus = 'degraded';
}
```

---

## 🚧 Future Enhancements

### Suggested Features:
- [ ] User authentication
- [ ] Product search functionality
- [ ] Wishlist/favorites
- [ ] Order history
- [ ] Product reviews
- [ ] Dark mode toggle
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced filtering (price range, ratings)
- [ ] Recommended products
- [ ] Real-time inventory sync
- [ ] Error boundary implementation
- [ ] Unit and integration tests
- [ ] Storybook for component documentation

---

## 📦 Dependencies

### Core
- **next**: ^14.2.0
- **react**: ^18.3.0
- **react-dom**: ^18.3.0
- **typescript**: ^5.4.0

### Styling
- **tailwindcss**: ^3.4.3
- **autoprefixer**: ^10.4.19
- **postcss**: ^8.4.38

### Development
- **@types/node**: ^20.12.0
- **@types/react**: ^18.3.0
- **@types/react-dom**: ^18.3.0
- **eslint**: ^8.57.0
- **eslint-config-next**: ^14.2.0

---

## 🏗️ Build for Production

```powershell
npm run build
npm start
```

The production build will be optimized and ready to deploy to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting

---

## 🤝 Contributing

This is a hackathon demo project, but contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own e-commerce site!

---

## 👨‍💻 Author

Built with ❤️ for the **Hypernova Hackathon**

**Tech Stack:**
- ⚛️ Next.js 14 (App Router)
- 📘 TypeScript
- 🎨 Tailwind CSS
- 📊 Custom Telemetry System
- 🏪 E-commerce Best Practices

---

## 🎯 Hackathon Highlights

### Key Features for Demo:
1. **Real-time Telemetry Dashboard** - Show live metrics updating
2. **Simulate Incident Button** - Demonstrate error handling
3. **Smooth UX** - Fast, responsive, beautiful
4. **Production-Ready Code** - Clean, typed, documented
5. **Easy Backend Integration** - Clear API layer ready to connect

### Demo Script:
1. Open homepage → Show product gallery
2. Filter by category → Demonstrate smooth filtering
3. Open Monitor Panel → Show live metrics
4. Add products to cart → Watch cart badge update
5. Click "Simulate Incident" → System turns red, recovers automatically
6. Go to cart → Adjust quantities
7. Checkout → Success animation
8. Show browser console → All telemetry events logged

---

## 📞 Support

For questions or issues:
- Check the code comments (heavily documented)
- Review the console logs (all telemetry visible)
- Open an issue on GitHub

---

**Happy Coding! 🚀**
