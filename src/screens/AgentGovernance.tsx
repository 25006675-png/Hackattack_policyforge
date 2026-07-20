import { useState } from 'react'
import {
  ArrowRight, Bot, Check, CheckCircle2, ChevronRight, CircleAlert, Database,
  ExternalLink, FileText, Fingerprint, FlaskConical, Link2, LockKeyhole,
  Network, Play, SearchCheck, Shield, Sparkles, UserRoundCheck, WandSparkles,
} from 'lucide-react'
import { controls, testScenarios } from '../data'
import type { DemoState, PolicyFile, Screen, Tone } from '../types'
import { Badge, Button, PageHeader, Panel } from '../components/ui'

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
  const [testing, setTesting] = useState(false)
  const analysisLabels = ['Inspecting capabilities', 'Mapping accessed data', 'Finding applicable policies', 'Generating controls']
  const hasCompletedPolicyAnalysis = policyFile !== null && policyAnalysisComplete

  const analyze = () => {
    setAnalyzing(true)
    setAnalysisStep(0)
    analysisLabels.forEach((_, index) => setTimeout(() => setAnalysisStep(index + 1), 450 * (index + 1)))
    setTimeout(() => { setAnalyzing(false); update({ agentAnalyzed: true }) }, 2150)
  }

  const runTests = () => {
    setTesting(true)
    setTimeout(() => { setTesting(false); update({ testsComplete: true }) }, 1600)
  }

  const deploy = () => update({ agentActive: true })

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Agent governance · AGT-024"
        title="Candidate Screening Agent"
        description="Review this agent’s capabilities, policy controls, and deployment conditions."
        actions={<><Badge tone={state.agentActive ? 'success' : 'warning'} dot>{state.agentActive ? 'Active' : 'Awaiting approval'}</Badge><Button variant="secondary" icon={<ExternalLink size={15} />}>Agent record</Button></>}
      />

      <div className="entity-strip">
        <div><span>Owner</span><strong>Human Resources</strong></div>
        <div><span>Environment</span><strong>Production</strong></div>
        <div><span>Agent version</span><strong className="mono">2.1</strong></div>
        <div><span>Model</span><strong>TalentModel v4.2</strong></div>
        <div><span>Risk</span><Badge tone="danger">High</Badge></div>
        <div><span>Last changed</span><strong>17 Jul 2026</strong></div>
      </div>

      {hasCompletedPolicyAnalysis && <section className="agent-policy-source" aria-label="Source policy analysis">
        <div className="agent-policy-source-heading"><FileText size={18} /><span><strong title={policyFile.name}>{policyFile.name}</strong><small>Recruitment Policy v1.4 · Simulated prototype analysis</small></span></div>
        <div><span>File type</span><strong>{policyFile.type}</strong></div>
        <div><span>Policy analysis</span><strong>12 clauses detected</strong></div>
        <div><span>Policy controls</span><strong>8 generated</strong></div>
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
            <h2>Map this agent to policy</h2>
            <p>PolicyForge will inspect declared capabilities and data access, then draft controls linked to approved policy evidence.</p>
            {analyzing ? (
              <div className="analysis-progress">
                {analysisLabels.map((label, index) => <div key={label} className={analysisStep > index ? 'done' : analysisStep === index ? 'active' : ''}><span>{analysisStep > index ? <Check size={12} /> : index + 1}</span>{label}</div>)}
              </div>
            ) : <Button onClick={analyze} icon={<WandSparkles size={16} />}>Analyse agent</Button>}
            <small><LockKeyhole size={13} /> AI drafts controls. An authorized person approves them.</small>
          </Panel>
        </div>
      ) : (
        <>
          <div className="analysis-summary">
            <div><CheckCircle2 size={18} /><strong>Analysis complete</strong><span>7 controls generated</span></div>
            <div><Badge tone="warning">2 confirmations</Badge><Badge tone="danger">1 ambiguity</Badge></div>
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
                  <button key={control.id} className="control-row">
                    <span className={`control-glyph glyph-${outcomeTone(control.outcome)}`}><Shield size={14} /></span>
                    <div><strong>{control.situation}</strong><small>{control.detail}</small></div>
                    <Badge tone={outcomeTone(control.outcome)}>{control.outcome}</Badge>
                  </button>
                ))}
              </div>
            </section>

            <section className="mapping-column evidence-column">
              <header><span>3</span><div><strong>Policy evidence</strong><small>Approved source clauses</small></div></header>
              <div className="evidence-doc">
                <div className="evidence-doc-title"><FileText size={17} /><div><strong title={hasCompletedPolicyAnalysis ? policyFile.name : undefined}>{hasCompletedPolicyAnalysis ? policyFile.name : 'Recruitment Policy'}</strong><small>{hasCompletedPolicyAnalysis ? 'Recruitment Policy v1.4 · Representative simulated evidence' : 'Version 1.4 · Active'}</small></div></div>
                <p><mark>Candidate identity must be removed</mark> before applicant data is sent to an external model.</p>
                <p>Automated systems may recommend, but <mark>must not determine final candidate outcomes</mark> without authorized human review.</p>
                <p>Protected characteristics must not be used to rank or profile candidates.</p>
                <button className="text-button"><Link2 size={14} /> Open source policy</button>
              </div>
              <div className="evidence-links"><div><span>Data Policy §4.2</span><Badge tone="success">Verified</Badge></div><div><span>Recruitment §7.1</span><Badge tone="success">Verified</Badge></div><div><span>AI Standard §3.4</span><Badge tone="success">Verified</Badge></div></div>
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

            <Panel title="Policy test scenarios" description="Confirm each control returns the expected runtime outcome." action={<Button variant="secondary" loading={testing} disabled={!state.ambiguityResolved || testing} onClick={runTests} icon={<FlaskConical size={15} />}>{state.testsComplete ? 'Run tests again' : 'Run 4 tests'}</Button>}>
              <div className="test-list">
                {testScenarios.map((test) => <div key={test.title}><span className={state.testsComplete ? 'test-check complete' : 'test-check'}>{state.testsComplete ? <Check size={12} /> : <Play size={11} />}</span><strong>{test.title}</strong>{state.testsComplete ? <Badge tone={test.tone}>{test.result}</Badge> : <Badge>Not run</Badge>}</div>)}
              </div>
            </Panel>
          </div>

          <div className={`deployment-bar ${state.agentActive ? 'deployed' : ''}`}>
            <div>{state.agentActive ? <CheckCircle2 size={20} /> : <UserRoundCheck size={20} />}<span><strong>{state.agentActive ? 'Agent is actively governed' : 'Ready for authorized approval'}</strong><small>{state.agentActive ? 'Recruitment Policy v1.4 · 7 controls deployed' : state.testsComplete ? 'All required confirmations and tests are complete.' : 'Resolve the ambiguity and pass all policy tests.'}</small></span></div>
            {state.agentActive ? <Button onClick={() => navigate('action')} icon={<ArrowRight size={16} />}>Run governed action</Button> : <Button disabled={!state.testsComplete} onClick={deploy} icon={<Sparkles size={16} />}>Approve and deploy</Button>}
          </div>
        </>
      )}
    </div>
  )
}
