import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, Bot, BriefcaseBusiness, Check, CheckCircle2, CircleAlert,
  Clock3, Eye, FileText, Fingerprint, LockKeyhole, ShieldCheck, UserCheck,
  UserRound, X,
} from 'lucide-react'
import type { DemoState, Screen } from '../types'
import { Badge, Button, PageHeader, Panel } from '../components/ui'
import { requestCheckerExamples } from '../data'

const steps = [
  { title: 'Résumé received', detail: 'APP-8842 entered the governed workflow', icon: FileText },
  { title: 'Candidate identity detected', detail: '4 direct identifiers located', icon: Fingerprint },
  { title: 'Identity removed before inference', detail: 'CTL-021 · Transformation verified', icon: ShieldCheck },
  { title: 'Qualifications extracted', detail: 'TalentModel v4.2 · Approved inference', icon: Bot },
  { title: 'Negative recommendation', detail: 'Human review required by CTL-025', icon: CircleAlert },
]

const checkingStages = [
  'Inspecting request context',
  'Detecting protected data',
  'Matching applicable policy',
  'Applying control',
]

type RequestCheckerExample = (typeof requestCheckerExamples)[number]
type RequestCheckerResult =
  | { kind: 'example'; example: RequestCheckerExample }
  | { kind: 'custom' }

