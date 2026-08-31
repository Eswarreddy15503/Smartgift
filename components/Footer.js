import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                SmartGift
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Making gifting effortless and memorable. Personalized gifts, custom gift boxes, and intelligent recommendations tailored for every special occasion.
            </p>
            <p className="text-xs text-rose-400 font-medium">
              Academic & Portfolio Project
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/gift-finder" className="hover:text-rose-400 transition">
                  Gift Recommendation Finder
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-rose-400 transition">
                  All Gift Products
                </Link>
              </li>
              <li>
                <Link href="/gift-box" className="hover:text-rose-400 transition">
                  Build Your Own Gift Box
                </Link>
              </li>
              <li>
                <Link href="/products?category=Personalized" className="hover:text-rose-400 transition">
                  Customized & Engraved Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Occasions & Recipient */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Popular Occasions
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/products?occasion=Birthday" className="hover:text-rose-400 transition">
                  Birthday Gifts
                </Link>
              </li>
              <li>
                <Link href="/products?occasion=Anniversary" className="hover:text-rose-400 transition">
                  Anniversary Surprises
                </Link>
              </li>
              <li>
                <Link href="/products?occasion=Graduation" className="hover:text-rose-400 transition">
                  Graduation Hampers
                </Link>
              </li>
              <li>
                <Link href="/products?occasion=Friendship" className="hover:text-rose-400 transition">
                  Friendship Treats
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Project Details
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-3">
              Built with Next.js, React, and Tailwind CSS. Demonstrates client-side persistence, recommendation algorithms, and e-commerce workflows.
            </p>
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-xs text-slate-300">
              <span className="font-semibold text-white">Student Project Mode</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Demo authentication & simulated payments enabled.</p>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} SmartGift Store. Academic & Portfolio Project.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Next.js + React</span>
            <span>&bull;</span>
            <Link href="/admin" className="text-slate-400 hover:text-rose-400 transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}