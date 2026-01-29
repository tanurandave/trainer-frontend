import React, { useState, useEffect } from 'react';

import api from "../services/api";
import { addTopic, getAllTopics, getTopicsForSubject } from "../services/topicService";
import { useToast } from "../components/ToastProvider";

function TopicsPage() {
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subjectMap, setSubjectMap] = useState({});
  const [trainerMap, setTrainerMap] = useState({});
  const [topicMap, setTopicMap] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectName, setSelectedSubjectName] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [subjectTrainers, setSubjectTrainers] = useState([]);

  useEffect(() => {
    fetchSubjects();
    fetchTrainers();
    fetchTopics();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subject');
      setSubjects(response.data);
      setSubjectMap(response.data.reduce((map, s) => { map[s.subjectId] = s.subjectName; return map; }, {}));
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/trainer');
      setTrainers(response.data);
      setTrainerMap(response.data.reduce((map, t) => { map[t.empId] = t.name; return map; }, {}));
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await api.get('/topics');
      setTopics(response.data);
      setTopicMap(response.data.reduce((map, t) => { map[t.topicId] = t.topicName; return map; }, {}));
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchAssignments = async (subjectId) => {
    try {
      const response = await api.get(`/topics-subject-data/subject/${subjectId}`);
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments for subject:', error);
    }
  };

  const fetchSubjectTrainers = async (subjectId) => {
    try {
      const response = await api.get(`/trainer/subject/${subjectId}/topic`);
      const trainers = response.data.map(t => ({ empId: t.empId, name: t.name }));
      setSubjectTrainers(trainers);
    } catch (error) {
      console.error('Error fetching trainers for subject:', error);
    }
  };

  const fetchTopicsForSubject = async (subjectId) => {
    try {
      const response = await getTopicsForSubject(subjectId);
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics for subject:', error);
    }
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    const subject = subjects.find(s => s.subjectId === subjectId);
    setSelectedSubject(subjectId);
    setSelectedSubjectName(subject ? subject.subjectName : '');
    setSelectedTrainer('');
    setSelectedTopic('');
    if (subjectId) {
      fetchAssignments(subjectId);
      fetchSubjectTrainers(subjectId);
      fetchTopicsForSubject(subjectId);
    } else {
      setAssignments([]);
      setSubjectTrainers([]);
      fetchTopics();
    }
  };

  const assignTopic = async () => {
    if (!selectedSubject || !selectedTrainer || !selectedTopic) {
      toast.show({
        type: 'warning',
        title: 'Selection Required',
        message: 'Please select subject, trainer, and topic'
      });
      return;
    }
    try {
      await api.post('/topics-subject-data/assign', {
        subjectId: selectedSubject,
        trainerId: selectedTrainer,
        topicId: selectedTopic
      });
      toast.show({
        type: 'success',
        title: 'Assignment Successful',
        message: 'Topic assigned successfully'
      });
      fetchAssignments(selectedSubject);
    } catch (error) {
      console.error('Error assigning topic:', error);
      toast.show({
        type: 'error',
        title: 'Assignment Failed',
        message: 'Failed to assign topic. Please try again.'
      });
    }
  };

  const unassignTopic = async (subjectId, trainerId, topicId) => {
    try {
      await api.delete('/topics-subject-data/unassign', {
        params: { subjectId, trainerId, topicId }
      });
      toast.show({
        type: 'success',
        title: 'Unassignment Successful',
        message: 'Topic unassigned successfully'
      });
      fetchAssignments(selectedSubject);
    } catch (error) {
      console.error('Error unassigning topic:', error);
      toast.show({
        type: 'error',
        title: 'Unassignment Failed',
        message: 'Failed to unassign topic. Please try again.'
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Topics Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
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

        <div>
          <label className="block text-sm font-medium mb-2">Select Trainer</label>
          <select
            value={selectedTrainer}
            onChange={(e) => setSelectedTrainer(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose Trainer</option>
            {subjectTrainers.map(trainer => (
              <option key={trainer.empId} value={trainer.empId}>
                {trainer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Topic</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose Topic</option>
            {topics.map(topic => (
              <option key={topic.topicId} value={topic.topicId}>
                {topic.topicName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={assignTopic}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
      >
        Assign Topic
      </button>

      <div>
        <h2 className="text-xl font-bold mb-4">Assigned Topics</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Trainer Name</th>
              <th className="border border-gray-300 p-2">Subject</th>
              <th className="border border-gray-300 p-2">Assigned Topics</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(assignment => (
              <tr key={assignment.id}>
                <td className="border border-gray-300 p-2">{trainerMap[assignment.trainerId] || 'Unknown Trainer'}</td>
                <td className="border border-gray-300 p-2">{subjectMap[assignment.subjectId] || 'Unknown Subject'}</td>
                <td className="border border-gray-300 p-2">{topicMap[assignment.topicId] || 'Unknown Topic'}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => unassignTopic(assignment.subjectId, assignment.trainerId, assignment.topicId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopicsPage;
