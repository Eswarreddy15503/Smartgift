import Link from "next/link";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const popularProducts = products.filter((p) => p.isPopular).slice(0, 4);

  return (
    <main className="min-h-screen pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-pink-50/30 to-white py-16 sm:py-24 border-b border-rose-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-semibold tracking-wide">
              <span>Personalized Gift Recommendation Platform</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find the <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Perfect Gift</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Tell us who you're buying for, the occasion, and your budget. We'll help you find a suitable gift easily instead of searching through hundreds of products.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/gift-finder"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm"
              >
                <span>Find a Gift (Smart Finder)</span>
              </Link>

              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-all text-sm"
              >
                <span>Browse All Gifts</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Quick stats / Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-rose-100/60 max-w-lg mx-auto text-slate-700">
              <div>
                <p className="text-lg font-extrabold text-rose-600">100%</p>
                <p className="text-xs text-slate-500 font-medium">Personalized</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-rose-600">Fast</p>
                <p className="text-xs text-slate-500 font-medium">Delivery</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-rose-600">Smart</p>
                <p className="text-xs text-slate-500 font-medium">Suggestions</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORIES CHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Explore by Category</h2>
            <p className="text-xs text-slate-500">Pick a category to find curated gifts</p>
          </div>
          <Link href="/products" className="text-xs font-semibold text-rose-600 hover:underline">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === "all" ? "/products" : `/products?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-rose-300 hover:bg-rose-50/50 hover:shadow-xs transition group text-center"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs mb-1.5 group-hover:bg-rose-600 group-hover:text-white transition">
                {cat.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-slate-700 group-hover:text-rose-600">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED GIFTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-rose-500 font-bold text-sm uppercase tracking-wider">Handpicked</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Gifts</h2>
          </div>
          <Link href="/products" className="text-xs font-semibold text-rose-600 hover:underline">
            See all gifts &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL OFFER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 rounded-3xl text-white p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Special Feature
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Build Your Own Custom Gift Box
            </h2>
            <p className="text-sm text-pink-100 leading-relaxed">
              Mix and match chocolates, candles, frames, and greeting cards to create a custom hamper for your loved ones.
            </p>
            <div className="pt-2">
              <Link
                href="/gift-box"
                className="inline-flex items-center gap-2 bg-white text-rose-600 hover:bg-rose-50 font-bold px-5 py-2.5 rounded-xl shadow-xs transition"
              >
                <span>Start Creating Box</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR GIFTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold text-sm uppercase tracking-wider">Trending Now</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Most Loved Gifts</h2>
          </div>
          <Link href="/products" className="text-xs font-semibold text-rose-600 hover:underline">
            View full collection &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900">How SmartGift Works</h2>
            <p className="text-sm text-slate-600 mt-2">
              Personalized gifting made easy in three straightforward steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-base font-bold text-slate-800">Use Gift Finder</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose who you are gifting (Friend, Parent, Partner), the occasion, and budget to get instant tailored recommendations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-base font-bold text-slate-800">Personalize & Preview</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add custom names, heartfelt messages, and photos with our live preview before ordering.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-base font-bold text-slate-800">Schedule or Surprise</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your preferred delivery date or choose surprise mode where the price is hidden from the recipient.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}



