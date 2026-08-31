"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function GiftFinderPage() {
  // Step form state
  const [recipient, setRecipient] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [style, setStyle] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Available options
  const recipientOptions = [
    "Friend",
    "Partner",
    "Mother",
    "Father",
    "Brother",
    "Sister",
    "Teacher",
    "Colleague"
  ];

  const occasionOptions = [
    "Birthday",
    "Anniversary",
    "Graduation",
    "Wedding",
    "Valentine's Day",
    "Friendship",
    "Thank You"
  ];

  const budgetOptions = [
    { label: "Under Rs. 500", min: 0, max: 500 },
    { label: "Rs. 500 - Rs. 1,000", min: 500, max: 1000 },
    { label: "Rs. 1,000 - Rs. 2,000", min: 1000, max: 2000 },
    { label: "Rs. 2,000+", min: 2000, max: 10000 }
  ];

  const styleOptions = [
    "Useful",
    "Cute",
    "Emotional",
    "Funny",
    "Personalized",
    "Premium"
  ];

  // RECOMMENDATION ALGORITHM (Simple weighted scoring system)
  // Calculates compatibility score for each product based on selected criteria
  const getRecommendedProducts = () => {
    if (!recipient && !occasion && !budget && !style) {
      return [];
    }

    const selectedBudgetObj = budgetOptions.find((b) => b.label === budget);

    const scoredProducts = products.map((item) => {
      let score = 0;

      // 1. Recipient Match (Weight: 40 points)
      if (recipient && item.recipient.some((r) => r.toLowerCase() === recipient.toLowerCase())) {
        score += 40;
      }

      // 2. Occasion Match (Weight: 35 points)
      if (occasion && item.occasion.some((o) => o.toLowerCase() === occasion.toLowerCase())) {
        score += 35;
      }

      // 3. Budget Match (Weight: 15 points)
      if (selectedBudgetObj) {
        if (item.price >= selectedBudgetObj.min && item.price <= selectedBudgetObj.max) {
          score += 15;
        } else if (Math.abs(item.price - selectedBudgetObj.max) <= 200) {
          score += 5; // Close to budget bonus
        }
      }

      // 4. Style Match (Weight: 10 points)
      if (style && item.style && item.style.toLowerCase() === style.toLowerCase()) {
        score += 10;
      }

      // Add a small rating factor for tie-breaking
      score += (item.rating || 4) * 2;

      return {
        ...item,
        matchScore: Math.min(100, Math.round(score))
      };
    });

    // Return products with score above threshold, sorted by highest match score
    return scoredProducts
      .filter((item) => item.matchScore > 25)
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const recommendedList = hasSearched ? getRecommendedProducts() : [];

  const handleFindGifts = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handleReset = () => {
    setRecipient("");
    setOccasion("");
    setBudget("");
    setStyle("");
    setHasSearched(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider">
          Intelligent Recommendation Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Smart Gift Finder
        </h1>
        <p className="text-sm text-slate-600">
          Answer 4 quick questions below. Our recommendation logic will scan all gifts and calculate the highest matching items for your recipient and budget.
        </p>
      </div>

      {/* 4-Step Selection Form */}
      <form
        onSubmit={handleFindGifts}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-8"
      >
        {/* Question 1: Recipient */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            1. Who is this gift for?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {recipientOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRecipient(r)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                  recipient === r
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Occasion */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            2. What is the occasion?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {occasionOptions.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOccasion(o)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                  occasion === o
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Question 3: Budget */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            3. What is your approximate budget?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {budgetOptions.map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => setBudget(b.label)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                  budget === b.label
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 4: Style */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            4. Preferred Gift Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {styleOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                  style === s
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            Clear Selections
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md transition"
          >
            Find Recommended Gifts
          </button>
        </div>
      </form>

      {/* RESULTS SECTION */}
      {hasSearched && (
        <section className="mt-14 scroll-mt-10" id="results">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Algorithm Output
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Recommended Gifts For You
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Criteria:</span>
              {recipient && <span className="bg-slate-100 px-2 py-0.5 rounded">{recipient}</span>}
              {occasion && <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded">{occasion}</span>}
              {budget && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{budget}</span>}
              {style && <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">{style}</span>}
            </div>
          </div>

          {recommendedList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedList.map((product) => (
                <div key={product.id} className="relative">
                  {/* Match score badge */}
                  <div className="mb-2 flex items-center justify-between text-xs px-2">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {product.matchScore}% Match
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Recommended for {recipient || "you"}
                    </span>
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-slate-800">No Direct Match Found</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We could not find an exact product matching all selected constraints. Try adjusting your budget or recipient filter.
              </p>
              <Link
                href="/products"
                className="inline-block bg-rose-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-rose-700 transition"
              >
                Browse All Gifts
              </Link>
            </div>
          )}
        </section>
      )}

    </div>
  );
}