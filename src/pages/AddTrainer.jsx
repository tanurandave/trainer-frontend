import { useState } from "react";
import { addTrainer } from "../services/trainerService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";

function AddTrainer({ subjects, refreshTrainers }) {
  const navigate = useNavigate();
  const { show } = useToast();

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [trainer, setTrainer] = useState({
    name: "",
    email: "",
    experience: "",
    address: "",
    format: "",
    mobileNumber: "",
  });

  const handleChange = (e) => {
    setTrainer({ ...trainer, [e.target.name]: e.target.value });
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!trainer.email.includes("@")) {
      show({
        type: "error",
        title: "Invalid Email",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (!trainer.name.trim()) {
      show({
        type: "warning",
        title: "Name Required",
        message: "Please enter trainer name.",
      });
      return;
    }

    if (!trainer.mobileNumber.trim()) {
      show({
        type: "warning",
        title: "Mobile Required",
        message: "Please enter mobile number.",
      });
      return;
    }

    if (selectedSubjects.length === 0) {
      show({
        type: "info",
        title: "Subjects Required",
        message: "Please select at least one interested subject.",
      });
      return;
    }

    addTrainer(trainer, selectedSubjects)
      .then(() => {
        show({
          type: "success",
          title: "Trainer Added",
          message: "Trainer added successfully with interested subjects.",
        });

        refreshTrainers();
        navigate("/trainers");
      })
      .catch(() => {
        show({
          type: "error",
          title: "Add Failed",
          message: "Error adding trainer. Please try again.",
        });
      });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Add Trainer
      </h3>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 space-y-4"
      >
        {/* Trainer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trainer Name *
          </label>
          <input
            name="name"
            value={trainer.name}
            onChange={handleChange}
            placeholder="Enter trainer name"
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={trainer.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience (years) *
          </label>
          <input
            type="number"
            name="experience"
            value={trainer.experience}
            onChange={handleChange}
            placeholder="Enter experience"
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </label>
          <input
            name="mobileNumber"
            value={trainer.mobileNumber}
            onChange={handleChange}
            placeholder="Enter mobile number"
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
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
            placeholder="Enter address"
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
            className="w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select format</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Subjects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interested Subjects *
          </label>

          <div className="border rounded-md p-2 max-h-64 overflow-y-auto space-y-1">
            {subjects.map((subject) => (
              <label
                key={subject.subjectId}
                className="flex gap-2 items-start text-sm hover:bg-gray-50 p-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject.subjectId)}
                  onChange={() =>
                    handleSubjectToggle(subject.subjectId)
                  }
                  className="mt-1"
                />
                <span>
                  <strong>{subject.subjectName}</strong> –{" "}
                  {subject.description}
                </span>
              </label>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Selected: {selectedSubjects.length}
          </p>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Trainer
        </button>
      </form>
    </div>
  );
}

export default AddTrainer;
