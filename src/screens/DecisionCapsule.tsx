import { useState } from 'react'
import {
  ArrowRight, Bot, CheckCircle2, ChevronRight, CircleAlert, Download,
  ExternalLink, FileCheck2, FileText, Fingerprint, GitBranch, History,
  LockKeyhole, Scale, ShieldCheck, UserCheck,
} from 'lucide-react'
import { evidenceNodes } from '../data'
import type { DemoState, Screen } from '../types'
import { Badge, Button, PageHeader, Panel } from '../components/ui'

const nodeIcons = [FileText, Fingerprint, Bot, GitBranch, ShieldCheck, UserCheck, FileCheck2]

export function DecisionCapsule({ state, navigate }: { state: DemoState; navigate: (screen: Screen) => void }) {
  const [selected, setSelected] = useState('model')
  const [reviewRequested, setReviewRequested] = useState(false)
  const node = evidenceNodes.find((item) => item.id === selected) ?? evidenceNodes[0]

  if (!state.decisionComplete) {
    return <div className="page-stack"><PageHeader eyebrow="Decision evidence" title="Decision Capsules" description="Trace consequential AI-assisted outcomes from recorded facts to external consequence." /><Panel><div className="locked-empty"><LockKeyhole size={27} /><h2>No completed decision in this demo</h2><p>Process the prepared candidate application and complete human review to create Decision Capsule PF-2841.</p><Button onClick={() => navigate('action')}>Open governed action</Button></div></Panel></div>
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Decision Capsule · PF-2841"
        title="Candidate application outcome"
        description="A structured reconstruction of evidence, policy, and responsibility."
        actions={<><Button variant="secondary" icon={<Download size={15} />}>Export evidence</Button><Button variant="secondary" icon={<ExternalLink size={15} />}>Open source record</Button></>}
      />

      <div className="capsule-meta">
        <div><span>Outcome</span><Badge tone="danger">Did not proceed</Badge></div>
        <div><span>Agent</span><strong>Candidate Screening Agent v2.1</strong></div>
        <div><span>Model</span><strong>TalentModel v4.2</strong></div>
        <div><span>Policy at decision time</span><strong>Recruitment Policy v1.4</strong></div>
        <div><span>Human reviewer</span><strong>Maya Chen</strong></div>
        <div><span>Integrity</span><Badge tone="success"><CheckCircle2 size={12} /> Verified</Badge></div>
      </div>

      <div className="capsule-layout">
        <Panel title="Evidence and responsibility chain" description="Select any event to inspect the evidence preserved at that step." className="chain-panel">
          <div className="evidence-chain">
            {evidenceNodes.map((item, index) => {
              const Icon = nodeIcons[index]
              return (
                <button key={item.id} className={`${selected === item.id ? 'selected' : ''} node-${item.tone}`} onClick={() => setSelected(item.id)}>
                  <span className="chain-icon"><Icon size={17} /></span>
                  <div><small>{item.label}</small><strong>{item.title}</strong></div>
                  <ChevronRight size={16} />
                  {index < evidenceNodes.length - 1 && <i />}
                </button>
              )
            })}
          </div>
        </Panel>

        <aside className="evidence-inspector">
          <header><div className={`inspector-icon tone-${node.tone}`}><GitBranch size={19} /></div><div><Badge tone={node.tone}>{node.label}</Badge><h2>{node.title}</h2></div></header>
          <p>{node.summary}</p>
          <div className="inspector-details">
            {node.details.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <div className="evidence-provenance"><LockKeyhole size={15} /><div><strong>Evidence provenance</strong><span>Captured at event time · Record unchanged</span></div><Badge tone="success">Verified</Badge></div>
          <button className="text-button">View raw recorded event <ArrowRight size={14} /></button>
        </aside>
      </div>

      <div className="decision-lower-grid">
        <Panel title="Responsibility boundary" description="PolicyForge separates each actor’s contribution to the final consequence.">
          <div className="responsibility-grid">
            <div><span className="actor-icon model"><Bot size={17} /></span><small>Model</small><strong>Classified an employment gap</strong><p>Produced a probabilistic output.</p></div>
            <div><span className="actor-icon agent"><GitBranch size={17} /></span><small>Agent</small><strong>Recommended not proceeding</strong><p>Could not issue a final outcome.</p></div>
            <div><span className="actor-icon policy"><Scale size={17} /></span><small>Policy</small><strong>Required human review</strong><p>Applied Recruitment Policy v1.4.</p></div>
            <div><span className="actor-icon human"><UserCheck size={17} /></span><small>Human</small><strong>Approved the recommendation</strong><p>Maya Chen owns the final decision.</p></div>
          </div>
        </Panel>

        <Panel title="Candidate explanation" description="Preview of the disclosure shown to the affected person." className="candidate-preview">
          {reviewRequested ? <div className="review-requested"><CheckCircle2 size={25} /><div><strong>Human review requested</strong><span>Request REV-2841 has been submitted.</span></div></div> : <>
            <div className="candidate-notice"><div><CircleAlert size={17} /><strong>AI assisted in reviewing this application</strong></div><p>An AI system helped the recruitment team review job-related information. An HR reviewer approved the final outcome.</p><div className="candidate-factors"><span>Important recorded factors</span><p>Relevant experience · Required certification · Employment history</p></div></div>
            <Button variant="secondary" onClick={() => setReviewRequested(true)}>Request human reassessment</Button>
          </>}
        </Panel>
      </div>

      <button className="next-story-step" onClick={() => navigate('time-machine')}><span className="next-step-icon"><History size={20} /></span><span><small>Continue the governance story</small><strong>See how Policy v1.5 changes this decision</strong></span><ArrowRight size={18} /></button>
    </div>
  )
}
