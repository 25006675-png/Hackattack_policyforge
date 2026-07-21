import {
  ArrowRight, Bot, CheckCircle2, ChevronRight, CircleAlert, Clock3,
  FileWarning, Fingerprint, ShieldAlert, Users,
} from 'lucide-react'
import { agentRows } from '../data'
import type { DemoState, Screen, Tone } from '../types'
import { Badge, Button, Metric, PageHeader, Panel, ProgressBar } from '../components/ui'

function statusTone(status: string): Tone {
  if (status === 'Active') return 'success'
  if (status === 'Restricted') return 'danger'
  return 'warning'
}

export function Overview({ state, policyAnalysisComplete, navigate }: { state: DemoState; policyAnalysisComplete: boolean; navigate: (screen: Screen) => void }) {
  const candidateStatus = state.agentActive ? 'Active' : 'Awaiting approval'
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="AI governance"
        title="Governance overview"
        description="A live view of agents, consequential decisions, and policy interventions across Northstar Group."
      />

      <section className={`attention-panel ${state.agentActive ? 'attention-complete' : ''}`}>
        <div className="attention-icon">{state.agentActive ? <CheckCircle2 size={22} /> : <ShieldAlert size={22} />}</div>
        <div className="attention-copy">
          <div className="attention-label">{state.agentActive ? 'Recently governed' : 'Approval required'}</div>
          <h2>Candidate Screening Agent</h2>
          <p>Reads candidate résumés, calls an external model, and produces employment recommendations.</p>
          <div className="inline-meta">
            <Badge tone="danger" dot>High risk</Badge>
            <span><Bot size={14} /> Agent v2.1</span>
            <span><Fingerprint size={14} /> 5 data categories</span>
            <span><Users size={14} /> Human Resources</span>
          </div>
        </div>
        <div className="attention-risks">
          <strong>{state.agentActive ? '7' : '3'}</strong>
          <span>{state.agentActive ? 'active controls' : 'high-risk capabilities'}</span>
        </div>
        <Button onClick={() => navigate(policyAnalysisComplete ? 'agents' : 'policies')} icon={<ArrowRight size={16} />}>
          {state.agentActive ? 'Open agent' : policyAnalysisComplete ? 'Review agent' : 'Analyse policy first'}
        </Button>
      </section>

      <div className="metric-grid">
        <Metric label="Registered agents" value="24" detail="Across 8 departments" />
        <Metric label="Governed actions" value="12,481" detail="+8.4% this month" tone="info" />
        <Metric label="Human interventions" value="116" detail="0.9% of governed actions" tone="warning" />
        <Metric label="Sensitive-data transforms" value="47" detail="All completed before inference" tone="success" />
      </div>

      <div className="overview-grid">
        <Panel title="Agent inventory" description="Registered AI systems and their current governance status." action={<button className="text-button" onClick={() => navigate('agents')}>View all <ChevronRight size={15} /></button>}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Agent</th><th>Owner</th><th>Risk</th><th>Status</th><th>Version</th></tr></thead>
              <tbody>
                {agentRows.map(([name, owner, risk, status, version], index) => {
                  const visibleStatus = index === 0 ? candidateStatus : status
                  return (
                    <tr key={name} onClick={() => index === 0 && navigate('agents')} onKeyDown={(event) => { if (index === 0 && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); navigate('agents') } }} tabIndex={index === 0 ? 0 : undefined} aria-label={index === 0 ? 'Review Candidate Screening Agent' : undefined} className={index === 0 ? 'clickable-row' : ''}>
                      <td><span className="agent-cell-icon"><Bot size={15} /></span><strong>{name}</strong></td>
                      <td>{owner}</td>
                      <td><Badge tone={risk === 'High' ? 'danger' : risk === 'Medium' ? 'warning' : 'neutral'}>{risk}</Badge></td>
                      <td><Badge tone={statusTone(visibleStatus)} dot>{visibleStatus}</Badge></td>
                      <td className="mono">v{version}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="side-stack">
          <Panel title="Policy alert" className="alert-panel">
            <div className="policy-alert">
              <div className="policy-alert-icon"><FileWarning size={18} /></div>
              <div>
                <Badge tone="violet">Proposed policy</Badge>
                <h3>Recruitment Policy v1.5</h3>
                <p>One clause may change historical candidate outcomes.</p>
              </div>
            </div>
            <div className="policy-impact">
              <div><span>Potentially affected</span><strong>73 decisions</strong></div>
              <Button variant="secondary" onClick={() => navigate('time-machine')}>Review impact</Button>
            </div>
          </Panel>

          <Panel title="Governance activity">
            <div className="activity-list">
              <div><span className="activity-icon success"><CheckCircle2 size={14} /></span><p><strong>Invoice Agent v4.1</strong> completed quarterly review<small>18 minutes ago · Finance</small></p></div>
              <div><span className="activity-icon warning"><CircleAlert size={14} /></span><p><strong>Support Agent</strong> escalated 8 actions for review<small>1 hour ago · Customer Operations</small></p></div>
              <div><span className="activity-icon neutral"><Clock3 size={14} /></span><p><strong>AI Standard v3.8</strong> scheduled for deployment<small>Yesterday · AI Governance</small></p></div>
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="coverage-panel">
        <div className="coverage-copy"><span>Governance coverage</span><strong>18 of 24 agents actively governed</strong></div>
        <ProgressBar value={75} tone="info" />
        <div className="coverage-legend"><span><i className="legend-active" />18 active</span><span><i className="legend-restricted" />4 restricted</span><span><i className="legend-awaiting" />2 awaiting review</span></div>
      </Panel>
    </div>
  )
}
