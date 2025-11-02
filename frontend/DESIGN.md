# 🎨 UI/UX DESIGN GUIDE

## Visual Design System

---

## 🎨 Color Palette

### Primary Colors (Blue)
```css
50:  #f0f9ff  /* Lightest - backgrounds */
100: #e0f2fe  /* Light backgrounds */
200: #bae6fd  /* Subtle borders */
300: #7dd3fc  /* Hover states */
400: #38bdf8  /* Interactive elements */
500: #0ea5e9  /* Primary brand */
600: #0284c7  /* Links, buttons */
700: #0369a1  /* Dark interactive */
800: #075985  /* Text on light */
900: #0c4a6e  /* Footer background */
```

### Secondary Colors (Purple)
```css
50:  #faf5ff  /* Lightest */
100: #f3e8ff  /* Light backgrounds */
200: #e9d5ff  /* Borders */
300: #d8b4fe  /* Hover states */
400: #c084fc  /* Badges */
500: #a855f7  /* Secondary brand */
600: #9333ea  /* Buttons */
700: #7e22ce  /* Active states */
800: #6b21a8  /* Dark text */
900: #581c87  /* Footer background */
```

### Semantic Colors
- **Success**: Green-500 (#10b981)
- **Warning**: Yellow-500 (#f59e0b)
- **Error**: Red-500 (#ef4444)
- **Info**: Blue-500 (#0ea5e9)

### Neutral Colors
- **White**: #ffffff
- **Gray-50**: #f9fafb
- **Gray-100**: #f3f4f6
- **Gray-200**: #e5e7eb
- **Gray-300**: #d1d5db
- **Gray-400**: #9ca3af
- **Gray-500**: #6b7280
- **Gray-600**: #4b5563
- **Gray-700**: #374151
- **Gray-800**: #1f2937
- **Gray-900**: #111827

---

## 🔤 Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", 
             Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)

### Font Weights
- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700

### Line Heights
- **tight**: 1.25
- **normal**: 1.5
- **relaxed**: 1.75

---

## 🎯 Component Styles

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(to right, #0ea5e9, #a855f7);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  transform: scale(1);
}

.btn-primary:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: white;
  color: #374151;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.btn-secondary:hover {
  border-color: #d1d5db;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
}

.card:hover {
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

### Input Fields
```css
.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s;
}

.input-field:focus {
  border-color: transparent;
  ring: 2px solid #a855f7;
}
```

### Status Indicators
```css
.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  animation: pulse 2s infinite;
}

.status-healthy {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.status-warning {
  background: #f59e0b;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.status-error {
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}
```

---

## 🎭 Animations

### Transitions
```css
/* Standard transition for interactive elements */
transition: all 0.3s ease-in-out;

/* Quick transition for micro-interactions */
transition: all 0.15s ease-out;

/* Slow transition for major state changes */
transition: all 0.5s ease-in-out;
```

### Hover Effects
```css
/* Scale up */
transform: scale(1.05);

/* Lift up */
transform: translateY(-4px);

/* Glow */
box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
```

### Loading Spinner
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Pulse Animation
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 📐 Layout

### Spacing Scale
```css
0:   0px
1:   0.25rem (4px)
2:   0.5rem (8px)
3:   0.75rem (12px)
4:   1rem (16px)
5:   1.25rem (20px)
6:   1.5rem (24px)
8:   2rem (32px)
10:  2.5rem (40px)
12:  3rem (48px)
16:  4rem (64px)
20:  5rem (80px)
```

### Container Widths
```css
max-w-7xl: 80rem (1280px)  /* Main content */
max-w-6xl: 72rem (1152px)  /* Product pages */
max-w-2xl: 42rem (672px)   /* Modals, forms */
```

### Grid Layout
```css
/* Product Gallery */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Responsive Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

---

## 🖼️ Component Examples

### Product Card
```
┌─────────────────────┐
│                     │
│   Product Image     │
│    (400x400)        │
│                     │
├─────────────────────┤
│ Title (lg, bold)    │
│ Description (sm)    │
│ ⭐⭐⭐⭐⭐ (4.5)     │
│ $99.99 | 50 stock  │
├─────────────────────┤
│  [Add to Cart]      │
└─────────────────────┘
```

### Header Layout
```
┌───────────────────────────────────────────────────────┐
│ [Logo] [Search Bar......] [🟢Status] [🛒Cart(3)] [☰] │
└───────────────────────────────────────────────────────┘
```

### Monitor Panel
```
┌──────────────────────┐
│ System Monitor    [×]│
├──────────────────────┤
│ CPU Usage      45%   │
│ ████████░░           │
│                      │
│ Memory Usage   60%   │
│ ████████████░        │
│                      │
│ Response Time  120ms │
│ ████░░░░░░░░         │
├──────────────────────┤
│ Errors | Events | M  │
│   0    |  125   | 42 │
├──────────────────────┤
│ [Simulate Incident]  │
└──────────────────────┘
```

---

## 🎨 Design Principles

### 1. **Clarity**
- Clear hierarchy
- Obvious actions
- Visible feedback

### 2. **Consistency**
- Same patterns throughout
- Predictable behavior
- Uniform spacing

### 3. **Accessibility**
- High contrast ratios
- Large touch targets (44px min)
- Keyboard navigation ready

### 4. **Performance**
- Smooth animations (60fps)
- Instant feedback
- Progressive loading

### 5. **Delight**
- Micro-interactions
- Smooth transitions
- Playful colors

---

## 📱 Responsive Design

### Mobile (< 640px)
- Single column layout
- Full-width buttons
- Collapsible header
- Bottom navigation ready

### Tablet (640px - 1024px)
- 2-column product grid
- Side-by-side layouts
- Optimized spacing

### Desktop (> 1024px)
- 3-4 column product grid
- Fixed header
- Sidebar layouts
- Hover states active

---

## 🎯 Best Practices

### DO ✅
- Use consistent spacing
- Maintain color hierarchy
- Provide visual feedback
- Test on multiple devices
- Use semantic HTML
- Optimize images

### DON'T ❌
- Mix color schemes randomly
- Use tiny touch targets
- Ignore loading states
- Overwhelm with animations
- Forget empty states
- Skip error states

---

## 🚀 Quick Reference

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(to right, #0284c7, #9333ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Shadow Levels
```css
shadow-sm:  0 1px 2px rgba(0,0,0,0.05)
shadow-md:  0 4px 6px rgba(0,0,0,0.1)
shadow-lg:  0 10px 15px rgba(0,0,0,0.1)
shadow-xl:  0 20px 25px rgba(0,0,0,0.1)
shadow-2xl: 0 25px 50px rgba(0,0,0,0.25)
```

### Border Radius
```css
rounded-sm:   0.125rem
rounded:      0.25rem
rounded-md:   0.375rem
rounded-lg:   0.5rem
rounded-xl:   0.75rem
rounded-2xl:  1rem
rounded-full: 9999px
```

---

**Design with purpose, build with care! 🎨**
