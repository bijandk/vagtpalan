
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import {
  CalendarDays, Clock, Database, UploadCloud, DownloadCloud, LayoutDashboard, User,
  Printer, LogOut, Lock, ShieldCheck, Eye, Plane, Repeat2, Timer, PlayCircle, StopCircle, Trash2,
  Store
} from "lucide-react";
import "./style.css";

const supabase = createClient("https://ytukfkficseisonpjlxm.supabase.co", "sb_publishable_xW0XlYIEUComnQR1iuWl_A_jmh4rrpI");

const restaurants = [
  { id: "city", name: "City", address: "Frederiksgade 52, Aarhus C" },
  { id: "risskov", name: "Risskov", address: "Skolesvinget 1A, Risskov" }
];

const demoUsers = [
  { email: "admin@surdejspizza.demo", password: "demo123", name: "Admin", role: "admin" },
  { email: "elona@surdejspizza.demo", password: "demo123", name: "Elona", role: "employee" },
  { email: "javad@surdejspizza.demo", password: "demo123", name: "Javad", role: "employee" },
  { email: "nicol@surdejspizza.demo", password: "demo123", name: "Nicol", role: "employee" },
  { email: "flor@surdejspizza.demo", password: "demo123", name: "Flor", role: "employee" },
  { email: "doma@surdejspizza.demo", password: "demo123", name: "Doma", role: "employee" },
];

const employees = [
  { name: "Elona", role: "Manager / Pizzabager / Servering", weekly: 33, cls: "purple" },
  { name: "Javad", role: "Pizzaman", weekly: 37, cls: "blue" },
  { name: "Nicol", role: "Pizzaman", weekly: 31, cls: "green" },
  { name: "Flor", role: "Servering", weekly: 37, cls: "orange" },
  { name: "Doma", role: "Service", weekly: 20, cls: "pink" },
];

const days = [
  ["tor", "Torsdag", "21/5"], ["fre", "Fredag", "22/5"], ["lor", "Lørdag", "23/5"],
  ["son", "Søndag", "24/5"], ["man", "Mandag", "25/5"], ["tir", "Tirsdag", "26/5"], ["ons", "Onsdag", "27/5"]
];

const cityPlan = {
  Elona: { tor:["16:00–21:00\nManager"], fre:["16:00–22:00\nManager"], lor:["16:00–22:00\nManager"], son:["FRI"], man:["FRI"], tir:["16:00–21:00\nManager"], ons:["16:00–21:00\nManager"] },
  Javad: { tor:["FRI"], fre:["15:00–22:00\nPizzaman"], lor:["11:00–16:00\nPizzaman","17:00–22:00\nPizzaman"], son:["15:00–21:00\nPizzaman"], man:["15:00–21:00\nPizzaman"], tir:["15:00–21:00\nPizzaman"], ons:["15:00–21:00\nPizzaman"] },
  Nicol: { tor:["15:00–21:00\nPizzaman"], fre:["15:00–22:00\nPizzaman"], lor:["17:00–22:00\nPizzaman"], son:["15:00–21:00\nPizzaman"], man:["15:00–21:00\nPizzaman"], tir:["FRI"], ons:["FRI"] },
  Flor: { tor:["16:00–21:00\nServering"], fre:["16:00–22:00\nServering"], lor:["12:00–16:00\nServering","17:00–22:00\nServering"], son:["16:00–21:00\nServering"], man:["16:00–21:00\nServering"], tir:["16:00–21:00\nServering"], ons:["16:00–21:00\nServering"] },
  Doma: { tor:["FRI"], fre:["17:00–22:00\nService"], lor:["17:00–22:00\nService"], son:["FRI"], man:["16:00–21:00\nService"], tir:["FRI"], ons:["16:00–21:00\nService"] },
};

