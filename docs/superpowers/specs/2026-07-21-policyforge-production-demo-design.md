# PolicyForge Production Demo Design

## Objective

Turn the current frontend prototype into a reliable, technically credible demonstration of one coherent HR recruitment governance workflow. The demo must remain deterministic and safe for presentation while showing how a production backend would ingest policies, understand a registered agent, enforce controls, preserve decision evidence, replay historical decisions, and create accountable remediation work.

The primary story remains:

```text
Recruitment Policy v1.4
        -> policy analysis and approved controls
Candidate Screening Agent
        -> governed candidate recommendation
Decision Capsule PF-2841
        -> Policy v1.5 comparison and replay
Recall RC-017
```

Coding agents may remain visible as secondary inventory examples, but they will not replace the HR scenario. Recruitment better demonstrates sensitive data, consequential action, human accountability, explanation, redress, and historical remediation.

## Product Truth Boundary

The application is a production-quality demonstration, not a production backend. It must never imply that an arbitrary PDF was semantically parsed when the live parser is not present.

The demo will use two deterministic, content-specific policy fixtures:

- `Northstar-Recruitment-Policy-v1.4.pdf`, active policy.
- `Northstar-Recruitment-Policy-v1.5-Proposed.pdf`, proposed amendment.

The browser will fingerprint uploaded files with SHA-256 and match them to the prepared fixture registry. A supported fixture receives its matching structured analysis. An unknown PDF receives a clear unsupported-document state explaining that the production document-ingestion connector is not enabled in this offline demo. It must not receive generic recruitment results.

All simulated operations will retain visible labels such as `Prepared demonstration analysis` or `Representative historical replay`. These labels should communicate scope without making the product feel like a toy.

## Production Architecture Story

The pitch will use a few precise technical terms and explain what they do:

1. **Document Ingestion Service** converts PDF, DOCX, scanned pages, and policy-portal content into canonical blocks while preserving page, section, table, and source coordinates.
2. **Policy Intermediate Representation (Policy IR)** stores normalized obligations, prohibitions, actors, data categories, actions, conditions, exceptions, citations, confidence, and policy version.
3. **Agent Manifest** declares the agent owner, purpose, models, tools, permissions, data categories, actions, and connected systems. Runtime telemetry can validate the declared manifest.
4. **Policy Compiler** joins approved Policy IR rules with the Agent Manifest and produces versioned runtime controls.
5. **Policy Enforcement Point (PEP)** intercepts observable agent actions and tool calls before an external consequence occurs.
6. **Policy Decision Point (PDP)** evaluates the action context and returns `ALLOW`, `TRANSFORM`, `HUMAN REVIEW`, or `BLOCK` with rule and source citations.
7. **Append-only evidence log** records model version, policy version, rule evaluation, human action, and external consequence without storing private model chain-of-thought.
8. **Deterministic replay engine** evaluates stored action contexts against a proposed policy snapshot and produces a traceable before-and-after result.
9. **Idempotent recall workflow** creates reassessment tasks once, assigns accountable owners, and appends corrections without overwriting original decisions.

The UI will show this system boundary in plain language:

```text
Northstar ATS -> Candidate Screening Agent -> PolicyForge PEP/PDP -> HR review -> ATS outcome
```

## Policy Documents

### Shared document characteristics

Both PDFs will look like authentic internal policy documents and include:

- Northstar Group identity and document classification.
- Policy owner, accountable executive, approval authority, status, effective date, review cycle, and version.
- Table of contents.
- Numbered clauses with stable identifiers.
- Definitions for AI-assisted recruitment, candidate data, consequential recommendation, human reviewer, and external model.
- Data handling, protected attributes, model use, human review, candidate transparency, evidence retention, exceptions, and audit requirements.
- Approval history and change log.
- Page numbers and document-control footer.
- A restrained `Synthetic demonstration document` notice.

### Recruitment Policy v1.4

Version 1.4 is active and contains the source clauses used by the agent controls:

- Candidate identity must be removed before external-model inference.
- Candidate data may use only approved models and approved purposes.
- Protected attributes must not affect ranking or profiling.
- Job-related candidate ranking is allowed and recorded.
- Negative recommendations require an HR manager or assigned recruitment lead.
- Candidate notices disclose AI involvement and offer reassessment.
- Consequential actions create an immutable Decision Capsule.
- Clause 7.4 permits employment gaps to be considered when evaluating suitability, subject to human review.

### Recruitment Policy v1.5

