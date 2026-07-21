import { useRef, useState, type ReactNode } from 'react'
import {
  Boxes, FileText, Gauge, HelpCircle, History, ListRestart,
  Route, Search, ShieldCheck, Sparkles, X,
} from 'lucide-react'
import type { Screen } from '../types'
import { Button } from './ui'

const nav: Array<{ id: Screen; label: string; fullLabel: string; icon: typeof Gauge }> = [
  { id: 'overview', label: 'Overview', fullLabel: 'Overview', icon: Gauge },
  { id: 'policies', label: 'Policies', fullLabel: 'Policies', icon: FileText },
  { id: 'agents', label: 'Agents', fullLabel: 'Agents', icon: Boxes },
  { id: 'action', label: 'Runtime', fullLabel: 'Governed action', icon: ShieldCheck },
  { id: 'decisions', label: 'Decisions', fullLabel: 'Decisions', icon: Route },
  { id: 'time-machine', label: 'Replay', fullLabel: 'Policy Time Machine', icon: History },
  { id: 'recalls', label: 'Recalls', fullLabel: 'Recalls', icon: ListRestart },
]

function PolicyForgeMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M9 24.5v-17h8a5 5 0 0 1 0 10H9" />
      <path d="m16.2 22 2.2 2.2 4.9-5.4" />
    </svg>
  )
}

export function AppShell({ screen, onNavigate, onReset, children }: { screen: Screen; onNavigate: (screen: Screen) => void; onReset: () => void; children: ReactNode }) {
  const helpDialog = useRef<HTMLDialogElement>(null)
  const helpButton = useRef<HTMLButtonElement>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)

  const openHelp = () => {
    setConfirmingReset(false)
    helpDialog.current?.showModal()
  }
  const closeHelp = () => {
    helpDialog.current?.close()
    helpButton.current?.focus()
  }
  const resetDemo = () => {
    onReset()
    setConfirmingReset(false)
    helpDialog.current?.close()
    helpButton.current?.focus()
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" data-tooltip="PolicyForge">
          <div className="brand-mark"><PolicyForgeMark /></div>
        </div>

        <nav className="main-nav" aria-label="Primary navigation">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={screen === item.id || (item.id === 'policies' && screen === 'policy-analysis') ? 'active' : ''}
                aria-label={item.fullLabel}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span className="rail-label">{item.label}</span>
                {item.id === 'agents' && <em>2</em>}
                {item.id === 'recalls' && <em className="danger-count">1</em>}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-foot">
          <button ref={helpButton} aria-label="Help and reset controls" onClick={openHelp}><HelpCircle size={19} strokeWidth={1.8} /><span className="rail-label">Help</span></button>
          <div className="user-rail-button" aria-label="Signed in as Maya Chen"><span className="user-avatar">MC</span><span className="rail-label">Maya</span></div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-leading">
            <div className="product-wordmark">Policy<span>Forge</span></div>
            <span className="topbar-divider" />
            <div className="workspace-switcher workspace-static">
              <span className="workspace-avatar">N</span>
              <span>Northstar Group</span>
            </div>
            <div className="global-search global-search-static"><Search size={16} /><span>Northstar ATS → Agent → PolicyForge</span></div>
          </div>
          <div className="topbar-meta">
            <span className="environment"><span /> Production</span>
            <div className="policy-switch policy-static"><Sparkles size={15} /> Recruitment Policy v1.4</div>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>

      <dialog
        ref={helpDialog}
        className="help-dialog"
        aria-labelledby="help-dialog-title"
        onClose={() => setConfirmingReset(false)}
        onClick={(event) => { if (event.target === event.currentTarget) closeHelp() }}
      >
        <div className="help-dialog-shell">
          <header><div><span>PolicyForge support</span><h2 id="help-dialog-title">Demo guide and architecture</h2></div><button type="button" aria-label="Close help" onClick={closeHelp}><X size={18} /></button></header>
          <div className="help-dialog-content">
            <section><h3>Recommended workflow</h3><ol><li>Analyse Recruitment Policy v1.4.</li><li>Map controls to Candidate Screening Agent.</li><li>Govern candidate action ACT-8842.</li><li>Inspect Decision Capsule PF-2841.</li><li>Replay Policy v1.5 and create Recall RC-017.</li></ol></section>
            <section><h3>Technical architecture</h3><p>The Document Ingestion Service produces a versioned Policy IR. The Policy Compiler combines it with the Agent Manifest. At runtime, the PEP intercepts an action and the PDP returns ALLOW, TRANSFORM, HUMAN REVIEW, or BLOCK with cited evidence.</p></section>
            <section><h3>Execution boundary</h3><p>This environment recognizes registered policy documents by SHA-256 fingerprint. Production deployments connect document extraction, runtime telemetry, append-only evidence storage, deterministic replay, and idempotent recall services.</p></section>
          </div>
          <footer className="help-demo-controls">
            <div><strong>Demo controls</strong><span>Reset clears policy analysis and every completed workflow state.</span></div>
            {confirmingReset ? <div className="help-reset-confirm" role="alert"><span>Reset the complete demonstration?</span><Button variant="secondary" onClick={() => setConfirmingReset(false)}>Keep current state</Button><Button variant="danger" onClick={resetDemo}>Reset demo</Button></div> : <Button variant="secondary" onClick={() => setConfirmingReset(true)}>Reset demo</Button>}
          </footer>
        </div>
      </dialog>
    </div>
  )
}
