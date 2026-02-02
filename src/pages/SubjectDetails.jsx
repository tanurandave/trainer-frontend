// src/pages/SubjectDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getSubjectById,
  getTopicsForSubject,
  getAssignedTopicsWithTrainersForSubject,
} from "../services/subjectService";

function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [assignedTopics, setAssignedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // Load subject details
  const loadSubjectDetails = async () => {
    try {
      const res = await getSubjectById(id);
      const data = res.data || {};
      setSubject(data.subject || data);
      setTrainers(data.trainers || []);

      setTopicsLoading(true);
      const topicsRes = await getTopicsForSubject(id);
      const topicsData = topicsRes.data || [];
      const topicsWithStatus = topicsData.map((t) => ({
        ...t,
        status: t.status || "pending",
      }));
      setTopics(topicsWithStatus);
      setTopicsLoading(false);
    } catch (err) {
      console.error(err);
      setTopicsLoading(false);
    }
  };

  // Load assigned topics
  const loadAssignedTopics = async () => {
    if (assignedLoading) return;
    setAssignedLoading(true);
    try {
      const res = await getAssignedTopicsWithTrainersForSubject(id);
      setAssignedTopics(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAssignedLoading(false);
    }
  };

  // Toggle topic completion status
  const toggleTopicStatus = (topicId) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId || t.topicId === topicId
          ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
          : t
      )
    );
  };

  useEffect(() => {
    setLoading(true);
    loadSubjectDetails().finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="text-center mt-20 text-lg text-gray-600">Loading...</div>;
  if (!subject)
    return (
      <p className="text-center text-gray-500 mt-10">Subject not found</p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">

      {/* HEADER */}
      <div className="space-y-2">
        <button
          className="text-indigo-600 hover:text-indigo-800 font-medium"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{subject.subjectName}</h1>
        <p className="text-gray-600">{subject.description}</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h3 className="text-2xl font-semibold text-indigo-600">{trainers.length}</h3>
          <p className="text-gray-500 mt-1">Assigned Trainers</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h3 className="text-2xl font-semibold text-indigo-600">{topics.length}</h3>
          <p className="text-gray-500 mt-1">Total Topics</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h3 className="text-2xl font-semibold text-green-600">Active</h3>
          <p className="text-gray-500 mt-1">Status</p>
        </div>
      </div>

      {/* TRAINERS */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Assigned Trainers</h2>
        {trainers.length === 0 ? (
          <p className="text-gray-500">No trainers assigned.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((t) => (
              <div
                key={t.empId}
                className="flex items-center justify-between bg-white p-4 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-lg">
                    {t.name?.charAt(0) || "T"}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t.name}</h4>
                    <p className="text-gray-500 text-sm">{t.email}</p>
                    <div className="flex gap-2 mt-1 text-xs">
                      <span>Experience: {t.experience} yrs</span>
                      <span
                        className={`px-2 py-1 rounded-full font-medium ${
                          t.experience >= 4
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-teal-100 text-teal-700"
                        }`}
                      >
                        {t.experience >= 4 ? "Senior" : "Junior"}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/trainer/${t.empId}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium no-underline"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TOPICS */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Topics</h2>

        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap gap-2">
          {["all", "assigned", "remaining"].map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                setFilter(f);
                if ((f === "assigned" || f === "remaining") && assignedTopics.length === 0) {
                  loadAssignedTopics();
                }
              }}
            >
              {f === "all"
                ? "All Topics"
                : f === "assigned"
                ? "Assigned Topics"
                : "Remaining Topics"}
            </button>
          ))}
        </div>

        {topicsLoading ? (
          <div className="text-center text-gray-500 mt-4">Loading topics...</div>
        ) : topics.length === 0 ? (
          <p className="text-gray-500">No topics added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {(() => {
              let filteredTopics = [];
              if (filter === "all") {
                filteredTopics = topics.map((topic) => {
                  const assignedTopic = assignedTopics.find(
                    (at) => at.topicId === (topic.id || topic.topicId)
                  );
                  return { ...topic, trainerName: assignedTopic?.trainerName };
                });
              } else if (filter === "remaining") {
                const assignedIds = assignedTopics.map((at) => at.topicId);
                filteredTopics = topics.filter(
                  (topic) => !assignedIds.includes(topic.id || topic.topicId)
                );
              } else if (filter === "assigned") {
                filteredTopics = assignedTopics.map((at) => ({
                  ...at,
                  topicId: at.topicId,
                  topicName: at.topicName,
                  description: at.description,
                  trainerName: at.trainerName,
                }));
              }

              return filteredTopics.map((topic) => {
                const topicId = topic.id || topic.topicId;
                const isCompleted = topic.status === "completed";

                return (
                  <div
                    key={topicId}
                    className="flex flex-col sm:flex-row justify-between bg-white p-4 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{topic.topicName}</h4>
                      <p className="text-gray-500 text-sm mt-1">
                        {topic.description || "No description available"}
                      </p>
                      {topic.trainerName && (
                        <p className="text-gray-600 text-xs mt-1">
                          Assigned to: {topic.trainerName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      {(filter === "all" || filter === "remaining") && (
                        <>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isCompleted
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {isCompleted ? "Completed" : "Pending"}
                          </span>
                          <button
                            className={`px-3 py-1 rounded-md text-sm font-medium text-white transition ${
                              isCompleted
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                            onClick={() => toggleTopicStatus(topicId)}
                          >
                            {isCompleted ? "Mark Pending" : "Mark Completed"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubjectDetails;