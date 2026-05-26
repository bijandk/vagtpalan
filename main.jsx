import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { CalendarDays, Users, Clock, Settings, Printer, Download, ChevronLeft, ChevronRight, Menu, X, Bell, UserCircle, Home, MessageSquare, Plane, BarChart3, Save, RotateCcw, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import "./style.css";

const employees = [
  { name: "Elona", initials: "E", role: "Manager / Pizzabager / Servering", weekly: 33, off: "Søn + Man", className: "emp-purple" },
  { name: "Javad", initials: "J", role: "Pizzaman", weekly: 37, off: "Torsdag", className: "emp-blue" },
  { name: "Nicol", initials: "N", role: "Pizzaman", weekly: 31, off: "Tirs + Ons", className: "emp-green" },
  { name: "Flor", initials: "F", role: "Servering", weekly: 37, off: "Fleksibel", className: "emp-orange" },
  { name: "Doma", initials: "D", role: "Service", weekly: 20, off: "Fleksibel", className: "emp-pink" },
];

const days = [
  { key: "tor", label: "TOR", date: "21/5" },
  { key: "fre", label: "FRE", date: "22/5" },
  { key: "lor", label: "LØR", date: "23/5" },
  { key: "son", label: "SØN", date: "24/5" },
  { key: "man", label: "MAN", date: "25/5" },
  { key: "tir", label: "TIR", date: "26/5" },
  { key: "ons", label: "ONS", date: "27/5" },
];

const defaultShifts = {
  Elona: { tor:["16:00–21:00\nManager / Bager / Service"], fre:["16:00–22:00\nManager / Bager / Service"], lor:["16:00–22:00\nManager / Bager / Service"], son:["FRI"], man:["FRI"], tir:["16:00–21:00\nManager / Bager / Service"], ons:["16:00–21:00\nManager / Bager / Service"] },
  Javad: { tor:["FRI"], fre:["15:00–22:00\nPizzaman"], lor:["11:00–16:00\nPizzaman","17:00–22:00\nPizzaman"], son:["15:00–21:00\nPizzaman"], man:["15:00–21:00\nPizzaman"], tir:["15:00–21:00\nPizzaman"], ons:["15:00–21:00\nPizzaman"] },
  Nicol: { tor:["15:00–21:00\nPizzaman"], fre:["15:00–22:00\nPizzaman"], lor:["17:00–22:00\nPizzaman"], son:["15:00–21:00\nPizzaman"], man:["15:00–21:00\nPizzaman"], tir:["FRI"], ons:["FRI"] },
  Flor: { tor:["16:00–21:00\nServering"], fre:["16:00–22:00\nServering"], lor:["12:00–16:00\nServering","17:00–22:00\nServering"], son:["16:00–21:00\nServering"], man:["16:00–21:00\nServering"], tir:["16:00–21:00\nServering"], ons:["16:00–21:00\nServering"] },
  Doma: { tor:["FRI"], fre:["17:00–22:00\nService"], lor:["17:00–22:00\nService"], son:["FRI"], man:["16:00–21:00\nService"], tir:["FRI"], ons:["16:00–21:00\nService"] },
};

const staffing = {
  tor: "16–17: 2 pers.\n17–21: 3 pers.",
  fre: "16–17: 2 pers.\n17–22: 5 pers.",
  lor: "12–16: 2 pers.\n16–17: 3 pers.\n17–22: 5 pers.",
  son: "16–17: 2 pers.\n17–21: 3 pers.",
  man: "16–17: 2 pers.\n17–21: 3 pers.",
  tir: "16–17: 2 pers.\n17–21: 3 pers.",
  ons: "16–17: 2 pers.\n17–21: 3 pers.",
};

const menuItems = [
  ["Oversigt", Home], ["Vagtplan", CalendarDays], ["Medarbejdere", Users],
  ["Timer & saldo", Clock], ["Beskeder", MessageSquare], ["Ferie & fridage", Plane],
  ["Statistik", BarChart3], ["Indstillinger", Settings]
];

function loadSavedShifts() {
  try {
    const saved = localStorage.getItem("surdejspizzeria-vagtplan-v2");
    return saved ? JSON.parse(saved) : defaultShifts;
  } catch {
    return defaultShifts;
  }
}

function ShiftCard({ text, className, onClick }) {
  const free = text === "FRI";
  return (
    <button className={"shift-card " + (free ? "free" : className)} onClick={onClick} title="Klik for at redigere">
      <span>{text}</span>
      {!free && <Pencil size={13} />}
    </button>
  );
}

function Sidebar({ open, setOpen }) {
  return <aside className={"sidebar " + (open ? "open" : "")}>
    <div className="brand">
      <div className="logo">🍕</div>
      <div><b>SURDEJSPIZZERIA</b><span>CITY</span></div>
      <button className="close" onClick={() => setOpen(false)}><X /></button>
    </div>
    <nav>
      {menuItems.map(([label, Icon]) => <button key={label} className={label === "Vagtplan" ? "active" : ""}><Icon size={20}/>{label}</button>)}
    </nav>
    <div className="hours">
      <b>Åbningstider – City</b>
      <p><span>Søn–Tor</span><span>16:00–21:00</span></p>
      <p><span>Fredag</span><span>16:00–22:00</span></p>
      <p><span>Lørdag</span><span>12:00–22:00</span></p>
      <b>Pizzamand møder 1 time før åbning</b>
    </div>
  </aside>
}

function EditModal({ edit, value, setValue, onSave, onClose, onDelete }) {
  if (!edit) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Rediger vagt</h2>
        <p><b>{edit.employee}</b> · {edit.dayLabel} {edit.date}</p>
        <textarea value={value} onChange={e => setValue(e.target.value)} rows={5} placeholder={"Fx: 16:00–21:00\nServering"} />
        <div className="hint">Tip: Skriv <b>FRI</b> hvis medarbejderen har fri.</div>
        <div className="modal-actions">
          <button onClick={onDelete} className="danger">Slet vagt</button>
          <button onClick={onClose}>Annuller</button>
          <button onClick={onSave} className="dark"><Save size={18}/> Gem</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("Alle");
  const [shifts, setShifts] = useState(loadSavedShifts);
  const [edit, setEdit] = useState(null);
  const [editValue, setEditValue] = useState("");

  const filteredEmployees = useMemo(() => filter === "Alle" ? employees : employees.filter(e => e.role.toLowerCase().includes(filter.toLowerCase())), [filter]);

  function copyPlan(plan) {
    return JSON.parse(JSON.stringify(plan));
  }

  function openEdit(employee, day, index, text) {
    const dayInfo = days.find(d => d.key === day);
    setEdit({ employee, day, index, dayLabel: dayInfo.label, date: dayInfo.date });
    setEditValue(text);
  }

  function saveEdit() {
    const next = copyPlan(shifts);
    next[edit.employee][edit.day][edit.index] = editValue.trim() || "FRI";
    setShifts(next);
    localStorage.setItem("surdejspizzeria-vagtplan-v2", JSON.stringify(next));
    setEdit(null);
  }

  function deleteShift() {
    const next = copyPlan(shifts);
    next[edit.employee][edit.day].splice(edit.index, 1);
    if (next[edit.employee][edit.day].length === 0) next[edit.employee][edit.day] = ["FRI"];
    setShifts(next);
    localStorage.setItem("surdejspizzeria-vagtplan-v2", JSON.stringify(next));
    setEdit(null);
  }

  function resetPlan() {
    if (confirm("Vil du nulstille vagtplanen til standard?")) {
      setShifts(defaultShifts);
      localStorage.removeItem("surdejspizzeria-vagtplan-v2");
    }
  }

  function saveAll() {
    localStorage.setItem("surdejspizzeria-vagtplan-v2", JSON.stringify(shifts));
    alert("Vagtplanen er gemt i denne browser.");
  }

  return <div className="app">
    <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}/>
    {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
    <EditModal edit={edit} value={editValue} setValue={setEditValue} onSave={saveEdit} onClose={() => setEdit(null)} onDelete={deleteShift} />
    <main>
      <header>
        <div className="title-row">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu /></button>
          <h1>Vagtplan – City</h1>
        </div>
        <div className="user-info"><Bell size={20}/> Notifikationer <UserCircle size={24}/> Hej, Elona</div>
      </header>

      <section>
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="toolbar">
          <div className="tool-left">
            <button><ChevronLeft size={18}/></button>
            <button className="date-button"><CalendarDays size={18}/> 21. maj – 20. juni 2026</button>
            <button><ChevronRight size={18}/></button>
            <button>I dag</button>
          </div>
          <div className="tool-right">
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option>Alle</option><option>Pizzaman</option><option>Servering</option><option>Service</option><option>Manager</option>
            </select>
            <button onClick={saveAll}><Save size={18}/> Gem</button>
            <button onClick={resetPlan}><RotateCcw size={18}/> Nulstil</button>
            <button onClick={() => window.print()}><Printer size={18}/> Udskriv</button>
            <button className="dark"><Download size={18}/> Eksporter</button>
          </div>
        </motion.div>

        <div className="notice">Ny funktion: Klik på en vagt for at redigere den. Gem virker i denne browser. Næste trin bliver fælles database + login.</div>

        <div className="content-grid">
          <div className="table-wrap">
            <table>
              <thead><tr><th></th>{days.map(day => <th key={day.key}>{day.label}<br/><span>{day.date}</span></th>)}</tr></thead>
              <tbody>
                {filteredEmployees.map(emp => <tr key={emp.name}>
                  <td className="emp-cell"><div className={"avatar " + emp.className}>{emp.initials}</div><div><b>{emp.name}</b><small>{emp.role}</small><small>{emp.weekly} timer/uge</small><small>Fri: {emp.off}</small></div></td>
                  {days.map(day => <td key={day.key}>{(shifts[emp.name][day.key] || []).map((s,i) => <ShiftCard key={i} text={s} className={emp.className} onClick={() => openEdit(emp.name, day.key, i, s)}/>)}</td>)}
                </tr>)}
                <tr><td><b>Planlagt bemanding</b><small>antal personer</small></td>{days.map(day => <td key={day.key} className="staffing">{staffing[day.key]}</td>)}</tr>
              </tbody>
            </table>
          </div>
          <aside className="cards">
            <div className="card"><h2>Information</h2><p>• Klik på en vagt for at redigere</p><p>• Pizzamænd møder 1 time før åbning</p><p>• Fredag & lørdag efter kl. 17: 3 pizzamænd + 2 service</p><p>• Lørdag før kl. 16: kun 2 personer</p></div>
            <div className="card"><h2>Hurtige handlinger</h2><button>Opret besked</button><button>Anmod om fri</button><button>Rediger vagter</button></div>
            <div className="card"><h2>Næste funktioner</h2><p>✅ Rediger vagter</p><p>✅ Gem i browser</p><p>⬜ Login</p><p>⬜ Fælles database</p><p>⬜ AI forslag</p></div>
          </aside>
        </div>
      </section>
    </main>
  </div>
}
