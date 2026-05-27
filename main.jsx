
import React,{useEffect,useRef,useState}from"react";
import{createRoot}from"react-dom/client";
import{createClient}from"@supabase/supabase-js";
import{Store,Database,DownloadCloud,UploadCloud,LogOut,Lock,ShieldCheck,User,CalendarDays,LayoutDashboard,Clock,Pencil,Save,Trash2,X,Plus,UserPlus}from"lucide-react";
import"./style.css";

const supabase=createClient("https://ytukfkficseisonpjlxm.supabase.co","sb_publishable_xW0XlYIEUComnQR1iuWl_A_jmh4rrpI");

const restaurants=[{id:"city",name:"City",address:"Frederiksgade 52"},{id:"risskov",name:"Risskov",address:"Skolesvinget 1A"}];
const baseUsers=[
 {email:"admin@surdejspizza.demo",password:"demo123",name:"Admin",role:"admin"},
 {email:"elona@surdejspizza.demo",password:"demo123",name:"Elona",role:"employee"},
 {email:"javad@surdejspizza.demo",password:"demo123",name:"Javad",role:"employee"},
 {email:"nicol@surdejspizza.demo",password:"demo123",name:"Nicol",role:"employee"},
 {email:"flor@surdejspizza.demo",password:"demo123",name:"Flor",role:"employee"},
 {email:"doma@surdejspizza.demo",password:"demo123",name:"Doma",role:"employee"},
 {email:"bijan_dk@yahoo.com",password:"demo123",name:"Bijan",role:"employee"}
];
const baseEmployees=[
 {name:"Elona",role:"Manager / Pizza / Service",weekly:33,cls:"purple"},
 {name:"Javad",role:"Pizzaman",weekly:37,cls:"blue"},
 {name:"Nicol",role:"Pizzaman",weekly:31,cls:"green"},
 {name:"Flor",role:"Servering",weekly:37,cls:"orange"},
 {name:"Doma",role:"Service",weekly:20,cls:"pink"},
 {name:"Bijan",role:"Pizzaman",weekly:37,cls:"teal"}
];
const days=[["tor","Tor","21/5"],["fre","Fre","22/5"],["lor","Lør","23/5"],["son","Søn","24/5"],["man","Man","25/5"],["tir","Tir","26/5"],["ons","Ons","27/5"]];
const colors=["purple","blue","green","orange","pink","teal"];

function makePlan(employees=baseEmployees){
 let p={};
 employees.forEach(emp=>{
  p[emp.name]={tor:["FRI"],fre:["16:00–22:00\n"+emp.role],lor:["16:00–22:00\n"+emp.role],son:["FRI"],man:["FRI"],tir:["16:00–21:00\n"+emp.role],ons:["16:00–21:00\n"+emp.role]};
 });
 p.Elona={tor:["16:00–21:00\nManager"],fre:["16:00–22:00\nManager"],lor:["16:00–22:00\nManager"],son:["FRI"],man:["FRI"],tir:["16:00–21:00\nManager"],ons:["16:00–21:00\nManager"]};
 p.Javad={tor:["FRI"],fre:["15:00–22:00\nPizzaman"],lor:["11:00–16:00\nPizzaman","17:00–22:00\nPizzaman"],son:["15:00–21:00\nPizzaman"],man:["15:00–21:00\nPizzaman"],tir:["15:00–21:00\nPizzaman"],ons:["15:00–21:00\nPizzaman"]};
 return p;
}
const defaultPlans={city:makePlan(),risskov:makePlan()};

