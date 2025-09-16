import React from 'react';

export default function Cart({ items, onChangeQty, onPlaceOrder, tableNumber, setTableNumber }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="p-4 rounded-2xl shadow-2xl bg-white sticky top-4">
      <h3 className="text-xl font-bold mb-2">Your Order</h3>
      <div className="space-y-3 max-h-64 overflow-auto">
        {items.length === 0 && <div className="text-sm text-gray-500">No items yet.</div>}
        {items.map((i, idx) => (
          <div key={idx} className="flex justify-between items-center border-b pb-2">
            <div className="flex-1">
              <div className="font-medium">{i.name}</div>
              <div className="text-xs text-gray-500">₹{i.price} x {i.qty}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 border rounded" onClick={() => onChangeQty(i.id, i.qty - 1)}>-</button>
              <div>{i.qty}</div>
              <button className="px-2 py-1 border rounded" onClick={() => onChangeQty(i.id, i.qty + 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Table Number</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., T12"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
      </div>

      <div className="mt-4 flex justify-between items-center font-semibold">
        <div className="text-lg">Total</div>
        <div className="text-2xl text-indigo-600">₹{total}</div>
      </div>
      <button
        className="mt-4 w-full py-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white disabled:opacity-60"
        disabled={items.length === 0 || !tableNumber}
        onClick={onPlaceOrder}
      >
        Place Order
      </button>
    </div>
  );
}
