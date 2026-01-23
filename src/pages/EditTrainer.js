import { useEffect, useState } from "react";
import { getTrainerById, updateTrainer } from "../services/trainerService";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ToastProvider";

function EditTrainer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();

  const [trainer, setTrainer] = useState({
    empId: "",
    name: "",
    email: "",
    experience: "",
    address: "",
    format: "",
    mobileNumber: "",
  });

  /* ---------------- LOAD TRAINER ---------------- */
  useEffect(() => {
    getTrainerById(id)
      .then((res) => setTrainer(res.data))
      .catch(() => {
        show({
          type: "error",
          title: "Load Failed",
          message: "Unable to load trainer details.",
        });
      });
  }, [id, show]);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    setTrainer({ ...trainer, [e.target.name]: e.target.value });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    updateTrainer(trainer)
      .then(() => {
        show({
          type: "success",
          title: "Trainer Updated",
          message: "Trainer updated successfully.",
        });

        navigate("/");
      })
      .catch(() => {
        show({
          type: "error",
          title: "Update Failed",
          message: "Error updating trainer. Please try again.",
        });
      });
  };

  return (
    <div className="container mt-4">
      <h3>Edit Trainer</h3>

      <form className="card p-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="name"
            value={trainer.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={trainer.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Experience (years)</label>
          <input
            className="form-control"
            name="experience"
            type="number"
            value={trainer.experience}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mobile Number</label>
          <input
            className="form-control"
            name="mobileNumber"
            value={trainer.mobileNumber}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            className="form-control"
            name="address"
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

        <button className="btn btn-warning w-100">
          Update Trainer
        </button>
      </form>
    </div>
  );
}

export default EditTrainer;