function load(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function calcHours(t){if(!t||t==="FRI")return 0;let m=t.match(/(\d\d?:\d\d)\s*[–-]\s*(\d\d?:\d\d)/);if(!m)return 0;let to=x=>{let[a,b]=x.split(":").map(Number);return a*60+b};let a=to(m[1]),b=to(m[2]);if(b<a)b+=1440;return(b-a)/60}

function Login({onLogin,users}){
 const[email,setEmail]=useState("admin@surdejspizza.demo"),[pw,setPw]=useState("demo123"),[err,setErr]=useState("");
 function go(e){e.preventDefault();let u=users.find(x=>x.email.toLowerCase()===email.toLowerCase()&&x.password===pw);if(!u)return setErr("Forkert login");save("user-v14-4a",u);onLogin(u)}
 return <div className="login"><div className="card"><div className="logo">🍕</div><h1>Surdejspizzeria</h1><p>V14.4a demo-login</p><form onSubmit={go}><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)}/><label>Kode</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)}/>{err&&<div className="err">{err}</div>}<button className="dark"><Lock size={18}/> Log ind</button></form><div className="demo">{users.map(u=><button key={u.email} onClick={()=>{setEmail(u.email);setPw(u.password||"demo123")}}>{u.role==="admin"?<ShieldCheck size={15}/>:<User size={15}/>} {u.email}</button>)}</div></div></div>
}

