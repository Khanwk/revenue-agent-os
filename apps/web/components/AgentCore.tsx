import type {AgentStatus} from "@/types";
export function AgentCore({status,stage,label}:{status:AgentStatus;stage?:string;label:string}){
  const busy=["queued","thinking","tool","validating"].includes(status);
  return <div className={`agent-core state-${status}`} aria-label={`${label} ${status}`}>
    <div className="orbit orbit-one"><i/><i/><i/></div>
    <div className="orbit orbit-two"><i/><i/></div>
    <div className="core-center"><span>{status==="completed"?"✓":status==="failed"?"!":"◆"}</span></div>
    <div className="core-copy"><strong>{label}</strong><span>{busy?(stage||"Working"):status==="completed"?"Ready for next task":status==="failed"?"Needs attention":"Idle · ready"}</span></div>
  </div>
}
