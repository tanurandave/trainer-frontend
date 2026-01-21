import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider, useData } from "./context/DataContext";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./components/AppLayout";
import TrainerList from "./pages/TrainerList";
import AddTrainer from "./pages/AddTrainer";

import EditTrainer from "./pages/EditTrainer";
import SubjectList from "./pages/SubjectList";
import SubjectDetails from "./pages/SubjectDetails";
import AddSubject from "./pages/AddSubject";
import AssignTrainerSubject from "./pages/AssignTrainerSubject";
import TrainerProfile from "./pages/TrainerProfile";
import { ToastProvider } from "./components/ToastProvider";
import Preferences from "./pages/settings";

function AppContent() {
  const { subjects, trainers, refreshSubjects, refreshTrainers } = useData();

  return (
    <ToastProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trainers" element={<TrainerList trainers={trainers} refreshTrainers={refreshTrainers} />} />
          <Route path="/add-trainer" element={<AddTrainer subjects={subjects} refreshTrainers={refreshTrainers} />} />
          <Route path="/edit/:id" element={<EditTrainer />} />
          <Route path="/assign" element={<AssignTrainerSubject trainers={trainers} subjects={subjects} />} />
          <Route path="/trainer/:id" element={<TrainerProfile />} />
          <Route path="/subjects" element={<SubjectList subjects={subjects} refreshSubjects={refreshSubjects} />} />
          <Route path="/subjects/:id" element={<SubjectDetails subjects={subjects} />} />
       
          <Route path="/subject/:id" element={<SubjectDetails />} />

          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/settings" element={<Preferences />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
    </ToastProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