function App(){
 const[employees,setEmployees]=useState(load("employees-v14-4a",baseEmployees));
 const[users,setUsers]=useState(load("users-v14-4a",baseUsers));
 const[user,setUser]=useState(load("user-v14-4a",null));
 const[restaurant,setRestaurant]=useState(load("restaurant-v14-4a","city"));
 const[plans,setPlans]=useState(load("plans-v14-4a",defaultPlans));
 const[view,setView]=useState("week");
 const[day,setDay]=useState("fre");
 const[status,setStatus]=useState("Klar");
 const[edit,setEdit]=useState(null);
 const[text,setText]=useState("");
 const[addEmp,setAddEmp]=useState(false);
 const[newEmp,setNewEmp]=useState({name:"",email:"",role:"Pizzaman",weekly:37});
 const didMount=useRef(false);
 const saveTimer=useRef(null);

 useEffect(()=>{
  save("plans-v14-4a",plans);
  save("employees-v14-4a",employees);
  save("users-v14-4a",users);
  if(!didMount.current){didMount.current=true;return}
  if(!user||user.role!=="admin")return;
  setStatus("Auto-gemmer...");
  clearTimeout(saveTimer.current);
  saveTimer.current=setTimeout(async()=>{
   let data={plans,employees,users};
   let {error}=await supabase.from("schedules").upsert({id:"surdejspizzeria-v14-4a",data,updated_at:new Date().toISOString()});
   setStatus(error?"Auto-gem fejl":"Auto-gemt online");
  },1200);
  return()=>clearTimeout(saveTimer.current);
 },[plans,employees,users]);

 if(!user)return <Login onLogin={setUser} users={users}/>;
 const isAdmin=user.role==="admin", plan=plans[restaurant]||{}, visible=isAdmin?employees:employees.filter(e=>e.name===user.name), info=restaurants.find(r=>r.id===restaurant);

 function logout(){localStorage.removeItem("user-v14-4a");setUser(null)}
 function open(emp,d,i,val){if(!isAdmin&&emp!==user.name)return alert("Du kan kun redigere dine egne vagter");setEdit({emp,d,i});setText(val)}
 function addShift(emp,d){if(!isAdmin&&emp!==user.name)return alert("Du kan kun tilføje egne vagter");let n=JSON.parse(JSON.stringify(plans));if(!n[restaurant])n[restaurant]={};if(!n[restaurant][emp])n[restaurant][emp]={};if(!n[restaurant][emp][d]||n[restaurant][emp][d][0]==="FRI")n[restaurant][emp][d]=["16:00–21:00\nNy vagt"];else n[restaurant][emp][d].push("16:00–21:00\nNy vagt");setPlans(n);let idx=n[restaurant][emp][d].length-1;open(emp,d,idx,n[restaurant][emp][d][idx])}
 function saveEdit(){let n=JSON.parse(JSON.stringify(plans));n[restaurant][edit.emp][edit.d][edit.i]=text.trim()||"FRI";setPlans(n);setEdit(null);setStatus("Gemt lokalt")}
 function del(){let n=JSON.parse(JSON.stringify(plans));n[restaurant][edit.emp][edit.d].splice(edit.i,1);if(!n[restaurant][edit.emp][edit.d].length)n[restaurant][edit.emp][edit.d]=["FRI"];setPlans(n);setEdit(null);setStatus("Slettet lokalt")}
 function createEmployee(e){
  e.preventDefault();
  if(!newEmp.name||!newEmp.email)return alert("Navn og email mangler");
  if(employees.some(x=>x.name.toLowerCase()===newEmp.name.toLowerCase()))return alert("Medarbejder findes allerede");
  const cls=colors[employees.length%colors.length];
  const emp={name:newEmp.name.trim(),email:newEmp.email.trim(),role:newEmp.role,weekly:Number(newEmp.weekly)||37,cls};
  const nextEmp=[...employees,emp];
  const nextUsers=[...users,{email:emp.email,password:"demo123",name:emp.name,role:"employee"}];
  let nextPlans=JSON.parse(JSON.stringify(plans));
  restaurants.forEach(r=>{
   if(!nextPlans[r.id])nextPlans[r.id]={};
   nextPlans[r.id][emp.name]={tor:["FRI"],fre:["16:00–22:00\n"+emp.role],lor:["16:00–22:00\n"+emp.role],son:["FRI"],man:["FRI"],tir:["16:00–21:00\n"+emp.role],ons:["16:00–21:00\n"+emp.role]};
  });
  setEmployees(nextEmp);setUsers(nextUsers);setPlans(nextPlans);
  
  setNewEmp({name:"",email:"",role:"Pizzaman",weekly:37});setAddEmp(false);setStatus("Medarbejder tilføjet");
 }
 async function loadOnline(){setStatus("Henter...");let{data,error}=await supabase.from("schedules").select("data").eq("id","surdejspizzeria-v14-4a").maybeSingle();if(error)return setStatus("Fejl: "+error.message);if(!data)return setStatus("Ingen online data");setPlans(data.data.plans||defaultPlans);setEmployees(data.data.employees||baseEmployees);setUsers(data.data.users||baseUsers);save("plans-v14-4a",data.data.plans||defaultPlans);save("employees-v14-4a",data.data.employees||baseEmployees);save("users-v14-4a",data.data.users||baseUsers);setStatus("Hentet online")}

 return <div className="app">
  <header><div><b>🍕 Surdejspizzeria</b><h1>Vagtplan {info.name}</h1><p>{info.address} · V14.4a auto-gem · {user.email}</p></div><div className="sync"><span><Database size={16}/> {status}</span><button onClick={loadOnline}><DownloadCloud size={16}/> Hent</button><button onClick={logout}><LogOut size={16}/> Log ud</button></div></header>
  <section className="switch">{restaurants.map(r=><button className={restaurant===r.id?"active":""} key={r.id} onClick={()=>{setRestaurant(r.id);save("restaurant-v14-4a",r.id)}}><Store size={18}/> {r.name}</button>)}</section>
  <nav><button className={view==="today"?"active":""} onClick={()=>setView("today")}><LayoutDashboard size={18}/> Dagens vagter</button><button className={view==="week"?"active":""} onClick={()=>setView("week")}><CalendarDays size={18}/> Visuel ugeplan</button><button className={view==="hours"?"active":""} onClick={()=>setView("hours")}><Clock size={18}/> Timer</button>{isAdmin&&<button onClick={()=>setAddEmp(true)}><UserPlus size={18}/> Tilføj medarbejder</button>}</nav>
  {view==="today"&&<section className="controls"><select value={day} onChange={e=>setDay(e.target.value)}>{days.map(([k,l,d])=><option key={k} value={k}>{l} {d}</option>)}</select></section>}
  <div className="note"><UserPlus size={19}/> V14.4a: Ændringer gemmes automatisk lokalt og online for admin. Hent-knappen bevares.</div>
  {view==="week"&&<main className="panel"><h2>Visuel ugeplan</h2><div className="grid"><div className="head emp">Medarbejder</div>{days.map(([k,l,d])=><div className="head" key={k}>{l}<span>{d}</span></div>)}{visible.map(emp=><React.Fragment key={emp.name}><div className="empbox"><div className={"avatar "+emp.cls}>{emp.name[0]}</div><div><b>{emp.name}</b><small>{emp.role}</small></div></div>{days.map(([k])=><div className="cell" key={emp.name+k}>{(plan[emp.name]?.[k]||["FRI"]).map((s,i)=>s==="FRI"?<button className="add" key={i} onClick={()=>addShift(emp.name,k)}>+ Tilføj</button>:<button className={"pill "+emp.cls} key={i} onClick={()=>open(emp.name,k,i,s)}><b>{s.split("\n")[0]}</b><small>{s.split("\n")[1]}</small><Pencil size={13}/></button>)}{(plan[emp.name]?.[k]||["FRI"])[0]!=="FRI"&&<button className="add small" onClick={()=>addShift(emp.name,k)}>+</button>}</div>)}</React.Fragment>)}</div></main>}
  {view==="today"&&<main className="panel"><h2>Dagens vagter</h2><div className="cards">{visible.map(emp=>(plan[emp.name]?.[day]||["FRI"]).filter(x=>x!=="FRI").map((s,i)=><button className={"cardshift "+emp.cls} key={emp.name+i} onClick={()=>open(emp.name,day,i,s)}><div className="avatar">{emp.name[0]}</div><div><b>{emp.name}</b><span>{s.split("\n")[0]}</span><small>{s.split("\n")[1]}</small></div><Pencil size={16}/></button>))}</div></main>}
  {view==="hours"&&<main className="panel"><h2>Timer</h2><div className="hours">{visible.map(emp=>{let h=Object.values(plan[emp.name]||{}).flat().reduce((a,b)=>a+calcHours(b),0);return <div className="hour" key={emp.name}><div className={"avatar "+emp.cls}>{emp.name[0]}</div><h3>{emp.name}</h3><p>Planlagt: <b>{h.toFixed(1)} t</b></p><p>Mål: {emp.weekly} t</p></div>})}</div></main>}
  {edit&&<div className="modalbg"><div className="modal"><div className="modaltop"><h2>Rediger vagt</h2><button onClick={()=>setEdit(null)}><X size={18}/></button></div><p><b>{edit.emp}</b> · {days.find(x=>x[0]===edit.d)?.[1]}</p><textarea rows="5" value={text} onChange={e=>setText(e.target.value)}/><p className="hint">Skriv fx 16:00–21:00 på første linje og rolle på anden linje.</p><div className="actions"><button className="danger" onClick={del}><Trash2 size={16}/> Slet</button><button onClick={()=>setEdit(null)}>Annuller</button><button className="dark" onClick={saveEdit}><Save size={16}/> Gem</button></div></div></div>}
  {addEmp&&<div className="modalbg"><div className="modal"><div className="modaltop"><h2>Tilføj medarbejder</h2><button onClick={()=>setAddEmp(false)}><X size={18}/></button></div><form className="empform" onSubmit={createEmployee}><label>Navn</label><input value={newEmp.name} onChange={e=>setNewEmp({...newEmp,name:e.target.value})} placeholder="Fx Ali"/><label>Email</label><input value={newEmp.email} onChange={e=>setNewEmp({...newEmp,email:e.target.value})} placeholder="email@example.com"/><label>Rolle</label><select value={newEmp.role} onChange={e=>setNewEmp({...newEmp,role:e.target.value})}><option>Pizzaman</option><option>Servering</option><option>Service</option><option>Manager</option><option>Køkken</option></select><label>Timer/uge</label><input type="number" value={newEmp.weekly} onChange={e=>setNewEmp({...newEmp,weekly:e.target.value})}/><div className="actions"><button type="button" onClick={()=>setAddEmp(false)}>Annuller</button><button className="dark"><Plus size={16}/> Opret</button></div></form><p className="hint">Login bliver medarbejderens email + kode demo123.</p></div></div>}
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);
