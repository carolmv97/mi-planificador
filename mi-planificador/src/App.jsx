import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import './App.css';

// ✅ Solo importamos lo que vamos a usar
import { DrivingTracker } from './components/DrivingTracker';
import { StudyTracker } from './components/StudyTracker'; 

export default function App() {
  const [session, setSession] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!initialized) return <div style={{color: 'white'}}>Cargando sistema...</div>;

  if (!session) return <Auth />;

  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <h2 className="logo">Planner Pro</h2>
          <nav className="menu-links">
            {/* ✅ Solo dos botones en el menú */}
            <NavLink to="/driving" className="nav-btn">🚗 Coche</NavLink>
            <NavLink to="/study" className="nav-btn">📚 Estudio</NavLink>
          </nav>
          <button onClick={() => supabase.auth.signOut()} className="logout-btn">
            Salir
          </button>
        </aside>

        <main className="main-content">
          <Routes>
            {/* ✅ Solo dos rutas disponibles */}
            <Route path="/driving" element={<DrivingTracker session={session} />} />
            <Route path="/study" element={<StudyTracker session={session} />} />
            
            {/* ✅ Redirección por defecto a Coche */}
            <Route path="*" element={<Navigate to="/driving" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}