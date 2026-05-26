
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { CalendarDays, Printer, Save, RotateCcw, Pencil, Bell, UserCircle, Home, Users, Clock, MessageSquare, Plane, BarChart3, Settings, ChevronLeft, ChevronRight, Copy, Database, UploadCloud, DownloadCloud, CheckCircle2, AlertTriangle } from "lucide-react";
import "./style.css";

const SUPABASE_URL = "https://ytukfkficseisonpjlxm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xW0XlYIEUComnQR1iuWl_A_jmh4rrpI";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const employees = [
  { name: "Elona", role: "Manager / Pizzabager / Servering", weekly: 33, off: "Søn + Man", cls: "purple" },
  { name: "Javad", role: "Pizzaman", weekly: 37, off: "Torsdag", cls: "blue" },
  { name: "Nicol", role: "Pizzaman", weekly: 31, off: "Tirs + Ons", cls: "green" },
  { name: "Flor", role: "Servering", weekly: 37, off: "Fleksibel", cls: "orange" },
  { name: "Doma", role: "Service", weekly: 20, off: "Fleksibel", cls: "pink" },
];

const weeks = [
  { id: "uge1", title: "Uge 1", period: "21. maj – 27. maj", days: [["tor","TOR","21/5"],["fre","FRE","22/5"],["lor","LØR","23/5"],["son","SØN","24/5"],["man","MAN","25/5"],["tir","TIR","26/5"],["ons","ONS","27/5"]] },
  { id: "uge2", title: "Uge 2", period: "28. maj – 3. juni", days: [["tor","TOR","28/5"],["fre","FRE","29/5"],["lor","LØR","30/5"],["son","SØN","31/5"],["man","MAN","1/6"],["tir","TIR","2/6"],["ons","ONS","3/6"]] },
  { id: "uge3", title: "Uge 3", period: "4. juni – 10. juni", days: [["tor","TOR","4/6"],["fre","FRE","5/6"],["lor","LØR","6/6"],["son","SØN","7/6"],["man","MAN","8/6"],["tir","TIR","9/6"],["ons","ONS","10/6"]] },
  { id: "uge4", title: "Uge 4", period: "11. juni – 17. juni", days: [["tor","TOR","11/6"],["fre","FRE","12/6"],["lor","LØR","13/6"],["son","SØN","14/6"],["man","MAN","15/6"],["tir","TIR","16/6"],["ons","ONS","17/6"]] },
  { id: "uge5", title: "Uge 5", period: "18. juni – 20. juni", days: [["tor","TOR","18/6"],["fre","FRE","19/6"],["lor","LØR","20/6"]] }
];

const baseWeekPlan = {
  Elona: { tor:["16:00–21:00\nManager / Bager / Service"], fre:["16:00–22:00\nManager / Bager / Service"], lor:["16:00–22:00\nManager / Bager / Service"], son:["FRI"], man:["FRI"], tir:["16:00–21:00\nManager / Bager / Service"], ons:["16:00–21:00\nManager / Bager / Service"] },
  Javad: { tor:["FRI"], fre:["15:00–22:00\nPizzaman"], lor:["11:00–16:00\nPizzaman","17:00–22:00\nPizzaman"], son:["15:00–21:00\nPizzaman"], man:["15:00–21:00\nPizzaman"], tir:["15:00–21:00\nPizzaman"], ons:["15:00–21:00\nPizzaman"] },
  Nicol: { tor:["15:00–21:00\nPizzaman"], fre:["15:00–22:00\nPizzaman"], lor:["17:00–22:00\nPizzaman"], son:["15:00–21:00\nPizzaman"], man:["15:00–21:00\nPizzaman"], tir:["FRI"], ons:["FRI"] },
  Flor: { tor:["16:00–21:00\nServering"], fre:["16:00–22:00\nServering"], lor:["12:00–16:00\nServering","17:00–22:00\nServering"], son:["16:00–21:00\nServering"], man:["16:00–21:00\nServering"], tir:["16:00–21:00\nServering"], ons:["16:00–21:00\nServering"] },
  Doma: { tor:["FRI"], fre:["17:00–22:00\nService"], lor:["17:00–22:00\nService"], son:["FRI"], man:["16:00–21:00\nService"], tir:["FRI"], ons:["16:00–21:00\nService"] },
};

const defaultPlan = {
  uge1: baseWeekPlan,
  uge2: baseWeekPlan,
  uge3: baseWeekPlan,
  uge4: baseWeekPlan,
  uge5: {
    Elona: { tor:["16:00–21:00\nManager / Bager / Service"], fre:["16:00–22:00\nManager / Bager / Service"], lor:["16:00–22:00\nManager / Bager / Service"] },
    Javad: { tor:["FRI"], fre:["15:00–22:00\nPizzaman"], lor:["11:00–16:00\nPizzaman","17:00–22:00\nPizzaman"] },
    Nicol: { tor:["15:00–21:00\nPizzaman"], fre:["15:00–22:00\nPizzaman"], lor:["17:00–22:00\nPizzaman"] },
    Flor: { tor:["16:00–21:00\nServering"], fre:["16:00–22:00\nServering"], lor:["12:00–16:00\nServering","17:00–22:00\nServering"] },
    Doma: { tor:["FRI"], fre:["17:00–22:00\nService"], lor:["17:00–22:00\nService"] },
  }
};

