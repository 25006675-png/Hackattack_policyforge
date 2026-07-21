import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, Bot, BriefcaseBusiness, Check, CheckCircle2, CircleAlert,
  Clock3, FileText, Fingerprint, LockKeyhole, Network, ShieldCheck,
  UserCheck, UserRound, X,
} from 'lucide-react'
import type { DemoState, Screen } from '../types'
import { Badge, Button, PageHeader, Panel, ProgressBar } from '../components/ui'

const steps = [
  { title: 'Northstar ATS event received', detail: 'APP-8842 · Signed application webhook verified', icon: FileText, result: 'RECEIVED' },
  { title: 'Candidate identifiers detected', detail: '4 direct identifiers classified under clause 4.2', icon: Fingerprint, result: 'DETECTED' },
  { title: 'Identity removed before inference', detail: 'CTL-021 · Name, email, phone, and address removed', icon: ShieldCheck, result: 'TRANSFORMED' },
  { title: 'External model request authorized', detail: 'PolicyForge PEP intercepted the TalentModel tool call', icon: Network, result: 'ALLOW' },
  { title: 'TalentModel response recorded', detail: 'TalentModel v4.2 · Approved model output captured', icon: Bot, result: 'RECORDED' },
  { title: 'Negative recommendation paused', detail: 'CTL-025 · PDP returned HUMAN REVIEW', icon: CircleAlert, result: 'PAUSED' },
  { title: 'Authorized reviewer assigned', detail: 'Maya Chen · Senior Recruitment Lead', icon: UserCheck, result: 'ASSIGNED' },
]

