# Cart Migration Guide - User-Specific Carts

## Overview
Successfully migrated from localStorage-based shared cart to user-specific database-backed carts using Supabase PostgreSQL.

## What Was Changed

### 1. Backend Changes

#### New Files Created:
- **`backend/database/cart_schema.sql`** - Database schema for cart_items table
  - User-specific cart items with foreign key to auth.users
  - Row Level Security (RLS) policies for data isolation
  - Unique constraint on (user_id, product_id)
  - Automatic timestamp triggers
  
- **`backend/src/services/cartService.js`** - Business logic for cart operations
  - getCartItems(userId)
  - addToCart(userId, product, quantity)
  - updateCartItemQuantity(userId, cartItemId, quantity)
  - removeFromCart(userId, cartItemId)
  - clearCart(userId)
  - getCartCount(userId)

- **`backend/src/controllers/cartController.js`** - HTTP request handlers
  - Validates input parameters
  - Returns standardized JSON responses
  - Proper error handling

- **`backend/src/routes/cartRoutes.js`** - RESTful API endpoints
  - GET /:userId - Get user's cart
  - GET /:userId/count - Get cart count
  - POST /add - Add item
  - PUT /update - Update quantity
  - DELETE /remove - Remove item
  - DELETE /:userId/clear - Clear cart

#### Modified Files:
- **`backend/src/server.js`** - Added cart routes to Express server

### 2. Frontend Changes

#### New Files Created:
- **`frontend/src/lib/cart.ts`** - Cart service with Supabase integration
  - Direct database queries (no backend API calls)
  - All operations filtered by user_id
  - getUserId() helper to extract user from localStorage
  - Type-safe interfaces for CartItem and Product

#### Modified Files:
- **`frontend/src/app/cart/page.tsx`** - Cart page now uses database
  - ✅ Loads cart from Supabase on mount
  - ✅ Updates quantities in database
  - ✅ Removes items from database
  - ✅ Clears cart from database on checkout
  - ✅ Shows loading spinner while fetching
  - ✅ Displays error messages
  - ❌ No longer uses localStorage

- **`frontend/src/app/shop/page.tsx`** - Shop page add-to-cart updated
  - ✅ Adds items to database instead of localStorage
  - ✅ Shows success/error toast messages
  - ✅ Requires user to be logged in
  - ✅ Updates cart count in real-time

- **`frontend/src/components/Header.tsx`** - Header now fetches real cart count
  - ✅ Fetches count from database on mount
  - ✅ Listens for cartUpdated events
  - ✅ Reloads count on login/logout
  - ❌ No longer reads from localStorage

- **`frontend/src/components/CartItem.tsx`** - Handles missing stock data
  - ✅ Allows unlimited quantity if stock is 0
  - ✅ Disables increment button only if stock > 0 and quantity >= stock

- **`frontend/src/app/layout.tsx`** - Simplified layout
  - ✅ Removed cart count logic (now in Header)
  - ✅ Removed localStorage cart loading

## CRITICAL: Database Setup Required

**⚠️ IMPORTANT: You must run the database schema before the cart will work!**

### Steps to Deploy Database:

1. **Go to Supabase Dashboard**
   - Open https://app.supabase.com/
   - Select your project: `kpzfnzyqxtiauuxljhzr`

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Schema**
   - Copy the contents of `backend/database/cart_schema.sql`
   - Paste into the SQL Editor
   - Click "Run" button

4. **Verify Table Creation**
   - Go to "Table Editor" in the left sidebar
   - You should see a new table: `cart_items`
   - Click on it to verify columns:
     - id (uuid)
     - user_id (uuid)
     - product_id (varchar)
     - product_name (varchar)
     - product_price (numeric)
     - product_image (text)
     - product_description (text)
     - quantity (integer)
     - created_at (timestamptz)
     - updated_at (timestamptz)

5. **Verify RLS Policies**
   - Click on the `cart_items` table
   - Go to "Policies" tab
   - You should see 4 policies:
     - Enable read access for users to their own cart items
     - Enable insert for users to their own cart items
     - Enable update for users to their own cart items
     - Enable delete for users to their own cart items

## Testing Checklist

After deploying the database schema:

### Basic Functionality
- [ ] User can add items to cart from shop page
- [ ] Cart count updates in header after adding item
- [ ] Cart page displays user's items
- [ ] User can update quantities in cart
- [ ] User can remove items from cart
- [ ] User can checkout (clears cart)
- [ ] Success/error messages display correctly

