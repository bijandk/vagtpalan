
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { CalendarDays, Save, Pencil, Clock, Database, UploadCloud, DownloadCloud, LayoutDashboard, User, ListChecks, Printer, LogOut, Lock, ShieldCheck, Eye } from "lucide-react";
import "./style.css";

const supabase = createClient("https://ytukfkficseisonpjlxm.supabase.co", "sb_publishable_xW0XlYIEUComnQR1iuWl_A_jmh4rrpI");

const demoUsers = [
  { email: "admin@surdejspizza.demo", password: "demo123", name: "Admin", role: "admin" },
  { email: "elona@surdejspizza.demo", password: "demo123", name: "Elona", role: "employee" },
  { email: "javad@surdejspizza.demo", password: "demo123", name: "Javad", role: "employee" },
  { email: "nicol@surdejspizza.demo", password: "demo123", name: "Nicol", role: "employee" },
  { email: "flor@surdejspizza.demo", password: "demo123", name: "Flor", role: "employee" },
  { email: "doma@surdejspizza.demo", password: "demo123", name: "Doma", role: "employee" },
];

const employees = [
  { name: "Elona", role: "Manager / Pizzabager / Servering", weekly: 33, off: "Søn + Man", cls: "purple" },
  { name: "Javad", role: "Pizzaman", weekly: 37, off: "Torsdag", cls: "blue" },
  { name: "Nicol", role: "Pizzaman", weekly: 31, off: "Tirs + Ons", cls: "green" },
  { name: "Flor", role: "Servering", weekly: 37, off: "Fleksibel", cls: "orange" },
  { name: "Doma", role: "Service", weekly: 20, off: "Fleksibel", cls: "pink" },
];

