import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSubjectById } from "../services/subjectService";
import "../styles/subject.css";

function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    getSubjectById(id).then(res => {
      setSubject(res.data.subject);
      setTrainers(res.data.trainers);
    });
  }, [id]);

  if (!subject) return <div className="loader">Loading...</div>;

  return (
    <div className="subject-detail-page">

      {/* HEADER */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
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
          <h3>4.7</h3>
          <p>Average Rating</p>
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
          <div className="trainer-grid">
            {trainers.map(trainer => (
              <div className="trainer-card" key={trainer.empId}>
                <div className="avatar">👤</div>
                <div>
                  <h4>{trainer.name}</h4>
                  <p>{trainer.email}</p>
                  <span className="exp">
                    {trainer.experience >= 4 ? "Senior Trainer" : "Junior Trainer"}
                  </span>
                </div>
                <Link to={`/trainer/${trainer.empId}`} className="view-btn">
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default SubjectDetails;