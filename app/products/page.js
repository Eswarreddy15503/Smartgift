"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialOccasion = searchParams.get("occasion") || "all";

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [selectedRecipient, setSelectedRecipient] = useState("all");
  const [priceRange, setPriceRange] = useState(2500);
  const [sortBy, setSortBy] = useState("featured");
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);

  // Available filter options
  const occasionsList = [
    "all",
    "Birthday",
    "Anniversary",
    "Graduation",
    "Valentine's Day",
    "Friendship",
    "Thank You"
  ];

  const recipientsList = [
    "all",
    "Friend",
    "Partner",
    "Mother",
    "Father",
    "Brother",
    "Sister",
    "Teacher",
    "Colleague"
  ];

  // Filter and sort algorithm
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category filter
        if (selectedCategory !== "all" && item.category !== selectedCategory) {
          return false;
        }

        // Search query filter (matches name or category or description)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(query);
          const matchCategory = item.category.toLowerCase().includes(query);
          const matchDesc = item.description.toLowerCase().includes(query);
          if (!matchName && !matchCategory && !matchDesc) return false;
        }

        // Occasion filter
        if (
          selectedOccasion !== "all" &&
          !item.occasion.some((occ) => occ.toLowerCase() === selectedOccasion.toLowerCase())
        ) {
          return false;
        }

        // Recipient filter
        if (
          selectedRecipient !== "all" &&
          !item.recipient.some((rec) => rec.toLowerCase() === selectedRecipient.toLowerCase())
        ) {
          return false;
        }

        // Price range filter
        if (item.price > priceRange) {
          return false;
        }

        // Customizable checkbox
        if (onlyCustomizable && !item.customizable) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // default featured
      });
  }, [
    selectedCategory,
    searchQuery,
    selectedOccasion,
    selectedRecipient,
    priceRange,
    sortBy,
    onlyCustomizable
  ]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedOccasion("all");
    setSelectedRecipient("all");
    setPriceRange(2500);
    setSortBy("featured");
    setOnlyCustomizable(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Browse Gift Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore thoughtful gifts, personalized keepsakes, and curated gift boxes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters */}
        <aside className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-base">Filters</h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Search within page */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Search by Keyword
            </label>
            <input
              type="text"
              placeholder="E.g., mug, bracelet, lamp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Category
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name === "All Gifts" ? "all" : cat.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    (selectedCategory === "all" && cat.name === "All Gifts") ||
                    selectedCategory === cat.name
                      ? "bg-rose-50 text-rose-600 font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Occasion
            </label>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              {occasionsList.map((occ) => (
                <option key={occ} value={occ}>
                  {occ === "all" ? "All Occasions" : occ}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              For Whom (Recipient)
            </label>
            <select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              {recipientsList.map((rec) => (
                <option key={rec} value={rec}>
                  {rec === "all" ? "All Recipients" : rec}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-slate-700">Max Budget</span>
              <span className="font-bold text-rose-600">Rs. {priceRange}</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Rs. 200</span>
              <span>Rs. 2,500</span>
            </div>
          </div>

          {/* Customizable Only Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyCustomizable}
                onChange={(e) => setOnlyCustomizable(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-400 h-4 w-4"
              />
              <span className="text-xs font-medium text-slate-700">
                Customizable items only
              </span>
            </label>
          </div>

        </aside>

        {/* Main Product Grid Area */}
        <section className="lg:col-span-3">
          
          {/* Top Sort & Count Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> gift items
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-by-select" className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort by:</label>
              <select
                id="sort-by-select"
                aria-label="Sort products by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-lg font-bold">
                0
              </div>
              <h3 className="text-lg font-bold text-slate-800">No gifts matched your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your budget range or clearing some filters to see more gift recommendations.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-block bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Reset Filters
              </button>
            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}