const weeks = [
  { id: "uge1", title: "Uge 1", period: "21. maj – 27. maj", days: [["tor","Torsdag","21/5"],["fre","Fredag","22/5"],["lor","Lørdag","23/5"],["son","Søndag","24/5"],["man","Mandag","25/5"],["tir","Tirsdag","26/5"],["ons","Onsdag","27/5"]] },
  { id: "uge2", title: "Uge 2", period: "28. maj – 3. juni", days: [["tor","Torsdag","28/5"],["fre","Fredag","29/5"],["lor","Lørdag","30/5"],["son","Søndag","31/5"],["man","Mandag","1/6"],["tir","Tirsdag","2/6"],["ons","Onsdag","3/6"]] },
  { id: "uge3", title: "Uge 3", period: "4. juni – 10. juni", days: [["tor","Torsdag","4/6"],["fre","Fredag","5/6"],["lor","Lørdag","6/6"],["son","Søndag","7/6"],["man","Mandag","8/6"],["tir","Tirsdag","9/6"],["ons","Onsdag","10/6"]] },
  { id: "uge4", title: "Uge 4", period: "11. juni – 17. juni", days: [["tor","Torsdag","11/6"],["fre","Fredag","12/6"],["lor","Lørdag","13/6"],["son","Søndag","14/6"],["man","Mandag","15/6"],["tir","Tirsdag","16/6"],["ons","Onsdag","17/6"]] },
  { id: "uge5", title: "Uge 5", period: "18. juni – 20. juni", days: [["tor","Torsdag","18/6"],["fre","Fredag","19/6"],["lor","Lørdag","20/6"]] }
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

function copy(obj) { return JSON.parse(JSON.stringify(obj)); }
function savedPlan() {
  try { return JSON.parse(localStorage.getItem("vagtplan-city-v9")) || copy(defaultPlan); }
  catch { return copy(defaultPlan); }
}
function savedUser() {
  try { return JSON.parse(localStorage.getItem("vagtplan-user-v9")) || null; }
  catch { return null; }
}
function parseHours(shift) {
  if (!shift || shift.toUpperCase().includes("FRI")) return 0;
  const line = shift.split("\n")[0];
  const m = line.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  if (!m) return 0;
  const toMin = t => { const [h,mm] = t.split(":").map(Number); return h*60+mm; };
  let a = toMin(m[1]), b = toMin(m[2]);
  if (b < a) b += 1440;
  return (b-a)/60;
}
function empHours(plan, name, weekId=null) {
  const ids = weekId ? [weekId] : Object.keys(plan);
  return ids.reduce((sum,w) => sum + Object.values(plan[w]?.[name] || {}).flat().reduce((s,v)=>s+parseHours(v),0),0);
}
function splitShift(shift) {
  const [time, ...rest] = shift.split("\n");
  return { time, role: rest.join(" ") };
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("admin@surdejspizza.demo");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  function login(e) {
    e.preventDefault();
    const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return setError("Forkert demo-email eller adgangskode");
    localStorage.setItem("vagtplan-user-v9", JSON.stringify(user));
    onLogin(user);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🍕</div>
        <h1>Surdejspizzeria Vagtplan</h1>
        <p>Demo-login til test. Ingen rigtige medarbejdere får email.</p>
        <form onSubmit={login}>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
          <label>Adgangskode</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="error">{error}</div>}
          <button className="dark login-btn"><Lock size={18}/> Log ind</button>
        </form>
        <div className="demo-list">
          <b>Demo-brugere</b>
          {demoUsers.map(u => <button key={u.email} onClick={()=>{setEmail(u.email); setPassword("demo123")}}>
            {u.role === "admin" ? <ShieldCheck size={15}/> : <User size={15}/>}{u.email}
          </button>)}
          <small>Adgangskode: demo123</small>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(savedUser);
  const [plan, setPlan] = useState(savedPlan);
  const [weekIndex, setWeekIndex] = useState(0);
  const [dayKey, setDayKey] = useState("fre");
  const [view, setView] = useState("today");
  const [selectedEmployee, setSelectedEmployee] = useState(user?.role === "employee" ? user.name : "Elona");
  const [edit, setEdit] = useState(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Klar");

  if (!user) return <LoginScreen onLogin={setUser} />;

  const isAdmin = user.role === "admin";
  const visibleEmployees = isAdmin ? employees : employees.filter(e => e.name === user.name);
  const week = weeks[weekIndex];
  const dayInfo = week.days.find(d => d[0] === dayKey) || week.days[0];

  const summary = useMemo(() => visibleEmployees.map(e => {
    const total = empHours(plan, e.name);
    const target = e.weekly * (31/7);
    return {...e, total, target, diff: total-target};
  }), [plan, user.email]);

  function logout() {
    localStorage.removeItem("vagtplan-user-v9");
    setUser(null);
  }
  function canEdit(empName) {
    return isAdmin || user.name === empName;
  }
  function openEdit(emp, weekId, d, index, value) {
    if (!canEdit(emp)) return alert("Du kan kun redigere dine egne vagter i demo-medarbejderlogin.");
    setEdit({ emp, weekId, day: d, index });
    setText(value);
  }
  function saveEdit() {
    const next = copy(plan);
    next[edit.weekId][edit.emp][edit.day][edit.index] = text.trim() || "FRI";
    setPlan(next);
    localStorage.setItem("vagtplan-city-v9", JSON.stringify(next));
    setEdit(null);
    setStatus("Gemt lokalt – husk Gem online");
  }
  function deleteShift() {
    const next = copy(plan);
    next[edit.weekId][edit.emp][edit.day].splice(edit.index, 1);
    if (!next[edit.weekId][edit.emp][edit.day].length) next[edit.weekId][edit.emp][edit.day] = ["FRI"];
    setPlan(next);
    localStorage.setItem("vagtplan-city-v9", JSON.stringify(next));
    setEdit(null);
    setStatus("Slettet lokalt – husk Gem online");
  }
  async function saveOnline() {
    if (!isAdmin) return alert("Kun admin kan gemme online i demo-versionen.");
    setStatus("Gemmer online...");
    const { error } = await supabase.from("schedules").upsert({ id: "city-current", data: plan, updated_at: new Date().toISOString() });
    if (error) return setStatus("Fejl: " + error.message);
    setStatus("Gemt online");
  }
  async function loadOnline() {
    setStatus("Henter online...");
    const { data, error } = await supabase.from("schedules").select("data").eq("id", "city-current").maybeSingle();
    if (error) return setStatus("Fejl: " + error.message);
    if (!data) return setStatus("Ingen online plan endnu");
    setPlan(data.data);
    localStorage.setItem("vagtplan-city-v9", JSON.stringify(data.data));
    setStatus("Hentet online");
  }

  const currentDayShifts = visibleEmployees.flatMap(emp => {
    const shifts = plan[week.id]?.[emp.name]?.[dayInfo[0]] || ["FRI"];
    return shifts.map((shift, index) => ({ emp, shift, index }));
  }).filter(x => x.shift !== "FRI");

  const employeeOptions = isAdmin ? employees : employees.filter(e => e.name === user.name);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <div className="brandline">🍕 Surdejspizzeria</div>
          <h1>Vagtplan City</h1>
          <p>{isAdmin ? "Admin demo" : "Medarbejder demo"} · {user.email}</p>
        </div>
        <div className="sync">
          <span><Database size={16}/> {status}</span>
          <button onClick={loadOnline}><DownloadCloud size={16}/> Hent</button>
          {isAdmin && <button className="dark" onClick={saveOnline}><UploadCloud size={16}/> Gem online</button>}
          <button onClick={logout}><LogOut size={16}/> Log ud</button>
        </div>
      </header>

      <nav className="view-tabs">
        <button className={view==="today" ? "active" : ""} onClick={()=>setView("today")}><LayoutDashboard size={18}/> Dagens vagter</button>
        <button className={view==="week" ? "active" : ""} onClick={()=>setView("week")}><CalendarDays size={18}/> Uge</button>
        <button className={view==="employee" ? "active" : ""} onClick={()=>setView("employee")}><User size={18}/> Medarbejder</button>
        <button className={view==="hours" ? "active" : ""} onClick={()=>setView("hours")}><Clock size={18}/> Timer</button>
      </nav>

      <section className="controls">
        <select value={weekIndex} onChange={e=>setWeekIndex(Number(e.target.value))}>
          {weeks.map((w,i)=><option key={w.id} value={i}>{w.title} – {w.period}</option>)}
        </select>
        <select value={dayKey} onChange={e=>setDayKey(e.target.value)}>
          {week.days.map(([k,l,d])=><option key={k} value={k}>{l} {d}</option>)}
        </select>
        <button onClick={()=>window.print()}><Printer size={16}/> Print</button>
      </section>

      <main>
        <div className="role-box">
          {isAdmin ? <ShieldCheck size={20}/> : <Eye size={20}/>}
          <span>{isAdmin ? "Admin kan se og redigere alle vagter." : "Medarbejder ser kun egne vagter i denne demo."}</span>
        </div>

        {view === "today" && (
          <section className="panel">
            <div className="panel-title"><ListChecks size={22}/><div><h2>{dayInfo[1]} {dayInfo[2]}</h2><p>{isAdmin ? "Alle dagens vagter" : "Dine vagter denne dag"}</p></div></div>
            <div className="today-list">
              {currentDayShifts.length ? currentDayShifts.map((item,i)=>{
                const s = splitShift(item.shift);
                return <button key={i} className={"today-card "+item.emp.cls} onClick={()=>openEdit(item.emp.name, week.id, dayInfo[0], item.index, item.shift)}>
                  <div className="avatar">{item.emp.name[0]}</div>
                  <div><b>{item.emp.name}</b><span>{s.time}</span><small>{s.role}</small></div>
                  <Pencil size={16}/>
                </button>
              }) : <p>Ingen vagter denne dag.</p>}
            </div>
          </section>
        )}

        {view === "week" && (
          <section className="panel">
            <h2>{week.title} – {week.period}</h2>
            <div className="week-grid">
              {week.days.map(([k,l,d]) => (
                <div className="day-card" key={k}>
                  <h3>{l} <span>{d}</span></h3>
                  {visibleEmployees.map(emp => (plan[week.id]?.[emp.name]?.[k] || ["FRI"]).filter(x=>x!=="FRI").map((shift,index) => {
                    const s = splitShift(shift);
                    return <button key={emp.name+index} className={"mini-shift "+emp.cls} onClick={()=>openEdit(emp.name, week.id, k, index, shift)}>
                      <b>{emp.name}</b><span>{s.time}</span>
                    </button>
                  }))}
                </div>
              ))}
            </div>
          </section>
        )}

        {view === "employee" && (
          <section className="panel">
            <div className="employee-head">
              <select value={selectedEmployee} onChange={e=>setSelectedEmployee(e.target.value)} disabled={!isAdmin}>
                {employeeOptions.map(e=><option key={e.name}>{e.name}</option>)}
              </select>
              <b>{empHours(plan, selectedEmployee).toFixed(1)} timer i perioden</b>
            </div>
            <div className="employee-list">
              {weeks.map(w => w.days.map(([k,l,d]) => (plan[w.id]?.[selectedEmployee]?.[k] || ["FRI"]).map((shift,index) => (
                <button key={w.id+k+index} className="employee-shift" onClick={()=>openEdit(selectedEmployee, w.id, k, index, shift)}>
                  <span>{w.title} · {l} {d}</span>
                  <b>{shift}</b>
                </button>
              ))))}
            </div>
          </section>
        )}

        {view === "hours" && (
          <section className="panel">
            <h2>Timer & saldo</h2>
            <div className="hours-grid">
              {summary.map(e => (
                <div className="hour-card" key={e.name}>
                  <div className={"avatar "+e.cls}>{e.name[0]}</div>
                  <h3>{e.name}</h3>
                  <p>Planlagt: <b>{e.total.toFixed(1)} t</b></p>
                  <p>Mål ca.: {e.target.toFixed(1)} t</p>
                  <strong className={e.diff>0 ? "over" : "under"}>{e.diff>0?"+":""}{e.diff.toFixed(1)} t</strong>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {edit && (
        <div className="modalbg">
          <div className="modal">
            <h2>Rediger vagt</h2>
            <p><b>{edit.emp}</b></p>
            <textarea rows="5" value={text} onChange={e=>setText(e.target.value)} />
            <p>Skriv fx: 16:00–21:00 på første linje. Skriv FRI for fridag.</p>
            <div className="actions">
              <button className="danger" onClick={deleteShift}>Slet</button>
              <button onClick={()=>setEdit(null)}>Annuller</button>
              <button className="dark" onClick={saveEdit}>Gem</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
