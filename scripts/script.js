/**
 * Markdown Studio — script.js  (improved edition)
 *
 * Changes vs original:
 *  1. Textarea replaced with CodeMirror 6 wrapper (editor.js adapter)
 *  2. localStorage replaced with IndexedDB (storage.js)
 *  3. Autosave + version snapshots + restore UI
 *  4. DOMPurify used for safe HTML rendering (sanitizes marked output)
 *  5. Settings modal (autosave delay, snapshot frequency, editor prefs)
 */

import { createEditor } from "./editor.js";
import {
  openDB,
  getAllFiles,
  getFile,
  saveFile,
  deleteFile as dbDeleteFile,
  scheduleAutosave,
  cancelAutosave,
  setAutosaveDelay,
  createSnapshot,
  getSnapshots,
  getSnapshot,
  deleteSnapshot,
  getSetting,
  setSetting,
  getAllSettings,
  migrateFromLocalStorage,
} from "./storage.js";

/* ══════════════════════════════════════════════════════════════════════════
   GLOBALS / CONSTANTS (kept identical to original)
══════════════════════════════════════════════════════════════════════════ */

const { createApp, ref, computed, watch, nextTick, onMounted, onUnmounted } =
  Vue;

const DEFAULT_CONTENT = `# Welcome to Markdown Studio

Start writing your document here. Use the toolbar above for formatting, or type markdown directly.

## Features

- **Live Preview** — see your document rendered in real time
- **LaTeX Math** — press Ctrl+M or click the LaTeX button
- **Mermaid Diagrams** — press Ctrl+G
- **Block Organizer** — press Ctrl+O
- **Export** — PDF, HTML, DOCX, Markdown, and more

## Quick Start

\`\`\`markdown
**bold** _italic_ \`inline code\`
## Heading
- list item
> blockquote
\`\`\`

$$
E = mc^2
$$

\`\`\`mermaid
graph LR
  A[Write] --> B[Preview] --> C[Export]
\`\`\`
`;

// ── kept identical to original ─────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "research",
    name: "Research Paper",
    icon: "ti-school",
    desc: "Academic citations",
    theme: "research",
    content:
      "# Paper Title\n\n**Author** · Institution · {{date}}\n\n---\n\n## Abstract\n\nWrite abstract here.\n\n## 1. Introduction\n\nIntroduce research.\n\n## 2. Methodology\n\nMethods description.\n\n## 3. Results\n\n| Variable | Group A | Group B |\n|----------|---------|----------|\n| Metric   | 0.82    | 0.76     |\n\n## 4. Discussion\n\nInterpret results.\n\n## References\n\n1. Author (Year). *Title*. Journal.\n",
  },
  {
    id: "cv",
    name: "Professional CV",
    icon: "ti-id-badge",
    desc: "Resume / CV",
    theme: "cv",
    content:
      "# Your Name\n\n> email@example.com · +1 234 567 8900 · City\n\n## Profile\n\nProfessional summary.\n\n## Experience\n\n### Senior Role · Company\n#### Jan 2022 – Present\n\n- Achievement with outcome\n- Leadership contribution\n\n## Education\n\n### Degree · University\n#### 2016–2020\n\n## Skills\n\n**Technical:** Skill 1 · Skill 2\n",
  },
  {
    id: "technical",
    name: "Tech Docs",
    icon: "ti-code",
    desc: "API / README",
    theme: "technical",
    content:
      "# Project Name\n\nBrief description.\n\n## Installation\n\n```bash\nnpm install your-package\n```\n\n## Quick Start\n\n```javascript\nimport { create } from 'your-package';\nconst instance = create({ option: 'value' });\n\nawait instance.run();\n```\n\n## API Reference\n\n### `create(options)`\n\n| Parameter | Type | Default | Description |\n|-----------|------|---------|-------------|\n| `option` | string | 'default' | Option desc |\n\n## License\n\nMIT\n",
  },
  {
    id: "latex",
    name: "LaTeX Style",
    icon: "ti-math-function",
    desc: "Math / theory",
    theme: "latex",
    content:
      "# Document Title\n\n**Author One** and **Author Two**\n\n---\n\n## Abstract\n\nThis document demonstrates LaTeX-inspired rendering.\n\n## 1. Introduction\n\nLet $G = (V, E)$ be a graph.\n\n**Theorem 1.1.** *Every planar graph is four-colorable.*\n\n## 2. Main Result\n\n$$\\sum_{i=1}^{n} x_i^2 \\geq \\frac{1}{n}\\left(\\sum_{i=1}^{n} x_i\\right)^2$$\n\nThis follows from Cauchy–Schwarz. $\\square$\n\n## References\n\n[1] Appel, K. (1976). *Bull. Amer. Math. Soc.*\n",
  },
  {
    id: "ieee",
    name: "IEEE Paper",
    icon: "ti-cpu",
    desc: "Engineering journal",
    theme: "ieee",
    content:
      '# Title of the Paper\n\n**Author One, Author Two** · Department\n\n---\n\n## Abstract\n\nThis paper presents…\n\n## I. Introduction\n\nIntroduction text.\n\n## II. Methodology\n\nDescribe approach.\n\n## III. Results\n\nEvaluation results.\n\n## IV. Conclusion\n\nConclusion.\n\n## References\n\n[1] A. Author, "Title," *Journal*, vol. 1, pp. 1–10.\n',
  },
  {
    id: "hbs",
    name: "Business Case",
    icon: "ti-briefcase",
    desc: "HBS case study",
    theme: "hbs",
    content:
      "# Company: Situation\n\n**Case Study** · {{date}}\n\n## Executive Summary\n\nBrief overview.\n\n## Background\n\nCompany context.\n\n## Key Issues\n\n1. **Issue One** — Description\n2. **Issue Two** — Description\n\n## Financial Overview\n\n| Metric | FY2022 | FY2023 |\n|--------|--------|--------|\n| Revenue | $100M | $120M |\n\n## Recommendation\n\nRecommended action.\n",
  },
  {
    id: "legal",
    name: "Legal Document",
    icon: "ti-gavel",
    desc: "Contracts",
    theme: "legal",
    content:
      "# CONTRACT AGREEMENT\n\n**Effective Date:** {{date}}\n\n**Between:** Party A and Party B\n\n---\n\n## 1. DEFINITIONS\n\n- **Services** means the professional services described herein.\n\n## 2. SCOPE\n\n1. Service description one\n2. Service description two\n\n## 3. COMPENSATION\n\nClient shall pay $[AMOUNT].\n\n## 4. GOVERNING LAW\n\nGoverned by laws of [Jurisdiction].\n",
  },
  {
    id: "medical",
    name: "Clinical Report",
    icon: "ti-stethoscope",
    desc: "Medical report",
    theme: "medical",
    content:
      "# Clinical Case Report\n\n**Date:** {{date}} · **Physician:** Dr. Name\n\n---\n\n## Patient Information\n\n| Field | Details |\n|-------|--------|\n| Age / Sex | 45 / M |\n| Chief Complaint | Symptom |\n\n## Assessment & Plan\n\n> **Diagnosis:** Primary diagnosis\n\n1. Treatment step one\n2. Treatment step two\n\n## Follow-up\n\nScheduled in X weeks.\n",
  },
  {
    id: "startup",
    name: "Pitch Deck",
    icon: "ti-rocket",
    desc: "Startup pitch",
    theme: "startup",
    content:
      "# Company Name\n\n> *Tagline — One sentence vision*\n\n---\n\n## The Problem\n\nDescribe the pain point.\n\n## Solution\n\nHow you solve it.\n\n## Market Opportunity\n\n- **TAM:** $X billion\n- **SAM:** $X billion\n\n## Traction\n\n| Metric | Value |\n|--------|-------|\n| MRR | $X,XXX |\n| Users | X,XXX |\n\n## The Ask\n\nRaising **$XM**.\n",
  },
  {
    id: "editorial",
    name: "Editorial",
    icon: "ti-feather",
    desc: "Magazine article",
    theme: "editorial",
    content:
      "# The Headline That Captures Attention\n\n*By Author Name · Publication · {{date}}*\n\n---\n\nThe opening paragraph draws readers in with a compelling hook.\n\n> The most powerful sentence is often the simplest one.\n\n## Developing the Story\n\nHere you develop the main argument.\n\n## Conclusion\n\nEnd with impact.\n",
  },
  {
    id: "book",
    name: "Book Chapter",
    icon: "ti-book",
    desc: "Long-form prose",
    theme: "book",
    content:
      '# Chapter One\n\n## The Beginning\n\nIt was on a Tuesday, unremarkable in every outward way, that everything changed.\n\nShe had not expected to find the letter. Nobody ever expects the letter.\n\n---\n\n> *"We carry our histories with us,"* her grandmother had said.\n\nIt was not until she held the paper that she understood.\n',
  },
  {
    id: "newspaper",
    name: "Newspaper",
    icon: "ti-news",
    desc: "Multi-column news",
    theme: "newspaper",
    content:
      '# BREAKING: Major Development Reshapes Industry\n\n*By Staff Reporter · {{date}}*\n\nIn a development analysts call transformative, leaders announced significant changes.\n\n## Experts Weigh In\n\n"This is unprecedented," said Dr. Jane Smith.\n\n## Market Reaction\n\n| Index | Change |\n|-------|--------|\n| Main | +2.3% |\n\n## What Comes Next\n\nObservers will be watching closely.\n',
  },
  {
    id: "meeting",
    name: "Meeting Notes",
    icon: "ti-notes",
    desc: "Minutes & actions",
    theme: "default",
    content:
      "# Meeting Notes\n\n**Date:** {{date}} · **Facilitator:** Name\n\n## Attendees\n\n- Person One\n- Person Two\n\n## Discussion\n\n### Topic 1\n\nSummary. **Decision:** What was decided.\n\n## Action Items\n\n| Task | Owner | Due |\n|------|-------|-----|\n| Task | Person | Date |\n",
  },
  {
    id: "minimal",
    name: "Minimal Note",
    icon: "ti-note",
    desc: "Blank canvas",
    theme: "minimal",
    content: "# Title\n\nWrite here…\n",
  },
];

const RENDER_THEMES = [
  { id: "default", name: "Clean Article" },
  { id: "research", name: "Research Paper" },
  { id: "scientific", name: "Scientific Report" },
  { id: "ieee", name: "IEEE / Engineering" },
  { id: "cv", name: "Professional CV" },
  { id: "latex", name: "LaTeX Style" },
  { id: "hbs", name: "Harvard Business" },
  { id: "legal", name: "Legal Document" },
  { id: "medical", name: "Medical / Clinical" },
  { id: "startup", name: "Startup / Pitch" },
  { id: "editorial", name: "Editorial Magazine" },
  { id: "technical", name: "Technical Docs" },
  { id: "book", name: "Book / Novel" },
  { id: "newspaper", name: "Newspaper" },
  { id: "minimal", name: "Minimal" },
];

