import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

export default function StudentDetails() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role === "student") {
          const res = await axiosInstance.get(`/getStudent/${user.id}`);
          setStudent(res.data.student);
        }
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    fetchStudent();
  }, []);

  if (!student) return <div className="p-6">Loading student details...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow relative">
      {/* Avatar */}
      {student.profilePic && (
        <div className="absolute top-4 left-4">
          <img
            src={student.profilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 text-center">Student Profile</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {[
          ["Name", student.name],
          ["Email", student.email],
          ["Phone", student.phone],
          ["Branch", student.branch],
          ["Roll Number", student.rollNumber],
          ["Year", student.year],
          ["10th Marks", student.tenthMarks],
          ["10th Year", student.tenthYear],
          ["12th Marks", student.twelfthMarks],
          ["12th Year", student.twelfthYear],
          ["CGPA", student.cgpa],
          ["Degree Year", student.degreeYear],
        ].map(([label, value]) => (
          <div key={label}>
            <label className="text-sm text-gray-600">{label}</label>
            <div className="font-medium text-gray-900">{value || "-"}</div>
          </div>
        ))}

        {/* View Resume Button */}
        {student.resume && (
          <div className="col-span-full mt-4">
            <button
              onClick={() => window.open(student.resume, "_blank")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
