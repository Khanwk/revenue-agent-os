"use client";

import Link from "next/link";
import { useEffect,useMemo,useState } from "react";
import { AGENT_GUIDE,GUIDE_CATEGORIES } from "@/lib/agent-guide";
import { getAgentInputHelp } from "@/lib/agent-inputs";

export default function AgentsGuidePage(){
  const[query,setQuery]=useState("");
  const[category,setCategory]=useState<(typeof GUIDE_CATEGORIES)[number]["id"]>("all");
  const[open,setOpen]=useState<string>("opportunity-engine");
  useEffect(()=>{const id=new URLSearchParams(window.location.search).get("agent");if(id&&AGENT_GUIDE.some(item=>item.id===id))setOpen(id)},[]);
  const items=useMemo(()=>AGENT_GUIDE.filter(item=>{
    const input=getAgentInputHelp(item.id);
    const categoryMatch=category==="all"||item.category===category;
    const haystack=`${item.name} ${item.shortName} ${item.oneLine} ${item.whenToUse.join(" ")} ${item.paste.join(" ")} ${input?.checklist.join(" ")||""} ${input?.instruction||""}`.toLowerCase();
    return categoryMatch&&haystack.includes(query.trim().toLowerCase());
  }),[category,query]);

  return <main className="guide-shell">
    <header className="guide-topbar">
      <Link className="guide-back" href="/">← Control room</Link>
      <div className="guide-brand"><span className="brand-symbol">RA</span><div><strong>Revenue Agent OS</strong><small>Agent handbook + demo library</small></div></div>
      <Link className="guide-back" href="/">Open workspace →</Link>
    </header>

    <section className="guide-hero">
      <span className="eyebrow">AGENT HANDBOOK</span>
      <h1>One field does not mean<br/>one generic prompt.</h1>
      <p>Each agent accepts a context brief, but every agent needs different facts. Use this page to see exactly what belongs in that field, what a strong input looks like, and what the agent will return.</p>
      <div className="guide-flow"><span>01 Pick the right agent</span><b>→</b><span>02 Paste the required facts</span><b>→</b><span>03 Run the agent</span><b>→</b><span>04 Review before acting</span></div>
    </section>

    <section className="guide-controls">
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search: proposal, QA, leads, requirements, SOP..." />
      <div className="guide-tabs">{GUIDE_CATEGORIES.map(tab=><button type="button" key={tab.id} className={category===tab.id?"active":""} onClick={()=>setCategory(tab.id)}>{tab.label}</button>)}</div>
    </section>

    <section className="guide-layout">
      <aside className="guide-index">
        <span>{items.length} AGENTS</span>
        {items.map((item,index)=><button type="button" className={open===item.id?"active":""} key={item.id} onClick={()=>setOpen(item.id)}>
          <b>{String(index+1).padStart(2,"0")}</b><div><strong>{item.shortName}</strong><small>{item.name}</small></div><i>{item.category}</i>
        </button>)}
      </aside>

      <div className="guide-content">
        {items.length===0&&<div className="guide-empty">No agents match that search.</div>}
        {items.map(item=>{const input=getAgentInputHelp(item.id);return <article key={item.id} id={`guide-${item.id}`} className={`guide-agent-card ${open===item.id?"expanded":""}`}>
          <button type="button" className="guide-agent-head" onClick={()=>setOpen(open===item.id?"":item.id)}>
            <div className="guide-agent-number">{item.shortName.slice(0,2).toUpperCase()}</div>
            <div><span className="eyebrow">{item.category.toUpperCase()} AGENT</span><h2>{item.shortName} <small>{item.name}</small></h2><p>{item.oneLine}</p></div>
            <strong className="guide-expand">{open===item.id?"−":"+"}</strong>
          </button>
          {open===item.id&&<div className="guide-agent-body">
            <div className="guide-info-grid">
              <section><span className="guide-section-label">WHEN SHOULD I USE IT?</span><ul>{item.whenToUse.map(x=><li key={x}>{x}</li>)}</ul></section>
              <section className="guide-paste"><span className="guide-section-label">WHAT GOES IN THE INPUT?</span><p>{input?.instruction}</p>{input&&<div className="guide-prompt-shape"><strong>{input.label}</strong><div>{input.checklist.map(x=><span key={x}>✓ {x}</span>)}</div></div>}</section>
              <section><span className="guide-section-label">WHAT DOES IT ACTUALLY DO?</span><ul>{item.does.map(x=><li key={x}>{x}</li>)}</ul></section>
              <section><span className="guide-section-label">WHAT WILL I GET BACK?</span>{input?<div className="guide-output-grid">{input.expected.map(x=><span key={x}>→ {x}</span>)}</div>:<ul>{item.output.map(x=><li key={x}>{x}</li>)}</ul>}</section>
            </div>
            {input&&<div className="guide-example"><div><span>READY-TO-PASTE DEMO INPUT</span><p className="guide-demo-input">{input.demoInput}</p></div><div className="guide-demo-actions"><button type="button" onClick={()=>void navigator.clipboard?.writeText(input.demoInput)}>Copy demo input</button></div></div>}
            {!input&&<div className="guide-example"><div><span>EXAMPLE INPUT</span><p>{item.example}</p></div><button type="button" onClick={()=>void navigator.clipboard?.writeText(item.example)}>Copy example</button></div>}
            {item.tip&&<div className="guide-tip"><strong>GOOD TO KNOW</strong><p>{item.tip}</p></div>}
            <Link className="primary-btn guide-open-agent" href={`/?agent=${encodeURIComponent(item.id)}`}>Open {item.shortName} →</Link>
          </div>}
        </article>})}
      </div>
    </section>

    <section className="guide-principles">
      <span className="eyebrow">A GOOD CONTEXT BRIEF</span>
      <h2>Give facts in a predictable order.</h2>
      <div><article><b>01</b><h3>Situation</h3><p>Who is involved, what company/project/process this is, and what is happening now.</p></article><article><b>02</b><h3>Goal</h3><p>State the decision or deliverable you want from the agent.</p></article><article><b>03</b><h3>Facts + constraints</h3><p>Scope, users, budget, deadline, team, technology, evidence and anything already decided.</p></article><article><b>04</b><h3>Unknowns</h3><p>Say what you do not know. Agents should expose uncertainty rather than silently making up facts.</p></article></div>
    </section>
  </main>;
}