export function GovernedAction({ state, update, navigate }: { state: DemoState; update: (next: Partial<DemoState>) => void; navigate: (screen: Screen) => void }) {
  const [department, setDepartment] = useState('Finance')
  const [aiTool, setAiTool] = useState('Public AI')
  const [purpose, setPurpose] = useState('Financial analysis')
  const [prompt, setPrompt] = useState('')
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [checkingStage, setCheckingStage] = useState(-1)
  const [result, setResult] = useState<RequestCheckerResult | null>(null)
  const requestTimerIds = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(state.actionComplete ? steps.length : 0)
  const [reviewed, setReviewed] = useState(state.decisionComplete)

  const clearRequestTimers = () => {
    requestTimerIds.current.forEach((timerId) => clearTimeout(timerId))
    requestTimerIds.current = []
  }

  useEffect(() => () => clearRequestTimers(), [])

  const clearPreparedSelection = () => {
    clearRequestTimers()
    setChecking(false)
    setCheckingStage(-1)
    setSelectedExampleId(null)
    setResult(null)
  }

  const selectExample = (example: RequestCheckerExample) => {
    clearRequestTimers()
    setChecking(false)
    setCheckingStage(-1)
    setSelectedExampleId(example.id)
    setDepartment(example.department)
    setAiTool(example.aiTool)
    setPurpose(example.purpose)
    setPrompt(example.prompt)
    setResult(null)
  }

  const checkRequest = () => {
    clearRequestTimers()
    setResult(null)

    const example = requestCheckerExamples.find((item) => item.id === selectedExampleId)
    if (!example) {
      setChecking(false)
      setCheckingStage(-1)
      setResult({ kind: 'custom' })
      return
    }

    setChecking(true)
    setCheckingStage(0)
    checkingStages.slice(1).forEach((_, index) => {
      requestTimerIds.current.push(setTimeout(() => setCheckingStage(index + 1), 620 * (index + 1)))
    })
    requestTimerIds.current.push(setTimeout(() => {
      setChecking(false)
      setResult({ kind: 'example', example })
      requestTimerIds.current = []
    }, 620 * checkingStages.length))
  }

  const run = () => {
    if (!state.agentActive) return navigate('agents')
    setRunning(true)
    steps.forEach((_, index) => setTimeout(() => setProgress(index + 1), 520 * (index + 1)))
    setTimeout(() => { setRunning(false); update({ actionComplete: true }) }, 3000)
  }

  const approve = () => {
    setReviewed(true)
    update({ actionComplete: true, decisionComplete: true })
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Employee request governance"
        title="Employee Request Checker"
        description="Test how representative employee AI requests are handled by runtime policy controls."
        actions={<Badge tone="info" dot>Frontend prototype</Badge>}
      />

      <Panel className="request-checker">
        <div className="request-checker-examples" aria-label="Prepared request examples">
          <div>
            <strong>Quick examples</strong>
            <span>Choose a representative request to populate the checker.</span>
          </div>
          <div>
            {requestCheckerExamples.map((example) => (
              <button
                key={example.id}
                type="button"
                className={selectedExampleId === example.id ? 'selected' : ''}
                onClick={() => selectExample(example)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div className="request-checker-form">
          <label><span>Department</span><select value={department} onChange={(event) => { setDepartment(event.target.value); clearPreparedSelection() }}><option>Finance</option><option>Customer Service</option><option>Human Resources</option><option>Engineering</option></select></label>
          <label><span>AI tool</span><select value={aiTool} onChange={(event) => { setAiTool(event.target.value); clearPreparedSelection() }}><option>Public AI</option><option>Approved Enterprise AI</option><option>Candidate Screening Agent</option></select></label>
          <label><span>Purpose</span><select value={purpose} onChange={(event) => { setPurpose(event.target.value); clearPreparedSelection() }}><option>Financial analysis</option><option>Customer support</option><option>Candidate selection</option><option>Source-code assistance</option></select></label>
          <label className="request-prompt"><span>Prompt</span><textarea value={prompt} onChange={(event) => { setPrompt(event.target.value); clearPreparedSelection() }} placeholder="Enter the employee request to check" rows={5} /></label>
        </div>

        <div className="request-checker-action">
          <span>Simulated prototype enforcement · Representative request</span>
          <Button onClick={checkRequest} loading={checking} disabled={checking}>Check request</Button>
        </div>

        {checking && (
          <div className="request-checking" aria-live="polite">
            {checkingStages.map((stage, index) => (
              <div key={stage} className={index < checkingStage ? 'done' : index === checkingStage ? 'active' : ''}>
                <span>{index < checkingStage ? <Check size={14} /> : index + 1}</span><strong>{stage}</strong>
              </div>
            ))}
          </div>
        )}

        {result?.kind === 'custom' && (
          <div className="request-custom-message" role="status"><CircleAlert size={18} /><p>Custom request evaluation is not available in this prototype. Select a prepared example to run representative enforcement.</p></div>
        )}

        {result?.kind === 'example' && (() => {
          const example = result.example
          return (
            <div className={`request-result request-result-${example.tone}`} aria-live="polite">
              <header><div><span>Outcome</span><Badge tone={example.tone}>{example.outcome}</Badge></div><small>Simulated prototype enforcement · Representative request</small></header>
              <div className="request-result-grid">
                <section><span>Detected data or risk</span><strong>{example.detected}</strong></section>
                <section><span>Triggered policy clause</span><strong>{example.policy}</strong></section>
                <section className="request-result-wide"><span>Explanation</span><p>{example.explanation}</p></section>
                <section><span>Runtime actions</span><ul>{example.actions.map((action) => <li key={action}><Check size={13} />{action}</li>)}</ul></section>
                <section><span>Recommended next step</span><p>{example.nextStep}</p></section>
                {example.transformedPrompt && <section className="request-result-wide transformed-prompt"><span>Transformed prompt</span><p>{example.transformedPrompt}</p></section>}
              </div>
            </div>
          )
        })()}
      </Panel>

      <div className="governed-action-heading"><span>Existing governed workflow</span><h2>Governed Agent Action</h2></div>

      <PageHeader
        eyebrow="Runtime governance · ACT-8842"
        title="Candidate application"
        description="Observe how deployed controls govern an agent action before it produces a consequence."
        actions={<><Badge tone={reviewed ? 'success' : progress === steps.length ? 'warning' : 'info'} dot>{reviewed ? 'Review complete' : progress === steps.length ? 'Human review' : 'Ready'}</Badge><Button variant="secondary" icon={<Eye size={15} />}>View controls</Button></>}
      />

      <div className="runtime-context">
        <div><span className="runtime-agent"><Bot size={19} /></span><div><strong>Candidate Screening Agent</strong><small>Agent v2.1 · TalentModel v4.2</small></div></div>
        <ArrowRight size={18} />
        <div><span className="runtime-policy"><ShieldCheck size={19} /></span><div><strong>Recruitment Policy v1.4</strong><small>7 runtime controls active</small></div></div>
        <div className="runtime-status"><span /><strong>Governed</strong></div>
      </div>

      <div className="action-layout">
        <Panel title="Governed execution" description="Each step is evaluated before the agent continues." action={!state.actionComplete && <Button onClick={run} loading={running} disabled={running || !state.agentActive}>{state.agentActive ? 'Process application' : 'Deploy agent first'}</Button>}>
          {!state.agentActive && <div className="inline-warning"><LockKeyhole size={17} /><span>This action is unavailable until the agent controls are approved and deployed.</span><button onClick={() => navigate('agents')}>Open governance workspace</button></div>}
          <div className="execution-list">
            {steps.map((step, index) => {
              const Icon = step.icon
              const complete = progress > index
              const active = running && progress === index
              const intervention = index === steps.length - 1 && complete
              return (
                <div key={step.title} className={`${complete ? 'complete' : ''} ${active ? 'active' : ''} ${intervention ? 'intervention' : ''}`}>
                  <span className="execution-icon">{complete && !intervention ? <Check size={15} /> : <Icon size={16} />}</span>
                  <div><strong>{step.title}</strong><small>{step.detail}</small></div>
                  {complete && <Badge tone={intervention ? 'warning' : index === 2 ? 'info' : 'success'}>{intervention ? 'PAUSED' : index === 2 ? 'TRANSFORMED' : 'COMPLETE'}</Badge>}
                  {index < steps.length - 1 && <i />}
                </div>
              )
            })}
          </div>
          {progress === 0 && !running && state.agentActive && <div className="execution-empty"><Clock3 size={20} /><p>The action is prepared. Processing will use representative candidate data and deployed controls.</p></div>}
        </Panel>

        <aside className={`review-panel ${progress === steps.length ? 'visible' : ''}`}>
          {progress < steps.length ? (
            <div className="review-placeholder"><UserCheck size={28} /><h2>Human review</h2><p>If a control requires human responsibility, the review task will appear here with the recorded evidence.</p></div>
          ) : reviewed ? (
            <div className="review-complete">
              <div className="success-seal"><CheckCircle2 size={30} /></div>
              <Badge tone="success">Decision recorded</Badge>
              <h2>Review complete</h2>
              <p>Maya Chen approved the recommendation. PolicyForge preserved the agent output, policy determination, and human decision.</p>
              <div className="decision-id"><span>Decision Capsule</span><strong className="mono">PF-2841</strong></div>
              <Button onClick={() => navigate('decisions')} icon={<ArrowRight size={16} />}>Open Decision Capsule</Button>
            </div>
          ) : (
            <>
              <header className="review-head"><div className="review-alert"><CircleAlert size={19} /></div><div><Badge tone="warning">Human review required</Badge><h2>Candidate recommendation</h2></div></header>
              <div className="recommendation"><span>Agent recommendation</span><strong><X size={17} /> Do not proceed</strong><small>The agent cannot issue the final outcome independently.</small></div>
              <div className="factors">
                <div className="section-label">Recorded factors</div>
                <div><span>Required certification</span><strong className="positive">Present</strong></div>
                <div><span>Relevant experience</span><strong>4 years</strong></div>
                <div className="negative-factor"><span>Employment gap</span><strong>18 months</strong><small>Classified as unexplained · 71% confidence</small></div>
              </div>
              <div className="reviewer"><span className="avatar">MC</span><div><span>Assigned reviewer</span><strong>Maya Chen</strong><small>Senior Recruitment Lead</small></div></div>
              <div className="review-actions"><Button variant="secondary">Return for reassessment</Button><Button onClick={approve} icon={<UserRound size={15} />}>Approve recommendation</Button></div>
              <p className="review-note"><LockKeyhole size={13} /> Your decision and identity will be written to the evidence record.</p>
            </>
          )}
        </aside>
      </div>

      <Panel title="Application context" className="application-context">
        <div><BriefcaseBusiness size={17} /><span>Role</span><strong>Senior Product Analyst</strong></div>
        <div><Fingerprint size={17} /><span>Candidate</span><strong>PF candidate 2841</strong></div>
        <div><UserCheck size={17} /><span>Hiring team</span><strong>Product Strategy</strong></div>
        <div><Clock3 size={17} /><span>Received</span><strong>12 Jun 2026 · 09:41</strong></div>
      </Panel>
    </div>
  )
}
