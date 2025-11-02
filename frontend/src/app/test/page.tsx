'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState<string>('Testing...');
  const [tableExists, setTableExists] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    try {
      // Test 1: Check Supabase connection
      setStatus('1/3 Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.log('Connection test:', testError);
      }
      console.log('✅ Supabase connected');

      // Test 2: Check if cart_items table exists
      setStatus('2/3 Checking cart_items table...');
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .limit(1);

      if (cartError) {
        console.error('❌ cart_items table error:', cartError);
        setError(`Table Error: ${cartError.message}`);
        setTableExists(false);
      } else {
        console.log('✅ cart_items table exists');
        setTableExists(true);
      }

      // Test 3: Check user authentication
      setStatus('3/3 Checking user login...');
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserId(user.id);
        console.log('✅ User logged in:', user.id);
      } else {
        console.log('❌ No user logged in');
        setUserId('Not logged in');
      }

      setStatus('Tests complete!');
    } catch (err: any) {
      console.error('Test error:', err);
      setError(err.message);
      setStatus('Tests failed!');
    }
  };

  const testAddToCart = async () => {
    if (!userId || userId === 'Not logged in') {
      alert('Please login first!');
      return;
    }

    try {
      console.log('Testing add to cart...');
      const { data, error } = await supabase
        .from('cart_items')
        .insert([
          {
            user_id: userId,
            product_id: 'test-1',
            product_name: 'Test Product',
            product_price: 9.99,
            product_image: 'https://via.placeholder.com/150',
            product_description: 'This is a test product',
            quantity: 1
          }
        ])
        .select();

      if (error) {
        console.error('❌ Insert failed:', error);
        alert(`Error: ${error.message}`);
      } else {
        console.log('✅ Insert success:', data);
        alert('Success! Test item added to cart.');
      }
    } catch (err: any) {
      console.error('Test insert error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const viewCartTable = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .limit(10);

      if (error) {
        console.error('❌ Query failed:', error);
        alert(`Error: ${error.message}`);
      } else {
        console.log('Cart items:', data);
        alert(`Found ${data?.length || 0} items in cart. Check console for details.`);
      }
    } catch (err: any) {
      console.error('Query error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const testDeleteFromCart = async () => {
    if (!userId || userId === 'Not logged in') {
      alert('Please login first!');
      return;
    }

    try {
      // First, get the first cart item
      const { data: items, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .limit(1);

      if (fetchError) {
        console.error('❌ Fetch failed:', fetchError);
        alert(`Error: ${fetchError.message}`);
        return;
      }

      if (!items || items.length === 0) {
        alert('No items in cart to delete. Add a test item first!');
        return;
      }

      const itemToDelete = items[0];
      console.log('Deleting item:', itemToDelete);

      // Delete it
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemToDelete.id)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('❌ Delete failed:', deleteError);
        alert(`Error: ${deleteError.message}`);
      } else {
        console.log('✅ Delete success');
        alert(`Success! Deleted "${itemToDelete.product_name}"`);
      }
    } catch (err: any) {
      console.error('Test delete error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Cart System Diagnostics</h1>

        {/* Status */}
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="font-semibold text-blue-700">{status}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="font-semibold text-red-700">Error:</p>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${tableExists ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium">
              Cart Table: {tableExists ? '✅ Exists' : '❌ Not Found'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${userId && userId !== 'Not logged in' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium">
              User Status: {userId || 'Checking...'}
            </span>
          </div>
        </div>

        {/* Instructions */}
        {!tableExists && (
          <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <h2 className="text-xl font-bold text-yellow-800 mb-3">⚠️ Action Required</h2>
            <p className="text-yellow-700 mb-4">
              The cart_items table doesn't exist yet. Follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700">
              <li>Go to <a href="https://app.supabase.com/" target="_blank" className="text-blue-600 underline">Supabase Dashboard</a></li>
              <li>Click "SQL Editor" → "New Query"</li>
              <li>Copy SQL from <code className="bg-yellow-100 px-2 py-1 rounded">backend/database/cart_schema_simple.sql</code></li>
              <li>Paste and click "Run"</li>
              <li>Refresh this page to test again</li>
            </ol>
          </div>
        )}

        {/* Test Buttons */}
        {tableExists && (
          <div className="space-y-4">
            <button
              onClick={testAddToCart}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Test Add to Cart
            </button>

            <button
              onClick={testDeleteFromCart}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Test Delete from Cart
            </button>

            <button
              onClick={viewCartTable}
              className="w-full bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              View Cart Items (Console)
            </button>

            <button
              onClick={runTests}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Run Tests Again
            </button>
          </div>
        )}

        {/* Links */}
        <div className="mt-8 pt-6 border-t space-y-2">
          <a href="/shop" className="block text-blue-600 hover:underline">
            ← Back to Shop
          </a>
          <a href="/cart" className="block text-blue-600 hover:underline">
            → Go to Cart
          </a>
        </div>
      </div>
    </div>
  );
}
