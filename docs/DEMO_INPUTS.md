# Revenue Agent OS — Demo Input Library

Use these inputs for internal testing and private product demos. Each block is intentionally realistic and safe to paste into the corresponding agent.

> Important: Proposal and Architect are selection-driven. Run Scout first, then choose a ranked opportunity.

## 1. Scout — Opportunity Engine

**Input field:** Search focus (optional)

Describe the kind of work you want Scout to prioritize. You can leave this blank and Scout will build searches from your Company Profile.

**Demo input**

```text
Next.js + Node.js projects involving SaaS dashboards, API integrations, ecommerce or workflow automation. Prefer fixed-price projects above $500, clear requirements, and clients looking for an ongoing technical partner.
```

**Expected output**

- Ranked marketplace opportunities
- Fit score and bid/consider/skip recommendation
- Matched skills and risks
- Original project link
- Suggested bid direction and proposal angle

## 2. Pitch — Proposal Agent

**Input field:** Selected Scout opportunity

Pitch does not need a generic prompt. It uses the exact opportunity selected from Scout plus your Company Profile, so the proposal stays grounded in the real listing.

**Demo input**

```text
DEMO FLOW: Run Scout with its demo search → choose the top demo opportunity → click Create proposal. Pitch will use that opportunity automatically.
```

**Expected output**

- Opening hook
- Full proposal draft
- Recommended price and pricing rationale
- Client questions
- Milestones
- Claims to avoid

## 3. Architect — Project Planner

**Input field:** Selected Scout opportunity

Architect works from a selected Scout opportunity. It turns the listing and your company context into a delivery plan rather than asking you to re-paste the same project.

**Demo input**

```text
DEMO FLOW: Run Scout with its demo search → choose a project → click Plan. Architect will use that selected opportunity automatically.
```

**Expected output**

- Project objective
- Architecture direction
- Delivery phases and timeline
- Team assignments
- Risks and assumptions
- Discovery questions
- Definition of done

## 4. Prospector — Lead Research Agent

**Input field:** Target market & ideal lead context

Tell Prospector exactly who you want to sell to. Give it enough context to define an ICP and research criteria instead of returning a broad list of random companies.

**Demo input**

```text
We want to sell custom Next.js/Node.js development to UK ecommerce companies with 10–100 employees. Best prospects have manual operational reporting, disconnected tools, legacy admin panels, or are hiring for internal software roles. Services we want to sell: internal dashboards, API integrations, workflow automation and customer portals. Prioritize Operations Managers, Heads of Ecommerce and technical founders. Avoid agencies and companies that only need WordPress brochure sites.
```

**Expected output**

- Ideal customer profile
- Qualification criteria
- Buying/need signals
- Lead-source research plan
- Prioritization actions
- Unknowns to validate before outreach

## 5. Reach — Outreach Agent

**Input field:** Prospect research for outreach

Give Reach real prospect facts. It will turn those facts into personalized outreach; it should not invent a relationship, result or pain point.

**Demo input**

```text
Prospect: Northstar Commerce, UK, around 45 employees. Contact: Sarah Khan, Head of Operations. Public observation: their careers page mentions consolidating inventory and sales reporting across Shopify, Amazon and their warehouse platform. They are hiring an operations analyst and currently mention spreadsheets in the job description. We build custom dashboards and API integrations using Next.js, Node.js and PostgreSQL. Goal: start a conversation, not hard-sell. Use a concise LinkedIn message and one follow-up email. Do not claim we know their internal systems beyond the public information above.
```

**Expected output**

- Personalized outreach angle
- First-message draft
- Follow-up approach
- Recommended next action
- Risks/claims to avoid
- Questions that would improve personalization

## 6. Discover — Client Discovery Agent

**Input field:** Client brief or conversation

Paste the client’s words as closely as possible. Discover will separate goals from features, expose missing scope and prepare the questions you should ask before pricing or committing.

**Demo input**

```text
Client message: ‘We need a booking platform for personal trainers. Customers should find trainers, book sessions and pay online. Trainers need calendars and profiles. We want the first version in around 6 weeks.’

What we know: web app only for v1; client operates in the UK; around 30 trainers at launch. They have not chosen a payment provider. Unknowns: cancellation/refund rules, recurring bookings, trainer approval, admin permissions, notifications, commissions, reporting, existing customer data and whether trainers set their own prices. Budget has not been discussed. Our goal is to prepare for a 45-minute discovery call and know what must be answered before we estimate.
```

