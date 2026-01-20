import api from "./api";

export const addTopic = (topic) => {
  return api.post("/topics", topic);
};

export const getAllTopics = () => {
  return api.get("/topics");
};
