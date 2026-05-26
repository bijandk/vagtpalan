
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { CalendarDays, Printer, Save, RotateCcw, Pencil, Bell, UserCircle, Home, Users, Clock, MessageSquare, Plane, BarChart3, Settings } from "lucide-react";
import "./style.css";

const employees = [
  { name: "Elona", role: "Manager / Pizzabager / Servering", weekly: 33, off: "Søn + Man", cls: "purple" },
  { name: "Javad", role: "Pizzaman", weekly: 37, off: "Torsdag", cls: "blue" },
  { name: "Nicol", role: "Pizzaman", weekly: 31, off: "Tirs + Ons", cls: "green" },
  { name: "Flor", role: "Servering", weekly: 37, off: "Fleksibel", cls: "orange" },
  { name: "Doma", role: "Service", weekly: 20, off: "Fleksibel", cls: "pink" },
];

const days = [
  ["tor", "TOR", "21/5"],
  ["fre", "FRE", "22/5"],
  ["lor", "LØR", "23/5"],
  ["son", "SØN", "24/5"],
  ["man", "MAN", "25/5"],
  ["tir", "TIR", "26/5"],
  ["ons", "ONS", "27/5"],
];

const defaultPlan = {
  Elona: { tor:["16:00–21:00\nManager / Bager / Service"], fre:["16:00–22:00\nManager / Bager / Service"], lor:["16:00–22:00\nManager / Bager / Service"], son:["FRI"], man:["FRI"], tir:["16:00–21:00\nManager / Bager / Service"], ons:["16:00–21:00\nManager / Bager / Service"] },
  Javad: { tor:["FRI"], fre:["15:00–22:00\nPizzaman"], lor:["11:00–16:00\nPizzaman","17:00–22:00\nPizzaman"], son:["15:00–21:00\nPizzaman"], man:["15:00–21:00\nPizzaman"], tir:["15:00–21:00\nPizzaman"], ons:["15:00–21:00\nPizzaman"] },
  Nicol: { tor:["15:00–21:00\nPizzaman"], fre:["15:00–22:00\nPizzaman"], lor:["17:00–22:00\nPizzaman"], son:["15:00–21:00\nPizzaman"], man:["15:00–21:00\nPizzaman"], tir:["FRI"], ons:["FRI"] },
  Flor: { tor:["16:00–21:00\nServering"], fre:["16:00–22:00\nServering"], lor:["12:00–16:00\nServering","17:00–22:00\nServering"], son:["16:00–21:00\nServering"], man:["16:00–21:00\nServering"], tir:["16:00–21:00\nServering"], ons:["16:00–21:00\nServering"] },
  Doma: { tor:["FRI"], fre:["17:00–22:00\nService"], lor:["17:00–22:00\nService"], son:["FRI"], man:["16:00–21:00\nService"], tir:["FRI"], ons:["16:00–21:00\nService"] },
};

function getSavedPlan() {
  try {
    return JSON.parse(localStorage.getItem("vagtplan-city-v3")) || defaultPlan;
  } catch {
    return defaultPlan;
  }
}

