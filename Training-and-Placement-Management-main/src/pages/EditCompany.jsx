// src/pages/EditCompany.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import data from "../data"; // Replace with API or global state

const EditCompany = () => {
  const { id } = useParams();
  const company = data.companies.find((c) => c.id === parseInt(id));
  const [form, setForm] = useState(company || {});

  if (!company) return <div>Company not found.</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated company", form);
    alert("Company updated!");
    // Optionally navigate back to list
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Company</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Company Name"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="hrName"
          value={form.hrName}
          onChange={handleChange}
          placeholder="HR Name"
          className="border p-2 w-full"
        />
        <input
          type="email"
          name="hrEmail"
          value={form.hrEmail}
          onChange={handleChange}
          placeholder="HR Email"
          className="border p-2 w-full"
        />
        <input
          type="url"
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="Website URL"
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCompany;
