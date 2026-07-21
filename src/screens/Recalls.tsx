import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, Check, CheckCircle2, CircleAlert, ClipboardCheck, Clock3,
  FileCheck2, FileText, Mail, ShieldCheck,
  Table2, Users,
} from 'lucide-react'
import { downloadJsonArtifact } from '../services/policyDemo'
import type { DemoState, Screen } from '../types'
import { Badge, Button, Metric, PageHeader, Panel, ProgressBar } from '../components/ui'

const cases = [
  ['PF-2841', 'Candidate 2841', 'Caregiving leave', 'Awaiting reassessment', 'Maya Chen'],
  ['PF-2794', 'Candidate 2794', 'Medical leave', 'Awaiting reassessment', 'Unassigned'],
  ['PF-2688', 'Candidate 2688', 'Professional development', 'Notice flagged', 'Jon Bell'],
  ['PF-2551', 'Candidate 2551', 'Caregiving leave', 'Awaiting reassessment', 'Unassigned'],
]

const STAGE_DURATION_MS = 3000

export function Recalls({ state, update, navigate }: { state: DemoState; update: (next: Partial<DemoState>) => void; navigate: (screen: Screen) => void }) {
  const [creating, setCreating] = useState(false)
  const [createdNow, setCreatedNow] = useState(false)
  const createTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (createTimer.current !== null) window.clearTimeout(createTimer.current)
  }, [])

  const createRecall = () => {
    setCreating(true)
    createTimer.current = window.setTimeout(() => {
      setCreating(false)
      setCreatedNow(true)
      update({ recallCreated: true })
      createTimer.current = null
    }, STAGE_DURATION_MS)
  }

  if (!state.replayComplete) {
    return <div className="page-stack"><PageHeader eyebrow="Controlled remediation" title="Recall center" description="Turn governance findings into accountable correction work." /><Panel><div className="locked-empty"><ShieldCheck size={28} /><h2>No recall source is available</h2><p>Run Policy Replay PR-005 to identify affected decisions before creating a recall.</p><Button onClick={() => navigate('time-machine')}>Open Time Machine</Button></div></Panel></div>
  }

  if (!state.recallCreated) {
    return (
      <div className="page-stack recalls-page">
        <PageHeader eyebrow="Controlled remediation" title="Create recall" description="Convert replay findings into assigned, reviewable correction work." actions={<Badge tone="danger">Draft</Badge>} />
        <div className="recall-source"><span className="source-icon"><FileText size={18} /></span><div><span>Source finding</span><strong>Policy Replay PR-005</strong><small>Recruitment Policy v1.4 → v1.5 · Completed 19 Jul 2026</small></div><Button variant="ghost" onClick={() => navigate('time-machine')}>View replay</Button></div>
        <div className="recall-create-grid">
          <Panel title="Recall scope" description="Only decisions whose governance outcome changed are included.">
            <div className="scope-summary"><Metric label="Affected decisions" value="73" tone="danger" /><Metric label="Connected notices" value="18" tone="warning" /><Metric label="Affected reports" value="3" tone="warning" /></div>
            <div className="form-grid"><label><span>Recall name</span><input value="Recruitment leave-policy reassessment" readOnly /></label><label><span>Accountable owner</span><select defaultValue="director"><option value="director">Director of Human Resources</option><option>Head of Recruitment</option></select></label><label><span>Review standard</span><select defaultValue="independent"><option value="independent">Independent human reassessment</option></select></label><label><span>Target completion</span><input value="14 Aug 2026" readOnly /></label></div>
          </Panel>
          <Panel title="Remediation plan" description="Each action is recorded against the original decision.">
            <div className="remediation-checklist">
              {[
                [ClipboardCheck, 'Reopen affected decisions', 'Create reassessment tasks without altering original records'],
                [Users, 'Assign independent human review', 'Route cases away from the original decision maker'],
                [Mail, 'Flag connected candidate notices', 'Prevent reuse until review is complete'],
                [Table2, 'Mark affected management reports', 'Identify reports containing dependent rankings'],
                [FileCheck2, 'Preserve original evidence', 'Add corrections as new events in the audit history'],
              ].map(([Icon, title, detail]) => { const ItemIcon = Icon as typeof Check; return <div key={String(title)}><span><ItemIcon size={16} /></span><div><strong>{String(title)}</strong><small>{String(detail)}</small></div><Check size={15} /></div> })}
            </div>
          </Panel>
        </div>
        <div className="recall-warning"><CircleAlert size={17} /><p><strong>This recall will not reverse decisions automatically.</strong> It creates human reassessment work and preserves every original record.</p></div>
        <div className="creation-actions"><Button variant="secondary" onClick={() => navigate('time-machine')}>Cancel</Button><Button loading={creating} onClick={createRecall} icon={<ShieldCheck size={16} />}>Create Recall RC-017</Button></div>
      </div>
    )
  }

  return (
    <div className="page-stack recalls-page">
      <PageHeader eyebrow="Recall · RC-017" title="Recruitment leave-policy reassessment" description="Independent review of candidate decisions affected by Recruitment Policy v1.5." actions={<><Badge tone="danger" dot>Active recall</Badge><Button variant="secondary" onClick={() => downloadJsonArtifact('RC-017-recall-report.json', { recallId: 'RC-017', sourceReplay: 'PR-005', policyChange: 'Recruitment Policy v1.4 to v1.5', accountableOwner: 'Director of Human Resources', status: 'Active recall', identified: 73, awaitingReassessment: 73, reviewed: 0, corrected: 0, cases })}>Export recall JSON</Button></>} />
      {createdNow && <div className="created-banner"><CheckCircle2 size={20} /><div><strong>Recall RC-017 created</strong><span>73 reassessment tasks are ready for assignment.</span></div><button onClick={() => setCreatedNow(false)}>Dismiss</button></div>}
      <div className="recall-meta"><div><span>Source</span><strong>Policy Replay PR-005</strong></div><div><span>Accountable owner</span><strong>Director of Human Resources</strong></div><div><span>Created</span><strong>19 Jul 2026 · 11:24</strong></div><div><span>Target</span><strong>14 Aug 2026</strong></div><div><span>Status</span><Badge tone="warning">Reassessment</Badge></div></div>
      <div className="metric-grid"><Metric label="Decisions identified" value="73" tone="danger" /><Metric label="Awaiting reassessment" value="73" tone="warning" /><Metric label="Reviewed" value="0" /><Metric label="Corrected" value="0" /></div>
      <Panel title="Recall progress" action={<span className="progress-percent">0% complete</span>}><div className="recall-stage-labels"><span className="active"><i>1</i>Scope confirmed</span><span><i>2</i>Cases assigned</span><span><i>3</i>Independent review</span><span><i>4</i>Corrections recorded</span><span><i>5</i>Recall closed</span></div><ProgressBar value={7} tone="danger" /></Panel>
      <Panel title="Affected decisions" description="Original outcomes remain visible while reassessment is performed.">
        <div className="table-wrap"><table><thead><tr><th>Decision</th><th>Candidate</th><th>Changed factor</th><th>Remediation status</th><th>Reviewer</th></tr></thead><tbody>{cases.map(([id, candidate, factor, status, reviewer]) => <tr key={id} className={id === 'PF-2841' ? 'clickable-row' : ''} tabIndex={id === 'PF-2841' ? 0 : undefined} aria-label={id === 'PF-2841' ? 'Open Decision Capsule PF-2841' : undefined} onClick={() => id === 'PF-2841' && navigate('decisions')} onKeyDown={(event) => { if (id === 'PF-2841' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); navigate('decisions') } }}><td><strong className="mono">{id}</strong></td><td>{candidate}</td><td>{factor}</td><td><Badge tone={status === 'Notice flagged' ? 'danger' : 'warning'} dot>{status}</Badge></td><td>{reviewer === 'Unassigned' ? <span className="muted">Unassigned</span> : <span className="reviewer-cell"><span>{reviewer.split(' ').map((n) => n[0]).join('')}</span>{reviewer}</span>}</td></tr>)}</tbody></table></div>
        <div className="table-footer"><span>Showing 4 records from the 73-case recall scope.</span></div>
      </Panel>
      <div className="recall-audit"><Clock3 size={17} /><div><strong>Original evidence is immutable</strong><span>Every reassessment and correction will be recorded as a new event alongside the original Decision Capsule.</span></div><Badge tone="success">Audit ready</Badge></div>
    </div>
  )
}
