import { useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Overview from "./Overview";
import Students from "./Students";
import Teachers from "./Teacher";
import Companies from "./Companies";
import Jobs from "./Jobs";
import StudentDetails from "./StudentDetails";
import useAuthStore from "../store/authStore";
import data from "../data";
import CompanyDashboard from "./CompanyDashboard";

const AdminDashboard = () => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} handleLogout={handleLogout} />
      <div className="flex-1 p-6 bg-gray-100">
        <Routes>
          <Route path="/" element={<Overview data={data} />} />
          <Route path="students" element={<Students data={data.students} />} />
          <Route path="profile/:id" element={<StudentDetails />} />
          <Route path="teachers" element={<Teachers data={data.teachers} />} />
          <Route
            path="companies"
            element={<Companies data={data.companies} />}
          />{" "}
          <Route
            path="myJobs/:id"
            element={<CompanyDashboard data={data.companies} />}
          />
          <Route path="jobs" element={<Jobs data={data.companies} />} />
        </Routes>
      </div>
    </div>
  );
};

const Sidebar = ({ user, handleLogout }) => {
  const location = useLocation();
  const role = user?.role;

  const navLink = (to, label) => (
    <li key={to}>
      <Link
        to={to}
        className={`block py-2 px-6 rounded-md transition ${
          location.pathname === to || location.pathname.startsWith(to + "/")
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-400"
        }`}
      >
        {label}
      </Link>
    </li>
  );

  // Define which links each role can see
  const links = [];
  if (role === "admin") {
    links.push(
      { to: "/admin/", label: "Overview" },
      { to: "/admin/students", label: "Students" },
      { to: "/admin/teachers", label: "Teachers" },
      { to: "/admin/companies", label: "Companies" },
      { to: `/admin/jobs`, label: "Jobs" }
    );
  } else if (role === "company") {
    links.push(
      { to: "/admin/", label: "Overview" },
      { to: `/admin/myJobs/${user.id}`, label: "Jobs" }
    );
  } else if (role === "student") {
    links.push(
      { to: `/admin/profile/${user.id}`, label: "My Profile" },
      { to: "/admin/companies", label: "Companies" },
      { to: "/admin/jobs", label: "Jobs" }
    );
  } else {
    links.push(
      { to: "/admin/", label: "Overview" },
      { to: "/admin/students", label: "Students" },
      { to: "/admin/companies", label: "Companies" },
      { to: "/admin/jobs", label: "Jobs" }
    );
  }

  return (
    <div className="w-64 bg-gray-50 text-black flex flex-col justify-between">
      <div>
        <div className="p-6 text-center text-2xl font-bold border-b border-gray-300">
          Dashboard
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          {user?.role ? `Logged in as: ${user.role}` : "Role: Unknown"}
        </div>
        <ul className="mt-6 space-y-2 px-4">
          {links.map(({ to, label }) => navLink(to, label))}
        </ul>
      </div>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
export { Sidebar };