function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }
function getSavedPlan() {
  try { return JSON.parse(localStorage.getItem("vagtplan-city-v7")) || deepCopy(defaultPlan); }
  catch { return deepCopy(defaultPlan); }
}
function parseTimeToMinutes(t) { const [h,m]=t.trim().split(":").map(Number); return h*60+(m||0); }
function calculateShiftHours(shift) {
  if (!shift || shift.toUpperCase().includes("FRI")) return 0;
  const firstLine = shift.split("\n")[0];
  const match = firstLine.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  if (!match) return 0;
  let start = parseTimeToMinutes(match[1]);
  let end = parseTimeToMinutes(match[2]);
  if (end < start) end += 24*60;
  return (end-start)/60;
}
function employeeHours(plan, employeeName, weekId=null) {
  const weekIds = weekId ? [weekId] : Object.keys(plan);
  let total = 0;
  for (const w of weekIds) {
    const empPlan = plan[w]?.[employeeName] || {};
    total += Object.values(empPlan).flat().reduce((sum, shift) => sum + calculateShiftHours(shift), 0);
  }
  return total;
}

function App() {
  const [plan, setPlan] = useState(getSavedPlan);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [filter, setFilter] = useState("Alle");
  const [edit, setEdit] = useState(null);
  const [text, setText] = useState("");
  const [syncStatus, setSyncStatus] = useState("Klar til online sync");
  const [isOnline, setIsOnline] = useState(false);

  const activeWeek = weeks[activeWeekIndex];
  const shown = filter === "Alle" ? employees : employees.filter(e => e.role.toLowerCase().includes(filter.toLowerCase()));

  const summary = useMemo(() => employees.map(emp => {
    const plannedMonth = employeeHours(plan, emp.name);
    const plannedWeek = employeeHours(plan, emp.name, activeWeek.id);
    const monthTarget = emp.weekly * (31 / 7);
    return { ...emp, plannedWeek, plannedMonth, monthTarget, diffMonth: plannedMonth - monthTarget };
  }), [plan, activeWeek.id]);

  useEffect(() => {
    localStorage.setItem("vagtplan-city-v7", JSON.stringify(plan));
  }, [plan]);

  async function loadFromDatabase(showAlert = true) {
    setSyncStatus("Henter online...");
    const { data, error } = await supabase.from("schedules").select("data").eq("id", "city-current").maybeSingle();
    if (error) {
      setIsOnline(false);
      setSyncStatus("Database fejl");
      if (showAlert) alert("Database fejl: " + error.message);
      return;
    }
    if (!data) {
      await saveToDatabase(false);
      setIsOnline(true);
      setSyncStatus("Online plan oprettet");
      if (showAlert) alert("Online plan blev oprettet.");
      return;
    }
    setPlan(data.data);
    localStorage.setItem("vagtplan-city-v7", JSON.stringify(data.data));
    setIsOnline(true);
    setSyncStatus("Hentet online");
    if (showAlert) alert("Plan hentet online.");
  }

  async function saveToDatabase(showAlert = true) {
    setSyncStatus("Gemmer online...");
    const { error } = await supabase.from("schedules").upsert({ id: "city-current", data: plan, updated_at: new Date().toISOString() });
    if (error) {
      setIsOnline(false);
      setSyncStatus("Kunne ikke gemme online");
      if (showAlert) alert("Database fejl: " + error.message);
      return false;
    }
    setIsOnline(true);
    setSyncStatus("Gemt online");
    if (showAlert) alert("Plan gemt online.");
    return true;
  }

  function openEdit(emp, day, index, value) { setEdit({ emp, day, index, weekId: activeWeek.id }); setText(value); }
  async function saveEdit() {
    const next = deepCopy(plan);
    next[edit.weekId][edit.emp][edit.day][edit.index] = text.trim() || "FRI";
    setPlan(next);
    localStorage.setItem("vagtplan-city-v7", JSON.stringify(next));
    setEdit(null);
    setSyncStatus("Ændring gemt lokalt – tryk Gem online");
  }
  function deleteShift() {
    const next = deepCopy(plan);
    next[edit.weekId][edit.emp][edit.day].splice(edit.index, 1);
    if (!next[edit.weekId][edit.emp][edit.day].length) next[edit.weekId][edit.emp][edit.day] = ["FRI"];
    setPlan(next);
    setEdit(null);
    setSyncStatus("Ændring gemt lokalt – tryk Gem online");
  }
  function resetPlan() {
    if (confirm("Nulstil hele vagtplanen?")) {
      setPlan(deepCopy(defaultPlan));
      setSyncStatus("Nulstillet lokalt – tryk Gem online");
    }
  }
  function saveLocal() {
    localStorage.setItem("vagtplan-city-v7", JSON.stringify(plan));
    alert("Gemt lokalt i denne browser.");
  }
  function copyPreviousWeek() {
    if (activeWeekIndex === 0) return alert("Du er allerede på uge 1.");
    if (!confirm("Kopier forrige uge ind i denne uge?")) return;
    const prevId = weeks[activeWeekIndex - 1].id;
    const thisId = activeWeek.id;
    const next = deepCopy(plan);
    next[thisId] = deepCopy(plan[prevId]);
    setPlan(next);
    setSyncStatus("Uge kopieret lokalt – tryk Gem online");
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
            <button onClick={() => setActiveWeekIndex(i => Math.max(0, i-1))}><ChevronLeft size={18}/> Forrige</button>
            <button className="week-title"><CalendarDays size={18}/> {activeWeek.title}: {activeWeek.period}</button>
            <button onClick={() => setActiveWeekIndex(i => Math.min(weeks.length-1, i+1))}>Næste <ChevronRight size={18}/></button>
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option>Alle</option><option>Pizzaman</option><option>Servering</option><option>Service</option><option>Manager</option>
            </select>
            <button onClick={copyPreviousWeek}><Copy size={18}/> Kopiér forrige uge</button>
            <button onClick={saveLocal}><Save size={18}/> Gem lokalt</button>
            <button onClick={resetPlan}><RotateCcw size={18}/> Nulstil</button>
            <button onClick={() => window.print()}><Printer size={18}/> Udskriv</button>
          </div>

          <div className="tabs">
            {weeks.map((w, i) => <button key={w.id} className={i === activeWeekIndex ? "selected" : ""} onClick={() => setActiveWeekIndex(i)}>{w.title}</button>)}
          </div>

          <div className="notice">V7: Online database er forbundet. Brug “Gem online” og “Hent online” mellem telefoner.</div>

          <div className={"db-panel " + (isOnline ? "online" : "")}>
            <div>{isOnline ? <CheckCircle2 size={22}/> : <Database size={22}/>}<b>{syncStatus}</b><span>Supabase: City vagtplan</span></div>
            <button onClick={() => loadFromDatabase(true)}><DownloadCloud size={18}/> Hent online</button>
            <button onClick={() => saveToDatabase(true)} className="dark"><UploadCloud size={18}/> Gem online</button>
          </div>

          <div className="summary">
            {summary.map(emp => (
              <div className="summary-card" key={emp.name}>
                <b>{emp.name}</b>
                <span>Denne uge: {emp.plannedWeek.toFixed(1)} t</span>
                <span>Hele perioden: {emp.plannedMonth.toFixed(1)} t</span>
                <span>Mål ca.: {emp.monthTarget.toFixed(1)} t</span>
                <span className={emp.diffMonth > 0 ? "over" : emp.diffMonth < 0 ? "under" : "ok"}>{emp.diffMonth > 0 ? "+" : ""}{emp.diffMonth.toFixed(1)} t</span>
              </div>
            ))}
          </div>

          <div className="grid">
            <div className="tablebox">
              <table>
                <thead><tr><th></th>{activeWeek.days.map(([key,label,date]) => <th key={key}>{label}<br/><span>{date}</span></th>)}</tr></thead>
                <tbody>
                  {shown.map(emp => (
                    <tr key={emp.name}>
                      <td className="person">
                        <div className={"avatar "+emp.cls}>{emp.name[0]}</div>
                        <div><b>{emp.name}</b><small>{emp.role}</small><small>Uge: {employeeHours(plan, emp.name, activeWeek.id).toFixed(1)} t</small><small>Fri: {emp.off}</small></div>
                      </td>
                      {activeWeek.days.map(([key]) => (
                        <td key={key}>{((plan[activeWeek.id]?.[emp.name]?.[key]) || ["FRI"]).map((shift, i) => (
                          <button key={i} onClick={() => openEdit(emp.name, key, i, shift)} className={"shift "+emp.cls}>{shift}<Pencil size={12}/></button>
                        ))}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="cards">
              <div className="card"><h2>V7 online</h2><p>• Gem online til Supabase</p><p>• Hent online på andre telefoner</p><p>• Lokal gem virker stadig</p><p>• Klar til login i næste version</p></div>
              <div className="card"><h2>Næste</h2><p>V8: login til medarbejdere og ejer/manager.</p></div>
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
            <p className="tip">Eksempel: 16:00–21:00 på første linje. Skriv FRI hvis medarbejderen har fri.</p>
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
