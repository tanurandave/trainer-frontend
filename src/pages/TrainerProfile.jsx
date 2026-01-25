import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {
  getTrainerById,
  getSubjectsByTrainer,
  deleteTrainer
} from "../services/trainerService";
import { getTopicsForSubject, getAssignedTopicsForTrainerAndSubject } from "../services/subjectService";
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
    if (activeSubject) {
      getTopicsForSubject(activeSubject.subjectId).then(res => {
        setTopics(res.data || []);
      }).catch(err => {
        console.error("Error loading topics", err);
        setTopics([]);
      });
    } else {
      setTopics([]);
    }
  }, [activeSubject]);

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
      toast.show({ type: "error", message: err.response?.data || "Assignment failed" });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading trainer profile...
      </div>
    );
  }

  if (!trainer) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-6 flex justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">{trainer.name}</h1>
          <p className="text-gray-500">
            {trainer.experience >= 4 ? "Senior Trainer" : "Junior Trainer"}
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <p>📧 {trainer.email}</p>
            <p>📞 {trainer.mobileNumber || "N/A"}</p>
          </div>
        </div>

        {/* 🔹 SMALL BUTTONS */}
        <div className="flex gap-2 items-start">
          <Link
            to={`/edit/${trainer.empId}`}
            className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={removeTrainer}
            className="border border-red-500 text-red-600 px-3 py-1 text-sm rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Stat label="Experience" value={`${trainer.experience} yrs`} />
        <Stat label="Subjects" value={subjects.length} />
        <Stat label="Format" value={trainer.format || "N/A"} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        {/* SUBJECT LIST */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-lg text-blue-600">
              Assigned Subjects
            </h3>
            <button
              onClick={() => setShowAssign(true)}
              className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
            >
              + Add Subject
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map(s => (
              <div
                key={s.subjectId}
                onClick={() => setActiveSubject(s)}
                className={`border rounded-lg p-4 cursor-pointer
                  ${activeSubject?.subjectId === s.subjectId
                    ? "border-blue-600 bg-blue-50"
                    : "hover:bg-gray-50"}
                `}
              >
                <h4 className="font-medium">{s.subjectName}</h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SUBJECT DETAILS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold mb-3 text-blue-600">
            Subject Details
          </h4>

          {!activeSubject ? (
            <p className="text-gray-400 text-sm">
              Click on a subject to view details
            </p>
          ) : (
            <div className="space-y-3 text-sm">
              <p><b>Name:</b> {activeSubject.subjectName}</p>
              <p><b>Description:</b> {activeSubject.description || "N/A"}</p>

              <div>
                <p><b>Topics:</b></p>
                {topics.length === 0 ? (
                  <p className="text-gray-500">No topics assigned</p>
                ) : (
                  <ul className="list-disc list-inside">
                    {topics.map(topic => (
                      <li key={topic.id || topic.topicId}>{topic.topicName}</li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={() =>
                  removeAssignment(trainer.empId, activeSubject.subjectId)
                }
                className="px-3 py-1 text-sm border border-red-500 text-red-600 rounded hover:bg-red-50"
              >
                Remove Subject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 TODAY'S SESSIONS */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="font-semibold text-lg text-blue-600 mb-2">
          Today’s Sessions
        </h3>
        <p className="text-gray-400 text-sm">
          No sessions scheduled for today
        </p>
      </div>

      {/* 🔹 REVIEWS */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="font-semibold text-lg text-blue-600 mb-2">
          Reviews
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>⭐ ⭐ ⭐ ⭐ ⭐ – Excellent teaching style</p>
          <p>⭐ ⭐ ⭐ ⭐ – Very clear explanations</p>
        </div>
      </div>

      {/* ASSIGN SUBJECT MODAL (UNCHANGED) */}
      {showAssign && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="font-semibold mb-4">Assign Subject</h3>

            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full border p-2 rounded mb-4"
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
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={assignSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded"
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
  <div className="bg-white rounded-xl shadow p-6 text-center">
    <h3 className="text-2xl font-bold text-blue-700">{value}</h3>
    <p className="text-gray-500 text-sm">{label}</p>
  </div>
);

export default TrainerProfile;