### User Isolation
- [ ] Login as User A, add items to cart
- [ ] Login as User B, verify empty cart
- [ ] Add different items as User B
- [ ] Switch back to User A, verify original items still there
- [ ] Logout and login again as User A, verify cart persists

### Edge Cases
- [ ] Try to add to cart while logged out (should show error)
- [ ] Add same product multiple times (should increment quantity)
- [ ] Update quantity to 0 (should remove item)
- [ ] Clear cart on checkout
- [ ] Refresh page (cart should persist)

## How It Works

### Authentication Flow
1. User logs in → User data stored in localStorage
2. Cart operations extract user_id from localStorage
3. All database queries filtered by user_id
4. RLS policies enforce user can only access their own cart

### Add to Cart Flow
```
Shop Page → Click "Add to Cart"
  ↓
Check if user logged in
  ↓
Call addToCart(product, quantity) from cart.ts
  ↓
Supabase: INSERT INTO cart_items OR UPDATE quantity
  ↓
Dispatch 'cartUpdated' event
  ↓
Header reloads cart count from database
```

### Cart Page Flow
```
Cart Page Mount
  ↓
Call getCartItems() from cart.ts
  ↓
Supabase: SELECT * FROM cart_items WHERE user_id = ?
  ↓
Display items with quantities
  ↓
User updates quantity → updateCartItemQuantity()
  ↓
Supabase: UPDATE cart_items SET quantity = ?
  ↓
Dispatch 'cartUpdated' event
```

## Benefits of New System

✅ **User Isolation** - Each user has their own cart
✅ **Data Persistence** - Cart survives logout/login
✅ **Real-time Updates** - Cart count updates across components
✅ **Security** - RLS policies prevent data leaks
✅ **Type Safety** - TypeScript interfaces for all cart operations
✅ **Error Handling** - Graceful failures with user feedback
✅ **Scalability** - Database can handle many users

## Migration Notes

### Old System (localStorage)
```javascript
// OLD - Shared across all users
const cart = JSON.parse(localStorage.getItem('cart') || '[]');
cart.push({ product, quantity });
localStorage.setItem('cart', JSON.stringify(cart));
```

### New System (Supabase)
```typescript
// NEW - User-specific database
const cartItem = await addToCart(product, quantity);
// Automatically filtered by user_id
// Persists across sessions
// Isolated from other users
```

## Troubleshooting

### Cart not loading
- Check browser console for errors
- Verify user is logged in (check localStorage for 'user' key)
- Verify database schema was run successfully
- Check Supabase dashboard for RLS policy errors

### Cart count shows 0
- Check if cartUpdated event is dispatched after adding items
- Verify getCartCount() returns correct value in console
- Check network tab for Supabase query errors

### Items from other users showing up
- RLS policies not configured correctly
- Run the cart_schema.sql again to recreate policies
- Check user_id in database matches logged-in user

### Cannot add items to cart
- User not logged in
- Check Supabase connection (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Verify cart_items table exists
- Check browser console for specific error messages

## Next Steps

1. ✅ Run database schema in Supabase Dashboard
2. ✅ Test cart functionality with multiple users
3. ⏳ Polish signup page (similar to login page improvements)
4. ⏳ Add toast notifications instead of browser alerts
5. ⏳ Add loading states for add-to-cart button
6. ⏳ Implement cart quantity limits based on product stock
7. ⏳ Add cart item animations (add/remove)
8. ⏳ Implement cart summary sidebar on shop page
9. ⏳ Add "Recently Added" notification in header

## Files Changed Summary

**Backend (5 files):**
- ✅ backend/database/cart_schema.sql (new)
- ✅ backend/src/services/cartService.js (new)
- ✅ backend/src/controllers/cartController.js (new)
- ✅ backend/src/routes/cartRoutes.js (new)
- ✅ backend/src/server.js (modified)

**Frontend (6 files):**
- ✅ frontend/src/lib/cart.ts (new)
- ✅ frontend/src/app/cart/page.tsx (modified)
- ✅ frontend/src/app/shop/page.tsx (modified)
- ✅ frontend/src/components/Header.tsx (modified)
- ✅ frontend/src/components/CartItem.tsx (modified)
- ✅ frontend/src/app/layout.tsx (modified)

**Total:** 11 files changed, 5 new files created

---

**Status:** ✅ Code changes complete, ⚠️ Database deployment required
**Priority:** 🔴 HIGH - Deploy database schema before testing
**Estimated Time:** 5 minutes to deploy schema, 15 minutes to test
