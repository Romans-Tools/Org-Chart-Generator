const CAP_TITLES=["","Commander","Vice Commander","Deputy Commander","Deputy Commander for Cadets","Deputy Commander for Seniors","Chief of Staff","Executive Officer","Command Chief Master Sergeant","NCO Advisor","Administrative Officer","Personnel Officer","Professional Development / Education & Training Officer","Historian","Inspector General","Equal Opportunity Officer","Testing Officer","Recruiting & Retention Officer","Cadet Programs Officer","Cadet Activities Officer","Leadership Education Officer","Aerospace Education Officer","Character Development Instructor (CDI)","Chaplain","Fitness Officer","Cadet Programs Development Officer","Cadet Cyber Education Officer","Emergency Services Officer","Operations Officer","Standardization/Evaluation Officer","Plans and Programs Officer","Air Operations Branch Director","Safety Officer","Aerospace Education Officer","External Aerospace Education Officer","Internal Aerospace Education Officer","Communications Officer","Information Technology Officer","Cybersecurity / Cyber Education Officer","Web Security Administrator","Logistics Officer","Supply Officer","Transportation Officer","Aircraft Maintenance Officer","Vehicle Maintenance Officer","Finance Officer","Legal Officer","Government Relations Advisor","Marketing & Communications Officer","Health Services Officer","Safety Officer","Homeland Security Officer","Counterdrug Officer","Custom"];
const state={chart:{id:crypto.randomUUID(),title:"",subtitle:"",organizationName:"",chartType:"command",people:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},editingId:null};
const $=id=>document.getElementById(id);
const els={title:$("chartTitle"),subtitle:$("chartSubtitle"),org:$("orgName"),type:$("chartType"),form:$("personForm"),name:$("personName"),rank:$("personRank"),position:$("personPosition"),section:$("personSection"),email:$("personEmail"),phone:$("personPhone"),sup:$("personSupervisor"),cap:$("personCapTitle"),tbody:document.querySelector("#peopleTable tbody"),preview:$("chartPreview"),validation:$("validationOutput")};

