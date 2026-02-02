import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  deleteTrainer,
  getTrainerById,
  getTrainersBySubject,
  getSubjectsByTrainer,
} from "../services/trainerService";
import { useToast } from "../components/ToastProvider";
import { FaTrash, FaEye, FaPlus } from "react-icons/fa";

function TrainerList({ trainers, refreshTrainers }) {
  const [filteredTrainers, setFilteredTrainers] = useState(trainers);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("name");

  const toast = useToast();

  const safeShow = (options = {}) => {
    if (!toast || !toast.show) return;
    toast.show({
      type: options.type || "success",
      title: options.title || "",
      message: options.message || "",
    });
  };

  useEffect(() => {
    setFilteredTrainers(trainers);
  }, [trainers]);

  /* ---------------- SEARCH ---------------- */
  const handleSearch = async () => {
    if (!query.trim()) {
      safeShow({
        type: "warning",
        title: "Search Required",
        message: "Please enter a value to search.",
      });
      return;
    }

    if (searchType === "name") {
      const result = trainers.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTrainers(result);
      return;
    }

    if (searchType === "id") {
      try {
        const res = await getTrainerById(query);
        const trainer = res.data;
        const subjectsRes = await getSubjectsByTrainer(trainer.empId);
        trainer.subjects = subjectsRes.data || [];
        setFilteredTrainers([trainer]);
      } catch {
        setFilteredTrainers([]);
      }
      return;
    }

    if (searchType === "subject") {
      const localFiltered = trainers.filter((t) =>
        (t.subjects || []).some((s) =>
          s.subjectName.toLowerCase().includes(query.toLowerCase())
        )
      );

      if (localFiltered.length > 0) {
        setFilteredTrainers(localFiltered);
        return;
      }

      try {
        const res = await getTrainersBySubject(query);
        const list = res.data || [];

        const updated = await Promise.all(
          list.map(async (t) => {
            const s = await getSubjectsByTrainer(t.empId);
            t.subjects = s.data || [];
            return t;
          })
        );

        setFilteredTrainers(updated);
      } catch {
        setFilteredTrainers([]);
      }
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = (id) => {
    if (window.confirm("Delete this trainer?")) {
      deleteTrainer(id)
        .then(() => refreshTrainers())
        .catch(() =>
          safeShow({
            type: "error",
            title: "Delete Failed",
            message: "Unable to delete trainer.",
          })
        );
    }
  };

  /* ---------------- RESET ---------------- */
  const handleReset = () => {
    setQuery("");
    setSearchType("name");
    setFilteredTrainers(trainers);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Trainer Management</h2>
          <p className="text-gray-500">{filteredTrainers.length+1} Trainers</p>
        </div>

        <Link
          to="/add-trainer"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg w-fit"
        >
          <FaPlus /> Add Trainer
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-3 py-2 rounded-md border"
        >
          <option value="name">Name</option>
          <option value="id">Emp ID</option>
          <option value="subject">Subject</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${searchType}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 rounded-md border flex-1"
        />

        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-400 text-white px-4 py-2 rounded-md"
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-md table-auto border border-gray-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Emp_ID</th>
              <th className="p-3 text-left">Trainer</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Experience</th>
              <th className="p-3 text-left">Subjects</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTrainers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No trainers found
                </td>
              </tr>
            ) : (
              filteredTrainers.map((t) => (
                <tr key={t.empId} className="border-t">
                  <td className="p-3">{t.empId}</td>
                  <td className="p-3 font-medium">
                    <Link
                      to={`/trainer/${t.empId}`}
                      className="no-underline text-black font-normal"
                    >
                      {t.name}
                    </Link>
                  </td>

                  <td className="p-3">{t.email}</td>
                  <td className="p-3">{t.experience} yrs</td>
                  <td className="p-3 text-sm">
                    {(t.subjects || []).map((s) => s.subjectName).join(", ")}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/trainer/${t.empId}`}
                        className="flex items-center gap-2 px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 no-underline"
                      >
                        <FaEye /> View
                      </Link>

                      <button
                        onClick={() => handleDelete(t.empId)}
                        className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrainerList;