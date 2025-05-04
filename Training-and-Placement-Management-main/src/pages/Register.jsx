import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import useAuthStore from "../store/authStore";

export default function Register() {
  const [role, setRole] = useState("admin");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const token = useAuthStore((s) => s.token);

  const navigate = useNavigate();

  useEffect(() => {
    if (token || localStorage.getItem("token")) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, role };

    setLoading(true);

    try {
      let apiEndpoint = "/signUp";
      if (role === "tpo") apiEndpoint = "/addTpo";
      else if (role === "company") apiEndpoint = "/addCompany";

      const { data } = await axiosInstance.post(apiEndpoint, payload);

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      alert("Registration successful!");

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://upload.wikimedia.org/wikipedia/commons/3/3d/WIT_Main_Building.jpg')",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Create an Account
        </h2>

        <div>
          <label className="block text-sm text-white mb-1">Select Role</label>
          <select
            name="role"
            value={role}
            onChange={handleRoleChange}
            disabled={loading}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="admin">Admin</option>
            <option value="tpo">TPO</option>
            <option value="company">Company</option>
          </select>
        </div>

        {role === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input
              name="name"
              label="Name"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="email"
              label="Email"
              type="email"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="password"
              label="Password"
              type="password"
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        )}

        {role === "tpo" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input
              name="name"
              label="Name"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="employeeId"
              label="Employee ID"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="email"
              label="Email"
              type="email"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="phone"
              label="Phone"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="password"
              label="Password"
              type="password"
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        )}

        {role === "company" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input
              name="name"
              label="Company Name"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="hrName"
              label="HR Name"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="hrEmail"
              label="HR Email"
              type="email"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="contactNumber"
              label="Contact Number"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              name="website"
              label="Website"
              onChange={handleChange}
              disabled={loading}
            />
            <TextArea
              name="address"
              label="Address"
              onChange={handleChange}
              disabled={loading}
            />
            <TextArea
              name="description"
              label="Description"
              onChange={handleChange}
              disabled={loading}
            />
            <Input
              name="password"
              label="Password"
              type="password"
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded-lg font-medium transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  onChange,
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-sm text-white mb-1">{label}</label>
      <input
        name={name}
        type={type}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TextArea({ label, name, onChange, disabled = false }) {
  return (
    <div>
      <label className="block text-sm text-white mb-1">{label}</label>
      <textarea
        name={name}
        onChange={onChange}
        disabled={disabled}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
