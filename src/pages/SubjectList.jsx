import { useState } from "react";
import { Link } from "react-router-dom";
import { getSubjectById, deleteSubject } from "../services/subjectService";
import { useData } from "../context/DataContext";
import AddTopicModal from "../components/AddTopicModal";

function SubjectList() {
  const { subjects, refreshSubjects } = useData();

  const [idSearch, setIdSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [viewMode, setViewMode] = useState("all");
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicSubject, setTopicSubject] = useState(null);
  const [loading, setLoading] = useState(false);

  const showSubjectDetail = (subject, trainersData) => {
    setSelectedSubject(subject);
    setTrainers(trainersData);
    setViewMode("detail");
  };

  const openSubject = async (id) => {
    try {
      setLoading(true);
      const res = await getSubjectById(id);
      showSubjectDetail(res.data.subject, res.data.trainers);
    } catch (err) {
      console.error(err);
      alert("Failed to load subject");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!idSearch) return alert("Enter Subject ID");
    try {
      setLoading(true);
      const res = await getSubjectById(idSearch);
      showSubjectDetail(res.data.subject, res.data.trainers);
    } catch (err) {
      console.error(err);
      alert("Subject not found");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE SUBJECT (OPTIMISTIC + SAFE)
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this subject?")) return;

    const oldSubjects = [...subjects];

    // optimistic UI update
    refreshSubjects(subjects.filter(s => s.subjectId !== id));

    try {
      await deleteSubject(id);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
      refreshSubjects(oldSubjects); // rollback
    }
  };

  const openAddTopicModal = (subject, e) => {
    e.stopPropagation();
    setTopicSubject(subject);
    setShowTopicModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {viewMode === "all" && (
        <>
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
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map(s => (
              <div
                key={s.subjectId}
                onClick={() => openSubject(s.subjectId)}
                className="bg-white shadow rounded-xl p-5 cursor-pointer"
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
        </>
      )}

      {viewMode === "detail" && selectedSubject && (
        <>
          <button
            className="mb-4 text-blue-600 hover:underline"
            onClick={() => setViewMode("all")}
          >
            ← Back to Subjects
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-bold text-blue-700">
                {selectedSubject.subjectName}
              </h2>

              <p className="text-gray-500 mt-2">
                {selectedSubject.description}
              </p>

              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                onClick={(e) => openAddTopicModal(selectedSubject, e)}
              >
                + Add Topics
              </button>
            </div>

            <div className="md:col-span-2 bg-white shadow rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                Assigned Trainers
              </h3>

              {trainers.length === 0 ? (
                <p className="text-gray-400">No trainers assigned</p>
              ) : (
                trainers.map(t => (
                  <div
                    key={t.empId}
                    className="flex justify-between border rounded-lg p-3 mb-2"
                  >
                    <div>
                      <Link
                        to={`/trainer/${t.empId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {t.name}
                      </Link>
                      <p className="text-sm text-gray-500">{t.email}</p>
                    </div>
                    <span className="text-sm bg-blue-100 px-3 py-1 rounded">
                      {t.experience} yrs
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

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