**Expected output**

- Business-problem summary
- Discovery priorities
- High-value client questions
- Scope gaps and dependencies
- Risks/unknowns
- Recommended decision after discovery

## 7. Estimate — Estimator Agent

**Input field:** Confirmed scope for estimation

Estimate works best after discovery. Give it confirmed scope and known constraints so it can expose assumptions and produce defensible commercial guidance.

**Demo input**

```text
Project: customer subscription portal. Stack preference: Next.js frontend, Node.js API, PostgreSQL. Roles: customer and admin. Must-have: signup/login, customer profile, subscription plans, Stripe checkout and webhook handling, invoices, plan upgrade/cancel, admin customer list, admin subscription status, email notifications and basic audit trail. Figma designs are complete. No mobile app. Client expects delivery in 8 weeks. Team available: 1 backend developer about 25h/week, 1 frontend developer about 30h/week, UI/UX support 8h/week. Unknowns: exact Stripe tax requirements and migration of around 2,000 existing customers. We want a fixed-price quote with milestones and explicit contingency assumptions.
```

**Expected output**

- Scope/workstream breakdown
- Effort and pricing direction
- Assumptions
- Risk/contingency areas
- Milestone structure
- Questions that can materially change the estimate

## 8. Spec — Requirements Agent

**Input field:** Feature or project context to turn into requirements

Spec converts messy project context into implementation-ready requirements. Include user roles and business rules, not just a feature name.

**Demo input**

```text
Feature: Trade Account application for an ecommerce website. Existing users sign up as normal customer accounts. Logged-in customers who are not already trade users should see ‘Apply for Trade Account’. Application collects company name, registration number, VAT number if available, business type, website, expected monthly spend, billing address, contact phone and an optional note. Statuses: pending, approved, rejected. Admin reviews applications from admin panel and can approve/reject with an internal note. On approval, user account type becomes trade and user receives an email. Users cannot submit another application while one is pending. Rejected users may reapply after 30 days. We need functional requirements, user stories, validation rules, permissions, edge cases and acceptance criteria.
```

**Expected output**

- Functional requirements
- User stories/journeys
- Acceptance criteria
- Validation and permission rules
- Edge cases
- Open questions
- Shared definition of done

## 9. Guardian — Delivery QA Agent

**Input field:** Feature/release context for QA

Guardian builds a risk-based QA and release checklist. Tell it what changed and what failure would hurt the client most.

**Demo input**

```text
Release candidate: ecommerce print-enquiry checkout flow. Customer can create an enquiry with products and artwork, receive an admin quote, accept/decline quote, enter shipping address and convert accepted enquiry to an order. Admin can review items/artwork, send messages, set print/additional/shipping/discount costs and submit quote. Critical risks: duplicate orders on repeated clicks, artwork URL missing, incorrect quote totals, accepting expired quotes, unauthorized access to another customer's enquiry, guest/auth cart inconsistencies, mobile checkout layout and failed payment/order API handling. Environments: Chrome desktop/mobile and Safari iPhone. Need functional test matrix, security/error-state checks, pre-release checklist and client handover checklist.
```

**Expected output**

- Risk-based test matrix
- Critical path tests
- Permission/security checks
- Failure/error-state coverage
- Release checklist
- Handover criteria
- Questions before approval

## 10. Growth — Marketing & Growth Agent

**Input field:** Offer, audience & growth goal

Growth needs a specific offer and audience. Give it your real capacity so it produces an executable growth plan instead of generic content ideas.

**Demo input**

```text
Company: small software studio in Pakistan. Offer: custom Next.js/Node.js SaaS development, internal dashboards, integrations and workflow automation for UK SMEs. Current team: founder + 3 interns. Founder has a full-time job and can spend around 15 hours/week on company growth/delivery outside client work. Marketing budget: PKR 30,000/month. Existing proof: ecommerce enquiry/quotation system, security reporting automation and this Revenue Agent OS product; no strong public case-study metrics yet. Current channels: LinkedIn founder profile, cold email and Upwork. Goal for next 6 weeks: generate at least 8 qualified sales conversations without posting low-quality daily content. Build positioning, weekly content/outreach plan, experiments and metrics.
```

**Expected output**

- Positioning recommendation
- Channel priorities
- Weekly marketing plan
- Content/outreach experiments
- Metrics to track
- Risks and next actions

## 11. Expand — Client Growth Agent

**Input field:** Existing client relationship & delivered value

