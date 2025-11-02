# 🚀 INSTALLATION COMMANDS

Copy and paste these commands into PowerShell to get started!

---

## Step 1: Navigate to Project

```powershell
cd j:\hypernovahackathon\frontend
```

---

## Step 2: Verify Files Exist

```powershell
# List all files to confirm structure
ls
```

Expected output should include:
- package.json
- next.config.js
- src/
- README.md

---

## Step 3: Check Node Version

```powershell
node --version
```

Should show v18.0.0 or higher.

---

## Step 4: Install Dependencies

```powershell
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 3
- All required dependencies

Expected time: 30-60 seconds

---

## Step 5: Start Development Server

```powershell
npm run dev
```

You should see:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

---

## Step 6: Open in Browser

Navigate to: **http://localhost:3000**

You should see:
- ✨ Beautiful homepage
- 🎨 12 product cards
- 📊 "Monitor" button in bottom-right
- 🛒 Cart icon in header

---

## 🎉 Success!

Your e-commerce site is now running!

---

## 🔧 Troubleshooting Commands

### If port 3000 is busy:
```powershell
npm run dev -- -p 3001
```

### If installation fails:
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules, .next -ErrorAction SilentlyContinue
npm install
```

### Check for errors:
```powershell
npm run build
```

### Update npm (if needed):
```powershell
npm install -g npm@latest
```

---

## 📊 Verify Everything Works

### Test 1: Homepage Loads
```
✅ Products display
✅ Category buttons work
✅ No console errors
```

### Test 2: Add to Cart
```
✅ Click "Add to Cart"
✅ Cart badge updates
✅ Product added successfully
```

### Test 3: View Product
```
✅ Click product card
✅ Detail page loads
✅ Add to cart works
```

### Test 4: Shopping Cart
```
✅ Navigate to /cart
✅ Cart items display
✅ Quantity adjustment works
✅ Remove items works
```

### Test 5: Checkout
```
✅ Click "Proceed to Checkout"
✅ Order processes
✅ Confirmation displays
```

### Test 6: Telemetry
```
✅ Monitor button appears
✅ Panel opens
✅ Metrics update
✅ "Simulate Incident" works
✅ Console shows events
```

---

## 🎮 Quick Demo Commands

### Open Monitor Panel:
1. Look for blue "Monitor" button (bottom-right)
2. Click to expand
3. Watch metrics update every 2 seconds

### Test Incident Simulation:
1. Open Monitor Panel
2. Click red "Simulate Incident" button
3. Watch health indicator turn red
4. Observe metric spikes
5. Wait 10 seconds for auto-recovery

### View Telemetry Logs:
1. Press F12 (open DevTools)
2. Click "Console" tab
3. Perform actions (add to cart, navigate, etc.)
4. See telemetry events logged with 📊 icons

---

## 🌐 Access From Other Devices

### Find your local IP:
```powershell
ipconfig | Select-String "IPv4"
```

### Access from phone/tablet:
```
http://YOUR_IP_ADDRESS:3000
```

Example: http://192.168.1.100:3000

---

## 🛠️ Development Commands

### Run linter:
```powershell
npm run lint
```

### Build for production:
```powershell
npm run build
```

### Start production server:
```powershell
npm start
```

### Clean build:
```powershell
Remove-Item -Recurse -Force .next
npm run build
```

---

## 📦 Optional: Install Additional Tools

### Install Prettier (code formatter):
```powershell
npm install --save-dev prettier
```

### Install Jest (testing):
```powershell
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

---

## 🎯 One-Line Install & Run

If you want to do everything in one command:

```powershell
cd j:\hypernovahackathon\frontend; npm install; npm run dev
```

---

## ✅ Installation Complete!

Your development environment is ready.

**Next steps:**
1. ✅ Server running on http://localhost:3000
2. ✅ Open browser and test features
3. ✅ Open browser console (F12) to see telemetry
4. ✅ Practice demo flow
5. ✅ Review documentation

**Ready to demo! 🚀**

---

## 📚 Documentation Quick Links

- **Main Docs**: README.md
- **Quick Start**: QUICKSTART.md
- **Telemetry**: TELEMETRY.md
- **Design System**: DESIGN.md
- **Checklist**: CHECKLIST.md
- **Summary**: PROJECT_SUMMARY.md

---

**Happy Coding! 🎉**