const risskovPlan = {
  Elona: { tor:["FRI"], fre:["16:00–22:00\nManager"], lor:["12:00–20:00\nManager"], son:["FRI"], man:["FRI"], tir:["16:00–21:00\nManager"], ons:["16:00–21:00\nManager"] },
  Javad: { tor:["15:00–21:00\nPizzaman"], fre:["15:00–22:00\nPizzaman"], lor:["11:00–22:00\nPizzaman"], son:["15:00–21:00\nPizzaman"], man:["15:00–21:00\nPizzaman"], tir:["FRI"], ons:["15:00–21:00\nPizzaman"] },
  Nicol: { tor:["15:00–21:00\nPizzaman"], fre:["15:00–22:00\nPizzaman"], lor:["17:00–22:00\nPizzaman"], son:["15:00–21:00\nPizzaman"], man:["FRI"], tir:["FRI"], ons:["FRI"] },
  Flor: { tor:["16:00–21:00\nServering"], fre:["16:00–22:00\nServering"], lor:["12:00–22:00\nServering"], son:["16:00–21:00\nServering"], man:["16:00–21:00\nServering"], tir:["16:00–21:00\nServering"], ons:["16:00–21:00\nServering"] },
  Doma: { tor:["FRI"], fre:["17:00–22:00\nService"], lor:["17:00–22:00\nService"], son:["16:00–21:00\nService"], man:["FRI"], tir:["FRI"], ons:["16:00–21:00\nService"] },
};

const defaultPlans = {
  city: cityPlan,
  risskov: risskovPlan
};

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function format(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("da-DK", { dateStyle: "short", timeStyle: "short" });
}
function hours(rec) {
  if (!rec.start || !rec.end) return 0;
  return Math.max(0, (new Date(rec.end) - new Date(rec.start)) / 36e5);
}
function today() { return new Date().toISOString().slice(0, 10); }
function parseShiftHours(txt) {
  if (!txt || txt.includes("FRI")) return 0;
  const m = txt.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  if (!m) return 0;
  const toMin = t => { const [h, mm] = t.split(":").map(Number); return h * 60 + mm; };
  let a = toMin(m[1]), b = toMin(m[2]);
  if (b < a) b += 1440;
  return (b - a) / 60;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@surdejspizza.demo");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return setError("Forkert demo-login");
    save("vagtplan-user-v13", user);
    onLogin(user);
  }

  return <div className="login-page"><div className="login-card">
    <div className="login-logo">🍕</div>
    <h1>Surdejspizzeria Vagtplan</h1>
    <p>Demo-login. Ingen rigtige emails sendes.</p>
    <form onSubmit={submit}>
      <label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} />
      <label>Kode</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {error && <div className="error">{error}</div>}
      <button className="dark login-btn"><Lock size={18}/> Log ind</button>
    </form>
    <div className="demo-list">
      <b>Demo-brugere</b>
      {demoUsers.map(u => <button key={u.email} onClick={()=>{setEmail(u.email); setPassword("demo123")}}>
        {u.role === "admin" ? <ShieldCheck size={15}/> : <User size={15}/>} {u.email}
      </button>)}
    </div>
  </div></div>
}

