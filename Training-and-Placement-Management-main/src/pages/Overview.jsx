// src/pages/Overview.jsx

export default function Overview({ data }) {
  const bgImage =
    "https://upload.wikimedia.org/wikipedia/commons/3/3d/WIT_Main_Building.jpg"; // Background from Unsplash

  return (
    <div
      className="min-h-[93vh] bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-5xl mt- mx-auto">
        {/* College Logo and Description */}
        <div className="text-center mb-20">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFL9Bpo8lniOL_z_oczD7_Pg4RlOe2FlAaIRtu33yPOCukbOF58rnhbPb7ThtGHsSLoic&usqp=CAU" // Replace with your actual logo URL
            alt="College Logo"
            className="mx-auto mb-4 rounded-full"
            style={{ width: "110px", height: "110px" }}
          />
        </div>

        <h1 className="text-4xl font-bold text-amber-950 text-center mb-10 drop-shadow-lg">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Card */}
          <div className="backdrop-blur-md bg-white/30 rounded-lg p-6 shadow-lg text-white border border-white/20 hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-2">Total Students</h2>
            <p className="text-4xl font-bold text-blue-100">
              {data.students.length}
            </p>
          </div>

          {/* Teacher Card */}
          <div className="backdrop-blur-md bg-white/30 rounded-lg p-6 shadow-lg text-white border border-white/20 hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-2">Total Teachers</h2>
            <p className="text-4xl font-bold text-blue-100">
              {data.teachers.length}
            </p>
          </div>

          {/* Company Card */}
          <div className="backdrop-blur-md bg-white/30 rounded-lg p-6 shadow-lg text-white border border-white/20 hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-2">Total Companies</h2>
            <p className="text-4xl font-bold text-blue-100">
              {data.companies.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
