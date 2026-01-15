import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./components/AppLayout";
import TrainerList from "./pages/TrainerList";
import AddTrainer from "./pages/AddTrainer";
import SubjectList from "./pages/SubjectList";
import SubjectDetails from "./pages/SubjectDetails";
import AddSubject from "./pages/AddSubject";
import AssignTrainerSubject from "./pages/AssignTrainerSubject";
import TrainerProfile from "./pages/TrainerProfile";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
       
        <Routes>
        
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/trainers" element={<TrainerList />} />
            <Route path="/add-trainer" element={<AddTrainer />} />
            {/* <Route path="/edit/:id" element={<EditTrainer />} /> */}
            <Route path="/assign" element={<AssignTrainerSubject />} />
            <Route path="/trainer/:id" element={<TrainerProfile />} />
            <Route path="/subjects" element={<SubjectList />} />
            
        <Route path="/subjects/:id" element={<SubjectDetails />} />
            <Route path="/add-subject" element={<AddSubject />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
