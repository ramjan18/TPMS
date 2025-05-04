// Jobs.jsx

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

export default function Jobs() {
  const { user } = useAuthStore();
  const role = user?.role;
  const studentId = user?.id;

  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [mode, setMode] = useState(null);
  const [viewJob, setViewJob] = useState(null);
  const [form, setForm] = useState({
    _id: "",
    jobTitle: "",
    jobDescription: "",
    location: "",
    salaryPackage: "",
    lastDateToApply: "",
    eligibilityCriteria: { cgpa: "", branchesAllowed: "" },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudent = async () => {
    if (role !== "student") return;
    try {
      const res = await axiosInstance.get(`/getStudent/${studentId}`);
      setStudent(res.data.student);
    } catch (err) {
      console.error("Could not load student profile", err);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      if (role === "company") {
        const res = await axiosInstance.get(
          `/getVacancyByCompany/${studentId}`
        );
        setJobs(res.data.vacancies);
        setError("");
      } else {
        const res = await axiosInstance.get(`/getAllVacancies`);
        setJobs(res.data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Could not load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchJobs();
  }, []);

  const openModal = (type, job = null) => {
    setMode(type);
    if (type === "view") {
      setViewJob(job);
    } else if (job) {
      setForm({
        _id: job._id,
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        location: job.location,
        salaryPackage: job.salaryPackage,
        lastDateToApply: job.lastDateToApply.slice(0, 10),
        eligibilityCriteria: {
          cgpa: job.eligibilityCriteria.cgpa,
          branchesAllowed: job.eligibilityCriteria.branchesAllowed.join(", "),
        },
      });
    } else {
      setForm({
        _id: "",
        jobTitle: "",
        jobDescription: "",
        location: "",
        salaryPackage: "",
        lastDateToApply: "",
        eligibilityCriteria: { cgpa: "", branchesAllowed: "" },
      });
    }
  };

  const closeModal = () => {
    setMode(null);
    setViewJob(null);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        eligibilityCriteria: {
          cgpa: Number(form.eligibilityCriteria.cgpa),
          branchesAllowed: form.eligibilityCriteria.branchesAllowed
            .split(",")
            .map((b) => b.trim()),
        },
      };

      if (mode === "add") {
        await axiosInstance.post("/postVacancy", { ...payload, studentId });
      } else {
        await axiosInstance.put(`/updateStatus`, payload);
      }

      fetchJobs();
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to save job.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axiosInstance.delete(`/deleteVacancy/${id}`);
      fetchJobs();
    } catch (err) {
      console.error(err);
      setError("Failed to delete job.");
    }
  };

  const handleApply = async (job) => {
    const { eligibilityCriteria } = job;
    const meetsCgpa = student.cgpa >= eligibilityCriteria.cgpa;
    const allowed = eligibilityCriteria.branchesAllowed
      .map((b) => b.toLowerCase())
      .includes(student.branch.toLowerCase());
    const already = job.appliedStudents.some(
      (a) => a.studentId._id === studentId
    );

    if (already) {
      alert("You have already applied to this job.");
      return;
    }
    if (!meetsCgpa || !allowed) {
      alert("You do not meet the eligibility criteria.");
      return;
    }

    try {
      await axiosInstance.post(`/applyToVacancy/${job._id}`, { studentId });
      alert("Application successful!");
      fetchJobs();
    } catch (err) {
      console.error(err);
      setError("Failed to apply.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Jobs</h2>
        {role === "company" && (
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <FaPlus /> Add Job
          </button>
        )}
      </div>

      {loading && <p>Loading jobs…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const already = job.appliedStudents.some(
            (a) => a.studentId?._id === studentId
          );
          const isSelected = job.appliedStudents.some(
            (a) => a.studentId?._id === studentId && a.status === "selected"
          );

          return (
            <div key={job._id} className="bg-white p-4 rounded shadow mb-4">
              <h3 className="text-xl font-semibold">{job.jobTitle}</h3>
              <p className="text-gray-600">{job.jobDescription}</p>
              <p className="text-sm text-gray-500">Location: {job.location}</p>
              <p className="text-sm text-gray-500">
                Last Date to Apply:{" "}
                {new Date(job.lastDateToApply).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Package: {job.salaryPackage}
              </p>
              <p className="text-sm text-gray-500">
                Company: {job.companyId?.name}
              </p>

              {/* Show badge if selected */}
              {isSelected && (
                <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded text-sm mt-2">
                  🎉 You have been selected
                </span>
              )}

              <div className="mt-4 flex gap-2 flex-wrap">
                {role === "student" && (
                  <button
                    onClick={() => handleApply(job)}
                    className={`px-3 py-1 rounded text-white flex items-center gap-1 ${
                      already || isSelected
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    disabled={already || isSelected}
                  >
                    <FaCheck />
                    {isSelected
                      ? "Selected"
                      : already
                      ? "Already Applied"
                      : "Apply"}
                  </button>
                )}

                {role === "company" && (
                  <>
                    <button
                      onClick={() => openModal("edit", job)}
                      className={`px-3 py-1 rounded text-white flex items-center gap-1 ${
                        isSelected
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                      disabled={isSelected}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className={`px-3 py-1 rounded text-white flex items-center gap-1 ${
                        isSelected
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      disabled={isSelected}
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Job View Modal */}
      {mode === "view" && viewJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Job Details</h2>
              <button onClick={closeModal} className="text-gray-600">
                <FaTimes />
              </button>
            </div>

            <p>
              <strong>Title:</strong> {viewJob.jobTitle}
            </p>
            <p>
              <strong>Description:</strong> {viewJob.jobDescription}
            </p>
            <p>
              <strong>Location:</strong> {viewJob.location}
            </p>
            <p>
              <strong>Salary:</strong> {viewJob.salaryPackage}
            </p>
            <p>
              <strong>Last Date:</strong>{" "}
              {new Date(viewJob.lastDateToApply).toLocaleDateString()}
            </p>

            {(role === "admin" || user?.id === viewJob.companyId?._id) && (
              <>
                <h3 className="mt-4 font-semibold text-blue-700">
                  Applied Students
                </h3>
                {viewJob.appliedStudents.length === 0 ? (
                  <p>No students have applied yet.</p>
                ) : (
                  <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {viewJob.appliedStudents.map((app) => (
                      <li
                        key={app._id}
                        className="border p-2 rounded bg-gray-100 text-sm"
                      >
                        <strong>{app.studentId.name}</strong> -{" "}
                        {app.studentId.email}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
