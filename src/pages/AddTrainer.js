import { useState, useEffect } from "react";
import { addTrainer } from "../services/trainerService";
import { getAllSubjects } from "../services/subjectService";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddTrainer() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [trainer, setTrainer] = useState({
    name: "",
    email: "",
    experience: "",
    address: "",
    format: "",
    mobileNumber: ""
  });

  useEffect(() => {
    getAllSubjects()
      .then(res => setSubjects(res.data))
      .catch(err => console.error("Error loading subjects:", err));
  }, []);

  const handleChange = (e) => {
    setTrainer({ ...trainer, [e.target.name]: e.target.value });
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!trainer.email.includes("@")) {
      alert("Invalid Email");
      return;
    }
    if (!trainer.name.trim()) {
      alert("Please enter trainer name");
      return;
    }
    if (!trainer.mobileNumber.trim()) {
      alert("Please enter mobile number");
      return;
    }
    if (selectedSubjects.length === 0) {
      alert("Please select at least one interested subject");
      return;
    }

    // Add trainer with subjects in one request
    addTrainer(trainer, selectedSubjects)
      .then(() => {
        alert("Trainer added successfully with interested subjects ✅");
        navigate("/");
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Error adding trainer ❌");
      });
  };

  return (
    <div className="container mt-4">
      <h3>Add Trainer</h3>

      <form className="card p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Trainer Name *</label>
          <input
            className="form-control"
            name="name"
            placeholder="Enter trainer name"
            value={trainer.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email *</label>
          <input
            className="form-control"
            name="email"
            type="email"
            placeholder="Enter email"
            value={trainer.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Experience (years) *</label>
          <input
            className="form-control"
            name="experience"
            type="number"
            placeholder="Enter experience in years"
            value={trainer.experience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mobile Number *</label>
          <input
            className="form-control"
            name="mobileNumber"
            placeholder="Enter mobile number"
            value={trainer.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            className="form-control"
            name="address"
            placeholder="Enter address"
            value={trainer.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Training Format</label>
          <select
            className="form-control"
            name="format"
            value={trainer.format}
            onChange={handleChange}
          >
            <option value="">Select format</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Interested Subjects/Technologies *</label>
          <div className="border p-3 rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {subjects.length === 0 ? (
              <p className="text-muted">No subjects available. Please add subjects first.</p>
            ) : (
              subjects.map(subject => (
                <div key={subject.subjectId} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`subject-${subject.subjectId}`}
                    checked={selectedSubjects.includes(subject.subjectId)}
                    onChange={() => handleSubjectToggle(subject.subjectId)}
                  />
                  <label className="form-check-label" htmlFor={`subject-${subject.subjectId}`}>
                    <strong>{subject.subjectName}</strong> - {subject.description}
                  </label>
                </div>
              ))
            )}
          </div>
          <small className="text-muted">
            Selected: {selectedSubjects.length} subject(s)
          </small>
        </div>

        <button className="btn btn-primary w-100">
          Save Trainer
        </button>
      </form>
    </div>
  );
}

export default AddTrainer;
