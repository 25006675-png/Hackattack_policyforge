import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Check, CheckCircle2, FileText, ShieldCheck, Sparkles, UploadCloud, X } from 'lucide-react'
import type { Screen } from '../types'
import { Badge, Button, PageHeader, Panel, ProgressBar } from '../components/ui'

interface PolicyFile {
  name: string
  size: number
  type: string
}

const analysisStages = ['Uploading document', 'Extracting policy clauses', 'Mapping policy requirements', 'Generating controls']

function isPdf(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function PolicyUpload({ navigate }: { navigate: (screen: Screen) => void }) {
  const [selectedFile, setSelectedFile] = useState<PolicyFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [analysisStage, setAnalysisStage] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerIds = useRef<number[]>([])

  const clearTimers = () => {
    timerIds.current.forEach((timerId) => window.clearTimeout(timerId))
    timerIds.current = []
  }

  useEffect(() => clearTimers, [])

  const selectFile = (file?: File) => {
    if (!file) return
    clearTimers()
    setIsAnalyzing(false)
    if (!isPdf(file)) {
      setSelectedFile(null)
      setError('Select a PDF document to continue.')
      return
    }
    setSelectedFile({ name: file.name, size: file.size, type: file.type || 'application/pdf' })
    setError('')
    setAnalysisStage(0)
    setAnalysisComplete(false)
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0])
    event.target.value = ''
  }

  const analyse = () => {
    if (!selectedFile || isAnalyzing) return
    clearTimers()
    setAnalysisComplete(false)
    setIsAnalyzing(true)
    setAnalysisStage(0)
    analysisStages.forEach((_, index) => {
      timerIds.current.push(window.setTimeout(() => setAnalysisStage(index + 1), 550 * (index + 1)))
    })
    timerIds.current.push(window.setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 550 * analysisStages.length + 350))
  }

  return (
    <div className="page-stack policy-upload-page">
      <PageHeader
        eyebrow="Policy intake"
        title="Add a policy document"
        description="Upload an approved policy to identify clauses and draft governance controls for review."
        actions={<Badge tone="violet" dot>Policy workspace</Badge>}
      />

      <div className="policy-upload-layout">
        <Panel title="Policy document" description="PDF documents only. PolicyForge stores document metadata in this prototype.">
          {!selectedFile ? (
            <div
              className={`policy-dropzone ${isDragging ? 'dragging' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); inputRef.current?.click() } }}
              onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => { event.preventDefault(); setIsDragging(false) }}
              onDrop={(event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setIsDragging(false); selectFile(event.dataTransfer.files[0]) }}
            >
              <span className="policy-upload-icon"><UploadCloud size={23} /></span>
              <strong>Drag and drop a policy PDF</strong>
              <p>or browse files from your computer</p>
              <Button type="button" variant="secondary" onClick={(event) => { event.stopPropagation(); inputRef.current?.click() }} icon={<FileText size={15} />}>Choose PDF</Button>
              <input ref={inputRef} type="file" accept="application/pdf,.pdf" onChange={onInputChange} />
            </div>
          ) : (
            <>
              <div className="policy-file-card">
                <FileText size={23} />
                <div className="policy-file-copy"><strong>{selectedFile.name}</strong><small>{formatFileSize(selectedFile.size)} · {selectedFile.type}</small></div>
                <Button variant="ghost" aria-label="Remove selected policy" title="Remove selected policy" onClick={() => { clearTimers(); setSelectedFile(null); setIsAnalyzing(false); setAnalysisComplete(false); setAnalysisStage(0) }} icon={<X size={16} />} />
              </div>
              <div className="policy-analysis-action">
                <small>Only the file name, size, and type are retained in this frontend demo.</small>
                <Button loading={isAnalyzing} disabled={isAnalyzing} onClick={analyse} icon={<Sparkles size={16} />}>Analyse Policy</Button>
              </div>
            </>
          )}
          {error && <p className="policy-upload-error" role="alert">{error}</p>}
        </Panel>

        <Panel title="Analysis status" description="A simulated policy-analysis workflow." className="policy-analysis-panel">
          {!selectedFile ? <div className="policy-analysis-empty"><ShieldCheck size={27} /><h2>Awaiting a policy document</h2><p>Select a PDF to begin identifying policy requirements and proposed controls.</p></div>
            : analysisComplete ? <div className="policy-analysis-results"><CheckCircle2 size={25} /><h2>Policy analysis complete</h2><p>Draft findings are ready for governance review.</p><div className="policy-result-grid"><div><strong>12</strong><span>clauses detected</span></div><div><strong>8</strong><span>automatic controls</span></div><div className="review"><strong>3</strong><span>human-review controls</span></div><div className="ambiguity"><strong>1</strong><span>policy ambiguity</span></div></div></div>
            : <div className="policy-stage-list">{analysisStages.map((stage, index) => { const done = analysisStage > index; const active = isAnalyzing && analysisStage === index; return <div key={stage} className={done ? 'done' : active ? 'active' : ''}><span>{done ? <Check size={13} /> : index + 1}</span><strong>{stage}</strong>{active && <Badge tone="info">In progress</Badge>}{active && <ProgressBar value={62} tone="info" />}</div> })}</div>}
        </Panel>
      </div>

      {analysisComplete && <div className="policy-complete-banner"><div><CheckCircle2 size={20} /><span><strong>Policy ready to apply</strong><small>Continue to Agents to map the generated controls to the existing governance workflow.</small></span></div><Button onClick={() => navigate('agents')} icon={<Sparkles size={16} />}>Continue to Agents</Button></div>}
    </div>
  )
}
