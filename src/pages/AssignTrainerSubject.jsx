import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AddTopicModal from "../components/AddTopicModal";
import AssignTopicToTrainer from "../components/AssignTopicToTrainer";

function AssignTrainerSubject({ trainers, subjects }) {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ empId: "", subjectId: "" });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = () => {
    api.get("/trainer-subject").then(res => setAssignments(res.data));
  };

  const assignTrainer = () => {
    if (!form.empId || !form.subjectId) return;

    api.post("/trainer-subject/assign", {
      empId: Number(form.empId),
      subjectId: Number(form.subjectId)
    }).then(() => {
      setForm({ empId: "", subjectId: "" });
      loadAssignments();
    });
  };

  const removeAssignment = (empId, subjectId) => {
    api.delete(`/trainer-subject/${empId}/${subjectId}`)
      .then(loadAssignments);
  };

  const handleAddTopic = (assignment) => {
    const subject = subjects.find(s => s.subjectId === assignment.subjectId);

    navigate("/topics", {
      state: {
        subjectId: assignment.subjectId,
        subjectName: subject?.subjectName || ""
      }
    });
  };

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-8">

      <h1 className="text-2xl font-semibold text-slate-800">
        Trainer – Subject Assignment
      </h1>

      {/* Assign Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm
                       focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
            value={form.empId}
            onChange={e => setForm({ ...form, empId: e.target.value })}
          >
            <option value="">Select Trainer</option>
            {trainers.map(t => (
              <option key={t.empId} value={t.empId}>{t.name}</option>
            ))}
          </select>

          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm
                       focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
            value={form.subjectId}
            onChange={e => setForm({ ...form, subjectId: e.target.value })}
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </option>
            ))}
          </select>

          <button
            onClick={assignTrainer}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white
                       hover:bg-indigo-700 shadow-sm hover:shadow transition"
          >
            Assign Trainer
          </button>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Trainer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Subject
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {assignments.map((a, i) => (
                <tr
                  key={i}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                    {trainers.find(t => t.empId === a.empId)?.name}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                      {subjects.find(s => s.subjectId === a.subjectId)?.subjectName}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right space-x-4">
                    <button
                      onClick={() => handleAddTopic(a)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                    >
                      + Add Topic
                    </button>

                    <button
                      onClick={() => removeAssignment(a.empId, a.subjectId)}
                      className="text-sm font-medium text-red-500 hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Kept for backward compatibility */}
      {selected && (
        <AddTopicModal
          subject={subjects.find(s => s.subjectId === selected.subjectId)?.subjectName}
          subjectId={selected.subjectId}
          onClose={() => setSelected(null)}
        />
      )}

      <AssignTopicToTrainer trainers={trainers} subjects={subjects} />
    </div>
  );
}

export default AssignTrainerSubject;
