import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import axiosInstance from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Select each piece of state individually
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/login", {
        email,
        password,
        role,
      });

      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        navigate(
          data.user.role === "admin"
            ? "/admin"
            : data.user.role === "student"
            ? "/student-dashboard"
            : data.user.role === "tpo"
            ? "/tpo-dashboard"
            : "/company-dashboard"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid credentials or server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://images.jdmagicbox.com/comp/solapur/e8/9999px217.x217.110105122129.h1e8/catalogue/walchand-institute-of-technology-solapur-midc-solapur-colleges-55jgucp.jpg')",
      }}
    >
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white">Role</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="admin">Admin</option>
              <option value="tpo">Tpo</option>
              <option value="company">Company</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-white">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/register" className="text-sm text-white hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}
