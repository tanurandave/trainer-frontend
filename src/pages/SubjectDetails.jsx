// src/pages/SubjectDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSubjectById } from "../services/subjectService";
import "../styles/subject.css";

function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD SUBJECT DETAILS ---------------- */
  const loadSubjectDetails = async () => {
    try {
      const res = await getSubjectById(id);
      const data = res.data || {};

      setSubject(data.subject || data);
      setTrainers(data.trainers || []);
      setTopics(data.topics || data.subject?.topics || []);
    } catch (err) {
      console.error("Error loading subject details", err);
    }
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
        <h3>Topics Covered</h3>

        {topics.length === 0 ? (
          <p className="muted">No topics added yet.</p>
        ) : (
          <div className="topic-grid">
            {topics.map(topic => (
              <div
                className="topic-card"
                key={topic.id || topic.topicId}
              >
                <h4>{topic.topicName}</h4>
                <p className="muted">
                  {topic.description || "No description available"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default SubjectDetails;
