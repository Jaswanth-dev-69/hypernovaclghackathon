'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logEvent } from '@/lib/telemetry';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    logEvent('page_view', { page: 'faq' });
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
    logEvent('faq_item_clicked', { index, action: openIndex === index ? 'close' : 'open' });
  };

  const faqs = [
    {
      category: 'Orders',
      questions: [
        {
          q: 'How do I place an order?',
          a: 'Browse our products, click "Add to Cart" on items you want, then click the cart icon and "Proceed to Checkout". Follow the prompts to complete your purchase.'
        },
        {
          q: 'Can I modify or cancel my order?',
          a: 'Yes! Contact us immediately if you need to make changes. If your order hasn\'t shipped yet, we can modify or cancel it. Once shipped, you\'ll need to follow our return process.'
        },
        {
          q: 'Do you accept international orders?',
          a: 'Yes, we ship to over 100 countries worldwide. International shipping costs and delivery times vary by location. Check our Shipping page for more details.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay.'
        }
      ]
    },
    {
      category: 'Shipping',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping takes 5-7 business days, Express takes 2-3 business days, and Overnight delivers the next business day. International shipping takes 7-14 business days.'
        },
        {
          q: 'How much does shipping cost?',
          a: 'Standard shipping is FREE on all US orders over $50. Express shipping is $9.99 and overnight is $24.99. International shipping starts at $19.99.'
        },
        {
          q: 'Do you ship to P.O. boxes?',
          a: 'Yes, we ship to P.O. boxes via USPS for standard shipping only. Express and overnight shipping are not available to P.O. boxes.'
        },
        {
          q: 'How can I track my order?',
          a: 'You\'ll receive a tracking number via email once your order ships. You can track your package on our website or through the carrier\'s tracking portal.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day return policy on all items. Returns must be unused, in original condition, and in original packaging. Return shipping is free!'
        },
        {
          q: 'How do I return an item?',
          a: 'Log into your account, go to Order History, select the item to return, and click "Return Item". We\'ll email you a prepaid return label. For assistance, contact our support team.'
        },
        {
          q: 'When will I receive my refund?',
          a: 'Once we receive and inspect your return (2-3 business days), we\'ll process your refund within 24 hours. The money will appear in your account within 5-7 business days.'
        },
        {
          q: 'Can I exchange an item?',
          a: 'Absolutely! Select "Exchange" when initiating your return. We\'ll ship your replacement right away - you don\'t have to wait for us to receive the original item.'
        }
      ]
    },
    {
      category: 'Products',
      questions: [
        {
          q: 'Are your products authentic?',
          a: 'Yes! All our products are 100% authentic and sourced directly from authorized distributors and manufacturers. We guarantee the authenticity of every item we sell.'
        },
        {
          q: 'Do products come with a warranty?',
          a: 'Most electronics and appliances come with the manufacturer\'s warranty. Warranty terms vary by product and manufacturer. Check the product description for specific warranty information.'
        },
        {
          q: 'How do I know if an item is in stock?',
          a: 'Each product page shows current stock levels. If an item shows "Low Stock" or "Out of Stock", you can sign up for email notifications when it\'s back in stock.'
        },
        {
          q: 'Can I request a product you don\'t currently carry?',
          a: 'Yes! We love hearing from our customers. Contact us with your product request and we\'ll do our best to add it to our catalog.'
        }
      ]
    },
    {
      category: 'Account',
      questions: [
        {
          q: 'Do I need an account to place an order?',
          a: 'No, you can checkout as a guest. However, creating an account lets you track orders, save your shipping information, and access your order history.'
        },
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on the login page. Enter your email address and we\'ll send you a link to create a new password.'
        },
        {
          q: 'Can I change my email address?',
          a: 'Yes! Log into your account, go to Account Settings, and update your email address. You\'ll need to verify the new email address.'
        },
        {
          q: 'How do I update my shipping address?',
          a: 'Log into your account and go to Addresses in your account settings. You can add, edit, or delete shipping addresses there.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          q: 'The website isn\'t working properly. What should I do?',
          a: 'Try clearing your browser cache and cookies, or try a different browser. If the problem persists, contact our technical support team with details about the issue.'
        },
        {
          q: 'How do I report a bug or issue?',
          a: 'Use our Contact form and select "Technical Support" as the issue type. All technical issues are logged in our monitoring system for quick resolution.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Absolutely! We use industry-standard SSL encryption and never store your complete credit card information. All transactions are processed through secure payment gateways.'
        },
        {
          q: 'Do you have a mobile app?',
          a: 'Not yet, but our website is fully responsive and optimized for mobile devices. You can shop seamlessly from any smartphone or tablet.'
        }
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold text-black mb-4">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-12 text-lg">
        Find answers to common questions about our products, orders, shipping, and more.
      </p>

      {/* Search Box */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black pl-12"
          />
          <svg 
            className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {faqs.map((category, catIndex) => (
          <div key={catIndex} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-black text-white px-6 py-4">
              <h2 className="text-2xl font-bold">{category.category}</h2>
            </div>
            <div className="divide-y-2 divide-gray-200">
              {category.questions.map((faq, qIndex) => {
                const globalIndex = catIndex * 100 + qIndex;
                const isOpen = openIndex === globalIndex;
                
                return (
                  <div key={qIndex}>
                    <button
                      onClick={() => toggleFAQ(globalIndex)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="font-semibold text-lg text-black pr-4">{faq.q}</span>
                      <svg
                        className={`w-6 h-6 text-black flex-shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="mt-12 bg-black text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-gray-300 mb-6 text-lg">
          Can't find what you're looking for? Our support team is here to help!
        </p>
        <Link 
          href="/contact" 
          className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
