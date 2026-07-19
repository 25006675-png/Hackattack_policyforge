import type { ReactNode } from 'react'
import {
  Boxes, ChevronDown, Command, Gauge, HelpCircle, History, ListRestart,
  RotateCcw, Route, Search, ShieldCheck, Sparkles,
} from 'lucide-react'
import type { Screen } from '../types'
import { Button } from './ui'

const nav: Array<{ id: Screen; label: string; fullLabel: string; icon: typeof Gauge }> = [
  { id: 'overview', label: 'Overview', fullLabel: 'Overview', icon: Gauge },
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
                className={screen === item.id ? 'active' : ''}
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
          <button aria-label="Help and resources"><HelpCircle size={19} strokeWidth={1.8} /><span className="rail-label">Help</span></button>
          <button className="user-rail-button" aria-label="Maya Chen"><span className="user-avatar">MC</span><span className="rail-label">Maya</span></button>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-leading">
            <div className="product-wordmark">Policy<span>Forge</span></div>
            <span className="topbar-divider" />
            <button className="workspace-switcher">
              <span className="workspace-avatar">N</span>
              <span>Northstar Group</span>
              <ChevronDown size={14} />
            </button>
            <button className="global-search"><Search size={16} /><span>Search agents, decisions, policies…</span><kbd><Command size={11} /> K</kbd></button>
          </div>
          <div className="topbar-meta">
            <span className="environment"><span /> Production</span>
            <button className="policy-switch"><Sparkles size={15} /> Recruitment Policy v1.4 <ChevronDown size={14} /></button>
            <Button variant="ghost" icon={<RotateCcw size={15} />} onClick={onReset}>Reset demo</Button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
