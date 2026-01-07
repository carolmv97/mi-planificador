import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export const StudyTracker = ({ session }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('');

  const fetchSessions = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setSessions(data);
    setLoading(false);
  };

  useEffect(() => { if (session) fetchSessions(); }, [session]);

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!subject || !hours) return;

    const { error } = await supabase.from('study_sessions').insert([
      { user_id: session.user.id, subject, hours: parseFloat(hours) }
    ]);

    if (!error) {
      setSubject('');
      setHours('');
      fetchSessions(true); // Actualización sin parpadeo
    }
  };

  const deleteSession = async (id) => {
    if (window.confirm('¿Borrar esta sesión?')) {
      const { error } = await supabase.from('study_sessions').delete().eq('id', id);
      if (!error) fetchSessions(true);
    }
  };

  const totalHours = sessions.reduce((acc, s) => acc + (s.hours || 0), 0);

  if (loading) return <div className="loading-state">Preparando escritorio...</div>;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-glass">
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="glass-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
            <span style={{ fontSize: '1.5rem' }}>📚</span>
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '800' }}>Estudio</h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Enfoque total</p>
          </div>
        </div>
        <span className="badge-glass" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>Focus</span>
      </div>

      {/* Contador Gigante */}
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Horas totales</p>
        <motion.div key={totalHours} className="huge-number" style={{ textShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
          {totalHours.toFixed(1)}
        </motion.div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleAddSession} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input 
          type="text" 
          placeholder="¿Qué has estudiado?" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-glass"
          style={{ width: '100%', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" 
            placeholder="Horas" 
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
          />
          <button type="submit" className="primary" style={{ margin: 0, width: 'auto', padding: '0 25px' }}>+</button>
        </div>
      </form>

      {/* Historial Corregido */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>
          Sesiones recientes
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence mode="popLayout">
            {sessions.map((s) => (
              <motion.div key={s.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="log-item">
                
                {/* Contenedor de información separado de la papelera */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: '700', fontSize: '1rem', color: 'white' }}>{s.subject}</span>
                    <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '500' }}>{s.hours} horas</span>
                  </div>
                  
                  <button onClick={() => deleteSession(s.id)} className="delete-btn" style={{ padding: '8px' }}>
                    🗑️
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};