import React from "react";

export default function Navbar({ hotel, handleLogout }) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between header-gradient p-4 rounded-2xl text-white gap-3">
      {/* Left side */}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold">
          {hotel ? hotel.name : "Admin Dashboard"}
        </h1>
        <p className="text-gray-100 text-sm sm:text-base">Staff Management</p>
      </div>

      {/* Right side buttons */}
      <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4">
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
  );
}
