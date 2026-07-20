import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, CircleAlert, Clock3,
  FileSearch, GitBranch, PauseCircle, SearchCheck, ShieldCheck, Siren,
} from 'lucide-react'
import type { Screen } from '../types'
import { Badge, Button, Metric, PageHeader, Panel, ProgressBar } from '../components/ui'

const representativeIncidents = [{
  id: 'MI-021',
  type: 'Model defect',
  model: 'TalentModel v4.2',
  agent: 'Candidate Screening Agent v2.1',
  detectedBy: 'Post-deployment fairness audit',
  affectedPeriod: 'January – June 2026',
  severity: 'Critical',
  status: 'Investigation required',
  problem: 'Documented caregiving leave was incorrectly classified as an unexplained employment gap.',
  risk: 'The incorrect classification may have negatively influenced candidate recommendations and downstream hiring decisions.',
}]

const workflowLabels = ['Incident confirmed', 'Model use paused', 'Historical decisions scanned', 'Downstream consequences traced', 'Model recall launched']
const scanLabels = ['Locating decisions produced by TalentModel v4.2', 'Matching model-version evidence', 'Checking connected candidate outcomes', 'Identifying possibly affected decisions']
const traceLabels = ['Mapping dependent hiring decisions', 'Tracing connected candidate notices', 'Checking rankings and reports', 'Confirming downstream recall scope']
const affectedRecords = [
  ['PF-2841', 'Candidate 2841', 'Caregiving leave', 'Negative recommendation', 'Awaiting reassessment'],
  ['PF-2794', 'Candidate 2794', 'Medical leave', 'Negative recommendation', 'Awaiting reassessment'],
  ['PF-2688', 'Candidate 2688', 'Professional-development leave', 'Ranking affected', 'Notice flagged'],
  ['PF-2551', 'Candidate 2551', 'Caregiving leave', 'Negative recommendation', 'Unassigned'],
]
const remediationPlan = ['Pause further use of TalentModel v4.2', 'Prevent reuse of affected outputs', 'Reopen possibly affected decisions', 'Assign independent human reviewers', 'Flag connected candidate notices', 'Mark affected rankings and reports', 'Preserve original model and decision evidence', 'Require validation before deploying a replacement model']