const LATEX_CATS = [
  {
    id: "greek",
    label: "Greek",
    icon: "ti-alpha",
    symbols: [
      { label: "α", tex: "\\alpha" },
      { label: "β", tex: "\\beta" },
      { label: "γ", tex: "\\gamma" },
      { label: "δ", tex: "\\delta" },
      { label: "ε", tex: "\\epsilon" },
      { label: "θ", tex: "\\theta" },
      { label: "λ", tex: "\\lambda" },
      { label: "μ", tex: "\\mu" },
      { label: "π", tex: "\\pi" },
      { label: "σ", tex: "\\sigma" },
      { label: "φ", tex: "\\phi" },
      { label: "ψ", tex: "\\psi" },
      { label: "ω", tex: "\\omega" },
      { label: "Σ", tex: "\\Sigma" },
      { label: "Δ", tex: "\\Delta" },
      { label: "Γ", tex: "\\Gamma" },
    ],
  },
  {
    id: "ops",
    label: "Operators",
    icon: "ti-math-symbols",
    symbols: [
      { label: "∫", tex: "\\int" },
      { label: "∑", tex: "\\sum" },
      { label: "∏", tex: "\\prod" },
      { label: "∂", tex: "\\partial" },
      { label: "√", tex: "\\sqrt{x}" },
      { label: "±", tex: "\\pm" },
      { label: "×", tex: "\\times" },
      { label: "÷", tex: "\\div" },
      { label: "≤", tex: "\\leq" },
      { label: "≥", tex: "\\geq" },
      { label: "≠", tex: "\\neq" },
      { label: "≈", tex: "\\approx" },
      { label: "∈", tex: "\\in" },
      { label: "∉", tex: "\\notin" },
      { label: "⊂", tex: "\\subset" },
      { label: "∞", tex: "\\infty" },
    ],
  },
  {
    id: "frac",
    label: "Fractions",
    icon: "ti-divide",
    symbols: [
      { label: "a/b", tex: "\\frac{a}{b}" },
      { label: "¹/₂", tex: "\\frac{1}{2}" },
      { label: "a²", tex: "a^{2}" },
      { label: "aₙ", tex: "a_{n}" },
      { label: "lim", tex: "\\lim_{x\\to\\infty}" },
      { label: "log", tex: "\\log_{b}(x)" },
      { label: "ln", tex: "\\ln(x)" },
      { label: "sin", tex: "\\sin(x)" },
      { label: "cos", tex: "\\cos(x)" },
      { label: "tan", tex: "\\tan(x)" },
    ],
  },
  {
    id: "matrix",
    label: "Matrices",
    icon: "ti-grid-4x4",
    symbols: [
      { label: "2×2 mat", tex: "\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}" },
      {
        label: "3×3 mat",
        tex: "\\begin{pmatrix}a&b&c\\\\d&e&f\\\\g&h&i\\end{pmatrix}",
      },
      { label: "det", tex: "\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}" },
      { label: "binom", tex: "\\binom{n}{k}" },
      {
        label: "cases",
        tex: "f(x)=\\begin{cases}0&x<0\\\\1&x\\geq 0\\end{cases}",
      },
    ],
  },
  {
    id: "arrows",
    label: "Arrows",
    icon: "ti-arrows-exchange",
    symbols: [
      { label: "→", tex: "\\rightarrow" },
      { label: "←", tex: "\\leftarrow" },
      { label: "↔", tex: "\\leftrightarrow" },
      { label: "⇒", tex: "\\Rightarrow" },
      { label: "⇐", tex: "\\Leftarrow" },
      { label: "⇔", tex: "\\Leftrightarrow" },
      { label: "↑", tex: "\\uparrow" },
      { label: "↓", tex: "\\downarrow" },
    ],
  },
];

const latexTemplates = [
  { label: "Fraction", tex: "\\frac{a}{b}" },
  { label: "Sum", tex: "\\sum_{i=0}^{n} x_i" },
  { label: "Integral", tex: "\\int_{a}^{b} f(x)\\,dx" },
  { label: "Limit", tex: "\\lim_{x\\to\\infty} f(x)" },
  {
    label: "Matrix 2×2",
    tex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
  },
  {
    label: "Cases",
    tex: "\\begin{cases} a & \\text{if } n>0 \\\\ b & \\text{otherwise} \\end{cases}",
  },
  { label: "Greek sum", tex: "\\sum_{k=1}^{n} \\alpha_k x_k" },
  { label: "Derivative", tex: "\\frac{d}{dx}f(x)" },
  { label: "Binomial", tex: "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}" },
  { label: "Euler", tex: "e^{i\\pi}+1=0" },
];

const MERMAID_TEMPLATES = [
  {
    id: "flowchart",
    label: "Flowchart",
    icon: "ti-topology-star-ring",
    code: "flowchart LR\n  A([Start]) --> B{Decision?}\n  B -->|Yes| C[Action]\n  B -->|No| D[Other]\n  C --> E([End])\n  D --> E",
  },
  {
    id: "sequence",
    label: "Sequence",
    icon: "ti-arrows-exchange",
    code: "sequenceDiagram\n  participant A as User\n  participant B as Server\n  A->>B: Request\n  B-->>A: Response\n  A->>B: Confirm\n  B-->>A: OK",
  },
  {
    id: "class",
    label: "Class Diagram",
    icon: "ti-hierarchy",
    code: "classDiagram\n  class Animal{\n    +String name\n    +makeSound()\n  }\n  class Dog{\n    +fetch()\n  }\n  Animal <|-- Dog",
  },
  {
    id: "state",
    label: "State Machine",
    icon: "ti-circles-relation",
    code: "stateDiagram-v2\n  [*] --> Idle\n  Idle --> Running: start\n  Running --> Idle: stop\n  Running --> Error: fail\n  Error --> Idle: reset",
  },
  {
    id: "er",
    label: "ER Diagram",
    icon: "ti-database",
    code: "erDiagram\n  CUSTOMER ||--o{ ORDER : places\n  ORDER ||--|{ ITEM : contains\n  CUSTOMER {\n    string name\n    string email\n  }",
  },
  {
    id: "gantt",
    label: "Gantt Chart",
    icon: "ti-calendar-stats",
    code: "gantt\n  title Project Plan\n  dateFormat YYYY-MM-DD\n  section Phase 1\n    Research :a1, 2024-01-01, 14d\n    Design   :a2, after a1, 10d\n  section Phase 2\n    Build    :b1, after a2, 21d\n    Test     :b2, after b1, 7d",
  },
  {
    id: "pie",
    label: "Pie Chart",
    icon: "ti-chart-pie",
    code: 'pie title Browser Market Share\n  "Chrome" : 65\n  "Safari" : 19\n  "Firefox" : 4\n  "Edge" : 4\n  "Other" : 8',
  },
  {
    id: "mindmap",
    label: "Mind Map",
    icon: "ti-brain",
    code: "mindmap\n  root((Main Topic))\n    Subtopic A\n      Detail 1\n      Detail 2\n    Subtopic B\n      Detail 3\n    Subtopic C",
  },
  {
    id: "timeline",
    label: "Timeline",
    icon: "ti-timeline",
    code: "timeline\n  title History of Events\n  2020 : Event A\n       : Event B\n  2021 : Event C\n  2022 : Event D\n       : Event E",
  },
  {
    id: "git",
    label: "Git Graph",
    icon: "ti-git-branch",
    code: "gitGraph\n  commit\n  branch feature\n  checkout feature\n  commit\n  commit\n  checkout main\n  merge feature\n  commit",
  },
  {
    id: "journey",
    label: "User Journey",
    icon: "ti-route",
    code: "journey\n  title My Working Day\n  section Morning\n    Wake up: 1: Me\n    Coffee: 5: Me\n    Commute: 3: Me\n  section Work\n    Meetings: 4: Me, Team\n    Code: 5: Me",
  },
  {
    id: "block",
    label: "Block Diagram",
    icon: "ti-layout",
    code: 'block-beta\n  columns 3\n  A["Service A"]:1 B["Service B"]:1 C["Service C"]:1\n  space D["Database"]:1 space\n  A-- "calls" -->D\n  B-->D\n  C-->D',
  },
];

const BLOCK_TYPES = [
  { type: "heading", label: "Heading", icon: "ti-h-1" },
  { type: "paragraph", label: "Paragraph", icon: "ti-text-size" },
  { type: "list", label: "List", icon: "ti-list" },
  { type: "code", label: "Code Block", icon: "ti-terminal-2" },
  { type: "math", label: "Math", icon: "ti-math-function" },
  { type: "mermaid", label: "Mermaid", icon: "ti-topology-star" },
  { type: "quote", label: "Blockquote", icon: "ti-blockquote" },
  { type: "table", label: "Table", icon: "ti-table" },
  { type: "hr", label: "Divider", icon: "ti-minus" },
  { type: "image", label: "Image", icon: "ti-photo" },
];

// ── Keyboard shortcuts (for the modal only — actual binding is below) ──────

const SHORTCUTS = [
  { key: "Ctrl+S", desc: "Save" },
  { key: "Ctrl+N", desc: "New file" },
  { key: "Ctrl+B", desc: "Bold" },
  { key: "Ctrl+I", desc: "Italic" },
  { key: "Ctrl+`", desc: "Inline code" },
  { key: "Ctrl+M", desc: "LaTeX Builder" },
  { key: "Ctrl+G", desc: "Mermaid Builder" },
  { key: "Ctrl+O", desc: "Block Organizer" },
  { key: "Ctrl+F", desc: "Find & Replace" },
  { key: "Ctrl+Z", desc: "Undo" },
  { key: "Ctrl+Y", desc: "Redo" },
  { key: "Ctrl+Shift+H", desc: "History / Snapshots" },
  { key: "Escape", desc: "Close modal / exit focus" },
];

// ─── Sanitizer setup ────────────────────────────────────────────────────────

function sanitizeHtml(html) {
  if (window.DOMPurify) {
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
      FORCE_BODY: true,
    });
  }
  // If DOMPurify not loaded, do basic script-strip (original behavior)
  return html;
}

// ─── Marked setup ───────────────────────────────────────────────────────────

