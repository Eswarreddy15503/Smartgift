"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("smartgift_cart") || "[]");
      setCartItems(savedCart);
    } catch {
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart changes to localStorage and notify other components
  const updateCartStorage = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("smartgift_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Update item quantity
  const handleQuantityChange = (index, delta) => {
    const newCart = [...cartItems];
    const newQty = newCart[index].quantity + delta;

    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      newCart[index].quantity = newQty;
      updateCartStorage(newCart);
    }
  };

  // Remove specific item
  const handleRemoveItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    updateCartStorage(newCart);
  };

  // Clear entire cart
  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear all items in your cart?")) {
      updateCartStorage([]);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const deliveryCharge = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + deliveryCharge;

  if (isLoading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading your shopping cart...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your personalized gifts and custom gift hampers
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-xs text-slate-500 hover:text-rose-600 font-semibold"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between"
              >
                {/* Left: Product Image & Info */}
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border border-slate-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs font-extrabold text-slate-900">
                      Rs. {item.price}
                    </p>

                    {/* Custom Box Details */}
                    {item.isCustomBox && item.boxDetails && (
                      <div className="mt-2 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 space-y-1 border border-slate-100">
                        <p><strong className="text-slate-800">Box:</strong> {item.boxDetails.boxType}</p>
                        <p><strong className="text-slate-800">Contents:</strong> {item.boxDetails.itemsList.join(", ")}</p>
                        {item.boxDetails.message && (
                          <p className="italic text-slate-500">&ldquo;{item.boxDetails.message}&rdquo;</p>
                        )}
                      </div>
                    )}

                    {/* Customization Details */}
                    {item.customization && (
                      <div className="mt-2 p-2 bg-rose-50/50 rounded-lg text-[11px] text-slate-600 space-y-0.5 border border-rose-100">
                        {item.customization.name && (
                          <p><strong className="text-slate-800">Name:</strong> {item.customization.name}</p>
                        )}
                        {item.customization.message && (
                          <p><strong className="text-slate-800">Message:</strong> {item.customization.message}</p>
                        )}
                        {item.customization.hasPhoto && (
                          <p className="text-rose-600 font-medium">Custom photo attached</p>
                        )}
                      </div>
                    )}

                    {/* Surprise tag */}
                    {item.isSurprise && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                        Surprise Gift (Price tag hidden)
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Quantity & Subtotal */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                    <button
                      onClick={() => handleQuantityChange(index, -1)}
                      className="w-6 h-6 rounded bg-white font-bold text-slate-700 text-xs hover:bg-slate-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="px-2.5 text-xs font-bold text-slate-800">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(index, 1)}
                      className="w-6 h-6 rounded bg-white font-bold text-slate-700 text-xs hover:bg-slate-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-slate-900">
                      Rs. {item.price * (item.quantity || 1)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-xs text-slate-400 hover:text-rose-600 p-1"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <aside className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge:</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `Rs. ${deliveryCharge}`
                  )}
                </span>
              </div>
              {subtotal < 999 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  Add items worth <strong>Rs. {999 - subtotal}</strong> more for Free Delivery!
                </p>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Custom Gift Wrapping:</span>
                <span className="text-emerald-600 font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-base pt-3 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-rose-600">Rs. {grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md transition text-center"
            >
              Proceed to Checkout &rarr;
            </button>

            <Link
              href="/products"
              className="block text-center text-xs font-semibold text-rose-600 hover:underline"
            >
              Continue Shopping
            </Link>
          </aside>

        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Looks like you have not added any personalized gifts to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition"
          >
            Explore Gifts
          </Link>
        </div>
      )}

    </div>
  );
}