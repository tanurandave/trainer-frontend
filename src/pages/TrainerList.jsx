import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  deleteTrainer,
  getTrainerById,
  getTrainersBySubject,
  getSubjectsByTrainer,
} from "../services/trainerService";

import { FaTrash, FaEye, FaPlus } from "react-icons/fa";
import "../styles/TrainerList.css";

function TrainerList({ trainers, refreshTrainers }) {
  const [filteredTrainers, setFilteredTrainers] = useState(trainers);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("name");

  // ✅ Sync filtered trainers with parent data
  useEffect(() => {
    setFilteredTrainers(trainers);
  }, [trainers]);

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Enter search value");
      return;
    }

    // 🔍 Search by Name (local)
    if (searchType === "name") {
      setFilteredTrainers(
        trainers.filter((t) =>
          t.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    // 🔍 Search by Emp ID (API)
    if (searchType === "id") {
      try {
        const res = await getTrainerById(query);
        const t = res.data;
        const s = await getSubjectsByTrainer(t.empId);
        t.subjects = s.data || [];
        setFilteredTrainers([t]);
      } catch {
        alert("Trainer not found");
      }
    }

    // 🔍 Search by Subject (API + SAFE FALLBACK)
    if (searchType === "subject") {
      try {
        const res = await getTrainersBySubject(query);
        let list = res.data || [];

        // ✅ If backend returns empty → fallback to local subject-name search
        if (list.length === 0) {
          const localFiltered = trainers.filter((t) =>
            (t.subjects || []).some((s) =>
              s.subjectName.toLowerCase().includes(query.toLowerCase())
            )
          );
          setFilteredTrainers(localFiltered);
          return;
        }

        // ✅ Attach subjects properly (existing behavior preserved)
        const updated = await Promise.all(
          list.map(async (t) => {
            const s = await getSubjectsByTrainer(t.empId);
            t.subjects = s.data || [];
            return t;
          })
        );

        setFilteredTrainers(updated);
      } catch {
        alert("No trainers found");
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this trainer?")) {
      deleteTrainer(id).then(() => {
        alert("Trainer deleted");
        refreshTrainers();
      });
    }
  };

  const handleReset = () => {
    setQuery("");
    setSearchType("name");
    setFilteredTrainers(trainers);
  };

  return (
    <div className="trainer-page">
      {/* Header */}
      <div className="trainer-header">
        <div>
          <h2>Trainer Management</h2>
          <p>{filteredTrainers.length} Trainers</p>
        </div>
        <Link to="/add-trainer" className="add-btn">
          <FaPlus /> Add New Trainer
        </Link>
      </div>

      {/* Filters */}
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

      {/* Table */}
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
                    {(t.subjects || [])
                      .map((s) => s.subjectName)
                      .join(", ")}
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
