export type AgentGuideItem={
  id:string;
  shortName:string;
  name:string;
  category:"sales"|"delivery"|"growth"|"operations";
  oneLine:string;
  whenToUse:string[];
  paste:string[];
  does:string[];
  output:string[];
  example:string;
  tip?:string;
};

export const AGENT_GUIDE:AgentGuideItem[]=[
  {
    id:"opportunity-engine",shortName:"Scout",name:"Opportunity Engine",category:"sales",
    oneLine:"Finds and ranks freelance opportunities that fit your company.",
    whenToUse:["When you want fresh projects to bid on","When you have limited proposal time and need the best-fit jobs first","When you want opportunities scored against your company profile"],
    paste:["A short search intent such as “Next.js dashboard”, “Node.js API”, or “React ecommerce”","You do not need to paste a full job post; Scout searches configured sources for you"],
    does:["Searches configured marketplaces","Normalizes opportunities from different sources","Scores skills, budget, fit and risk","Deep-analyzes the strongest matches","Ranks the best opportunities and links to the original listing"],
    output:["Ranked opportunities","Bid / consider / skip recommendation","Fit score and confidence","Matched skills, reasons and risks","Suggested bid range and proposal angle"],
    example:"Next.js + Node.js projects involving dashboards, integrations or ecommerce. Prefer fixed-price work above $500.",
    tip:"Your Company Profile strongly affects Scout ranking. Keep skills, services, minimum budget and avoid-keywords accurate."
  },
  {
    id:"proposal",shortName:"Pitch",name:"Proposal Agent",category:"sales",
    oneLine:"Turns a selected opportunity into a tailored proposal.",
    whenToUse:["After Scout finds a project you want to pursue","Before submitting an Upwork/Freelancer proposal","When you want a proposal that reflects the actual job instead of generic AI copy"],
    paste:["Usually nothing: choose “Create proposal” from a Scout result","Optionally add specific notes about your experience, availability, pricing or questions"],
    does:["Reads the selected job and your company profile","Identifies the strongest truthful angle","Builds pricing reasoning","Drafts a concise client-focused proposal","Creates useful discovery questions and milestones"],
    output:["Opening hook","Full proposal draft","Recommended price and pricing reason","Questions to ask the client","Suggested milestones","Things you should avoid claiming"],
    example:"Selected Scout job + note: We built a similar Next.js admin dashboard with Stripe and PostgreSQL. I can start next Monday.",
    tip:"Review every proposal before sending. Pitch is designed to assist a human decision, not auto-submit bids."
  },
  {
    id:"lead-research",shortName:"Prospector",name:"Lead Research Agent",category:"sales",
    oneLine:"Turns a target market into a focused lead-research plan.",
    whenToUse:["When you want clients outside freelance marketplaces","When choosing which companies to prospect","Before asking an intern to build a lead list"],
    paste:["Target industry or niche","Geography if relevant","The service you want to sell","Any company-size, technology or trigger criteria you care about"],
    does:["Defines an ideal customer profile","Suggests buying/need signals","Identifies useful lead sources","Creates prospect qualification criteria","Builds research and prioritization steps"],
    output:["ICP and priorities","Research actions","Qualification signals","Risks and unknowns","Questions needed to sharpen targeting"],
    example:"Target UK ecommerce companies with 10–100 employees that may need custom internal dashboards, automation or API integrations. We sell Next.js/Node development.",
    tip:"Give Prospector a narrow market first. “Find anyone who needs software” produces much weaker research."
  },
  {
    id:"outreach",shortName:"Reach",name:"Outreach Agent",category:"sales",
    oneLine:"Creates personalized cold outreach and follow-up strategy.",
    whenToUse:["After researching a lead","Before sending LinkedIn/email outreach","When a first message received no response and you need a follow-up"],
    paste:["Who the prospect is","What their company does","Why you think they may have a relevant problem","Any public trigger or observation","What service you can genuinely offer"],
    does:["Finds the strongest reason to contact","Chooses a concise outreach angle","Builds message and follow-up logic","Avoids unsupported claims and generic spam","Suggests the next action"],
    output:["Outreach draft","Priorities and actions","Follow-up approach","Risks","Questions to resolve"],
    example:"Lead: Acme Retail, 30-person ecommerce business. Their careers page mentions manual inventory reporting. We build custom dashboards and integrations. Contact is the operations manager.",
    tip:"Paste real research. Reach should personalize from facts you provide, not invent a connection or fake familiarity."
  },
  {
    id:"client-discovery",shortName:"Discover",name:"Client Discovery Agent",category:"sales",
    oneLine:"Turns a vague client request into the questions you need before committing.",
    whenToUse:["Before a discovery call","When a client gives an incomplete brief","Before estimating a project with important unknowns"],
    paste:["Client message or brief","What you already know about the business","Known users/features","Deadline/budget if mentioned","Anything confusing or contradictory"],
    does:["Separates business goals from requested features","Finds scope gaps and dependencies","Maps likely stakeholders and user groups","Prepares high-value discovery questions","Clarifies the decision needed after discovery"],
    output:["Discovery priorities","Questions to ask","Risks and unknowns","Recommended actions","Summary of the likely business problem"],
    example:"Client wants a booking platform for trainers with customer accounts, coach schedules and payments in six weeks. They have not specified payment provider, admin roles, cancellation rules or existing data.",
    tip:"Paste the client’s words as closely as possible; it helps Discover identify assumptions you might otherwise make."
  },
  {
    id:"estimator",shortName:"Estimate",name:"Estimator Agent",category:"sales",
    oneLine:"Creates defensible effort, pricing and milestone assumptions.",
    whenToUse:["After discovery","Before sending a quote","When comparing fixed-price versus hourly delivery"],
    paste:["Project scope","Must-have features","Known integrations","Timeline expectations","Team availability","Important unknowns or constraints"],
    does:["Breaks scope into workstreams","Makes assumptions explicit","Identifies estimation risk","Suggests milestones and commercial structure","Highlights questions that could materially change price"],
    output:["Estimation priorities","Actions","Risks","Assumptions/questions","Recommended next step"],
    example:"Build Next.js customer portal + Node API + PostgreSQL. Roles: admin/customer. Stripe subscription billing, email notifications, existing Figma designs. Target delivery 8 weeks with one backend and one frontend developer.",
    tip:"Do not use a vague one-line idea for final pricing. Run Discover first when the scope is uncertain."
  },
  {
    id:"project-planner",shortName:"Architect",name:"Project Planner",category:"delivery",
    oneLine:"Converts a selected opportunity into a delivery architecture and phased plan.",
    whenToUse:["After deciding a job is worth pursuing","Before kickoff","When you need to explain how the team will execute"],
    paste:["Usually nothing: choose “Build plan” from a Scout result","Optionally include client notes, constraints or technology decisions"],
    does:["Defines the delivery objective","Makes assumptions visible","Proposes technical architecture","Breaks work into phases","Assigns responsibilities","Identifies risks, discovery questions and definition of done"],
    output:["Architecture","Estimated timeline","Phases and outcomes","Team assignments","Risks","Discovery questions","Definition of done"],
    example:"Selected Scout project + client note: Existing backend is Express/MongoDB. We must preserve their API and replace only the admin frontend.",
    tip:"Architect is a planning aid. Confirm architecture after repository/API discovery before treating it as final."
  },
  {
    id:"requirements",shortName:"Spec",name:"Requirements Agent",category:"delivery",
    oneLine:"Turns project context into implementable requirements and acceptance criteria.",
    whenToUse:["After discovery or kickoff","Before handing work to design/development","When vague requirements are causing rework"],
    paste:["Approved scope or client brief","User roles","Core workflows","Business rules","Known edge cases","Anything explicitly out of scope"],
    does:["Identifies users and journeys","Structures functional requirements","Surfaces missing edge cases","Builds acceptance criteria","Creates a shared implementation reference"],
    output:["Requirements priorities","Implementation actions","Risks","Questions","Structured next steps"],
    example:"Trade account feature: normal users can apply; admin reviews application; admin approves/rejects; approved users become trade accounts and receive trade pricing. Need application status visible to user.",
    tip:"Include business rules, not only screens. “There is an Apply button” is not enough to define behavior."
  },
  {
    id:"delivery-qa",shortName:"Guardian",name:"Delivery QA Agent",category:"delivery",
    oneLine:"Builds practical QA, release and client-handover checks.",
    whenToUse:["Before staging/UAT","Before production release","Before handing a completed project to a client"],
    paste:["Feature/release scope","Critical user journeys","Tech stack","Known risky areas","Deployment environment","Client acceptance requirements"],
    does:["Prioritizes critical test paths","Plans functional/error/security checks","Creates release readiness actions","Highlights regression risk","Structures handover checks"],
    output:["QA priorities","Release actions","Risks","Open questions","Handover/release guidance"],
    example:"Release includes signup/login, trade-account application, admin approval, pricing changes and checkout. Next.js frontend + Express API + MongoDB. Stripe checkout already exists and must not regress.",
    tip:"Use Guardian before every meaningful client release, not only at the end of a large project."
  },
  {
    id:"marketing-growth",shortName:"Growth",name:"Marketing & Growth Agent",category:"growth",
    oneLine:"Creates a focused marketing and demand-generation plan.",
    whenToUse:["When deciding what to market this week/month","When launching a service or product","When marketing activity feels random"],
    paste:["What you sell","Who you want as customers","Current proof/portfolio","Current channels","Time/budget available","What has or has not worked"],
    does:["Clarifies audience and positioning","Prioritizes acquisition channels","Creates actionable content/outreach experiments","Suggests measurable indicators","Keeps activity tied to qualified demand"],
    output:["Marketing priorities","Actions and owners","Risks","Questions","Useful metrics/targets"],
    example:"Small Pakistan-based software team selling Next.js/Node business apps to UK SMEs. Founder has 8 hours/week for sales. LinkedIn profile exists but no regular content. Two ecommerce projects can be used as proof.",
    tip:"Give it a real capacity constraint. A smaller plan you can execute beats 20 channels you cannot maintain."
  },
  {
    id:"client-growth",shortName:"Expand",name:"Client Growth Agent",category:"growth",
    oneLine:"Finds ethical retention, support, upsell and referral opportunities.",
    whenToUse:["After delivering value to a client","Before an account review/check-in","When deciding what ongoing service to offer"],
    paste:["What was delivered","Client’s original goals","Current usage/problems","Outstanding requests","Support history","Results or feedback you actually have"],
    does:["Reviews delivered value","Finds logical ongoing needs","Identifies support/improvement opportunities","Plans the client check-in","Suggests when to request referral/case study"],
    output:["Expansion priorities","Recommended actions","Risks","Questions","Next account step"],
    example:"We delivered a B2B ecommerce enquiry/quotation flow. Client now manually exports orders weekly and has asked twice about reporting. They are happy with the current release and have used us for 5 months.",
    tip:"Expand should start from actual client value. Do not manufacture an upsell that does not help the client."
  },
  {
    id:"case-study",shortName:"Proof",name:"Case Study Agent",category:"growth",
    oneLine:"Turns completed work into credible sales proof.",
    whenToUse:["After a successful delivery","When updating your portfolio","When creating social/website proof for a service"],
    paste:["Client situation/problem","What you actually built","Your role","Challenges","Measurable outcomes or client feedback","Anything confidential that must not be published"],
    does:["Structures the before/work/after story","Separates facts from unsupported marketing claims","Finds the strongest proof points","Creates reusable case-study direction","Identifies evidence still needed"],
    output:["Case-study summary","Proof priorities","Draft narrative","Risks/confidentiality questions","Next evidence to collect"],
    example:"Client had print enquiries handled by email. We built customer enquiry creation, admin quotation, messaging, approval and order conversion. Reduced manual handoffs; no verified time-saved metric yet. Do not reveal client name.",
    tip:"If you do not have a number, say what changed without inventing a percentage."
  },
  {
    id:"operations",shortName:"Ops",name:"Operations Agent",category:"operations",
    oneLine:"Turns repeated work into SOPs, checklists and clear ownership.",
    whenToUse:["When the founder keeps doing the same task","When onboarding an intern","When team work is inconsistent or depends on memory"],
    paste:["The recurring process","Who currently does it","When it starts","Current steps","Common mistakes","What requires founder approval"],
    does:["Defines process trigger and owner","Simplifies the minimum repeatable workflow","Creates quality checks","Clarifies escalation","Makes delegation easier"],
    output:["Process priorities","Actions/ownership","Risks","Questions","SOP direction"],
    example:"Every new lead is currently reviewed by me. Marketing intern researches company/site, checks fit, writes notes, then I decide whether we contact them. We need a repeatable qualification SOP before outreach.",
    tip:"Use Ops to remove founder bottlenecks one recurring process at a time."
  },
  {
    id:"company-advisor",shortName:"Advisor",name:"Company Advisor Agent",category:"operations",
    oneLine:"Helps evaluate company decisions against revenue, capacity and focus.",
    whenToUse:["When choosing between competing priorities","Before hiring/buying/building","When a decision has meaningful opportunity cost"],
    paste:["The decision you need to make","Options you are considering","Revenue/cash constraints","Team capacity","Deadline","What success means","What you are worried about"],
    does:["Frames the real decision","Compares realistic options","Makes trade-offs visible","Identifies downside risk","Recommends a reversible next step where possible"],
    output:["Decision summary","Priorities","Recommended actions","Risks","Questions that could change the recommendation"],
    example:"I work full-time and have 3 interns. I can spend PKR 50k/month. Should we focus the next 8 weeks on client acquisition, improving Revenue Agent OS for demos, or building another SaaS idea? Goal is company revenue, not fundraising.",
    tip:"Advisor gets much better when you provide constraints and alternatives instead of asking a broad “what should I do?” question."
  }
];

export const GUIDE_CATEGORIES=[
  {id:"all",label:"All agents"},
  {id:"sales",label:"Sales"},
  {id:"delivery",label:"Delivery"},
  {id:"growth",label:"Growth"},
  {id:"operations",label:"Operations"}
] as const;
