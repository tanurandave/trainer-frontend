// src/pages/SubjectDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSubjectById, getTopicsForSubject, getAssignedTopicsWithTrainersForSubject } from "../services/subjectService";
import "../styles/subject.css";

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
  const [filter, setFilter] = useState('all'); // 'all', 'assigned', 'remaining'

  /* ---------------- LOAD SUBJECT DETAILS ---------------- */
  const loadSubjectDetails = async () => {
    try {
      const res = await getSubjectById(id);
      const data = res.data || {};

      setSubject(data.subject || data);
      setTrainers(data.trainers || []);

      // Load topics separately using getTopicsForSubject
      setTopicsLoading(true);
      const topicsRes = await getTopicsForSubject(id);
      const topicsData = topicsRes.data || [];
      // Add default status to topics
      const topicsWithStatus = topicsData.map(topic => ({ ...topic, status: topic.status || 'pending' }));
      setTopics(topicsWithStatus);

      setTopicsLoading(false);
    } catch (err) {
      console.error("Error loading subject details", err);
      setTopicsLoading(false);
    }
  };

  /* ---------------- LOAD ASSIGNED TOPICS ---------------- */
  const loadAssignedTopics = async () => {
    try {
      const res = await getAssignedTopicsWithTrainersForSubject(id);
      const data = res.data || [];
      setAssignedTopics(data);
    } catch (err) {
      console.error("Error loading assigned topics", err);
    }
  };

  /* ---------------- TOGGLE TOPIC STATUS ---------------- */
  const toggleTopicStatus = (topicId) => {
    setTopics(prevTopics =>
      prevTopics.map(topic =>
        topic.id === topicId || topic.topicId === topicId
          ? { ...topic, status: topic.status === 'completed' ? 'pending' : 'completed' }
          : topic
      )
    );
  };

  useEffect(() => {
    setLoading(true);
    loadSubjectDetails().finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!subject) return <p className="muted">Subject not found</p>;

  return (
    <div className="subject-detail-page">

      {/* HEADER */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>{subject.subjectName}</h2>
        <p>{subject.description}</p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{trainers.length}</h3>
          <p>Assigned Trainers</p>
        </div>
        <div className="stat-card">
          <h3>{topics.length}</h3>
          <p>Total Topics</p>
        </div>
        <div className="stat-card">
          <h3>Active</h3>
          <p>Status</p>
        </div>
      </div>

      {/* TRAINERS */}
      <div className="trainer-section">
        <h3>Assigned Trainers</h3>

        {trainers.length === 0 ? (
          <p className="muted">No trainers assigned.</p>
        ) : (
          <div className="trainer-modern-list">
            {trainers.map(trainer => (
              <div className="trainer-modern-card" key={trainer.empId}>

                <div className="trainer-avatar">
                  {trainer.name?.charAt(0) || "T"}
                </div>

                <div className="trainer-details">
                  <h4>{trainer.name}</h4>
                  <p className="trainer-email">{trainer.email}</p>

                  <div className="trainer-meta">
                    <span>Experience: {trainer.experience} yrs</span>
                    <span
                      className={`trainer-badge ${
                        trainer.experience >= 4 ? "senior" : "junior"
                      }`}
                    >
                      {trainer.experience >= 4 ? "Senior Trainer" : "Junior Trainer"}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/trainer/${trainer.empId}`}
                  className="trainer-view-btn"
                >
                  View
                </Link>

              </div>
            ))}
          </div>
        )}
      </div>

     {/* TOPICS */}
<div className="topic-section">
  <h3>Topics</h3>

  {/* FILTER BUTTONS */}
  <div className="filter-buttons">
    <button
      className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
      onClick={() => setFilter('all')}
    >
      All Topics
    </button>
    <button
      className={`filter-btn ${filter === 'assigned' ? 'active' : ''}`}
      onClick={() => {
        setFilter('assigned');
        if (assignedTopics.length === 0) {
          loadAssignedTopics();
        }
      }}
    >
      Assigned Topics
    </button>
    <button
      className={`filter-btn ${filter === 'remaining' ? 'active' : ''}`}
      onClick={() => setFilter('remaining')}
    >
      Remaining Topics
    </button>
  </div>

  {topicsLoading ? (
    <div className="loader">Loading topics...</div>
  ) : topics.length === 0 ? (
    <p className="muted">No topics added yet.</p>
  ) : (
    <div className="topic-modern-list">
      {(() => {
        let filteredTopics = [];
        if (filter === 'all') {
          filteredTopics = topics;
        } else if (filter === 'assigned') {
          filteredTopics = assignedTopics.map(at => ({
            ...at,
            topicId: at.topicId,
            topicName: at.topicName,
            description: at.description,
            trainerName: at.trainerName
          }));
        } else if (filter === 'remaining') {
          const assignedTopicIds = assignedTopics.map(at => at.topicId);
          filteredTopics = topics.filter(topic => !assignedTopicIds.includes(topic.id || topic.topicId));
        }

        return filteredTopics.map(topic => {
          const topicId = topic.id || topic.topicId;
          const isCompleted = topic.status === "completed";

          return (
            <div
              key={topicId}
              className={`topic-modern-card ${isCompleted ? "completed" : "pending"}`}
            >
              {/* LEFT */}
              <div className="topic-info">
                <h4>{topic.topicName}</h4>
                <p className="topic-desc">
                  {topic.description || "No description available"}
                </p>
                {filter === 'assigned' && topic.trainerName && (
                  <p className="trainer-name">Assigned to: {topic.trainerName}</p>
                )}
              </div>

              {/* RIGHT */}
              <div className="topic-actions">
                <span className={`topic-status-badge ${isCompleted ? "completed" : "pending"}`}>
                  {isCompleted ? "Completed" : "Pending"}
                </span>

                {filter === 'all' && (
                  <button
                    className={`topic-toggle-btn ${isCompleted ? "completed" : ""}`}
                    onClick={() => toggleTopicStatus(topicId)}
                  >
                    {isCompleted ? "Mark Pending" : "Mark Completed"}
                  </button>
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
