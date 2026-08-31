"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";

export default function GiftBoxPage() {
  const router = useRouter();

  // Box options
  const boxTypes = [
    { id: "kraft", name: "Eco Kraft Wooden Box", price: 149, desc: "Minimalist rustic wooden packaging with straw filling and ribbon" },
    { id: "velvet", name: "Royal Velvet Hardbound Box", price: 249, desc: "Luxury matte magnetic closure box with satin ribbon" },
    { id: "festive", name: "Festive Gold Embossed Hamper", price: 299, desc: "Premium textured golden box with customized seal" }
  ];

  // Eligible items for hamper box (items under Rs. 1000)
  const availableItems = products.filter((p) => p.price <= 900);

  // States
  const [selectedBox, setSelectedBox] = useState(boxTypes[0]);
  const [selectedItemIds, setSelectedItemIds] = useState(["prod-1", "prod-6", "prod-13"]);
  const [cardMessage, setCardMessage] = useState("");
  const [boxName, setBoxName] = useState("My Custom Gift Hamper");
  const [isAdded, setIsAdded] = useState(false);

  // Toggle item selection
  const toggleItem = (id) => {
    if (selectedItemIds.includes(id)) {
      if (selectedItemIds.length === 1) {
        alert("Please keep at least 1 item in your custom gift box.");
        return;
      }
      setSelectedItemIds(selectedItemIds.filter((itemId) => itemId !== id));
    } else {
      if (selectedItemIds.length >= 6) {
        alert("You can select up to 6 items per gift box.");
        return;
      }
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  // Calculate items and total
  const selectedProducts = availableItems.filter((p) => selectedItemIds.includes(p.id));
  const itemsSubtotal = selectedProducts.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = itemsSubtotal + selectedBox.price;

  // Add assembled box to cart
  const handleAddBoxToCart = () => {
    try {
      let cart = JSON.parse(localStorage.getItem("smartgift_cart") || "[]");

      const customBoxItem = {
        id: `box-${Date.now()}`,
        name: boxName.trim() || "Custom Gift Hamper",
        category: "Custom Box",
        price: grandTotal,
        originalPrice: grandTotal + 300,
        image: selectedProducts[0]?.image || selectedBox.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
        quantity: 1,
        isCustomBox: true,
        boxDetails: {
          boxType: selectedBox.name,
          boxPrice: selectedBox.price,
          itemsCount: selectedProducts.length,
          itemsList: selectedProducts.map((p) => p.name),
          message: cardMessage.trim() || null
        }
      };

      cart.push(customBoxItem);
      localStorage.setItem("smartgift_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        router.push("/cart");
      }, 1000);
    } catch (err) {
      console.error("Box cart error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider">
          Custom Hamper Builder
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Build Your Own Gift Box
        </h1>
        <p className="text-sm text-slate-600">
          Pick your packaging style, select your favorite gifts, add a customized handwritten card, and assemble a one-of-a-kind hamper.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Box selection & Items grid */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Step 1: Packaging Style */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Step 1: Choose Box Packaging
              </h2>
              <span className="text-xs text-rose-600 font-semibold">Selected: {selectedBox.name}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {boxTypes.map((box) => (
                <div
                  key={box.id}
                  onClick={() => setSelectedBox(box)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedBox.id === box.id
                      ? "border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-800">{box.name}</span>
                    <span className="text-xs font-extrabold text-rose-600">Rs. {box.price}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">{box.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step 2: Choose Gifts */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 2: Pick Gifts to Put Inside
                </h2>
                <p className="text-xs text-slate-500">Select between 1 to 6 items</p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                {selectedItemIds.length} / 6 selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableItems.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? "border-rose-600 bg-rose-50/40 ring-1 ring-rose-500/30"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent div
                      className="rounded text-rose-600 focus:ring-rose-400 h-4 w-4 pointer-events-none"
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                      <span className="text-[11px] text-slate-500 block">{item.category}</span>
                      <span className="text-xs font-bold text-rose-600">Rs. {item.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Step 3: Card Message */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Step 3: Complimentary Greeting Card & Box Title
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Box Label / Hamper Name
                </label>
                <input
                  type="text"
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="E.g., Priya's Birthday Hamper"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Handwritten Card Note (Optional)
                </label>
                <textarea
                  rows="3"
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="Write a heartfelt greeting to be printed on the card..."
                />
              </div>
            </div>
          </section>

        </div>

        {/* Right Col: Live Box Summary & Price */}
        <aside className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Hamper Breakdown
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{boxName}</h3>
          </div>

          {/* Packaging item */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">{selectedBox.name}</span>
              <span className="font-bold text-slate-900">Rs. {selectedBox.price}</span>
            </div>

            {/* Selected items list */}
            <div className="pt-2 border-t border-dashed border-slate-200 space-y-2">
              <p className="font-bold text-slate-700">Included Gifts ({selectedProducts.length}):</p>
              {selectedProducts.map((p) => (
                <div key={p.id} className="flex justify-between text-slate-600 pl-2 text-[11px]">
                  <span className="truncate max-w-[180px]">&bull; {p.name}</span>
                  <span>Rs. {p.price}</span>
                </div>
              ))}
            </div>

            {cardMessage && (
              <div className="pt-2 border-t border-dashed border-slate-200">
                <p className="font-bold text-slate-700">Card Message:</p>
                <p className="text-[11px] text-slate-500 italic mt-0.5">&ldquo;{cardMessage}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Pricing Calculation */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total:</span>
              <span>Rs. {itemsSubtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Packaging & Ribbon:</span>
              <span>Rs. {selectedBox.price}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Gift Ribbon & Greeting Card:</span>
              <span className="text-emerald-600 font-semibold">Free</span>
            </div>
            <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-200">
              <span>Total Price:</span>
              <span className="text-rose-600">Rs. {grandTotal}</span>
            </div>
          </div>

          {/* Success notice */}
          {isAdded && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl text-center">
              Gift Box added to cart! Redirecting...
            </div>
          )}

          {/* Add to cart CTA */}
          <button
            onClick={handleAddBoxToCart}
            disabled={isAdded}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md transition text-center"
          >
            Add Custom Gift Box to Cart
          </button>
        </aside>

      </div>

    </div>
  );
}