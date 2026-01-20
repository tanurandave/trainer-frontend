import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addSubject } from "../services/subjectService";
import { useToast } from "../components/ToastProvider";

function AddSubject({ initialData }) {
  const navigate = useNavigate();
  const { show } = useToast();

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

      show({
        type: "success",
        title: "Subject Created",
        message: "The subject has been added successfully.",
      });

      navigate("/subjects");
    } catch (error) {
      show({
        type: "error",
        title: "Creation Failed",
        message:
          error?.response?.data?.message ||
          "Unable to add subject. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData ? "Edit Subject" : "Add New Subject"}
          </h2>
          <button
            onClick={() => navigate("/subjects")}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Subtitle */}
        <p className="px-6 pt-4 text-sm text-gray-500">
          Create a new subject for your institute
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subjectName"
              placeholder="e.g. Advanced Mathematics"
              value={form.subjectName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Provide a detailed description of the subject"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/subjects")}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700
                         hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white
                         hover:bg-blue-700 shadow-md hover:shadow-lg transition"
            >
              ✓ {initialData ? "Update Subject" : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubject;
