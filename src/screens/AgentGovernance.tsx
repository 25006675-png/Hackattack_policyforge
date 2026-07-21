import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, Bot, Check, CheckCircle2, ChevronRight, CircleAlert, Database,
  ExternalLink, FileText, Fingerprint, FlaskConical, Link2, LockKeyhole,
  Network, Play, SearchCheck, Shield, Sparkles, UserRoundCheck, WandSparkles,
} from 'lucide-react'
import { controls } from '../data'
import { agentManifest, recruitmentScenarioTests } from '../policyFixtures'
import { getPolicyFixture } from '../services/policyDemo'
import type { DemoState, PolicyFile, Screen, Tone } from '../types'
import { Badge, Button, Metric, PageHeader, Panel, ProgressBar } from '../components/ui'

function outcomeTone(outcome: string): Tone {
  if (outcome.includes('BLOCK')) return 'danger'
  if (outcome.includes('HUMAN')) return 'warning'
  if (outcome.includes('TRANSFORM')) return 'info'
  if (outcome.includes('ALLOW')) return 'success'
  return 'violet'
}

export function AgentGovernance({ state, policyFile, policyAnalysisComplete, update, navigate }: { state: DemoState; policyFile: PolicyFile | null; policyAnalysisComplete: boolean; update: (next: Partial<DemoState>) => void; navigate: (screen: Screen) => void }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationStage, setSimulationStage] = useState(0)
  const [showManifest, setShowManifest] = useState(false)
  const analysisTimerIds = useRef<number[]>([])
  const simulationTimerIds = useRef<number[]>([])
  const analysisLabels = ['Inspecting capabilities', 'Mapping accessed data', 'Finding applicable policies', 'Generating controls']
  const simulationStages = ['Generating representative scenarios', 'Applying generated controls', 'Checking conflicting outcomes', 'Measuring policy coverage', 'Identifying loopholes']
  const hasCompletedPolicyAnalysis = policyFile !== null && policyAnalysisComplete
  const policyFixture = getPolicyFixture(policyFile)

  const clearAnalysisTimers = () => {
    analysisTimerIds.current.forEach((timerId) => window.clearTimeout(timerId))
    analysisTimerIds.current = []
  }

  const clearSimulationTimers = () => {
    simulationTimerIds.current.forEach((timerId) => window.clearTimeout(timerId))
    simulationTimerIds.current = []
  }

  useEffect(() => () => {
    clearAnalysisTimers()
    clearSimulationTimers()
  }, [])

  const analyze = () => {
    if (!hasCompletedPolicyAnalysis) return navigate('policies')
    clearAnalysisTimers()
    setAnalyzing(true)
    setAnalysisStep(0)
    analysisLabels.forEach((_, index) => analysisTimerIds.current.push(window.setTimeout(() => setAnalysisStep(index + 1), 450 * (index + 1))))
    analysisTimerIds.current.push(window.setTimeout(() => {
      setAnalyzing(false)
      update({ agentAnalyzed: true })
      analysisTimerIds.current = []
    }, 2150))
  }

  const runSimulation = () => {
    clearSimulationTimers()
    update({ testsComplete: false })
    setSimulationRunning(true)
    setSimulationStage(0)
    simulationStages.forEach((_, index) => simulationTimerIds.current.push(window.setTimeout(() => setSimulationStage(index + 1), 500 * (index + 1))))
    simulationTimerIds.current.push(window.setTimeout(() => {
      setSimulationRunning(false)
      update({ testsComplete: true })
    }, 500 * simulationStages.length + 250))
  }

  const deploy = () => update({ agentActive: true })

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Agent governance · AGT-024"
        title="Candidate Screening Agent"
        description="Review this agent’s capabilities, policy controls, and deployment conditions."
        actions={<><Badge tone={state.agentActive ? 'success' : 'warning'} dot>{state.agentActive ? 'Active' : 'Awaiting approval'}</Badge><Button variant="secondary" icon={<ExternalLink size={15} />} onClick={() => setShowManifest((visible) => !visible)}>{showManifest ? 'Hide Agent Manifest' : 'Open Agent Manifest'}</Button></>}
      />

      <div className="entity-strip">
        <div><span>Owner</span><strong>Human Resources</strong></div>
        <div><span>Environment</span><strong>Production</strong></div>
        <div><span>Agent version</span><strong className="mono">2.1</strong></div>
        <div><span>Model</span><strong>TalentModel v4.2</strong></div>
        <div><span>Risk</span><Badge tone="danger">High</Badge></div>
        <div><span>Last changed</span><strong>17 Jul 2026</strong></div>
      </div>

      {showManifest && <Panel title="Agent Manifest · AM-024.7" description="Declared capabilities are attested against connected systems and observable runtime telemetry." action={<Badge tone="success" dot>Attested {agentManifest.attested}</Badge>}><div className="agent-manifest"><div className="agent-manifest-summary"><div><span>Purpose</span><strong>{agentManifest.purpose}</strong></div><div><span>Permissions</span><strong>{agentManifest.permissions.join(' · ')}</strong></div><div><span>Explicitly blocked</span><strong>{agentManifest.blockedPermissions.join(' · ')}</strong></div></div><div className="agent-manifest-integrations">{agentManifest.integrations.map((integration) => <div key={integration.name}><Network size={16} /><span><strong>{integration.name}</strong><small>{integration.type} · {integration.protocol}</small></span><Badge tone={integration.status === 'Active' || integration.status === 'Verified' ? 'success' : 'warning'}>{integration.status}</Badge></div>)}</div></div></Panel>}

      {hasCompletedPolicyAnalysis && <section className="agent-policy-source" aria-label="Source policy analysis">
        <div className="agent-policy-source-heading"><FileText size={18} /><span><strong title={policyFile.name}>{policyFile.name}</strong><small>Recruitment Policy v{policyFixture?.version ?? '1.4'} · Content-verified Policy IR</small></span></div>
        <div><span>File type</span><strong>{policyFile.type}</strong></div>
        <div><span>Policy analysis</span><strong>{policyFixture?.clausesDetected ?? 12} clauses indexed</strong></div>
        <div><span>Policy controls</span><strong>{policyFixture?.automaticControls ?? 8} generated</strong></div>
        <div><span>Agent mapping</span><strong>7 controls mapped</strong></div>
        <div><span>Analysis status</span><Badge tone="success" dot>Complete</Badge></div>
      </section>}

      <div className="workflow-steps">
        {[
          ['1', 'Assess agent', state.agentAnalyzed],
          ['2', 'Confirm controls', state.ambiguityResolved],
          ['3', 'Test policy', state.testsComplete],
          ['4', 'Deploy', state.agentActive],
        ].map(([number, label, complete], index) => (
          <div key={String(label)} className={`${complete ? 'complete' : ''} ${index === 0 || [state.agentAnalyzed, state.ambiguityResolved, state.testsComplete][index - 1] ? 'available' : ''}`}>
            <span>{complete ? <Check size={14} /> : number}</span><strong>{label}</strong>{index < 3 && <i />}
          </div>
        ))}
      </div>

      {!state.agentAnalyzed ? (
        <div className="pre-analysis-grid">
          <Panel title="Agent profile" description="Declared capabilities and connected systems.">
            <div className="agent-profile-hero"><div className="large-agent-icon"><Bot size={25} /></div><div><h3>Candidate Screening Agent</h3><p>Processes applications and prepares candidate recommendations for recruiters.</p></div></div>
            <div className="profile-section"><span>Capabilities</span><div className="chip-row"><Badge>Read résumés</Badge><Badge>Extract qualifications</Badge><Badge>Rank candidates</Badge><Badge>Draft notices</Badge><Badge tone="warning">External inference</Badge></div></div>
            <div className="profile-section"><span>Connected systems</span><div className="connection-list"><div><Database size={16} /><strong>Northstar ATS</strong><Badge tone="success">Connected</Badge></div><div><Network size={16} /><strong>TalentModel API</strong><Badge tone="warning">External</Badge></div></div></div>
          </Panel>
          <Panel className="analysis-launch">
            <div className="analysis-orbit"><SearchCheck size={28} /></div>
            <h2>{hasCompletedPolicyAnalysis ? 'Map this agent to policy' : 'Analyse the source policy first'}</h2>
            <p>{hasCompletedPolicyAnalysis ? 'PolicyForge will inspect declared capabilities and data access, then draft controls linked to approved policy evidence.' : 'Agent controls require a verified, versioned Policy IR. Start with Recruitment Policy v1.4, then return here to map its clauses.'}</p>
            {!hasCompletedPolicyAnalysis ? <Button onClick={() => navigate('policies')} icon={<FileText size={16} />}>Open policy intake</Button> : analyzing ? (
              <div className="analysis-progress">
                {analysisLabels.map((label, index) => <div key={label} className={analysisStep > index ? 'done' : analysisStep === index ? 'active' : ''}><span>{analysisStep > index ? <Check size={12} /> : index + 1}</span>{label}</div>)}
              </div>
            ) : <Button onClick={analyze} icon={<WandSparkles size={16} />}>Analyse agent</Button>}
            <small><LockKeyhole size={13} /> {hasCompletedPolicyAnalysis ? 'AI drafts controls. An authorized person approves them.' : 'Deployment stays locked until the source policy is verified.'}</small>
          </Panel>
        </div>
      ) : (
        <>
          <div className="analysis-summary">
            <div><CheckCircle2 size={18} /><strong>Analysis complete</strong><span>7 controls generated</span></div>
            <div><Badge tone="success">Policy mapping verified</Badge><Badge tone="warning">1 human interpretation</Badge></div>
          </div>

          <div className="mapping-workspace">
            <section className="mapping-column capability-column">
              <header><span>1</span><div><strong>Agent context</strong><small>Capabilities and data</small></div></header>
              <div className="mapping-group"><h3><Bot size={15} /> Capabilities</h3>{['Read candidate résumés', 'Extract qualifications', 'Rank candidates', 'Draft communications', 'Request external inference'].map((item) => <div className="mapping-item" key={item}>{item}<ChevronRight size={14} /></div>)}</div>
              <div className="mapping-group"><h3><Fingerprint size={15} /> Data categories</h3>{['Candidate identity', 'Contact information', 'Employment history', 'Qualifications', 'Application outcome'].map((item, index) => <div className="mapping-item" key={item}>{item}{index < 2 ? <Badge tone="danger">Restricted</Badge> : <Badge>Internal</Badge>}</div>)}</div>
            </section>

            <section className="mapping-column controls-column">
              <header><span>2</span><div><strong>Generated controls</strong><small>Policy outcomes at runtime</small></div><Badge tone="info">7 controls</Badge></header>
              <div className="controls-list">
                {controls.map((control) => (
                  <div key={control.id} className="control-row">
                    <span className={`control-glyph glyph-${outcomeTone(control.outcome)}`}><Shield size={14} /></span>
                    <div><strong>{control.situation}</strong><small>{control.detail}</small></div>
                    <Badge tone={outcomeTone(control.outcome)}>{control.outcome}</Badge>
                  </div>
                ))}
              </div>
            </section>

            <section className="mapping-column evidence-column">
              <header><span>3</span><div><strong>Policy evidence</strong><small>Approved source clauses</small></div></header>
              <div className="evidence-doc">
                <div className="evidence-doc-title"><FileText size={17} /><div><strong title={hasCompletedPolicyAnalysis ? policyFile.name : undefined}>{hasCompletedPolicyAnalysis ? policyFile.name : 'Recruitment Policy'}</strong><small>{hasCompletedPolicyAnalysis ? `Recruitment Policy v${policyFixture?.version ?? '1.4'} · Cited Policy IR` : 'Version 1.4 · Active'}</small></div></div>
                <p><mark>Candidate identity must be removed</mark> before applicant data is sent to an external model.</p>
                <p>Automated systems may recommend, but <mark>must not determine final candidate outcomes</mark> without authorized human review.</p>
                <p>Protected characteristics must not be used to rank or profile candidates.</p>
                <button className="text-button" onClick={() => navigate('policy-analysis')}><Link2 size={14} /> Open cited policy analysis</button>
              </div>
              <div className="evidence-links"><div><span>Recruitment Policy §4.2</span><Badge tone="success">Verified</Badge></div><div><span>Recruitment Policy §7.3</span><Badge tone="success">Verified</Badge></div><div><span>Recruitment Policy §9.1</span><Badge tone="success">Verified</Badge></div></div>
            </section>
          </div>

          <div className="governance-lower-grid">
            <Panel title="Resolve policy ambiguity" description="Deployment remains locked until an authorized person confirms the reviewer role." className={state.ambiguityResolved ? 'resolved-panel' : 'ambiguity-panel'}>
              <div className="ambiguity-question"><CircleAlert size={18} /><strong>Who may approve a candidate rejection?</strong></div>
              <div className="radio-stack">
                {['Any HR employee', 'HR manager or assigned recruitment lead', 'Department director only'].map((option, index) => (
                  <label key={option} className={state.ambiguityResolved && index === 1 ? 'selected' : ''}>
                    <input type="radio" name="reviewer" checked={state.ambiguityResolved && index === 1} onChange={() => index === 1 && update({ ambiguityResolved: true })} />
                    <span>{option}</span>{index === 1 && <Badge tone="info">Recommended</Badge>}
                  </label>
                ))}
              </div>
            </Panel>

            <Panel title="Governance Simulator" description="Evaluate the four recruitment scenarios committed in the pitch acceptance criteria." action={<Button variant="secondary" loading={simulationRunning} disabled={!state.ambiguityResolved || simulationRunning} onClick={runSimulation} icon={<FlaskConical size={15} />}>{state.testsComplete ? 'Run recruitment tests again' : 'Run recruitment tests'}</Button>}>
              {simulationRunning ? <div className="simulation-stage-list">{simulationStages.map((stage, index) => { const done = simulationStage > index; const active = simulationStage === index; return <div key={stage} className={done ? 'done' : active ? 'active' : ''}><span>{done ? <Check size={12} /> : index + 1}</span><strong>{stage}</strong>{active && <Badge tone="violet">Running</Badge>}</div> })}</div>
                : state.testsComplete ? <div className="simulation-complete"><Badge tone="success" dot>4 of 4 recruitment paths passed</Badge><div className="simulation-summary-stats"><span><strong>4</strong> scenarios tested</span><span className="success"><strong>4</strong> expected outcomes</span><span><strong>0</strong> unresolved conflicts</span></div><div className="simulation-coverage"><span>Pitch-path control coverage</span><strong>100%</strong><ProgressBar value={100} tone="success" /></div></div>
                : <div className="simulation-empty"><FlaskConical size={20} /><p>{state.ambiguityResolved ? 'Run the simulator to measure policy coverage and identify loopholes.' : 'Resolve the policy ambiguity before running the simulator.'}</p></div>}
            </Panel>
          </div>

          {state.testsComplete && <Panel title="Recruitment control verification" description="Deterministic test fixtures prove each runtime outcome before deployment." className="simulation-results-panel">
            <div className="simulation-metrics"><Metric label="Scenarios tested" value="4" tone="violet" /><Metric label="Expected outcomes" value="4" tone="success" /><Metric label="Unresolved conflicts" value="0" tone="success" /><Metric label="Coverage" value="100%" tone="success" /></div>
            <div className="simulation-scenario-list">{recruitmentScenarioTests.map((scenario, index) => <div key={scenario.title}><span className="simulation-number">{index + 1}</span><div><small>Human Resources · Recruitment Policy v1.4</small><strong>{scenario.title}</strong></div><Badge tone={outcomeTone(scenario.expected)}>{scenario.expected}</Badge><Badge tone={scenario.tone}>{scenario.result}</Badge></div>)}</div>
          </Panel>}

          <div className={`deployment-bar ${state.agentActive ? 'deployed' : ''}`}>
            <div>{state.agentActive ? <CheckCircle2 size={20} /> : <UserRoundCheck size={20} />}<span><strong>{state.agentActive ? 'Agent is actively governed' : 'Ready for authorized approval'}</strong><small>{state.agentActive ? 'Recruitment Policy v1.4 · 7 controls deployed' : state.testsComplete ? 'All required confirmations and tests are complete.' : 'Resolve the ambiguity and pass all policy tests.'}</small></span></div>
            {state.agentActive ? <Button onClick={() => navigate('action')} icon={<ArrowRight size={16} />}>Run governed action</Button> : <Button disabled={!state.testsComplete} onClick={deploy} icon={<Sparkles size={16} />}>Approve and deploy</Button>}
          </div>
        </>
      )}
    </div>
  )
}
