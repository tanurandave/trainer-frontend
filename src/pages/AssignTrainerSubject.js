import { useEffect, useState } from "react";
import api from "../services/api";
import AddTopicModal from "./../components/AddTopicModal";
import AssignTopicToTrainer from "../components/AssignTopicToTrainer";

function AssignTrainerSubject({ trainers, subjects }) {
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

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Trainer – Subject Assignment
      </h1>

      {/* Assign Card */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <div className="grid grid-cols-3 gap-4">
          <select
            className="border p-2 rounded"
            value={form.empId}
            onChange={e => setForm({ ...form, empId: e.target.value })}
          >
            <option value="">Select Trainer</option>
            {trainers.map(t => (
              <option key={t.empId} value={t.empId}>{t.name}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={form.subjectId}
            onChange={e => setForm({ ...form, subjectId: e.target.value })}
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
            ))}
          </select>

          <button
            onClick={assignTrainer}
            className="bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Assign
          </button>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3 text-left">Trainer</th>
              <th className="p-3">Subject</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  {trainers.find(t => t.empId === a.empId)?.name}
                </td>
                <td className="p-3 text-center">
                  <span className="px-3 py-1 bg-blue-100 rounded-full">
                    {subjects.find(s => s.subjectId === a.subjectId)?.subjectName}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => setSelected(a)}
                    className="text-blue-600 hover:underline"
                  >
                    + Topic
                  </button>
                  <button
                    onClick={() => removeAssignment(a.empId, a.subjectId)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <AddTopicModal
          subject={subjects.find(s => s.subjectId === selected.subjectId)?.subjectName}
          subjectId={selected.subjectId}
          onClose={() => setSelected(null)}
        />
      )}

      <AssignTopicToTrainer trainers={trainers} subjects={subjects} />
    </div>);
}

export default AssignTrainerSubject;
