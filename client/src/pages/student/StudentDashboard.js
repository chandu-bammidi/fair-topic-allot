import { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState([]);
  const token = localStorage.getItem("token");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const fetchMyPreference = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/preferences/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.data) {
        setSelected(res.data.data.preferences.map((pref) => pref._id));
        setAlreadySubmitted(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTopics = async () => {
    const res = await axios.get("http://localhost:5000/api/topics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTopics(res.data.data);
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      // remove and re-order
      const newSelection = selected.filter((item) => item !== id);
      setSelected(newSelection);
    } else {
      if (selected.length >= 3) return;
      setSelected([...selected, id]);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/preferences",
        { preferences: selected },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Preferences submitted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Submission failed");
    }
  };
  const fetchConfig = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/config", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const configDeadline = res.data.data?.preferenceDeadline;

      if (configDeadline) {
        setDeadline(configDeadline);

        const now = new Date();
        const deadlineDate = new Date(configDeadline);

        if (now > deadlineDate) {
          setIsDeadlinePassed(true);
        }
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchMyPreference();
    fetchConfig();
  }, []);

  const topicMap = {};
  topics.forEach((topic) => {
    topicMap[topic._id] = topic;
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {isDeadlinePassed && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400">
            Preference submission deadline has passed.
          </div>
        )}
        <h2 className="text-3xl font-bold text-primary mb-8">
          Select Topic Preferences
        </h2>
        {alreadySubmitted && (
          <div className="mb-6 p-4 bg-indigo-900/30 border border-indigo-500 rounded-lg text-sm">
            You have already submitted preferences. You can update them before
            the deadline.
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const isFull = topic.assignedStudents.length >= topic.maxStudents;

            return (
              <div
                key={topic._id}
                onClick={() => !isFull && toggleSelect(topic._id)}
                className={`bg-card p-5 rounded-2xl shadow-lg border transition cursor-pointer
                  ${
                    selected.includes(topic._id)
                      ? "border-accent"
                      : "border-gray-700"
                  }
                  ${isFull ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <h4 className="text-lg font-bold text-accent mb-2">
                  {topic.title}
                </h4>

                {selected.includes(topic._id) && (
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full bg-accent text-white">
                    Preference {selected.indexOf(topic._id) + 1}
                  </span>
                )}

                <p className="text-gray-400 text-sm mb-4">
                  {topic.description}
                </p>

                <p className="text-sm">
                  Seats: {topic.assignedStudents.length} / {topic.maxStudents}
                </p>

                {isFull && (
                  <span className="text-red-500 text-xs font-semibold">
                    FULL
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={isDeadlinePassed}
            className={`mt-6 px-6 py-3 rounded-lg font-semibold transition ${
              isDeadlinePassed
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-accent hover:opacity-90"
            }`}
          >
            {isDeadlinePassed ? "Submission Closed" : "Submit Preferences"}
          </button>
          {selected.length > 0 && (
            <div className="mt-8 bg-card p-6 rounded-2xl border border-gray-700 shadow-lg">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Your Current Preferences
              </h3>

              <div className="space-y-3">
                {selected.map((id, index) => {
                  const topic = topicMap[id];
                  if (!topic) return null;

                  return (
                    <div
                      key={id}
                      className="flex justify-between items-center bg-background p-3 rounded-lg"
                    >
                      <div>
                        <p className="text-accent font-semibold">
                          Preference {index + 1}
                        </p>
                        <p className="text-sm text-gray-400">{topic.title}</p>
                      </div>

                      <span className="text-xs bg-primary px-3 py-1 rounded-full">
                        Rank {index + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
