import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {
  getTrainerById,
  getSubjectsByTrainer,
  deleteTrainer
} from "../services/trainerService";
import {
  getAssignedTopicsForTrainerAndSubject
} from "../services/subjectService";
import { useToast } from "../components/ToastProvider";

function TrainerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [trainer, setTrainer] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [activeSubject, setActiveSubject] = useState(null);
  const [topics, setTopics] = useState([]);

  /* ---------------- LOAD DATA ---------------- */

  const loadAssignments = () => {
    getSubjectsByTrainer(trainer.empId).then(res => {
      setSubjects(res.data);
    });
  };

  useEffect(() => {
    if (!id) return;

    Promise.all([
      getTrainerById(id),
      getSubjectsByTrainer(id),
      api.get("/subject")
    ])
      .then(([trainerRes, subjectsRes, allSubjectsRes]) => {
        setTrainer(trainerRes.data);
        setSubjects(subjectsRes.data);
        setAllSubjects(allSubjectsRes.data);
      })
      .catch(() => {
        toast.show({ type: "error", message: "Trainer not found" });
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (activeSubject && trainer) {
      getAssignedTopicsForTrainerAndSubject(
        trainer.empId,
        activeSubject.subjectId
      )
        .then(res => setTopics(res.data || []))
        .catch(() => setTopics([]));
    } else {
      setTopics([]);
    }
  }, [activeSubject, trainer]);

  /* ---------------- ACTIONS ---------------- */

  const assignSubject = async () => {
    if (!selectedSubject) return;

    try {
      await api.post("/trainer-subject/assign", {
        empId: trainer.empId,
        subjectId: Number(selectedSubject)
      });

      loadAssignments();
      setShowAssign(false);
      setSelectedSubject("");
      toast.show({ type: "success", message: "Subject assigned successfully" });
    } catch (err) {
      toast.show({
        type: "error",
        message: err.response?.data || "Assignment failed"
      });
    }
  };

  const removeAssignment = (empId, subjectId) => {
    if (!window.confirm("Remove this subject from trainer?")) return;

    api.delete(`/trainer-subject/${empId}/${subjectId}`).then(() => {
      loadAssignments();
      setActiveSubject(null);
      setTopics([]);
      toast.show({ type: "success", message: "Subject removed successfully" });
    });
  };

  const removeTrainer = async () => {
    if (!window.confirm("Delete this trainer permanently?")) return;
    await deleteTrainer(trainer.empId);
    navigate("/trainers");
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500">
        Loading trainer profile...
      </div>
    );
  }

  if (!trainer) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            {trainer.name}
          </h1>
          <p className="text-sm font-medium text-blue-600 mt-1">
            {trainer.experience >= 4 ? "Senior Trainer" : "Junior Trainer"}
          </p>

          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p>📧 {trainer.email}</p>
            <p>📞 {trainer.mobileNumber || "N/A"}</p>
          </div>
        </div>

        <div className="flex gap-2 items-start">
          <Link
            to={`/edit/${trainer.empId}`}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm no-underline"
          >
            Edit
          </Link>
          <button
            onClick={removeTrainer}
            className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat label="Experience" value={`${trainer.experience} yrs`} />
        <Stat label="Subjects" value={subjects.length} />
        <Stat label="Format" value={trainer.format || "N/A"} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* SUBJECT LIST */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Assigned Subjects
            </h3>
            <button
              onClick={() => setShowAssign(true)}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              + Add Subject
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map(s => (
              <div
                key={s.subjectId}
                onClick={() => setActiveSubject(s)}
                className={`rounded-xl border p-4 cursor-pointer transition
                  ${
                    activeSubject?.subjectId === s.subjectId
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <h4 className="font-medium text-gray-800">
                  {s.subjectName}
                </h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SUBJECT DETAILS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h4 className="font-semibold text-gray-800 mb-3">
            Subject Details
          </h4>

          {!activeSubject ? (
            <p className="text-sm text-gray-400">
              Select a subject to view details
            </p>
          ) : (
            <div className="space-y-3 text-sm text-gray-700">
              <p><span className="font-medium">Name:</span> {activeSubject.subjectName}</p>
              <p><span className="font-medium">Description:</span> {activeSubject.description || "N/A"}</p>

              <div>
                <p className="font-medium mb-1">Topics</p>
                {topics.length === 0 ? (
                  <p className="text-gray-500">No topics assigned</p>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {topics.map(topic => (
                      <li key={topic.id || topic.topicId}>
                        {topic.topicName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={() =>
                  removeAssignment(trainer.empId, activeSubject.subjectId)
                }
                className="mt-2 px-4 py-2 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
              >
                Remove Subject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TODAY SESSIONS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Today’s Sessions
        </h3>
        <p className="text-sm text-gray-400">
          No sessions scheduled for today
        </p>
      </div>

      {/* REVIEWS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Reviews
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>⭐ ⭐ ⭐ ⭐ ⭐ – Excellent teaching style</p>
          <p>⭐ ⭐ ⭐ ⭐ – Very clear explanations</p>
        </div>
      </div>

      {/* ASSIGN SUBJECT MODAL */}
      {showAssign && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
            <h3 className="font-semibold mb-4">Assign Subject</h3>

            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            >
              <option value="">Select subject</option>
              {allSubjects.map(s => (
                <option key={s.subjectId} value={s.subjectId}>
                  {s.subjectName}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAssign(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={assignSubject}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- STAT COMPONENT ---------- */

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition">
    <h3 className="text-3xl font-semibold text-blue-700">{value}</h3>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

export default TrainerProfile;
