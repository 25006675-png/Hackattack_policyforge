import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import type { Tone } from '../types'

export function Badge({ children, tone = 'neutral', dot = false }: { children: ReactNode; tone?: Tone; dot?: boolean }) {
  return <span className={`badge badge-${tone}`}>{dot && <span className="badge-dot" />}{children}</span>
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  icon?: ReactNode
}

export function Button({ variant = 'primary', loading, icon, children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {loading ? <LoaderCircle size={16} className="spin" /> : icon}
      <span>{children}</span>
    </button>
  )
}

export function Metric({ label, value, detail, tone = 'neutral' }: { label: string; value: string; detail?: string; tone?: Tone }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className={`metric-value metric-${tone}`}>{value}</div>
      {detail && <div className="metric-detail">{detail}</div>}
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  )
}

export function Panel({ title, description, action, children, className = '' }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <header className="panel-header">
          <div>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function ProgressBar({ value, tone = 'info' }: { value: number; tone?: Tone }) {
  return <div className="progress"><span className={`progress-${tone}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>
}
