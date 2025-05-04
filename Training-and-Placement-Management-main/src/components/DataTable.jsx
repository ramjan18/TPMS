import React from "react";

export default function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <table className="w-full border mt-4">
      <thead className="bg-gray-200">
        <tr>
          {columns.map((col) => (
            <th key={col.accessor} className="p-2 border">
              {col.Header}
            </th>
          ))}
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="text-center">
            {columns.map((col) => (
              <td key={col.accessor} className="p-2 border">
                {row[col.accessor]}
              </td>
            ))}
            <td className="p-2 border space-x-2">
              <button className="text-blue-600" onClick={() => onEdit(row)}>
                Edit
              </button>
              <button className="text-red-600" onClick={() => onDelete(row)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
