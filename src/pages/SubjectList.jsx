// src/pages/SubjectList.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteSubject } from "../services/subjectService";
import { useData } from "../context/DataContext";
import AddTopicModal from "../components/AddTopicModal";
import { useToast } from "../components/ToastProvider";

function SubjectList() {
  const { subjects, refreshSubjects } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicSubject, setTopicSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  /* ---------------- SEARCH ---------------- */
  const handleSearch = () => {
    if (!searchTerm) {
      show({
        type: "error",
        title: "Missing Search Term",
        message: "Please enter Subject ID or Name",
      });
      return;
    }

    const subject = subjects.find(subject =>
      subject.subjectId === parseInt(searchTerm) ||
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!subject) {
      show({
        type: "error",
        title: "Record not found",
        message: "Subject with the entered ID or Name does not exist",
      });
      return;
    }

    navigate(`/subject/${subject.subjectId}`);
  };

  /* ---------------- DELETE SUBJECT ---------------- */
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this subject?")) return;

    try {
      setLoading(true);
      await deleteSubject(id);
      await refreshSubjects();

      show({
        type: "success",
        title: "Subject Deleted",
        message: "Subject deleted successfully.",
      });
    } catch (err) {
      console.error(err);
      show({
        type: "error",
        title: "Delete Failed",
        message: "Unable to delete subject. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ADD TOPIC ---------------- */
  const openAddTopicModal = (subject, e) => {
    e.stopPropagation();
    setTopicSubject(subject);
    setShowTopicModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Subjects Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage subjects and related topics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            className="w-full sm:w-72 rounded-xl border border-gray-200 bg-white/80 backdrop-blur
            px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Search by Subject ID or Name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600
            text-white px-5 py-2 text-sm font-medium shadow-md
            hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </button>
        </div>
      </div>

      {/* SUBJECT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(s => (
          <div
            key={s.subjectId}
            onClick={() => navigate(`/subject/${s.subjectId}`)}
            className="group bg-white/80 backdrop-blur border border-gray-200
            rounded-2xl p-5 cursor-pointer shadow-sm
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition">
                {s.subjectName}
              </h4>
              <span className="text-xs text-gray-400">
                ID: {s.subjectId}
              </span>
            </div>

            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
              {s.description}
            </p>

            <div className="flex justify-between items-center mt-5">
              <div className="flex gap-2">
                <Link
                  to={`/manage-topics?subjectId=${s.subjectId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg
                  bg-blue-100 text-blue-700 hover:bg-blue-200 transition no-underline"
                >
                  + Topics
                </Link>

                <button
                  onClick={(e) => handleDelete(s.subjectId, e)}
                  disabled={loading}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg
                  bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-60"
                >
                  Delete
                </button>
              </div>

              <span className="text-xs text-gray-400">
                View →
              </span>
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