import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllTrainers,
  deleteTrainer,
  getTrainerById,
  getTrainersBySubject,
  getSubjectsByTrainer,
} from "../services/trainerService";

import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import "../styles/TrainerList.css";

function TrainerList() {
  const [trainers, setTrainers] = useState([]);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("name");

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = () => {
    getAllTrainers().then(async (res) => {
      const list = res.data || [];
      const updated = await Promise.all(
        list.map(async (t) => {
          try {
            const s = await getSubjectsByTrainer(t.empId);
            t.subjects = s.data || [];
          } catch {
            t.subjects = [];
          }
          return t;
        })
      );
      setTrainers(updated);
    });
  };

  const handleSearch = () => {
    if (!query) return alert("Enter search value");

    if (searchType === "name") {
      setTrainers((prev) =>
        prev.filter((t) =>
          t.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    if (searchType === "id") {
      getTrainerById(query)
        .then(async (res) => {
          const t = res.data;
          const s = await getSubjectsByTrainer(t.empId);
          t.subjects = s.data || [];
          setTrainers([t]);
        })
        .catch(() => alert("Trainer not found"));
    }

    if (searchType === "subject") {
      getTrainersBySubject(query)
        .then(async (res) => {
          const list = res.data || [];
          const updated = await Promise.all(
            list.map(async (t) => {
              const s = await getSubjectsByTrainer(t.empId);
              t.subjects = s.data || [];
              return t;
            })
          );
          setTrainers(updated);
        })
        .catch(() => alert("No trainers found"));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this trainer?")) {
      deleteTrainer(id).then(() => {
        alert("Trainer deleted");
        loadTrainers();
      });
    }
  };

  return (
    <div className="trainer-page">
      {/* Header */}
      <div className="trainer-header">
        <div>
          <h2>Trainer Management</h2>
          <p>{trainers.length} Trainers</p>
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
        <button className="reset" onClick={loadTrainers}>
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="trainer-table-wrapper">
        <table className="trainer-table">
          <thead>
            <tr>
              <th></th>
              <th>Trainer</th>
              <th>Email</th>
              <th>Experience</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
           {trainers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No trainers found
              </td>
            </tr>
          ) : (
            trainers.map((t) => (
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
                    View
                  </Link>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(t.empId)}
                  >
                    Delete
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
