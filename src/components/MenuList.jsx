import React from 'react';

export default function MenuList({ menu, onAdd }) {
  const byCategory = menu.reduce((acc, item) => {
    const cat = item.category_name || 'Other';
    (acc[cat] ||= []).push(item);
    return acc;
  }, {});

  const API_BASE = "http://localhost:5000";

  return (
    <div className="space-y-6">
      {Object.entries(byCategory).map(([cat, items]) => (
        <div key={cat}>
          {/* Category Header */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={(items[0] && items[0].category_image) ? `${API_BASE}${items[0].category_image}` : '/assets/default.svg'}
              alt={cat}
              className="w-16 h-16 rounded-lg shadow-lg object-cover"
            />
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-gray-800">{cat}</h3>
              <p className="text-sm text-gray-500">Popular choices in {cat}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(i => (
              <div key={i.id} className="p-4 rounded-2xl shadow-xl card-glass border">
                <div className="flex items-start gap-4">
                  {/* Menu Item Image */}
                  {i.image_url && (
                    <img
                      src={`${API_BASE}${i.image_url}`}
                      alt={i.name}
                      className="w-20 h-20 rounded-lg object-cover shadow"
                    />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg text-gray-900">{i.name}</div>
                        <div className="text-sm text-gray-500">{i.description}</div>
                      </div>
                      <div className="text-lg font-bold">₹{i.price}</div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        disabled={!i.available}
                        onClick={() => onAdd(i)}
                        className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                          i.available
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {i.available ? 'Add' : 'Unavailable'}
                      </button>
                      {!i.available && (
                        <span className="text-xs text-red-600">Out of stock</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
