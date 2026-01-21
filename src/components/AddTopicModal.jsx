import { useEffect, useState } from "react";
import { addTopic, getAllTopics } from "../services/topicService";
import { getTopicsForSubject } from "../services/subjectService";
import api from "../services/api";

function AddTopicModal({ subject, subjectId, onClose }) {
  const [topics, setTopics] = useState([]);
  const [assignedTopics, setAssignedTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({ topicName: "", description: "" });
  const [loading, setLoading] = useState(false);

  // ✅ LOAD TOPICS
  useEffect(() => {
  let mounted = true;

  Promise.all([getAllTopics(), getTopicsForSubject(subjectId)])
    .then(([all, assigned]) => {
      if (!mounted) return;
      setTopics(all.data);
      setAssignedTopics(assigned.data);
    });

  return () => { mounted = false };
}, [subjectId]);


  // ✅ FIXED: ASSIGN TOPIC TO SUBJECT
  const assignTopic = async (topicId) => {
  try {
    await api.post(`/subject/${subjectId}/topics`, {
      topicIds: [topicId]
    });

    const res = await getTopicsForSubject(subjectId);
    setAssignedTopics(res.data);
  } catch (error) {
    console.error(error);
    alert(error.response?.data || "Failed to assign topic");
  }
};


  // ✅ CREATE TOPIC
  const createTopic = async () => {
    if (!newTopic.topicName.trim()) return;

    setLoading(true);
    await addTopic(newTopic);
    setNewTopic({ topicName: "", description: "" });

    const res = await getAllTopics();
    setTopics(res.data);
    setLoading(false);
  };
  const assignedIds = new Set(assignedTopics.map(t => t.topicId));
const availableTopics = topics.filter(t => !assignedIds.has(t.topicId));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-blue-600">
            Manage Topics – {subject}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">

          {/* ADD TOPIC */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Add New Topic</h4>

            <div className="grid grid-cols-2 gap-3">
              <input
                className="border p-2 rounded"
                placeholder="Topic Name"
                value={newTopic.topicName}
                onChange={e =>
                  setNewTopic({ ...newTopic, topicName: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Description"
                value={newTopic.description}
                onChange={e =>
                  setNewTopic({ ...newTopic, description: e.target.value })
                }
              />
            </div>

            <button
              onClick={createTopic}
              disabled={loading}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Adding..." : "Add Topic"}
            </button>
          </div>

          {/* TOPICS */}
          <div className="grid grid-cols-2 gap-6">

            {/* AVAILABLE */}
            <div>
              <h4 className="font-semibold mb-2">Available Topics</h4>
              {availableTopics.map(t => (
                <button
                  key={t.topicId}
                  onClick={() => assignTopic(t.topicId)}
                  className="block w-full text-left border p-3 rounded mb-2 hover:bg-blue-50"
                >
                  <p className="font-medium">{t.topicName}</p>
                  <p className="text-sm text-gray-500">{t.description}</p>
                </button>
              ))}
            </div>

            {/* ASSIGNED */}
            <div>
              <h4 className="font-semibold mb-2">Assigned Topics</h4>
              {assignedTopics.length === 0 ? (
                <p className="text-sm text-gray-400">No topics assigned</p>
              ) : (
                topics.map(t => (
                  <div key={t.topicId} className="border p-3 rounded bg-green-50 mb-2">
                    <p className="font-medium">{t.topicName}</p>
                    <p className="text-sm">{t.description}</p>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTopicModal;
