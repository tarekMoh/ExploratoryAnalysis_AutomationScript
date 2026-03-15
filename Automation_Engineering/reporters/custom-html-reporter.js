/**
 * custom-html-reporter.js
 * ─────────────────────────────────────────────────────────────────────────
 * A Playwright custom reporter that generates a self-contained HTML summary
 * with root cause analysis for every failing test.
 *
 * Output:  reports/custom-summary.html
 *
 * Root cause analysis strategy
 * ─────────────────────────────
 *  1. Parse the error message / stack trace.
 *  2. Map known Playwright error patterns to human-readable causes.
 *  3. Suggest a likely fix category (selector, timing, network, assertion).
 *
 * Usage: referenced in playwright.config.js → reporter array.
 */

const fs   = require('fs');
const path = require('path');

// ── RCA: map error patterns → human-readable diagnosis ────────────────────
const RCA_PATTERNS = [
  {
    pattern: /Timeout.*waiting for/i,
    cause:   'Element did not appear within the timeout.',
    fix:     'Check selector accuracy or increase actionTimeout. The element may be behind a lazy-load or cookie wall.',
  },
  {
    pattern: /strict mode violation|locator resolved to/i,
    cause:   'Locator matched multiple elements (strict mode violation).',
    fix:     'Narrow the selector with .first(), .nth(), or a more specific attribute.',
  },
  {
    pattern: /net::ERR|net::err/,
    cause:   'Network error – the page or resource could not be loaded.',
    fix:     'Verify internet connectivity. The site may be down or rate-limiting test traffic.',
  },
  {
    pattern: /Expected.*to (contain|equal|have)/i,
    cause:   'Assertion failed – actual value did not match expected.',
    fix:     'Review the assertion value in testData.js. The site copy or structure may have changed.',
  },
  {
    pattern: /evaluate.*Error/i,
    cause:   'JavaScript evaluation error inside the browser context.',
    fix:     'Inspect the page.evaluate() call; a DOM element may be null or removed.',
  },
  {
    pattern: /navigation.*failed|waiting for.*navigation/i,
    cause:   'Page navigation did not complete in time.',
    fix:     'Increase navigationTimeout or verify that the click/action triggers navigation correctly.',
  },
];

function diagnose(errorMessage = '', stack = '') {
  const text = `${errorMessage}\n${stack}`;
  for (const entry of RCA_PATTERNS) {
    if (entry.pattern.test(text)) {
      return { cause: entry.cause, fix: entry.fix };
    }
  }
  return {
    cause: 'Unexpected error – no matching pattern found.',
    fix:   'Review the full stack trace in the Playwright HTML report.',
  };
}

// ── Status badge colours ──────────────────────────────────────────────────
const STATUS_COLOR = {
  passed:  '#22c55e',
  failed:  '#ef4444',
  skipped: '#f59e0b',
  timedOut:'#ef4444',
};

// ── Escape HTML special characters ────────────────────────────────────────
function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Reporter class ────────────────────────────────────────────────────────
class CustomHtmlReporter {
  constructor() {
    this._results = [];   // { title, status, duration, error, rca, screenshot }
    this._startTime = Date.now();
  }

  onBegin(config, suite) {
    console.log(`\n[CustomHtmlReporter] Starting run – ${suite.allTests().length} tests collected.\n`);
  }

  onTestEnd(test, result) {
    const title     = test.titlePath().join(' › ');
    const status    = result.status;          // 'passed' | 'failed' | 'skipped' | 'timedOut'
    const duration  = result.duration;
    const error     = result.error || null;

    let rca = null;
    if (status === 'failed' || status === 'timedOut') {
      rca = diagnose(error?.message, error?.stack);
    }

    // Pick up the first screenshot attachment (if any)
    const screenshotAttachment = result.attachments.find(
      a => a.name === 'screenshot' && a.contentType === 'image/png'
    );
    const screenshot = screenshotAttachment ? screenshotAttachment.path : null;

    this._results.push({ title, status, duration, error, rca, screenshot });
  }

  onEnd(result) {
    const outputDir = path.join(process.cwd(), 'reports');
    fs.mkdirSync(outputDir, { recursive: true });

    const htmlPath = path.join(outputDir, 'custom-summary.html');
    fs.writeFileSync(htmlPath, this._buildHtml(result), 'utf-8');
    console.log(`\n[CustomHtmlReporter] Report written → ${htmlPath}\n`);
  }

