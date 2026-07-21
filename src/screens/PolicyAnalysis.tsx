import { ArrowLeft, ArrowRight, CheckCircle2, FileText, GitCompareArrows, Network, Sparkles } from 'lucide-react'
import { getPolicyFixture } from '../services/policyDemo'
import type { PolicyFile, Screen } from '../types'
import { Badge, Button, Metric, PageHeader, Panel } from '../components/ui'

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function PolicyAnalysis({ policyFile, policyAnalysisComplete, navigate }: { policyFile: PolicyFile | null; policyAnalysisComplete: boolean; navigate: (screen: Screen) => void }) {
  const fixture = getPolicyFixture(policyFile)
  if (!policyFile || !fixture || !policyAnalysisComplete) return <div className="page-stack policy-analysis-page"><PageHeader eyebrow="Policy analysis" title="No verified analysis available" description="Analyse a registered Northstar recruitment policy before reviewing its Policy IR and cited controls." /><Panel><div className="locked-empty"><FileText size={27} /><h2>Analysis is locked</h2><p>Unregistered documents cannot produce cited findings until the document ingestion connector is available.</p><Button onClick={() => navigate('policies')} icon={<ArrowLeft size={16} />}>Open policy intake</Button></div></Panel></div>

  return (
    <div className="page-stack policy-details-page policy-analysis-page">
      <PageHeader eyebrow={`Policy IR · ${fixture.documentId} · v${fixture.version}`} title="Cited policy analysis" description="Trace each source clause through normalization, Agent Manifest mapping, and the compiled runtime decision." actions={<><Badge tone={fixture.status === 'Active' ? 'success' : 'violet'} dot>{fixture.status}</Badge><Badge tone="neutral">Source verified</Badge></>} />

      <Panel title="Controlled document" description="Fingerprint and document-control metadata retained with the compiled policy version." action={<a className="button button-ghost" href={fixture.assetPath} target="_blank" rel="noreferrer"><FileText size={15} /><span>Open source PDF</span></a>}><div className="policy-metadata"><div><FileText size={18} /><span><small>File name</small><strong>{policyFile.name}</strong></span></div><div><small>File size</small><strong>{formatFileSize(policyFile.size)}</strong></div><div><small>Version and status</small><strong>v{fixture.version} · {fixture.status}</strong></div><div><small>Document owner</small><strong>{fixture.owner}</strong></div></div></Panel>

      <div className="metric-grid policy-metrics"><Metric label="Clauses indexed" value={String(fixture.clausesDetected)} detail={`${fixture.pageCount} source pages`} tone="info" /><Metric label="Automatic controls" value={String(fixture.automaticControls)} detail="Draft runtime decisions" tone="success" /><Metric label="Human-review controls" value={String(fixture.humanReviewControls)} detail="Accountable authorization" tone="warning" /><Metric label="Policy ambiguities" value={String(fixture.ambiguities)} detail={fixture.ambiguities ? 'Requires confirmation' : 'No unresolved ambiguity'} tone={fixture.ambiguities ? 'danger' : 'success'} /></div>

      <Panel title="Production mapping model" description="The same four-part contract would be persisted by the Policy Compiler and evaluated by the PDP.">
        <div className="policy-mapping-legend"><span><FileText size={15} /> Source clause</span><ArrowRight size={15} /><span><GitCompareArrows size={15} /> Policy IR rule</span><ArrowRight size={15} /><span><Network size={15} /> Agent Manifest capability</span><ArrowRight size={15} /><span><Sparkles size={15} /> Runtime control</span></div>
      </Panel>

      {fixture.id === 'recruitment-v1.5' && <Panel title="Material version delta" description="Clause 7.4 is the only material decision-treatment change in this proposal." action={<Badge tone="violet">PR-005 replay required</Badge>}><div className="policy-version-delta"><div><span>Active v1.4</span><p>Employment gaps may be considered when evaluating suitability, subject to human review.</p></div><ArrowRight size={20} /><div><span>Proposed v1.5</span><p>Documented caregiving, medical, and professional-development leave must not be treated negatively or reduce ranking.</p></div></div></Panel>}

      <div className="policy-clause-stack">{fixture.clauses.map((clause) => <Panel key={clause.id} className="policy-clause-card" title={`Clause ${clause.id} · ${clause.title}`} action={<Badge tone={clause.tone}>{clause.outcome}</Badge>}><div className="policy-clause-grid"><section className="policy-analysis-original"><span className="section-label">Source policy text</span><blockquote>“{clause.text}”</blockquote><p className="policy-evidence"><FileText size={14} /> {fixture.fileName} · Clause {clause.id}</p></section><section className="policy-analysis-context"><span className="section-label">Normalized Policy IR</span><p className="policy-normalized-rule">{clause.normalizedRule}</p><div className="policy-analysis-control"><span className="section-label">Agent Manifest mapping</span><strong>{clause.agentCapability}</strong></div></section><section className="policy-analysis-actions"><span className="section-label">Compiled runtime actions</span><ul className="policy-runtime-actions">{clause.runtimeActions.map((action) => <li key={action}><CheckCircle2 size={14} />{action}</li>)}</ul><div className="policy-confidence"><span>Extraction confidence</span><i className="policy-analysis-confidence-meter" aria-hidden="true"><span style={{ width: clause.confidence }} /></i><strong>{clause.confidence}</strong></div></section></div></Panel>)}</div>

      {fixture.ambiguities > 0 && <Panel title="Policy ambiguity" description="The Policy Compiler cannot infer an accountable reviewer role without authorized confirmation." action={<Badge tone="warning" dot>Resolve during agent approval</Badge>}><div className="policy-ambiguity"><div><span className="section-label">Source relationship</span><blockquote>“A negative candidate recommendation requires approval from an HR manager or assigned recruitment lead.”</blockquote><span className="section-label">Required confirmation</span><h3>Which registered roles satisfy “assigned recruitment lead” for AGT-024?</h3></div><div className="policy-ambiguity-options">{['Any HR employee · rejected', 'HR manager · eligible', 'Assigned recruitment lead · eligible', 'Department director · eligible by delegation'].map((option) => <div key={option}><span />{option}</div>)}</div></div></Panel>}

      <div className="policy-details-actions"><Button variant="secondary" onClick={() => navigate('policies')} icon={<ArrowLeft size={16} />}>Back to policy intake</Button><Button onClick={() => navigate(fixture.status === 'Active' ? 'agents' : 'time-machine')} icon={<Sparkles size={16} />}>{fixture.status === 'Active' ? 'Map controls to agent' : 'Compare policy versions'}</Button></div>
    </div>
  )
}
