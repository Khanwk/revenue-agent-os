"use client";

import Link from "next/link";
import { useCallback,useEffect,useRef,useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { io,type Socket } from "socket.io-client";
import { supabase } from "@/lib/supabase";
import { AgentCore } from "@/components/AgentCore";
import { RunTimeline } from "@/components/RunTimeline";
import { ProfilePanel } from "@/components/ProfilePanel";
import { OpportunityWorkspace } from "@/components/OpportunityWorkspace";
import { ProposalWorkspace } from "@/components/ProposalWorkspace";
import { PlannerWorkspace } from "@/components/PlannerWorkspace";
import { GenericWorkspace } from "@/components/GenericWorkspace";
import { AuthScreen } from "@/components/AuthScreen";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { API_URL,getAgents,getMe,getProfile,getRun,getUpworkConnectUrl,saveProfile,startRun } from "@/lib/api";
import type { AgentMeta,AgentRun,AgentStatus,CompanyProfile,EngineOutput,GenericOutput,PlannerOutput,ProposalOutput,RankedOpportunity,UsageSummary } from "@/types";

type SocketState="connecting"|"connected"|"reconnecting"|"offline";
const SPECIAL=new Set(["opportunity-engine","proposal","project-planner"]);

export default function Home(){
  const[session,setSession]=useState<Session|null|undefined>(undefined);const[showWelcome,setShowWelcome]=useState(false);const[mobileNavOpen,setMobileNavOpen]=useState(false);const[agents,setAgents]=useState<AgentMeta[]>([]);const[profile,setProfile]=useState<CompanyProfile>();const[usage,setUsage]=useState<UsageSummary>();const[showProfile,setShowProfile]=useState(false);const[activeAgent,setActiveAgent]=useState("opportunity-engine");const[runs,setRuns]=useState<Record<string,AgentRun|undefined>>({});const[results,setResults]=useState<Record<string,unknown>>({});const[error,setError]=useState("");const[socketState,setSocketState]=useState<SocketState>("connecting");const[selected,setSelected]=useState<RankedOpportunity>();const runIdsRef=useRef<Record<string,string>>({});const socketRef=useRef<Socket|null>(null);
  const activeRun=runs[activeAgent];const status:AgentStatus=activeRun?.status??"idle";const busy=["queued","thinking","tool","validating"].includes(status);const stage=activeRun?.events.at(-1)?.label;const activeMeta=agents.find(a=>a.id===activeAgent);

  useEffect(()=>{void supabase.auth.getSession().then(({data})=>setSession(data.session));const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>setSession(next));return()=>subscription.unsubscribe();},[]);
  useEffect(()=>{if(!session)return;const key=`revenue-agent-welcome-v1:${session.user.id}`;if(window.localStorage.getItem(key)!=="seen")setShowWelcome(true);},[session]);
  function closeWelcome(){if(session)window.localStorage.setItem(`revenue-agent-welcome-v1:${session.user.id}`,"seen");setShowWelcome(false);}

  const loadWorkspace=useCallback(async()=>{if(!session)return;setError("");try{const[a,p,m]=await Promise.all([getAgents(),getProfile(),getMe()]);setAgents(a.agents);setProfile(p.profile);setUsage(m.usage);if(!a.agents.some(x=>x.id===activeAgent)&&a.agents[0])setActiveAgent(a.agents[0].id);}catch(e){setError(e instanceof Error?e.message:"Unable to load workspace");}},[session,activeAgent]);
  useEffect(()=>{void loadWorkspace();},[loadWorkspace]);
  useEffect(()=>{const id=new URLSearchParams(window.location.search).get("agent");if(id&&agents.some(agent=>agent.id===id))setActiveAgent(id);},[agents]);

  useEffect(()=>{if(!session||!API_URL)return;const socket=io(API_URL,{autoConnect:true,transports:["polling","websocket"],reconnection:true,reconnectionAttempts:Infinity,reconnectionDelay:1000,reconnectionDelayMax:5000,timeout:10000,auth:{token:session.access_token}});socketRef.current=socket;setSocketState("connecting");const rejoin=()=>Object.values(runIdsRef.current).forEach(id=>id&&socket.emit("run:subscribe",id));socket.on("connect",()=>{setSocketState("connected");rejoin();});socket.io.on("reconnect_attempt",()=>setSocketState("reconnecting"));socket.on("disconnect",()=>setSocketState("reconnecting"));socket.on("connect_error",()=>setSocketState("offline"));socket.on("run:update",(next:AgentRun)=>setRuns(current=>({...current,[next.agentId]:next})));return()=>{socket.removeAllListeners();socket.io.removeAllListeners();socket.disconnect();socketRef.current=null;};},[session]);

  async function execute<T>(agentId:string,input:unknown){setError("");const{run:created}=await startRun<T>(agentId,input);runIdsRef.current[agentId]=created.id;setRuns(current=>({...current,[agentId]:created}));socketRef.current?.emit("run:subscribe",created.id);for(let attempt=0;attempt<120;attempt+=1){await new Promise(r=>setTimeout(r,1500));const latest=(await getRun<T>(created.id)).run;setRuns(current=>({...current,[agentId]:latest}));if(latest.status==="completed"){socketRef.current?.emit("run:unsubscribe",created.id);delete runIdsRef.current[agentId];return latest.output as T;}if(latest.status==="failed"){socketRef.current?.emit("run:unsubscribe",created.id);delete runIdsRef.current[agentId];throw new Error(latest.error||"Agent failed");}}throw new Error("Agent run timed out.");}

  async function scan(query:string){try{setActiveAgent("opportunity-engine");const output=await execute<EngineOutput>("opportunity-engine",{query,topN:10});setResults(r=>({...r,"opportunity-engine":output}));const me=await getMe();setUsage(me.usage);}catch(e){setError(e instanceof Error?e.message:"Scan failed");const me=await getMe().catch(()=>undefined);if(me)setUsage(me.usage);}}
  async function chooseProposal(item:RankedOpportunity){setSelected(item);setActiveAgent("proposal");try{const output=await execute<ProposalOutput>("proposal",{rankedOpportunity:item,extraNotes:""});setResults(r=>({...r,proposal:output}));}catch(e){setError(e instanceof Error?e.message:"Proposal failed");}}
  async function choosePlan(item:RankedOpportunity){setSelected(item);setActiveAgent("project-planner");try{const output=await execute<PlannerOutput>("project-planner",{rankedOpportunity:item,clientNotes:""});setResults(r=>({...r,"project-planner":output}));}catch(e){setError(e instanceof Error?e.message:"Planning failed");}}
  async function genericRun(context:string){try{const output=await execute<GenericOutput>(activeAgent,{context,notes:""});setResults(r=>({...r,[activeAgent]:output}));}catch(e){setError(e instanceof Error?e.message:"Agent failed");}}
  async function updateProfile(next:CompanyProfile){const saved=await saveProfile(next);setProfile(saved.profile);}
  async function connectUpwork(){try{const{authorizationUrl}=await getUpworkConnectUrl();window.location.assign(authorizationUrl);}catch(e){setError(e instanceof Error?e.message:"Unable to connect Upwork");}}
  async function logout(){await supabase.auth.signOut();setAgents([]);setProfile(undefined);setUsage(undefined);}

  if(session===undefined)return <main className="auth-shell"><div className="auth-card">Loading Revenue Agent OS…</div></main>;
  if(!session)return <AuthScreen/>;

  return <><main className="app-shell">
    {mobileNavOpen&&<button type="button" className="mobile-nav-backdrop" aria-label="Close navigation" onClick={()=>setMobileNavOpen(false)}/>}
    <aside className={`sidebar ${mobileNavOpen?"mobile-open":""}`}><div className="brand"><div className="brand-symbol">RA</div><div><strong>Revenue Agent OS</strong><span>Company control room</span></div></div><div className="nav-label">COMPANY AGENTS</div><nav>{agents.map(agent=><button type="button" key={agent.id} className={`nav-agent ${activeAgent===agent.id?"active":""}`} onClick={()=>{setActiveAgent(agent.id);setMobileNavOpen(false)}}><span className="nav-icon">{agent.icon==="radar"?"◉":"◇"}</span><span><strong>{agent.shortName}</strong><small>{agent.name}</small></span><i/></button>)}</nav><Link className="guide-nav-button" href="/agents-guide">? Agent Guide · what to paste</Link><button type="button" className="guide-nav-button intro-nav-button" onClick={()=>setShowWelcome(true)}>◇ Quick intro · how this works</button><div className="sidebar-spacer"/><button type="button" className="profile-nav" onClick={()=>setShowProfile(true)}><span>◎</span><div><strong>{profile?.companyName||"Company profile"}</strong><small>Skills · services · filters</small></div></button><div className="user-card"><strong>{session.user.email}</strong><span>Private workspace</span><button type="button" className="auth-switch" onClick={()=>void logout()}>Sign out</button></div><div className="runtime"><i className={socketState==="connected"?"online":""}/> {socketState==="connected"?"REALTIME CONNECTED":"REST FALLBACK ACTIVE"}<span>Human approval on</span></div></aside>
    <section className="main-area"><header className="topbar"><div className="topbar-title-row"><button type="button" className="mobile-nav-trigger" aria-label="Open navigation" onClick={()=>setMobileNavOpen(true)}><span></span><span></span><span></span></button><div><span className="eyebrow">{activeMeta?.category?.toUpperCase()||"AGENT"} / {activeMeta?.version||"2.0"}</span><h1>{activeMeta?.name||"Revenue Agent"}</h1><p>{activeMeta?.description}</p></div></div><div className="topbar-actions">{usage&&<span className="quota-pill">Scout scans <b>{usage.scansRemaining}/{usage.scanLimit}</b></span>}<span className={`socket-pill ${socketState}`}>● {socketState}</span><button type="button" className="profile-button" onClick={()=>setShowProfile(true)}>Company profile <b>{profile?.skills.length||0} skills</b></button></div></header>
    {error&&<div className="global-error">{error}</div>}{showProfile&&profile&&<ProfilePanel profile={profile} onSave={updateProfile} onClose={()=>setShowProfile(false)}/>}<section className="agent-monitor"><AgentCore status={status} stage={stage} label={activeMeta?.shortName||"Agent"}/><RunTimeline events={activeRun?.events||[]}/></section>
    {activeAgent==="opportunity-engine"&&<OpportunityWorkspace result={results["opportunity-engine"] as EngineOutput|undefined} busy={busy||usage?.scansRemaining===0} onScan={scan} onProposal={item=>void chooseProposal(item)} onPlan={item=>void choosePlan(item)} onConnectUpwork={connectUpwork} scansRemaining={usage?.scansRemaining}/>} 
    {activeAgent==="proposal"&&<ProposalWorkspace selected={selected} result={results.proposal as ProposalOutput|undefined} busy={busy} onGenerate={()=>selected?void chooseProposal(selected):undefined}/>} 
    {activeAgent==="project-planner"&&<PlannerWorkspace selected={selected} result={results["project-planner"] as PlannerOutput|undefined} busy={busy} onGenerate={()=>selected?void choosePlan(selected):undefined}/>} 
    {!SPECIAL.has(activeAgent)&&activeMeta&&<GenericWorkspace agent={activeMeta} result={results[activeAgent] as GenericOutput|undefined} busy={busy} onRun={genericRun}/>} 
    </section></main>{showWelcome&&<WelcomeDialog companyName={profile?.companyName} scansRemaining={usage?.scansRemaining} scanLimit={usage?.scanLimit} onClose={closeWelcome}/>}</>;
}
