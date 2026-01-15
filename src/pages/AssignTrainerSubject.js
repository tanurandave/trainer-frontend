import { useEffect, useState } from "react";
import { getAllTrainers } from "../services/trainerService";
import { getAllSubjects } from "../services/subjectService";
import api from "../services/api";
import { addTopic } from "../services/topicService";

function AssignTrainerSubject() {
  const [trainers, setTrainers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [data, setData] = useState({
    empId: "",
    subjectId: ""
  });
  const [topicData, setTopicData] = useState({
    topicName: "",
    description: ""
  });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAddTopic, setShowAddTopic] = useState(false);

  useEffect(() => {
    getAllTrainers().then(res => setTrainers(res.data));
    getAllSubjects().then(res => setSubjects(res.data));
    loadAssignments();
  }, []);

  const loadAssignments = () => {
    api.get("/trainer-subject")
      .then(res => {
        console.log("Assignments loaded:", res.data);
        setAssignments(res.data);
      })
      .catch(err => {
        console.error("Error loading assignments", err);
        alert("Error loading assignments. Check console for details.");
      });
  };

  const handleAssign = () => {
    if (!data.empId || !data.subjectId) {
      alert("Please select trainer and subject");
      return;
    }

    api.post("/trainer-subject/assign", {
      empId: parseInt(data.empId),
      subjectId: parseInt(data.subjectId)
    })
      .then((response) => {
        console.log("Assignment response:", response);
        alert("Trainer assigned successfully ✅");
        setData({ empId: "", subjectId: "" });
        loadAssignments();
      })
      .catch((error) => {
        console.error("Assignment error:", error);
        console.error("Error response:", error.response);
        alert(`Error: ${error.response?.data || error.message}`);
      });
  };

  const handleDelete = (empId, subjectId) => {
    if (window.confirm("Are you sure you want to remove this assignment?")) {
      // Log the values being sent
      console.log("Deleting assignment with empId:", empId, "subjectId:", subjectId);
      
      api.delete(`/trainer-subject/${empId}/${subjectId}`)
        .then((response) => {
          console.log("Delete response:", response);
          alert("Assignment removed ✅");
          loadAssignments();
        })
        .catch((error) => {
          console.error("Delete error:", error);
          console.error("Error response:", error.response);
          alert(`Error removing assignment: ${error.response?.data || error.message}`);
        });
    }
  };

  const getTrainerName = (empId) => {
    const trainer = trainers.find(t => t.empId === empId);
    return trainer ? trainer.name : "Unknown";
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.subjectId === subjectId);
    return subject ? subject.subjectName : "Unknown";
  };

  const handleAddTopic = (assignment) => {
    setSelectedAssignment(assignment);
    setShowAddTopic(true);
  };

  const handleTopicSubmit = () => {
    if (!topicData.topicName.trim()) {
      alert("Topic name is required");
      return;
    }

    addTopic(topicData)
      .then((response) => {
        const topicId = response.data.topicId;
        api.post(`/subject/${selectedAssignment.subjectId}/topics/${topicId}`)
          .then(() => {
            alert("Topic added to subject successfully");
            setTopicData({ topicName: "", description: "" });
            setShowAddTopic(false);
            setSelectedAssignment(null);
          })
          .catch((error) => {
            alert(`Error assigning topic: ${error.response?.data || error.message}`);
          });
      })
      .catch((error) => {
        alert(`Error adding topic: ${error.response?.data || error.message}`);
      });
  };

  return (
    <div className="container mt-4">
      <h3>Assign Trainer to Subject</h3>

      <div className="card p-4 mb-4">
        <select
          className="form-control mb-3"
          value={data.empId}
          onChange={e => setData({ ...data, empId: e.target.value })}
        >
          <option value="">Select Trainer</option>
          {trainers.map(t => (
            <option key={t.empId} value={t.empId}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          className="form-control mb-3"
          value={data.subjectId}
          onChange={e => setData({ ...data, subjectId: e.target.value })}
        >
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s.subjectId} value={s.subjectId}>
              {s.subjectName}
            </option>
          ))}
        </select>

        <button className="btn btn-success" onClick={handleAssign}>
          Assign Trainer to Subject
        </button>
      </div>

      <h4 className="mt-5">Assigned Trainers - Subjects</h4>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Trainer Name</th>
            <th>Subject</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                No assignments yet
              </td>
            </tr>
          ) : (
            assignments.map((assignment, index) => (
              <tr key={index}>
                <td>{getTrainerName(assignment.empId)}</td>
                <td>{getSubjectName(assignment.subjectId)}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleAddTopic(assignment)}
                  >
                    Add Topic
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(assignment.empId, assignment.subjectId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showAddTopic && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Topic to {getSubjectName(selectedAssignment.subjectId)}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddTopic(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Topic Name"
                  value={topicData.topicName}
                  onChange={(e) => setTopicData({ ...topicData, topicName: e.target.value })}
                />
                <textarea
                  className="form-control"
                  placeholder="Description"
                  value={topicData.description}
                  onChange={(e) => setTopicData({ ...topicData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddTopic(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleTopicSubmit}>Add Topic</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignTrainerSubject;