function App() {
  const [user, setUser] = useState(load("vagtplan-user-v13", null));
  const [restaurant, setRestaurant] = useState(load("vagtplan-restaurant-v13", "city"));
  const [plans, setPlans] = useState(load("vagtplan-plans-v13", defaultPlans));
  const [timeRecords, setTimeRecords] = useState(load("vagtplan-time-v13", []));
  const [requests, setRequests] = useState(load("vagtplan-requests-v13", []));
  const [swaps, setSwaps] = useState(load("vagtplan-swaps-v13", []));
  const [view, setView] = useState("today");
  const [day, setDay] = useState("fre");
  const [status, setStatus] = useState("Klar");
  const [requestText, setRequestText] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [swapTarget, setSwapTarget] = useState("Elona");
  const [swapNote, setSwapNote] = useState("");

  if (!user) return <Login onLogin={setUser} />;

  const isAdmin = user.role === "admin";
  const plan = plans[restaurant] || defaultPlans[restaurant];
  const restaurantInfo = restaurants.find(r => r.id === restaurant);
  const visibleEmployees = isAdmin ? employees : employees.filter(e => e.name === user.name);
  const activeRecord = timeRecords.find(r => r.employee === user.name && r.restaurant === restaurant && !r.end);
  const visibleTime = (isAdmin ? timeRecords : timeRecords.filter(r => r.employee === user.name)).filter(r => r.restaurant === restaurant);
  const totalTime = visibleTime.reduce((s, r) => s + hours(r), 0);
  const shownRequests = (isAdmin ? requests : requests.filter(r => r.employee === user.name)).filter(r => r.restaurant === restaurant);
  const shownSwaps = (isAdmin ? swaps : swaps.filter(s => s.employee === user.name || s.target === user.name)).filter(s => s.restaurant === restaurant);

  function changeRestaurant(id) {
    setRestaurant(id);
    save("vagtplan-restaurant-v13", id);
  }
  function logout() {
    localStorage.removeItem("vagtplan-user-v13");
    setUser(null);
  }
  async function saveOnline() {
    if (!isAdmin) return alert("Kun admin kan gemme online.");
    setStatus("Gemmer online...");
    const payload = { plans, requests, swaps, timeRecords };
    const { error } = await supabase.from("schedules").upsert({ id: "surdejspizzeria-v13", data: payload, updated_at: new Date().toISOString() });
    if (error) return setStatus("Fejl: " + error.message);
    setStatus("Gemt online");
  }
  async function loadOnline() {
    setStatus("Henter online...");
    const { data, error } = await supabase.from("schedules").select("data").eq("id", "surdejspizzeria-v13").maybeSingle();
    if (error) return setStatus("Fejl: " + error.message);
    if (!data) return setStatus("Ingen V13 online-data endnu");
    setPlans(data.data.plans || defaultPlans);
    setRequests(data.data.requests || []);
    setSwaps(data.data.swaps || []);
    setTimeRecords(data.data.timeRecords || []);
    save("vagtplan-plans-v13", data.data.plans || defaultPlans);
    save("vagtplan-requests-v13", data.data.requests || []);
    save("vagtplan-swaps-v13", data.data.swaps || []);
    save("vagtplan-time-v13", data.data.timeRecords || []);
    setStatus("Hentet online");
  }
  function checkIn() {
    if (isAdmin) return alert("Log ind som medarbejder for at teste stempelur.");
    if (activeRecord) return alert("Du er allerede checket ind.");
    const next = [{ id: Date.now(), restaurant, employee: user.name, date: today(), start: new Date().toISOString(), end: null }, ...timeRecords];
    setTimeRecords(next); save("vagtplan-time-v13", next);
  }
  function checkOut() {
    if (!activeRecord) return alert("Du er ikke checket ind.");
    const next = timeRecords.map(r => r.id === activeRecord.id ? { ...r, end: new Date().toISOString() } : r);
    setTimeRecords(next); save("vagtplan-time-v13", next);
  }
  function deleteTime(id) {
    if (!confirm("Slet tidsregistrering?")) return;
    const next = timeRecords.filter(r => r.id !== id);
    setTimeRecords(next); save("vagtplan-time-v13", next);
  }
  function addRequest(e) {
    e.preventDefault();
    const next = [{ id: Date.now(), restaurant, employee: user.name, date: requestDate, note: requestText, status: "Afventer" }, ...requests];
    setRequests(next); save("vagtplan-requests-v13", next);
    setRequestDate(""); setRequestText("");
  }
  function updateRequest(id, status) {
    const next = requests.map(r => r.id === id ? { ...r, status } : r);
    setRequests(next); save("vagtplan-requests-v13", next);
  }
  function addSwap(e) {
    e.preventDefault();
    const next = [{ id: Date.now(), restaurant, employee: user.name, target: swapTarget, note: swapNote, status: "Afventer" }, ...swaps];
    setSwaps(next); save("vagtplan-swaps-v13", next);
    setSwapNote("");
  }
  function updateSwap(id, status) {
    const next = swaps.map(s => s.id === id ? { ...s, status } : s);
    setSwaps(next); save("vagtplan-swaps-v13", next);
  }

  return <div className="app">
    <header className="app-header">
      <div><div className="brandline">🍕 Surdejspizzeria</div><h1>Vagtplan {restaurantInfo?.name}</h1><p>{restaurantInfo?.address}</p><p>{isAdmin ? "Admin demo" : "Medarbejder demo"} · {user.email}</p></div>
      <div className="sync">
        <span><Database size={16}/> {status}</span>
        <button onClick={loadOnline}><DownloadCloud size={16}/> Hent</button>
        {isAdmin && <button className="dark" onClick={saveOnline}><UploadCloud size={16}/> Gem online</button>}
        <button onClick={logout}><LogOut size={16}/> Log ud</button>
      </div>
    </header>

    <section className="restaurant-switcher">
      {restaurants.map(r => <button key={r.id} className={restaurant === r.id ? "active" : ""} onClick={() => changeRestaurant(r.id)}>
        <Store size={18}/> {r.name}
      </button>)}
    </section>

    <nav className="view-tabs">
      <button className={view==="today"?"active":""} onClick={()=>setView("today")}><LayoutDashboard size={18}/> Dagens vagter</button>
      <button className={view==="week"?"active":""} onClick={()=>setView("week")}><CalendarDays size={18}/> Uge</button>
      <button className={view==="hours"?"active":""} onClick={()=>setView("hours")}><Clock size={18}/> Timer</button>
      <button className={view==="requests"?"active":""} onClick={()=>setView("requests")}><Plane size={18}/> Friønsker</button>
      <button className={view==="swaps"?"active":""} onClick={()=>setView("swaps")}><Repeat2 size={18}/> Vagtbytte</button>
      <button className={view==="time"?"active":""} onClick={()=>setView("time")}><Timer size={18}/> Stempelur</button>
    </nav>

    {["today","week"].includes(view) && <section className="controls">
      <select value={day} onChange={e=>setDay(e.target.value)}>
        {days.map(([k,l,d]) => <option key={k} value={k}>{l} {d}</option>)}
      </select>
      <button onClick={()=>window.print()}><Printer size={16}/> Print</button>
    </section>}

    <main>
      <div className="role-box"><Store size={20}/> <span>V13: flere restauranter er aktiv. Du ser data for {restaurantInfo?.name}.</span></div>

      {view === "today" && <section className="panel">
        <h2>Dagens vagter – {restaurantInfo?.name}</h2>
        <div className="today-list">
          {visibleEmployees.map(emp => (plan[emp.name]?.[day] || ["FRI"]).filter(x=>x!=="FRI").map((shift,i) => {
            const [time, role] = shift.split("\n");
            return <div className={"today-card " + emp.cls} key={emp.name+i}>
              <div className="avatar">{emp.name[0]}</div><div><b>{emp.name}</b><span>{time}</span><small>{role}</small></div>
            </div>
          }))}
        </div>
      </section>}

      {view === "week" && <section className="panel">
        <h2>Ugeoversigt – {restaurantInfo?.name}</h2>
        <div className="week-grid">
          {days.map(([k,l,d]) => <div className="day-card" key={k}><h3>{l} <span>{d}</span></h3>
            {visibleEmployees.map(emp => (plan[emp.name]?.[k] || ["FRI"]).filter(x=>x!=="FRI").map((shift,i)=><div className={"mini-shift "+emp.cls} key={emp.name+i}><b>{emp.name}</b><span>{shift.split("\n")[0]}</span></div>))}
          </div>)}
        </div>
      </section>}

      {view === "hours" && <section className="panel">
        <h2>Timer & saldo – {restaurantInfo?.name}</h2>
        <div className="hours-grid">
          {visibleEmployees.map(emp => {
            const planned = Object.values(plan[emp.name] || {}).flat().reduce((s,v)=>s+parseShiftHours(v),0);
            return <div className="hour-card" key={emp.name}><div className={"avatar "+emp.cls}>{emp.name[0]}</div><h3>{emp.name}</h3><p>Planlagt uge: <b>{planned.toFixed(1)} t</b></p><p>Mål: {emp.weekly} t</p></div>
          })}
        </div>
      </section>}

      {view === "time" && <section className="panel">
        <h2>Stempelur – {restaurantInfo?.name}</h2>
        {!isAdmin && <div className="timeclock-box">
          <b>Status: {activeRecord ? "Checket ind" : "Ikke checket ind"}</b>
          {activeRecord && <p>Start: {format(activeRecord.start)}</p>}
          <div className="time-actions">
            <button className="dark" disabled={!!activeRecord} onClick={checkIn}><PlayCircle size={18}/> Check ind</button>
            <button className="danger" disabled={!activeRecord} onClick={checkOut}><StopCircle size={18}/> Check ud</button>
          </div>
        </div>}
        <div className="time-summary"><b>Registreret tid</b><span>Total: {totalTime.toFixed(2)} timer</span></div>
        <div className="request-list">
          {visibleTime.length ? visibleTime.map(r => <div className="request-card" key={r.id}><div><b>{r.employee}</b><span>{r.date} · {restaurantInfo?.name}</span><p>Start: {format(r.start)}</p><p>Slut: {format(r.end)}</p><p><b>{hours(r).toFixed(2)} timer</b></p></div>{isAdmin && <button className="danger" onClick={()=>deleteTime(r.id)}><Trash2 size={16}/> Slet</button>}</div>) : <p>Ingen tidsregistreringer endnu.</p>}
        </div>
      </section>}

      {view === "requests" && <section className="panel">
        <h2>Friønsker – {restaurantInfo?.name}</h2>
        {!isAdmin && <form className="request-form" onSubmit={addRequest}><label>Dato</label><input type="date" value={requestDate} onChange={e=>setRequestDate(e.target.value)} required/><label>Kommentar</label><textarea value={requestText} onChange={e=>setRequestText(e.target.value)} /><button className="dark">Send friønske</button></form>}
        <div className="request-list">{shownRequests.length ? shownRequests.map(r=><div className="request-card" key={r.id}><div><b>{r.employee}</b><span>{r.date} · {restaurantInfo?.name}</span><p>{r.note}</p></div><strong>{r.status}</strong>{isAdmin && <div className="request-actions"><button onClick={()=>updateRequest(r.id,"Godkendt")}>Godkend</button><button onClick={()=>updateRequest(r.id,"Afvist")}>Afvis</button></div>}</div>) : <p>Ingen friønsker.</p>}</div>
      </section>}

      {view === "swaps" && <section className="panel">
        <h2>Vagtbytte – {restaurantInfo?.name}</h2>
        {!isAdmin && <form className="request-form" onSubmit={addSwap}><label>Byt med</label><select value={swapTarget} onChange={e=>setSwapTarget(e.target.value)}>{employees.filter(e=>e.name!==user.name).map(e=><option key={e.name}>{e.name}</option>)}</select><label>Kommentar</label><textarea value={swapNote} onChange={e=>setSwapNote(e.target.value)} /><button className="dark">Send vagtbytte</button></form>}
        <div className="request-list">{shownSwaps.length ? shownSwaps.map(s=><div className="request-card" key={s.id}><div><b>{s.employee} → {s.target}</b><span>{restaurantInfo?.name}</span><p>{s.note}</p></div><strong>{s.status}</strong>{isAdmin && <div className="request-actions"><button onClick={()=>updateSwap(s.id,"Godkendt")}>Godkend</button><button onClick={()=>updateSwap(s.id,"Afvist")}>Afvis</button></div>}</div>) : <p>Ingen vagtbytte.</p>}</div>
      </section>}
    </main>
  </div>
}

createRoot(document.getElementById("root")).render(<App />);
