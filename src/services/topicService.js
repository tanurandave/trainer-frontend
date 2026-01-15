import api from "./api";

export const addTopic = (topic) => {
  return api.post("/topic", topic);
};
