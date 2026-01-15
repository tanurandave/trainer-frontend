import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getTrainerById,
  getSubjectsByTrainer,
  deleteTrainer
} from "../services/trainerService";
import "../styles/TrainerProfile.css";

function TrainerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (!id) return;

    getTrainerById(id)
      .then(res => setTrainer(res.data))
      .catch(() => {
        alert("Trainer not found");
        navigate(-1);
      });

    getSubjectsByTrainer(id)
      .then(res => setSubjects(res.data))
      .catch(() => setSubjects([]));
  }, [id, navigate]);

  if (!trainer) return <div className="tp-loading">Loading...</div>;

  return (
    <div className="trainer-profile-page">
      {/* HEADER */}
      <div className="tp-header">
        <img
          src={`https://i.pravatar.cc/150?u=${trainer.empId}`}
          alt="Trainer"
          className="tp-avatar"
        />

        <div className="tp-header-info">
          <h2>{trainer.name}</h2>
         <p>
    {trainer.experience >= 4 ? "Senior Trainer" : "Junior Trainer"}
  </p>
          <div className="tp-meta">
            <span>📧 {trainer.email}</span>
            <span>📞 {trainer.mobileNumber || "N/A"}</span>
          </div>
        </div>

        <div className="tp-header-actions">
          <Link to={`/edit-trainer/${trainer.empId}`} className="btn-primary">
            ✏️ Edit Profile
          </Link>

          <button
            className="btn-danger-outline"
            onClick={() => {
              if (!window.confirm("Delete this trainer?")) return;
              deleteTrainer(trainer.empId).then(() => navigate("/trainers"));
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="tp-stats">
        <Stat label="Experience" value={`${trainer.experience} yrs`} />
        <Stat label="Subjects" value={subjects.length} />
        <Stat label="Format" value={trainer.format || "N/A"} />
      </div>

      {/* MAIN GRID */}
      <div className="tp-grid">
        {/* ASSIGNED SUBJECTS */}
        <div className="tp-card">
          <div className="tp-card-header">
            <h3>Assigned Subjects</h3>
            <button className="btn-secondary">+ Add Subject</button>
          </div>

          <div className="tp-subject-grid">
            {subjects.length === 0 ? (
              <p className="muted">No subjects assigned</p>
            ) : (
              subjects.map(s => (
                <div key={s.subjectId} className="tp-subject-card">
                  <h4>{s.subjectName}</h4>
                  <p>{s.description}</p>
                  <span className="tp-badge">Active</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="tp-side">
          <div className="tp-card">
            <h4>Today’s Schedule</h4>
            <p className="muted">No sessions today</p>
          </div>

          <div className="tp-card">
            <h4>Recent Feedback</h4>
            <p className="muted">⭐⭐⭐⭐⭐ Excellent trainer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="tp-stat">
    <h3>{value}</h3>
    <span>{label}</span>
  </div>
);

export default TrainerProfile;
