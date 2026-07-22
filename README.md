<p align="center">
  <img src="assets/policyforge-banner.png" alt="PolicyForge banner showing organizational policy being forged into executable controls and governance dashboards" width="100%" />
</p>

<p align="center">
  <strong>PolicyForge turns organizational policy into controls for real AI agents, preserves the evidence behind every consequential decision, and finds the decisions that need correction when the rules change.</strong>
</p>

## Table of Contents

- [Project Overview](#project-overview)
- [Feature](#feature)
- [Installation](#installation)
- [Tech Stack](#tech-stack)
- [Delieverables](#delieverables)
- [Contribution](#contribution)
- [Disclaimer](#disclaimer)

## Project Overview

PolicyForge is an AI governance control center that converts organizational policies into understandable and testable controls for enterprise AI agents. It connects policy intake, agent approval, governed runtime actions, decision evidence, historical replay, and controlled remediation in one workflow.

This repository contains an interactive, deterministic demonstration of PolicyForge. The primary story follows a recruitment policy from document ingestion through runtime enforcement, evidence reconstruction, version replay, and recall.

The prototype demonstrates how an organization could:

- Identify and analyze a controlled policy document.
- Map cited policy clauses to an AI agent's capabilities and data access.
- Test controls before approving an agent for use.
- Intercept governed actions and require human review when necessary.
- Reconstruct consequential decisions without exposing private model chain-of-thought.
- Replay historical decisions under a proposed policy change.
- Create a controlled recall for decisions that require reassessment.

## Feature

### Policy intake and analysis

- Upload a prepared recruitment-policy PDF.
- Verify document identity and integrity with a SHA-256 fingerprint.
- Run staged policy analysis and inspect clause-to-control mappings.
- Compare source policy text, normalized Policy IR, agent capabilities, and compiled runtime actions.
- Reject unsupported documents instead of generating unrelated prepared results.

### Agent governance

- Shows agent capabilities, owner, model, tools, permissions, connected systems, and risk level.
- Map approved policy controls to the agent's declared capabilities.
- Resolve policy ambiguity before deployment.
- Test representative `ALLOW`, `TRANSFORM`, `HUMAN REVIEW`, and `BLOCK` scenarios.
- Approve and activate the agent only after its governance checks pass.

### Governed runtime action

- Detect and remove direct identifiers before external-model inference.
- Record model and agent outputs.
- Pause a consequential recommendation when policy requires human review.
- Preserve the accountable human decision.

### Decision Capsule

- Reconstruct the evidence chain from recorded input to external consequence.
- Separate data transformation, model output, agent recommendation, policy determination, and human action.
- Display cited policy and version information.
- Export structured decision evidence as JSON.
- Provide a plain-language candidate explanation and human-reassessment path.

### Policy Time Machine

- Compare the active and proposed recruitment-policy versions.
- Replay prepared historical decisions against the proposed policy.
- Identify changed decisions and downstream consequences.
- Link replay findings back to their original Decision Capsules.

### Recall workflow

- Create a recall from policy-replay findings.
- Scope affected decisions for independent human reassessment.
- Preserve original evidence while tracking remediation work.
- Export a structured recall report as JSON.

## Installation

### Prerequisites

- Node.js 20+
- Python 3.11+
- A browser with support for the Web Crypto API

### Clone the repository

```bash
git clone https://github.com/25006675-png/Hackattack_policyforge.git
cd Hackattack_policyforge
```

### Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173).

---

### Build and verify

```bash
npm run build
npm run verify:fixtures
```

### Preview the production build

```bash
npm run preview
```
---
### Recommended Workflow

1. Open **Policies** and use the prepared Recruitment Policy v1.4 PDF.
2. Run the staged document analysis and inspect the clause-to-control mapping.
3. Review the Candidate Screening Agent manifest, resolve its v1.4 ambiguity, and run four recruitment-specific tests.
4. Activate the agent, process candidate application `ACT-8842`, and complete human review.
5. Inspect Decision Capsule `PF-2841` and export its evidence.
6. Replay the decision under proposed Recruitment Policy v1.5.
7. Create and export Recall `RC-017`.

> [!Note]
> The prepared v1.4 and v1.5 PDFs live in `public/policy-docs` and are served to users at `/policy-docs/`.
> 
> Use **Help** in the sidebar to find the guided path and reveal the two-step 

## Tech Stack

### Frontend

| Layer | Technology 
| --- | --- | 
| Logic | React 19 
| Language | TypeScript 
| Build tooling | Vite 8 
| Styling | CSS 
| State | React state 
| Document integrity | Web Crypto API 

### Backend

| Layer | Technology 
| --- | --- | 
| API | FastAPI
| PDF Text Extraction | PyMuPDF
| LLM | OpenAI API
| Logic | Python
| Database | Supabase Postgres
| Auth | Supabase Auth
| Background jobs | Celery

## Delieverables

Proposal: [Click Me]()  
Pitch Deck: [Click Me]()  
Presentation Video: [Click Me]()  

## Contribution

Contributions that improve the demonstrator, accessibility, documentation, test coverage, or production architecture are welcome.


## Disclaimer
This project is developed for Hack Attack 3.0.  
Case Study 3 - AI Governance & Responsible AI in Enterprise

---
### Note
PolicyForge in this repository is a competition prototype and product demonstrator. The current implementation is a frontend-first application that uses prepared fixtures and simulated service responses. 

The prepared policy documents are synthetic controlled documents and contain no real candidate or company data. The browser verifies their SHA-256 fingerprints before enabling deterministic analysis.

The interface and generated artifacts are intended to demonstrate a responsible AI-governance workflow. They are not legal, compliance, employment, security, or regulatory advice and should not be used as the sole basis for consequential decisions.

---
### Future Implemention

We will develop PolicyForge from its current demo prototype into a live and fully functional production product. The production version will replace prepared fixtures and simulated operations with secure backend services, persistent databases, real policy ingestion and compilation, enterprise authentication, live AI-agent and business-system integrations, scalable runtime enforcement, durable evidence storage, automated replay and recall workflows, and production-grade monitoring, security, resilience, and disaster recovery.

---

<div align="center">
  <strong>Developed by team DsAi</strong>
  <br>
  <strong><em>© Hack Attack 3.0<em>
</div>