# PolicyForge Pitch and Demo Plan

## Core Message

> PolicyForge governs AI agents before they act, explains every consequential decision, and finds what must be corrected when policies change.

The pitch should present one continuous story. Do not demonstrate separate features without showing how they connect.

```text
Analyse the active policy
        ↓
Approve the agent
        ↓
Govern a candidate decision
        ↓
Trace the evidence
        ↓
Change the policy
        ↓
Replay the past
        ↓
Recall affected decisions
```

## Technical Architecture in One Minute

PolicyForge sits between enterprise systems and observable agent actions:

```text
Policy PDF / policy portal
        ↓
Document Ingestion Service
        ↓
Versioned Policy IR with source citations
        ↓
Policy Compiler + registered Agent Manifest
        ↓
Policy Enforcement Point intercepts the action
        ↓
Policy Decision Point returns
ALLOW / TRANSFORM / HUMAN REVIEW / BLOCK
        ↓
Append-only evidence log → deterministic replay → idempotent recall
```

Use the terms only with their practical meaning:

- **Policy IR** is the structured representation of clauses, conditions, actors, data, exceptions, versions, and citations.
- **Agent Manifest** declares the agent owner, model, tools, permissions, data access, connected systems, and actions.
- **Policy Enforcement Point (PEP)** intercepts an observable tool call or proposed action before consequence.
- **Policy Decision Point (PDP)** evaluates that action against approved controls and returns a cited outcome.
- **Append-only evidence** preserves what happened without claiming access to private model chain-of-thought.
- **Deterministic replay** evaluates stored action contexts against an immutable proposed-policy snapshot.
- **Idempotent recall** prevents duplicate reassessment tasks and appends corrections without rewriting original decisions.

The offline demo recognizes two prepared PDFs by SHA-256 content fingerprint. A production deployment would replace that fixture registry with document extraction, OCR, policy compilation, runtime telemetry, and evidence services.

## Opening Problem

Organizations are adopting AI agents faster than governance teams can approve and control them.

A written policy may say:

- Candidate data must be protected.
- Protected characteristics must not influence recruitment.
- AI must not make final hiring decisions alone.
- People affected by AI must receive an explanation and a review pathway.

But a document cannot inspect an agent, stop an unsafe action, explain a real decision, or identify the people affected when a policy changes.

Suggested opening:

> Companies already have AI policies. The problem is that their AI agents cannot follow a PDF. PolicyForge turns those policies into visible controls for real agents, records the complete story behind important decisions, and lets organizations repair the past when the rules change.

## The Demonstration Story

### Scene 0 — Analyse the controlled policy

Start on the Governance Overview. The Candidate Screening Agent is awaiting approval, and its primary action is `Analyse policy first`. Select it to open Policies, then choose `Northstar-Recruitment-Policy-v1.4.pdf`.

The prepared document is a six-page controlled policy with document owner, approval authority, effective date, numbered clauses, change history, and stable citations. PolicyForge verifies its SHA-256 fingerprint before analysis.

Select `Analyse policy` and narrate the real production path while the nine evidence-producing stages run:

```text
Verify document integrity
Extract pages, headings, tables, and metadata
Resolve scope, status, version, and owner
Identify obligations, prohibitions, conditions, and exceptions
Classify actors, candidate data, actions, and consequences
Map requirements to the Candidate Screening Agent Manifest
Check ambiguity and cross-clause conflicts
Compile cited runtime controls
Validate the four recruitment scenarios
```

Open the cited analysis and show one complete mapping:

```text
Policy §4.2
Candidate identity must be removed before external inference
        ↓
Policy IR condition
Candidate identifiers + external destination
        ↓
Agent Manifest capability
Read résumés + request TalentModel inference
        ↓
CTL-021 · TRANSFORM
Remove identifiers, record transformation, release approved payload
```

Presenter message:

> PolicyForge does not ask a model to invent company policy. The ingestion service preserves source coordinates, the Policy IR normalizes the requirement, and an authorized person approves the compiled control. Every runtime decision remains linked to the source clause and policy version.

Return to the Governance Overview or continue directly to the Candidate Screening Agent.

### Scene 1 — A real agent needs approval

