import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [deadline, setDeadline] = useState("");

  // ==============================
  // Fetch Students
  // ==============================
  const fetchStudents = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/students",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setStudents(res.data.data);
  };

  // ==============================
  // Fetch Preferences
  // ==============================
  const fetchPreferences = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/preferences",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPreferences(res.data.data);
  };

  // ==============================
  // Set Deadline
  // ==============================
  const handleDeadlineSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/admin/deadline",
      { preferenceDeadline: deadline },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    

    alert("Deadline updated successfully");
  };
  const fetchConfig = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/admin/config",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (res.data.data?.preferenceDeadline) {
    setDeadline(res.data.data.preferenceDeadline);
  }
};

  useEffect(() => {
    fetchStudents();
    fetchPreferences();
    fetchConfig();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-primary mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-card p-6 rounded-2xl shadow-lg border border-gray-700">
            <h3 className="text-gray-400">Total Students</h3>
            <p className="text-3xl font-bold text-accent">
              {students.length}
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-lg border border-gray-700">
            <h3 className="text-gray-400">Preferences Submitted</h3>
            <p className="text-3xl font-bold text-accent">
              {preferences.length}
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-lg border border-gray-700">
            <h3 className="text-gray-400">Deadline</h3>
            <p className="text-lg text-accent">
              {deadline
                ? new Date(deadline).toLocaleString()
                : "Not Set"}
            </p>
          </div>

        </div>

        {/* Deadline Section */}
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-gray-700 mb-10">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Set Preference Deadline
          </h2>

          <form
            onSubmit={handleDeadlineSubmit}
            className="flex gap-4 items-center"
          >
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-background border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-primary to-accent px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Save Deadline
            </button>
          </form>
        </div>

        {/* Students Table */}
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-gray-700 mb-10">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Students
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-3">Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b border-gray-800 hover:bg-background"
                  >
                    <td className="py-3">{student.name}</td>
                    <td>{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preferences Overview */}
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Submitted Preferences
          </h2>

          <div className="space-y-4">
            {preferences.map((pref) => (
              <div
                key={pref._id}
                className="bg-background p-4 rounded-lg"
              >
                <p className="font-semibold text-accent">
                  {pref.student.name}
                </p>

                <div className="mt-2 space-y-1 text-sm text-gray-400">
                  {pref.preferences.map((topic, index) => (
                    <p key={topic._id}>
                      {index + 1}. {topic.title}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;