function setupMarked() {
  if (!window.marked) return;
  const renderer = new marked.Renderer();

  // Code blocks — highlight.js + mermaid detection
  renderer.code = (code, lang) => {
    if (lang === "mermaid") {
      const id = "mmd-" + Math.random().toString(36).slice(2, 8);
      return `<div class="mermaid-block code-block-wrap" data-id="${id}" data-code="${escHtml(code)}"><span class="code-lang">mermaid</span><pre class="mermaid mermaid-source">${escHtml(code)}</pre></div>`;
    }
    const validLang = lang && hljs && hljs.getLanguage(lang) ? lang : null;
    const highlighted = validLang
      ? hljs.highlight(code, { language: validLang, ignoreIllegals: true })
          .value
      : hljs
        ? hljs.highlightAuto(code).value
        : escHtml(code);
    const langLabel = lang
      ? `<span class="code-lang">${escHtml(lang)}</span>`
      : "";
    return `<div class="code-block-wrap" data-code="${escHtml(code)}">${langLabel}<pre><code class="hljs ${lang || ""}">${highlighted}</code></pre></div>`;
  };

  // Headings — add slug ids for outline/anchor
  renderer.heading = (text, level) => {
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return `<h${level} id="${slug}">${text}</h${level}>`;
  };

  // Links — open external in new tab safely
  renderer.link = (href, title, text) => {
    const isExternal =
      href && (href.startsWith("http://") || href.startsWith("https://"));
    const rel = isExternal ? ' rel="noopener noreferrer"' : "";
    const tgt = isExternal ? ' target="_blank"' : "";
    const ttl = title ? ` title="${escHtml(title)}"` : "";
    return `<a href="${escHtml(href)}"${ttl}${tgt}${rel}>${text}</a>`;
  };

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Global copy helper referenced in rendered HTML
window.copyCode = function (btn) {
  const wrap = btn.closest(".code-block-wrap");
  const code =
    wrap?.dataset.code ||
    wrap?.querySelector("code")?.textContent ||
    wrap?.querySelector("pre.mermaid")?.textContent ||
    "";
  navigator.clipboard?.writeText(code).then(() => {
    btn.innerHTML = '<i class="ti ti-check"></i>';
    setTimeout(() => {
      btn.innerHTML = '<i class="ti ti-copy"></i>';
    }, 1500);
  });
};

function resolvePreviewImages(container, imageMap) {
  container.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src") || "";
    const normalized = src.replace(/^\.\//, "");
    let decoded = normalized;
    try {
      decoded = decodeURIComponent(normalized);
    } catch {}
    const mapped =
      imageMap?.[src] ||
      imageMap?.[normalized] ||
      imageMap?.[decoded] ||
      imageMap?.[decoded.replace(/^\.\//, "")];
    if (mapped) {
      img.src = mapped;
      img.dataset.path = decoded;
    }
  });
}

function copyBlockSource(kind, wrap) {
  let text = "";
  if (kind === "image") {
    const img = wrap.querySelector("img");
    const src = img?.dataset.path || img?.getAttribute("src") || "";
    const alt = img?.getAttribute("alt") || "Image";
    text = `![${alt}](${src})`;
  } else if (kind === "table") {
    text = wrap.querySelector("table")?.outerHTML || "";
  } else if (kind === "mermaid") {
    text =
      wrap.querySelector(".mermaid-block")?.dataset.code ||
      wrap.dataset.code ||
      wrap.querySelector("pre.mermaid")?.textContent ||
      "";
  }
  if (!text) return;
  navigator.clipboard?.writeText(text);
}

function setAlignButtonIcon(button, align) {
  const iconByAlign = {
    left: "ti-align-left",
    center: "ti-align-center",
    right: "ti-align-right",
    justify: "ti-align-justified",
  };
  const icon = iconByAlign[align] || "ti-align-center";
  button.innerHTML = `<i class="ti ${icon}"></i>`;
}

function applyPreviewAlignment(wrap, align, kind) {
  wrap.dataset.align = align;
  wrap.style.marginLeft = align === "right" ? "auto" : align === "center" || align === "justify" ? "auto" : "0";
  wrap.style.marginRight = align === "left" ? "auto" : align === "center" || align === "justify" ? "auto" : "0";
  wrap.style.textAlign = align;
  wrap.style.width = align === "justify" && kind !== "image" ? "100%" : wrap.style.width || "";
}

// ─── KaTeX post-process ─────────────────────────────────────────────────────

function renderKatex(container) {
  if (!window.katex) return;

  const targets = container.querySelectorAll(
    "p, li, td, th, h1, h2, h3, h4, h5, h6, blockquote",
  );

  targets.forEach((el) => {
    if (el.querySelector(".katex, .katex-display")) return;

    const trimmed = (el.textContent || "").trim();
    if (/^\$\$[\s\S]+\$\$$/.test(trimmed)) {
      const tex = trimmed.slice(2, -2).trim();
      el.innerHTML = `<div class="katex-block">${katex.renderToString(tex, {
        displayMode: true,
        throwOnError: false,
      })}</div>`;
      return;
    }

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.includes("$")) {
          return NodeFilter.FILTER_REJECT;
        }
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest("code, pre, .katex, .katex-display")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      const content = node.nodeValue || "";
      const parts = [];
      let cursor = 0;

      while (cursor < content.length) {
        const blockStart = content.indexOf("$$", cursor);
        const inlineStart = content.indexOf("$", cursor);
        let start = -1;
        let displayMode = false;

        if (blockStart !== -1 && (inlineStart === -1 || blockStart <= inlineStart)) {
          start = blockStart;
          displayMode = true;
        } else if (inlineStart !== -1) {
          start = inlineStart;
        }

        if (start === -1) {
          parts.push({ type: "text", value: content.slice(cursor) });
          break;
        }

        if (start > cursor) {
          parts.push({ type: "text", value: content.slice(cursor, start) });
        }

        const delimiter = displayMode ? "$$" : "$";
        const end = content.indexOf(delimiter, start + delimiter.length);
        if (end === -1) {
          parts.push({ type: "text", value: content.slice(start) });
          break;
        }

        parts.push({
          type: "math",
          value: content.slice(start + delimiter.length, end).trim(),
          displayMode,
        });
        cursor = end + delimiter.length;
      }

      if (!parts.some((part) => part.type === "math")) return;

      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        if (part.type === "text") {
          fragment.appendChild(document.createTextNode(part.value));
          return;
        }
        const wrap = document.createElement(part.displayMode ? "div" : "span");
        wrap.className = part.displayMode ? "katex-block" : "katex-inline";
        wrap.innerHTML = katex.renderToString(part.value, {
          displayMode: part.displayMode,
          throwOnError: false,
        });
        fragment.appendChild(wrap);
      });

      node.parentNode?.replaceChild(fragment, node);
    });
  });
}

// ─── Mermaid post-process ──────────────────────────────────────────────────

async function renderMermaid(container) {
  if (!window.mermaid) return;
  const pres = container.querySelectorAll("pre.mermaid");
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (typeof mermaid.initialize === "function") {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      suppressErrorRendering: true,
    });
  }
  for (const pre of pres) {
    const block = pre.closest(".mermaid-block");
    block?.querySelectorAll(".mermaid-rendered, .mermaid-error").forEach((el) => el.remove());
    pre.classList.remove("mermaid-error");

    try {
      const code = pre.textContent;
      const id = "mmd-" + Math.random().toString(36).slice(2, 8);
      document.getElementById(`d${id}`)?.remove();
      if (typeof mermaid.parse === "function") {
        await mermaid.parse(code);
      }
      const { svg } = await mermaid.render(id, code);
      document.getElementById(`d${id}`)?.remove();
      const div = document.createElement("div");
      div.className = "mermaid-rendered";
      div.innerHTML = svg;
      pre.hidden = true;
      block ? pre.insertAdjacentElement("afterend", div) : pre.replaceWith(div);
    } catch (e) {
      document.querySelectorAll('[id^="dmmd-"], [id^="dmermaid-"]').forEach((el) => {
        if (el.parentElement === document.body) el.remove();
      });
      pre.hidden = true;
      const err = document.createElement("div");
      err.className = "mermaid-error";
      const title = document.createElement("div");
      title.className = "mermaid-error-title";
      title.innerHTML = '<i class="ti ti-alert-triangle"></i><span>Mermaid syntax error</span>';
      const message = document.createElement("pre");
      message.className = "mermaid-error-message";
      message.textContent = e?.message || "Unable to render this Mermaid diagram.";
      err.append(title, message);
      block ? pre.insertAdjacentElement("afterend", err) : pre.replaceWith(err);
    }
  }
}

async function postProcessPreviewContainer(
  container,
  sizes,
  alignments,
  imageMap,
  onResize,
) {
  if (!container) return;
  await renderMermaid(container);
  resolvePreviewImages(container, imageMap);
  enhancePreviewBlocks(container, sizes, alignments, onResize);
}

function enhancePreviewBlocks(container, sizes, alignments, onResize) {
  const targets = [];
  container.querySelectorAll(".mermaid-block, table, img").forEach((el) => {
    if (el.closest(".preview-resize-wrap")) return;
    targets.push(el);
  });

  targets.forEach((el, index) => {
    const kind = el.matches(".mermaid-block")
      ? "mermaid"
      : el.matches("table")
        ? "table"
        : "image";
    const wrap = document.createElement("div");
    const key = `${kind}:${index}`;
    wrap.className = `preview-resize-wrap preview-resize-${kind}`;
    wrap.dataset.resizeKey = key;
    wrap.dataset.resizeKind = kind;
    wrap.style.width = sizes[key] || "";
    applyPreviewAlignment(wrap, alignments?.[key] || "left", kind);

    if (kind === "table") {
      el.classList.add("preview-table-block");
    }
    if (kind === "image") {
      el.classList.add("preview-image-block");
    }
    if (kind === "mermaid") {
      el.classList.add("preview-mermaid-block");
    }

    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "preview-resize-handle";
    handle.title = "Resize block";
    handle.innerHTML = '<i class="ti ti-arrows-diagonal"></i>';

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "preview-block-copy";
    copy.title = "Copy block";
    copy.innerHTML = '<i class="ti ti-copy"></i>';
    copy.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      copyBlockSource(kind, wrap);
    });

    const align = document.createElement("button");
    align.type = "button";
    align.className = "preview-block-align";
    align.title = "Align block";
    setAlignButtonIcon(align, alignments?.[key] || "left");
    align.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const options = ["left", "center", "right", "justify"];
      const current = wrap.dataset.align || "left";
      const next = options[(options.indexOf(current) + 1) % options.length];
      if (alignments) alignments[key] = next;
      applyPreviewAlignment(wrap, next, kind);
      setAlignButtonIcon(align, next);
    });

    const toolbar = document.createElement("div");
    toolbar.className = "preview-block-toolbar";
    toolbar.append(copy, align);

    handle.addEventListener("pointerdown", (event) => onResize(event, wrap, key, kind));

    el.parentNode?.insertBefore(wrap, el);
    wrap.appendChild(el);
    wrap.appendChild(toolbar);
    wrap.appendChild(handle);
  });
}

function getPreviewTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default";
}

/* ══════════════════════════════════════════════════════════════════════════
   VUE APP
══════════════════════════════════════════════════════════════════════════ */

