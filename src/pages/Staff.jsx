import React, { useEffect, useState } from "react";
import { getRoles, addRole, getStaff, addStaff } from '../lib/api'; // adjust path if needed

export default function Staff() {
  const [page,setpage]  = useState('STAFF MANAGEMENT')
  const [roles, setRoles] = useState([]);
  const [staff, setStaff] = useState([]);

  // Role form
  const [newRole, setNewRole] = useState("");

  // Staff form
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [loading, setLoading] = useState(false)

  // Fetch roles + staff
  useEffect(() => {
    loadRoles();
    loadStaff();
  }, []);

  async function loadRoles() {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      console.error("Failed to load roles", err);
    }
  }

  async function loadStaff() {
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (err) {
      console.error("Failed to load staff", err);
    }
  }

  // Add new role
  async function handleAddRole(e) {
    e.preventDefault();
    if (!newRole) return;
    setLoading(true);
    try {
      await addRole({ name: newRole });
      setNewRole("");
      await loadRoles();
    } catch (err) {
      console.error("Error adding role", err);
    } finally {
      setLoading(false);
    }
  }

  // Add new staff
  async function handleAddStaff(e) {
    e.preventDefault();
    const { name, email, password, role } = staffForm;
    if (!name || !email || !password || !role) {
      alert("All fields required");
      return;
    }
    setLoading(true);
    try {
      await addStaff(staffForm);
      setStaffForm({ name: "", email: "", password: "", role: "" });
      await loadStaff();
    } catch (err) {
      console.error("Error adding staff", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
    
      <div className="mb-4 flex items-center justify-between header-gradient p-4 rounded-2xl text-white">
        <div>
          <h1 className="text-2xl font-bold">
            {page}
          </h1>
          <p className="text-gray-100">Manage menu and live orders.</p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/admin"
            className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
          >
            DASHBOARD
          </a>
          <a
            href="/staff"
            className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
          >
            ADD STAFFS
          </a>
          <a
            href="/client"
            className="px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
          >
            Go to Client
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow text-white font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ---- Roles ---- */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Roles</h3>
        <form onSubmit={handleAddRole} className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="New role name"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Role
          </button>
        </form>

        <ul className="list-disc list-inside">
          {roles.map((r) => (
            <li key={r.id}>{r.name}</li>
          ))}
        </ul>
      </div>

      {/* ---- Add Staff ---- */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Add Staff</h3>
        <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
          <input
            type="text"
            placeholder="Name"
            value={staffForm.name}
            onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={staffForm.email}
            onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={staffForm.password}
            onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <select
            value={staffForm.role}
            onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="col-span-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Staff
          </button>
        </form>
      </div>

      {/* ---- Staff List ---- */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Staff List</h3>
        <table className="border w-full max-w-3xl">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Role</th>
              <th className="border px-3 py-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id}>
                <td className="border px-3 py-2">{s.name}</td>
                <td className="border px-3 py-2">{s.email}</td>
                <td className="border px-3 py-2">{s.role}</td>
                <td className="border px-3 py-2">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No staff yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
