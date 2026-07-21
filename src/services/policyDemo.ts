import { policyFixtures } from '../policyFixtures'
import type { PolicyFile, PolicyFixture, PolicyFixtureId } from '../types'

export async function sha256Hex(buffer: ArrayBuffer) {
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()
}

export async function identifyPolicyFile(file: File): Promise<PolicyFile> {
  const sha256 = await sha256Hex(await file.arrayBuffer())
  const fixture = Object.values(policyFixtures).find((candidate) => candidate.sha256 === sha256)
  return {
    name: file.name,
    size: file.size,
    type: file.type || 'application/pdf',
    sha256,
    fixtureId: fixture?.id ?? null,
    identification: fixture ? 'verified' : 'unsupported',
  }
}

export async function loadPreparedPolicy(id: PolicyFixtureId) {
  const fixture = policyFixtures[id]
  const response = await fetch(fixture.assetPath)
  if (!response.ok) throw new Error(`Could not load ${fixture.fileName}.`)
  const blob = await response.blob()
  const file = new File([blob], fixture.fileName, { type: 'application/pdf' })
  return identifyPolicyFile(file)
}

export function getPolicyFixture(policyFile: PolicyFile | null): PolicyFixture | null {
  return policyFile?.fixtureId ? policyFixtures[policyFile.fixtureId] : null
}

export function downloadJsonArtifact(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = name
  link.click()
  URL.revokeObjectURL(href)
}

export function formatDigest(digest: string) {
  return `${digest.slice(0, 12)}…${digest.slice(-8)}`
}
