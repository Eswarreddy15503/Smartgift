"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = () => {
    try {
      const items = JSON.parse(localStorage.getItem("smartgift_wishlist") || "[]");
      setWishlistItems(items);
    } catch {
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => window.removeEventListener("wishlistUpdated", loadWishlist);
  }, []);

  const handleClearWishlist = () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      localStorage.setItem("smartgift_wishlist", JSON.stringify([]));
      setWishlistItems([]);
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading your wishlist...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gifts you have saved for upcoming birthdays and special occasions
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <button
            onClick={handleClearWishlist}
            className="text-xs text-slate-500 hover:text-rose-600 font-semibold"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click the heart icon on any gift to save it here for future gifting.
          </p>
          <Link
            href="/products"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition"
          >
            Browse Gift Catalog
          </Link>
        </div>
      )}

    </div>
  );
}