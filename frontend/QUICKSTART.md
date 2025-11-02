# 🚀 QUICKSTART GUIDE

## One-Command Setup

Run this in PowerShell from the `frontend` directory:

```powershell
npm install; npm run dev
```

That's it! The site will be running at [http://localhost:3000](http://localhost:3000)

---

## Step-by-Step Setup

### 1. Check Node Version
```powershell
node --version
```
Should be v18 or higher.

### 2. Navigate to Frontend Directory
```powershell
cd j:\hypernovahackathon\frontend
```

### 3. Install Dependencies
```powershell
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- All dev dependencies

Expected install time: **30-60 seconds**

### 4. Start Development Server
```powershell
npm run dev
```

You should see:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
```

### 5. Open in Browser
Navigate to: [http://localhost:3000](http://localhost:3000)

---

## 🎮 First Actions

1. **Browse Products**: Scroll through the product gallery on the home page
2. **Filter Categories**: Click category buttons above the products
3. **Open Monitor**: Click the blue "Monitor" button in the bottom-right
4. **Add to Cart**: Click "Add to Cart" on any product
5. **View Details**: Click on a product card to see details
6. **Simulate Incident**: In the Monitor panel, click "Simulate Incident"
7. **Checkout**: Go to cart and complete a test order

---

## 🔍 Verify Installation

Check that these files exist:

```
✅ package.json
✅ next.config.js
✅ tailwind.config.js
✅ tsconfig.json
✅ src/app/layout.tsx
✅ src/app/page.tsx
✅ src/components/Header.tsx
✅ src/lib/telemetry.ts
✅ src/data/products.json
✅ README.md
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```powershell
npm run dev -- -p 3001
```

### Dependencies Won't Install
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### TypeScript Errors
These are expected before `npm install`. They'll disappear after dependencies are installed.

### Build Errors
```powershell
npm run build
```
Should complete without errors.

---

## 📊 Available Scripts

```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 🎯 What to Demo

### For Judges:
1. **Telemetry Dashboard**: Real-time metrics updating
2. **Error Simulation**: "Simulate Incident" button
3. **Clean UI**: Responsive design, smooth animations
4. **Type Safety**: Show TypeScript definitions
5. **Code Quality**: Show component structure

### For Technical Review:
1. **Browser Console**: Show telemetry events logging
2. **Network Tab**: Show simulated API calls
3. **React DevTools**: Show component hierarchy
4. **localStorage**: Show cart persistence

---

## 🚀 Ready for Production?

To deploy:

```powershell
npm run build
npm start
```

Or deploy to Vercel (recommended):
```powershell
npm install -g vercel
vercel
```

---

**Questions?** Check the main [README.md](README.md) for full documentation.

**Happy Hacking! 🎉**
