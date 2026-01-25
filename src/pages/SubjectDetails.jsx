// src/pages/SubjectDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSubjectById, getTopicsForSubject } from "../services/subjectService";
import "../styles/subject.css";

function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(false);

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

  {topicsLoading ? (
    <div className="loader">Loading topics...</div>
  ) : topics.length === 0 ? (
    <p className="muted">No topics added yet.</p>
  ) : (
    <div className="topic-modern-list">
      {topics.map(topic => {
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
            </div>

            {/* RIGHT */}
            <div className="topic-actions">
              <span className={`topic-status-badge ${isCompleted ? "completed" : "pending"}`}>
                {isCompleted ? "Completed" : "Pending"}
              </span>

              <button
                className={`topic-toggle-btn ${isCompleted ? "completed" : ""}`}
                onClick={() => toggleTopicStatus(topicId)}
              >
                {isCompleted ? "Mark Pending" : "Mark Completed"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>


    </div>
  );
}

export default SubjectDetails;
