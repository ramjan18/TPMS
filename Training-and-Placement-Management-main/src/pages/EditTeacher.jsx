// src/pages/EditTeacher.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import data from "../data";

const EditTeacher = () => {
  const { id } = useParams();
  const teacher = data.teachers.find((t) => t.id === parseInt(id));

  const [form, setForm] = useState(teacher || {});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Teacher Data", form);
    alert("Teacher updated!");
  };

  if (!teacher) return <div>Teacher not found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Teacher</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          placeholder="Employee ID"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditTeacher;