Version 1.5 is proposed, not active. It preserves the v1.4 controls and amends clause 7.4:

> Documented caregiving, medical, and professional-development leave must not be treated as a negative employment gap or reduce a candidate ranking.

Its change history explicitly links the amendment to Policy Replay PR-005. The PDF will be available for preview and download from the Time Machine comparison.

## Policy Analysis Experience

### Intake

The Policies screen will provide:

- Download actions for both prepared PDFs.
- A clear recommendation to start with v1.4.
- Drag-and-drop and file-picker upload.
- File identity, version, status, SHA-256 verification result, page count, and document owner after fixture recognition.
- A clear unsupported-document state for unknown files.

### Analysis timing and stages

Supported analysis will take approximately 8 seconds. The duration is long enough to communicate work and short enough for a live pitch. Progress must advance through evidence-producing stages rather than a generic spinner:

1. Verify document fingerprint and integrity.
2. Extract pages, headings, tables, and document metadata.
3. Detect policy scope, status, version, and accountable owner.
4. Identify obligations, prohibitions, conditions, and exceptions.
5. Classify actors, data categories, agent actions, and consequences.
6. Link source clauses to Candidate Screening Agent capabilities.
7. Detect ambiguity and cross-clause conflicts.
8. Generate draft controls with source citations.
9. Validate representative scenario coverage.

Each active stage will show a concrete output, such as `12 clauses indexed`, `5 candidate-data categories mapped`, or `1 reviewer-role ambiguity found`. The final result will show a pipeline summary from source clause to normalized rule, agent capability, and runtime control.

### Version-specific results

- Uploading v1.4 produces the active-policy analysis and enables continuation to Agent Governance.
- Uploading v1.5 identifies a proposed version, highlights the clause 7.4 delta, and offers `Compare with active v1.4` to open the Time Machine.
- Unknown files never receive prepared policy findings.

## Coherent Pitch Workflow

### Scene 1: Policy intake

Download or select Recruitment Policy v1.4, run the staged analysis, inspect cited clause-to-control mappings, and continue to the registered agent.

### Scene 2: Agent approval

Show the Candidate Screening Agent Manifest, Northstar ATS and TalentModel API integrations, accessed data, allowed tools, and expected actions. Map the approved v1.4 Policy IR to seven runtime controls, resolve the reviewer ambiguity, and run the four recruitment-specific tests from the pitch:

1. Rank candidates using job-related qualifications: `ALLOW`.
2. Send a resume after identity removal: `TRANSFORM + ALLOW`.
3. Produce a negative recommendation: `HUMAN REVIEW`.
4. Profile using protected characteristics: `BLOCK`.

Cross-domain finance, marketing, engineering, policy-patch, and model-incident examples must not interrupt this primary path. They may remain accessible as optional lab examples outside presentation mode.

### Scene 3: Governed candidate action

The Runtime screen opens directly on Candidate Application ACT-8842. It shows the system boundary, then a credible progression:

1. Northstar ATS event received.
2. Candidate identifiers detected.
3. Identity removed before external inference.
4. Approved TalentModel request evaluated.
5. Qualifications and employment history recorded.
6. Negative recommendation paused by CTL-025.
7. HR reviewer receives the evidence and owns the final decision.

The Employee Request Checker must not appear before this story. It can become an optional Policy Lab route or remain hidden from presentation mode.

### Scenes 4 through 7

Decision Capsule, Policy Time Machine, historical replay, and Recall retain the existing flow, but all terminology, clause IDs, versions, dates, and counts must match the two generated PDFs and the Agent Manifest.

## Help and Reset

`Reset demo` will be removed from the persistent application header.

Selecting `Help` opens an accessible popover containing:

- `Demo guide`, explaining the recommended presentation sequence.
- `Technical architecture`, summarizing Ingestion Service, Policy IR, Agent Manifest, PEP/PDP, evidence log, replay, and recall.
- `Simulation boundary`, explaining prepared fixtures and offline behavior.
- `Reset demo`, under a separate Demo Controls section.

Reset requires a confirmation step because it clears completed workflow state, selected policy files, and local persistence. The popover supports Escape, click-outside dismissal, keyboard navigation, focus return, and an accessible label.

## Removing Fake Affordances

Every interactive-looking control on the primary pitch path must perform an observable action. Controls that do not support the pitch will be removed, converted to static labels, or implemented.

Required corrections include:

