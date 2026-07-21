import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Overview } from './screens/Overview'
import { PolicyUpload } from './screens/PolicyUpload'
import { PolicyAnalysis } from './screens/PolicyAnalysis'
import { AgentGovernance } from './screens/AgentGovernance'
import { GovernedAction } from './screens/GovernedAction'
import { DecisionCapsule } from './screens/DecisionCapsule'
import { TimeMachine } from './screens/TimeMachine'
import { Recalls } from './screens/Recalls'
import type { DemoState, PolicyFile, Screen } from './types'

const initialState: DemoState = {
  agentAnalyzed: false,
  ambiguityResolved: false,
  testsComplete: false,
  agentActive: false,
  actionComplete: false,
  decisionComplete: false,
  replayComplete: false,
  recallCreated: false,
}

const screens: Screen[] = ['overview', 'policies', 'policy-analysis', 'agents', 'action', 'decisions', 'time-machine', 'recalls']

function loadScreen(): Screen {
  const requested = new URLSearchParams(window.location.search).get('screen') as Screen | null
  return requested && screens.includes(requested) ? requested : 'overview'
}

function loadState(): DemoState {
  const demo = new URLSearchParams(window.location.search).get('demo')
  if (demo === 'complete') return Object.fromEntries(Object.keys(initialState).map((key) => [key, true])) as unknown as DemoState
  if (demo === 'agent') return { ...initialState, agentAnalyzed: true }
  if (demo === 'review') return { ...initialState, agentAnalyzed: true, ambiguityResolved: true, testsComplete: true, agentActive: true, actionComplete: true }
  try {
    const saved = localStorage.getItem('policyforge-demo')
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState
  } catch {
    return initialState
  }
}

function loadPolicySession(): { policyFile: PolicyFile | null; analysisComplete: boolean } {
  const demo = new URLSearchParams(window.location.search).get('demo')
  if (demo === 'complete' || demo === 'agent' || demo === 'review') {
    return {
      policyFile: {
        name: 'Northstar-Recruitment-Policy-v1.4.pdf',
        size: 119996,
        type: 'application/pdf',
        sha256: 'cdbd208dace4fcb100aebec556e6189d26410f8fb3d5c8dce8decf337cc7e57e',
        fixtureId: 'recruitment-v1.4',
        identification: 'verified',
      },
      analysisComplete: true,
    }
  }
  try {
    const saved = localStorage.getItem('policyforge-policy-session')
    if (!saved) return { policyFile: null, analysisComplete: false }
    const parsed = JSON.parse(saved) as { policyFile?: PolicyFile; analysisComplete?: boolean }
    return { policyFile: parsed.policyFile ?? null, analysisComplete: Boolean(parsed.analysisComplete && parsed.policyFile?.fixtureId) }
  } catch {
    return { policyFile: null, analysisComplete: false }
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(loadScreen)
  const [state, setState] = useState<DemoState>(loadState)
  const [initialPolicySession] = useState(loadPolicySession)
  const [policyFile, setPolicyFile] = useState<PolicyFile | null>(initialPolicySession.policyFile)
  const [policyAnalysisComplete, setPolicyAnalysisComplete] = useState(initialPolicySession.analysisComplete)

  useEffect(() => {
    localStorage.setItem('policyforge-demo', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    localStorage.setItem('policyforge-policy-session', JSON.stringify({ policyFile, analysisComplete: policyAnalysisComplete }))
  }, [policyFile, policyAnalysisComplete])

  const update = (next: Partial<DemoState>) => setState((current) => ({ ...current, ...next }))
  const navigate = (next: Screen) => {
    setScreen(next)
    const url = new URL(window.location.href)
    if (next === 'overview') url.searchParams.delete('screen')
    else url.searchParams.set('screen', next)
    window.history.replaceState(null, '', url)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const reset = () => {
    setState(initialState)
    setPolicyFile(null)
    setPolicyAnalysisComplete(false)
    localStorage.removeItem('policyforge-demo')
    localStorage.removeItem('policyforge-policy-session')
    navigate('overview')
  }

  let content
  switch (screen) {
    case 'policies': content = <PolicyUpload policyFile={policyFile} policyAnalysisComplete={policyAnalysisComplete} onPolicyFileChange={setPolicyFile} onAnalysisComplete={setPolicyAnalysisComplete} navigate={navigate} />; break
    case 'policy-analysis': content = <PolicyAnalysis policyFile={policyFile} policyAnalysisComplete={policyAnalysisComplete} navigate={navigate} />; break
    case 'agents': content = <AgentGovernance state={state} policyFile={policyFile} policyAnalysisComplete={policyAnalysisComplete} update={update} navigate={navigate} />; break
    case 'action': content = <GovernedAction state={state} update={update} navigate={navigate} />; break
    case 'decisions': content = <DecisionCapsule state={state} navigate={navigate} />; break
    case 'time-machine': content = <TimeMachine state={state} update={update} navigate={navigate} />; break
    case 'recalls': content = <Recalls state={state} update={update} navigate={navigate} />; break
    default: content = <Overview state={state} policyAnalysisComplete={policyAnalysisComplete} navigate={navigate} />
  }

  return <AppShell screen={screen} onNavigate={navigate} onReset={reset}>{content}</AppShell>
}
