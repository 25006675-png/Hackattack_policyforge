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

export default function App() {
  const [screen, setScreen] = useState<Screen>(loadScreen)
  const [state, setState] = useState<DemoState>(loadState)
  const [policyFile, setPolicyFile] = useState<PolicyFile | null>(null)
  const [policyAnalysisComplete, setPolicyAnalysisComplete] = useState(false)

  useEffect(() => {
    localStorage.setItem('policyforge-demo', JSON.stringify(state))
  }, [state])

  const update = (next: Partial<DemoState>) => setState((current) => ({ ...current, ...next }))
  const reset = () => {
    setState(initialState)
    setPolicyFile(null)
    setPolicyAnalysisComplete(false)
    setScreen('overview')
    localStorage.removeItem('policyforge-demo')
  }

  let content
  switch (screen) {
    case 'policies': content = <PolicyUpload policyFile={policyFile} policyAnalysisComplete={policyAnalysisComplete} onPolicyFileChange={setPolicyFile} onAnalysisComplete={setPolicyAnalysisComplete} navigate={setScreen} />; break
    case 'policy-analysis': content = <PolicyAnalysis policyFile={policyFile} policyAnalysisComplete={policyAnalysisComplete} navigate={setScreen} />; break
    case 'agents': content = <AgentGovernance state={state} policyFile={policyFile} policyAnalysisComplete={policyAnalysisComplete} update={update} navigate={setScreen} />; break
    case 'action': content = <GovernedAction state={state} update={update} navigate={setScreen} />; break
    case 'decisions': content = <DecisionCapsule state={state} navigate={setScreen} />; break
    case 'time-machine': content = <TimeMachine state={state} update={update} navigate={setScreen} />; break
    case 'recalls': content = <Recalls state={state} update={update} navigate={setScreen} />; break
    default: content = <Overview state={state} navigate={setScreen} />
  }

  return <AppShell screen={screen} onNavigate={setScreen} onReset={reset}>{content}</AppShell>
}
