import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export const DrivingTracker = ({ session }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const { data, error } = await supabase
      .from('driving_log')
      .select('*')
      .order('date', { ascending: false });
    if (!error && data) setLogs(data);
    setLoading(false);
  };

  useEffect(() => { if (session) fetchLogs(); }, [session]);

  const totalTests = logs.reduce((acc, log) => acc + (log.quantity || 0), 0);

  // --- FUNCIONES DE LÓGICA (Todas al mismo nivel) ---

  const updateQuantity = async (id, currentQty, delta) => {
    const newQty = Math.max(0, currentQty + delta);
    const { error } = await supabase.from('driving_log').update({ quantity: newQty }).eq('id', id);
    if (!error) fetchLogs(true);
  };

  const handleAddTest = async () => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = logs.find(log => log.date === today);
    if (existingLog) {
      await updateQuantity(existingLog.id, existingLog.quantity, 1);
    } else {
      await supabase.from('driving_log').insert([{ user_id: session.user.id, date: today, quantity: 1 }]);
      fetchLogs(true);
    }
  };

  const deleteLog = async (id) => {
    if (window.confirm('¿Seguro que quieres borrar esta entrada?')) {
      const { error } = await supabase.from('driving_log').delete().eq('id', id);
      if (!error) fetchLogs(true);
    }
  };

  if (loading) return <div className="loading-state">Cargando sistema...</div>;

return (
  <motion.div 
    initial={{ opacity: 0, y: 30 }} 
    animate={{ opacity: 1, y: 0 }}
    className="card-glass" /* Usamos la nueva clase aquí */
  >
    {/* CABECERA ESTILO APP PREMIUM */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="glass-icon-wrapper">
          <span style={{ fontSize: '1.4rem' }}>🚗</span>
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0 }}>Autoescuela</h2>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Progreso actual</p>
        </div>
      </div>
      <span className="badge-glass">En curso</span>
    </div>

    {/* CONTENIDO PRINCIPAL */}
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <div className="glass-number">{totalTests}</div>
      <motion.button 
        whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}
        whileTap={{ scale: 0.97 }}
        onClick={handleAddTest}
        className="primary"
        style={{ width: '100%', borderRadius: '16px', py: '15px' }}
      >
        Añadir Test Hoy
      </motion.button>
    </div>

    {/* HISTORIAL (con el mismo estilo de antes pero más limpio) */}
    <div className="history-section">
      <h3 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '15px' }}>Recientes</h3>
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <AnimatePresence mode="popLayout">
    {logs.map((log) => (
      <motion.div 
        key={log.id}
        layout
        className="log-item"
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px', 
          background: 'rgba(255, 255, 255, 0.03)', 
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <div>
          <div style={{ fontWeight: '600', fontSize: '1rem' }}>
            {new Date(log.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6366f1' }}>{log.quantity} sesiones</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* BOTONES + y - */}
          <div className="action-pill">
            <button onClick={() => updateQuantity(log.id, log.quantity, -1)}>-</button>
            <button onClick={() => updateQuantity(log.id, log.quantity, 1)} className="plus-btn">+</button>
          </div>

          {/* BOTÓN PAPELERA */}
          <button onClick={() => deleteLog(log.id)} className="delete-btn">
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