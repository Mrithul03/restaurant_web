import React, { useState, useEffect } from "react";
import { getCategories } from '../lib/api';// import your function

export default function AdminMenuEditor({ menu, onAdd, onToggleAvailability, onDelete }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const API_BASE = "http://localhost:5000"; // 👈 base URL for images

  useEffect(() => {
    // Fetch categories when component mounts
    getCategories().then(setCategories);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Name and price are required");

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("price", Number(form.price));
    if (form.category_id) formData.append("category_id", form.category_id);
    formData.append("available", true); // default
    if (file) formData.append("image", file);

    onAdd(formData); // send FormData
    setForm({ name: "", description: "", price: "", category_id: "" });
    setFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Add Menu Item Form */}
      <div className="p-4 rounded-2xl bg-white shadow">
        <h3 className="font-semibold mb-3">Add Menu Item</h3>
        <form className="grid grid-cols-1 md:grid-cols-6 gap-3" onSubmit={handleSubmit}>
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          {/* Category Dropdown */}
          <select
            className="border rounded px-3 py-2"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {/* Image Upload */}
          <input
            className="border rounded px-3 py-2"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="submit"
            className="rounded-full bg-indigo-600 text-white px-4 py-2"
          >
            Add Item
          </button>
        </form>
      </div>

      {/* Menu Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menu.map((i) => (
          <div
            key={i.id}
            className="p-4 rounded-xl bg-white shadow flex justify-between items-start"
          >
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-gray-500">
                {i.category_name} • ₹{i.price}
              </div>
              <div className="text-sm text-gray-600 mt-1">{i.description}</div>

              {i.image_url && (
                <img src={`${API_BASE}${i.image_url}`} 
                alt={i.name}
                className="mt-2 w-24 h-24 object-cover rounded"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="px-3 py-1 rounded-full border"
                onClick={() => onToggleAvailability(i.id, !i.available)}
              >
                {i.available ? "Disable" : "Enable"}
              </button>
              <button
                className="px-3 py-1 rounded-full border text-red-600"
                onClick={() => onDelete(i.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
