
import React,{useState}from"react";
import{createRoot}from"react-dom/client";
import{Clock,PlayCircle,StopCircle,Database,UploadCloud,DownloadCloud,LogOut,Lock,ShieldCheck,User,Store}from"lucide-react";
import {createClient} from "@supabase/supabase-js";
import "./style.css";

const supabase=createClient("https://ytukfkficseisonpjlxm.supabase.co","sb_publishable_xW0XlYIEUComnQR1iuWl_A_jmh4rrpI");

const users=[
{email:"admin@surdejspizza.demo",password:"demo123",name:"Admin",role:"admin"},
{email:"bijan_dk@yahoo.com",password:"demo123",name:"Bijan",role:"employee"},
{email:"elona@surdejspizza.demo",password:"demo123",name:"Elona",role:"employee"},
];

const restaurants=[
{id:"city",name:"City"},
{id:"risskov",name:"Risskov"}
];

function load(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}

function Login({onLogin}){
 const[email,setEmail]=useState("bijan_dk@yahoo.com");
 const[pw,setPw]=useState("demo123");
 const[err,setErr]=useState("");

 function submit(e){
  e.preventDefault();
  const u=users.find(x=>x.email.toLowerCase()===email.toLowerCase()&&x.password===pw);
  if(!u)return setErr("Forkert login");
  save("user-v14-3",u);
  onLogin(u);
 }

 return <div className="login">
  <div className="card">
   <h1>🍕 V14.3 Stempelur</h1>
   <form onSubmit={submit}>
    <label>Email</label>
    <input value={email} onChange={e=>setEmail(e.target.value)}/>
    <label>Kode</label>
    <input type="password" value={pw} onChange={e=>setPw(e.target.value)}/>
    {err&&<div className="err">{err}</div>}
    <button className="dark"><Lock size={18}/> Log ind</button>
   </form>

   <div className="demo">
    {users.map(u=><button key={u.email} onClick={()=>{setEmail(u.email);setPw("demo123")}}>
      {u.role==="admin"?<ShieldCheck size={15}/>:<User size={15}/>} {u.email}
    </button>)}
   </div>
  </div>
 </div>
}

function App(){
 const[user,setUser]=useState(load("user-v14-3",null));
 const[restaurant,setRestaurant]=useState(load("restaurant-v14-3","city"));
 const[records,setRecords]=useState(load("records-v14-3",[]));
 const[status,setStatus]=useState("Klar");

 if(!user)return <Login onLogin={setUser}/>;

 const isAdmin=user.role==="admin";

 const active=records.find(r=>r.employee===user.name&&r.restaurant===restaurant&&!r.end);

 const visible=isAdmin?records:records.filter(r=>r.employee===user.name);

 function logout(){
  localStorage.removeItem("user-v14-3");
  setUser(null);
 }

 function checkIn(){
  if(active)return alert("Allerede checket ind");
  const next=[{
   id:Date.now(),
   employee:user.name,
   restaurant,
   start:new Date().toISOString(),
   end:null
  },...records];
  setRecords(next);
  save("records-v14-3",next);
 }

 function checkOut(){
  const next=records.map(r=>r.id===active.id?{...r,end:new Date().toISOString()}:r);
  setRecords(next);
  save("records-v14-3",next);
 }

 function hours(r){
  if(!r.end)return 0;
  return ((new Date(r.end)-new Date(r.start))/36e5).toFixed(2);
 }

 async function saveOnline(){
  setStatus("Gemmer...");
  let {error}=await supabase.from("schedules").upsert({
   id:"surdejspizzeria-v14-3",
   data:{records},
   updated_at:new Date().toISOString()
  });
  setStatus(error?"Fejl":"Gemt online");
 }

 async function loadOnline(){
  setStatus("Henter...");
  let {data,error}=await supabase.from("schedules").select("data").eq("id","surdejspizzeria-v14-3").maybeSingle();
  if(error)return setStatus("Fejl");
  if(!data)return setStatus("Ingen data");
  setRecords(data.data.records||[]);
  save("records-v14-3",data.data.records||[]);
  setStatus("Hentet");
 }

 return <div className="app">
  <header>
   <div>
    <h1>🍕 Surdejspizzeria V14.3</h1>
    <p>{user.name} · {user.role}</p>
   </div>

   <div className="sync">
    <span><Database size={16}/> {status}</span>
    <button onClick={loadOnline}><DownloadCloud size={16}/> Hent</button>
    <button className="dark" onClick={saveOnline}><UploadCloud size={16}/> Gem</button>
    <button onClick={logout}><LogOut size={16}/> Log ud</button>
   </div>
  </header>

  <section className="restaurants">
   {restaurants.map(r=>
    <button key={r.id} className={restaurant===r.id?"active":""} onClick={()=>{
      setRestaurant(r.id);
      save("restaurant-v14-3",r.id);
    }}>
      <Store size={18}/> {r.name}
    </button>
   )}
  </section>

  <main className="panel">
   <h2><Clock size={22}/> Stempelur</h2>

   {!isAdmin&&<div className="timebox">
    <h3>Status: {active?"Checket ind":"Ikke checket ind"}</h3>

    <div className="actions">
      <button className="dark" disabled={!!active} onClick={checkIn}>
       <PlayCircle size={18}/> Check ind
      </button>

      <button className="danger" disabled={!active} onClick={checkOut}>
       <StopCircle size={18}/> Check ud
      </button>
    </div>
   </div>}

   <div className="list">
    {visible.filter(r=>r.restaurant===restaurant).map(r=>
      <div className="record" key={r.id}>
        <b>{r.employee}</b>
        <span>{r.restaurant}</span>
        <p>Start: {new Date(r.start).toLocaleString("da-DK")}</p>
        <p>Slut: {r.end?new Date(r.end).toLocaleString("da-DK"):"Aktiv"}</p>
        <strong>{hours(r)} timer</strong>
      </div>
    )}
   </div>
  </main>
 </div>
}

createRoot(document.getElementById("root")).render(<App/>);
