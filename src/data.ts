import type { EvidenceNode } from './types'

export const controls = [
  { id: 'CTL-021', situation: 'Candidate identity', outcome: 'TRANSFORM', detail: 'Remove before external inference', evidence: 'Data Policy §4.2' },
  { id: 'CTL-022', situation: 'Résumé data', outcome: 'ALLOW', detail: 'Approved models only', evidence: 'AI Standard §3.4' },
  { id: 'CTL-023', situation: 'Protected attributes', outcome: 'BLOCK', detail: 'Exclude from evaluation', evidence: 'Recruitment §6.1' },
  { id: 'CTL-024', situation: 'Candidate ranking', outcome: 'ALLOW', detail: 'Allow and record', evidence: 'Recruitment §7.1' },
  { id: 'CTL-025', situation: 'Negative recommendation', outcome: 'HUMAN REVIEW', detail: 'Authorized HR approval', evidence: 'Recruitment §7.3' },
  { id: 'CTL-026', situation: 'Candidate notification', outcome: 'TRANSFORM', detail: 'Disclose AI involvement', evidence: 'AI Standard §8.2' },
  { id: 'CTL-027', situation: 'Consequential action', outcome: 'RECORD', detail: 'Create Decision Capsule', evidence: 'Audit Policy §5.6' },
]

export const testScenarios = [
  { title: 'Rank using job-related qualifications', result: 'ALLOW', tone: 'success' as const },
  { title: 'Send résumé after identity removal', result: 'TRANSFORM + ALLOW', tone: 'info' as const },
  { title: 'Produce a negative recommendation', result: 'HUMAN REVIEW', tone: 'warning' as const },
  { title: 'Profile using protected characteristics', result: 'BLOCK', tone: 'danger' as const },
]

export const evidenceNodes: EvidenceNode[] = [
  {
    id: 'application', label: 'Recorded input', title: 'Candidate application received',
    summary: 'Application APP-8842 entered the governed recruitment workflow.', tone: 'neutral',
    details: [['Received', '12 Jun 2026, 09:41:08'], ['Source', 'Northstar Careers'], ['Record', 'APP-8842'], ['Data class', 'Restricted · Candidate']],
  },
  {
    id: 'transform', label: 'Data transformation', title: 'Contact information removed',
    summary: 'Direct identifiers were removed before the résumé left Northstar systems.', tone: 'info',
    details: [['Control', 'CTL-021'], ['Fields removed', 'Name, email, phone, address'], ['Processor', 'Identity Shield v2.3'], ['Result', 'Transformation verified']],
  },
  {
    id: 'model', label: 'Model output', title: 'Employment gap classified',
    summary: 'TalentModel classified an 18-month caregiving period as an unexplained gap.', tone: 'violet',
    details: [['Recorded value', '18 months'], ['Classification', 'Unexplained gap'], ['Contribution', 'Used as a negative factor'], ['Produced by', 'TalentModel v4.2'], ['Confidence', '71%']],
  },
  {
    id: 'agent', label: 'Agent recommendation', title: 'Do not proceed',
    summary: 'The agent recommended that the application should not advance.', tone: 'warning',
    details: [['Agent', 'Candidate Screening Agent v2.1'], ['Recommendation', 'Do not proceed'], ['Supporting factors', '3 recorded'], ['Authority', 'Recommendation only']],
  },
  {
    id: 'policy', label: 'Policy determination', title: 'Human review required',
    summary: 'Recruitment Policy v1.4 prevented the agent from issuing a final outcome.', tone: 'info',
    details: [['Policy', 'Recruitment Policy v1.4'], ['Control', 'CTL-025'], ['Determination', 'HUMAN REVIEW'], ['Reviewer role', 'HR manager or recruitment lead']],
  },
  {
    id: 'human', label: 'Human decision', title: 'Recommendation approved',
    summary: 'Maya Chen reviewed the recorded factors and approved the recommendation.', tone: 'warning',
    details: [['Reviewer', 'Maya Chen'], ['Role', 'Senior Recruitment Lead'], ['Decision', 'Approve recommendation'], ['Recorded', '12 Jun 2026, 10:04:51']],
  },
  {
    id: 'notice', label: 'External consequence', title: 'Candidate notice issued',
    summary: 'The candidate received the outcome, AI disclosure, and reconsideration path.', tone: 'danger',
    details: [['Notice', 'NTC-2841'], ['Channel', 'Candidate portal'], ['Disclosure', 'AI involvement included'], ['Redress', 'Human reassessment available']],
  },
]

export const agentRows = [
  ['Candidate Screening Agent', 'Human Resources', 'High', 'Awaiting approval', '2.1'],
  ['Support Resolution Agent', 'Customer Operations', 'Medium', 'Active', '3.6'],
  ['Contract Review Copilot', 'Legal', 'High', 'Restricted', '1.8'],
  ['Invoice Reconciliation Agent', 'Finance', 'Medium', 'Active', '4.1'],
  ['Knowledge Search Assistant', 'Enterprise IT', 'Low', 'Active', '2.4'],
]
