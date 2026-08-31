"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isPlaced, setIsPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Address form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("Delhi");
  const [pincode, setPincode] = useState("");

  // Scheduling state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];
  const [deliveryDate, setDeliveryDate] = useState(defaultDate);
  const [deliverySlot, setDeliverySlot] = useState("Evening (5:00 PM - 9:00 PM)");

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("smartgift_cart") || "[]");
      setCartItems(cart);

      // Pre-fill user if logged in
      const user = JSON.parse(localStorage.getItem("smartgift_user") || "null");
      if (user && user.name) {
        setFullName(user.name);
      }
    } catch {
      setCartItems([]);
    }
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const deliveryCharge = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + deliveryCharge;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!fullName || !phone || !address || !city || !pincode) {
      alert("Please fill in all shipping details.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add gifts before checking out.");
      router.push("/products");
      return;
    }

    setIsProcessing(true);

    // Simulate network latency / payment gateway
    setTimeout(() => {
      const orderId = "SG-" + Math.floor(100000 + Math.random() * 900000);
      const newOrder = {
        orderId,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }),
        items: cartItems,
        totalAmount: grandTotal,
        deliveryDate: deliveryDate,
        deliverySlot: deliverySlot,
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
          state: stateName,
          pincode
        },
        paymentMethod: paymentMethod.toUpperCase(),
        status: "Confirmed"
      };

      try {
        let existingOrders = JSON.parse(localStorage.getItem("smartgift_orders") || "[]");
        existingOrders.unshift(newOrder);
        localStorage.setItem("smartgift_orders", JSON.stringify(existingOrders));

        // Clear cart
        localStorage.setItem("smartgift_cart", JSON.stringify([]));
        window.dispatchEvent(new Event("cartUpdated"));

        setPlacedOrder(newOrder);
        setIsPlaced(true);
      } catch (err) {
        console.error("Order save error:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 1200);
  };

  // If order was just placed, display confirmation screen
  if (isPlaced && placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Thank you for ordering with SmartGift. Your order ID is{" "}
            <strong className="text-slate-900">{placedOrder.orderId}</strong>.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-left text-xs space-y-4">
          <div className="flex justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500">Scheduled Delivery:</span>
            <span className="font-bold text-slate-800">
              {placedOrder.deliveryDate} ({placedOrder.deliverySlot})
            </span>
          </div>

          <div className="flex justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500">Deliver To:</span>
            <span className="font-bold text-slate-800 text-right">
              {placedOrder.shippingAddress.fullName}, {placedOrder.shippingAddress.city} - {placedOrder.shippingAddress.pincode}
            </span>
          </div>

          <div className="flex justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500">Payment:</span>
            <span className="font-bold text-slate-800">
              {placedOrder.paymentMethod} (Simulated)
            </span>
          </div>

          <div className="flex justify-between font-bold text-slate-900 text-sm">
            <span>Total Paid:</span>
            <span className="text-rose-600">Rs. {placedOrder.totalAmount}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/orders"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition text-center"
          >
            Track in My Orders
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs px-6 py-3 rounded-xl transition text-center"
          >
            Continue Browsing Gifts
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          Please add gift items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-block bg-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-rose-700 transition"
        >
          Browse Gifts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Checkout & Schedule Delivery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Provide recipient delivery details and select your preferred gift delivery slot
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Shipping Details, Scheduling & Payment */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Shipping Address */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              1. Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="E.g., Priya Sharma"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="E.g., 9876543210"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address & House / Flat No. *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 402, Sunshine Apartments, MG Road"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="E.g., Bangalore, Hyderabad, Delhi"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="E.g., 560001"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Gift Scheduling */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                2. Schedule Gift Delivery Date & Time
              </h2>
              <p className="text-xs text-slate-500">
                Ensure your surprise reaches exactly on their special birthday or anniversary!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Delivery Date
                </label>
                <input
                  type="date"
                  min={defaultDate}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Time Slot
                </label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option>Morning (9:00 AM - 1:00 PM)</option>
                  <option>Afternoon (1:00 PM - 5:00 PM)</option>
                  <option>Evening (5:00 PM - 9:00 PM)</option>
                  <option>Midnight Special (11:45 PM - 12:15 AM)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Payment Options */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              3. Payment Method (Simulated Academic Demo)
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === "upi"
                    ? "border-rose-600 bg-rose-50/50 ring-1 ring-rose-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="text-rose-600 focus:ring-rose-400"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800 block">
                    Instant UPI (Google Pay / PhonePe / Paytm)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Simulates instant UPI authentication & zero transaction fees.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === "card"
                    ? "border-rose-600 bg-rose-50/50 ring-1 ring-rose-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="text-rose-600 focus:ring-rose-400"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800 block">
                    Credit / Debit Card (Visa, Mastercard, RuPay)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Simulated payment processing with 128-bit encryption demo.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-rose-600 bg-rose-50/50 ring-1 ring-rose-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="text-rose-600 focus:ring-rose-400"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800 block">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Pay in cash or digital scanner at the time of doorstep delivery.
                  </span>
                </div>
              </label>
            </div>
          </section>

        </div>

        {/* Right Col: Summary & Place Order */}
        <aside className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24 space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Items in Order ({cartItems.length})
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-bold text-slate-800 truncate">{item.name}</p>
                    <span className="text-[10px] text-slate-500">Qty: {item.quantity || 1}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  Rs. {item.price * (item.quantity || 1)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery:</span>
              <span>{deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-200">
              <span>Total:</span>
              <span className="text-rose-600">Rs. {grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {isProcessing ? "Processing Order..." : `Place Order (Rs. ${grandTotal})`}
          </button>
        </aside>

      </form>

    </div>
  );
}