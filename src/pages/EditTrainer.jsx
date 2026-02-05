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

        navigate("/trainers");
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
    <div className="max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Edit Trainer
      </h3>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 space-y-4"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            name="name"
            value={trainer.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-200 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={trainer.email}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience (years)
          </label>
          <input
            type="number"
            name="experience"
            value={trainer.experience}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            name="mobileNumber"
            value={trainer.mobileNumber}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            name="address"
            value={trainer.address}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Training Format
          </label>
          <select
            name="format"
            value={trainer.format}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-yellow-500 outline-none"
          >
            <option value="">Select format</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded-md font-medium hover:bg-yellow-600 transition"
        >
          Update Trainer
        </button>
      </form>
    </div>
  );
}

export default EditTrainer;