If you returned to the Governance Overview, use the main attention card to re-establish the agent and select `Review Agent`.

The main attention card shows:

```text
Candidate Screening Agent                         Approval required

Reads candidate résumés
Calls an external AI model
Produces employment recommendations

3 high-risk capabilities detected
```

Presenter message:

> HR wants to deploy a Candidate Screening Agent. Before it can go live, the organization needs to understand its data access, actions, and effect on candidates.

On the Agent Governance page, open the Agent Manifest and show how PolicyForge knows the configured boundary:

```text
Northstar ATS        Signed application webhook
TalentModel API      Restricted external inference over mTLS
PolicyForge PEP      Runtime action interception

Allowed              applications:read, recommendations:write, notices:draft
Blocked              outcomes:finalize, candidates:delete
```

### Scene 2 — PolicyForge generates agent-specific controls

The Agent Governance Workspace displays:

- Agent capabilities on the left.
- Proposed controls in the center.
- Original policy evidence on the right.

Select `Analyse Agent` and reveal the staged analysis:

```text
Inspecting capabilities…
Mapping accessed data…
Finding applicable policies…
Generating controls…
```

Show the resulting controls:

```text
Candidate identity + external model
→ Remove identity before inference

Negative candidate recommendation
→ Require authorized HR review

Protected characteristics + candidate ranking
→ Block and record

Candidate outcome
→ Disclose AI involvement and provide reconsideration
```

Presenter message:

> PolicyForge does not ask AI to decide what is ethical. It drafts controls from the agent's capabilities and the organization's existing policies. An authorized person resolves ambiguity, tests the controls, and approves deployment.

Resolve the question about who may approve a candidate rejection. Run the four prepared tests and select `Approve and Deploy`.

The test set must remain recruitment-specific:

1. Job-related ranking → `ALLOW`.
2. External inference after identity removal → `TRANSFORM + ALLOW`.
3. Negative recommendation → `HUMAN REVIEW`.
4. Protected-attribute profiling → `BLOCK`.

The status changes to:

```text
Active — Governed by Recruitment Policy v1.4
```

### Scene 3 — Governance changes the agent's behavior

Run the prepared candidate application.

Establish the system boundary before processing:

```text
Northstar ATS
        ↓ signed application event
Candidate Screening Agent
        ↓ proposed tool call
PolicyForge PEP / PDP
        ↓ cited decision and transformation
TalentModel API
        ↓ recorded model output
PolicyForge PEP / PDP
        ↓ HUMAN REVIEW
HR reviewer
        ↓ final outcome returned to the ATS
```

Show:

```text
✓ Candidate identity detected
✓ Identity removed before external inference
✓ Qualifications extracted
! Negative recommendation requires human review
```

Open the HR review panel. The agent recommends rejection because it classified an 18-month caregiving period as an unexplained employment gap.

The presenter approves the recommendation for the scripted scenario.

Presenter message:

> The agent may analyse the application, but it cannot issue the final outcome independently. PolicyForge protects the data, applies the active controls, and assigns responsibility to a human reviewer.

### Scene 4 — Every decision has a traceable story

Open Decision Capsule `PF-2841`.

Reveal the chain:

```text
Application received
        ↓
Candidate identity removed
        ↓
Employment gap classified
        ↓
Agent recommended rejection
        ↓
Policy required HR review
        ↓
Maya Chen approved the recommendation
        ↓
Candidate notice issued
```

Select the employment-gap node. Show the model version, policy version, recorded factor, classification, and contribution to the recommendation.

Presenter message:

> A normal audit log tells us that something happened. The Decision Capsule separates the recorded facts, model output, agent recommendation, policy determination, human decision, and final consequence.

Show the candidate explanation panel:

```text
AI assisted in evaluating your application.
An HR reviewer approved the final outcome.
You may request a human reassessment.
```

Presenter message:

> The same evidence supports a plain explanation and a reconsideration pathway for the person affected.

### Scene 5 — The policy changes

Introduce Recruitment Policy v1.5:

> Documented caregiving, medical, and professional-development leave must not be treated as a negative employment gap.

Open `Northstar-Recruitment-Policy-v1.5-Proposed.pdf`. It is a separate controlled version with status `Proposed`, clause 7.4 amendment history, and replay reference PR-005. It is never shown as the active runtime policy.

