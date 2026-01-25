import api from "./api";

export const addTopic = (topic) => {
  return api.post("/topics", topic);
};

export const getAllTopics = () => {
  return api.get("/topics");
};

export const getTopicsForSubject = (subjectId) => {
  return api.get(`/topics/subject/${subjectId}`);
};

export const addTopicToSubject = (subjectId, topic) => {
  return api.post(`/topics/subject/${subjectId}`, topic);
};

export const deleteTopicFromSubject = (subjectId, topicId) => {
  return api.delete(`/topics/subject/${subjectId}/topic/${topicId}`);
};
