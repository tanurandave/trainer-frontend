import { useState } from "react";
import { addTopic, getAllTopics } from "../services/topicService";
import { getTopicsForSubject } from "../services/subjectService";
import api from "../services/api";

function AddTopicModal({ subject, subjectId, onClose }) {
  const [topics, setTopics] = useState([]);
  const [assignedTopics, setAssignedTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({ topicName: "", description: "" });

  useState(() => {
    Promise.all([getAllTopics(), getTopicsForSubject(subjectId)]).then(
      ([all, assigned]) => {
        setTopics(all.data);
        setAssignedTopics(assigned.data);
      }
    );
  }, []);

  const assignTopic = (topicId) => {
    api.post(`/subject/${subjectId}/topics/${topicId}`).then(() => {
      getTopicsForSubject(subjectId).then(res => setAssignedTopics(res.data));
    });
  };

  const createTopic = () => {
    addTopic(newTopic).then(() => {
      setNewTopic({ topicName: "", description: "" });
      getAllTopics().then(res => setTopics(res.data));
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-xl">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-600">
            Manage Topics – {subject}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">✕</button>
        </div>

        {/* Add New Topic */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold mb-2">Add New Topic</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="border p-2 rounded"
              placeholder="Topic Name"
              value={newTopic.topicName}
              onChange={e => setNewTopic({ ...newTopic, topicName: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Description"
              value={newTopic.description}
              onChange={e => setNewTopic({ ...newTopic, description: e.target.value })}
            />
          </div>
          <button
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={createTopic}
          >
            Add Topic
          </button>
        </div>

        {/* Existing Topics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Available Topics</h4>
            {topics.map(t => (
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

          <div>
            <h4 className="font-semibold mb-2">Assigned Topics</h4>
            {assignedTopics.map(t => (
              <div key={t.topicId} className="border p-3 rounded mb-2 bg-green-50">
                <p className="font-medium">{t.topicName}</p>
                <p className="text-sm">{t.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AddTopicModal;
