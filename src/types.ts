export type Screen = 'overview' | 'policies' | 'policy-analysis' | 'agents' | 'action' | 'decisions' | 'time-machine' | 'recalls'

export type PolicyFixtureId = 'recruitment-v1.4' | 'recruitment-v1.5'

export interface PolicyFile {
  name: string
  size: number
  type: string
  sha256: string
  fixtureId: PolicyFixtureId | null
  identification: 'verified' | 'unsupported'
}

export interface PolicyClause {
  id: string
  title: string
  text: string
  normalizedRule: string
  agentCapability: string
  outcome: string
  tone: Tone
  confidence: string
  runtimeActions: string[]
}

export interface PolicyFixture {
  id: PolicyFixtureId
  fileName: string
  assetPath: string
  sha256: string
  version: '1.4' | '1.5'
  status: 'Active' | 'Proposed'
  documentId: string
  owner: string
  accountableExecutive: string
  pageCount: number
  effectiveDate: string
  clausesDetected: number
  automaticControls: number
  humanReviewControls: number
  ambiguities: number
  clauses: PolicyClause[]
}

export interface PolicyAnalysisStage {
  label: string
  detail: string
  duration: number
}

export interface DemoState {
  agentAnalyzed: boolean
  ambiguityResolved: boolean
  testsComplete: boolean
  agentActive: boolean
  actionComplete: boolean
  decisionComplete: boolean
  replayComplete: boolean
  recallCreated: boolean
}

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'violet'

export interface EvidenceNode {
  id: string
  label: string
  title: string
  summary: string
  tone: Tone
  details: Array<[string, string]>
}
