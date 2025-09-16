import React from 'react';

export default function OrdersBoard({ orders, onClose, onPrint }) {
  if (!orders.length) {
    return (
      <div className="p-4 text-gray-500 bg-gray-100 rounded-xl text-center">
        No live orders
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div
          key={o.id}
          className="p-4 rounded-xl bg-gradient-to-r from-white to-indigo-50 shadow"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-lg">Table {o.table_number}</div>
            <div className="text-xs text-gray-500">
              {new Date(o.created_at).toLocaleString()}
            </div>
          </div>

          <div className="mt-1 space-y-1">
            {o.items && o.items.length > 0 ? (
              o.items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <div>
                    {i.name} × {i.qty}
                  </div>
                  <div>₹{i.price_at_order * i.qty}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No items</p>
            )}
          </div>

          <div className="mt-3 flex justify-end gap-2">
            {o.status === "open" ? (
              <>
                <button
                  className="px-3 py-1 rounded-full bg-emerald-500 text-white"
                  onClick={() => onClose(o.id)}
                >
                  Close
                </button>
                <button
                  className="px-3 py-1 rounded-full border"
                  onClick={() => onPrint(o.id)}
                >
                  Print KOT
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-600">Closed</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
