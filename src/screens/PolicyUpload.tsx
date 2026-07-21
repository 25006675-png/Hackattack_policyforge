import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Check, CheckCircle2, FileCheck2, FileSearch, FileText, Fingerprint, ShieldCheck, Sparkles, UploadCloud, X } from 'lucide-react'
import { policyAnalysisStages } from '../policyFixtures'
import { formatDigest, getPolicyFixture, identifyPolicyFile } from '../services/policyDemo'
import type { PolicyFile, Screen } from '../types'
import { Badge, Button, PageHeader, Panel, ProgressBar } from '../components/ui'

function isPdf(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function PolicyUpload({ policyFile, policyAnalysisComplete, onPolicyFileChange, onAnalysisComplete, navigate }: { policyFile: PolicyFile | null; policyAnalysisComplete: boolean; onPolicyFileChange: (file: PolicyFile | null) => void; onAnalysisComplete: (complete: boolean) => void; navigate: (screen: Screen) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [analysisStage, setAnalysisStage] = useState(-1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [identifying, setIdentifying] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const proposedInputRef = useRef<HTMLInputElement>(null)
  const timerIds = useRef<number[]>([])
  const fixture = getPolicyFixture(policyFile)

  const clearTimers = () => {
    timerIds.current.forEach((timerId) => window.clearTimeout(timerId))
    timerIds.current = []
  }

  useEffect(() => clearTimers, [])

  const acceptIdentifiedFile = (identified: PolicyFile) => {
    clearTimers()
    setIsAnalyzing(false)
    setAnalysisStage(-1)
    onPolicyFileChange(identified)
    onAnalysisComplete(false)
    setError('')
  }

  const selectFile = async (file?: File) => {
    if (!file) return
    if (!isPdf(file)) {
      setError('Choose a PDF document. The current verified policy has been preserved.')
      return
    }
    setIdentifying(true)
    try {
      acceptIdentifiedFile(await identifyPolicyFile(file))
    } catch {
      setError('The document fingerprint could not be calculated. Choose the file again.')
    } finally {
      setIdentifying(false)
    }
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    void selectFile(event.target.files?.[0])
    event.target.value = ''
  }

  const onProposedInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    void selectFile(event.target.files?.[0])
    event.target.value = ''
  }

  const analyse = () => {
    if (!fixture || isAnalyzing) return
    clearTimers()
    onAnalysisComplete(false)
    setIsAnalyzing(true)
    setAnalysisStage(0)
    let elapsed = 0
    policyAnalysisStages.forEach((stage, index) => {
      elapsed += stage.duration
      timerIds.current.push(window.setTimeout(() => setAnalysisStage(index + 1), elapsed))
    })
    timerIds.current.push(window.setTimeout(() => {
      setIsAnalyzing(false)
      onAnalysisComplete(true)
      timerIds.current = []
    }, elapsed + 180))
  }

  const removePolicy = () => {
    clearTimers()
    setIsAnalyzing(false)
    setAnalysisStage(-1)
    onPolicyFileChange(null)
    onAnalysisComplete(false)
    setError('')
  }

  const progress = isAnalyzing ? Math.round((Math.min(analysisStage + 0.45, policyAnalysisStages.length) / policyAnalysisStages.length) * 100) : policyAnalysisComplete ? 100 : 0
  const stageDetail = (index: number) => fixture?.id === 'recruitment-v1.5' && index === 6 ? 'Clause 7.4 amendment is explicit; no unresolved ambiguity or blocking conflict found.' : policyAnalysisStages[index].detail

  return (
    <div className="page-stack policy-upload-page">
      <PageHeader eyebrow="Policy intake · Document Ingestion Service" title="Analyse a controlled recruitment policy" description="Verify policy integrity, build a cited Policy IR, and map requirements to the Candidate Screening Agent Manifest." actions={<Badge tone="violet" dot>Document control</Badge>} />

      <div className="policy-upload-layout">
        <Panel title="Policy document" description="PDF only. Registered policy files are verified by SHA-256 before analysis.">
          {!policyFile ? <>
            <button className={`policy-dropzone ${isDragging ? 'dragging' : ''}`} type="button" onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { event.preventDefault(); setIsDragging(false) }} onDrop={(event: DragEvent<HTMLButtonElement>) => { event.preventDefault(); setIsDragging(false); void selectFile(event.dataTransfer.files[0]) }}>
              <span className="policy-upload-icon"><UploadCloud size={23} /></span><strong className="policy-upload-drop-title">Drop a controlled policy PDF</strong><span className="policy-upload-drop-copy">or choose a file from this computer</span><span className="button button-secondary"><FileText size={15} /> Choose PDF</span>
            </button>
            <input ref={inputRef} className="policy-file-input" type="file" accept="application/pdf,.pdf" onChange={onInputChange} />
          </> : <>
            <div className="policy-file-card"><span className="policy-upload-file-icon"><FileText size={23} /></span><div className="policy-file-copy"><strong>{policyFile.name}</strong><small>{formatFileSize(policyFile.size)} · {policyFile.type}</small><span className="policy-digest"><Fingerprint size={12} /> SHA-256 {formatDigest(policyFile.sha256)}</span></div><Button variant="ghost" aria-label="Remove selected policy" title="Remove selected policy" onClick={removePolicy} icon={<X size={16} />} /></div>
            {fixture ? <div className="policy-identity-card"><FileCheck2 size={18} /><div><strong>Controlled document verified</strong><span>{fixture.documentId} · Version {fixture.version} · {fixture.status}</span></div><Badge tone="success">Hash matched</Badge></div> : <div className="policy-unsupported" role="status"><FileSearch size={19} /><div><strong>Document fingerprint is not registered</strong><p>The file is valid, but semantic extraction is unavailable for unregistered policy records in this environment.</p></div></div>}
            <div className="policy-analysis-action"><small>{fixture ? `Ready to compile ${fixture.documentId} v${fixture.version} into Policy IR.` : 'Select a registered policy before analysis.'}</small><Button loading={isAnalyzing || identifying} disabled={!fixture || isAnalyzing || identifying} onClick={analyse} icon={<Sparkles size={16} />}>{policyAnalysisComplete ? 'Run analysis again' : 'Analyse policy'}</Button></div>
          </>}
          {identifying && <div className="policy-identifying" role="status"><Fingerprint size={15} /> Calculating document fingerprint…</div>}
          {error && <p className="policy-upload-error" role="alert">{error}</p>}
        </Panel>

        <Panel title="Analysis pipeline" description="Evidence-producing stages model the production ingestion, extraction, compilation, and validation path." className="policy-analysis-panel">
          {!fixture ? <div className="policy-analysis-empty"><ShieldCheck size={27} /><h2>Awaiting a registered policy</h2><p>Upload a controlled recruitment policy PDF to compile its Policy IR.</p></div> : policyAnalysisComplete ? <div className="policy-analysis-results"><CheckCircle2 size={25} /><h2>Policy IR compiled and validated</h2><p>{fixture.documentId} v{fixture.version} is ready for {fixture.status === 'Active' ? 'agent-control mapping' : 'version comparison'}.</p><div className="policy-result-grid"><div><strong>{fixture.clausesDetected}</strong><span>clauses indexed</span></div><div><strong>{fixture.automaticControls}</strong><span>automatic controls</span></div><div className="review"><strong>{fixture.humanReviewControls}</strong><span>human-review controls</span></div><div className="ambiguity"><strong>{fixture.ambiguities}</strong><span>policy ambiguities</span></div></div></div> : <div className="policy-stage-list" aria-live="polite">{policyAnalysisStages.map((stage, index) => { const done = analysisStage > index; const active = isAnalyzing && analysisStage === index; return <div key={stage.label} className={done ? 'done' : active ? 'active' : ''}><span>{done ? <Check size={13} /> : index + 1}</span><div><strong>{stage.label}</strong><small>{stageDetail(index)}</small></div>{active && <Badge tone="info">Processing</Badge>}</div> })}{isAnalyzing && <div className="policy-analysis-progress"><ProgressBar value={progress} tone="info" /><span>{progress}%</span></div>}</div>}
        </Panel>
      </div>

      {policyAnalysisComplete && fixture && <div className="policy-complete-banner"><div><CheckCircle2 size={20} /><span><strong>{fixture.status === 'Active' ? 'Active policy ready for agent mapping' : 'Proposed policy ready for comparison'}</strong><small>{fixture.status === 'Active' ? 'Upload a proposed update when a new policy version is ready for comparison.' : 'Every generated rule retains its source clause, version, normalized condition, and runtime outcome.'}</small></span></div><div className="policy-complete-actions"><Button variant="secondary" onClick={() => navigate('policy-analysis')} icon={<FileText size={16} />}>Review cited analysis</Button>{fixture.status === 'Active' && <><Button variant="secondary" disabled={identifying || isAnalyzing} onClick={() => proposedInputRef.current?.click()} icon={<UploadCloud size={16} />}>Upload proposed update</Button><input ref={proposedInputRef} className="policy-file-input" type="file" accept="application/pdf,.pdf" onChange={onProposedInputChange} /></>}<Button onClick={() => navigate(fixture.status === 'Active' ? 'agents' : 'time-machine')} icon={<Sparkles size={16} />}>{fixture.status === 'Active' ? 'Map controls to agent' : 'Compare with v1.4'}</Button></div></div>}
    </div>
  )
}
