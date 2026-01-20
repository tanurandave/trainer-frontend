import { createContext, useContext, useState, useEffect } from "react";
import { getAllSubjects } from "../services/subjectService";
import { getAllTrainers, getSubjectsByTrainer } from "../services/trainerService";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const refreshSubjects = () => {
    getAllSubjects().then(res => setSubjects(res.data || []));
  };

  const refreshTrainers = () => {
    getAllTrainers().then(async (res) => {
      const list = res.data || [];
      const updated = await Promise.all(
        list.map(async (t) => {
          try {
            const s = await getSubjectsByTrainer(t.empId);
            t.subjects = s.data || [];
          } catch {
            t.subjects = [];
          }
          return t;
        })
      );
      setTrainers(updated);
    });
  };

  useEffect(() => {
    refreshSubjects();
    refreshTrainers();
  }, []);

  return (
    <DataContext.Provider value={{ subjects, trainers, refreshSubjects, refreshTrainers }}>
      {children}
    </DataContext.Provider>
  );
};
