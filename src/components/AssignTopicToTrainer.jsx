import { useState } from "react";
import api from "../services/api";
import { getTopicsForSubject } from "../services/subjectService";
import { useToast } from "../components/ToastProvider";

function AssignTopicToTrainer({ trainers, subjects }) {
  const [trainerId, setTrainerId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topics, setTopics] = useState([]);
  const [assignedTopics, setAssignedTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const { show } = useToast();

  // ✅ ASSIGN TOPIC TO SUBJECT
  const assignTopic = async (topicId) => {
  if (!subjectId) return;

  try {
    // ✅ Assign topic to subject (CORRECT API)
    await api.post(`/subject/${subjectId}/topics`, {
      topicIds: [topicId]
    });

    setAssignedTopics(prev => [...prev, topicId]);
  } catch (error) {
    console.error("Assignment failed", error);

    if (error.response?.status === 400) {
      alert(error.response.data);
    } else {
      alert("Failed to assign topic");
    }
  }
};

const assignTrainerToSubject = async () => {
  await api.post("/trainer-subject/assign", {
    empId: Number(trainerId),
    subjectId: Number(subjectId)
  });
};

const loadTopics = async () => {
  if (!subjectId) {
    alert("Please select a subject first.");
    return;
  }
  setLoadingTopics(true);
  try {
    const res = await getTopicsForSubject(subjectId);
    setTopics(res.data);
    if (res.data.length === 0) {
      show({
        type: "info",
        title: "No Topics Found",
        message: "No topics are available for the selected subject.",
      });
    }
  } catch (error) {
    console.error("Failed to load topics", error);
    alert("Failed to load topics");
  } finally {
    setLoadingTopics(false);
  }
};

  const isAssigned = (topicId) => assignedTopics.includes(topicId);

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">
          Topic Assignment
        </h2>
        <p className="text-gray-600 text-lg">
          Select a subject and load topics
        </p>
      </div>

      {/* SELECTION CARD */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* SUBJECT */}
          <select
            className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
            value={subjectId}
            onChange={e => {
              setSubjectId(e.target.value);
              setAssignedTopics([]);
            }}
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <div className="flex items-center justify-center bg-blue-50 rounded font-medium text-blue-600">
            {subjectId
              ? "Ready to load topics"
              : "Select subject"}
          </div>
        </div>

        <button
          onClick={loadTopics}
          disabled={loadingTopics}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loadingTopics ? "Loading..." : "Load Topics"}
        </button>
      </div>

      {/* TOPICS LIST */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-blue-600">
          Available Topics
        </h3>

        {topics.length === 0 ? (
          <p className="text-gray-400">No topics found for this subject</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {topics.map(topic => (
              <div
                key={topic.topicId}
                className="border rounded-lg p-4 flex justify-between items-start hover:bg-blue-50 transition"
              >
                <div>
                  <h4 className="font-semibold">{topic.topicName}</h4>
                  <p className="text-sm text-gray-500">
                    {topic.description}
                  </p>
                </div>

                <button
                  disabled={!trainerId || isAssigned(topic.topicId)}
                  onClick={() => assignTopic(topic.topicId)}
                  className={`px-3 py-1 rounded text-sm font-medium transition
                    ${
                      isAssigned(topic.topicId)
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                  `}
                >
                  {isAssigned(topic.topicId) ? "Assigned" : "Assign"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignTopicToTrainer;
