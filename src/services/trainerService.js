import api from "./api";

export const getAllTrainers = () => {
  return api.get("/trainer");
};

export const getTrainerById = (id) => {
  return api.get(`/trainer/${id}`);
};

export const getTrainersBySubject = (subject) => {
  return api.get(`/trainer/${subject}/topic`);
};

export const getSubjectsByTrainer = (id) => {
  return api.get(`/trainer/${id}/subjects`);
};

export const addTrainer = (trainer) => {
  return api.post("/trainer", trainer);
};

export const deleteTrainer = (id) => {
  return api.delete(`/trainer/${id}`);
};
export const updateTrainer = (trainer) => {
  return api.post("/trainer", trainer);
};
