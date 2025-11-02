'use client';

import { useEffect, useState } from 'react';
import ProductGallery from '@/components/ProductGallery';
import { Product, addToCart as apiAddToCart } from '@/lib/api';
import { logEvent } from '@/lib/telemetry';
import { addToCart } from '@/lib/cart';

export default function ShopPage() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    logEvent('page_view', { page: 'shop' });
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      // Check if user is logged in
      const user = localStorage.getItem('user');
      if (!user) {
        setMessage({ type: 'error', text: 'Please login to add items to cart' });
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      // Call API to log the action
      await apiAddToCart(product, 1);

      // Add to cart in database
      const cartProduct = {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description
      };

      await addToCart(cartProduct, 1);

      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));

      // Show success message
      setMessage({ type: 'success', text: `${product.name} added to cart!` });
      setTimeout(() => setMessage(null), 3000);

      logEvent('add_to_cart_success', {
        productId: product.id,
        productName: product.name,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setMessage({ type: 'error', text: 'Failed to add item to cart. Please try again.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-12">
      {/* Success/Error Message */}
      {message && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg animate-fade-in ${
            message.type === 'success'
              ? 'bg-green-50 border-l-4 border-green-500'
              : 'bg-red-50 border-l-4 border-red-500'
          }`}
        >
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <p className={`font-medium ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center py-16 border-b-2 border-gray-200">
        <h1 className="text-6xl font-bold mb-4 text-black">
          Welcome to EcomStore
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover quality products with fast shipping and easy returns
        </p>
      </div>

      {/* Product Gallery */}
      <div>
        <h2 className="text-4xl font-bold mb-8 text-black">
          Featured Products
        </h2>
        <ProductGallery onAddToCart={handleAddToCart} />
      </div>
    </div>
  );
}
