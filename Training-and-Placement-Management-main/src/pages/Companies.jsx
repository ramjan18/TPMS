import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaPlus,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import axiosInstance from "../api/axios";
import useAuthStore from "../store/authStore";

const Companies = () => {
  const { user } = useAuthStore();
  const role = user?.role;

  const [companies, setCompanies] = useState([]);
  const [mode, setMode] = useState(null); // "view" | "edit" | "add"
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({
    _id: "",
    name: "",
    hrName: "",
    hrEmail: "",
    contactNumber: "",
    website: "",
    address: "",
    description: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  const fetchCompanies = async () => {
    try {
      const res = await axiosInstance.get(`/getAllCompanies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const openModal = (modeType, company = {}) => {
    setMode(modeType);
    setCurrentId(company._id || null);
    setForm({
      _id: company._id || "",
      name: company.name || "",
      hrName: company.hrName || "",
      hrEmail: company.hrEmail || "",
      contactNumber: company.contactNumber || "",
      website: company.website || "",
      address: company.address || "",
      description: company.description || "",
      password: "",
    });
  };

  const closeModal = () => {
    setMode(null);
    setCurrentId(null);
    setForm({
      _id: "",
      name: "",
      hrName: "",
      hrEmail: "",
      contactNumber: "",
      website: "",
      address: "",
      description: "",
      password: "",
    });
  };

  const handleSave = async () => {
    try {
      if (mode === "add") {
        await axiosInstance.post(`/addCompany`, form);
      } else if (mode === "edit") {
        await axiosInstance.put(`/editCompany/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchCompanies();
      closeModal();
    } catch (err) {
      console.error("Error saving company:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;
    try {
      await axiosInstance.delete(`/deleteCompany/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompanies();
    } catch (err) {
      console.error("Error deleting company:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Companies</h2>
        {role === "admin" && (
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
          >
            <FaPlus /> Add Company
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company._id}
            className="bg-white shadow-sm border rounded-xl p-6 hover:shadow-md transition-all duration-200"
          >
            <h3 className="text-xl font-semibold text-blue-700">
              {company.name}
            </h3>
            <p>
              <strong>HR Name:</strong> {company.hrName}
            </p>
            <p>
              <strong>HR Email:</strong> {company.hrEmail}
            </p>
            <p>
              <strong>Contact:</strong> {company.contactNumber}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={company.website}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {company.website}
              </a>
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => openModal("view", company)}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-black rounded"
              >
                <FaEye /> View
              </button>

              {role === "admin" && (
                <>
                  <button
                    onClick={() => openModal("edit", company)}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded"
                  >
                    <FaTrash /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {mode && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold capitalize">
                {mode} Company
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-black"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              {[
                "name",
                "hrName",
                "hrEmail",
                "contactNumber",
                "website",
                "address",
                "description",
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize mb-1">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    readOnly={mode === "view"}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className={`w-full border px-3 py-2 rounded-md ${
                      mode === "view" ? "bg-gray-100" : ""
                    }`}
                  />
                </div>
              ))}

              {mode === "add" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
              )}
            </div>

            {mode !== "view" && (
              <div className="mt-6 text-right">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  {mode === "add" ? "Add Company" : "Update Company"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
