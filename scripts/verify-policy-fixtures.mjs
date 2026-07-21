import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const fixtures = [
  {
    pdf: 'public/policy-docs/Northstar-Recruitment-Policy-v1.4.pdf',
    source: 'scripts/policy-docs/v1.4.html',
    sha256: '712534dbfdea6b1eed73aa83ef0d1d04681aaf50426bb5fee11718950eaa8184',
    version: '1.4',
    requiredTerms: ['Candidate Screening Agent', 'Agent Manifest', 'Decision Capsule', 'human review'],
  },
  {
    pdf: 'public/policy-docs/Northstar-Recruitment-Policy-v1.5-Proposed.pdf',
    source: 'scripts/policy-docs/v1.5.html',
    sha256: 'be2f380cde81d22f5a601b19d3177aa7080a67bc00cca128428aafbc5dd5722a',
    version: '1.5',
    requiredTerms: ['documented caregiving', 'Agent Manifest', 'Decision Capsule', 'human review', 'Policy Replay PR-005'],
  },
]

for (const fixture of fixtures) {
  const [pdf, source] = await Promise.all([
    readFile(fixture.pdf),
    readFile(fixture.source, 'utf8'),
  ])
  const actual = createHash('sha256').update(pdf).digest('hex')
  const pageCount = (source.match(/class="policy-page/g) ?? []).length
  const requiredTerms = [`Version ${fixture.version}`, ...fixture.requiredTerms]

  if (!pdf.subarray(0, 4).equals(Buffer.from('%PDF'))) throw new Error(`${fixture.pdf} is not a PDF`)
  if (pdf.length < 100_000) throw new Error(`${fixture.pdf} is unexpectedly small`)
  if (actual !== fixture.sha256) throw new Error(`${fixture.pdf} fingerprint mismatch: ${actual}`)
  if (pageCount !== 6) throw new Error(`${fixture.source} defines ${pageCount} pages instead of 6`)
  for (const term of requiredTerms) {
    if (!source.toLowerCase().includes(term.toLowerCase())) throw new Error(`${fixture.source} is missing: ${term}`)
  }

  console.log(`verified v${fixture.version}: ${pageCount} pages, ${pdf.length} bytes, sha256 ${actual}`)
}
