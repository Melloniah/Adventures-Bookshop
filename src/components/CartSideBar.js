// src/components/Cart/CartSidebar.js
"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const CartSidebar = ({ isOpen, onClose }) => {
  // Placeholder cart items
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Mathematics Book",
      price: 1200,
      quantity: 1,
      image: "/images/book-sample.jpg",
    },
    {
      id: 2,
      name: "Scientific Calculator",
      price: 2500,
      quantity: 2,
      image: "/images/calculator.jpg",
    },
  ]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Background overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-xs text-gray-500">
                    KES {item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="px-2 py-1 border rounded">-</button>
                    <span>{item.quantity}</span>
                    <button className="px-2 py-1 border rounded">+</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Subtotal</span>
            <span className="font-semibold">
              KES {subtotal.toLocaleString()}
            </span>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Checkout
          </button>
          <button
            className="w-full mt-2 border py-2 rounded hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
