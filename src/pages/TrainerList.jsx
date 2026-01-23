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
import "../styles/TrainerList.css";

function TrainerList({ trainers, refreshTrainers }) {
  const [filteredTrainers, setFilteredTrainers] = useState(trainers);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("name");

  const toast = useToast();

  /* ---------------- SAFE TOAST ---------------- */
  const safeShow = (options = {}) => {
    if (!toast || !toast.show) return;

    toast.show({
      type: options.type || "success", // 👈 fallback
      title: options.title || "",
      message: options.message || "",
    });
  };

  /* ---------------- SYNC DATA ---------------- */
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

      safeShow({
        type: "success",
        title: "Search Completed",
        message: `${result.length} trainer(s) found by name.`,
      });
      return;
    }

    if (searchType === "id") {
      try {
        const res = await getTrainerById(query);
        const trainer = res.data;

        const subjectsRes = await getSubjectsByTrainer(trainer.empId);
        trainer.subjects = subjectsRes.data || [];

        setFilteredTrainers([trainer]);

        safeShow({
          type: "success",
          title: "Trainer Found",
          message: "Trainer details loaded successfully.",
        });
      } catch {
        setFilteredTrainers([]);

        safeShow({
          type: "error",
          title: "Not Found",
          message: "Trainer not found with this Emp ID.",
        });
      }
      return;
    }

    if (searchType === "subject") {
      const searchValue = query.toLowerCase();

      const localFiltered = trainers.filter((t) =>
        (t.subjects || []).some((s) =>
          s.subjectName.toLowerCase().includes(searchValue)
        )
      );

      if (localFiltered.length > 0) {
        setFilteredTrainers(localFiltered);

        safeShow({
          type: "success",
          title: "Search Completed",
          message: `${localFiltered.length} trainer(s) found for this subject.`,
        });
        return;
      }

      try {
        const res = await getTrainersBySubject(query);
        const list = res.data || [];

        if (list.length === 0) {
          setFilteredTrainers([]);

          safeShow({
            type: "info",
            title: "No Results",
            message: "No trainers found for this subject.",
          });
          return;
        }

        const updated = await Promise.all(
          list.map(async (t) => {
            const s = await getSubjectsByTrainer(t.empId);
            t.subjects = s.data || [];
            return t;
          })
        );

        setFilteredTrainers(updated);

        safeShow({
          type: "success",
          title: "Search Completed",
          message: `${updated.length} trainer(s) found for this subject.`,
        });
      } catch {
        setFilteredTrainers([]);

        safeShow({
          type: "error",
          title: "Search Failed",
          message: "Unable to search trainers by subject.",
        });
      }
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = (id) => {
    if (window.confirm("Delete this trainer?")) {
      deleteTrainer(id)
        .then(() => {
          safeShow({
            type: "success",
            title: "Trainer Deleted",
            message: "The trainer has been deleted successfully.",
          });
          refreshTrainers();
        })
        .catch(() => {
          safeShow({
            type: "error",
            title: "Delete Failed",
            message: "Unable to delete the trainer.",
          });
        });
    }
  };

  /* ---------------- RESET ---------------- */
  const handleReset = () => {
    setQuery("");
    setSearchType("name");
    setFilteredTrainers(trainers);

    safeShow({
      type: "info", // 👈 now SAFE
      title: "Reset",
      message: "Search filters have been reset.",
    });
  };

  return (
    <div className="trainer-page">
      <div className="trainer-header">
        <div>
          <h2>Trainer Management</h2>
          <p>{filteredTrainers.length} Trainers</p>
        </div>

        <Link to="/add-trainer" className="add-btn">
          <FaPlus /> Add New Trainer
        </Link>
      </div>

      <div className="trainer-filters">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
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
        />

        <button onClick={handleSearch}>Search</button>
        <button className="reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="trainer-table-wrapper">
        <table className="trainer-table">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Trainer</th>
              <th>Email</th>
              <th>Experience</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTrainers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No trainers found
                </td>
              </tr>
            ) : (
              filteredTrainers.map((t) => (
                <tr key={t.empId}>
                  <td>{t.empId}</td>
                  <td>
                    <Link to={`/trainer/${t.empId}`}>{t.name}</Link>
                  </td>
                  <td>{t.email}</td>
                  <td>{t.experience} yrs</td>
                  <td>
                    {(t.subjects || []).map((s) => s.subjectName).join(", ")}
                  </td>
                  <td>
                    <Link
                      to={`/trainer/${t.empId}`}
                      className="btn btn-sm btn-info me-2"
                    >
                      <FaEye /> View
                    </Link>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(t.empId)}
                    >
                      <FaTrash /> Delete
                    </button>
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
