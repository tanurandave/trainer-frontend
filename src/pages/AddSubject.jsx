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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-[0_25px_70px_rgba(0,0,0,0.35)] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-400 via-indigo-300 to-violet-400 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">
            {initialData ? "Edit Subject" : "Create New Subject"}
          </h2>
          <p className="mt-1 text-sm text-indigo-100">
            Define and manage subjects professionally
          </p>

          <button
            onClick={() => navigate("/subjects")}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-7">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subjectName"
              placeholder="Advanced Mathematics"
              value={form.subjectName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900
                         placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Briefly describe what this subject covers"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900
                         placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none resize-none transition"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => navigate("/subjects")}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white
                         hover:bg-indigo-700 shadow-md hover:shadow-lg transition"
            >
              {initialData ? "Update Subject" : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubject;