"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products as initialProducts } from "@/data/products";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [productList, setProductList] = useState(initialProducts);
  const [ordersList, setOrdersList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Personalized",
    price: "",
    originalPrice: "",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
    description: "",
    customizable: true,
    inStock: 20
  });

  // Load orders and customized products from localStorage
  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem("smartgift_orders") || "[]");
      setOrdersList(orders);

      const customCatalog = JSON.parse(localStorage.getItem("smartgift_admin_products") || "null");
      if (customCatalog && customCatalog.length > 0) {
        setProductList(customCatalog);
      }
    } catch {
      setOrdersList([]);
    }
  }, []);

  // Save updated catalog to localStorage
  const saveCatalog = (updated) => {
    setProductList(updated);
    localStorage.setItem("smartgift_admin_products", JSON.stringify(updated));
  };

  // Add Product Handler
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert("Please fill in product name and price.");
      return;
    }

    const created = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice || Number(newProduct.price) + 200),
      rating: 4.8,
      reviewsCount: 1,
      image: newProduct.image,
      description: newProduct.description || "Thoughtfully curated gift item.",
      occasion: ["Birthday", "Friendship"],
      recipient: ["Friend", "Partner"],
      style: "Personalized",
      customizable: newProduct.customizable,
      isFeatured: false,
      isPopular: true,
      inStock: Number(newProduct.inStock) || 15
    };

    const updated = [created, ...productList];
    saveCatalog(updated);
    setShowAddModal(false);
    setNewProduct({
      name: "",
      category: "Personalized",
      price: "",
      originalPrice: "",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
      description: "",
      customizable: true,
      inStock: 20
    });
    alert("New product added to catalog successfully!");
  };

  // Delete Product Handler
  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product from the catalog?")) {
      const updated = productList.filter((p) => p.id !== id);
      saveCatalog(updated);
    }
  };

  // Update Order Status Handler
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = ordersList.map((ord) =>
      ord.orderId === orderId ? { ...ord, status: newStatus } : ord
    );
    setOrdersList(updated);
    localStorage.setItem("smartgift_orders", JSON.stringify(updated));
  };

  // Analytics Metrics
  const totalSales = ordersList
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
              Admin Portal
            </span>
            <span className="text-xs text-slate-500">Demo Store Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Store Administration & Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            + Add New Gift Product
          </button>
          <Link
            href="/products"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition"
          >
            View Live Store
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Products</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{productList.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Active in catalog</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Orders</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{ordersList.length}</p>
          <span className="text-[11px] text-blue-600 font-medium mt-1 block">Recorded in storage</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Sales Revenue</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">Rs. {totalSales}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Excluding cancellations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Customer Accounts</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">48</p>
          <span className="text-[11px] text-purple-600 font-medium mt-1 block">Simulated user base</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === "products"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Product Management ({productList.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === "orders"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Order Processing & Dispatch ({ordersList.length})
        </button>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === "products" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Customizable</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productList.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{product.name}</p>
                          <span className="text-[10px] text-slate-400">ID: {product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{product.category}</td>
                    <td className="p-4 font-bold text-slate-900">Rs. {product.price}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {product.inStock} units
                      </span>
                    </td>
                    <td className="p-4">
                      {product.customizable ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Recipient & City</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Scheduled Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ordersList.map((order) => (
                  <tr key={order.orderId} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">
                      #{order.orderId}
                      <span className="block text-[10px] text-slate-400 font-normal">{order.date}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{order.shippingAddress?.fullName}</p>
                      <span className="text-[11px] text-slate-500">{order.shippingAddress?.city}</span>
                    </td>
                    <td className="p-4 text-slate-600">
                      {order.items.length} gift item(s)
                    </td>
                    <td className="p-4 font-medium text-rose-600">
                      {order.deliveryDate}
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">
                      Rs. {order.totalAmount}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-rose-400 font-medium"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Dispatch">In Dispatch</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add New Gift Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="E.g., Personalized Wooden Clock"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option>Personalized</option>
                    <option>Gift Boxes</option>
                    <option>Photo Frames</option>
                    <option>Chocolates</option>
                    <option>Jewelry</option>
                    <option>Stationery</option>
                    <option>Decor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="499"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Short description of the gift..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.customizable}
                    onChange={(e) => setNewProduct({ ...newProduct, customizable: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-rose-400 h-4 w-4"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Supports custom text/photo personalization
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}