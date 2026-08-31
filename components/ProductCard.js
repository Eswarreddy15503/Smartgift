"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Check if product is in wishlist on load
  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("smartgift_wishlist") || "[]");
      setIsWishlisted(wishlist.some((item) => item.id === product.id));
    } catch {
      setIsWishlisted(false);
    }
  }, [product.id]);

  // Toggle Wishlist in LocalStorage
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      let wishlist = JSON.parse(localStorage.getItem("smartgift_wishlist") || "[]");
      if (isWishlisted) {
        wishlist = wishlist.filter((item) => item.id !== product.id);
        setIsWishlisted(false);
      } else {
        wishlist.push(product);
        setIsWishlisted(true);
      }
      localStorage.setItem("smartgift_wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  // Quick Add to Cart in LocalStorage
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    try {
      let cart = JSON.parse(localStorage.getItem("smartgift_cart") || "[]");
      const existingIndex = cart.findIndex((item) => item.id === product.id && !item.customization);

      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          ...product,
          quantity: 1,
          customization: null
        });
      }

      localStorage.setItem("smartgift_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      setTimeout(() => {
        setIsAdding(false);
      }, 600);
    } catch (err) {
      console.error("Cart error:", err);
      setIsAdding(false);
    }
  };

  // Calculate discount percentage
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-rose-200 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Product Image Box */}
      <Link href={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-slate-100 block">
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Customizable Badge */}
        {product.customizable && (
          <span className="absolute bottom-3 left-3 z-10 bg-amber-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
            Customizable
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Add to wishlist"
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-xs transition ${
            isWishlisted
              ? "bg-rose-50 text-rose-600 shadow-xs"
              : "bg-white/80 text-slate-500 hover:text-rose-600 hover:bg-white shadow-xs"
          }`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Details Box */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5 text-slate-500">
            <span className="font-medium text-rose-500">{product.category}</span>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-semibold px-1.5 py-0.5 rounded text-[11px]">
              <span className="text-amber-500 text-xs">&#9733;</span>
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 hover:text-rose-600 transition">
              {product.name}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">
                Rs. {product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  Rs. {product.originalPrice}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-600 font-medium">Free Delivery</p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-xs ${
              isAdding
                ? "bg-emerald-600 text-white"
                : "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200"
            }`}
          >
            {isAdding ? (
              <span>Added</span>
            ) : (
              <span>+ Cart</span>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}