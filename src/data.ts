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

export const governanceSimulationScenarios = [
  { department: 'Finance', action: 'Upload customer transactions to Public AI', expected: 'BLOCK', result: 'Passed', tone: 'success' as const },
  { department: 'Human Resources', action: 'AI recommends rejecting a candidate', expected: 'HUMAN REVIEW', result: 'Passed', tone: 'success' as const },
  { department: 'Engineering', action: 'Send source code to approved Enterprise AI', expected: 'ALLOW AND RECORD', result: 'Passed', tone: 'success' as const },
  { department: 'Marketing', action: 'Generate public advertising copy', expected: 'ALLOW', result: 'Passed', tone: 'success' as const },
  { department: 'Customer Service', action: 'Send customer complaint containing phone number to Public AI', expected: 'TRANSFORM', result: 'Ambiguous', tone: 'warning' as const },
  { department: 'Finance', action: 'Send customer account number after removing the customer name', expected: 'BLOCK', result: 'Loophole detected', tone: 'danger' as const },
]

export const governanceSimulationLoopholes = [
  { title: 'Customer account numbers are not explicitly classified as identifying financial data.', action: 'Extend Customer Data Protection §4.2.' },
  { title: 'Screenshots containing sensitive information are not covered by the text-only rule.', action: 'Add multimodal input coverage.' },
]

export const requestCheckerExamples = [
  { id: 'block', label: 'Test BLOCK', department: 'Finance', aiTool: 'Public AI', purpose: 'Financial analysis', prompt: 'Customer: Ali Ahmad\nAccount Number: 123456789\nTransaction: RM20,000', detected: 'Customer financial information', policy: 'Customer Data Protection §4.2', outcome: 'BLOCK', tone: 'danger' as const, explanation: 'Public AI must not receive customer financial information.', actions: ['Stop the request', 'Notify the employee', 'Record the event', 'Recommend an approved Enterprise AI'], nextStep: 'Use an approved Enterprise AI with the required financial-data controls.' },
  { id: 'transform', label: 'Test TRANSFORM', department: 'Customer Service', aiTool: 'Public AI', purpose: 'Customer support', prompt: 'Call Sarah at 012-3456789 regarding complaint CS-1042.', detected: 'Customer name and phone number', policy: 'Customer Data Protection §4.2', outcome: 'TRANSFORM', tone: 'info' as const, explanation: 'Direct identifiers must be removed before a public AI tool can receive the request.', actions: ['Remove direct identifiers', 'Show transformed prompt', 'Allow after transformation', 'Record the transformation'], nextStep: 'Review the transformed request before sending it to Public AI.', transformedPrompt: 'Contact the customer regarding complaint CS-1042.' },
  { id: 'review', label: 'Test HUMAN REVIEW', department: 'Human Resources', aiTool: 'Candidate Screening Agent', purpose: 'Candidate selection', prompt: 'Reject the applicant because of an 18-month employment gap.', detected: 'Consequential employment recommendation', policy: 'Recruitment Policy §7.3', outcome: 'HUMAN REVIEW', tone: 'warning' as const, explanation: 'The agent may analyse the candidate but cannot make the final employment decision.', actions: ['Allow analysis', 'Prevent automatic final decision', 'Assign an HR manager', 'Create a Decision Capsule'], nextStep: 'Route the recommendation to an authorized HR manager.' },
  { id: 'allow-record', label: 'Test ALLOW AND RECORD', department: 'Engineering', aiTool: 'Approved Enterprise AI', purpose: 'Source-code assistance', prompt: 'Review this internal TypeScript validation function.', detected: 'Source code sent to approved Enterprise AI', policy: 'AI Standard §9.1', outcome: 'ALLOW AND RECORD', tone: 'success' as const, explanation: 'The request uses an approved enterprise model for an allowed engineering purpose.', actions: ['Allow the request', 'Record the employee and model', 'Preserve policy version', 'Create an audit event'], nextStep: 'Proceed with the approved Enterprise AI and retain the audit record.' },
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