- Remove the inert `Generate governance report` action.
- Make `Agent record` open the Agent Manifest and integration record.
- Make `Open source policy` return to the analyzed v1.4 source.
- Rename and wire `View controls` to the deployed controls.
- Make `Export evidence` download a structured PF-2841 evidence JSON artifact.
- Make `View raw recorded event` show the selected event payload.
- Remove `Open source record` unless it opens a real prepared record view.
- Make `Export recall report` download a structured RC-017 report.
- Remove inert search, filter, overflow, and view-all controls from prepared tables unless implemented.
- Convert the workspace switcher, global search, and policy selector to non-interactive status elements unless they receive real demo behavior.

No main-story button may be dead.

## Component and Data Boundaries

### New data modules

- Policy fixture registry containing file fingerprints, metadata, clauses, extracted Policy IR, version delta, and analysis outputs.
- Agent Manifest fixture containing integrations, tools, permissions, data categories, and attestation metadata.
- Decision and recall export fixtures derived from the same identifiers used in the UI.

### Services

- `identifyPolicyFixture(file)` computes SHA-256 and returns a supported fixture or an unsupported result.
- `runPolicyAnalysis(fixture, onProgress)` emits deterministic stage events and supports cleanup on navigation or reset.
- `downloadPreparedArtifact(path)` exposes the committed PDFs.
- `downloadJsonArtifact(name, data)` creates verifiable evidence and recall exports.

### State

The application store will track:

- Identified policy fixture ID and metadata.
- Analysis status and completion.
- Existing agent, action, decision, replay, and recall states.
- Help popover and confirmation state remain local UI state.

Persisted data will contain fixture identifiers, not browser `File` objects. Refreshing the page preserves completed workflow state and recognized policy identity.

## Error and Edge States

- Non-PDF upload: explain accepted formats and preserve the current valid fixture.
- Unknown PDF: accept metadata, display fingerprint, and explain that offline semantic parsing is unavailable. Do not generate findings.
- Analysis cancellation or navigation: clear all timers and avoid late state updates.
- Repeated analysis: restart from a clean stage and produce the same deterministic results.
- Reset during analysis: cancel work, clear fixture state, close Help, and return to the initial overview.
- v1.5 selected before v1.4: identify it as proposed and route to comparison without marking it active.
- Download failure: show a visible recovery message and retain the current state.

## Pitch Documentation Changes

`PITCH.md` will gain:

- A short policy-intake scene before agent approval.
- The Northstar ATS to Agent to PolicyForge to HR system-boundary explanation.
- A concise technical architecture answer using Policy IR, Agent Manifest, PEP/PDP, append-only evidence, deterministic replay, and idempotent recall.
- Explicit statements that the offline demo recognizes prepared documents by content fingerprint and that production uses ingestion and extraction services.
- The exact v1.4 and v1.5 document names and clause 7.4 wording.
- Presenter guardrails that prevent claims of universal live PDF understanding or private chain-of-thought access.

Technical terminology must be used only when the presenter can immediately explain its role in the workflow.

## Verification

### Automated and build checks

- TypeScript and Vite production build passes.
- Policy fixture fingerprints match the committed PDF files.
- v1.4 and v1.5 return different, version-correct analysis results.
- Unknown PDFs never return prepared recruitment findings.
- Timers are cleaned up on navigation and reset.
- Exported evidence and recall JSON parse successfully and contain matching IDs and versions.

### Browser workflow checks

Execute the presentation from a clean state:

1. Open Help, verify Reset is present only there, then dismiss with Escape.
2. Download and upload v1.4.
3. Observe all nine analysis stages and cited mapping results.
4. Continue to the Agent Manifest, resolve ambiguity, run the four recruitment tests, and deploy.
5. Process ACT-8842, verify transformation and HR review, and create PF-2841.
6. Inspect and export evidence.
7. Preview v1.5, run PR-005, and confirm 2,841 / 2,768 / 73 results.
8. Create and export RC-017.
9. Refresh and verify completed state persists.
10. Reset through Help and verify every workflow returns to its locked initial state.

### Acceptance criteria

- The story remains one HR policy, one registered agent, one candidate decision, one amendment, one replay, and one recall.
- The PDF content, Policy IR, controls, evidence, replay, and recall use consistent clause IDs and versions.
- The demo explains credible production components without claiming they are live in the offline build.
- Every primary-path affordance works and produces visible feedback.
- An unknown document cannot produce misleading prepared analysis.
- A judge can explain where PolicyForge sits between the ATS, agent, model, policy decision, and human reviewer.

