// src/pages/ViewTeacher.jsx
import { useParams } from "react-router-dom";
import data from "../data";

const ViewTeacher = () => {
  const { id } = useParams();
  const teacher = data.teachers.find((t) => t.id === parseInt(id));

  if (!teacher) return <div>Teacher not found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Teacher Details</h2>
      <div className="bg-white shadow rounded p-4 space-y-2">
        <p>
          <strong>Name:</strong> {teacher.name}
        </p>
        <p>
          <strong>Email:</strong> {teacher.email}
        </p>
        <p>
          <strong>Employee ID:</strong> {teacher.employeeId}
        </p>
        <p>
          <strong>Phone:</strong> {teacher.phone}
        </p>
      </div>
    </div>
  );
};

export default ViewTeacher;