export function ModelIncident({ navigate }: { navigate: (screen: Screen) => void }) {
  const incident = representativeIncidents.find((item) => item.id === 'MI-021')
  const [workflowStage, setWorkflowStage] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [scanStage, setScanStage] = useState(-1)
  const [tracing, setTracing] = useState(false)
  const [traceStage, setTraceStage] = useState(-1)
  const scanTimerIds = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const traceTimerIds = useRef<Array<ReturnType<typeof setTimeout>>>([])

  const clearScanTimers = () => {
    scanTimerIds.current.forEach((timerId) => clearTimeout(timerId))
    scanTimerIds.current = []
  }
  const clearTraceTimers = () => {
    traceTimerIds.current.forEach((timerId) => clearTimeout(timerId))
    traceTimerIds.current = []
  }

  useEffect(() => () => {
    clearScanTimers()
    clearTraceTimers()
  }, [])

  const advance = (expected: number, next: number) => {
    if (scanning || tracing || workflowStage !== expected) return
    setWorkflowStage(next)
  }

  const scanHistory = () => {
    if (scanning || tracing || workflowStage !== 2) return
    clearScanTimers()
    setScanning(true)
    setScanStage(0)
    scanLabels.slice(1).forEach((_, index) => scanTimerIds.current.push(setTimeout(() => setScanStage(index + 1), 650 * (index + 1))))
    scanTimerIds.current.push(setTimeout(() => {
      setScanning(false)
      setWorkflowStage(3)
      scanTimerIds.current = []
    }, 650 * scanLabels.length))
  }

  const traceImpact = () => {
    if (scanning || tracing || workflowStage !== 3) return
    clearTraceTimers()
    setTracing(true)
    setTraceStage(0)
    traceLabels.slice(1).forEach((_, index) => traceTimerIds.current.push(setTimeout(() => setTraceStage(index + 1), 600 * (index + 1))))
    traceTimerIds.current.push(setTimeout(() => {
      setTracing(false)
      setWorkflowStage(4)
      traceTimerIds.current = []
    }, 600 * traceLabels.length))
  }

  if (!incident) return <div className="page-stack model-incident-page"><PageHeader eyebrow="Model remediation" title="No representative model incident is available." /><Panel><div className="model-incident-empty"><Siren size={28} /><p>No representative model incident is available.</p><div><Button variant="secondary" onClick={() => navigate('recalls')}>Back to Recall Center</Button><Button onClick={() => navigate('agents')}>Back to Agents</Button></div></div></Panel></div>

  const busy = scanning || tracing
  const actions = [
    { label: 'Confirm Model Incident', icon: Siren, run: () => advance(0, 1) },
    { label: 'Pause Model v4.2', icon: PauseCircle, run: () => advance(1, 2) },
    { label: 'Scan Historical Decisions', icon: SearchCheck, run: scanHistory },
    { label: 'Trace Downstream Impact', icon: GitBranch, run: traceImpact },
    { label: 'Launch Model Recall MR-021', icon: ShieldCheck, run: () => advance(4, 5) },
  ]

  return (
    <div className="page-stack model-incident-page">
      <PageHeader eyebrow={`Model incident · ${incident.id}`} title="Model Incident Recall" description="Investigate a representative deployed-model defect and create accountable human reassessment work." actions={<Badge tone={workflowStage === 5 ? 'danger' : workflowStage >= 2 ? 'warning' : 'danger'} dot>{workflowStage === 5 ? 'Active recall' : workflowStage >= 2 ? 'Model use paused' : incident.status}</Badge>} />

      <div className="model-incident-nav"><span>Simulated prototype model remediation · Representative incident</span><Button variant="ghost" icon={<ArrowLeft size={15} />} onClick={() => navigate('recalls')}>Back to Recall Center</Button></div>

      <Panel title="Representative model incident" description={`${incident.id} · ${incident.type}`} action={<Badge tone="danger">{incident.severity}</Badge>} className="model-incident-severity-panel">
        <div className="model-incident-summary">
          <div><span>Model</span><strong>{incident.model}</strong></div><div><span>Agent</span><strong>{incident.agent}</strong></div><div><span>Detected by</span><strong>{incident.detectedBy}</strong></div><div><span>Affected period</span><strong>{incident.affectedPeriod}</strong></div>
          <section className="model-incident-problem"><span>Problem</span><p>{incident.problem}</p></section><section className="model-incident-risk"><span>Risk</span><p>{incident.risk}</p></section>
        </div>
      </Panel>

      <Panel title="Model information" description="Representative deployment context at the time of the incident.">
        <div className="model-incident-information"><div><span>Model</span><strong>TalentModel v4.2</strong></div><div><span>Deployment</span><strong>Production</strong></div><div><span>Owner</span><strong>People Analytics</strong></div><div><span>Used by</span><strong>Candidate Screening Agent</strong></div><div><span>Policy at incident time</span><strong>Recruitment Policy v1.4</strong></div><div><span>Last validated</span><strong>3 January 2026</strong></div></div>
      </Panel>

      <div className="model-incident-workflow" aria-label="Model incident workflow">
        {workflowLabels.map((label, index) => <div key={label} className={workflowStage > index ? 'complete' : workflowStage === index ? 'current' : ''}><span>{workflowStage > index ? <Check size={13} /> : index + 1}</span><strong>{label}</strong>{index < workflowLabels.length - 1 && <i />}</div>)}
      </div>

      <Panel title="Incident actions" description="Each controlled action unlocks only the next stage.">
        <div className="model-incident-actions">{actions.map(({ label, icon: Icon, run }, index) => { const complete = workflowStage > index; const available = workflowStage === index && !busy; return <div key={label} className={complete ? 'complete' : available ? 'available' : ''}><span>{complete ? <Check size={14} /> : <Icon size={14} />}</span><strong>{label}</strong><Button variant={available ? 'primary' : 'secondary'} onClick={run} loading={(index === 2 && scanning) || (index === 3 && tracing)} disabled={!available}>{complete ? 'Complete' : label}</Button></div> })}</div>
      </Panel>

      {scanning && <Panel title="Scanning historical decisions" description="Simulated evidence scan · No production records are accessed."><div className="model-incident-animation" aria-live="polite">{scanLabels.map((label, index) => <div key={label} className={index < scanStage ? 'done' : index === scanStage ? 'active' : ''}><span>{index < scanStage ? <Check size={13} /> : index + 1}</span><strong>{label}</strong></div>)}<ProgressBar value={((scanStage + 1) / scanLabels.length) * 100} tone="violet" /></div></Panel>}

      {workflowStage >= 3 && <Panel title="Historical scan results" description="Representative model-version evidence matched to connected candidate outcomes." action={<Badge tone="warning">Human reassessment required</Badge>}><div className="model-incident-scan-results"><Metric label="Historical decisions scanned" value="2,841" tone="violet" /><Metric label="Unaffected" value="2,768" tone="success" /><Metric label="Possibly affected" value="73" tone="danger" /><div><span>Confidence</span><strong>High-priority human reassessment required</strong></div></div></Panel>}

      {tracing && <Panel title="Tracing downstream impact" description="Following representative dependencies without changing original evidence."><div className="model-incident-animation" aria-live="polite">{traceLabels.map((label, index) => <div key={label} className={index < traceStage ? 'done' : index === traceStage ? 'active' : ''}><span>{index < traceStage ? <Check size={13} /> : index + 1}</span><strong>{label}</strong></div>)}<ProgressBar value={((traceStage + 1) / traceLabels.length) * 100} tone="danger" /></div></Panel>}

      {workflowStage >= 4 && <>
        <div className="model-incident-impact-grid">
          <Panel title="Downstream consequences" description="Representative consequence trace for TalentModel v4.2."><div className="model-incident-tree"><div className="model-incident-tree-root"><strong>TalentModel v4.2</strong></div><div className="model-incident-tree-connector" aria-hidden="true" /><div className="model-incident-tree-nodes"><div><strong>73</strong><span>hiring decisions</span></div><div><strong>18</strong><span>rejection notices</span></div><div><strong>6</strong><span>interview rankings</span></div><div><strong>3</strong><span>management reports</span></div></div></div></Panel>
          <Panel title="Remediation plan" description="Controlled actions prepared before recall launch."><ul className="model-incident-plan">{remediationPlan.map((item) => <li key={item}><CheckCircle2 size={14} />{item}</li>)}</ul></Panel>
        </div>
        <Panel title="Representative affected records" description="Only PF-2841 opens the existing Decision Capsule workflow."><div className="model-incident-records"><table><thead><tr><th>Decision</th><th>Candidate</th><th>Changed factor</th><th>Model effect</th><th>Remediation status</th></tr></thead><tbody>{affectedRecords.map(([id, candidate, factor, effect, status]) => <tr key={id} className={id === 'PF-2841' ? 'clickable-row' : ''} tabIndex={id === 'PF-2841' ? 0 : undefined} aria-label={id === 'PF-2841' ? 'Open Decision Capsule PF-2841' : undefined} onClick={() => id === 'PF-2841' && navigate('decisions')}><td><strong className="mono">{id}</strong></td><td>{candidate}</td><td>{factor}</td><td>{effect}</td><td><Badge tone={status === 'Notice flagged' ? 'danger' : 'warning'} dot>{status}</Badge></td></tr>)}</tbody></table></div></Panel>
        {workflowStage === 4 && <div className="model-incident-warning"><CircleAlert size={18} /><p><strong>This recall will not reverse decisions automatically.</strong> It creates accountable reassessment work while preserving original evidence.</p></div>}
      </>}

      {workflowStage === 5 && <>
        <div className="model-incident-launched"><Siren size={25} /><div><Badge tone="danger" dot>Active recall</Badge><h2>Model Recall MR-021</h2><p>Simulated prototype model remediation · Representative incident</p></div><dl><div><dt>Source</dt><dd>Model Incident MI-021</dd></div><div><dt>Model</dt><dd>TalentModel v4.2</dd></div><div><dt>Owner</dt><dd>Director of Human Resources</dd></div><div><dt>Status</dt><dd>Active recall</dd></div></dl></div>
        <div className="model-incident-metrics"><Metric label="Decisions identified" value="73" tone="danger" /><Metric label="Awaiting reassessment" value="73" tone="warning" /><Metric label="Reviewed" value="0" /><Metric label="Corrected" value="0" /></div>
        <Panel title="Recall progress" action={<span className="model-incident-progress">0% complete</span>}><div className="model-incident-recall-stages">{['Scope confirmed', 'Cases assigned', 'Independent review', 'Corrections recorded', 'Recall closed'].map((label, index) => <span key={label} className={index === 0 ? 'active' : ''}><i>{index + 1}</i>{label}</span>)}</div><div className="model-incident-progress-bar"><ProgressBar value={7} tone="danger" /></div></Panel>
        <div className="model-incident-audit"><Clock3 size={18} /><div><strong>Original evidence is immutable.</strong><span>Every reassessment and correction is recorded as a new event alongside the original Decision Capsule.</span></div><Badge tone="success">Audit ready</Badge></div>
      </>}

      <div className="model-incident-footer"><Button variant="secondary" icon={<ArrowLeft size={15} />} onClick={() => navigate('recalls')}>Back to Recall Center</Button>{workflowStage >= 4 && <Button icon={<FileSearch size={15} />} onClick={() => navigate('decisions')}>Open Decision Capsule for PF-2841 <ArrowRight size={14} /></Button>}</div>
    </div>
  )
}
