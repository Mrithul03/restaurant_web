import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👁 password toggle
import toast, { Toaster } from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE || "http://localhost:5000"}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await res.json();

    if (data.token) {
      // Save token + extra info
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_id", data.id);
      localStorage.setItem("hotel_id", data.hotel_id);
      localStorage.setItem("role", data.role);

      toast.success("✅ Login Successful! Redirecting...");
      navigate("/admin");
    } else {
      toast.error(data.error || "❌ Login Failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("⚠️ Server error, please try again.");
  }
};



  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="p-8 rounded-2xl bg-white shadow-2xl w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-1">
          HOTEL MANAGEMENT
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Powered by{" "}
          <span className="font-semibold text-blue-600 tracking-wide">
            Zeon
          </span>
        </p>

        {/* Sub heading */}
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-6 tracking-wide">
          ADMIN LOGIN
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Email */}
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 pr-10"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
