export type AgentInputHelp={
  id:string;
  label:string;
  placeholder:string;
  instruction:string;
  checklist:string[];
  demoInput:string;
  expected:string[];
};

export const AGENT_INPUT_HELP:Record<string,AgentInputHelp>={
  "opportunity-engine":{
    id:"opportunity-engine",
    label:"Search focus (optional)",
    placeholder:"Example: Next.js + Node.js SaaS dashboards, integrations or ecommerce projects above $500",
    instruction:"Describe the kind of work you want Scout to prioritize. You can leave this blank and Scout will build searches from your Company Profile.",
    checklist:["Preferred technology or service","Project type or niche","Minimum budget or rate","Anything you want Scout to avoid"],
    demoInput:"Next.js + Node.js projects involving SaaS dashboards, API integrations, ecommerce or workflow automation. Prefer fixed-price projects above $500, clear requirements, and clients looking for an ongoing technical partner.",
    expected:["Ranked marketplace opportunities","Fit score and bid/consider/skip recommendation","Matched skills and risks","Original project link","Suggested bid direction and proposal angle"]
  },
  "proposal":{
    id:"proposal",
    label:"Selected Scout opportunity",
    placeholder:"Select a ranked opportunity in Scout, then click Create proposal.",
    instruction:"Pitch does not need a generic prompt. It uses the exact opportunity selected from Scout plus your Company Profile, so the proposal stays grounded in the real listing.",
    checklist:["Select a Scout result","Make sure Company Profile evidence is accurate","Review price direction before sending","Never send without human review"],
    demoInput:"DEMO FLOW: Run Scout with its demo search → choose the top demo opportunity → click Create proposal. Pitch will use that opportunity automatically.",
    expected:["Opening hook","Full proposal draft","Recommended price and pricing rationale","Client questions","Milestones","Claims to avoid"]
  },
  "project-planner":{
    id:"project-planner",
    label:"Selected Scout opportunity",
    placeholder:"Select a ranked opportunity in Scout, then click Plan.",
    instruction:"Architect works from a selected Scout opportunity. It turns the listing and your company context into a delivery plan rather than asking you to re-paste the same project.",
    checklist:["Select a Scout result","Confirm the job description is complete enough","Review assumptions","Use discovery questions before promising a timeline"],
    demoInput:"DEMO FLOW: Run Scout with its demo search → choose a project → click Plan. Architect will use that selected opportunity automatically.",
    expected:["Project objective","Architecture direction","Delivery phases and timeline","Team assignments","Risks and assumptions","Discovery questions","Definition of done"]
  },
  "lead-research":{
    id:"lead-research",
    label:"Target market & ideal lead context",
    placeholder:"Paste the niche, geography, company size, service you sell and signals that make a prospect interesting...",
    instruction:"Tell Prospector exactly who you want to sell to. Give it enough context to define an ICP and research criteria instead of returning a broad list of random companies.",
    checklist:["Industry/niche","Country or region","Company size","Service you want to sell","Buying/need signals","Who the likely decision-maker is"],
    demoInput:"We want to sell custom Next.js/Node.js development to UK ecommerce companies with 10–100 employees. Best prospects have manual operational reporting, disconnected tools, legacy admin panels, or are hiring for internal software roles. Services we want to sell: internal dashboards, API integrations, workflow automation and customer portals. Prioritize Operations Managers, Heads of Ecommerce and technical founders. Avoid agencies and companies that only need WordPress brochure sites.",
    expected:["Ideal customer profile","Qualification criteria","Buying/need signals","Lead-source research plan","Prioritization actions","Unknowns to validate before outreach"]
  },
  "outreach":{
    id:"outreach",
    label:"Prospect research for outreach",
    placeholder:"Paste who the prospect is, what you observed, the likely problem, contact role and what you can genuinely offer...",
    instruction:"Give Reach real prospect facts. It will turn those facts into personalized outreach; it should not invent a relationship, result or pain point.",
    checklist:["Company and contact","What the company does","Specific observation/trigger","Likely business problem","Relevant service/capability","Preferred channel if known"],
    demoInput:"Prospect: Northstar Commerce, UK, around 45 employees. Contact: Sarah Khan, Head of Operations. Public observation: their careers page mentions consolidating inventory and sales reporting across Shopify, Amazon and their warehouse platform. They are hiring an operations analyst and currently mention spreadsheets in the job description. We build custom dashboards and API integrations using Next.js, Node.js and PostgreSQL. Goal: start a conversation, not hard-sell. Use a concise LinkedIn message and one follow-up email. Do not claim we know their internal systems beyond the public information above.",
    expected:["Personalized outreach angle","First-message draft","Follow-up approach","Recommended next action","Risks/claims to avoid","Questions that would improve personalization"]
  },
  "client-discovery":{
    id:"client-discovery",
    label:"Client brief or conversation",
    placeholder:"Paste the client's message/brief plus what you already know, deadline, budget and anything that is unclear...",
    instruction:"Paste the client’s words as closely as possible. Discover will separate goals from features, expose missing scope and prepare the questions you should ask before pricing or committing.",
    checklist:["Original client request","Business goal","Known user roles/features","Deadline","Budget if known","Unknown/contradictory areas"],
    demoInput:"Client message: ‘We need a booking platform for personal trainers. Customers should find trainers, book sessions and pay online. Trainers need calendars and profiles. We want the first version in around 6 weeks.’\n\nWhat we know: web app only for v1; client operates in the UK; around 30 trainers at launch. They have not chosen a payment provider. Unknowns: cancellation/refund rules, recurring bookings, trainer approval, admin permissions, notifications, commissions, reporting, existing customer data and whether trainers set their own prices. Budget has not been discussed. Our goal is to prepare for a 45-minute discovery call and know what must be answered before we estimate.",
    expected:["Business-problem summary","Discovery priorities","High-value client questions","Scope gaps and dependencies","Risks/unknowns","Recommended decision after discovery"]
  },
  "estimator":{
    id:"estimator",
    label:"Confirmed scope for estimation",
    placeholder:"Paste the agreed features, integrations, user roles, deadline, team capacity and remaining assumptions...",
    instruction:"Estimate works best after discovery. Give it confirmed scope and known constraints so it can expose assumptions and produce defensible commercial guidance.",
    checklist:["Must-have scope","User roles","Integrations","Design status","Timeline","Available team","Known unknowns","Pricing preference"],
    demoInput:"Project: customer subscription portal. Stack preference: Next.js frontend, Node.js API, PostgreSQL. Roles: customer and admin. Must-have: signup/login, customer profile, subscription plans, Stripe checkout and webhook handling, invoices, plan upgrade/cancel, admin customer list, admin subscription status, email notifications and basic audit trail. Figma designs are complete. No mobile app. Client expects delivery in 8 weeks. Team available: 1 backend developer about 25h/week, 1 frontend developer about 30h/week, UI/UX support 8h/week. Unknowns: exact Stripe tax requirements and migration of around 2,000 existing customers. We want a fixed-price quote with milestones and explicit contingency assumptions.",
    expected:["Scope/workstream breakdown","Effort and pricing direction","Assumptions","Risk/contingency areas","Milestone structure","Questions that can materially change the estimate"]
  },
  "requirements":{
    id:"requirements",
    label:"Feature or project context to turn into requirements",
    placeholder:"Paste the business goal, user roles, workflows, must-have features, rules and known edge cases...",
    instruction:"Spec converts messy project context into implementation-ready requirements. Include user roles and business rules, not just a feature name.",
    checklist:["Business goal","User roles","Primary user journeys","Business rules","Permissions","Integrations","Known edge/error cases","Out-of-scope items"],
    demoInput:"Feature: Trade Account application for an ecommerce website. Existing users sign up as normal customer accounts. Logged-in customers who are not already trade users should see ‘Apply for Trade Account’. Application collects company name, registration number, VAT number if available, business type, website, expected monthly spend, billing address, contact phone and an optional note. Statuses: pending, approved, rejected. Admin reviews applications from admin panel and can approve/reject with an internal note. On approval, user account type becomes trade and user receives an email. Users cannot submit another application while one is pending. Rejected users may reapply after 30 days. We need functional requirements, user stories, validation rules, permissions, edge cases and acceptance criteria.",
    expected:["Functional requirements","User stories/journeys","Acceptance criteria","Validation and permission rules","Edge cases","Open questions","Shared definition of done"]
  },
  "delivery-qa":{
    id:"delivery-qa",
    label:"Feature/release context for QA",
    placeholder:"Paste what is being released, critical flows, roles, integrations, risks and environments that need testing...",
    instruction:"Guardian builds a risk-based QA and release checklist. Tell it what changed and what failure would hurt the client most.",
    checklist:["Release scope","Critical user journeys","Roles/permissions","External integrations","Known risky areas","Browser/device needs","Deployment/handover expectations"],
    demoInput:"Release candidate: ecommerce print-enquiry checkout flow. Customer can create an enquiry with products and artwork, receive an admin quote, accept/decline quote, enter shipping address and convert accepted enquiry to an order. Admin can review items/artwork, send messages, set print/additional/shipping/discount costs and submit quote. Critical risks: duplicate orders on repeated clicks, artwork URL missing, incorrect quote totals, accepting expired quotes, unauthorized access to another customer's enquiry, guest/auth cart inconsistencies, mobile checkout layout and failed payment/order API handling. Environments: Chrome desktop/mobile and Safari iPhone. Need functional test matrix, security/error-state checks, pre-release checklist and client handover checklist.",
    expected:["Risk-based test matrix","Critical path tests","Permission/security checks","Failure/error-state coverage","Release checklist","Handover criteria","Questions before approval"]
  },
  "marketing-growth":{
    id:"marketing-growth",
    label:"Offer, audience & growth goal",
    placeholder:"Paste what you sell, who you want to reach, proof you have, available channels/time/budget and the result you want...",
    instruction:"Growth needs a specific offer and audience. Give it your real capacity so it produces an executable growth plan instead of generic content ideas.",
    checklist:["Offer/service/product","Ideal audience","Current positioning","Proof/assets","Channels available","Weekly time/budget","Target outcome and timeframe"],
    demoInput:"Company: small software studio in Pakistan. Offer: custom Next.js/Node.js SaaS development, internal dashboards, integrations and workflow automation for UK SMEs. Current team: founder + 3 interns. Founder has a full-time job and can spend around 15 hours/week on company growth/delivery outside client work. Marketing budget: PKR 30,000/month. Existing proof: ecommerce enquiry/quotation system, security reporting automation and this Revenue Agent OS product; no strong public case-study metrics yet. Current channels: LinkedIn founder profile, cold email and Upwork. Goal for next 6 weeks: generate at least 8 qualified sales conversations without posting low-quality daily content. Build positioning, weekly content/outreach plan, experiments and metrics.",
    expected:["Positioning recommendation","Channel priorities","Weekly marketing plan","Content/outreach experiments","Metrics to track","Risks and next actions"]
  },
  "client-growth":{
    id:"client-growth",
    label:"Existing client relationship & delivered value",
    placeholder:"Paste what you delivered, current client situation, outstanding needs, feedback and relationship history...",
    instruction:"Expand looks for ethical retention and upsell opportunities based on value already delivered. Give it facts about the relationship, not a generic request to sell more.",
    checklist:["What was delivered","Observable client value","Current usage/problems","Open requests","Relationship sentiment","Potential next needs","Anything you should not pitch"],
    demoInput:"Client: ecommerce merchandise company. We have worked together for 5 months. Delivered: product/shop improvements, print-enquiry workflow, admin quotation, customer messaging, enquiry-to-order conversion and multiple backend fixes. They frequently ask for manual reporting changes and still export order/enquiry data into spreadsheets for management reporting. Relationship is positive and they usually approve small improvements quickly. No formal maintenance contract. Possible needs we have observed: reporting dashboard, automated weekly sales/enquiry reporting, ongoing maintenance SLA and more admin workflow automation. We do not want an aggressive upsell; prepare a value-based check-in and recommend which expansion opportunity is most useful to raise first.",
    expected:["Retention/expansion opportunities","Best next offer","Client check-in approach","Value framing","Risks/timing concerns","Referral or case-study opportunity"]
  },
  "case-study":{
    id:"case-study",
    label:"Completed project evidence",
    placeholder:"Paste the client's original problem, what you built, your role, challenges, outcomes and anything confidential...",
    instruction:"Proof turns delivery facts into credible sales material. Give it evidence and explicitly state metrics you do NOT have so it never invents results.",
    checklist:["Before/problem","What you built","Your role","Technical/business challenge","Outcome/feedback","Verified metrics","Confidential details","Target audience for case study"],
    demoInput:"Client must remain anonymous: UK promotional-products ecommerce company. Before: print enquiries were fragmented across manual messages and staff had to reconstruct product/customization details before quoting. Work delivered: authenticated customer enquiry creation, multiple products with print customizations and artwork, admin enquiry list/detail, quotation with print/additional/shipping/discount costs, customer/admin messaging, quote acceptance/decline, shipping details and conversion to an order. Stack: Next.js, TypeScript, Redux Toolkit, Node/Express, MongoDB. My role: backend/API architecture plus frontend integration and debugging. Observable outcome: the enquiry-to-quote-to-order process now exists in one system and preserves structured customization information. We do NOT have a verified percentage for time saved or revenue improvement. Do not invent metrics. Create a portfolio case study and identify evidence we should collect next.",
    expected:["Credible before/work/after narrative","Case-study draft","Strong proof points","Claims that must stay qualified","Confidentiality risks","Evidence/metrics to collect next"]
  },
  "operations":{
    id:"operations",
    label:"Recurring process that needs an SOP",
    placeholder:"Paste the repeated process, trigger, people involved, current steps, common mistakes and what still needs founder approval...",
    instruction:"Ops is for repeated work. Describe how the process actually happens today—even if it is messy—so the agent can make it repeatable and delegable.",
    checklist:["Process trigger","Current owner(s)","Current steps","Tools/data used","Common mistakes","Approval/escalation points","Desired turnaround time"],
    demoInput:"Process to systemize: qualifying a new outbound lead before contact. Trigger: marketing intern finds a company that may fit our services. Current process: intern sends the company URL to founder; founder checks website/LinkedIn, guesses whether there is a need, tells intern whether to continue, intern researches contact, then founder reviews outreach copy. Problems: founder becomes bottleneck, research quality varies, reasons for rejection are not recorded, duplicate leads can appear, and there is no minimum evidence standard. Team: marketing/sales intern owns research; founder should only approve high-potential leads and final high-value outreach. Tools currently available: spreadsheet/Notion, LinkedIn, company websites and Revenue Agent OS. Target: intern should complete qualification in under 20 minutes and escalate only leads scoring above a clear threshold. Create SOP, checklist, ownership, quality gate and escalation rules.",
    expected:["Repeatable SOP","Owners and handoffs","Quality checklist","Escalation rules","Failure points","Recommended operational metrics"]
  },
  "company-advisor":{
    id:"company-advisor",
    label:"Decision, options & constraints",
    placeholder:"Paste the decision you need to make, realistic options, revenue/cash constraints, team capacity, deadline and what success means...",
    instruction:"Advisor is strongest when you give it a real decision with competing options. Include constraints and opportunity cost so it can make an actual recommendation.",
    checklist:["Decision to make","2–4 realistic options","Revenue/cash position","Team/time capacity","Deadline","Success metric","Main risks/fears","What is reversible vs hard to reverse"],
    demoInput:"Decision: what should our company prioritize for the next 8 weeks? Option A: focus heavily on acquiring service clients through Upwork/outbound. Option B: spend most capacity polishing Revenue Agent OS and demoing it privately. Option C: split effort equally. Constraints: founder has a full-time job and around 20 company hours/week; team has 3 unpaid interns (frontend, UI/UX, marketing/sales) who are still learning; monthly cash budget around PKR 50,000; no dependable recurring company revenue yet. Revenue Agent OS has a working private beta but no paying users. Goal: maximize probability of real company revenue and learning, not fundraising or vanity metrics. We also do not want the founder to become the only person who can deliver everything. Recommend a priority, allocation of weekly effort, milestones for 8 weeks, stop/continue signals and biggest downside risks.",
    expected:["Decision framing","Option comparison","Recommended priority","Concrete next actions","Trade-offs/risks","Questions that could change the recommendation"]
  }
};

export function getAgentInputHelp(id:string){return AGENT_INPUT_HELP[id];}
