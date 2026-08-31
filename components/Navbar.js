"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  // Read cart, wishlist count, and user session from localStorage
  useEffect(() => {
    const updateCounts = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("smartgift_cart") || "[]");
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);

        const wishlist = JSON.parse(localStorage.getItem("smartgift_wishlist") || "[]");
        setWishlistCount(wishlist.length);

        const user = JSON.parse(localStorage.getItem("smartgift_user") || "null");
        setCurrentUser(user);
      } catch {
        // Fallback for initial load
        setCartCount(0);
        setWishlistCount(0);
        setCurrentUser(null);
      }
    };

    updateCounts();

    window.addEventListener("storage", updateCounts);
    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);
    window.addEventListener("userUpdated", updateCounts);

    return () => {
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
      window.removeEventListener("userUpdated", updateCounts);
    };
  }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-rose-100 shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white text-xs py-1.5 px-4 text-center font-medium">
        Free Shipping on orders above Rs. 999 | Personalize your gifts with custom names and photos
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                SmartGift
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
                Personalized Gifts
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search mugs, photo frames, gift boxes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition"
              />
              <svg
                className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4">
            {/* Gift Finder Button */}
            <Link
              href="/gift-finder"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 rounded-full border border-rose-200 transition shadow-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Gift Finder</span>
            </Link>

            <Link
              href="/products"
              className="text-xs sm:text-sm font-medium text-slate-700 hover:text-rose-600 px-2 py-1 transition"
            >
              All Gifts
            </Link>

            <Link
              href="/gift-box"
              className="hidden lg:inline-block text-xs sm:text-sm font-medium text-slate-700 hover:text-rose-600 px-2 py-1 transition"
            >
              Build Box
            </Link>

            <Link
              href="/orders"
              className="hidden sm:inline-block text-xs sm:text-sm font-medium text-slate-700 hover:text-rose-600 px-2 py-1 transition"
            >
              Orders
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="p-2 text-slate-600 hover:text-rose-600 transition relative"
              title="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="p-2 text-slate-600 hover:text-rose-600 transition relative"
              title="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login / Profile */}
            {currentUser ? (
              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg transition"
                title="My Account & Profile"
              >
                <div className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="max-w-[70px] truncate hidden sm:inline">
                  {currentUser.name ? currentUser.name.split(" ")[0] : "Profile"}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs sm:text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-1.5 rounded-lg transition"
              >
                Login
              </Link>
            )}

          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <svg
                className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}