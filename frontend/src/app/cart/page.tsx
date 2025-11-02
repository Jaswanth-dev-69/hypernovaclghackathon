'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CartItem from '@/components/CartItem';
import { CartItem as CartItemType, checkout } from '@/lib/api';
import { logEvent } from '@/lib/telemetry';
import { getCartItems, updateCartItemQuantity, removeFromCart, clearCart } from '@/lib/cart';
import LoadingSpinner from '@/components/LoadingSpinner';

// Extended CartItemType to include the database id
interface ExtendedCartItem extends CartItemType {
  cartItemId?: string; // The UUID from database
}

export default function CartPage() {
  const [cart, setCart] = useState<ExtendedCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    logEvent('page_view', { page: 'cart' });
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      setError('');
      const items = await getCartItems();
      
      // Convert to CartItemType format expected by the page
      const formattedCart: ExtendedCartItem[] = items.map(item => ({
        cartItemId: item.id, // Preserve the database ID
        product: {
          id: parseInt(item.product_id),
          name: item.product_name,
          price: typeof item.product_price === 'string' ? parseFloat(item.product_price) : item.product_price,
          image: item.product_image,
          description: item.product_description,
          category: '', // Default values for optional fields
          stock: 0,
          rating: 0
        },
        quantity: item.quantity
      }));
      
      setCart(formattedCart);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Failed to load cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    try {
      // Find the cart item by product_id
      const cartItem = cart.find(item => item.product.id === productId);
      if (!cartItem || !cartItem.cartItemId) {
        console.error('Cart item not found or missing ID');
        return;
      }

      await updateCartItemQuantity(cartItem.cartItemId, quantity);
      
      // Update local state
      const updatedCart = cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      setCart(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      console.log('[Cart Page] Removing item with productId:', productId);
      
      // Find the cart item to get its database ID
      const cartItem = cart.find(item => item.product.id === productId);
      if (!cartItem || !cartItem.cartItemId) {
        console.error('[Cart Page] Cart item not found or missing ID');
        setError('Cannot remove item. Please refresh the page.');
        return;
      }
      
      console.log('[Cart Page] Found cart item with ID:', cartItem.cartItemId);
      await removeFromCart(cartItem.cartItemId);
      
      // Update local state
      const updatedCart = cart.filter((item) => item.product.id !== productId);
      setCart(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
      
      console.log('[Cart Page] Item removed successfully');
    } catch (err) {
      console.error('[Cart Page] Failed to remove item:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true);
    try {
      const total = calculateTotal();
      const result = await checkout(cart, total);

      if (result.success) {
        setCheckoutSuccess(true);
        setOrderId(result.orderId);
        
        // Clear cart from database
        await clearCart();
        setCart([]);
        window.dispatchEvent(new Event('cartUpdated'));

        logEvent('checkout_success', {
          orderId: result.orderId,
          total,
        });
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      setError('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (checkoutSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="card p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been successfully placed.
          </p>
          <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Order ID:</p>
            <p className="text-2xl font-mono font-bold text-black">{orderId}</p>
          </div>
          <Link href="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="card p-12">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products yet.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-black mb-8">Your Cart</h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-black">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-semibold text-black">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-3 flex justify-between text-2xl font-bold">
                <span className="text-black">Total</span>
                <span className="text-black">${calculateSubtotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : (
                'Proceed to Checkout'
              )}
            </button>

            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-600 hover:text-black text-sm font-medium">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
