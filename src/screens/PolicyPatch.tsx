import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, CircleAlert, FilePlus2,
  FlaskConical, ShieldCheck, Sparkles,
} from 'lucide-react'
import { policyPatchIncidents } from '../data'
import type { Screen } from '../types'
import { Badge, Button, PageHeader, Panel, ProgressBar } from '../components/ui'

const workflowStages = [
  'Incident confirmed',
  'Converted into test scenario',
  'Policy patch generated',
  'Existing scenarios retested',
  'Administrator approval',
]

const retestStages = [
  'Adding incident scenario',
  'Reapplying policy controls',
  'Checking previous loopholes',
  'Measuring updated coverage',
]

export function PolicyPatch({ navigate }: { navigate: (screen: Screen) => void }) {
  const incident = policyPatchIncidents.find((item) => item.id === 'INC-042')
  const [workflowStage, setWorkflowStage] = useState(0)
  const [retesting, setRetesting] = useState(false)
  const [retestStage, setRetestStage] = useState(-1)
  const retestTimerIds = useRef<Array<ReturnType<typeof setTimeout>>>([])

  const clearRetestTimers = () => {
    retestTimerIds.current.forEach((timerId) => clearTimeout(timerId))
    retestTimerIds.current = []
  }

  useEffect(() => () => clearRetestTimers(), [])

  const advance = (expectedStage: number, nextStage: number) => {
    if (retesting || workflowStage !== expectedStage) return
    setWorkflowStage(nextStage)
  }

  const retest = () => {
    if (retesting || workflowStage !== 3) return
    clearRetestTimers()
    setRetesting(true)
    setRetestStage(0)
    retestStages.slice(1).forEach((_, index) => {
      retestTimerIds.current.push(setTimeout(() => setRetestStage(index + 1), 650 * (index + 1)))
    })
    retestTimerIds.current.push(setTimeout(() => {
      setRetesting(false)
      setWorkflowStage(4)
      retestTimerIds.current = []
    }, 650 * retestStages.length))
  }

  if (!incident) {
    return (
      <div className="page-stack policy-patch-page">
        <PageHeader eyebrow="Incident remediation" title="No representative policy incident is available." description="Run a representative finding before opening the policy remediation workflow." />
        <Panel><div className="policy-patch-empty"><CircleAlert size={28} /><p>No representative policy incident is available.</p><div><Button variant="secondary" onClick={() => navigate('agents')}>Back to Agents</Button><Button onClick={() => navigate('action')}>Back to Runtime</Button></div></div></Panel>
      </div>
    )
  }

  const actionItems = [
    { label: 'Confirm Incident', completeAt: 1, onClick: () => advance(0, 1) },
    { label: 'Add as Test Scenario', completeAt: 2, onClick: () => advance(1, 2) },
    { label: 'Generate Policy Patch', completeAt: 3, onClick: () => advance(2, 3) },
    { label: 'Retest Policy', completeAt: 4, onClick: retest },
    { label: 'Approve Policy v1.5', completeAt: 5, onClick: () => advance(4, 5) },
  ]

  return (
    <div className="page-stack policy-patch-page">
      <PageHeader
        eyebrow={`Incident remediation · ${incident.id}`}
        title="Incident-to-Policy Patch"
        description="Turn a representative governance loophole into a tested, administrator-approved policy improvement."
        actions={<Badge tone={workflowStage === 5 ? 'success' : 'violet'} dot>{workflowStage === 5 ? 'Policy v1.5 approved' : 'Remediation in progress'}</Badge>}
      />

      <div className="policy-patch-source-actions">
        <span>Simulated prototype remediation · Representative policy patch</span>
        <div><Button variant="ghost" icon={<ArrowLeft size={15} />} onClick={() => navigate('agents')}>Back to Governance Simulator</Button><Button variant="ghost" icon={<ArrowLeft size={15} />} onClick={() => navigate('action')}>Back to Employee Request Checker</Button></div>
      </div>

      <Panel title="Representative incident" description={`${incident.id} · ${incident.source}`} action={<Badge tone="danger">High severity</Badge>}>
        <div className="policy-patch-incident">
          <section><span>Problem</span><strong>{incident.problem}</strong></section>
          <section><span>Example request</span><pre>{incident.exampleRequest}</pre></section>
          <section><span>Existing policy</span><p>“{incident.existingPolicy}”</p></section>
          <section><span>Existing outcome</span><p>{incident.existingOutcome}</p></section>
          <section className="policy-patch-risk"><span>Risk</span><p>{incident.risk}</p></section>
        </div>
      </Panel>

      <Panel title="Incident impact" description="Current exposure under the representative policy version.">
        <div className="policy-patch-impact">
          <div><span>Affected control</span><strong>{incident.impact.affectedControl}</strong></div>
          <div><span>Current policy version</span><strong>{incident.impact.currentPolicyVersion}</strong></div>
          <div><span>Affected scenarios</span><strong>{incident.impact.affectedScenarios}</strong></div>
          <div><span>Current policy coverage</span><strong>{incident.impact.currentCoverage}</strong></div>
          <div><span>Severity</span><Badge tone="danger">{incident.impact.severity}</Badge></div>
        </div>
      </Panel>

      <div className="policy-patch-workflow" aria-label="Policy patch workflow">
        {workflowStages.map((stage, index) => {
          const complete = workflowStage > index
          const current = workflowStage === index
          return <div key={stage} className={complete ? 'complete' : current ? 'current' : ''}><span>{complete ? <Check size={13} /> : index + 1}</span><strong>{stage}</strong>{index < workflowStages.length - 1 && <i />}</div>
        })}
      </div>

      <Panel title="Remediation actions" description="Complete each controlled action to unlock the next stage.">
        <div className="policy-patch-actions">
          {actionItems.map((item, index) => {
            const complete = workflowStage >= item.completeAt
            const available = workflowStage === index && !retesting
            return <div key={item.label} className={complete ? 'complete' : available ? 'available' : ''}><span>{complete ? <CheckCircle2 size={17} /> : index + 1}</span><strong>{item.label}</strong><Button variant={available ? 'primary' : 'secondary'} onClick={item.onClick} loading={index === 3 && retesting} disabled={!available}>{complete ? 'Complete' : item.label}</Button></div>
          })}
        </div>
      </Panel>

      {workflowStage < 3 ? (
        <Panel className="policy-patch-locked"><div><ShieldCheck size={24} /><h2>Policy patch is locked</h2><p>Confirm the incident and convert it into a test scenario before generating the representative patch.</p></div></Panel>
      ) : (
        <>
          <div className="policy-patch-version"><span>Policy version</span><strong className="policy-patch-version-before">v1.4</strong><ArrowRight size={18} /><strong className="policy-patch-version-after">v1.5</strong></div>
          <div className="policy-patch-generated">
            <Panel title="Suggested Policy Patch" description="Representative wording generated for administrator review." action={<Badge tone="violet">PATCH-009</Badge>}>
              <blockquote>“{incident.suggestedPatch}”</blockquote>
            </Panel>
            <Panel title="Generated control" description="Simulated runtime enforcement derived from the suggested wording.">
              <div className="policy-patch-control"><span>IF</span><strong>{incident.generatedControl.if}</strong><span>AND</span><strong>{incident.generatedControl.and}</strong><span>THEN</span><ul>{incident.generatedControl.then.map((action) => <li key={action}><Check size={13} />{action}</li>)}</ul></div>
            </Panel>
          </div>
          <Panel title="Explanation of the change">
            <div className="policy-patch-comparison"><div><Badge tone="warning">Before patch</Badge><strong>{incident.comparison.before[0]}</strong><ArrowRight size={17} /><span>{incident.comparison.before[1]}</span></div><div><Badge tone="success">After patch</Badge><strong>{incident.comparison.after[0]}</strong><ArrowRight size={17} /><span>{incident.comparison.after[1]}</span></div></div>
          </Panel>
        </>
      )}

      {retesting && <Panel title="Retesting Policy v1.5" description="Applying the representative patch across existing and incident-derived scenarios."><div className="policy-patch-retest" aria-live="polite">{retestStages.map((stage, index) => <div key={stage} className={index < retestStage ? 'done' : index === retestStage ? 'active' : ''}><span>{index < retestStage ? <Check size={13} /> : index + 1}</span><strong>{stage}</strong></div>)}<ProgressBar value={((retestStage + 1) / retestStages.length) * 100} tone="violet" /></div></Panel>}

      {workflowStage >= 4 && <Panel title="Policy retest results" description="The incident scenario is now included in representative coverage testing." action={<Badge tone="success">100% coverage</Badge>}><div className="policy-patch-retest-results"><section className="policy-patch-results-before"><header><span>Before</span><strong>Policy v1.4</strong></header>{incident.retest.before.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section><ArrowRight size={21} /><section className="after policy-patch-results-after"><header><span>After</span><strong>Policy v1.5</strong></header>{incident.retest.after.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section></div></Panel>}

      {workflowStage >= 5 && <div className="policy-patch-approved"><div className="policy-patch-approved-icon"><Sparkles size={25} /></div><div className="policy-patch-approved-copy"><Badge tone="success" dot>Policy v1.5 approved</Badge><h2>Policy v1.5 approved</h2><p>Simulated prototype remediation · Representative policy patch</p></div><dl><div><dt>Policy version</dt><dd>{incident.approval.policyVersion}</dd></div><div><dt>Patch</dt><dd className="mono">{incident.approval.patch}</dd></div><div><dt>Approved by</dt><dd>{incident.approval.approvedBy}</dd></div><div className="policy-patch-approved-status"><dt>Status</dt><dd>{incident.approval.status}</dd></div></dl></div>}

      <div className="policy-patch-footer"><Button variant="secondary" icon={<FlaskConical size={15} />} onClick={() => navigate('agents')}>Back to Governance Simulator</Button><Button icon={<FilePlus2 size={15} />} onClick={() => navigate('action')}>Back to Employee Request Checker</Button></div>
    </div>
  )
}
