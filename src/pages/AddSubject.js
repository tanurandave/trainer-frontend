import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addSubject } from "../services/subjectService";

function AddSubject({ initialData, onSubmit, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subjectName: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSubject(form);
      alert("Subject added successfully!");
      navigate("/subjects");
    } catch (error) {
      alert("Error adding subject: " + error.message);
    }
  };

  const handleClose = () => {
    navigate("/subjects");
  };

  return (
    <div className="subject-form-overlay">
      <div className="subject-form-card">
        <h3>{initialData ? "Edit Subject" : "Add Subject"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="subjectName"
            placeholder="Subject Name"
            value={form.subjectName}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button className="btn-primary">
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubject;
