import type { PolicyAnalysisStage, PolicyFixture } from './types'

export const policyAnalysisStages: PolicyAnalysisStage[] = [
  { label: 'Verifying document integrity', detail: 'Calculating SHA-256, confirming registered source, and locking version POL-HR-014.', duration: 3000 },
  { label: 'Extracting document structure', detail: 'Rendering 6 pages, reading headings, tables, clause numbers, and document-control metadata.', duration: 3000 },
  { label: 'Resolving policy scope and version', detail: 'Identifying recruitment scope, People and Culture ownership, approval status, and effective date.', duration: 3000 },
  { label: 'Identifying requirements', detail: 'Separating obligations, prohibitions, exceptions, reviewer duties, and candidate-notice requirements.', duration: 3000 },
  { label: 'Classifying governance entities', detail: 'Mapping candidate-data categories, accountable actors, external systems, and consequential actions.', duration: 3000 },
  { label: 'Mapping the Agent Manifest', detail: 'Comparing Northstar ATS access, TalentModel calls, agent tools, and write permissions against policy clauses.', duration: 3000 },
  { label: 'Checking ambiguity and conflicts', detail: 'Testing reviewer-role ambiguity, exception handling, and cross-clause conflicts before compilation.', duration: 3000 },
  { label: 'Compiling runtime controls', detail: 'Building cited ALLOW, TRANSFORM, HUMAN REVIEW, and BLOCK decisions for runtime evaluation.', duration: 3000 },
  { label: 'Validating scenario coverage', detail: 'Running recruitment control paths against the compiled Policy IR before releasing analysis results.', duration: 3000 },
]

const sharedClauses = [
  {
    id: '4.2', title: 'Identity minimization',
    text: 'Candidate name, contact details, address, and equivalent direct identifiers must be removed before application content is sent to an external model.',
    normalizedRule: 'IF candidate data contains direct identifiers AND destination is external THEN remove identifiers before inference.',
    agentCapability: 'Read resumes and request external inference', outcome: 'TRANSFORM', tone: 'info' as const, confidence: '98%',
    runtimeActions: ['Detect direct identifiers', 'Remove protected fields', 'Record transformation', 'Release approved payload'],
  },
  {
    id: '6.1', title: 'Protected attributes',
    text: 'Protected characteristics and reliable proxies must not be used to rank, profile, or disadvantage a candidate.',
    normalizedRule: 'IF ranking input contains a protected attribute or reliable proxy THEN block evaluation and record the attempt.',
    agentCapability: 'Rank candidates', outcome: 'BLOCK', tone: 'danger' as const, confidence: '97%',
    runtimeActions: ['Stop the ranking action', 'Record the triggering field', 'Notify the governance owner', 'Preserve policy evidence'],
  },
  {
    id: '7.3', title: 'Human review',
    text: 'A negative candidate recommendation requires approval from an HR manager or assigned recruitment lead.',
    normalizedRule: 'IF agent recommendation is negative THEN pause consequence and assign an authorized HR reviewer.',
    agentCapability: 'Produce candidate recommendations', outcome: 'HUMAN REVIEW', tone: 'warning' as const, confidence: '96%',
    runtimeActions: ['Allow analysis', 'Prevent final outcome', 'Assign authorized reviewer', 'Create Decision Capsule'],
  },
  {
    id: '8.2', title: 'Notice and reassessment',
    text: 'A candidate notice must disclose material AI assistance, identify human responsibility, and provide a route to human reassessment.',
    normalizedRule: 'IF a candidate outcome notice is issued THEN include AI disclosure, accountable reviewer, factors, and reassessment route.',
    agentCapability: 'Draft candidate communications', outcome: 'TRANSFORM', tone: 'info' as const, confidence: '95%',
    runtimeActions: ['Add AI disclosure', 'Identify human responsibility', 'Summarize recorded factors', 'Provide reassessment link'],
  },
]