  // ── HTML generation ───────────────────────────────────────────────────
  _buildHtml(runResult) {
    const total   = this._results.length;
    const passed  = this._results.filter(r => r.status === 'passed').length;
    const failed  = this._results.filter(r => r.status === 'failed' || r.status === 'timedOut').length;
    const skipped = this._results.filter(r => r.status === 'skipped').length;
    const elapsed = ((Date.now() - this._startTime) / 1000).toFixed(1);

    const rows = this._results.map(r => this._buildRow(r)).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Skoda-Parts Test Report</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
           background: #0f172a; color: #e2e8f0; padding: 24px; }
    h1   { font-size: 1.6rem; color: #f1f5f9; margin-bottom: 4px; }
    .meta { font-size: 0.85rem; color: #94a3b8; margin-bottom: 24px; }
    .summary { display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
    .stat { background: #1e293b; border-radius: 10px; padding: 16px 24px; min-width: 120px; text-align: center; }
    .stat .num  { font-size: 2rem; font-weight: 700; }
    .stat .lbl  { font-size: 0.8rem; color: #94a3b8; margin-top: 2px; }
    .passed  { color: #22c55e; }
    .failed  { color: #ef4444; }
    .skipped { color: #f59e0b; }
    table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    th { background: #1e293b; padding: 10px 14px; text-align: left; color: #94a3b8;
         font-weight: 600; border-bottom: 1px solid #334155; }
    td { padding: 10px 14px; border-bottom: 1px solid #1e293b; vertical-align: top; }
    tr:hover td { background: #1e293b44; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 99px;
             font-size: 0.75rem; font-weight: 600; color: #fff; }
    .rca-block { background: #1e293b; border-left: 4px solid #ef4444;
                 border-radius: 6px; padding: 10px 14px; margin-top: 8px; font-size: 0.82rem; }
    .rca-block .cause { color: #fca5a5; font-weight: 600; margin-bottom: 4px; }
    .rca-block .fix   { color: #94a3b8; }
    .err-pre { background: #0f172a; padding: 8px; border-radius: 4px; font-size: 0.75rem;
               white-space: pre-wrap; word-break: break-all; color: #fca5a5;
               max-height: 150px; overflow-y: auto; margin-top: 6px; }
    .ss-thumb { margin-top: 8px; }
    .ss-thumb img { max-width: 320px; border-radius: 6px; border: 1px solid #334155; }
    footer { margin-top: 32px; font-size: 0.78rem; color: #475569; text-align: center; }
  </style>
</head>
<body>
  <h1>🚗 Skoda-Parts.com – Playwright Test Report</h1>
  <p class="meta">Generated: ${new Date().toLocaleString()} &nbsp;|&nbsp; Duration: ${elapsed}s &nbsp;|&nbsp; Overall: <strong style="color:${runResult.status === 'passed' ? '#22c55e' : '#ef4444'}">${runResult.status.toUpperCase()}</strong></p>

  <div class="summary">
    <div class="stat"><div class="num">${total}</div><div class="lbl">Total</div></div>
    <div class="stat"><div class="num passed">${passed}</div><div class="lbl">Passed</div></div>
    <div class="stat"><div class="num failed">${failed}</div><div class="lbl">Failed</div></div>
    <div class="stat"><div class="num skipped">${skipped}</div><div class="lbl">Skipped</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Test</th>
        <th>Status</th>
        <th>Duration</th>
        <th>Root Cause / Details</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <footer>Generated by custom-html-reporter.js &nbsp;·&nbsp; Playwright Automation Framework for skoda-parts.com</footer>
</body>
</html>`;
  }

  _buildRow(r, idx) {
    const color = STATUS_COLOR[r.status] || '#94a3b8';
    const ms    = r.duration ? `${(r.duration / 1000).toFixed(2)}s` : '—';

    let details = '';
    if (r.rca) {
      const errSnippet = r.error?.message ? esc(r.error.message.substring(0, 600)) : '';
      details += `
        <div class="rca-block">
          <div class="cause">Root Cause: ${esc(r.rca.cause)}</div>
          <div class="fix">Suggested Fix: ${esc(r.rca.fix)}</div>
          ${errSnippet ? `<pre class="err-pre">${errSnippet}</pre>` : ''}
        </div>`;
    }
    if (r.screenshot) {
      const relPath = path.relative(path.join(process.cwd(), 'reports'), r.screenshot).replace(/\\/g, '/');
      details += `
        <div class="ss-thumb">
          <img src="${esc(relPath)}" alt="failure screenshot" loading="lazy" />
        </div>`;
    }

    return `<tr>
      <td style="color:#475569;font-size:0.8rem">${(idx || 0) + 1}</td>
      <td>${esc(r.title)}</td>
      <td><span class="badge" style="background:${color}">${r.status}</span></td>
      <td style="white-space:nowrap">${ms}</td>
      <td>${details || '<span style="color:#475569">—</span>'}</td>
    </tr>`;
  }
}

module.exports = CustomHtmlReporter;
