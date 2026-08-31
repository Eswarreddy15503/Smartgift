"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("smartgift_user") || "null");
      if (user) setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { name, email, password, confirmPassword } = formData;

    if (!email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!isLogin) {
      if (!name) {
        setErrorMsg("Please provide your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password should be at least 6 characters long.");
        return;
      }

      // Save user to simulated user storage
      const newUser = {
        name,
        email,
        phone: "+91 98765 43210",
        role: "customer",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
        rewardPoints: 200,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("smartgift_user", JSON.stringify(newUser));
      window.dispatchEvent(new Event("userUpdated"));
      setCurrentUser(newUser);
      alert("Account created successfully! You are now logged in.");
      router.push("/profile");
    } else {
      // Mock login verification
      const loggedUser = {
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        email,
        phone: "+91 98765 43210",
        role: email.includes("admin") ? "admin" : "customer",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
        rewardPoints: 350,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("smartgift_user", JSON.stringify(loggedUser));
      window.dispatchEvent(new Event("userUpdated"));
      setCurrentUser(loggedUser);
      router.push(loggedUser.role === "admin" ? "/admin" : "/profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("smartgift_user");
    window.dispatchEvent(new Event("userUpdated"));
    setCurrentUser(null);
    alert("Logged out successfully.");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      
      {/* Student Project Notice */}
      <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-900">
        <strong className="block mb-0.5">Academic Demo Authentication</strong>
        Session state is managed client-side using localStorage. In a production enterprise system, this is replaced by JSON Web Tokens (JWT) or OAuth.
      </div>

      {currentUser ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 font-bold text-lg flex items-center justify-center mx-auto">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Welcome, {currentUser.name}</h2>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/profile"
              className="bg-rose-600 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-rose-700 transition"
            >
              Go to My Account / Profile
            </Link>
            <Link
              href="/orders"
              className="bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-200 transition"
            >
              View My Orders
            </Link>
            {currentUser.role === "admin" && (
              <Link
                href="/admin"
                className="bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-800 transition"
              >
                Go to Admin Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold py-2"
            >
              Log Out
            </button>
          </div>
        </div>

      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => { setIsLogin(true); setErrorMsg(""); }}
              className={`flex-1 pb-3 text-xs font-bold transition border-b-2 ${
                isLogin
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Customer Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrorMsg(""); }}
              className={`flex-1 pb-3 text-xs font-bold transition border-b-2 ${
                !isLogin
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="E.g., Rahul Sharma"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition mt-2"
            >
              {isLogin ? "Sign In" : "Register Account"}
            </button>
          </form>

          {isLogin && (
            <p className="text-[11px] text-slate-400 text-center mt-4">
              Tip: Use email containing &quot;admin&quot; (e.g. admin@smartgift.com) to test admin mode.
            </p>
          )}

        </div>
      )}

    </div>
  );
}