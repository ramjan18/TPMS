import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import axiosInstance from "../api/axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [mode, setMode] = useState(null); // "view" | "add" | "edit"
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get("/getAllStudents");
      setStudents(res.data.students);
    })();
  }, []);

  function open(mode, st = {}) {
    setMode(mode);
    setCurrent(st._id || null);
    setForm({
      name: st.name || "",
      email: st.email || "",
      password: "",
      phone: st.phone || "",
      branch: st.branch || "",
      rollNumber: st.rollNumber || "",
      year: st.year || "",
      tenthYear: st.tenthYear || "",
      tenthMarks: st.tenthMarks || "",
      twelfthYear: st.twelfthYear || "",
      twelfthMarks: st.twelfthMarks || "",
      degreeYear: st.degreeYear || "",
      cgpa: st.cgpa || "",
      resume: st.resume || null,
      profilePic: st.profilePic || null,
    });
  }

  function close() {
    setMode(null);
    setCurrent(null);
    setForm({});
  }

  async function handleSave() {
    const formData = new FormData();
    for (let key in form) {
      if (key === "resume" || key === "profilePic") {
        if (form[key]) formData.append(key, form[key]);
      } else {
        formData.append(key, form[key]);
      }
    }

    try {
      if (mode === "add") {
        const res = await axiosInstance.post("/addStudent", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setStudents((s) => [...s, res.data.student]);
      } else {
        const res = await axiosInstance.put(
          `/editStudent/${current}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setStudents((s) =>
          s.map((st) => (st._id === current ? res.data.student : st))
        );
      }
      close();
    } catch (err) {
      console.error(err);
      alert("Error saving student");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this student?")) return;
    await axiosInstance.delete(`/deleteStudent/${id}`);
    setStudents((s) => s.filter((st) => st._id !== id));
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <button
          onClick={() => open("add")}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <FaPlus className="mr-2" /> Add
        </button>
      </div>

      <table className="w-full table-auto bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            {["Name", "Email", "Roll #", "Branch", "Year", "Actions"].map(
              (th) => (
                <th
                  key={th}
                  className="px-4 py-2 text-left text-sm font-medium"
                >
                  {th}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {students.map((st, i) => (
            <tr
              key={st._id}
              className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-4 py-2">{st.name}</td>
              <td className="px-4 py-2">{st.email}</td>
              <td className="px-4 py-2">{st.rollNumber}</td>
              <td className="px-4 py-2">{st.branch}</td>
              <td className="px-4 py-2">{st.year}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => open("view", st)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => open("edit", st)}
                  className="p-1 hover:bg-green-200 rounded"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(st._id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Close Button (top-left) */}
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={close}
                className="text-gray-600 hover:text-red-500"
              >
                <FaTimes size={22} />
              </button>
            </div>

            {/* Profile Pic (top-right) */}
            {mode !== "add" &&
              form.profilePic &&
              typeof form.profilePic === "string" && (
                <div className="absolute top-4 right-4 z-10">
                  <img
                    src={form.profilePic}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover shadow-md"
                  />
                </div>
              )}

            {/* Header */}
            <div className="col-span-full flex justify-center items-center mb-2">
              <h2 className="text-xl font-semibold">
                {mode === "add"
                  ? "Add Student"
                  : mode === "edit"
                  ? "Edit Student"
                  : "View Student"}
              </h2>
            </div>

            {/* Input Fields */}
            {[
              ["Name", "name"],
              ["Email", "email"],
              ["Password", "password"],
              ["Phone", "phone"],
              ["Branch", "branch"],
              ["Roll Number", "rollNumber"],
              ["Year", "year"],
              ["10th Marks", "tenthMarks"],
              ["10th Year", "tenthYear"],
              ["12th Marks", "twelfthMarks"],
              ["12th Year", "twelfthYear"],
              ["CGPA", "cgpa"],
              ["Degree Year", "degreeYear"],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={
                    ["cgpa", "tenthMarks", "twelfthMarks"].includes(key)
                      ? "number"
                      : key === "password"
                      ? "password"
                      : "text"
                  }
                  step="0.01"
                  readOnly={mode === "view"}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    mode === "view" ? "bg-gray-100" : "bg-white"
                  }`}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                />
              </div>
            ))}

            {/* Uploads (only in edit/add mode) */}
            {mode !== "view" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        resume: e.target.files[0],
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Pic
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        profilePic: e.target.files[0],
                      }))
                    }
                  />
                </div>
              </>
            )}

            {/* View Resume Button */}
            {mode === "view" &&
              form.resume &&
              typeof form.resume === "string" && (
                <div className="col-span-full">
                  <button
                    onClick={() => {
                      // Directly open the resume URL
                      window.open(form.resume, "_blank");
                    }}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    View Resume
                  </button>
                </div>
              )}

            {/* Save Button */}
            {mode !== "view" && (
              <div className="col-span-full flex justify-end mt-4">
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
