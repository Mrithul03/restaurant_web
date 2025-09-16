import React, { useState } from "react";

export default function AdminCategoryEditor({ categories, onAdd }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name required");

    const formData = new FormData();
    formData.append("name", name.trim());
    if (file) formData.append("image", file);

    onAdd(formData); // <-- must send FormData, not JSON

    setName("");
    setFile(null);
  };
  const API_BASE = "http://localhost:5000";

  return (
    <div className="bg-white rounded-2xl p-4 shadow">
  <h3 className="font-semibold mb-3">Categories</h3>

  {/* Form */}
  <form
    onSubmit={handleSubmit}
    className="flex flex-col sm:flex-row gap-2 mb-4"
  >
    <input
      type="text"
      value={name}
      placeholder="Category name"
      onChange={(e) => setName(e.target.value)}
      className="border p-2 rounded flex-1 text-sm sm:text-base"
    />
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setFile(e.target.files[0])}
      className="border p-2 rounded text-sm sm:text-base"
    />
    <button
      type="submit"
      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow text-sm sm:text-base"
    >
      Add
    </button>
  </form>

  {/* Categories list */}
  {categories.length === 0 ? (
    <p className="text-gray-500 text-sm">No categories yet.</p>
  ) : (
    <ul className="space-y-2">
      {categories.map((cat) => (
        <li
          key={cat.id}
          className="border p-2 rounded flex items-center gap-3"
        >
          {cat.image_url && (
            <img
              src={`${API_BASE}${cat.image_url}`}
              alt={cat.name}
              className="w-10 h-10 rounded object-cover flex-shrink-0"
            />
          )}
          <span className="text-sm sm:text-base">{cat.name}</span>
        </li>
      ))}
    </ul>
  )}
</div>

  );
}
