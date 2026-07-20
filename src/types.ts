export type Screen = 'overview' | 'policies' | 'agents' | 'action' | 'decisions' | 'time-machine' | 'recalls'

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
