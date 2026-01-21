// src/pages/SubjectList.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteSubject } from "../services/subjectService";
import { useData } from "../context/DataContext";
import AddTopicModal from "../components/AddTopicModal";

function SubjectList() {
  const { subjects, refreshSubjects } = useData();
  const navigate = useNavigate();

  const [idSearch, setIdSearch] = useState("");
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicSubject, setTopicSubject] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- SEARCH ---------------- */

  const handleSearchById = () => {
    if (!idSearch) return alert("Enter Subject ID");
    navigate(`/subject/${idSearch}`);
  };

  /* ---------------- DELETE SUBJECT ---------------- */

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this subject?")) return;

    const oldSubjects = [...subjects];
    refreshSubjects(subjects.filter(s => s.subjectId !== id));

    try {
      await deleteSubject(id);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
      refreshSubjects(oldSubjects);
    }
  };

  /* ---------------- ADD TOPIC ---------------- */

  const openAddTopicModal = (subject, e) => {
    e.stopPropagation();
    setTopicSubject(subject);
    setShowTopicModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Subjects Management
        </h2>

        <div className="flex gap-2">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Search by Subject ID"
            value={idSearch}
            onChange={e => setIdSearch(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 rounded-lg"
            onClick={handleSearchById}
            disabled={loading}
          >
            Search
          </button>
        </div>
      </div>

      {/* SUBJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map(s => (
          <div
            key={s.subjectId}
            onClick={() => navigate(`/subject/${s.subjectId}`)}
            className="bg-white shadow rounded-xl p-5 cursor-pointer hover:shadow-lg transition"
          >
            <h4 className="font-semibold text-lg text-blue-700">
              {s.subjectName}
            </h4>

            <p className="text-gray-500 text-sm mt-1">
              {s.description}
            </p>

            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-400">
                ID: {s.subjectId}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={(e) => openAddTopicModal(s, e)}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded"
                >
                  + Topics
                </button>

                <button
                  onClick={(e) => handleDelete(s.subjectId, e)}
                  className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TOPIC MODAL */}
      {showTopicModal && topicSubject && (
        <AddTopicModal
          subject={topicSubject.subjectName}
          subjectId={topicSubject.subjectId}
          onClose={() => setShowTopicModal(false)}
        />
      )}

    </div>
  );
}

export default SubjectList;
