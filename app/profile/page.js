"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // User profile state
  const [user, setUser] = useState({
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 98765 43210",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
    memberSince: "January 2026",
    rewardPoints: 350
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: ""
  });

  // Data states from LocalStorage
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      title: "Home Address",
      fullName: "Rahul Verma",
      phone: "+91 98765 43210",
      street: "Flat 204, Green Heights, 12th Main Road, Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560038",
      isDefault: true
    },
    {
      id: "addr-2",
      title: "Office / Work",
      fullName: "Rahul Verma",
      phone: "+91 98765 43210",
      street: "Tech Park Block 4, 3rd Floor, Outer Ring Road, Bellandur",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560103",
      isDefault: false
    }
  ]);

  const [newAddressForm, setNewAddressForm] = useState({
    title: "Home",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "Karnataka",
    pincode: ""
  });
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState("");

  // Available loyalty coupons
  const availableCoupons = [
    {
      code: "GIFTLOVE",
      discount: "Free Luxury Packaging",
      desc: "Valid on all gift hampers & custom boxes above Rs. 999",
      minOrder: 999,
      expiry: "30 Sep 2026"
    },
    {
      code: "WELCOME100",
      discount: "Rs. 100 Instant Discount",
      desc: "Special welcome reward for your first customized gift order",
      minOrder: 499,
      expiry: "31 Dec 2026"
    },
    {
      code: "BIRTHDAY15",
      discount: "15% OFF Birthday Gifts",
      desc: "Exclusive discount on cakes, photo frames & birthday boxes",
      minOrder: 799,
      expiry: "15 Oct 2026"
    },
    {
      code: "SURPRISE10",
      discount: "10% OFF Surprise Mode",
      desc: "Applicable on all scheduled surprise gift deliveries",
      minOrder: 500,
      expiry: "28 Nov 2026"
    }
  ];

  // Load all user details and storage data
  useEffect(() => {
    try {
      // 1. User
      const storedUser = JSON.parse(localStorage.getItem("smartgift_user") || "null");
      if (storedUser) {
        setUser((prev) => ({
          ...prev,
          name: storedUser.name || prev.name,
          email: storedUser.email || prev.email,
          phone: storedUser.phone || prev.phone,
          role: storedUser.role || prev.role,
          avatar: storedUser.avatar || prev.avatar,
          memberSince: storedUser.createdAt ? new Date(storedUser.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : prev.memberSince,
          rewardPoints: storedUser.rewardPoints || prev.rewardPoints
        }));
      }

      // 2. Orders
      const storedOrders = JSON.parse(localStorage.getItem("smartgift_orders") || "[]");
      setOrders(storedOrders);

      // 3. Wishlist
      const storedWishlist = JSON.parse(localStorage.getItem("smartgift_wishlist") || "[]");
      setWishlist(storedWishlist);

      // 4. Recently viewed
      const storedRecents = JSON.parse(localStorage.getItem("smartgift_recent_products") || "[]");
      if (storedRecents.length > 0) {
        setRecentProducts(storedRecents);
      } else {
        setRecentProducts(products.slice(0, 4));
      }

      // 5. Addresses
      const storedAddresses = JSON.parse(localStorage.getItem("smartgift_addresses") || "null");
      if (storedAddresses && storedAddresses.length > 0) {
        setAddresses(storedAddresses);
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
  }, []);

  // Sync edit form with user state when opening edit mode
  const handleOpenEdit = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar
    });
    setIsEditing(true);
  };

  // Save profile changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name: editForm.name.trim() || user.name,
      email: editForm.email.trim() || user.email,
      phone: editForm.phone.trim() || user.phone,
      avatar: editForm.avatar || user.avatar
    };
    setUser(updatedUser);
    localStorage.setItem("smartgift_user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("userUpdated"));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  // Handle avatar image upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Address Handler
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddressForm.fullName || !newAddressForm.street || !newAddressForm.city || !newAddressForm.pincode) {
      alert("Please fill in all required address fields.");
      return;
    }

    const createdAddr = {
      id: `addr-${Date.now()}`,
      title: newAddressForm.title || "Home",
      fullName: newAddressForm.fullName,
      phone: newAddressForm.phone || user.phone,
      street: newAddressForm.street,
      city: newAddressForm.city,
      state: newAddressForm.state,
      pincode: newAddressForm.pincode,
      isDefault: addresses.length === 0
    };

    const updated = [...addresses, createdAddr];
    setAddresses(updated);
    localStorage.setItem("smartgift_addresses", JSON.stringify(updated));
    setShowAddAddressModal(false);
    setNewAddressForm({
      title: "Home",
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "Karnataka",
      pincode: ""
    });
    alert("New address saved!");
  };

  // Delete Address
  const handleDeleteAddress = (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      const updated = addresses.filter((a) => a.id !== id);
      setAddresses(updated);
      localStorage.setItem("smartgift_addresses", JSON.stringify(updated));
    }
  };

  // Set Default Address
  const handleSetDefaultAddress = (id) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(updated);
    localStorage.setItem("smartgift_addresses", JSON.stringify(updated));
  };

  // Copy Coupon Code
  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(""), 2000);
  };

  // Logout Handler
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("smartgift_user");
      window.dispatchEvent(new Event("userUpdated"));
      router.push("/login");
    }
  };

  // Derived Upcoming Scheduled Gifts
  const upcomingGifts = orders.filter(
    (ord) => ord.status !== "Cancelled" && ord.deliveryDate
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded">
              Member Account
            </span>
            <span className="text-xs text-slate-400">&bull; Member since {user.memberSince}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            My Account & Profile
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Edit Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar: User Card & Navigation Tabs */}
        <aside className="space-y-6">
          
          {/* User Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-rose-200 shadow-xs mx-auto"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {user.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
              <p className="text-[11px] text-slate-400">{user.phone}</p>
            </div>

            {/* Loyalty points mini badge */}
            <div className="p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-100 text-left space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-rose-900">GiftPoints Balance</span>
                <span className="font-extrabold text-rose-600 text-sm">{user.rewardPoints} pts</span>
              </div>
              <p className="text-[10px] text-slate-500">Worth Rs. {user.rewardPoints} off on next hamper</p>
            </div>
          </div>

          {/* Navigation Tabs Menu */}
          <nav className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "overview"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "orders"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Orders & Scheduled Gifts</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === "orders" ? "bg-rose-700 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("recents")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "recents"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Recently Viewed</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === "recents" ? "bg-rose-700 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {recentProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "wishlist"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Saved Wishlist</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === "wishlist" ? "bg-rose-700 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("coupons")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "coupons"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Coupons & Loyalty</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === "coupons" ? "bg-rose-700 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {availableCoupons.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === "addresses"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Saved Addresses</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === "addresses" ? "bg-rose-700 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {addresses.length}
              </span>
            </button>
          </nav>

        </aside>

        {/* Right Main Content Area */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Orders Placed</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Lifetime purchases</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Scheduled Gifts</span>
                  <p className="text-2xl font-extrabold text-rose-600 mt-1">{upcomingGifts.length}</p>
                  <span className="text-[10px] text-rose-600 font-semibold mt-1 block">Upcoming deliveries</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Wishlist Items</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{wishlist.length}</p>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Saved for later</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Reward Points</span>
                  <p className="text-2xl font-extrabold text-purple-600 mt-1">{user.rewardPoints}</p>
                  <span className="text-[10px] text-purple-600 font-semibold mt-1 block">GiftPoints</span>
                </div>
              </div>

              {/* Upcoming Scheduled Gifts Banner */}
              {upcomingGifts.length > 0 && (
                <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-3xl p-6 text-white shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                      Upcoming Delivery Reminder
                    </span>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs text-pink-100 hover:text-white font-semibold underline"
                    >
                      View All Orders &rarr;
                    </button>
                  </div>

                  <h3 className="text-lg font-bold">
                    Next Gift Scheduled for {upcomingGifts[0].deliveryDate}
                  </h3>
                  <p className="text-xs text-pink-100 leading-relaxed">
                    Order #{upcomingGifts[0].orderId} will be dispatched to {upcomingGifts[0].shippingAddress?.fullName} ({upcomingGifts[0].shippingAddress?.city}) during the {upcomingGifts[0].deliverySlot}.
                  </p>
                </div>
              )}

              {/* Gift Activity History */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Gifting Activity & Milestones
                  </h3>
                  <span className="text-xs text-rose-600 font-semibold">Active Gifter</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-500 font-medium block">Favorite Occasion</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">Birthday Celebrations</span>
                    <span className="text-[10px] text-slate-400">4 gifts sent</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-500 font-medium block">Top Recipient</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">Friends & Siblings</span>
                    <span className="text-[10px] text-slate-400">Personalized items</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-500 font-medium block">Custom Hampers Made</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">2 Custom Boxes</span>
                    <span className="text-[10px] text-slate-400">Handwritten cards</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Recent Orders & Scheduled Deliveries
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 2).map((order) => (
                      <div
                        key={order.orderId}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">#{order.orderId}</span>
                            <span className="text-slate-400">&bull; {order.date}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1">
                            Scheduled: <strong className="text-slate-800">{order.deliveryDate}</strong> ({order.deliverySlot})
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900 block">
                            Rs. {order.totalAmount}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {order.items?.length || 1} item(s)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-2">No orders placed yet.</p>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS & DELIVERIES */}
          {activeTab === "orders" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Order History & Scheduled Deliveries
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing all past purchases and scheduled gift parcels
                  </p>
                </div>
                <Link
                  href="/products"
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  + Order New Gift
                </Link>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm">#{order.orderId}</span>
                          <span className="text-slate-400 ml-2">&bull; Placed on {order.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-600">
                            Delivery: {order.deliveryDate}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                              />
                              <div>
                                <p className="font-bold text-slate-800">{item.name}</p>
                                <span className="text-[11px] text-slate-500">Qty: {item.quantity || 1} &bull; Rs. {item.price} each</span>
                                {item.customization?.name && (
                                  <p className="text-[10px] text-rose-600">Customized: {item.customization.name}</p>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-slate-900">
                              Rs. {item.price * (item.quantity || 1)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600">
                        <span>
                          Address: {order.shippingAddress?.fullName}, {order.shippingAddress?.city} ({order.shippingAddress?.pincode})
                        </span>
                        <div className="font-bold text-slate-900">
                          Total Paid: <span className="text-rose-600">Rs. {order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No orders recorded yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECENTLY VIEWED PRODUCTS */}
          {activeTab === "recents" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Recently Viewed Gifts
                </h3>
                <p className="text-xs text-slate-500">
                  Items you have explored recently during your browsing sessions
                </p>
              </div>

              {recentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {recentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No recently viewed products.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    My Saved Wishlist ({wishlist.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Quickly purchase gifts you have saved for upcoming dates
                  </p>
                </div>
                <Link
                  href="/wishlist"
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Manage Wishlist Page &rarr;
                </Link>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                  <p>Your wishlist is empty.</p>
                  <Link href="/products" className="inline-block text-rose-600 font-semibold underline">
                    Browse gift catalog to add items
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: COUPONS & REWARDS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              
              {/* Rewards Points Card */}
              <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-rose-700 rounded-3xl p-6 text-white shadow-md space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                      SmartGift Rewards Club
                    </span>
                    <h3 className="text-2xl font-extrabold mt-2">
                      {user.rewardPoints} Loyalty GiftPoints
                    </h3>
                    <p className="text-xs text-purple-100 mt-0.5">
                      1 Point = Rs. 1.00 Discount on future gift boxes & personalized gifts.
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-xl">
                    RP
                  </div>
                </div>

                <div className="pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-[11px] text-purple-100">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <strong className="block text-white">10 Pts</strong>
                    <span>Per Rs. 100 Spent</span>
                  </div>
                  <div className="p-2 bg-white/10 rounded-xl">
                    <strong className="block text-white">50 Pts</strong>
                    <span>On Reviews</span>
                  </div>
                  <div className="p-2 bg-white/10 rounded-xl">
                    <strong className="block text-white">Auto-Apply</strong>
                    <span>At Checkout</span>
                  </div>
                </div>
              </div>

              {/* Available Promo Coupons Grid */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Available Coupons & Discount Codes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any coupon code below to copy and apply during checkout
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableCoupons.map((c) => (
                    <div
                      key={c.code}
                      className="p-4 rounded-2xl border border-dashed border-rose-300 bg-rose-50/40 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-800">
                            {c.discount}
                          </span>
                          <span className="text-[10px] text-slate-400">Exp: {c.expiry}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.desc}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-rose-200/60">
                        <span className="font-mono text-xs font-extrabold text-rose-700 bg-white px-2.5 py-1 rounded-md border border-rose-200">
                          {c.code}
                        </span>
                        <button
                          onClick={() => handleCopyCoupon(c.code)}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700 transition"
                        >
                          {copiedCoupon === c.code ? "Copied!" : "Copy Code"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: SAVED ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Saved Delivery Addresses
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage recipient destinations for fast, one-click checkout
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
                >
                  + Add New Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl border transition space-y-3 ${
                      addr.isDefault
                        ? "border-rose-600 bg-rose-50/30 ring-1 ring-rose-500/20"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        {addr.title}
                      </span>
                      {addr.isDefault ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[10px] font-semibold text-rose-600 hover:underline"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 space-y-0.5 leading-relaxed">
                      <p className="font-bold text-slate-800">{addr.fullName}</p>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-slate-500 text-[11px] pt-1">Phone: {addr.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile Information</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Photo preview & upload */}
              <div className="flex items-center gap-4">
                <img
                  src={editForm.avatar || user.avatar}
                  alt="Preview"
                  className="w-14 h-14 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Update Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add New Delivery Address</h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address Label (Home / Office / Friend)</label>
                <input
                  type="text"
                  required
                  value={newAddressForm.title}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, title: e.target.value })}
                  placeholder="E.g., Home, Sister's Apartment"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddressForm.fullName}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, fullName: e.target.value })}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddressForm.street}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                  placeholder="House/Flat No, Apartment Name, Street"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                    placeholder="Bangalore"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.pincode}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                    placeholder="560038"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}