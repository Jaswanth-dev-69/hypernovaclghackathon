'use client';

import { useEffect } from 'react';
import { logEvent } from '@/lib/telemetry';

export default function ShippingPage() {
  useEffect(() => {
    logEvent('page_view', { page: 'shipping' });
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold text-black mb-4">Shipping Information</h1>
      <p className="text-gray-600 mb-12 text-lg">
        Fast, reliable delivery to your doorstep
      </p>

      <div className="space-y-8">
        {/* Shipping Methods */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-black mb-6">Shipping Methods</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <svg className="w-12 h-12 text-black mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-black mb-2 text-center">Standard</h3>
              <p className="text-gray-600 text-center mb-3">5-7 Business Days</p>
              <p className="text-2xl font-bold text-black text-center">FREE</p>
            </div>

            <div className="border-2 border-black rounded-lg p-6 bg-gray-50">
              <div className="text-center mb-4">
                <svg className="w-12 h-12 text-black mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-black mb-2 text-center">Express</h3>
              <p className="text-gray-600 text-center mb-3">2-3 Business Days</p>
              <p className="text-2xl font-bold text-black text-center">$9.99</p>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <svg className="w-12 h-12 text-black mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-black mb-2 text-center">Overnight</h3>
              <p className="text-gray-600 text-center mb-3">Next Business Day</p>
              <p className="text-2xl font-bold text-black text-center">$24.99</p>
            </div>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-black mb-6">Shipping Zones</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-black">Domestic (US)</h3>
                <p className="text-gray-600">Free standard shipping on all orders over $50. Express and overnight shipping available.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-black">International</h3>
                <p className="text-gray-600">We ship to over 100 countries worldwide. International shipping starts at $19.99 and typically takes 7-14 business days.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-black">Alaska & Hawaii</h3>
                <p className="text-gray-600">Standard shipping to AK and HI is $14.99. Delivery time is 7-10 business days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-black text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Order Tracking</h2>
          <div className="space-y-4">
            <p className="text-gray-300">
              Once your order ships, you'll receive a tracking number via email. You can track your package 24/7 through our website or the carrier's tracking portal.
            </p>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-2">Track Your Order</p>
              <p className="text-sm text-gray-300">Enter your order number and email in the tracking form on your account page.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-black mb-6">Shipping FAQ</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-black mb-2">When will my order ship?</h3>
              <p className="text-gray-600">Orders placed before 2 PM EST ship the same business day. Orders after 2 PM ship the next business day.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-black mb-2">Do you ship to P.O. boxes?</h3>
              <p className="text-gray-600">Yes, we ship to P.O. boxes via USPS for standard shipping only.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-black mb-2">Can I change my shipping address after ordering?</h3>
              <p className="text-gray-600">Contact us immediately at support@ecomstore.com. We can update your address if the order hasn't shipped yet.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-black mb-2">What if my package is lost or damaged?</h3>
              <p className="text-gray-600">We'll work with the carrier to locate your package or send a replacement at no charge. Contact our support team for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
