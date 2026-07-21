import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, Bot, Check, CheckCircle2, CircleAlert, FileClock, FileText,
  GitBranch, History, Mail, Network, Play, RefreshCw, Sparkles, Table2,
  Users,
} from 'lucide-react'
import type { DemoState, Screen } from '../types'
import { Badge, Button, Metric, PageHeader, Panel, ProgressBar } from '../components/ui'

const STAGE_DURATION_MS = 3000

export function TimeMachine({ state, update, navigate }: { state: DemoState; update: (next: Partial<DemoState>) => void; navigate: (screen: Screen) => void }) {
  const [running, setRunning] = useState(false)
  const [replayStep, setReplayStep] = useState(0)
  const timerIds = useRef<number[]>([])
  const replaySteps = ['Reconstructing historical decisions', 'Applying Policy v1.5', 'Comparing outcomes', 'Tracing downstream consequences']

  const clearTimers = () => {
    timerIds.current.forEach((timerId) => window.clearTimeout(timerId))
    timerIds.current = []
  }

  useEffect(() => clearTimers, [])

  const runReplay = () => {
    clearTimers()
    setRunning(true)
    setReplayStep(0)
    replaySteps.forEach((_, index) => timerIds.current.push(window.setTimeout(() => setReplayStep(index + 1), STAGE_DURATION_MS * (index + 1))))
    timerIds.current.push(window.setTimeout(() => {
      setRunning(false)
      update({ replayComplete: true })
      timerIds.current = []
    }, STAGE_DURATION_MS * replaySteps.length + 250))
  }

  return (
    <div className="page-stack time-machine-page">
      <PageHeader
        eyebrow="Policy replay · PR-005"
        title="Policy Time Machine"
        description="Test a proposed policy against historical decisions before it is deployed."
        actions={<><Badge tone="violet" dot>Deterministic replay</Badge><a className="button button-secondary" href="/policy-docs/Northstar-Recruitment-Policy-v1.5-Proposed.pdf" target="_blank" rel="noreferrer"><FileText size={15} /><span>Open Policy v1.5 PDF</span></a></>}
      />

      <div className="simulation-banner"><FileClock size={17} /><span><strong>Deterministic counterfactual analysis</strong> The replay worker evaluates stored action contexts against an immutable v1.5 policy snapshot. It does not alter original decisions or reverse real-world outcomes.</span></div>

      <Panel title="Policy version comparison" description="The proposed clause changes how documented leave is evaluated." className="policy-diff-panel">
        <div className="policy-diff">
          <div className="policy-version old"><header><span><FileText size={16} /> Active policy</span><Badge>v1.4</Badge></header><p>Employment gaps may be considered when evaluating candidate suitability.</p><small>Recruitment Policy · §7.4 Employment history</small></div>
          <div className="diff-arrow"><ArrowRight size={20} /></div>
          <div className="policy-version new"><header><span><Sparkles size={16} /> Proposed policy</span><Badge tone="violet">v1.5</Badge></header><p>Documented <mark>caregiving, medical, and professional-development leave must not be treated negatively.</mark></p><small>Recruitment Policy · §7.4 Employment history</small></div>
        </div>
      </Panel>

      {!state.replayComplete ? (
        <Panel className="replay-launch">
          <div className="replay-setup">
            <div><span>Historical period</span><strong>January – June 2026</strong></div><div><span>Agent</span><strong>Candidate Screening Agent</strong></div><div><span>Decisions</span><strong>2,841</strong></div><div><span>Comparison</span><strong>Policy v1.4 → v1.5</strong></div>
          </div>
          {running ? <div className="replay-running"><div className="replay-pulse"><RefreshCw size={23} /></div><div><strong>{replaySteps[Math.min(replayStep, replaySteps.length - 1)]}…</strong><ProgressBar value={(replayStep / replaySteps.length) * 100} tone="violet" /><span>{Math.min(replayStep, replaySteps.length)} of {replaySteps.length} stages complete</span></div></div> : <div className="replay-action"><div><History size={21} /><span><strong>Ready to replay 2,841 decisions</strong><small>Historical decision records · Estimated runtime 12 seconds</small></span></div><Button onClick={runReplay} icon={<Play size={15} />}>Run historical replay</Button></div>}
        </Panel>
      ) : (
        <>
          <div className="replay-complete-banner"><CheckCircle2 size={19} /><div><strong>Replay complete</strong><span>Policy v1.5 produced a different governance outcome for 73 decisions.</span></div><Button variant="ghost" onClick={runReplay} icon={<RefreshCw size={14} />}>Run again</Button></div>

          <div className="metric-grid replay-metrics">
            <Metric label="Decisions replayed" value="2,841" detail="Jan – Jun 2026" />
            <Metric label="Unchanged" value="2,768" detail="97.4% of decisions" tone="success" />
            <Metric label="Affected" value="73" detail="2.6% changed outcome" tone="violet" />
            <Metric label="Require reassessment" value="73" detail="Independent human review" tone="warning" />
          </div>

          <div className="replay-results-grid">
            <Panel title="Changed decision · PF-2841" description="Why this candidate’s governance outcome changes under the proposed policy.">
              <div className="decision-compare">
                <div className="compare-card original"><header><span>Original determination</span><Badge>Policy v1.4</Badge></header><div className="factor-line"><span>Recorded fact</span><strong>18-month documented caregiving leave</strong></div><div className="factor-line negative"><span>Policy treatment</span><strong>Counted as a negative employment gap</strong></div><div className="outcome-line"><CircleAlert size={17} /><span><small>Result</small><strong>Rejection recommendation permitted</strong></span></div></div>
                <ArrowRight size={20} className="compare-arrow" />
                <div className="compare-card replayed"><header><span>Replayed determination</span><Badge tone="violet">Policy v1.5</Badge></header><div className="factor-line"><span>Recorded fact</span><strong>18-month documented caregiving leave</strong></div><div className="factor-line positive"><span>Policy treatment</span><strong>Excluded from negative evaluation</strong></div><div className="outcome-line"><Users size={17} /><span><small>Result</small><strong>Independent reassessment required</strong></span></div></div>
              </div>
              <button className="text-button" onClick={() => navigate('decisions')}>Open original Decision Capsule <ArrowRight size={14} /></button>
            </Panel>

            <Panel title="Downstream blast radius" description="Explore everything connected to the changed policy clause." className="blast-panel">
              <div className="blast-graph">
                <div className="blast-node root"><FileText size={17} /><span><small>Changed clause</small><strong>Policy §7.4</strong></span></div>
                <i className="blast-line line-one" />
                <div className="blast-node agent"><Bot size={17} /><span><small>Governed system</small><strong>Candidate Agent</strong></span></div>
                <i className="blast-line line-two" />
                <div className="blast-node decisions"><GitBranch size={17} /><span><small>Affected records</small><strong>73 decisions</strong></span></div>
                <i className="blast-branch branch-a" /><i className="blast-branch branch-b" /><i className="blast-branch branch-c" />
                <div className="blast-node output notices"><Mail size={16} /><span><small>Notices</small><strong>18</strong></span></div>
                <div className="blast-node output rankings"><Network size={16} /><span><small>Rankings</small><strong>6</strong></span></div>
                <div className="blast-node output reports"><Table2 size={16} /><span><small>Reports</small><strong>3</strong></span></div>
              </div>
            </Panel>
          </div>

          <div className="recall-callout"><div className="recall-callout-icon"><CircleAlert size={21} /></div><div><Badge tone="danger">Action required</Badge><h2>73 decisions need accountable reassessment</h2><p>Create a controlled recall to assign an owner, reopen cases, and preserve correction evidence.</p></div><Button onClick={() => navigate('recalls')} icon={<ArrowRight size={16} />}>Create recall</Button></div>
        </>
      )}
    </div>
  )
}
