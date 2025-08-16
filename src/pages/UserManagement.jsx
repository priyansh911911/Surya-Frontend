import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const UserManagement = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { axios } = useAppContext();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      setMessage("✅ User registered successfully!");
      setName("");
      setEmail("");
      setPassword("");
      console.log("User Registered:", data);

    } catch (err) {
      console.error(err);
      setMessage("❌ Registration failed!");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Register User
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export default UserManagement;
