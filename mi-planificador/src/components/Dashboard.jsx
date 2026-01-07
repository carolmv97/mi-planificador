import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2 } from 'lucide-react';


import { StudyTracker } from './StudyTracker';
import { DrivingTracker } from './DrivingTracker';

export const Dashboard = ({ session }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <DrivingTracker session={session} />
        <StudyTracker session={session} />
      </div>
    </div>
  );
};

// --- SECCIÓN: GASTOS ---

export const FinanceTracker = ({ session }) => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const fetchExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    setExpenses(data || []);
  };

  useEffect(() => { fetchExpenses(); }, [session]);

  const addExpense = async () => {
    if (!amount || !desc) return;
    const { error } = await supabase.from('expenses').insert([{ description: desc, amount: parseFloat(amount), user_id: session.user.id }]);
    if (!error) { setAmount(''); setDesc(''); fetchExpenses(); }
  };

  return (
    <div className="card">
      <h2>💰 Mis Gastos</h2>
      <div className="input-group">
        <input placeholder="Concepto" value={desc} onChange={e => setDesc(e.target.value)} />
        <input type="number" placeholder="€" value={amount} onChange={e => setAmount(e.target.value)} />
        <button className="primary" onClick={addExpense}>Guardar</button>
      </div>
      <ul className="expense-list">
        {expenses.map(e => (
          <li key={e.id} className="expense-item">
            <span>{e.description}</span> 
            <b className="price">-{e.amount}€</b>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- SECCIÓN: AGENDA (Con OWASP) ---
export const TaskTracker = ({ session }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').eq('user_id', session.user.id);
    setTasks(data || []);
  };
  useEffect(() => { fetchTasks(); }, [session]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    await supabase.from('tasks').insert([{ title: newTask, user_id: session.user.id }]);
    setNewTask(''); fetchTasks();
  };

  return (
    <div className="card">
      <h2>📅 Agenda</h2>
      <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Nueva tarea..." />
      <button onClick={addTask}>Añadir</button>
      <ul>{tasks.map(t => <li key={t.id}>{t.title}</li>)}</ul>
    </div>
  );
};

// --- SECCIÓN: SUEÑO ---
export const SleepTracker = ({ session }) => {
  const [hours, setHours] = useState('');
  const [logs, setLogs] = useState([]);

  const fetchSleep = async () => {
    const { data } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    setLogs(data || []);
  };

  useEffect(() => { fetchSleep(); }, [session]);

  const addLog = async () => {
    if (!hours || hours <= 0) return alert("Introduce un número de horas válido");
    
    const { error } = await supabase
      .from('sleep_logs')
      .insert([{ hours: parseFloat(hours), user_id: session.user.id }]);
    
    if (!error) {
      setHours('');
      fetchSleep();
    }
  };

  return (
    <div className="card">
      <h2>😴 Horas de Sueño</h2>
      <div className="input-group">
        <input 
          type="number" 
          placeholder="Horas dormidas" 
          value={hours} 
          onChange={(e) => setHours(e.target.value)} 
        />
        <button className="primary" onClick={addLog}>Registrar</button>
      </div>
      <ul style={{ marginTop: '1rem' }}>
        {logs.map(log => (
          <li key={log.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{new Date(log.created_at).toLocaleDateString()}</span>
            <b>{log.hours}h</b>
          </li>
        ))}
      </ul>
    </div>
  );
};

