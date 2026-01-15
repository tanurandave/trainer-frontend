import api from "./api";

export const getAllSubjects = () => {
  return api.get("/subject");
};

export const getSubjectById = (id) => {
  return api.get(`/subject/${id}`);
};

export const addSubject = (subject) => {
  return api.post("/subject", subject);
};

export const deleteSubject = (id) => {
  return api.delete(`/subject/${id}`);
};
