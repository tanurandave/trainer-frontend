import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getTopicsForSubject, addTopicToSubject, deleteTopicFromSubject } from '../services/topicService';

function TopicManagement() {
  const [searchParams] = useSearchParams();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
    const subjectIdFromUrl = searchParams.get('subjectId');
    if (subjectIdFromUrl) {
      setSelectedSubject(subjectIdFromUrl);
      fetchTopics(subjectIdFromUrl);
    }
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subject');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTopics = async (subjectId) => {
    if (!subjectId) return;
    setLoading(true);
    try {
      const response = await getTopicsForSubject(subjectId);
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    fetchTopics(subjectId);
  };

  const handleAddTopic = async () => {
    if (!selectedSubject || !newTopicName.trim()) {
      alert('Please select a subject and enter a topic name');
      return;
    }
    try {
      await addTopicToSubject(selectedSubject, { topicName: newTopicName, description: newTopicDescription });
      setNewTopicName('');
      setNewTopicDescription('');
      fetchTopics(selectedSubject);
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;
    try {
      await deleteTopicFromSubject(selectedSubject, topicId);
      fetchTopics(selectedSubject);
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Topic Management</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Subject</label>
        <select
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Choose Subject</option>
          {subjects.map(subject => (
            <option key={subject.subjectId} value={subject.subjectId}>
              {subject.subjectName}
            </option>
          ))}
        </select>
      </div>

      {selectedSubject && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Topic Name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <button
              onClick={handleAddTopic}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Topic
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 ">Topics for Selected Subject</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-2 ">
                {topics.length === 0 ? (
                  <p>No topics found for this subject.</p>
                ) : (
                  topics.map(topic => (
                    <div key={topic.topicId} className="flex justify-between items-center p-4 border rounded ">
                      <div>
                        <h3 className="font-semibold">{topic.topicName}</h3>
                        {topic.description && <p className="text-gray-600">{topic.description}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteTopic(topic.topicId)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TopicManagement;
