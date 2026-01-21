import { useEffect, useState } from "react";
import api from "../services/api";
import { getTopicsForSubject } from "../services/subjectService";

function AssignTopicToTrainer({ trainers, subjects }) {
  const [trainerId, setTrainerId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topics, setTopics] = useState([]);
  const [assignedTopics, setAssignedTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH TOPICS WHEN SUBJECT CHANGES
  useEffect(() => {
    if (!subjectId) {
      setTopics([]);
      return;
    }

    setLoading(true);

    getTopicsForSubject(subjectId)
      .then(res => {
        setTopics(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch topics", err);
        setTopics([]);
      })
      .finally(() => setLoading(false));
  }, [subjectId]);

  // ✅ ASSIGN TOPIC TO TRAINER (CORRECT FLOW)
  const assignTopic = async (topicId) => {
  if (!trainerId || !subjectId) return;

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


  const isAssigned = (topicId) => assignedTopics.includes(topicId);

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Assign Topic to Trainer
        </h2>
        <p className="text-gray-500">
          Select a trainer, subject, and assign topics
        </p>
      </div>

      {/* SELECTION CARD */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* TRAINER */}
          <select
            className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
            value={trainerId}
            onChange={e => setTrainerId(e.target.value)}
          >
            <option value="">Select Trainer</option>
            {trainers.map(t => (
              <option key={t.empId} value={t.empId}>
                {t.name}
              </option>
            ))}
          </select>

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
            {trainerId && subjectId
              ? "Ready to assign topics"
              : "Select trainer & subject"}
          </div>
        </div>
      </div>

      {/* TOPICS LIST */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-blue-600">
          Available Topics
        </h3>

        {loading ? (
          <p className="text-gray-400">Loading topics...</p>
        ) : topics.length === 0 ? (
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