Expand looks for ethical retention and upsell opportunities based on value already delivered. Give it facts about the relationship, not a generic request to sell more.

**Demo input**

```text
Client: ecommerce merchandise company. We have worked together for 5 months. Delivered: product/shop improvements, print-enquiry workflow, admin quotation, customer messaging, enquiry-to-order conversion and multiple backend fixes. They frequently ask for manual reporting changes and still export order/enquiry data into spreadsheets for management reporting. Relationship is positive and they usually approve small improvements quickly. No formal maintenance contract. Possible needs we have observed: reporting dashboard, automated weekly sales/enquiry reporting, ongoing maintenance SLA and more admin workflow automation. We do not want an aggressive upsell; prepare a value-based check-in and recommend which expansion opportunity is most useful to raise first.
```

**Expected output**

- Retention/expansion opportunities
- Best next offer
- Client check-in approach
- Value framing
- Risks/timing concerns
- Referral or case-study opportunity

## 12. Proof — Case Study Agent

**Input field:** Completed project evidence

Proof turns delivery facts into credible sales material. Give it evidence and explicitly state metrics you do NOT have so it never invents results.

**Demo input**

```text
Client must remain anonymous: UK promotional-products ecommerce company. Before: print enquiries were fragmented across manual messages and staff had to reconstruct product/customization details before quoting. Work delivered: authenticated customer enquiry creation, multiple products with print customizations and artwork, admin enquiry list/detail, quotation with print/additional/shipping/discount costs, customer/admin messaging, quote acceptance/decline, shipping details and conversion to an order. Stack: Next.js, TypeScript, Redux Toolkit, Node/Express, MongoDB. My role: backend/API architecture plus frontend integration and debugging. Observable outcome: the enquiry-to-quote-to-order process now exists in one system and preserves structured customization information. We do NOT have a verified percentage for time saved or revenue improvement. Do not invent metrics. Create a portfolio case study and identify evidence we should collect next.
```

**Expected output**

- Credible before/work/after narrative
- Case-study draft
- Strong proof points
- Claims that must stay qualified
- Confidentiality risks
- Evidence/metrics to collect next

## 13. Ops — Operations Agent

**Input field:** Recurring process that needs an SOP

Ops is for repeated work. Describe how the process actually happens todayâeven if it is messyâso the agent can make it repeatable and delegable.

**Demo input**

```text
Process to systemize: qualifying a new outbound lead before contact. Trigger: marketing intern finds a company that may fit our services. Current process: intern sends the company URL to founder; founder checks website/LinkedIn, guesses whether there is a need, tells intern whether to continue, intern researches contact, then founder reviews outreach copy. Problems: founder becomes bottleneck, research quality varies, reasons for rejection are not recorded, duplicate leads can appear, and there is no minimum evidence standard. Team: marketing/sales intern owns research; founder should only approve high-potential leads and final high-value outreach. Tools currently available: spreadsheet/Notion, LinkedIn, company websites and Revenue Agent OS. Target: intern should complete qualification in under 20 minutes and escalate only leads scoring above a clear threshold. Create SOP, checklist, ownership, quality gate and escalation rules.
```

**Expected output**

- Repeatable SOP
- Owners and handoffs
- Quality checklist
- Escalation rules
- Failure points
- Recommended operational metrics

## 14. Advisor — Company Advisor Agent

**Input field:** Decision, options & constraints

Advisor is strongest when you give it a real decision with competing options. Include constraints and opportunity cost so it can make an actual recommendation.

**Demo input**

```text
Decision: what should our company prioritize for the next 8 weeks? Option A: focus heavily on acquiring service clients through Upwork/outbound. Option B: spend most capacity polishing Revenue Agent OS and demoing it privately. Option C: split effort equally. Constraints: founder has a full-time job and around 20 company hours/week; team has 3 unpaid interns (frontend, UI/UX, marketing/sales) who are still learning; monthly cash budget around PKR 50,000; no dependable recurring company revenue yet. Revenue Agent OS has a working private beta but no paying users. Goal: maximize probability of real company revenue and learning, not fundraising or vanity metrics. We also do not want the founder to become the only person who can deliver everything. Recommend a priority, allocation of weekly effort, milestones for 8 weeks, stop/continue signals and biggest downside risks.
```

**Expected output**

- Decision framing
- Option comparison
- Recommended priority
- Concrete next actions
- Trade-offs/risks
- Questions that could change the recommendation
