import { useEffect, useState } from "react";
import axios from "axios";

const FacultyDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    maxStudents: "",
  });

    const [topics, setTopics] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem("token");
  // ================================
  // Fetch faculty's own topics
  // ================================
  const fetchMyTopics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/topics/my-topics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTopics(res.data.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  // ================================
  // Handle input change
  // ================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


const handleDelete = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/topics/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchMyTopics();
  } catch (error) {
    alert(error.response?.data?.message || "Delete failed");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingId) {
      // UPDATE
      await axios.put(
        `http://localhost:5000/api/topics/${editingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      // CREATE
      await axios.post(
        "http://localhost:5000/api/topics",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    setFormData({
      title: "",
      description: "",
      domain: "",
      maxStudents: "",
    });

    setEditingId(null);
    fetchMyTopics();

  } catch (error) {
    alert(error.response?.data?.message || "Operation failed");
  }
};

const handleEdit = (topic) => {
  if (topic.assignedStudents.length > 0) {
    alert("Cannot edit topic after students are assigned");
    return;
  }

  setFormData({
    title: topic.title,
    description: topic.description,
    domain: topic.domain,
    maxStudents: topic.maxStudents,
  });

  setEditingId(topic._id);
};

  useEffect(() => {
    fetchMyTopics();
  }, []);
return (
  <div className="min-h-screen bg-background p-8">
    <div className="max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold text-primary mb-8">
        Faculty Dashboard
      </h2>

      {/* Create Topic Card */}
      <div className="bg-card p-6 rounded-2xl shadow-lg border border-gray-700 mb-10">
        <h3 className="text-xl font-semibold text-accent mb-6">
          Create New Topic
        </h3>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

          <input
            type="text"
            name="title"
            placeholder="Topic Title"
            value={formData.title}
            onChange={handleChange}
            className="bg-background border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            required
          />

          <input
            type="text"
            name="domain"
            placeholder="Domain"
            value={formData.domain}
            onChange={handleChange}
            className="bg-background border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            required
          />

          <input
            type="number"
            name="maxStudents"
            placeholder="Max Students"
            value={formData.maxStudents}
            onChange={handleChange}
            className="bg-background border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="bg-background border border-gray-600 p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-primary outline-none"
            required
          />

          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-primary to-accent p-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Create Topic
          </button>
        </form>
      </div>

      {/* Topics Grid */}
      <h3 className="text-xl font-semibold text-primary mb-6">
        My Topics
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <div
            key={topic._id}
            className="bg-card p-5 rounded-2xl shadow-lg border border-gray-700 hover:border-primary transition"
          >
            <h4 className="text-lg font-bold text-accent mb-2">
              {topic.title}
            </h4>

            <p className="text-gray-400 text-sm mb-4">
              {topic.description}
            </p>

            <p className="text-sm mb-1">
              <span className="text-primary font-semibold">Domain:</span>{" "}
              {topic.domain}
            </p>

            <p className="text-sm">
              <span className="text-primary font-semibold">Seats:</span>{" "}
              {topic.assignedStudents.length} / {topic.maxStudents}
            </p>

            {/* Seat Progress Bar */}
            <div className="mt-3 h-2 bg-gray-700 rounded-full">
              <div
                className="h-2 bg-gradient-to-r from-primary to-accent rounded-full"
                style={{
                  width: `${(topic.assignedStudents.length / topic.maxStudents) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex gap-3 mt-4">
                <button
                    onClick={() => handleEdit(topic)}
                    disabled={topic.assignedStudents.length > 0}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    topic.assignedStudents.length > 0
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-primary hover:bg-indigo-500"
                    }`}
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(topic._id)}
                    disabled={topic.assignedStudents.length > 0}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    topic.assignedStudents.length > 0
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                    Delete
                </button>

                </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};
export default FacultyDashboard;