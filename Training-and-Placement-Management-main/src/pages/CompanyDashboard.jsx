// src/pages/CompanyDashboard.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import useAuthStore from "../store/authStore";
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes } from "react-icons/fa";

export default function CompanyDashboard() {
  const { user } = useAuthStore();
  const companyId = user?.id;
  const role = user?.role;

  const studentId = user?.id;
  const [vacancies, setVacancies] = useState([]);
  const [mode, setMode] = useState(null); // "add" | "edit" | "view"
  const [currentVacancy, setCurrentVacancy] = useState(null);
  const [form, setForm] = useState({
    jobTitle: "",
    jobDescription: "",
    salaryPackage: "",
    location: "",
    lastDateToApply: "",
    eligibilityCriteria: { cgpa: "", branchesAllowed: "" },
  });
  const [error, setError] = useState("");

  // 1) load all vacancies for this company
  const fetchVacancies = async () => {
    try {
      const res = await axiosInstance.get(`/getVacancyByCompany/${companyId}`);
      setVacancies(res.data.vacancies);
    } catch (err) {
      console.error(err);
      setError("Could not load vacancies");
    }
  };

  useEffect(() => {
    if (role === "company") fetchVacancies();
  }, [companyId, role]);

  // 2) open modal for add / edit / view
  const openModal = async (type, vac = null) => {
    setMode(type);
    if (type === "edit" && vac) {
      // fetch full vacancy
      const res = await axiosInstance.get(`/getVacancy/${vac._id}`);
      const v = res.data.vacancy;
      setCurrentVacancy(v._id);
      setForm({
        jobTitle: v.jobTitle,
        jobDescription: v.jobDescription,
        salaryPackage: v.salaryPackage,
        location: v.location,
        lastDateToApply: v.lastDateToApply.slice(0, 10),
        eligibilityCriteria: {
          cgpa: v.eligibilityCriteria.cgpa,
          branchesAllowed: v.eligibilityCriteria.branchesAllowed.join(", "),
        },
      });
    } else if (type === "add") {
      setCurrentVacancy(null);
      setForm({
        jobTitle: "",
        jobDescription: "",
        salaryPackage: "",
        location: "",
        lastDateToApply: "",
        eligibilityCriteria: { cgpa: "", branchesAllowed: "" },
      });
    } else if (type === "view" && vac) {
      setCurrentVacancy(vac);
    }
  };

  const closeModal = () => {
    setMode(null);
    setCurrentVacancy(null);
  };

  // 3) save (create or update)
  const handleSave = async () => {
    const payload = {
      ...form,
      companyId,
      eligibilityCriteria: {
        cgpa: Number(form.eligibilityCriteria.cgpa),
        branchesAllowed: form.eligibilityCriteria.branchesAllowed
          .split(",")
          .map((b) => b.trim()),
      },
    };
    try {
      if (mode === "add") {
        await axiosInstance.post("/postVacancy", { ...payload, studentId });
      } else {
        await axiosInstance.put("/updateStatus", {
          vacancyId: currentVacancy,
          ...payload,
        });
      }
      fetchVacancies();
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to save vacancy");
    }
  };

  // 4) delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vacancy?")) return;
    try {
      await axiosInstance.delete(`/deleteVacancy/${id}`);
      fetchVacancies();
    } catch (err) {
      console.error(err);
      setError("Failed to delete vacancy");
    }
  };

  // 5) approve student
  const handleApprove = async (vacancyId, app) => {
    try {
      await axiosInstance.put("/updateStatus", {
        vacancyId,
        studentId: app.studentId._id,
        status: "selected",
      });
      fetchVacancies();
    } catch (err) {
      console.error(err);
      setError("Failed to approve student");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Company Dashboard</h2>
        {role === "company" && (
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <FaPlus /> Add Job
          </button>
        )}
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vacancies.map((vac) => (
          <div
            key={vac._id}
            className="bg-white shadow rounded-lg p-5 flex flex-col"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {vac.jobTitle}
            </h3>
            <p className="text-gray-700 flex-1">{vac.jobDescription}</p>
            <div className="text-sm text-gray-500 space-y-1 my-3">
              <div>
                <strong>Package:</strong> {vac.salaryPackage}
              </div>
              <div>
                <strong>Location:</strong> {vac.location}
              </div>
              <div>
                <strong>Deadline:</strong>{" "}
                {new Date(vac.lastDateToApply).toLocaleDateString()}
              </div>
              <div>
                <strong>Eligibility:</strong> CGPA ≥{" "}
                {vac.eligibilityCriteria.cgpa}, Branches:{" "}
                {vac.eligibilityCriteria.branchesAllowed.join(", ")}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => openModal("view", vac)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                <FaEye /> View
              </button>
              <button
                onClick={() => openModal("edit", vac)}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(vac._id)}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                <FaTrash /> Delete
              </button>
            </div>

            <h4 className="font-semibold mb-2">Applied Students</h4>
            {vac.appliedStudents.length === 0 ? (
              <p className="text-gray-500 text-sm">No applications yet.</p>
            ) : (
              <div className="overflow-auto max-h-40">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      {[
                        "Name",
                        "Roll",
                        "Email",
                        "CGPA",
                        "Status",
                        "Action",
                      ].map((th) => (
                        <th key={th} className="px-2 py-1 text-left">
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vac.appliedStudents.map((app) => {
                      const sel = app.status === "selected";
                      const s = app.studentId;
                      return (
                        <tr key={app._id} className={sel ? "bg-green-50" : ""}>
                          <td className="px-2 py-1">{s.name}</td>
                          <td className="px-2 py-1">{s.rollNumber}</td>
                          <td className="px-2 py-1">{s.email}</td>
                          <td className="px-2 py-1">{s.cgpa}</td>
                          <td className="px-2 py-1">
                            <span
                              className={`px-1 rounded text-xs ${
                                sel
                                  ? "bg-green-200 text-green-800"
                                  : "bg-yellow-200 text-yellow-800"
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="px-2 py-1">
                            <button
                              onClick={() => handleApprove(vac._id, app)}
                              disabled={sel}
                              className={`px-2 py-1 text-white text-xs rounded ${
                                sel
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                            >
                              {sel ? "Selected" : "Approve"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* modal for add / edit / view */}
      {mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold capitalize">{mode} Job</h3>
              <button onClick={closeModal} className="text-gray-600">
                <FaTimes />
              </button>
            </div>

            {mode === "add" || mode === "edit" ? (
              <>
                {[
                  "jobTitle",
                  "jobDescription",
                  "salaryPackage",
                  "location",
                ].map((key) => (
                  <div className="mb-3" key={key}>
                    <label className="block text-sm font-medium mb-1">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Last Date to Apply
                  </label>
                  <input
                    type="date"
                    value={form.lastDateToApply}
                    onChange={(e) =>
                      setForm({ ...form, lastDateToApply: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    CGPA Criteria
                  </label>
                  <input
                    type="number"
                    value={form.eligibilityCriteria.cgpa}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        eligibilityCriteria: {
                          ...form.eligibilityCriteria,
                          cgpa: e.target.value,
                        },
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Branches Allowed (comma-sep)
                  </label>
                  <input
                    type="text"
                    value={form.eligibilityCriteria.branchesAllowed}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        eligibilityCriteria: {
                          ...form.eligibilityCriteria,
                          branchesAllowed: e.target.value,
                        },
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="text-right">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    {mode === "add" ? "Create" : "Update"}
                  </button>
                </div>
              </>
            ) : (
              // mode === "view"
              <div>
                <p>
                  <strong>Title:</strong> {currentVacancy.jobTitle}
                </p>
                <p>
                  <strong>Description:</strong> {currentVacancy.jobDescription}
                </p>
                <p>
                  <strong>Location:</strong> {currentVacancy.location}
                </p>
                <p>
                  <strong>Salary:</strong> {currentVacancy.salaryPackage}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {new Date(
                    currentVacancy.lastDateToApply
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