export const policyFixtures: Record<'recruitment-v1.4' | 'recruitment-v1.5', PolicyFixture> = {
  'recruitment-v1.4': {
    id: 'recruitment-v1.4',
    fileName: 'Northstar-Recruitment-Policy-v1.4.pdf',
    assetPath: '/policy-docs/Northstar-Recruitment-Policy-v1.4.pdf',
    sha256: '712534DBFDEA6B1EED73AA83EF0D1D04681AAF50426BB5FEE11718950EAA8184',
    version: '1.4', status: 'Active', documentId: 'POL-HR-014', owner: 'Director of Human Resources',
    accountableExecutive: 'Chief People Officer', pageCount: 6, effectiveDate: '3 January 2026',
    clausesDetected: 12, automaticControls: 8, humanReviewControls: 3, ambiguities: 1,
    clauses: [
      ...sharedClauses.slice(0, 3),
      {
        id: '7.4', title: 'Employment history',
        text: 'Employment gaps may be considered when evaluating candidate suitability when relevant to documented role requirements and subject to human review.',
        normalizedRule: 'IF an employment gap is recorded AND it may affect suitability THEN include it as a reviewable factor.',
        agentCapability: 'Extract employment history', outcome: 'ALLOW + RECORD', tone: 'neutral', confidence: '82%',
        runtimeActions: ['Record gap duration', 'Record model classification', 'Expose factor to reviewer', 'Preserve policy version'],
      },
      sharedClauses[3],
    ],
  },
  'recruitment-v1.5': {
    id: 'recruitment-v1.5',
    fileName: 'Northstar-Recruitment-Policy-v1.5-Proposed.pdf',
    assetPath: '/policy-docs/Northstar-Recruitment-Policy-v1.5-Proposed.pdf',
    sha256: 'BE2F380CDE81D22F5A601B19D3177AA7080A67BC00CCA128428AAFBC5DD5722A',
    version: '1.5', status: 'Proposed', documentId: 'POL-HR-014', owner: 'Director of Human Resources',
    accountableExecutive: 'Chief People Officer', pageCount: 6, effectiveDate: 'Proposed 1 August 2026',
    clausesDetected: 13, automaticControls: 9, humanReviewControls: 3, ambiguities: 0,
    clauses: [
      ...sharedClauses.slice(0, 3),
      {
        id: '7.4', title: 'Employment history and documented leave',
        text: 'Documented caregiving, medical, and professional-development leave must not be treated as a negative employment gap or reduce a candidate ranking.',
        normalizedRule: 'IF leave is documented as caregiving, medical, or professional development THEN exclude it from negative evaluation and ranking.',
        agentCapability: 'Extract employment history', outcome: 'EXCLUDE + REVIEW', tone: 'violet', confidence: '99%',
        runtimeActions: ['Detect documented leave', 'Exclude negative weighting', 'Recalculate recommendation', 'Route uncertain evidence to review'],
      },
      sharedClauses[3],
    ],
  },
}

export const recruitmentScenarioTests = [
  { title: 'Rank candidates using job-related qualifications', expected: 'ALLOW', result: 'Passed', tone: 'success' as const },
  { title: 'Send resume externally after identity removal', expected: 'TRANSFORM + ALLOW', result: 'Passed', tone: 'info' as const },
  { title: 'Produce a negative candidate recommendation', expected: 'HUMAN REVIEW', result: 'Passed', tone: 'warning' as const },
  { title: 'Profile using protected characteristics', expected: 'BLOCK', result: 'Passed', tone: 'danger' as const },
]

export const agentManifest = {
  id: 'AGT-024', version: '2.1', owner: 'Human Resources', environment: 'Production',
  purpose: 'Prepare candidate screening analysis and recommendations for authorized recruiters.',
  model: 'TalentModel v4.2', manifestVersion: 'AM-024.7', attested: '17 July 2026, 14:32 SGT',
  tools: ['Northstar ATS read', 'TalentModel inference', 'Candidate ranking', 'Notice drafting'],
  permissions: ['applications:read', 'recommendations:write', 'notices:draft'],
  blockedPermissions: ['outcomes:finalize', 'candidates:delete'],
  integrations: [
    { name: 'Northstar ATS', type: 'System of record', protocol: 'Signed event webhook', status: 'Verified' },
    { name: 'TalentModel API', type: 'External inference', protocol: 'mTLS API gateway', status: 'Restricted' },
    { name: 'PolicyForge PEP', type: 'Runtime enforcement', protocol: 'Action interception', status: 'Active' },
  ],
}
