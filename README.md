# PolicyForge Prototype

Interactive, deterministic demonstration of the PolicyForge AI governance control center. The primary story follows a recruitment policy from document ingestion through runtime enforcement, evidence reconstruction, version replay, and recall.

## Run locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:4173`.

## Build

```bash
npm run build
npm run verify:fixtures
```

## Demo path

1. Open **Policies** and use the prepared Recruitment Policy v1.4 PDF.
2. Run the staged document analysis and inspect the clause-to-control mapping.
3. Review the Candidate Screening Agent manifest, resolve its v1.4 ambiguity, and run four recruitment-specific tests.
4. Activate the agent, process candidate application `ACT-8842`, and complete human review.
5. Inspect Decision Capsule `PF-2841` and export its evidence.
6. Replay the decision under proposed Recruitment Policy v1.5.
7. Create and export Recall `RC-017`.

The prepared v1.4 and v1.5 PDFs live in `public/demo-policies`. They are synthetic controlled documents and contain no real candidate or company data. The browser verifies their SHA-256 fingerprints before enabling deterministic analysis.

Use **Help** in the sidebar to find the guided path and reveal the two-step **Reset demo** action.
