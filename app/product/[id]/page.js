"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage({ params }) {
  // Unwrap params using React.use for Next.js 15/16 App Router
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const product = products.find((p) => p.id === productId);

  // Customization States
  const [customName, setCustomName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [customPhoto, setCustomPhoto] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSurprise, setIsSurprise] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Check wishlist status and record recently viewed product on load
  useEffect(() => {
    if (!product) return;
    try {
      // 1. Wishlist check
      const wishlist = JSON.parse(localStorage.getItem("smartgift_wishlist") || "[]");
      setIsWishlisted(wishlist.some((item) => item.id === product.id));

      // 2. Track recently viewed products
      let recents = JSON.parse(localStorage.getItem("smartgift_recent_products") || "[]");
      recents = recents.filter((item) => item.id !== product.id);
      recents.unshift(product);
      if (recents.length > 8) recents = recents.slice(0, 8);
      localStorage.setItem("smartgift_recent_products", JSON.stringify(recents));
    } catch {
      setIsWishlisted(false);
    }
  }, [product]);


  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Gift Not Found</h1>
        <p className="text-sm text-slate-500">
          The product you are looking for might have been moved or removed.
        </p>
        <Link
          href="/products"
          className="inline-block bg-rose-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-rose-700 transition"
        >
          Return to All Gifts
        </Link>
      </div>
    );
  }

  // Handle Photo Upload with live Base64 preview
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Wishlist
  const handleToggleWishlist = () => {
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
      console.error(err);
    }
  };

  // Add to Cart
  const handleAddToCart = (redirectAfter = false) => {
    try {
      let cart = JSON.parse(localStorage.getItem("smartgift_cart") || "[]");

      const customizationData = product.customizable
        ? {
            name: customName.trim() || null,
            message: customMessage.trim() || null,
            hasPhoto: !!customPhoto,
            photoUrl: customPhoto || null
          }
        : null;

      const cartItem = {
        ...product,
        quantity: quantity,
        customization: customizationData,
        isSurprise: isSurprise
      };

      cart.push(cartItem);
      localStorage.setItem("smartgift_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      if (redirectAfter) {
        router.push("/checkout");
      } else {
        setAddedNotice(true);
        setTimeout(() => setAddedNotice(false), 2500);
      }
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-rose-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-rose-600">Gifts</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        
        {/* Left Column: Product Image & Badges */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick reassurance points */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-slate-600">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800 block">Fast Dispatch</span>
              <span>Ships in 24h</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800 block">Quality Check</span>
              <span>100% Verified</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800 block">Gift Box Ready</span>
              <span>Premium Pack</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Customization Inputs */}
        <div className="space-y-6 flex flex-col justify-between">
          
          <div>
            {/* Category & Tag */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                In Stock ({product.inStock} units)
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500 text-sm">
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>
              <span className="text-xs font-bold text-slate-700">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewsCount} customer reviews)</span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mt-4 pb-4 border-b border-slate-100">
              <span className="text-3xl font-extrabold text-slate-900">
                Rs. {product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-slate-400 line-through">
                  Rs. {product.originalPrice}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Save Rs. {product.originalPrice - product.price}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed mt-4">
              {product.description}
            </p>

            {/* Suitable Occasions and Recipients Tags */}
            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium mr-1">Best for:</span>
                {product.recipient.map((r, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                    {r}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium mr-1">Occasion:</span>
                {product.occasion.map((o, i) => (
                  <span key={i} className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[11px]">
                    {o}
                  </span>
                ))}
              </div>
            </div>

            {/* CUSTOMIZATION SECTION IF APPLICABLE */}
            {product.customizable && (
              <div className="mt-6 p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">
                    Personalize This Gift
                  </h2>
                  <span className="text-[11px] font-semibold text-rose-600">
                    Live Preview Available
                  </span>
                </div>

                {/* Input 1: Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Name / Text to print:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name (e.g. Rahul, Priya)"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                {/* Input 2: Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Message / Greeting:
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Happy Birthday to the best brother!"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                {/* Input 3: Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Photo (Optional):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
                  />
                </div>

                {/* LIVE PREVIEW CARD */}
                <div className="mt-4 pt-3 border-t border-rose-200/60">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Customization Live Preview:
                  </p>
                  <div className="bg-white p-4 rounded-xl border border-dashed border-rose-300 text-center space-y-2 max-w-xs mx-auto shadow-xs">
                    {customPhoto ? (
                      <img
                        src={customPhoto}
                        alt="Uploaded preview"
                        className="w-24 h-24 object-cover mx-auto rounded-lg border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-20 h-20 mx-auto rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                        Photo Area
                      </div>
                    )}
                    <p className="text-xs font-bold text-slate-800">
                      {customMessage || "Your Custom Message Here"}
                    </p>
                    <p className="text-xs font-semibold text-rose-600">
                      {customName ? `- ${customName}` : "Recipient Name"}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Surprise Gift Checkbox */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSurprise}
                  onChange={(e) => setIsSurprise(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-400 h-4 w-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Send as a Surprise Gift
                  </span>
                  <span className="text-[11px] text-slate-500">
                    The invoice and price tag will be hidden from the recipient.
                  </span>
                </div>
              </label>
            </div>

          </div>

          {/* Bottom Action Section */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            
            {/* Added Notice banner */}
            {addedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl text-center">
                Added to cart successfully!
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              
              {/* Quantity */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 w-full sm:w-auto justify-between">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => handleAddToCart(false)}
                className="w-full flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-3 px-4 rounded-xl border border-rose-200 transition"
              >
                Add to Cart
              </button>

              {/* Buy Now */}
              <button
                onClick={() => handleAddToCart(true)}
                className="w-full flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition"
              >
                Buy Now
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={`p-3 rounded-xl border transition ${
                  isWishlisted
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-white text-slate-500 border-slate-200 hover:text-rose-600"
                }`}
                title="Wishlist"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Similar Gifts Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Similar Gifts You Might Like</h2>
            <Link href="/products" className="text-xs font-semibold text-rose-600 hover:underline">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}