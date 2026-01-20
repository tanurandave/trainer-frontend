import { useState } from "react";
import { Link } from "react-router-dom";
import { getSubjectById, deleteSubject } from "../services/subjectService";
import { useData } from "../context/DataContext";
import "../styles/subject.css";

function SubjectList() {
  const { subjects, refreshSubjects } = useData();
  const [idSearch, setIdSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [viewMode, setViewMode] = useState("all");

  const showSubjectDetail = (subject, trainersData) => {
    setSelectedSubject(subject);
    setTrainers(trainersData);
    setViewMode("detail");
  };

  const handleSearchById = () => {
    if (!idSearch) return alert("Enter subject ID");
    getSubjectById(idSearch)
      .then(res => showSubjectDetail(res.data.subject, res.data.trainers))
      .catch(() => alert("Subject not found"));
  };

  const openSubject = (id) => {
    getSubjectById(id).then(res => showSubjectDetail(res.data.subject, res.data.trainers));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this subject?")) {
      deleteSubject(id).then(() => refreshSubjects()).catch(() => alert("Failed to delete subject"));
    }
  };

  return (
    <div className="subject-page">

      {/* ================= ALL SUBJECTS ================= */}
      {viewMode === "all" && (
        <>
          <div className="subject-header">
            <h2>Subjects Management</h2>

            <div className="search-box">
              <input
                placeholder="Search by Subject ID"
                value={idSearch}
                onChange={e => setIdSearch(e.target.value)}
              />
              <button onClick={handleSearchById}>Search</button>
            </div>
          </div>

          <div className="subject-grid">
            {subjects.map(s => (
              <div
                key={s.subjectId}
                className="subject-card"
                onClick={() => openSubject(s.subjectId)}
              >
                <h4>{s.subjectName}</h4>
                <p>{s.description}</p>
                <span className="subject-id">ID: {s.subjectId}</span>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDelete(s.subjectId, e)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= SUBJECT DETAILS ================= */}
      {viewMode === "detail" && selectedSubject && (
        <>
          <button className="back-btn" onClick={() => setViewMode("all")}>
            ← Back to Subjects
          </button>

          <div className="subject-detail-layout">

            {/* LEFT */}
            <div className="subject-info-card">
              <h2>{selectedSubject.subjectName}</h2>
              <p className="subject-desc">{selectedSubject.description}</p>

              <div className="stats-row">
                <div>
                  <h4>{trainers.length}</h4>
                  <span>Assigned Trainers</span>
                </div>
                <div>
                  <h4>{Math.floor(Math.random() * 5) + 3}.7</h4>
                  <span>Avg Rating</span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="trainer-section">
              <h3>Assigned Trainers</h3>

              {trainers.length === 0 ? (
                <p className="muted">No trainers assigned</p>
              ) : (
                trainers.map(t => (
                  <div className="trainer-card" key={t.empId}>
                    <div className="avatar">👤</div>
                    <div>
                      <h4>
                        <Link to={`/trainer/${t.empId}`}>{t.name}</Link>
                      </h4>
                      <span>{t.email}</span>
                    </div>
                    <span className="exp">{t.experience} yrs</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SubjectList;
