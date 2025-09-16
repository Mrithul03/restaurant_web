import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getMenu, placeOrder } from '../lib/api';
import MenuList from '../components/MenuList';
import Cart from '../components/Cart';

const socket = io(import.meta.env.VITE_API_BASE || 'http://localhost:5000');

export default function ClientApp() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    getMenu().then(setMenu);
    socket.on('menu:update', () => getMenu().then(setMenu));
    return () => socket.off('menu:update');
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const changeQty = (id, qty) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const handlePlaceOrder = async () => {
    const items = cart.map((i) => ({ menuItemId: i.id, qty: i.qty }));
    const res = await placeOrder(tableNumber, items);
    if (res.id) {
      alert('✅ Order placed! Order ID: ' + res.id);
      setCart([]);
    } else {
      alert('❌ Failed: ' + (res.error || 'unknown'));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4">
      {/* Header */}
      <div className="mb-4 header-gradient p-3 sm:p-4 rounded-2xl text-white text-center sm:text-left">
        <h1 className="text-lg sm:text-2xl font-bold">Welcome 👋</h1>
        <p className="text-gray-100 text-xs sm:text-base">
          Browse the menu and place your order.
        </p>
      </div>

      {/* Content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
        {/* Menu list */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <MenuList menu={menu} onAdd={addToCart} />
        </div>

        {/* Cart */}
        <div className="order-1 lg:order-2 w-full">
          {/* On desktop → sticky, On mobile → normal full-width */}
          <div className="w-full lg:sticky lg:top-4">
            <Cart
              items={cart}
              onChangeQty={changeQty}
              onPlaceOrder={handlePlaceOrder}
              tableNumber={tableNumber}
              setTableNumber={setTableNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