Open Policy Time Machine and show the side-by-side comparison with Policy v1.4.

Presenter message:

> Fixing the policy today does not tell us who may already have been affected. PolicyForge can replay recorded decisions before the new version is deployed.

Select `Run Historical Replay`.

### Scene 6 — PolicyForge replays the past

After the replay animation, reveal:

```text
2,841 decisions replayed
2,768 unchanged
73 affected
73 require human reassessment
18 candidate notices connected
3 management reports affected
```

Open Candidate `PF-2841` in the comparison view:

```text
ORIGINAL — POLICY v1.4
Caregiving leave counted negatively
Result: Rejection recommendation permitted

REPLAY — POLICY v1.5
Documented caregiving leave excluded
Result: Independent reassessment required
```

Show the blast radius from the changed clause to the agent, decisions, notices, rankings, and reports.

Presenter message:

> The Time Machine does not rewrite history. It shows exactly which historical decisions would be treated differently, why they changed, and which downstream actions depend on them.

### Scene 7 — Replay becomes accountable action

Select `Create Recall`.

The recall workspace shows:

- 73 affected decisions.
- Independent human reassessment.
- Connected candidate notices.
- A responsible HR owner.
- Preservation of original evidence.

Create Recall `RC-017`.

Presenter message:

> PolicyForge goes beyond detecting a risk. It converts the findings into a controlled recall, routes affected cases to people who can correct them, and preserves the original decision alongside the remediation.

## Closing

End on the Recall success state or the complete lifecycle graphic.

Suggested close:

> Responsible AI is not only about writing better policies. It is about making those policies operational, preserving accountability for every important decision, and protecting people when the rules change. PolicyForge makes every AI agent governable, every consequential decision explainable, and every policy change actionable.

Final line:

> PolicyForge: govern before, explain during, and repair after.

## What the Judges Must Remember

The pitch should leave four clear ideas:

1. PolicyForge governs real agents based on their capabilities and data access.
2. Every consequential decision produces a structured evidence trail.
3. Policy Time Machine shows how a policy change affects historical decisions.
4. Recall turns discovered impact into accountable human remediation.

## Required Demo Data

Use the same values everywhere:

| Item | Fixed demo value |
| --- | --- |
| Organization | Northstar Group |
| Agent | Candidate Screening Agent |
| Agent version | 2.1 |
| Model | TalentModel v4.2 |
| Original policy | Recruitment Policy v1.4 |
| Proposed policy | Recruitment Policy v1.5 |
| Main decision | PF-2841 |
| Human reviewer | Maya Chen |
| Historical decisions | 2,841 |
| Unchanged decisions | 2,768 |
| Affected decisions | 73 |
| Connected notices | 18 |
| Affected reports | 3 |
| Replay | PR-005 |
| Recall | RC-017 |

## Presentation Guardrails

- Do not say that AI autonomously decides company policy.
- Do not describe model chain-of-thought as audit evidence.
- Do not imply that a replay automatically reverses real decisions.
- Do not hide the human reviewer's responsibility.
- Do not claim that every enterprise integration is already implemented.
- Do not spend the pitch navigating generic dashboards.
- Do not introduce additional industries or scenarios during the main demonstration.
- Do not change counts, names, or version numbers between screens.
- If asked about implementation, describe the preliminary version as an interactive prototype using representative data and prepared integrations.
- Do not claim that an arbitrary PDF receives live semantic extraction in the offline build. The two prepared policies are recognized by content fingerprint.
- Explain that production ingestion preserves page and clause coordinates before creating Policy IR.
- Explain PEP and PDP in operational terms; do not use the acronyms without saying what they intercept and decide.
- Treat Recruitment Policy v1.5 as proposed until replay and governance approval complete.

## Optional Additions

Only add these after the core story is polished:

1. An employee-facing intervention that redirects résumé data from an unapproved tool.
2. Animated highlighting between policy clauses and generated controls.
3. A downloadable recall report preview.
4. One live policy-clause extraction with a prepared fallback.
5. A presentation mode that advances through the scripted demo path.

The main pitch remains one story: one agent, one consequential decision, one policy correction, and one accountable recall.
