import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import axiosInstance from "../api/axios";

export default function Tpo() {
  const [tpos, setTpos] = useState([]);
  const [mode, setMode] = useState(null); // "view" | "add" | "edit"
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get("/getAllTpo");
      setTpos(res.data.tpos);
    })();
  }, []);

  function open(mode, tpo = {}) {
    setMode(mode);
    setCurrent(tpo._id || null);
    setForm({
      name: tpo.name || "",
      email: tpo.email || "",
      password: "", // Always empty for security
      phone: tpo.phone || "",
      employeeId: tpo.employeeId || "",
    });
  }

  function close() {
    setMode(null);
    setCurrent(null);
    setForm({});
  }

  async function handleSave() {
    const payload = { ...form };

    if (mode === "add") {
      const res = await axiosInstance.post("/addTpo", payload);
      setTpos((prev) => [...prev, res.data.tpo]);
    } else {
      const res = await axiosInstance.put(`/editTpo/${current}`, payload);
      setTpos((prev) =>
        prev.map((tpo) => (tpo._id === current ? res.data.tpo : tpo))
      );
    }
    close();
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this TPO?")) return;
    await axiosInstance.delete(`/deleteTpo/${id}`);
    setTpos((prev) => prev.filter((tpo) => tpo._id !== id));
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">TPO Management</h1>
        <button
          onClick={() => open("add")}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <FaPlus className="mr-2" /> Add TPO
        </button>
      </div>

      <table className="w-full table-auto bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            {["Name", "Email", "Phone", "Employee ID", "Actions"].map((th) => (
              <th key={th} className="px-4 py-2 text-left text-sm font-medium">
                {th}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tpos.map((tpo, i) => (
            <tr
              key={tpo._id}
              className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-4 py-2">{tpo.name}</td>
              <td className="px-4 py-2">{tpo.email}</td>
              <td className="px-4 py-2">{tpo.phone}</td>
              <td className="px-4 py-2">{tpo.employeeId}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => open("view", tpo)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => open("edit", tpo)}
                  className="p-1 hover:bg-green-200 rounded"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(tpo._id)}
                  className="p-1 hover:bg-red-200 rounded"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40">
          <div className="bg-white/50 backdrop-blur-md rounded-lg shadow-lg w-full max-w-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex justify-between items-center col-span-full">
              <h2 className="text-xl font-semibold">
                {mode === "add"
                  ? "Add TPO"
                  : mode === "edit"
                  ? "Edit TPO"
                  : "View TPO"}
              </h2>
              <button onClick={close}>
                <FaTimes />
              </button>
            </div>

            {[
              ["Name", "name"],
              ["Email", "email"],
              ["Phone", "phone"],
              ["Employee ID", "employeeId"],
              ["Password", "password"],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={key === "password" ? "password" : "text"}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    mode === "view" ? "bg-gray-100" : "bg-white"
                  }`}
                  value={form[key]}
                  readOnly={mode === "view"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </div>
            ))}

            {mode !== "view" && (
              <div className="flex justify-end col-span-full">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  {mode === "add" ? "Create" : "Update"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
