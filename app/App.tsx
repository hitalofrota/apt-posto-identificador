import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Booking from './pages/Booking';
import MyAppointment from './pages/MyAppointment';
import Admin from './pages/Admin';
import { AuthProvider } from "./contexts/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agendar" element={<Booking />} />
            <Route path="/meus-agendamentos" element={<MyAppointment />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;