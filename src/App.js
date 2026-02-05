import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { ToastProvider } from "./components/ToastProvider";
import AppLayout from './components/AppLayout';
import LandingPage from './pages/LandingPage';
import TrainerList from './pages/TrainerList';
import Preferences from "./pages/settings";
import Notifications from "./pages/Notifications";
import TrainerProfile from "./pages/TrainerProfile";
import TopicManagement from "./pages/TopicManagement";
import TopicsPage from "./pages/TopicsPage";
import AddTrainer from "./pages/AddTrainer";
import EditTrainer from "./pages/EditTrainer";
import SubjectList from "./pages/SubjectList";
import SubjectDetails from "./pages/SubjectDetails";
import AddSubject from "./pages/AddSubject";
import AssignTrainerSubject from "./pages/AssignTrainerSubject";

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
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/settings" element={<Preferences />} />
          <Route path="/manage-topics" element={<TopicManagement />} />
          <Route path="/topics" element={<TopicsPage />} />
        </Route>
      </Routes>
   
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
