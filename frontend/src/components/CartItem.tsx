'use client';

import { CartItem as CartItemType } from '@/lib/api';
import { logEvent } from '@/lib/telemetry';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && (product.stock === 0 || newQuantity <= product.stock)) {
      onUpdateQuantity(product.id, newQuantity);
      logEvent('cart_quantity_updated', {
        productId: product.id,
        oldQuantity: quantity,
        newQuantity,
      });
    }
  };

  const handleRemove = () => {
    onRemove(product.id);
    logEvent('cart_item_removed', {
      productId: product.id,
      productName: product.name,
      quantity,
    });
  };

  const subtotal = product.price * quantity;

  return (
    <div className="card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <p className="text-sm text-gray-500">Category: {product.category}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
        >
          -
        </button>
        <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={product.stock > 0 && quantity >= product.stock}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
        >
          +
        </button>
      </div>

      {/* Price and Remove */}
      <div className="flex flex-col items-end space-y-2 min-w-[120px]">
        <div className="text-right">
          <p className="text-sm text-gray-500">${product.price.toFixed(2)} each</p>
          <p className="text-xl font-bold gradient-text">${subtotal.toFixed(2)}</p>
        </div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors flex items-center space-x-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}