const STORAGE_KEYS={chart:"orgChartGenerator.chart",theme:"orgChartGenerator.theme"};
function saveChartToStorage(){localStorage.setItem(STORAGE_KEYS.chart,JSON.stringify(state.chart));}
function loadChartFromStorage(){const raw=localStorage.getItem(STORAGE_KEYS.chart);if(!raw)return;try{const parsed=JSON.parse(raw);if(parsed&&typeof parsed==="object"){state.chart={...state.chart,...parsed,people:Array.isArray(parsed.people)?parsed.people:[]};}}catch{}
}
function applyChartToInputs(){els.title.value=state.chart.title||"";els.subtitle.value=state.chart.subtitle||"";els.org.value=state.chart.organizationName||"";els.type.value=state.chart.chartType||"command";}
function saveThemeToStorage(){const theme=document.body.classList.contains("dark")?"dark":"light";localStorage.setItem(STORAGE_KEYS.theme,theme);}
function loadThemeFromStorage(){if(localStorage.getItem(STORAGE_KEYS.theme)==="dark")document.body.classList.add("dark");}
CAP_TITLES.forEach(t=>{const o=document.createElement("option");o.value=t;o.textContent=t||"CAP Title (optional)";els.cap.append(o)});
const touch=()=>{state.chart.updatedAt=new Date().toISOString();saveChartToStorage();};
function syncMeta(){state.chart.title=els.title.value.trim();state.chart.subtitle=els.subtitle.value.trim();state.chart.organizationName=els.org.value.trim();state.chart.chartType=els.type.value;touch();render();}
[els.title,els.subtitle,els.org,els.type].forEach(e=>e.addEventListener("input",syncMeta));
const supName=id=>state.chart.people.find(p=>p.id===id)?.name||"—";
function populateSupervisor(){els.sup.innerHTML="<option value=''>Supervisor (root)</option>";state.chart.people.forEach(p=>{const o=document.createElement("option");o.value=p.id;o.textContent=`${p.rank?`${p.rank} `:""}${p.name}`;els.sup.append(o)});}
function renderTable(){els.tbody.innerHTML="";state.chart.people.forEach(p=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${p.name}</td><td>${p.rank||""}</td><td>${p.position}</td><td>${p.section||""}</td><td>${supName(p.supervisorId)}</td><td><button data-act='edit' data-id='${p.id}'>Edit</button> <button data-act='del' data-id='${p.id}'>Delete</button></td>`;els.tbody.append(tr)})}
const OFFICE_SYMBOLS={
  "CC":"Commander","CV":"Vice Commander","XO":"Executive Officer","COS":"Chief of Staff","DCS":"Deputy Chief of Staff","CAG":"Command Chief / Command Chief Master Sergeant","IG":"Inspector General","JA":"Legal Officer / Judge Advocate","HC":"Chaplain Corps","CDI":"Character Development Instructor","PA":"Public Affairs Officer","SE":"Safety Officer","FM":"Finance Officer","DP":"Personnel / Professional Development","LG":"Logistics","IT":"Information Technology Officer","CS":"Communications Officer","DO":"Director of Operations","ES":"Emergency Services Officer","AE":"Aerospace Education Officer","CP":"Cadet Programs Officer","PD":"Professional Development Officer","DA":"Administrative Officer",
  "CDC":"Deputy Commander for Cadets","CDS":"Deputy Commander for Seniors","C/CC":"Cadet Commander","C/CV":"Cadet Vice Commander","C/XO":"Cadet Executive Officer","C/DO":"Cadet Operations Officer","C/PA":"Cadet Public Affairs Officer","C/ES":"Cadet Emergency Services Officer","C/FM":"Cadet Finance Officer","C/LG":"Cadet Logistics Officer","C/IT":"Cadet IT Officer","C/SE":"Cadet Safety Officer","C/CP":"Cadet Programs Officer","C/CCF":"Cadet First Sergeant","C/Flt CC":"Cadet Flight Commander","C/Flt Sgt":"Cadet Flight Sergeant",
  "OPS":"Operations","OSC":"Operations Section Chief","IC":"Incident Commander","AOBD":"Air Operations Branch Director","GBD":"Ground Branch Director","PSC":"Planning Section Chief","LSC":"Logistics Section Chief","FSC":"Finance Section Chief","MSA":"Mission Staff Assistant","MRO":"Mission Radio Operator","MP":"Mission Pilot","MO":"Mission Observer","MS":"Mission Scanner","GTL":"Ground Team Leader","GTM":"Ground Team Member","UDF":"Urban Direction Finding",
  "CAP/CC":"National Commander","CAP/CV":"National Vice Commander","CAP/CS":"National Chief of Staff","CAP/DP":"Personnel","CAP/DO":"Operations","CAP/CP":"Cadet Programs","CAP/AE":"Aerospace Education","CAP/PA":"Public Affairs","CAP/IT":"Information Technology","CAP/LG":"Logistics","CAP/FM":"Finance","CAP/SE":"Safety","CAP/JA":"Legal","CAP/HC":"Chaplain Corps",
  "AEO":"Aerospace Education Officer","PDO":"Professional Development Officer","PAO":"Public Affairs Officer","ESO":"Emergency Services Officer","LSO":"Logistics/Supply Officer","TO":"Transportation Officer","RRO":"Recruiting & Retention Officer","TCO":"Testing Control Officer","DCC":"Deputy Commander for Cadets"
};
const MEANING_TO_SYMBOL=Object.fromEntries(Object.entries(OFFICE_SYMBOLS).map(([k,v])=>[v.toLowerCase(),k]));
function getOfficeSymbol(position,name){
  const p=(position||"").trim();
  if(!p)return (name||"?").split(" ").map(v=>v[0]).join("").slice(0,3).toUpperCase();
  if(OFFICE_SYMBOLS[p])return p;
  return MEANING_TO_SYMBOL[p.toLowerCase()]||p.split(" ").map(v=>v[0]).join("").slice(0,4).toUpperCase();
}
function nodeCard(p){const symbol=getOfficeSymbol(p.position,p.name);return `<div class='card'><div class='badge'>${symbol}</div><div class='rank'>${p.rank||""}</div><div class='name'>${p.name}</div><div class='position'>${p.position}</div><div class='section'>${p.section||""}</div></div>`}
function treeHTML(parentId=null){const children=state.chart.people.filter(p=>(p.supervisorId||null)===parentId).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0)||a.name.localeCompare(b.name));if(!children.length)return"";return `<ul>${children.map(c=>`<li><div class='node-wrap'>${nodeCard(c)}</div>${treeHTML(c.id)}</li>`).join("")}</ul>`;}
function render(){populateSupervisor();renderTable();const styleClass=`style-${state.chart.chartType}`;els.preview.innerHTML=`<div class='org-tree ${styleClass}'><h3>${state.chart.title||"Untitled Chart"}</h3><small>${state.chart.subtitle||""} ${state.chart.organizationName?`• ${state.chart.organizationName}`:""}</small>${treeHTML(null)}</div>`;}
function upsertPerson(e){e.preventDefault();const name=els.name.value.trim(),position=els.position.value.trim();if(!name||!position)return;if(els.cap.value&&els.cap.value!=="Custom")els.position.value=els.cap.value;const payload={id:state.editingId||crypto.randomUUID(),name,rank:els.rank.value.trim(),position:els.position.value.trim(),section:els.section.value.trim(),email:els.email.value.trim(),phone:els.phone.value.trim(),supervisorId:els.sup.value||null,sortOrder:Date.now()};if(state.editingId){state.chart.people=state.chart.people.map(p=>p.id===state.editingId?payload:p);state.editingId=null;$("personSubmit").textContent="Add Person";}else state.chart.people.push(payload);e.target.reset();touch();render();}
els.form.addEventListener("submit",upsertPerson);
els.tbody.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const id=b.dataset.id;const p=state.chart.people.find(x=>x.id===id);if(b.dataset.act==="del"){state.chart.people=state.chart.people.filter(x=>x.id!==id).map(x=>x.supervisorId===id?{...x,supervisorId:null}:x);touch();render();}else if(p){state.editingId=id;els.name.value=p.name;els.rank.value=p.rank||"";els.position.value=p.position;els.section.value=p.section||"";els.email.value=p.email||"";els.phone.value=p.phone||"";els.sup.value=p.supervisorId||"";$("personSubmit").textContent="Update Person";}});
function detectCycle(){const map=Object.fromEntries(state.chart.people.map(p=>[p.id,p.supervisorId]));for(const p of state.chart.people){let seen=new Set([p.id]);let cur=map[p.id];while(cur){if(seen.has(cur))return true;seen.add(cur);cur=map[cur];}}return false;}
function getCommandLogicFindings(){
  const issues=[];
  const warnings=[];
  const ids=new Set(state.chart.people.map(p=>p.id));
  const subCount={};
  state.chart.people.forEach(p=>subCount[p.id]=0);
  state.chart.people.forEach(p=>{if(p.supervisorId&&ids.has(p.supervisorId))subCount[p.supervisorId]+=1;});
  const roots=state.chart.people.filter(p=>!p.supervisorId);
  if(roots.length===0)issues.push("At least one root required.");
  if(roots.length>1)warnings.push("Multiple roots found; verify this reflects intended command channels.");
  state.chart.people.forEach(p=>{
    if(p.supervisorId&&!ids.has(p.supervisorId))issues.push(`${p.name} has a missing supervisor reference.`);
    if(p.supervisorId===p.id)issues.push(`${p.name} cannot supervise themselves.`);
    const directs=subCount[p.id]||0;
    if(directs>7)warnings.push(`${p.name} supervises ${directs} members; CAP guidance typically recommends span of control around 3-7.`);
  });
  const topHeavy=roots.filter(r=>(subCount[r.id]||0)===0);
  if(topHeavy.length&&state.chart.people.length>1)warnings.push(`Root with no direct staff: ${topHeavy.map(p=>p.name).join(", ")}.`);
  return {issues,warnings};
}
$("validateBtn").onclick=()=>{
  const names=state.chart.people.map(p=>p.name.toLowerCase());
  const dup=names.find((n,i)=>names.indexOf(n)!==i);
  const cyc=detectCycle();
  const {issues,warnings}=getCommandLogicFindings();
  const checks=[];
  if(dup)checks.push(`Duplicate name: ${dup}`);
  if(cyc)checks.push("Circular relationship detected.");
  checks.push(...issues);
  if(checks.length){els.validation.textContent=checks.join(" ");return;}
  els.validation.textContent=warnings.length?`Validation passed with warnings: ${warnings.join(" ")}`:"Validation passed.";
};
function download(name,blob){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href);} 
function exportSVG(){const footer=`Generated ${new Date().toLocaleString()}`;const content=els.preview.innerHTML.replace("</div>",`<p>${footer}</p></div>`);const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='2200' height='1400'><foreignObject width='100%' height='100%'><div xmlns='http://www.w3.org/1999/xhtml' style='font-family:Arial;padding:12px'>${content}</div></foreignObject></svg>`;download(`${(state.chart.title||"org-chart").replace(/\s+/g,"-")}.svg`,new Blob([svg],{type:"image/svg+xml"}));return svg;}
$("exportSvgBtn").onclick=exportSVG;
$("exportPngBtn").onclick=()=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");c.width=img.width;c.height=img.height;c.getContext("2d").drawImage(img,0,0);c.toBlob(b=>download("org-chart.png",b));};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(exportSVG());};
$("exportPdfBtn").onclick=()=>{const w=window.open("","_blank");w.document.write(`<html><body><h2>${state.chart.title||"Org Chart"}</h2>${els.preview.innerHTML}<footer>Generated ${new Date().toLocaleString()} • Letter/Tabloid friendly</footer><script>window.print()<\/script></body></html>`);w.document.close();};
$("saveJsonBtn").onclick=()=>download("org-chart.json",new Blob([JSON.stringify(state.chart,null,2)],{type:"application/json"}));
$("loadJsonInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.chart=JSON.parse(r.result);els.title.value=state.chart.title||"";els.subtitle.value=state.chart.subtitle||"";els.org.value=state.chart.organizationName||"";els.type.value=state.chart.chartType||"command";saveChartToStorage();render();};r.readAsText(f)};
function normalizeRow(row){const g=(...keys)=>keys.map(k=>row[k]??row[k.toLowerCase()]??row[k.toUpperCase()]).find(v=>v!==undefined&&v!==null&&`${v}`.trim()!=="")||"";return {name:`${g("name","full name","member")}`.trim(),rank:`${g("rank","grade")}`.trim(),position:`${g("position","duty position","title")}`.trim()||"Member",section:`${g("section","department","unit")}`.trim(),email:`${g("email","mail")}`.trim(),phone:`${g("phone","cell")}`.trim(),supervisorName:`${g("supervisorName","supervisor","reportsTo")}`.trim()};}
function importRows(rows){const added=rows.map(r=>normalizeRow(r)).filter(r=>r.name).map(row=>({id:crypto.randomUUID(),name:row.name,rank:row.rank,position:row.position,section:row.section,email:row.email,phone:row.phone,supervisorId:null,sortOrder:Date.now()+Math.random(),_sup:row.supervisorName}));state.chart.people.push(...added);added.forEach(p=>{if(p._sup){const sup=state.chart.people.find(x=>x.name.toLowerCase()===p._sup.toLowerCase());if(sup)p.supervisorId=sup.id;}delete p._sup;});touch();render();}
$("importCsvInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const lines=r.result.split(/\r?\n/).filter(Boolean);const headers=lines.shift().split(",").map(h=>h.trim());importRows(lines.map(l=>Object.fromEntries(l.split(",").map((v,i)=>[headers[i],v?.trim()||""]))));};r.readAsText(f)};
$("importExcelInput").onchange=async e=>{const f=e.target.files[0];if(!f||!window.XLSX)return;const buf=await f.arrayBuffer();const wb=XLSX.read(buf,{type:"array"});const ws=wb.Sheets[wb.SheetNames[0]];importRows(XLSX.utils.sheet_to_json(ws,{defval:""}));};
$("duplicateBtn").onclick=()=>{state.chart={...structuredClone(state.chart),id:crypto.randomUUID(),title:`${state.chart.title||"Chart"} (Copy)`,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};render();};
$("clearBtn").onclick=()=>{if(confirm("Clear all people and settings?")){state.chart={id:crypto.randomUUID(),title:"",subtitle:"",organizationName:"",chartType:"command",people:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};els.title.value=els.subtitle.value=els.org.value="";els.type.value="command";render();}};
function generateTestPersonnel(){
  const records=[
    {name:"Alex Carter",rank:"Col",position:"Commander",section:"Command",supervisorName:null},
    {name:"Jordan Lee",rank:"Lt Col",position:"Vice Commander",section:"Command",supervisorName:"Alex Carter"},
    {name:"Morgan Reyes",rank:"Maj",position:"Chief of Staff",section:"Command",supervisorName:"Alex Carter"},
    {name:"Taylor Brooks",rank:"Maj",position:"Deputy Commander for Cadets",section:"Cadet Programs",supervisorName:"Jordan Lee"},
    {name:"Casey Bennett",rank:"Maj",position:"Deputy Commander for Seniors",section:"Senior Programs",supervisorName:"Jordan Lee"},
    {name:"Riley Morgan",rank:"Capt",position:"Executive Officer",section:"Command",supervisorName:"Morgan Reyes"},
    {name:"Cameron Ellis",rank:"Capt",position:"Command Chief Master Sergeant",section:"Command",supervisorName:"Alex Carter"},
    {name:"Avery Parker",rank:"Capt",position:"Inspector General",section:"Command",supervisorName:"Morgan Reyes"},
    {name:"Quinn Harper",rank:"Capt",position:"Equal Opportunity Officer",section:"Command",supervisorName:"Morgan Reyes"},
    {name:"Blake Sullivan",rank:"Capt",position:"Administrative Officer",section:"Administration",supervisorName:"Riley Morgan"},
    {name:"Peyton Foster",rank:"Capt",position:"Personnel Officer",section:"Administration",supervisorName:"Riley Morgan"},
    {name:"Hayden West",rank:"Capt",position:"Professional Development / Education & Training Officer",section:"Administration",supervisorName:"Riley Morgan"},
    {name:"Emerson Boyd",rank:"1st Lt",position:"Historian",section:"Administration",supervisorName:"Blake Sullivan"},
    {name:"Dakota Powell",rank:"Capt",position:"Testing Officer",section:"Administration",supervisorName:"Hayden West"},
    {name:"Kendall Griffin",rank:"Capt",position:"Recruiting & Retention Officer",section:"Administration",supervisorName:"Peyton Foster"},
    {name:"Rowan Pierce",rank:"Capt",position:"Cadet Programs Officer",section:"Cadet Programs",supervisorName:"Taylor Brooks"},
    {name:"Skyler Bishop",rank:"1st Lt",position:"Cadet Activities Officer",section:"Cadet Programs",supervisorName:"Taylor Brooks"},
    {name:"Finley Long",rank:"1st Lt",position:"Leadership Education Officer",section:"Cadet Programs",supervisorName:"Taylor Brooks"},
    {name:"Sawyer Ramsey",rank:"Capt",position:"Aerospace Education Officer",section:"Aerospace Education",supervisorName:"Casey Bennett"},
    {name:"Harper Wolfe",rank:"Capt",position:"Character Development Instructor (CDI)",section:"Cadet Programs",supervisorName:"Taylor Brooks"},
    {name:"Reese McDaniel",rank:"Capt",position:"Chaplain",section:"Chaplain Corps",supervisorName:"Morgan Reyes"},
    {name:"Lane Duncan",rank:"1st Lt",position:"Fitness Officer",section:"Cadet Programs",supervisorName:"Taylor Brooks"},
    {name:"Tatum Norris",rank:"1st Lt",position:"Cadet Programs Development Officer",section:"Cadet Programs",supervisorName:"Rowan Pierce"},
    {name:"River Howard",rank:"1st Lt",position:"Cadet Cyber Education Officer",section:"Cadet Programs",supervisorName:"Rowan Pierce"},
    {name:"Parker Shaw",rank:"Capt",position:"Emergency Services Officer",section:"Emergency Services",supervisorName:"Casey Bennett"},
    {name:"Jamie Walters",rank:"Capt",position:"Operations Officer",section:"Operations",supervisorName:"Casey Bennett"},
    {name:"Logan Kim",rank:"1st Lt",position:"Standardization/Evaluation Officer",section:"Operations",supervisorName:"Jamie Walters"},
    {name:"Micah Fuller",rank:"1st Lt",position:"Plans and Programs Officer",section:"Operations",supervisorName:"Jamie Walters"},
    {name:"Elliot Dean",rank:"Capt",position:"Air Operations Branch Director",section:"Operations",supervisorName:"Jamie Walters"},
    {name:"Noah Flynn",rank:"Capt",position:"Safety Officer",section:"Safety",supervisorName:"Morgan Reyes"},
    {name:"Sage Kramer",rank:"Capt",position:"External Aerospace Education Officer",section:"Aerospace Education",supervisorName:"Sawyer Ramsey"},
    {name:"Adrian Lowe",rank:"1st Lt",position:"Internal Aerospace Education Officer",section:"Aerospace Education",supervisorName:"Sawyer Ramsey"},
    {name:"Bailey Rhodes",rank:"Capt",position:"Communications Officer",section:"Communications",supervisorName:"Casey Bennett"},
    {name:"Drew Calder",rank:"Capt",position:"Information Technology Officer",section:"Information Technology",supervisorName:"Casey Bennett"},
    {name:"Kai Mercer",rank:"1st Lt",position:"Cybersecurity / Cyber Education Officer",section:"Information Technology",supervisorName:"Drew Calder"},
    {name:"Ari Jennings",rank:"2d Lt",position:"Web Security Administrator",section:"Information Technology",supervisorName:"Drew Calder"},
    {name:"Shawn Patel",rank:"Capt",position:"Logistics Officer",section:"Logistics",supervisorName:"Casey Bennett"},
    {name:"Jules Tran",rank:"1st Lt",position:"Supply Officer",section:"Logistics",supervisorName:"Shawn Patel"},
    {name:"Nico Alvarez",rank:"1st Lt",position:"Transportation Officer",section:"Logistics",supervisorName:"Shawn Patel"},
    {name:"Remy Collins",rank:"1st Lt",position:"Aircraft Maintenance Officer",section:"Logistics",supervisorName:"Shawn Patel"}
  ];

  const generated=records.map((row,index)=>({
    id:crypto.randomUUID(),
    name:row.name,
    rank:row.rank,
    position:row.position,
    section:row.section,
    email:"",
    phone:"",
    supervisorId:null,
    sortOrder:Date.now()+index
  }));

  const byName=Object.fromEntries(generated.map(p=>[p.name,p]));
  generated.forEach((p,index)=>{
    const supervisorName=records[index].supervisorName;
    if(supervisorName&&byName[supervisorName])p.supervisorId=byName[supervisorName].id;
  });

  state.chart.people=generated;
  state.editingId=null;
  els.form.reset();
  $("personSubmit").textContent="Add Person";
  touch();
  render();
}
$("themeToggle").onclick=()=>{document.body.classList.toggle("dark");saveThemeToStorage();};$("generateTestBtn").onclick=generateTestPersonnel;$("presentationToggle").onclick=()=>document.body.classList.toggle("presentation");$("printModeToggle").onclick=()=>document.body.classList.toggle("print");
loadThemeFromStorage();
loadChartFromStorage();
applyChartToInputs();
render();