export function GovernedAction({ state, update, navigate }: { state: DemoState; update: (next: Partial<DemoState>) => void; navigate: (screen: Screen) => void }) {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(state.actionComplete ? steps.length : 0)
  const [reviewed, setReviewed] = useState(state.decisionComplete)
  const [reassessmentRequested, setReassessmentRequested] = useState(false)
  const timerIds = useRef<number[]>([])

  const clearTimers = () => {
    timerIds.current.forEach((timerId) => window.clearTimeout(timerId))
    timerIds.current = []
  }

  useEffect(() => clearTimers, [])

  const run = () => {
    if (!state.agentActive) return navigate('agents')
    clearTimers()
    setRunning(true)
    setProgress(0)
    steps.forEach((_, index) => timerIds.current.push(window.setTimeout(() => setProgress(index + 1), 480 * (index + 1))))
    timerIds.current.push(window.setTimeout(() => {
      setRunning(false)
      update({ actionComplete: true })
      timerIds.current = []
    }, 480 * steps.length + 220))
  }

  const approve = () => {
    setReviewed(true)
    update({ actionComplete: true, decisionComplete: true })
  }

  return (
    <div className="page-stack governed-action-page">
      <PageHeader
        eyebrow="Runtime governance · ACT-8842"
        title={running ? 'Processing candidate application' : 'Candidate application'}
        description="Observe how the deployed policy intercepts an agent tool call, transforms candidate data, and assigns responsibility before an employment consequence."
        actions={<><Badge tone={reviewed ? 'success' : progress === steps.length ? 'warning' : 'info'} dot>{reviewed ? 'Review complete' : progress === steps.length ? 'Human review' : running ? 'Policy evaluation active' : 'Ready'}</Badge><Button variant="secondary" onClick={() => navigate('agents')}>Review deployed controls</Button></>}
      />

      <Panel title="Production system boundary" description="PolicyForge governs observable actions between the system of record, registered agent, external model, and accountable reviewer.">
        <div className="runtime-boundary" aria-label="Northstar ATS to Candidate Screening Agent to PolicyForge to HR review workflow"><div><FileText size={17} /><span><small>System of record</small><strong>Northstar ATS</strong></span></div><ArrowRight size={17} /><div><Bot size={17} /><span><small>Registered agent</small><strong>Candidate Screening Agent</strong></span></div><ArrowRight size={17} /><div><ShieldCheck size={17} /><span><small>PEP and PDP</small><strong>PolicyForge</strong></span></div><ArrowRight size={17} /><div><UserCheck size={17} /><span><small>Accountable decision</small><strong>HR reviewer</strong></span></div></div>
      </Panel>

      <div className="runtime-context">
        <div><span className="runtime-agent"><Bot size={19} /></span><div><strong>Candidate Screening Agent</strong><small>Agent v2.1 · TalentModel v4.2 · Manifest AM-024.7</small></div></div>
        <ArrowRight size={18} />
        <div><span className="runtime-policy"><ShieldCheck size={19} /></span><div><strong>Recruitment Policy v1.4</strong><small>7 cited runtime controls · Policy IR 1.4</small></div></div>
        <div className="runtime-status"><span /><strong>Enforced</strong></div>
      </div>

      <div className="action-layout">
        <Panel title={running ? 'Processing candidate application' : 'Governed execution'} description="Each stage produces a cited event in the append-only evidence record." action={!state.actionComplete && <Button onClick={run} loading={running} disabled={running || !state.agentActive}>{state.agentActive ? 'Process application' : 'Deploy agent first'}</Button>}>
          {!state.agentActive && <div className="inline-warning"><LockKeyhole size={17} /><span>This action is unavailable until the agent controls are approved and deployed.</span><button onClick={() => navigate('agents')}>Open governance workspace</button></div>}
          {running && <div className="runtime-progress" role="status"><div><span>Policy evaluation</span><strong>{Math.round((progress / steps.length) * 100)}%</strong></div><ProgressBar value={(progress / steps.length) * 100} tone="info" /></div>}
          <div className="execution-list" aria-live="polite">
            {steps.map((step, index) => {
              const Icon = step.icon
              const complete = progress > index
              const active = running && progress === index
              const intervention = index === 5 && complete
              return (
                <div key={step.title} className={`${complete ? 'complete' : ''} ${active ? 'active' : ''} ${intervention ? 'intervention' : ''}`}>
                  <span className="execution-icon">{complete && !intervention ? <Check size={15} /> : <Icon size={16} />}</span>
                  <div><strong>{step.title}</strong><small>{step.detail}</small></div>
                  {complete && <Badge tone={intervention ? 'warning' : index === 2 ? 'info' : 'success'}>{step.result}</Badge>}
                  {index < steps.length - 1 && <i />}
                </div>
              )
            })}
          </div>
          {progress === 0 && !running && state.agentActive && <div className="execution-empty"><Clock3 size={20} /><p>ACT-8842 is prepared with representative candidate data. No external service or real candidate record will be contacted.</p></div>}
        </Panel>

        <aside className={`review-panel ${progress === steps.length ? 'visible' : ''}`}>
          {progress < steps.length ? (
            <div className="review-placeholder"><UserCheck size={28} /><h2>Human review</h2><p>The review task appears only after CTL-025 pauses the negative recommendation and packages the cited evidence.</p></div>
          ) : reviewed ? (
            <div className="review-complete">
              <div className="success-seal"><CheckCircle2 size={30} /></div>
              <Badge tone="success">Decision recorded</Badge>
              <h2>Review complete</h2>
              <p>Maya Chen approved the recommendation. PolicyForge appended the model output, policy determination, reviewer identity, and consequence to PF-2841.</p>
              <div className="decision-id"><span>Decision Capsule</span><strong className="mono">PF-2841</strong></div>
              <Button onClick={() => navigate('decisions')} icon={<ArrowRight size={16} />}>Open Decision Capsule</Button>
            </div>
          ) : (
            <>
              <header className="review-head"><div className="review-alert"><CircleAlert size={19} /></div><div><Badge tone="warning">Human review required</Badge><h2>Candidate recommendation</h2></div></header>
              <div className="recommendation"><span>Agent recommendation</span><strong><X size={17} /> Do not proceed</strong><small>The PDP prevented the agent from issuing a final outcome.</small></div>
              <div className="factors">
                <div className="section-label">Recorded factors</div>
                <div><span>Required certification</span><strong className="positive">Present</strong></div>
                <div><span>Relevant experience</span><strong>4 years</strong></div>
                <div className="negative-factor"><span>Employment gap</span><strong>18 months</strong><small>Classified as unexplained · 71% confidence</small></div>
              </div>
              <div className="reviewer"><span className="avatar">MC</span><div><span>Assigned reviewer</span><strong>Maya Chen</strong><small>Senior Recruitment Lead · Eligible under clause 7.3</small></div></div>
              {reassessmentRequested ? <div className="review-reassessment" role="status"><CircleAlert size={17} /><div><strong>Reassessment draft created</strong><span>No outcome was issued. Return to the review if you want to continue the prepared pitch path.</span></div><Button variant="secondary" onClick={() => setReassessmentRequested(false)}>Resume review</Button></div> : <div className="review-actions"><Button variant="secondary" onClick={() => setReassessmentRequested(true)}>Return for reassessment</Button><Button onClick={approve} icon={<UserRound size={15} />}>Approve recommendation</Button></div>}
              <p className="review-note"><LockKeyhole size={13} /> Your decision and identity will be appended to the evidence record.</p>
            </>
          )}
        </aside>
      </div>

      <Panel title="Application context" className="application-context">
        <div><BriefcaseBusiness size={17} /><span>Role</span><strong>Senior Product Analyst</strong></div>
        <div><Fingerprint size={17} /><span>Candidate</span><strong>PF candidate 2841</strong></div>
        <div><UserCheck size={17} /><span>Hiring team</span><strong>Product Strategy</strong></div>
        <div><Clock3 size={17} /><span>Received</span><strong>12 June 2026 · 09:41</strong></div>
      </Panel>
    </div>
  )
}