function App() {
  const [plan, setPlan] = useState(getSavedPlan);
  const [filter, setFilter] = useState("Alle");
  const [edit, setEdit] = useState(null);
  const [text, setText] = useState("");

  const shown = filter === "Alle" ? employees : employees.filter(e => e.role.toLowerCase().includes(filter.toLowerCase()));

  function openEdit(emp, day, index, value) {
    setEdit({ emp, day, index });
    setText(value);
  }

  function saveEdit() {
    const next = JSON.parse(JSON.stringify(plan));
    next[edit.emp][edit.day][edit.index] = text.trim() || "FRI";
    setPlan(next);
    localStorage.setItem("vagtplan-city-v3", JSON.stringify(next));
    setEdit(null);
  }

  function deleteShift() {
    const next = JSON.parse(JSON.stringify(plan));
    next[edit.emp][edit.day].splice(edit.index, 1);
    if (!next[edit.emp][edit.day].length) next[edit.emp][edit.day] = ["FRI"];
    setPlan(next);
    localStorage.setItem("vagtplan-city-v3", JSON.stringify(next));
    setEdit(null);
  }

  function resetPlan() {
    if (confirm("Nulstil vagtplanen?")) {
      setPlan(defaultPlan);
      localStorage.removeItem("vagtplan-city-v3");
    }
  }

  function savePlan() {
    localStorage.setItem("vagtplan-city-v3", JSON.stringify(plan));
    alert("Gemt i denne browser.");
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand"><div className="pizza">🍕</div><div><b>SURDEJSPIZZERIA</b><span>CITY</span></div></div>
        <nav>
          {[[Home,"Oversigt"],[CalendarDays,"Vagtplan"],[Users,"Medarbejdere"],[Clock,"Timer & saldo"],[MessageSquare,"Beskeder"],[Plane,"Ferie & fridage"],[BarChart3,"Statistik"],[Settings,"Indstillinger"]].map(([Icon,label]) => (
            <button className={label==="Vagtplan" ? "active" : ""} key={label}><Icon size={20}/>{label}</button>
          ))}
        </nav>
        <div className="hours">
          <b>Åbningstider – City</b>
          <p><span>Søn–Tor</span><span>16:00–21:00</span></p>
          <p><span>Fredag</span><span>16:00–22:00</span></p>
          <p><span>Lørdag</span><span>12:00–22:00</span></p>
          <b>Pizzamand møder 1 time før åbning</b>
        </div>
      </aside>

      <main>
        <header>
          <h1>Vagtplan – City</h1>
          <div className="top"><Bell size={20}/> Notifikationer <UserCircle size={24}/> Hej, Elona</div>
        </header>

        <section>
          <div className="toolbar">
            <button><CalendarDays size={18}/> 21. maj – 20. juni 2026</button>
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option>Alle</option><option>Pizzaman</option><option>Servering</option><option>Service</option><option>Manager</option>
            </select>
            <button onClick={savePlan}><Save size={18}/> Gem</button>
            <button onClick={resetPlan}><RotateCcw size={18}/> Nulstil</button>
            <button onClick={() => window.print()}><Printer size={18}/> Udskriv</button>
          </div>

          <div className="notice">V3 FIXED: Klik på en vagt for at redigere. Hvis du kan se denne blå boks, er den rigtige version online.</div>

          <div className="grid">
            <div className="tablebox">
              <table>
                <thead>
                  <tr><th></th>{days.map(([key,label,date]) => <th key={key}>{label}<br/><span>{date}</span></th>)}</tr>
                </thead>
                <tbody>
                  {shown.map(emp => (
                    <tr key={emp.name}>
                      <td className="person">
                        <div className={"avatar "+emp.cls}>{emp.name[0]}</div>
                        <div><b>{emp.name}</b><small>{emp.role}</small><small>{emp.weekly} timer/uge</small><small>Fri: {emp.off}</small></div>
                      </td>
                      {days.map(([key]) => (
                        <td key={key}>
                          {(plan[emp.name][key] || ["FRI"]).map((shift, i) => (
                            <button key={i} onClick={() => openEdit(emp.name, key, i, shift)} className={"shift "+emp.cls}>
                              {shift}<Pencil size={12}/>
                            </button>
                          ))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="cards">
              <div className="card"><h2>Information</h2><p>• Klik på en vagt for at redigere</p><p>• Fredag/lørdag efter kl. 17: 3 pizzamænd + 2 service</p><p>• Lørdag før kl. 16: 2 personer</p></div>
              <div className="card"><h2>Næste funktioner</h2><p>✅ Rediger vagter</p><p>✅ Gem i browser</p><p>⬜ Login</p><p>⬜ Database</p></div>
            </aside>
          </div>
        </section>
      </main>

      {edit && (
        <div className="modalbg">
          <div className="modal">
            <h2>Rediger vagt</h2>
            <p><b>{edit.emp}</b></p>
            <textarea rows="5" value={text} onChange={e => setText(e.target.value)} />
            <p className="tip">Skriv FRI hvis medarbejderen har fri.</p>
            <div className="actions">
              <button className="danger" onClick={deleteShift}>Slet</button>
              <button onClick={() => setEdit(null)}>Annuller</button>
              <button className="dark" onClick={saveEdit}>Gem</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
