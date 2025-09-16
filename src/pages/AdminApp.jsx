import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import {
  getHotel,
  addMenuItem,
  getMenu,
  updateMenuItem,
  deleteMenuItem,
  getOrders,
  closeOrder,
  fetchKOT,
  getCategories,
  addCategory
} from '../lib/api';
import AdminMenuEditor from '../components/AdminMenuEditor';
import AdminCategoryEditor from '../components/AdminCategoryEditor';
import OrdersBoard from '../components/OrdersBoard';

const socket = io(import.meta.env.VITE_API_BASE || 'http://localhost:5000');

export default function AdminApp() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);   // ✅ new state
  const [hotel, setHotel] = useState(null);
  const navigate = useNavigate();

  const loadMenu = async () => setMenu(await getMenu());
  const loadOrders = async () => setOrders(await getOrders('open'));
  const loadCategories = async () => setCategories(await getCategories()); // ✅

  const loadHotel = async () => {
    try {
      const data = await getHotel();
      console.log("🏨 Hotel fetched:", data);
      setHotel(data);
    } catch (err) {
      console.error("❌ Error loading hotel:", err);
    }
  };

  useEffect(() => {
    loadHotel();
    loadMenu();
    loadOrders();
    loadCategories();  // ✅ load categories

    socket.on('orders:new', loadOrders);
    socket.on('orders:update', loadOrders);
    socket.on('menu:update', loadMenu);

    return () => {
      socket.off('orders:new', loadOrders);
      socket.off('orders:update', loadOrders);
      socket.off('menu:update', loadMenu);
    };
  }, []);

  const onAdd = async (item) => {
    await addMenuItem(item);
    await loadMenu();
  };

  const onAddCategory = async (cat) => {   // ✅ category add handler
    await addCategory(cat);
    await loadCategories();
  };

  const onToggleAvailability = async (id, available) => {
    await updateMenuItem(id, { available });
    await loadMenu();
  };

  const onDelete = async (id) => {
    await deleteMenuItem(id);
    await loadMenu();
  };

  const onClose = async (id) => {
    await closeOrder(id);
    await loadOrders();
  };

  const onPrint = async (id) => {
    try {
      const blob = await fetchKOT(id);
      const url = URL.createObjectURL(blob);
      const w = window.open(url, '_blank');
      if (!w) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `order-${id}-KOT.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      alert('Failed to fetch KOT: ' + e.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
  {/* Header */}
  <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between header-gradient p-4 rounded-2xl text-white gap-3">
    <div className="text-center sm:text-left">
      <h1 className="text-xl sm:text-2xl font-bold">
        {hotel ? hotel.name : "Admin Dashboard"}
      </h1>
      <p className="text-gray-100 text-sm sm:text-base">
        Manage menu, categories, and live orders.
      </p>
    </div>

    {/* Buttons */}
    <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4">
      <a
        href="/admin"
        className="px-3 sm:px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors text-sm sm:text-base"
      >
        DASHBOARD
      </a>
      <a
        href="/staff"
        className="px-3 sm:px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors text-sm sm:text-base"
      >
        ADD STAFFS
      </a>
      <a
        href="/client"
        className="px-3 sm:px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors text-sm sm:text-base"
      >
        Go to Client
      </a>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-2 rounded-lg shadow text-white font-semibold text-sm sm:text-base"
      >
        Logout
      </button>
    </div>
  </div>

  {/* Content */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
    <div className="lg:col-span-2 space-y-4">
      <AdminCategoryEditor categories={categories} onAdd={onAddCategory} />
      <AdminMenuEditor
        menu={menu}
        onAdd={onAdd}
        onToggleAvailability={onToggleAvailability}
        onDelete={onDelete}
      />
    </div>

    {/* Live Orders */}
    <div className="lg:col-span-1">
      <h3 className="font-semibold mb-2 text-center lg:text-left">Live Orders</h3>
      <OrdersBoard orders={orders} onClose={onClose} onPrint={onPrint} />
    </div>
  </div>
</div>

  );
}
