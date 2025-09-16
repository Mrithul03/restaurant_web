const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function getHotel() {
  const token = localStorage.getItem('admin_token');

  const res = await fetch(`${API_BASE}/api/hotel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("❌ Failed to fetch hotel:", res.status);
    throw new Error("Failed to fetch hotel");
  }

  return res.json();
}

// ------------------ Categories ------------------

// ✅ Get categories for current hotel (hotel_id comes from token in backend)
export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      console.error("❌ Failed to fetch categories:", res.status);
      throw new Error("Failed to fetch categories");
    }

    return await res.json();
  } catch (err) {
    console.error("getCategories error:", err);
    return [];
  }
}

// ✅ Add new category (DO NOT send hotelId manually; backend uses req.user.hotel_id)
// api.js
export async function addCategory(formData) {
  const res = await fetch(`${API_BASE}/api/categories`, {
    method: "POST",
    headers: authHeaders(), // only token, not Content-Type
    body: formData,         // ✅ use formData directly
  });

  return res.json();
}

// ------------------ Roles ------------------

// ✅ Get all roles
export async function getRoles() {
  const res = await fetch(`${API_BASE}/api/roles`, { headers: authHeaders() });
  return res.json();
}

// ✅ Add role
export async function addRole(role) {
  const res = await fetch(`${API_BASE}/api/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(role)   // { name: "chef" }
  });
  return res.json();
}

// ------------------ Staff ------------------

// ✅ Get all staff for current hotel
export async function getStaff() {
  const res = await fetch(`${API_BASE}/api/staff`, { headers: authHeaders() });
  return res.json();
}

// ✅ Add staff
export async function addStaff(staff) {
  const res = await fetch(`${API_BASE}/api/staff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(staff)  // { name, email, password, role }
  });
  return res.json();
}


export async function getMenu() {
  const res = await fetch(`${API_BASE}/api/menu`, { headers: authHeaders() });
  return res.json();
}

export async function addMenuItem(formData) {
  const res = await fetch(`${API_BASE}/api/menu`, {
    method: 'POST',
    headers: authHeaders(),
     body: formData,
  });
  return res.json();
}


export async function updateMenuItem(id, patch) {
  const res = await fetch(`${API_BASE}/api/menu/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(patch)
  });
  return res.json();
}

export async function deleteMenuItem(id) {
  const res = await fetch(`${API_BASE}/api/menu/${id}`, { method: 'DELETE', headers: authHeaders() });
  return res.json();
}

export async function placeOrder(tableNumber, items) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableNumber, items })
  });
  return res.json();
}

export async function getOrders(status) {
  const url = status ? `${API_BASE}/api/orders?status=${status}` : `${API_BASE}/api/orders`;
  const res = await fetch(url, { headers: authHeaders() });

  if (!res.ok) {
    console.error("❌ Failed to fetch orders:", res.status);
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}


// ✅ Close order (mark as completed)
export async function closeOrder(id) {
  const res = await fetch(`${API_BASE}/api/orders/${id}/close`, {
    method: 'PATCH',
    headers: authHeaders(),
  });

  if (!res.ok) {
    console.error("❌ Failed to close order:", res.status);
    throw new Error("Failed to close order");
  }

  return res.json();
}


export function authHeaders() {
  const t = localStorage.getItem('admin_token');
  return t ? { 'Authorization': 'Bearer ' + t } : {};
}

export async function fetchKOT(orderId) {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/kot`, { headers: { 'Authorization': 'Bearer ' + token } });
  if (!res.ok) throw new Error('Failed to fetch KOT');
  const blob = await res.blob();
  return blob;
}
