'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { logEvent } from '@/lib/telemetry';

export default function ReturnsPage() {
  useEffect(() => {
    logEvent('page_view', { page: 'returns' });
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold text-black mb-4">Returns & Exchanges</h1>
      <p className="text-gray-600 mb-12 text-lg">
        Shop with confidence - hassle-free returns within 30 days
      </p>

      <div className="space-y-8">
        {/* Return Policy */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-black mb-6">Our Return Policy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-black mb-2">30</div>
              <p className="text-gray-600 font-semibold">Days to Return</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-black mb-2">FREE</div>
              <p className="text-gray-600 font-semibold">Return Shipping</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-black mb-2">100%</div>
              <p className="text-gray-600 font-semibold">Money Back</p>
            </div>
          </div>

          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              We want you to be completely satisfied with your purchase. If you're not happy for any reason, 
              you can return your item within 30 days of delivery for a full refund or exchange.
            </p>
            <p>
              Items must be unused, in original condition, and in original packaging. We'll send you a 
              prepaid return label via email once you initiate the return process.
            </p>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-black mb-6">How to Return an Item</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-black mb-2">Initiate Return</h3>
                <p className="text-gray-600">
                  Log into your account and go to "Order History". Select the item you want to return and click "Return Item". 
                  Or <Link href="/contact" className="text-black underline font-semibold">contact our support team</Link>.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-black mb-2">Pack Your Item</h3>
                <p className="text-gray-600">
                  Place the item in its original packaging (if possible) along with all accessories, manuals, and documentation. 
                  Use a sturdy shipping box to prevent damage during transit.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-black mb-2">Ship It Back</h3>
                <p className="text-gray-600">
                  Print the prepaid return label we email you and attach it to your package. Drop it off at any authorized 
                  shipping location. Keep your tracking receipt for your records.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-lg">4</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-black mb-2">Get Your Refund</h3>
                <p className="text-gray-600">
                  Once we receive and inspect your return (usually 2-3 business days), we'll process your refund. 
                  The money will appear in your account within 5-7 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="bg-black text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Exchanges</h2>
          <p className="text-gray-300 mb-6">
            Want to exchange for a different size, color, or product? We make it easy!
          </p>
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="font-bold text-xl mb-3">Fast Exchange Process</h3>
            <p className="text-gray-300 mb-4">
              Select "Exchange" when initiating your return. We'll ship your replacement item right away - 
              you don't have to wait for us to receive the original item first.
            </p>
            <p className="text-sm text-gray-400">
              * If we don't receive the original item within 14 days, you'll be charged for the replacement.
            </p>
          </div>
        </div>

        {/* Exclusions */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-black mb-6">Return Exclusions</h2>
          
          <p className="text-gray-600 mb-6">
            For health and safety reasons, the following items cannot be returned:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-gray-700">Opened personal care items</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-gray-700">Worn or washed clothing</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-gray-700">Customized or personalized items</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-gray-700">Clearance or final sale items</span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Have Questions About Returns?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to help make your return as smooth as possible.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