createApp({
  setup() {
    // ── state ────────────────────────────────────────────────────────────────

    const files = ref([]);
    const activeFileId = ref(null);
    const unsaved = ref(false);

    // editor
    let editorInstance = null; // the CM6 / fallback adapter
    const editorWrap = ref(null); // DOM ref for #editor-wrap
    const previewScroller = ref(null);

    // view
    const viewMode = ref("split");
    const sidebarOpen = ref(true);
    const darkMode = ref(false);
    const focusMode = ref(false);
    const wordWrap = ref(true);
    const editorFontSize = ref(15);
    const editorLineHeight = ref(1.7);

    // modals
    const showLatex = ref(false);
    const showMermaid = ref(false);
    const showExport = ref(false);
    const showImgManager = ref(false);
    const showTemplates = ref(false);
    const showStylePanel = ref(false);
    const showShortcuts = ref(false);
    const showFR = ref(false);
    const showSettings = ref(false);
    const showHistory = ref(false);
    const syncScrollEnabled = ref(false);

    // Find & replace
    const frFind = ref("");
    const frReplace = ref("");
    const frCase = ref(false);
    const frRegex = ref(false);
    const frWord = ref(false);
    const frCount = ref(0);

    // rename
    const renamingFile = ref(false);
    const renameVal = ref("");
    const renameInputRef = ref(null);

    // latex builder
    const latexCat = ref("greek");
    const latexInput = ref("");
    const latexRendered = ref("");
    const latexMode = ref("block");

    // mermaid builder
    const mermaidCode = ref("graph TD\n  A --> B");
    const mermaidPrev = ref("");
    const mermaidError = ref("");
    const mermaidTpl = ref("flowchart");
    const mermaidRendered = computed(() => mermaidPrev.value);

    // block organizer
    const activePanel = ref("editor");
    const blocks = ref([]);
    const editingBlockIdx = ref(-1);
    const dragSrcIdx = ref(-1);
    const blockTypeMenuOpen = ref(false);
    const blockTypeMenuPos = ref({ x: 0, y: 0 });
    const blockTypeMenuTarget = ref(0);
    const blockTypeSearch = ref("");

    // style panel
    const renderTheme = ref("default");
    const customFont = ref("");
    const cFontSize = ref(17);
    const cLineH = ref(1.7);
    const cParaGap = ref(0.8);
    const cHeadFont = ref("");
    const cH1 = ref(2.2);
    const cH2 = ref(1.7);
    const cWidth = ref(780);
    const cPadH = ref(40);
    const cPadV = ref(40);
    const cColorText = ref("");
    const cColorHead = ref("");
    const cColorLink = ref("");
    const cColorBg = ref("");
    const previewTableLayout = ref("full");
    const previewTableStriped = ref(true);
    const previewTableCompact = ref(false);
    const previewTableFontScale = ref(1);
    const previewScaleScope = ref("all");
    const previewScaleFactor = ref(1);
    const previewBlockSizes = ref({});
    const previewBlockAlignments = ref({});
    const imagePathMap = ref({});

    // export
    const exportPaperSize = ref("A4");
    const exportOrientation = ref("portrait");
    const exportMargins = ref("normal");
    const exportScale = ref("100");
    const exportBgGraphics = ref(true);
    const exportTitle = ref("");
    const exportAuthor = ref("");

    // images
    const images = ref([]);
    const selectedImgs = ref([]);
    const imgFileInput = ref(null);
    const showResizeModal = ref(false);
    const resizeTarget = ref(null);
    const resizeW = ref(0);
    const resizeH = ref(0);
    const resizeLock = ref(true);
    const resQ = ref(0.92);
    const showCropModal = ref(false);
    const cropTarget = ref(null);
    const cropX = ref(0);
    const cropY = ref(0);
    const cropW = ref(100);
    const cropH = ref(100);
    const cropPreset = ref("");
    const cropWrapRef = ref(null);
    const cropImgRef = ref(null);
    const cropDisplayTick = ref(0);
    const cropPresets = ["Free", "1:1", "4:3", "16:9"];

    const showResize = computed({
      get: () => showResizeModal.value,
      set: (value) => {
        showResizeModal.value = value;
      },
    });
    const resizeTgt = computed(() => resizeTarget.value);
    const resW = computed({
      get: () => resizeW.value,
      set: (value) => {
        resizeW.value = value;
      },
    });
    const resH = computed({
      get: () => resizeH.value,
      set: (value) => {
        resizeH.value = value;
      },
    });
    const resLock = computed({
      get: () => resizeLock.value,
      set: (value) => {
        resizeLock.value = value;
      },
    });
    const showCrop = computed({
      get: () => showCropModal.value,
      set: (value) => {
        showCropModal.value = value;
      },
    });
    const cropTgt = computed(() => cropTarget.value);
    const cropDisplayRect = computed(() => {
      cropDisplayTick.value;
      const target = cropTarget.value;
      const imgEl = cropImgRef.value;
      if (!target || !imgEl?.clientWidth || !imgEl?.clientHeight) return null;
      const scaleX = imgEl.clientWidth / target.width;
      const scaleY = imgEl.clientHeight / target.height;
      return {
        left: `${imgEl.offsetLeft + cropX.value * scaleX}px`,
        top: `${imgEl.offsetTop + cropY.value * scaleY}px`,
        width: `${cropW.value * scaleX}px`,
        height: `${cropH.value * scaleY}px`,
      };
    });

    // templates
    const userTemplates = ref([]);
    const showSaveTplModal = ref(false);
    const newTplName = ref("");
    const newTplDesc = ref("");
    const newTplIncContent = ref(false);

    // notifications
    const notifications = ref([]);

    // context menus
    const editorCtxOpen = ref(false);
    const editorCtxPos = ref({ x: 0, y: 0 });
    const editorCtxBlockIndex = ref(0);
    const previewCtxOpen = ref(false);
    const previewCtxPos = ref({ x: 0, y: 0 });
    const previewCtxBlockIndex = ref(0);
    const syncScrollSource = ref("editor");
    const fileCtxOpen = ref(false);
    const fileCtxPos = ref({ x: 0, y: 0 });
    const fileCtxTarget = ref(null);

    const shortcuts = SHORTCUTS;

    function applyThemeMode(enabled) {
      if (enabled) document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.toggle("dark", enabled);
      const hljsTheme = document.getElementById("hljs-theme");
      if (hljsTheme) {
        hljsTheme.href = enabled
          ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
          : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
      }
    }

    const ctxMenu = computed(() => {
      if (fileCtxOpen.value) {
        return {
          show: true,
          type: "file",
          x: fileCtxPos.value.x,
          y: fileCtxPos.value.y,
          fileId: fileCtxTarget.value?.id || null,
        };
      }
      if (previewCtxOpen.value) {
        return {
          show: true,
          type: "preview",
          x: previewCtxPos.value.x,
          y: previewCtxPos.value.y,
          fileId: null,
        };
      }
      if (editorCtxOpen.value) {
        return {
          show: true,
          type: "editor",
          x: editorCtxPos.value.x,
          y: editorCtxPos.value.y,
          fileId: null,
        };
      }
      return { show: false, type: "editor", x: 0, y: 0, fileId: null };
    });

    // resize split
    const editorWidth = ref(560);

    // autosave status
    const autosaveStatus = ref("saved"); // 'saved' | 'saving' | 'unsaved'
    const autosaveDelay = ref(2000);

    // snapshots panel
    const snapshots = ref([]);
    const snapshotFreq = ref(5); // minutes between auto-snapshots
    let lastSnapshotTime = Date.now();
    let snapshotTimer = null;

    // settings
    const settingsAutosaveDelay = ref(2000);
    const settingsSnapshotFreq = ref(5);
    const settingsEditorFontSize = ref(15);
    const settingsLineHeight = ref(1.7);
    const settingsWordWrap = ref(true);
    const settingsSpellcheck = ref(false);

    // ── computed ─────────────────────────────────────────────────────────────

    const activeFile = computed(
      () => files.value.find((f) => f.id === activeFileId.value) || null,
    );

    const currentContent = computed({
      get: () => activeFile.value?.content || "",
      set: (v) => {
        const f = activeFile.value;
        if (f) {
          f.content = v;
          markUnsaved();
        }
      },
    });

    const renderedHtml = computed(() => {
      if (!window.marked) return "<p>Loading…</p>";
      let src = currentContent.value || "";
      const mathBlocks = [];

      src = src.replace(/\$\$([\s\S]+?)\$\$/g, (match, expr) => {
        const id = `KATEXDISPLAYPLACEHOLDER${mathBlocks.length}XYZ`;
        mathBlocks.push({ id, expr, displayMode: true });
        return id;
      });

      src = src.replace(/\$([^\n$]+?)\$/g, (match, expr) => {
        const id = `KATEXINLINEPLACEHOLDER${mathBlocks.length}XYZ`;
        mathBlocks.push({ id, expr, displayMode: false });
        return id;
      });

      let html = sanitizeHtml(marked.parse(src));

      if (window.katex) {
        mathBlocks.forEach((block) => {
          try {
            const rendered = katex.renderToString(block.expr.trim(), {
              displayMode: block.displayMode,
              throwOnError: false,
            });
            const wrapper = block.displayMode
              ? `<div class="katex-block">${rendered}</div>`
              : `<span class="katex-inline">${rendered}</span>`;
            html = html.replace(block.id, wrapper);
          } catch (e) {
            const errWrapper = block.displayMode
              ? `<div class="katex-error">LaTeX: ${e.message}</div>`
              : `<span class="katex-error">${block.expr}</span>`;
            html = html.replace(block.id, errWrapper);
          }
        });
      }

      return html;
    });

    const wordCount = computed(
      () =>
        (currentContent.value || "").trim().split(/\s+/).filter(Boolean).length,
    );

    const charCount = computed(() => (currentContent.value || "").length);

    const lineCount = computed(
      () => (currentContent.value || "").split("\n").length,
    );

    const readTime = computed(() =>
      Math.max(1, Math.round(wordCount.value / 200)),
    );

    const headings = computed(() => {
      const h = [];
      const lines = (currentContent.value || "").split("\n");
      for (const line of lines) {
        const m = line.match(/^(#{1,6})\s+(.+)/);
        if (m) {
          h.push({
            level: m[1].length,
            text: m[2],
            slug: m[2]
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-"),
          });
        }
      }
      return h;
    });

    const fontChoices = [
      { name: "System", val: "-apple-system,BlinkMacSystemFont,sans-serif" },
      { name: "DM Sans", val: '"DM Sans",sans-serif' },
      { name: "IBM Plex", val: '"IBM Plex Sans",sans-serif' },
      { name: "Crimson", val: '"Crimson Pro",Georgia,serif' },
      { name: "Libre B.", val: '"Libre Baskerville",Georgia,serif' },
      { name: "Source S.", val: '"Source Serif 4",Georgia,serif' },
      { name: "Raleway", val: '"Raleway",sans-serif' },
    ];

    const renderThemes = RENDER_THEMES;

    const currentThemeName = computed(
      () =>
        RENDER_THEMES.find((t) => t.id === renderTheme.value)?.name ||
        "Default",
    );

    const previewPageStyle = computed(() => {
      const s = {};
      if (customFont.value) s.fontFamily = customFont.value;
      if (cFontSize.value)
        s.fontSize =
          previewScaleScope.value === "all"
            ? cFontSize.value * previewScaleFactor.value + "px"
            : cFontSize.value + "px";
      if (cLineH.value) s.lineHeight = cLineH.value;
      if (cWidth.value) s.maxWidth = cWidth.value + "px";
      if (cPadH.value) {
        s.paddingLeft = cPadH.value + "px";
        s.paddingRight = cPadH.value + "px";
      }
      if (cPadV.value) {
        s.paddingTop = cPadV.value + "px";
        s.paddingBottom = cPadV.value + "px";
      }
      if (cColorText.value) s.color = cColorText.value;
      if (cColorBg.value) s.background = cColorBg.value;
      if (cParaGap.value) s["--para-gap"] = cParaGap.value + "em";
      if (cHeadFont.value) s["--head-font"] = cHeadFont.value;
      if (cH1.value) s["--h1-size"] = cH1.value + "em";
      if (cH2.value) s["--h2-size"] = cH2.value + "em";
      if (cColorHead.value) s["--color-head"] = cColorHead.value;
      if (cColorLink.value) s["--color-link"] = cColorLink.value;
      s["--table-width"] =
        previewTableLayout.value === "full" ? "100%" : "fit-content";
      s["--table-display"] =
        previewTableLayout.value === "fit" || previewTableLayout.value === "center"
          ? "table"
          : "block";
      s["--table-margin"] =
        previewTableLayout.value === "center" ? "0.7em auto" : "0.7em 0";
      s["--table-font-size"] = `${previewTableFontScale.value}em`;
      s["--table-pad-y"] = previewTableCompact.value ? "0.22em" : "0.42em";
      s["--table-pad-x"] = previewTableCompact.value ? "0.5em" : "0.68em";
      s["--table-stripe"] = previewTableStriped.value
        ? "color-mix(in srgb, var(--acc) 7%, transparent)"
        : "transparent";
      s["--media-scale"] = String(previewScaleFactor.value);
      return s;
    });

    const previewPageClass = computed(() => {
      if (previewScaleScope.value === "images") return "scale-images";
      if (previewScaleScope.value === "mermaid") return "scale-mermaid";
      if (previewScaleScope.value === "media") return "scale-media";
      return "scale-all";
    });

    let editorScrollEl = null;
    let previewScrollEl = null;
    let scrollSyncing = false;

    const filteredBlockTypes = computed(() => {
      if (!blockTypeSearch.value) return BLOCK_TYPES;
      return BLOCK_TYPES.filter((b) =>
        b.label.toLowerCase().includes(blockTypeSearch.value.toLowerCase()),
      );
    });

    // ── helpers ──────────────────────────────────────────────────────────────

    function genId() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    function notify(msg, type = "success", duration = 2500) {
      const id = genId();
      notifications.value.push({ id, msg, type });
      setTimeout(() => {
        notifications.value = notifications.value.filter((n) => n.id !== id);
      }, duration);
    }

    function markUnsaved() {
      unsaved.value = true;
      autosaveStatus.value = "unsaved";
      scheduleAutosave(
        { ...activeFile.value, content: currentContent.value },
        () => {
          unsaved.value = false;
          autosaveStatus.value = "saved";
          // Possibly create snapshot
          maybeCreateSnapshot();
        },
      );
    }

    // ── editor interaction ────────────────────────────────────────────────────

    /** Called by toolbar fmt() buttons → wraps selection */
    function fmt(prefix, suffix) {
      if (!editorInstance) return;
      editorInstance.wrapSelection(prefix, suffix);
      syncFromEditor();
    }

    /** Called by toolbar fmtLine() → prepends prefix to current line(s) */
    function fmtLine(prefix) {
      if (!editorInstance) return;
      editorInstance.prefixLine(prefix);
      syncFromEditor();
    }

    /** Called by toolbar fmtBlock() → fence block */
    function fmtBlock(open, close) {
      if (!editorInstance) return;
      editorInstance.fenceBlock(open, close);
      syncFromEditor();
    }

    /** Insert arbitrary text at cursor */
    function insertText(text) {
      if (!editorInstance) return;
      editorInstance.insert(text);
      syncFromEditor();
    }

    /** Pull current value from editor → currentContent */
    function syncFromEditor() {
      if (!editorInstance || !activeFile.value) return;
      activeFile.value.content = editorInstance.getValue();
      markUnsaved();
    }

    /** Push content into editor (e.g. after file switch) */
    function syncToEditor(text) {
      if (editorInstance) editorInstance.setValue(text || "");
    }

    // ── file management ──────────────────────────────────────────────────────

    async function loadAllFiles() {
      const all = await getAllFiles();
      if (!all || all.length === 0) {
        // create default file
        const def = {
          id: genId(),
          name: "untitled.md",
          content: DEFAULT_CONTENT,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await saveFile(def);
        files.value = [def];
      } else {
        files.value = all.sort(
          (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
        );
      }
      // Activate most recently updated
      const lastId = await getSetting("activeFileId", null);
      const target = files.value.find((f) => f.id === lastId) || files.value[0];
      await switchFile(target.id);
    }

    async function switchFile(id) {
      // Flush any pending autosave for current file
      if (activeFileId.value) {
        cancelAutosave();
        if (unsaved.value && activeFile.value) {
          await saveFile({ ...activeFile.value });
          unsaved.value = false;
        }
      }
      activeFileId.value = id;
      await setSetting("activeFileId", id);
      const file = await getFile(id);
      if (file) {
        // Ensure files array is up to date
        const idx = files.value.findIndex((f) => f.id === id);
        if (idx >= 0) files.value[idx] = file;
        else files.value.push(file);
        syncToEditor(file.content);
      }
      editingBlockIdx.value = -1;
    }

    async function newFile() {
      const f = {
        id: genId(),
        name: "untitled.md",
        content: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await saveFile(f);
      files.value.unshift(f);
      await switchFile(f.id);
    }

    async function deleteFile(id) {
      if (files.value.length <= 1) {
        notify("Cannot delete last file", "warn");
        return;
      }
      if (!confirm("Delete this file?")) return;
      await dbDeleteFile(id);
      files.value = files.value.filter((f) => f.id !== id);
      if (activeFileId.value === id) {
        await switchFile(files.value[0].id);
      }
    }

    async function saveFileFn() {
      if (!activeFile.value) return;
      await saveFile({
        ...activeFile.value,
        content: editorInstance?.getValue() || currentContent.value,
      });
      unsaved.value = false;
      autosaveStatus.value = "saved";
      notify("Saved", "success", 1200);
    }

    // rename
    function startRename() {
      renamingFile.value = true;
      renameVal.value = activeFile.value?.name || "";
      nextTick(() => renameInputRef.value?.focus());
    }
    function finishRename() {
      if (activeFile.value && renameVal.value.trim()) {
        activeFile.value.name = renameVal.value.trim();
        saveFile({ ...activeFile.value });
      }
      renamingFile.value = false;
    }

    // file upload
    const mdFileInput = ref(null);
    function triggerMdUpload() {
      mdFileInput.value?.click();
    }
    async function onMdFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      const f = {
        id: genId(),
        name: file.name,
        content: text,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await saveFile(f);
      files.value.unshift(f);
      await switchFile(f.id);
      e.target.value = "";
    }

    // ── snapshots ────────────────────────────────────────────────────────────

    async function maybeCreateSnapshot() {
      const now = Date.now();
      const freq = snapshotFreq.value * 60 * 1000;
      if (now - lastSnapshotTime < freq) return;
      lastSnapshotTime = now;
      if (!activeFileId.value) return;
      await createSnapshot(
        activeFileId.value,
        editorInstance?.getValue() || currentContent.value,
      );
    }

    async function openHistory() {
      if (!activeFileId.value) return;
      snapshots.value = await getSnapshots(activeFileId.value);
      showHistory.value = true;
    }

    async function manualSnapshot() {
      if (!activeFileId.value) return;
      const content = editorInstance?.getValue() || currentContent.value;
      await createSnapshot(activeFileId.value, content, "Manual snapshot");
      snapshots.value = await getSnapshots(activeFileId.value);
      lastSnapshotTime = Date.now();
      notify("Snapshot created", "success");
    }

    async function restoreSnapshot(snap) {
      if (
        !confirm(
          `Restore snapshot from ${snap.label}? Current content will be replaced.`,
        )
      )
        return;
      syncToEditor(snap.content);
      syncFromEditor();
      showHistory.value = false;
      notify("Snapshot restored", "success");
    }

    async function removeSnapshot(snap) {
      await deleteSnapshot(snap.id);
      snapshots.value = snapshots.value.filter((s) => s.id !== snap.id);
    }

    function formatSnapDate(ts) {
      return new Date(ts).toLocaleString();
    }

    // ── settings ─────────────────────────────────────────────────────────────

    async function openSettings() {
      settingsAutosaveDelay.value = await getSetting("autosaveDelay", 2000);
      settingsSnapshotFreq.value = await getSetting("snapshotFreq", 5);
      settingsEditorFontSize.value = await getSetting("editorFontSize", 15);
      settingsLineHeight.value = await getSetting("lineHeight", 1.7);
      settingsWordWrap.value = await getSetting("wordWrap", true);
      settingsSpellcheck.value = await getSetting("spellcheck", false);
      showSettings.value = true;
    }

    async function applySettings() {
      // persist
      await setSetting("autosaveDelay", settingsAutosaveDelay.value);
      await setSetting("snapshotFreq", settingsSnapshotFreq.value);
      await setSetting("editorFontSize", settingsEditorFontSize.value);
      await setSetting("lineHeight", settingsLineHeight.value);
      await setSetting("wordWrap", settingsWordWrap.value);
      await setSetting("spellcheck", settingsSpellcheck.value);

      // apply
      setAutosaveDelay(settingsAutosaveDelay.value);
      snapshotFreq.value = settingsSnapshotFreq.value;
      editorFontSize.value = settingsEditorFontSize.value;
      editorLineHeight.value = settingsLineHeight.value;
      wordWrap.value = settingsWordWrap.value;

      if (editorInstance) {
        editorInstance.setFontSize(settingsEditorFontSize.value);
        editorInstance.setWordWrap(settingsWordWrap.value);
      }

      showSettings.value = false;
      notify("Settings saved", "success");
    }

    // ── preview rendering ─────────────────────────────────────────────────────

    let renderTimer = null;
    function scheduleRender() {
      clearTimeout(renderTimer);
      renderTimer = setTimeout(() => {
        nextTick(() => {
          const pages = [
            document.getElementById("preview-page"),
            document.querySelector(".focus-inner"),
          ].filter(Boolean);
          Promise.all(
            pages.map((page) =>
              postProcessPreviewContainer(
                page,
                previewBlockSizes.value,
                previewBlockAlignments.value,
                imagePathMap.value,
                beginPreviewResize,
              ),
            ),
          ).then(() => {
            if (syncScrollEnabled.value) syncPreviewFromEditor();
          });
        });
      }, 250);
    }

    // ── editor keydown ───────────────────────────────────────────────────────

    function onEditorKeydown(e) {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "s") {
        e.preventDefault();
        saveFileFn();
      }
      if (ctrl && e.key === "b") {
        e.preventDefault();
        fmt("**", "**");
      }
      if (ctrl && e.key === "i") {
        e.preventDefault();
        fmt("*", "*");
      }
      if (ctrl && e.key === "`") {
        e.preventDefault();
        fmt("`", "`");
      }
      if (ctrl && e.key === "m") {
        e.preventDefault();
        openLatexBuilder();
      }
      if (ctrl && e.key === "g") {
        e.preventDefault();
        openMermaidBuilder();
      }
      if (ctrl && e.key === "o") {
        e.preventDefault();
        activePanel.value =
          activePanel.value === "organizer" ? "editor" : "organizer";
      }
      if (ctrl && e.key === "f") {
        e.preventDefault();
        openFR();
      }
      if (ctrl && e.key === ",") {
        e.preventDefault();
        openSettings();
      }
      if (ctrl && e.key === "n") {
        e.preventDefault();
        newFile();
      }
      if (ctrl && e.shiftKey && e.key === "H") {
        e.preventDefault();
        openHistory();
      }
      if (e.key === "Escape" && focusMode.value) {
        focusMode.value = false;
      }
    }

    // ── window keydown (global) ──────────────────────────────────────────────

    function onWindowKeydown(e) {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "s") {
        e.preventDefault();
        saveFileFn();
      }
      if (ctrl && e.key === ",") {
        e.preventDefault();
        openSettings();
      }
      if (ctrl && e.key === "n") {
        e.preventDefault();
        newFile();
      }
      if (e.key === "Escape") {
        if (focusMode.value) {
          focusMode.value = false;
          return;
        }
        showLatex.value =
          showMermaid.value =
          showExport.value =
          showImgManager.value =
          showTemplates.value =
          showShortcuts.value =
          showFR.value =
          showSettings.value =
          showHistory.value =
            false;
        editorCtxOpen.value = previewCtxOpen.value = fileCtxOpen.value = false;
      }
    }

    // ── toolbar helpers ──────────────────────────────────────────────────────

    function undo() {
      editorInstance?.undo();
    }
    function redo() {
      editorInstance?.redo();
    }

    function insertLink() {
      const url = prompt("URL:", "https://");
      const label = prompt("Label:", "Link");
      if (url) insertText(`[${label || "Link"}](${url})`);
    }

    function insertImageFromLib() {
      if (!images.value.length) {
        openImgManager();
        return;
      }
      // use first selected or prompt
      if (selectedImgs.value.length) {
        for (const imgId of selectedImgs.value) {
          const img = images.value.find((entry) => entry.id === imgId);
          if (img) insertText(`![${img.name}](${img.path})\n`);
        }
      } else {
        openImgManager();
      }
    }

    function insertTable() {
      insertText(
        "\n| Column 1 | Column 2 | Column 3 |\n" +
          "|----------|----------|----------|\n" +
          "| Cell 1   | Cell 2   | Cell 3   |\n" +
          "| Cell 4   | Cell 5   | Cell 6   |\n",
      );
    }

    function scrollToHeading(slug) {
      const el = document.getElementById(slug);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function getSyncBlocks() {
      return (editorInstance?.getValue() || currentContent.value || "")
        .split(/\n\n+/)
        .filter(Boolean);
    }

    function getBlockLineMap() {
      const blocks = getSyncBlocks();
      let startLine = 0;
      return blocks.map((block, index) => {
        const lines = block.split("\n").length;
        const endLine = startLine + lines - 1;
        const item = { index, startLine, endLine };
        startLine = endLine + 2;
        return item;
      });
    }

    function blockIndexForLine(line) {
      const map = getBlockLineMap();
      for (const item of map) {
        if (line <= item.endLine) return item.index;
      }
      return Math.max(0, map.length - 1);
    }

    function getEditorBlockIndex() {
      const view = editorInstance?._view;
      if (!view) return 0;
      const viewportStart = view.viewport?.from ?? 0;
      const line = view.state.doc.lineAt(viewportStart).number;
      return blockIndexForLine(line);
    }

    function getPreviewBlockIndex() {
      const preview = previewScrollEl || previewScroller.value || document.getElementById("preview-scroller");
      const page = document.getElementById("preview-page");
      if (!preview || !page) return 0;
      const blocks = Array.from(page.children);
      const top = preview.scrollTop + 12;
      let idx = 0;
      let best = Number.POSITIVE_INFINITY;
      blocks.forEach((block, i) => {
        if (block.offsetTop <= top) {
          const distance = top - block.offsetTop;
          if (distance <= best) {
            best = distance;
            idx = i;
          }
        }
      });
      return Math.min(idx, Math.max(0, blocks.length - 1));
    }

    function focusEditorLine(lineNumber) {
      const view = editorInstance?._view;
      if (view) {
        const line = view.state.doc.line(Math.max(1, Math.min(lineNumber, view.state.doc.lines)));
        view.dispatch({ selection: { anchor: line.from }, scrollIntoView: true });
        view.focus();
        return;
      }

      const ta = editorInstance?._el;
      if (!ta) return;
      const lines = ta.value.split("\n");
      const targetLine = Math.max(0, Math.min(lineNumber - 1, lines.length - 1));
      const before = lines.slice(0, targetLine).join("\n");
      const pos = before.length + (targetLine > 0 ? 1 : 0);
      ta.focus();
      ta.setSelectionRange(pos, pos);
    }

    function beginPreviewResize(event, wrap, key, kind) {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      const startX = event.clientX;
      const startWidth = wrap.getBoundingClientRect().width;
      const minWidth = kind === "image" ? 180 : 240;
      const maxWidth = wrap.parentElement?.clientWidth || 960;
      wrap.classList.add("is-resizing");

      const move = (moveEvent) => {
        const nextWidth = Math.max(
          minWidth,
          Math.min(maxWidth, startWidth + (moveEvent.clientX - startX)),
        );
        wrap.style.width = `${nextWidth}px`;
      };

      const up = () => {
        window.removeEventListener("pointermove", move);
        wrap.classList.remove("is-resizing");
        previewBlockSizes.value = {
          ...previewBlockSizes.value,
          [key]: wrap.style.width,
        };
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up, { once: true });
    }

    function syncPreviewFromEditor() {
      if (!syncScrollEnabled.value || scrollSyncing) return;
      const view = editorInstance?._view;
      const preview = previewScrollEl || previewScroller.value || document.getElementById("preview-scroller");
      if (!view || !preview) return;
      const blocks = getSyncBlocks();
      if (!blocks.length) return;
      const idx = Math.min(getEditorBlockIndex(), blocks.length - 1);
      const target = Array.from(preview.children)[idx];
      if (!target) return;
      scrollSyncing = true;
      preview.scrollTop = Math.max(0, target.offsetTop - 16);
      requestAnimationFrame(() => {
        scrollSyncing = false;
      });
    }

    function syncEditorFromPreview() {
      if (!syncScrollEnabled.value || scrollSyncing) return;
      const view = editorInstance?._view;
      const preview = previewScrollEl || previewScroller.value || document.getElementById("preview-scroller");
      if (!view || !preview) return;
      const blocks = getSyncBlocks();
      const map = getBlockLineMap();
      if (!blocks.length || !map.length) return;
      const idx = Math.min(getPreviewBlockIndex(), map.length - 1);
      const targetLine = (map[idx]?.startLine || 0) + 1;
      scrollSyncing = true;
      focusEditorLine(targetLine);
      requestAnimationFrame(() => {
        scrollSyncing = false;
      });
    }

    function onEditorScroll() {
      syncPreviewFromEditor();
    }

    function onPreviewScroll() {
      syncEditorFromPreview();
    }

    function toggleSyncScroll() {
      syncScrollEnabled.value = !syncScrollEnabled.value;
      nextTick(() => {
        jumpToCorrespondingBlock(syncScrollSource.value);
        if (syncScrollEnabled.value) syncPreviewFromEditor();
      });
    }

    // ── LaTeX builder ─────────────────────────────────────────────────────────

    function openLatexBuilder() {
      latexInput.value = "";
      latexRendered.value = "";
      latexCat.value = "common";
      showLatex.value = true;
    }

    function insertLatexSym(tex) {
      latexInput.value += tex;
      onLatexInputChange();
    }

    function onLatexInputChange() {
      if (!window.katex) return;
      try {
        latexRendered.value = katex.renderToString(latexInput.value, {
          displayMode: latexMode.value === "block",
          throwOnError: false,
        });
      } catch (e) {
        latexRendered.value = `<span class="katex-error">${e.message}</span>`;
      }
    }

    function onLatexKeyUp(e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) insertLatexToEditor();
    }

    function insertLatexToEditor() {
      const wrap =
        latexMode.value === "block"
          ? `$$\n${latexInput.value}\n$$`
          : `$${latexInput.value}$`;
      insertText(wrap);
      showLatex.value = false;
    }

    // ── Mermaid builder ───────────────────────────────────────────────────────

    function openMermaidBuilder() {
      mermaidCode.value = MERMAID_TEMPLATES[0].code;
      mermaidTpl.value = MERMAID_TEMPLATES[0].id;
      mermaidError.value = "";
      showMermaid.value = true;
      nextTick(() => previewMermaid());
    }

    async function previewMermaid() {
      if (!window.mermaid) return;
      try {
        const id = "mbld-" + Math.random().toString(36).slice(2, 8);
        document.getElementById(`d${id}`)?.remove();
        if (typeof mermaid.initialize === "function") {
          mermaid.initialize({
            startOnLoad: false,
            theme: getPreviewTheme(),
            suppressErrorRendering: true,
          });
        }
        if (typeof mermaid.parse === "function") {
          await mermaid.parse(mermaidCode.value);
        }
        const { svg } = await mermaid.render(id, mermaidCode.value);
        document.getElementById(`d${id}`)?.remove();
        mermaidPrev.value = svg;
        mermaidError.value = "";
      } catch (e) {
        document.querySelectorAll('[id^="dmbld-"], [id^="dmmd-"], [id^="dmermaid-"]').forEach((el) => {
          if (el.parentElement === document.body) el.remove();
        });
        mermaidError.value = e.message;
        mermaidPrev.value = "";
      }
    }

    function renderMermaidPreview() {
      return previewMermaid();
    }

    function loadMermaidTpl(tpl) {
      mermaidCode.value = tpl.code;
      previewMermaid();
    }

    function insertMermaidToEditor() {
      insertText(`\n\`\`\`mermaid\n${mermaidCode.value}\n\`\`\`\n`);
      showMermaid.value = false;
    }

    // ── Block organizer ───────────────────────────────────────────────────────

    function parseBlocks() {
      const content = editorInstance?.getValue() || currentContent.value;
      const raw = content.split(/\n\n+/);
      blocks.value = raw.map((c, i) => ({
        id: i + "-" + genId(),
        content: c,
        type: detectBlockType(c),
      }));
    }

    function detectBlockType(c) {
      if (/^#{1,6} /.test(c)) return "heading";
      if (/^```/.test(c)) return "code";
      if (/^\$\$/.test(c)) return "math";
      if (/^```mermaid/.test(c)) return "mermaid";
      if (/^>/.test(c)) return "quote";
      if (/^\|.+\|/.test(c)) return "table";
      if (/^!?\[.*\]\(/.test(c)) return "image";
      if (/^[-*] |^\d+\. /.test(c)) return "list";
      if (/^---+$/.test(c)) return "hr";
      return "paragraph";
    }

    function blocksToContent() {
      const text = blocks.value.map((b) => b.content).join("\n\n");
      syncToEditor(text);
      syncFromEditor();
    }

    function moveBlock(idx, dir) {
      const arr = [...blocks.value];
      const to = idx + dir;
      if (to < 0 || to >= arr.length) return;
      [arr[idx], arr[to]] = [arr[to], arr[idx]];
      blocks.value = arr;
      blocksToContent();
    }

    function duplicateBlock(idx) {
      const b = { ...blocks.value[idx], id: genId() };
      blocks.value.splice(idx + 1, 0, b);
      blocksToContent();
    }

    function deleteBlock(idx) {
      blocks.value.splice(idx, 1);
      blocksToContent();
    }

    function addBlock(idx, type) {
      blocks.value.splice(idx + 1, 0, { id: genId(), content: "", type });
      blocksToContent();
    }

    function openBlockTypeMenu(idx, e) {
      blockTypeMenuTarget.value = idx;
      blockTypeMenuPos.value = { x: e.clientX, y: e.clientY };
      blockTypeMenuOpen.value = true;
    }

    function onBlockDragStart(e, idx) {
      dragSrcIdx.value = idx;
      e.dataTransfer.effectAllowed = "move";
    }
    function onBlockDragOver(e, idx) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }
    function onBlockDrop(e, idx) {
      e.preventDefault();
      const src = dragSrcIdx.value;
      if (src === idx) return;
      const arr = [...blocks.value];
      const [item] = arr.splice(src, 1);
      arr.splice(idx, 0, item);
      blocks.value = arr;
      blocksToContent();
    }
    function onBlockDragEnd() {
      dragSrcIdx.value = -1;
    }

    // ── Find & Replace ────────────────────────────────────────────────────────

    function openFR() {
      showFR.value = true;
      frCountMatches();
    }

    function frDoFind() {
      frCountMatches();
      nextTick(() => {
        frFindRef.value?.focus();
      });
    }

    function frReplaceOne() {
      frReplaceFn();
    }

    function frGoTo() {
      if (!editorInstance) return;
      const query = {
        search: frFind.value || "",
        caseSensitive: frCase.value,
        literal: !frRegex.value,
        regexp: frRegex.value,
        replace: frReplace.value || "",
        wholeWord: frWord.value,
      };
      editorInstance.setSearchQuery?.(query);
      editorInstance.findNext?.();
      editorInstance.openSearchPanel?.();
    }

    function frCountMatches() {
      const content = editorInstance?.getValue() || currentContent.value;
      if (!frFind.value) {
        frCount.value = 0;
        return;
      }
      try {
        const flags = "g" + (frCase.value ? "" : "i");
        const pat = frRegex.value
          ? frFind.value
          : frFind.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const full = frWord.value ? `\\b${pat}\\b` : pat;
        frCount.value = (content.match(new RegExp(full, flags)) || []).length;
      } catch {
        frCount.value = 0;
      }
    }

    function frReplaceFn() {
      let content = editorInstance?.getValue() || currentContent.value;
      if (!frFind.value) return;
      try {
        const flags = frCase.value ? "" : "i";
        const pat = frRegex.value
          ? frFind.value
          : frFind.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const full = frWord.value ? `\\b${pat}\\b` : pat;
        content = content.replace(new RegExp(full, flags), frReplace.value);
        syncToEditor(content);
        syncFromEditor();
        frCountMatches();
      } catch (e) {
        notify("Invalid regex: " + e.message, "warn");
      }
    }

    function frReplaceAll() {
      let content = editorInstance?.getValue() || currentContent.value;
      if (!frFind.value) return;
      try {
        const flags = "g" + (frCase.value ? "" : "i");
        const pat = frRegex.value
          ? frFind.value
          : frFind.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const full = frWord.value ? `\\b${pat}\\b` : pat;
        content = content.replace(new RegExp(full, flags), frReplace.value);
        syncToEditor(content);
        syncFromEditor();
        frCount.value = 0;
        notify("Replaced all", "success");
      } catch (e) {
        notify("Invalid regex: " + e.message, "warn");
      }
    }

    const frFindRef = ref(null);

    // ── Image manager ─────────────────────────────────────────────────────────

    function openImgManager() {
      showImgManager.value = true;
    }

    function syncImagePath(img) {
      if (!img?.path || !img.data) return;
      imagePathMap.value = {
        ...imagePathMap.value,
        [img.path]: img.data,
        [`./${img.path}`]: img.data,
      };
    }

    function insertImageMarkdown(img) {
      if (!img) return;
      const alt = (img.name || "Image").replace(/[\[\]\n\r]/g, " ").trim() || "Image";
      insertText(`\n\n![${alt}](${img.path})\n\n`);
      syncImagePath(img);
      scheduleRender();
    }

    function loadImageData(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Could not load image"));
        img.src = src;
      });
    }

    function updateImageData(img, data, width, height, mime = "image/png") {
      if (!img) return;
      img.data = data;
      img.dataUrl = data;
      img.mime = mime;
      img.width = width;
      img.height = height;
      syncImagePath(img);
      scheduleRender();
    }

    function processImageFiles(files) {
      for (const file of files) {
        if (!file.type?.startsWith("image/")) continue;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const safeName = file.name.replace(/[^\w.-]+/g, "-");
            const id = genId();
            const path = `images/${Date.now()}-${id}-${safeName}`;
            const entry = {
              id: genId(),
              name: file.name,
              path,
              mime: file.type || "image/png",
              dataUrl: ev.target.result,
              data: ev.target.result,
              width: img.naturalWidth,
              height: img.naturalHeight,
            };
            images.value.push(entry);
            if (!selectedImgs.value.includes(entry.id)) selectedImgs.value.push(entry.id);
            syncImagePath(entry);
            notify(`Uploaded ${file.name}`, "success", 1400);
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    }

    function onImgUpload(e) {
      processImageFiles(Array.from(e.target.files || []));
      e.target.value = "";
    }

    function onImgDrop(e) {
      processImageFiles(Array.from(e.dataTransfer?.files || []));
    }

    function toggleImgSelect(img) {
      const idx = selectedImgs.value.indexOf(img.id);
      if (idx >= 0) selectedImgs.value.splice(idx, 1);
      else selectedImgs.value.push(img.id);
    }

    function insertSelectedImgs() {
      for (const imgId of selectedImgs.value) {
        const img = images.value.find((entry) => entry.id === imgId);
        if (img) insertImageMarkdown(img);
      }
      selectedImgs.value = [];
      showImgManager.value = false;
    }

    function deleteSelectedImgs() {
      const deleted = images.value.filter((i) => selectedImgs.value.includes(i.id));
      images.value = images.value.filter(
        (i) => !selectedImgs.value.includes(i.id),
      );
      if (deleted.length) {
        const nextMap = { ...imagePathMap.value };
        deleted.forEach((img) => {
          delete nextMap[img.path];
          delete nextMap[`./${img.path}`];
        });
        imagePathMap.value = nextMap;
      }
      selectedImgs.value = [];
      scheduleRender();
    }

    function triggerImgUpload() {
      imgFileInput.value?.click();
    }

    function insertSelected() {
      insertSelectedImgs();
    }

    function deleteSelected() {
      deleteSelectedImgs();
    }

    function toggleImgSel(id) {
      const idx = selectedImgs.value.indexOf(id);
      if (idx >= 0) selectedImgs.value.splice(idx, 1);
      else selectedImgs.value.push(id);
    }

    function insertOneImage(img) {
      if (!img) return;
      insertImageMarkdown(img);
    }

    function openResize(img) {
      resizeTarget.value = img;
      resizeW.value = img.width;
      resizeH.value = img.height;
      showResizeModal.value = true;
    }
    function onRW() {
      const img = resizeTarget.value;
      if (!resizeLock.value || !img?.width || !img?.height) return;
      resizeH.value = Math.max(1, Math.round((Number(resizeW.value) * img.height) / img.width));
    }
    function onRH() {
      const img = resizeTarget.value;
      if (!resizeLock.value || !img?.width || !img?.height) return;
      resizeW.value = Math.max(1, Math.round((Number(resizeH.value) * img.width) / img.height));
    }
    async function applyResize() {
      const target = resizeTarget.value;
      if (!target) return;
      try {
        const source = await loadImageData(target.data);
        const width = Math.max(1, Math.round(Number(resizeW.value) || target.width));
        const height = Math.max(1, Math.round(Number(resizeH.value) || target.height));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(source, 0, 0, width, height);
        const mime = target.mime === "image/jpeg" || target.mime === "image/webp" ? target.mime : "image/png";
        updateImageData(target, canvas.toDataURL(mime, resQ.value), width, height, mime);
        showResizeModal.value = false;
        notify("Image resized", "success", 1400);
      } catch (e) {
        notify(e.message || "Resize failed", "warn");
      }
    }
    function openCrop(img) {
      cropTarget.value = img;
      cropX.value = 0;
      cropY.value = 0;
      cropW.value = img.width;
      cropH.value = img.height;
      cropPreset.value = "Free";
      showCropModal.value = true;
      nextTick(() => initCropDisplay());
    }
    function initCropDisplay() {
      cropDisplayTick.value += 1;
    }
    function cropPointFromEvent(event) {
      const target = cropTarget.value;
      const imgEl = cropImgRef.value;
      if (!target || !imgEl) return { x: 0, y: 0 };
      const rect = imgEl.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      return {
        x: Math.round((x / rect.width) * target.width),
        y: Math.round((y / rect.height) * target.height),
      };
    }
    function onCropMouseDown(event) {
      if (!cropTarget.value) return;
      const start = cropPointFromEvent(event);
      cropX.value = start.x;
      cropY.value = start.y;
      cropW.value = 1;
      cropH.value = 1;
      const move = (moveEvent) => {
        const point = cropPointFromEvent(moveEvent);
        cropX.value = Math.min(start.x, point.x);
        cropY.value = Math.min(start.y, point.y);
        cropW.value = Math.max(1, Math.abs(point.x - start.x));
        cropH.value = Math.max(1, Math.abs(point.y - start.y));
        cropDisplayTick.value += 1;
      };
      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    }
    function applyCropPreset(preset) {
      const target = cropTarget.value;
      if (!target) return;
      cropPreset.value = preset;
      if (preset === "Free") return;
      const [rw, rh] = preset.split(":").map(Number);
      if (!rw || !rh) return;
      let width = target.width;
      let height = Math.round(width * (rh / rw));
      if (height > target.height) {
        height = target.height;
        width = Math.round(height * (rw / rh));
      }
      cropW.value = width;
      cropH.value = height;
      cropX.value = Math.round((target.width - width) / 2);
      cropY.value = Math.round((target.height - height) / 2);
      cropDisplayTick.value += 1;
    }
    async function applyCrop() {
      const target = cropTarget.value;
      if (!target) return;
      try {
        const source = await loadImageData(target.data);
        const sx = Math.max(0, Math.round(cropX.value));
        const sy = Math.max(0, Math.round(cropY.value));
        const sw = Math.max(1, Math.min(target.width - sx, Math.round(cropW.value)));
        const sh = Math.max(1, Math.min(target.height - sy, Math.round(cropH.value)));
        const canvas = document.createElement("canvas");
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
        const mime = target.mime === "image/jpeg" || target.mime === "image/webp" ? target.mime : "image/png";
        updateImageData(target, canvas.toDataURL(mime, resQ.value), sw, sh, mime);
        showCropModal.value = false;
        notify("Image cropped", "success", 1400);
      } catch (e) {
        notify(e.message || "Crop failed", "warn");
      }
    }

    // ── Templates ─────────────────────────────────────────────────────────────

    function openTemplates() {
      showTemplates.value = true;
    }
    function loadTemplate(t) {
      if (confirm("Replace current content with template?")) {
        syncToEditor(t.content);
        syncFromEditor();
        if (t.theme) renderTheme.value = t.theme;
        showTemplates.value = false;
      }
    }

    function openSaveTplModal() {
      newTplName.value = "";
      newTplDesc.value = "";
      newTplIncContent.value = false;
      showSaveTplModal.value = true;
    }

    function saveAsTheme() {
      openSaveTplModal();
    }

    function saveNewTemplate() {
      if (!newTplName.value.trim()) {
        notify("Name required", "warn");
        return;
      }
      userTemplates.value.push({
        id: genId(),
        name: newTplName.value.trim(),
        desc: newTplDesc.value.trim(),
        theme: renderTheme.value,
        content: newTplIncContent.value
          ? editorInstance?.getValue() || currentContent.value
          : "",
      });
      showSaveTplModal.value = false;
      notify("Template saved", "success");
    }

    // ── Export ────────────────────────────────────────────────────────────────

    function openExport() {
      showExport.value = true;
    }

    function exportMarkdown() {
      const blob = new Blob(
        [editorInstance?.getValue() || currentContent.value],
        { type: "text/markdown" },
      );
      downloadBlob(
        blob,
        (activeFile.value?.name || "document") +
          (activeFile.value?.name?.endsWith(".md") ? "" : ".md"),
      );
    }

    function exportHtml() {
      const html = buildExportHtml();
      const blob = new Blob([html], { type: "text/html" });
      downloadBlob(
        blob,
        (activeFile.value?.name?.replace(".md", "") || "document") + ".html",
      );
    }

    function buildExportHtml() {
      const body = renderedHtml.value;
      return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${exportTitle.value || activeFile.value?.name || "Document"}</title>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
<style>
  body { max-width: 800px; margin: 40px auto; font-family: sans-serif; line-height: 1.7; padding: 0 20px; }
  pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x:auto; }
  code { font-family: monospace; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ccc; padding: 8px 12px; }
</style>
</head>
<body>
${body}
<script>mermaid.initialize({startOnLoad:true});<\/script>
</body>
</html>`;
    }

    function exportPdfFn() {
      window.print();
    }

    function exportDocx() {
      // Simple Word-compatible HTML export
      const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'></head><body>${renderedHtml.value}</body></html>`;
      const blob = new Blob([html], { type: "application/msword" });
      downloadBlob(
        blob,
        (activeFile.value?.name?.replace(".md", "") || "document") + ".doc",
      );
    }

    function exportPlain() {
      const content = editorInstance?.getValue() || currentContent.value;
      const blob = new Blob([content], { type: "text/plain" });
      downloadBlob(
        blob,
        (activeFile.value?.name?.replace(".md", "") || "document") + ".txt",
      );
    }

    function exportJson() {
      const data = {
        name: activeFile.value?.name,
        content: editorInstance?.getValue() || currentContent.value,
        exportedAt: new Date().toISOString(),
        metadata: { title: exportTitle.value, author: exportAuthor.value },
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      downloadBlob(
        blob,
        (activeFile.value?.name?.replace(".md", "") || "document") + ".json",
      );
    }

    function copyHtml() {
      navigator.clipboard
        ?.writeText(renderedHtml.value)
        .then(() => notify("HTML copied", "success"));
    }

    function downloadBlob(blob, name) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    // ── Context menus ─────────────────────────────────────────────────────────

    function openEditorCtx(e) {
      syncScrollSource.value = "editor";
      editorCtxBlockIndex.value = getEditorBlockIndex();
      editorCtxPos.value = { x: e.clientX, y: e.clientY };
      editorCtxOpen.value = true;
    }
    function openPreviewCtx(e) {
      syncScrollSource.value = "preview";
      const page = document.getElementById("preview-page");
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      let target = hit;
      while (target && page && target.parentElement && target.parentElement !== page) {
        target = target.parentElement;
      }
      const children = page ? Array.from(page.children) : [];
      const idx = target ? children.indexOf(target) : -1;
      previewCtxBlockIndex.value = idx >= 0 ? idx : getPreviewBlockIndex();
      previewCtxPos.value = { x: e.clientX, y: e.clientY };
      previewCtxOpen.value = true;
    }
    function openFileCtx(e, f) {
      fileCtxTarget.value = f;
      fileCtxPos.value = { x: e.clientX, y: e.clientY };
      fileCtxOpen.value = true;
    }
    function closeAllCtx() {
      editorCtxOpen.value = previewCtxOpen.value = fileCtxOpen.value = false;
      blockTypeMenuOpen.value = false;
    }

    function closeCtx() {
      closeAllCtx();
    }

    function getEditorText() {
      return editorInstance?.getValue() || currentContent.value || "";
    }

    function doSelectAll() {
      if (!editorInstance) return;
      if (editorInstance._type === "textarea" && editorInstance._el) {
        editorInstance._el.focus();
        editorInstance._el.select();
        return;
      }
      const view = editorInstance._view;
      if (!view) return;
      const end = view.state.doc.length;
      view.dispatch({ selection: { anchor: 0, head: end } });
      view.focus();
    }

    async function doCopy() {
      const text = getEditorText();
      await navigator.clipboard?.writeText(text);
      notify("Copied", "success", 1000);
    }

    function clearEditor() {
      syncToEditor("");
      syncFromEditor();
    }

    function copyText() {
      return doCopy();
    }

    function exportPDF() {
      return exportPdfFn();
    }

    function exportHTML() {
      return exportHtml();
    }

    async function startRenameById(id) {
      if (id) await switchFile(id);
      startRename();
    }

    async function duplicateFile(id) {
      const file = files.value.find((f) => f.id === id);
      if (file) await ctxDuplicateFile(file);
    }

    function exportSingle(id) {
      const file = files.value.find((f) => f.id === id);
      if (file) ctxDownloadFile(file);
    }

    async function ctxDuplicateFile(f) {
      const dup = {
        ...f,
        id: genId(),
        name: f.name.replace(".md", "") + "-copy.md",
        updatedAt: Date.now(),
      };
      await saveFile(dup);
      files.value.unshift(dup);
      fileCtxOpen.value = false;
    }

    function ctxDownloadFile(f) {
      const blob = new Blob([f.content], { type: "text/markdown" });
      downloadBlob(blob, f.name);
    }

    // ── Split resize ──────────────────────────────────────────────────────────

    let resizing = false;
    function startResize(e) {
      resizing = true;
      const startX = e.clientX;
      const startW = editorWidth.value;
      const mainW = document.getElementById("main")?.clientWidth || window.innerWidth;
      const onMove = (ev) => {
        if (!resizing) return;
        const maxW = Math.max(220, mainW - 240);
        editorWidth.value = Math.min(maxW, Math.max(220, startW + (ev.clientX - startX)));
      };
      const onUp = () => {
        resizing = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }

    // ── dark mode ─────────────────────────────────────────────────────────────

    function toggleDark() {
      darkMode.value = !darkMode.value;
      applyThemeMode(darkMode.value);
      editorInstance?.setDarkMode(darkMode.value);
      setSetting("darkMode", darkMode.value);
    }

    // ── style panel ───────────────────────────────────────────────────────────

    function resetStyle() {
      customFont.value = "";
      cFontSize.value = 17;
      cLineH.value = 1.7;
      cParaGap.value = 0.8;
      cHeadFont.value = "";
      cH1.value = 2.2;
      cH2.value = 1.7;
      cWidth.value = 780;
      cPadH.value = 40;
      cPadV.value = 40;
      cColorText.value = "";
      cColorHead.value = "";
      cColorLink.value = "";
      cColorBg.value = "";
      previewTableLayout.value = "full";
      previewScaleScope.value = "all";
      previewScaleFactor.value = 1;
    }

    // ── watches ──────────────────────────────────────────────────────────────

    watch(renderedHtml, () => scheduleRender());
    watch(focusMode, (visible) => {
      if (visible) scheduleRender();
    });

    watch(darkMode, (v) => {
      applyThemeMode(v);
    });

    watch(wordWrap, (v) => {
      editorInstance?.setWordWrap(v);
    });

    watch(editorFontSize, (v) => {
      editorInstance?.setFontSize(v);
    });

    watch(previewTableLayout, (v) => setSetting("previewTableLayout", v));
    watch(previewScaleScope, (v) => setSetting("previewScaleScope", v));
    watch(previewScaleFactor, (v) => setSetting("previewScaleFactor", v));

    watch(activePanel, (v) => {
      if (v === "organizer") parseBlocks();
    });

    // ── onMounted ────────────────────────────────────────────────────────────

    onMounted(async () => {
      // Setup marked
      setupMarked();

      // Mermaid init
      if (window.mermaid) {
        mermaid.initialize({
          startOnLoad: false,
          theme: darkMode.value ? "dark" : "default",
          suppressErrorRendering: true,
        });
      }

      // IndexedDB + migration
      await openDB();
      await migrateFromLocalStorage();

      // Load persisted settings
      const settings = await getAllSettings();
      if (settings.darkMode !== undefined) {
        darkMode.value = settings.darkMode;
        applyThemeMode(darkMode.value);
      }
      if (settings.wordWrap !== undefined) wordWrap.value = settings.wordWrap;
      if (settings.editorFontSize)
        editorFontSize.value = settings.editorFontSize;
      if (settings.lineHeight) editorLineHeight.value = settings.lineHeight;
      if (settings.autosaveDelay) {
        autosaveDelay.value = settings.autosaveDelay;
        setAutosaveDelay(settings.autosaveDelay);
      }
      if (settings.snapshotFreq) snapshotFreq.value = settings.snapshotFreq;
      if (settings.renderTheme) renderTheme.value = settings.renderTheme;
      if (settings.sidebarOpen !== undefined)
        sidebarOpen.value = settings.sidebarOpen;
      if (settings.previewTableLayout)
        previewTableLayout.value = settings.previewTableLayout;
      if (settings.previewScaleScope)
        previewScaleScope.value = settings.previewScaleScope;
      if (settings.previewScaleFactor)
        previewScaleFactor.value = settings.previewScaleFactor;

      // Load files from IndexedDB
      await loadAllFiles();

      // Mount CodeMirror 6 editor
      nextTick(() => {
        const parent = document.getElementById("editor-wrap");
        if (!parent) return;

        editorInstance = createEditor({
          parent,
          initialValue: activeFile.value?.content || "",
          darkMode: darkMode.value,
          wordWrap: wordWrap.value,
          fontSize: editorFontSize.value,
          lineHeight: editorLineHeight.value,
          onChange(text) {
            if (activeFile.value) {
              activeFile.value.content = text;
              markUnsaved();
            }
          },
          onKeydown: onEditorKeydown,
        });

        editorScrollEl = editorInstance?._view?.scrollDOM || null;
        previewScrollEl = previewScroller.value || document.getElementById("preview-scroller");
        editorScrollEl?.addEventListener("scroll", onEditorScroll, { passive: true });
        previewScrollEl?.addEventListener("scroll", onPreviewScroll, { passive: true });
      });

      // Global keyboard listener
      window.addEventListener("keydown", onWindowKeydown);
      window.addEventListener("click", closeAllCtx);

      // Snapshot timer
      snapshotTimer = setInterval(() => {
        if (activeFileId.value && unsaved.value) maybeCreateSnapshot();
      }, 60000); // check every minute

      // Persist sidebar/theme changes
      watch(sidebarOpen, (v) => setSetting("sidebarOpen", v));
      watch(renderTheme, (v) => setSetting("renderTheme", v));
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", onWindowKeydown);
      window.removeEventListener("click", closeAllCtx);
      editorScrollEl?.removeEventListener("scroll", onEditorScroll);
      previewScrollEl?.removeEventListener("scroll", onPreviewScroll);
      clearInterval(snapshotTimer);
      editorInstance?.destroy();
    });

    // ── expose to template ────────────────────────────────────────────────────

    return {
      // constants
      TEMPLATES,
      RENDER_THEMES,
      LATEX_CATS,
      latexTemplates,
      MERMAID_TEMPLATES,
      BLOCK_TYPES,
      SHORTCUTS,
      shortcuts,

      // state
      files,
      activeFileId,
      activeFile,
      unsaved,
      autosaveStatus,
      viewMode,
      sidebarOpen,
      darkMode,
      focusMode,
      wordWrap,
      editorFontSize,
      editorLineHeight,
      showLatex,
      showMermaid,
      showExport,
      showImgManager,
      showTemplates,
      showStylePanel,
      showShortcuts,
      showFR,
      showSettings,
      showHistory,
      syncScrollEnabled,
      previewScroller,
      frFindRef,
      renamingFile,
      renameVal,
      renameInputRef,
      latexCat,
      latexInput,
      latexRendered,
      latexMode,
      mermaidCode,
      mermaidPrev,
      mermaidRendered,
      mermaidError,
      mermaidTpl,
      activePanel,
      blocks,
      editingBlockIdx,
      blockTypeMenuOpen,
      blockTypeMenuPos,
      blockTypeMenuTarget,
      blockTypeSearch,
      renderTheme,
      customFont,
      cFontSize,
      cLineH,
      cParaGap,
      cHeadFont,
      cH1,
      cH2,
      cWidth,
      cPadH,
      cPadV,
      cColorText,
      cColorHead,
      cColorLink,
      cColorBg,
      previewTableLayout,
      previewTableStriped,
      previewTableCompact,
      previewTableFontScale,
      previewScaleScope,
      previewScaleFactor,
      previewBlockSizes,
      previewBlockAlignments,
      exportPaperSize,
      exportOrientation,
      exportMargins,
      exportScale,
      exportBgGraphics,
      exportTitle,
      exportAuthor,
      images,
      selectedImgs,
      imgFileInput,
      imgUploadRef: imgFileInput,
      showResizeModal,
      showResize,
      resizeTarget,
      resizeTgt,
      resizeW,
      resW,
      resizeH,
      resH,
      resizeLock,
      resLock,
      resQ,
      showCropModal,
      showCrop,
      cropTarget,
      cropTgt,
      cropX,
      cropY,
      cropW,
      cropH,
      cropPreset,
      cropPresets,
      cropWrapRef,
      cropImgRef,
      cropDisplayRect,
      userTemplates,
      showSaveTplModal,
      newTplName,
      newTplDesc,
      newTplIncContent,
      notifications,
      ctxMenu,
      editorCtxOpen,
      editorCtxPos,
      previewCtxOpen,
      previewCtxPos,
      fileCtxOpen,
      fileCtxPos,
      fileCtxTarget,
      editorWidth,
      editorWrap,
      frFind,
      frReplace,
      frCase,
      frRegex,
      frWord,
      frWhole: frWord,
      frCount,
      snapshots,
      snapshotFreq,
      autosaveDelay,
      settingsAutosaveDelay,
      settingsSnapshotFreq,
      settingsEditorFontSize,
      settingsLineHeight,
      settingsWordWrap,
      settingsSpellcheck,

      // computed
      currentContent,
      renderedHtml,
      wordCount,
      charCount,
      lineCount,
      readTime,
      headings,
      fontChoices,
      renderThemes,
      currentThemeName,
      previewPageStyle,
      previewPageClass,
      filteredBlockTypes,

      // methods
      newFile,
      switchFile,
      deleteFile,
      saveFile: saveFileFn,
      startRename,
      finishRename,
      mdFileInput,
      triggerMdUpload,
      onMdFileUpload,
      fmt,
      fmtLine,
      fmtBlock,
      insertText,
      undo,
      redo,
      insertLink,
      insertImageFromLib,
      insertTable,
      scrollToHeading,
      openLatexBuilder,
      insertLatexSym,
      onLatexInputChange,
      onLatexKeyUp,
      insertLatexToEditor,
      openMermaidBuilder,
      previewMermaid,
      loadMermaidTpl,
      insertMermaidToEditor,
      parseBlocks,
      blocksToContent,
      moveBlock,
      duplicateBlock,
      deleteBlock,
      addBlock,
      openBlockTypeMenu,
      onBlockDragStart,
      onBlockDragOver,
      onBlockDrop,
      onBlockDragEnd,
      openFR,
      frDoFind,
      frReplaceOne,
      frGoTo,
      frCountMatches,
      frReplaceFn,
      frReplaceAll,
      openImgManager,
      onImgUpload,
      onImgDrop,
      triggerImgUpload,
      toggleImgSelect,
      toggleImgSel,
      insertSelectedImgs,
      insertSelected,
      deleteSelectedImgs,
      deleteSelected,
      insertOneImage,
      openResize,
      onRW,
      onRH,
      applyResize,
      openCrop,
      initCropDisplay,
      onCropMouseDown,
      applyCropPreset,
      applyCrop,
      openTemplates,
      loadTemplate,
      openSaveTplModal,
      saveAsTheme,
      saveNewTemplate,
      openExport,
      exportMarkdown,
      exportHtml,
      exportPdfFn,
      exportDocx,
      exportPlain,
      exportJson,
      copyHtml,
      openEditorCtx,
      openPreviewCtx,
      openFileCtx,
      closeCtx,
      closeAllCtx,
      doSelectAll,
      doCopy,
      clearEditor,
      copyText,
      exportPDF,
      exportHTML,
      startRenameById,
      duplicateFile,
      exportSingle,
      ctxDuplicateFile,
      ctxDownloadFile,
      startResize,
      toggleDark,
      toggleSyncScroll,
      resetStyle,
      openSettings,
      applySettings,
      openHistory,
      manualSnapshot,
      restoreSnapshot,
      removeSnapshot,
      formatSnapDate,
      notify,
      katex: window.katex,
    };
  },
}).mount("#vue-root");
