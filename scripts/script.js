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
      "# Project Name\n\nBrief description.\n\n## Installation\n\n```bash\nnpm install your-package\n```\n\n## Quick Start\n\n```javascript\nimport { create } from 'your-package';\nconst instance = create({ option: 'value' });\nawait instance.run();\n```\n\n## API Reference\n\n### `create(options)`\n\n| Parameter | Type | Default | Description |\n|-----------|------|---------|-------------|\n| `option` | string | 'default' | Option desc |\n\n## License\n\nMIT\n",
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


const BLOCK_TYPES=[
  {type:'paragraph',label:'Paragraph',icon:'ti-align-left'},
  {type:'heading1',label:'Heading 1',icon:'ti-h-1',prefix:'# '},
  {type:'heading2',label:'Heading 2',icon:'ti-h-2',prefix:'## '},
  {type:'heading3',label:'Heading 3',icon:'ti-h-3',prefix:'### '},
  {type:'heading4',label:'Heading 4',icon:'ti-h-4',prefix:'#### '},
  {type:'bullet',label:'Bullet List',icon:'ti-list'},
  {type:'numbered',label:'Numbered List',icon:'ti-list-numbers'},
  {type:'blockquote',label:'Quote',icon:'ti-blockquote'},
  {type:'code',label:'Code Block',icon:'ti-code'},
  {type:'mermaid',label:'Mermaid Diagram',icon:'ti-topology-star'},
  {type:'math',label:'Math / LaTeX',icon:'ti-math-function'},
  {type:'table',label:'Table',icon:'ti-table'},
  {type:'divider',label:'Divider',icon:'ti-minus'},
  {type:'image',label:'Image',icon:'ti-photo'},
];

function detectBlockType(text) {
  const t = text.trim();
  if (/^# /.test(t)) return "heading1";
  if (/^## /.test(t)) return "heading2";
  if (/^### /.test(t)) return "heading3";
  if (/^#### /.test(t)) return "heading4";
  if (/^> /.test(t)) return "blockquote";
  if (/^```mermaid/.test(t)) return "mermaid";
  if (/^```/.test(t)) return "code";
  if (/^\$\$/.test(t)) return "math";
  if (/^[-*] /.test(t)) return "bullet";
  if (/^\d+\. /.test(t)) return "numbered";
  if (/^\|/.test(t)) return "table";
  if (/^---$/.test(t.trim())) return "divider";
  if (/^!\[/.test(t)) return "image";
  return "paragraph";
}

const LATEX_CATS = [
  {
    id: "greek",
    label: "Greek",
    icon: "ti-alpha",
    symbols: [
      { tex: "\\alpha", label: "alpha" },
      { tex: "\\beta", label: "beta" },
      { tex: "\\gamma", label: "gamma" },
      { tex: "\\delta", label: "delta" },
      { tex: "\\epsilon", label: "epsilon" },
      { tex: "\\zeta", label: "zeta" },
      { tex: "\\eta", label: "eta" },
      { tex: "\\theta", label: "theta" },
      { tex: "\\iota", label: "iota" },
      { tex: "\\kappa", label: "kappa" },
      { tex: "\\lambda", label: "lambda" },
      { tex: "\\mu", label: "mu" },
      { tex: "\\nu", label: "nu" },
      { tex: "\\xi", label: "xi" },
      { tex: "\\pi", label: "pi" },
      { tex: "\\rho", label: "rho" },
      { tex: "\\sigma", label: "sigma" },
      { tex: "\\tau", label: "tau" },
      { tex: "\\upsilon", label: "upsilon" },
      { tex: "\\phi", label: "phi" },
      { tex: "\\chi", label: "chi" },
      { tex: "\\psi", label: "psi" },
      { tex: "\\omega", label: "omega" },
      { tex: "\\Gamma", label: "Gamma" },
      { tex: "\\Delta", label: "Delta" },
      { tex: "\\Theta", label: "Theta" },
      { tex: "\\Lambda", label: "Lambda" },
      { tex: "\\Xi", label: "Xi" },
      { tex: "\\Pi", label: "Pi" },
      { tex: "\\Sigma", label: "Sigma" },
      { tex: "\\Upsilon", label: "Upsilon" },
      { tex: "\\Phi", label: "Phi" },
      { tex: "\\Psi", label: "Psi" },
      { tex: "\\Omega", label: "Omega" },
    ],
  },
  {
    id: "ops",
    label: "Operators",
    icon: "ti-math-function",
    symbols: [
      { tex: "\\sum_{i=0}^{n}", label: "sum" },
      { tex: "\\prod_{i=0}^{n}", label: "product" },
      { tex: "\\int_{a}^{b}", label: "integral" },
      { tex: "\\oint", label: "contour" },
      { tex: "\\iint", label: "double int" },
      { tex: "\\iiint", label: "triple int" },
      { tex: "\\lim_{x\\to\\infty}", label: "limit" },
      { tex: "\\infty", label: "infinity" },
      { tex: "\\partial", label: "partial" },
      { tex: "\\nabla", label: "nabla" },
      { tex: "\\frac{a}{b}", label: "fraction" },
      { tex: "\\sqrt{x}", label: "sqrt" },
      { tex: "\\sqrt[n]{x}", label: "n-th root" },
      { tex: "x^{n}", label: "superscript" },
      { tex: "x_{n}", label: "subscript" },
      { tex: "\\binom{n}{k}", label: "binomial" },
      { tex: "\\overline{x}", label: "overline" },
      { tex: "\\hat{x}", label: "hat" },
      { tex: "\\vec{x}", label: "vector" },
      { tex: "\\dot{x}", label: "dot" },
      { tex: "\\ddot{x}", label: "ddot" },
      { tex: "\\tilde{x}", label: "tilde" },
    ],
  },
  {
    id: "relations",
    label: "Relations",
    icon: "ti-equal",
    symbols: [
      { tex: "=", label: "equals" },
      { tex: "\\neq", label: "not equal" },
      { tex: "\\approx", label: "approx" },
      { tex: "\\equiv", label: "equiv" },
      { tex: "\\sim", label: "similar" },
      { tex: "\\simeq", label: "simeq" },
      { tex: "<", label: "less" },
      { tex: ">", label: "greater" },
      { tex: "\\leq", label: "leq" },
      { tex: "\\geq", label: "geq" },
      { tex: "\\ll", label: "much less" },
      { tex: "\\gg", label: "much greater" },
      { tex: "\\subset", label: "subset" },
      { tex: "\\supset", label: "supset" },
      { tex: "\\subseteq", label: "subseteq" },
      { tex: "\\supseteq", label: "supseteq" },
      { tex: "\\in", label: "in" },
      { tex: "\\notin", label: "not in" },
      { tex: "\\cup", label: "union" },
      { tex: "\\cap", label: "intersect" },
      { tex: "\\emptyset", label: "empty" },
      { tex: "\\forall", label: "forall" },
      { tex: "\\exists", label: "exists" },
      { tex: "\\nexists", label: "not exists" },
    ],
  },
  {
    id: "arrows",
    label: "Arrows",
    icon: "ti-arrow-right",
    symbols: [
      { tex: "\\to", label: "to" },
      { tex: "\\leftarrow", label: "left" },
      { tex: "\\Rightarrow", label: "Rightarrow" },
      { tex: "\\Leftarrow", label: "Leftarrow" },
      { tex: "\\Leftrightarrow", label: "iff" },
      { tex: "\\rightarrow", label: "rightarrow" },
      { tex: "\\leftrightarrow", label: "leftrightarrow" },
      { tex: "\\uparrow", label: "up" },
      { tex: "\\downarrow", label: "down" },
      { tex: "\\Uparrow", label: "Up" },
      { tex: "\\Downarrow", label: "Down" },
      { tex: "\\mapsto", label: "mapsto" },
      { tex: "\\longmapsto", label: "longmapsto" },
      { tex: "\\hookrightarrow", label: "hookright" },
      { tex: "\\twoheadrightarrow", label: "twohead" },
      { tex: "\\nearrow", label: "nearrow" },
      { tex: "\\searrow", label: "searrow" },
    ],
  },
  {
    id: "structures",
    label: "Structures",
    icon: "ti-brackets",
    symbols: [
      { tex: "\\left( x \\right)", label: "parens" },
      { tex: "\\left[ x \\right]", label: "brackets" },
      { tex: "\\left\\{ x \\right\\}", label: "braces" },
      { tex: "\\left| x \\right|", label: "abs" },
      { tex: "\\left\\| x \\right\\|", label: "norm" },
      { tex: "\\left\\lfloor x \\right\\rfloor", label: "floor" },
      { tex: "\\left\\lceil x \\right\\rceil", label: "ceil" },
      {
        tex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
        label: "matrix",
      },
      {
        tex: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",
        label: "bmatrix",
      },
      {
        tex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}",
        label: "vmatrix",
      },
      {
        tex: "\\begin{cases} x & \\text{if } n>0 \\\\ -x & \\text{otherwise} \\end{cases}",
        label: "cases",
      },
      { tex: "\\text{text here}", label: "text" },
    ],
  },
  {
    id: "calculus",
    label: "Calculus",
    icon: "ti-wave-sine",
    symbols: [
      { tex: "\\frac{d}{dx}f(x)", label: "derivative" },
      { tex: "\\frac{d^2}{dx^2}f", label: "2nd deriv" },
      { tex: "\\frac{\\partial f}{\\partial x}", label: "partial deriv" },
      { tex: "\\int_{a}^{b} f(x)\\,dx", label: "definite int" },
      { tex: "\\int f(x)\\,dx", label: "indefinite int" },
      { tex: "\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}", label: "limit def" },
      { tex: "\\sum_{n=0}^{\\infty} a_n x^n", label: "power series" },
      {
        tex: "e^x = \\sum_{n=0}^{\\infty}\\frac{x^n}{n!}",
        label: "exp series",
      },
      {
        tex: "\\nabla f = \\left(\\frac{\\partial f}{\\partial x},\\frac{\\partial f}{\\partial y}\\right)",
        label: "gradient",
      },
      {
        tex: "\\oint_{C} \\mathbf{F}\\cdot d\\mathbf{r}",
        label: "line integral",
      },
    ],
  },
  {
    id: "physics",
    label: "Physics",
    icon: "ti-atom",
    symbols: [
      { tex: "E = mc^2", label: "mass-energy" },
      { tex: "F = ma", label: "Newton 2nd" },
      { tex: "\\hbar = \\frac{h}{2\\pi}", label: "hbar" },
      { tex: "\\hat{H}\\psi = E\\psi", label: "Schrödinger" },
      {
        tex: "\\nabla^2 \\phi = \\frac{\\rho}{\\varepsilon_0}",
        label: "Poisson",
      },
      {
        tex: "\\mathbf{F} = q(\\mathbf{E}+\\mathbf{v}\\times\\mathbf{B})",
        label: "Lorentz",
      },
      { tex: "PV = nRT", label: "ideal gas" },
      {
        tex: "\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}",
        label: "uncertainty",
      },
      {
        tex: "c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}}",
        label: "speed of light",
      },
    ],
  },
  {
    id: "stats",
    label: "Statistics",
    icon: "ti-chart-bar",
    symbols: [
      { tex: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i", label: "mean" },
      {
        tex: "\\sigma^2 = \\frac{1}{n}\\sum(x_i-\\bar{x})^2",
        label: "variance",
      },
      { tex: "P(A|B) = \\frac{P(B|A)P(A)}{P(B)}", label: "Bayes" },
      { tex: "\\mathcal{N}(\\mu,\\sigma^2)", label: "normal dist" },
      { tex: "\\binom{n}{k}p^k(1-p)^{n-k}", label: "binomial" },
      {
        tex: "\\rho = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\sigma_Y}",
        label: "correlation",
      },
      { tex: "\\hat{\\beta} = (X^TX)^{-1}X^Ty", label: "OLS" },
    ],
  },
  {
    id: "logic",
    label: "Logic",
    icon: "ti-binary",
    symbols: [
      { tex: "\\land", label: "and" },
      { tex: "\\lor", label: "or" },
      { tex: "\\lnot", label: "not" },
      { tex: "\\Rightarrow", label: "implies" },
      { tex: "\\Leftrightarrow", label: "iff" },
      { tex: "\\forall x", label: "for all" },
      { tex: "\\exists x", label: "there exists" },
      { tex: "\\top", label: "true" },
      { tex: "\\bot", label: "false" },
      { tex: "\\vdash", label: "proves" },
      { tex: "\\models", label: "models" },
      { tex: "\\therefore", label: "therefore" },
      { tex: "\\because", label: "because" },
    ],
  },
  {
    id: "common",
    label: "Common",
    icon: "ti-star",
    symbols: [
      { tex: "x^2 + y^2 = r^2", label: "circle" },
      { tex: "ax^2+bx+c=0", label: "quadratic" },
      { tex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}", label: "quad formula" },
      { tex: "e^{i\\pi}+1=0", label: "Euler identity" },
      { tex: "\\pi \\approx 3.14159", label: "pi" },
      { tex: "a^2+b^2=c^2", label: "Pythagorean" },
      { tex: "\\det(A) = \\sum_{j} a_{ij}C_{ij}", label: "determinant" },
      {
        tex: "A^{-1}=\\frac{1}{\\det A}\\text{adj}(A)",
        label: "matrix inverse",
      },
      { tex: "\\ln(xy)=\\ln x+\\ln y", label: "log product" },
      {
        tex: "\\int_0^\\infty e^{-x^2}dx=\\frac{\\sqrt{\\pi}}{2}",
        label: "Gaussian",
      },
    ],
  },
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
    code: "erDiagram\n  CUSTOMER ||--o{ ORDER : places\n  ORDER ||--|{ ITEM : contains\n  CUSTOMER {\n    string name\n    string email\n  }\n  ORDER {\n    int id\n    date created\n  }",
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

const { createApp, ref, computed, watch, onMounted, nextTick } = Vue;
const mkid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toLocaleDateString();

const DEMO_MD = `# Markdown Studio — Full Edition

## Mermaid Diagrams, LaTeX & Block Organizer

---

### Mermaid flowchart

\`\`\`mermaid
flowchart LR
  A([Start]) --> B{Is markdown?}
  B -->|Yes| C[Render it]
  B -->|No| D[Plain text]
  C --> E([Beautiful output])
  D --> E
\`\`\`

### LaTeX Mathematics

Einstein: $E = mc^2$

Quadratic formula:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

Euler's identity: $e^{i\\pi} + 1 = 0$

### Features

- 🧮 **LaTeX Helper** — click symbols to build equations graphically
- 🔀 **Mermaid Builder** — visual diagram editor with live preview
- 📦 **Block Organizer** — drag paragraphs to reorder your document
- 🎨 **16 themes** — Research, IEEE, APA, CV, Legal, Medical, Startup…
- 📤 **Export** — PDF (multi-page), HTML, Word, Markdown, JSON

> Right-click anywhere for context menu. Use toolbar ⊞ for block organizer.
`;

let appInstance;
appInstance = createApp({
  setup() {
    /* ─── UI ─── */
    const darkMode = ref(false);
    const sidebarOpen = ref(true);
    const viewMode = ref("split");
    const focusMode = ref(false);
    const wordWrap = ref(true);
    const unsaved = ref(false);
    const showStylePanel = ref(false);
    const activePanel = ref("editor"); // editor | organizer

    /* ─── FILES ─── */
    const files = ref([]);
    const activeFileId = ref(null);
    const currentContent = ref(DEMO_MD);
    const renamingFile = ref(false);
    const renameVal = ref("");
    const renameInputRef = ref(null);
    const renamingId = ref(null);

    /* ─── EDITOR ─── */
    const editorRef = ref(null);
    const editorFontSize = ref(13);
    const editorLineHeight = ref(1.75);
    const editorWidth = ref(500);
    const mdFileInput = ref(null);
    const undoStack = ref([]);
    const redoStack = ref([]);
    let skipHistory = false;

    /* ─── RENDER ─── */
    const renderTheme = ref("default");
    const renderThemes = [
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
    const currentThemeName = computed(
      () => renderThemes.find((t) => t.id === renderTheme.value)?.name || "",
    );

    /* ─── STYLE ─── */
    const customFont = ref("");
    const cFontSize = ref(16),
      cLineH = ref(1.7),
      cParaGap = ref(0.75);
    const cWidth = ref(740),
      cPadH = ref(48),
      cPadV = ref(40);
    const cColorText = ref(""),
      cColorHead = ref(""),
      cColorLink = ref(""),
      cColorBg = ref("");
    const cHeadFont = ref(""),
      cH1 = ref(2),
      cH2 = ref(1.5);
    const fontChoices = [
      { name: "DM Sans", val: "'DM Sans',sans-serif" },
      { name: "IBM Plex", val: "'IBM Plex Sans',sans-serif" },
      { name: "Raleway", val: "'Raleway',sans-serif" },
      { name: "Crimson", val: "'Crimson Pro',serif" },
      { name: "Src Serif", val: "'Source Serif 4',serif" },
      { name: "Playfair", val: "'Playfair Display',serif" },
      { name: "Georgia", val: "Georgia,serif" },
      { name: "Space Mono", val: "'Space Mono',monospace" },
    ];
    const previewPageStyle = computed(() => {
      const s = {};
      if (customFont.value) s.fontFamily = customFont.value;
      if (cFontSize.value !== 16) s.fontSize = cFontSize.value + "px";
      if (cLineH.value !== 1.7) s.lineHeight = cLineH.value;
      if (cColorText.value) s.color = cColorText.value;
      if (cColorBg.value) s.background = cColorBg.value;
      s.maxWidth = cWidth.value + "px";
      s.paddingLeft = cPadH.value + "px";
      s.paddingRight = cPadH.value + "px";
      s.paddingTop = cPadV.value + "px";
      s.paddingBottom = cPadV.value + 40 + "px";
      return s;
    });

    /* ─── BLOCK ORGANIZER ─── */
    const blocks = ref([]);
    let dragSrcIdx = -1,
      dragOverIdx = -1;
    const blockTypeMenuOpen = ref(false);
    const blockTypeMenuTarget = ref(-1);
    const blockTypeMenuPos = ref({ x: 0, y: 0 });
    const editingBlockIdx = ref(-1);
    const blockTypeSearch = ref("");

    const parseBlocks = () => {
      const raw = currentContent.value.split(/\n{2,}/);
      blocks.value = raw
        .filter((p) => p.trim())
        .map((p) => ({
          id: mkid(),
          type: detectBlockType(p.trim()),
          content: p.trim(),
        }));
      if (!blocks.value.length)
        blocks.value = [{ id: mkid(), type: "paragraph", content: "" }];
    };
    const blocksToContent = () => {
      currentContent.value = blocks.value.map((b) => b.content).join("\n\n");
      unsaved.value = true;
    };
    const addBlock = (idx, type = "paragraph") => {
      const bt = BLOCK_TYPES.find((b) => b.type === type);
      let content = "";
      if (type === "heading1") content = "# New Heading";
      else if (type === "heading2") content = "## New Heading";
      else if (type === "heading3") content = "### New Heading";
      else if (type === "bullet") content = "- Item";
      else if (type === "numbered") content = "1. Item";
      else if (type === "blockquote") content = "> Quote";
      else if (type === "code") content = "```\ncode here\n```";
      else if (type === "mermaid")
        content = "```mermaid\nflowchart LR\n  A --> B\n```";
      else if (type === "math") content = "$$\n\\sum_{i=1}^{n} x_i\n$$";
      else if (type === "table")
        content = "| Col 1 | Col 2 |\n|-------|-------|\n| A     | B     |";
      else if (type === "divider") content = "---";
      else content = "Paragraph text here.";
      const nb = { id: mkid(), type, content };
      blocks.value.splice(idx + 1, 0, nb);
      blockTypeMenuOpen.value = false;
      blocksToContent();
      nextTick(() => {
        editingBlockIdx.value = idx + 1;
      });
    };
    const deleteBlock = (idx) => {
      if (blocks.value.length === 1) {
        blocks.value[0].content = "";
        blocksToContent();
        return;
      }
      blocks.value.splice(idx, 1);
      blocksToContent();
      if (editingBlockIdx.value >= blocks.value.length)
        editingBlockIdx.value = blocks.value.length - 1;
    };
    const duplicateBlock = (idx) => {
      const nb = { ...blocks.value[idx], id: mkid() };
      blocks.value.splice(idx + 1, 0, nb);
      blocksToContent();
    };
    const moveBlock = (idx, dir) => {
      const target = idx + dir;
      if (target < 0 || target >= blocks.value.length) return;
      [blocks.value[idx], blocks.value[target]] = [
        blocks.value[target],
        blocks.value[idx],
      ];
      blocksToContent();
    };
    const onBlockDragStart = (e, idx) => {
      dragSrcIdx = idx;
      e.dataTransfer.effectAllowed = "move";
      setTimeout(() => {
        const el = document.querySelectorAll(".block-item")[idx];
        if (el) el.classList.add("dragging");
      }, 0);
    };
    const onBlockDragOver = (e, idx) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      document
        .querySelectorAll(".block-item")
        .forEach((el) => el.classList.remove("drag-over"));
      if (idx !== dragSrcIdx) {
        const el = document.querySelectorAll(".block-item")[idx];
        if (el) el.classList.add("drag-over");
      }
      dragOverIdx = idx;
    };
    const onBlockDrop = (e, idx) => {
      e.preventDefault();
      document
        .querySelectorAll(".block-item")
        .forEach((el) => el.classList.remove("drag-over", "dragging"));
      if (dragSrcIdx === -1 || dragSrcIdx === idx) return;
      const moved = blocks.value.splice(dragSrcIdx, 1)[0];
      let ins = idx;
      if (dragSrcIdx < idx) ins--;
      ins = Math.max(0, Math.min(ins, blocks.value.length));
      blocks.value.splice(ins, 0, moved);
      blocksToContent();
      dragSrcIdx = -1;
    };
    const onBlockDragEnd = () => {
      document
        .querySelectorAll(".block-item")
        .forEach((el) => el.classList.remove("drag-over", "dragging"));
      dragSrcIdx = -1;
    };
    const openBlockTypeMenu = (idx, e) => {
      blockTypeMenuTarget.value = idx;
      blockTypeMenuOpen.value = true;
      blockTypeSearch.value = "";
      const x = Math.min(e.clientX, window.innerWidth - 200),
        y = Math.min(e.clientY, window.innerHeight - 320);
      blockTypeMenuPos.value = { x, y };
      nextTick(() => {
        const inp = document.getElementById("block-type-search");
        if (inp) inp.focus();
      });
    };
    const filteredBlockTypes = computed(() => {
      const q = blockTypeSearch.value.toLowerCase();
      return q
        ? BLOCK_TYPES.filter((b) => b.label.toLowerCase().includes(q))
        : BLOCK_TYPES;
    });
    watch(activePanel, (p) => {
      if (p === "organizer") parseBlocks();
    });

    /* ─── IMAGES ─── */
    const images = ref([]);
    const selectedImgs = ref([]);
    const imgFileInput = ref(null);
    const showImgManager = ref(false);
    const showResize = ref(false);
    const showCrop = ref(false);
    const resizeTgt = ref(null);
    const resW = ref(0),
      resH = ref(0),
      resLock = ref(true),
      resQ = ref(0.92);
    const cropTgt = ref(null);
    const cropX = ref(0),
      cropY = ref(0),
      cropW = ref(0),
      cropH = ref(0);
    const cropWrapRef = ref(null),
      cropImgRef = ref(null);
    const cropScale = ref(1);
    const cropPresets = ["Free", "1:1", "4:3", "16:9", "3:4", "A4 portrait"];

    /* ─── EXPORT ─── */
    const showExport = ref(false);
    const showPdfSettings = ref(false);
    const exportTitle = ref("");
    const exportAuthor = ref("");
    const exportKeywords = ref("");
    const exportDate = ref(new Date().toISOString().slice(0, 10));
    const pdfPaperSize = ref("A4");
    const pdfOrientation = ref("portrait");
    const pdfMargins = ref("normal");
    const pdfScale = ref("100");
    const pdfBg = ref(true);

    /* ─── TEMPLATES ─── */
    const userTemplates = ref([]);
    const showTemplates = ref(false);
    const tplTab = ref("builtin");
    const showSaveTpl = ref(false);
    const newTplName = ref(""),
      newTplDesc = ref(""),
      tplInclude = ref(true);

    /* ─── FIND/REPLACE ─── */
    const showFR = ref(false);
    const frFind = ref(""),
      frReplace = ref("");
    const frCase = ref(false),
      frRegex = ref(false),
      frWhole = ref(false),
      frCount = ref(null);
    const frFindRef = ref(null);

    /* ─── LATEX BUILDER ─── */
    const showLatex = ref(false);
    const latexInput = ref("");
    const latexMode = ref("block"); // block | inline
    const latexCat = ref("common");
    const latexCursor = ref(0);
    const latexRendered = computed(() => {
      try {
        return katex.renderToString(latexInput.value || "\\square", {
          displayMode: latexMode.value === "block",
          throwOnError: false,
          output: "html",
        });
      } catch (e) {
        return '<span style="color:red">' + e.message + "</span>";
      }
    });
    const insertLatexSym = (sym) => {
      const cur = latexCursor.value;
      const before = latexInput.value.slice(0, cur),
        after = latexInput.value.slice(cur);
      latexInput.value = before + sym + after;
      latexCursor.value = cur + sym.length;
      nextTick(() => {
        const el = document.getElementById("latex-input");
        if (el) {
          el.focus();
          el.setSelectionRange(latexCursor.value, latexCursor.value);
        }
      });
    };
    const onLatexInputChange = (e) => {
      latexInput.value = e.target.value;
      latexCursor.value = e.target.selectionStart;
    };
    const onLatexKeyUp = (e) => {
      latexCursor.value = e.target.selectionStart;
    };
    const insertLatexToEditor = () => {
      const ta = editorRef.value;
      let insert = "";
      if (latexMode.value === "block")
        insert = "\n$$\n" + latexInput.value + "\n$$\n";
      else insert = "$" + latexInput.value + "$";
      const s = ta ? ta.selectionStart : currentContent.value.length;
      currentContent.value =
        currentContent.value.substring(0, s) +
        insert +
        currentContent.value.substring(s);
      unsaved.value = true;
      showLatex.value = false;
      notify("LaTeX inserted", "success", 1500);
    };
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

    /* ─── MERMAID BUILDER ─── */
    const showMermaid = ref(false);
    const mermaidCode = ref(
      "flowchart LR\n  A([Start]) --> B{Decision?}\n  B -->|Yes| C[Action]\n  B -->|No| D[Other]\n  C --> E([End])\n  D --> E",
    );
    const mermaidDiagramType = ref("flowchart");
    const mermaidRendered = ref("");
    const mermaidError = ref("");
    let mermaidRenderTimer = null;

    const renderMermaidPreview = async () => {
      mermaidError.value = "";
      if (typeof mermaid === "undefined") {
        mermaidError.value = "Mermaid not loaded";
        return;
      }
      try {
        const id = "mmb-" + mkid();
        const { svg } = await mermaid.render(id, mermaidCode.value);
        mermaidRendered.value = svg;
      } catch (e) {
        mermaidError.value = e.message || "Diagram error";
      }
    };
    watch(mermaidCode, () => {
      clearTimeout(mermaidRenderTimer);
      mermaidRenderTimer = setTimeout(renderMermaidPreview, 600);
    });
    const insertMermaidToEditor = () => {
      const ta = editorRef.value;
      const insert = "\n```mermaid\n" + mermaidCode.value + "\n```\n";
      const s = ta ? ta.selectionStart : currentContent.value.length;
      currentContent.value =
        currentContent.value.substring(0, s) +
        insert +
        currentContent.value.substring(s);
      unsaved.value = true;
      showMermaid.value = false;
      notify("Mermaid diagram inserted", "success", 1500);
    };
    const loadMermaidTemplate = (t) => {
      mermaidCode.value = t.code;
      mermaidDiagramType.value = t.id;
    };
    const openMermaidBuilder = () => {
      showMermaid.value = true;
      nextTick(renderMermaidPreview);
    };
    const openLatexBuilder = () => {
      showLatex.value = true;
      latexInput.value = "";
      latexCat.value = "common";
    };

    /* ─── CTX MENU ─── */
    const ctxMenu = ref({
      show: false,
      x: 0,
      y: 0,
      type: "editor",
      fileId: null,
    });
    const showShortcuts = ref(false);
    const shortcuts = [
      { key: "Ctrl+S", desc: "Save" },
      { key: "Ctrl+N", desc: "New file" },
      { key: "Ctrl+B", desc: "Bold" },
      { key: "Ctrl+I", desc: "Italic" },
      { key: "Ctrl+H", desc: "Find & Replace" },
      { key: "Ctrl+Z", desc: "Undo" },
      { key: "Ctrl+Y", desc: "Redo" },
      { key: "Ctrl+D", desc: "Duplicate line" },
      { key: "Ctrl+Shift+F", desc: "Focus mode" },
      { key: "F11", desc: "Fullscreen" },
      { key: "Esc", desc: "Close / exit focus" },
      { key: "Tab", desc: "Indent" },
      { key: "Shift+Tab", desc: "Outdent" },
      { key: "Ctrl+M", desc: "LaTeX Builder" },
      { key: "Ctrl+G", desc: "Mermaid Builder" },
      { key: "Ctrl+O", desc: "Block Organizer" },
    ];

    /* ─── NOTIFICATIONS ─── */
    const notifications = ref([]);
    let nid = 0;
    const notify = (msg, type = "info", dur = 2800) => {
      const id = ++nid;
      notifications.value.push({ id, msg, type });
      setTimeout(() => {
        notifications.value = notifications.value.filter((n) => n.id !== id);
      }, dur);
    };

    /* ─── COMPUTED ─── */
    const activeFile = computed(() =>
      files.value.find((f) => f.id === activeFileId.value),
    );
    const wordCount = computed(() => {
      const t = currentContent.value.trim();
      return t ? t.split(/\s+/).length : 0;
    });
    const charCount = computed(() => currentContent.value.length);
    const lineCount = computed(() => currentContent.value.split("\n").length);
    const readTime = computed(() =>
      Math.max(1, Math.ceil(wordCount.value / 200)),
    );
    const headings = computed(() => {
      const re = /^(#{1,6})\s+(.+)$/gm;
      const out = [];
      let m;
      while ((m = re.exec(currentContent.value)) !== null) {
        const text = m[2].replace(/[*_`]/g, "").trim();
        const slug = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
        out.push({ level: m[1].length, text, slug });
      }
      return out;
    });

    /* ─── RENDERER ─── */
    const buildRenderer = () => {
      const r = new marked.Renderer();
      r.heading = (text, level) => {
        const slug = text
          .replace(/<[^>]*>/g, "")
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
        return `<h${level} id="${slug}">${text}</h${level}>`;
      };
      r.code = (code, lang) => {
        if (lang === "mermaid") {
          const id = "mm-" + mkid();
          return `<div class="mermaid-block" id="${id}"><div class="mermaid">${code}</div></div>`;
        }
        let h = code;
        if (lang && hljs.getLanguage(lang)) {
          try {
            h = hljs.highlight(code, { language: lang }).value;
          } catch (e) {}
        } else {
          try {
            h = hljs.highlightAuto(code).value;
          } catch (e) {}
        }
        return `<pre><code class="hljs ${lang || ""}">${h}</code></pre>`;
      };
      r.image = (href, title, text) => {
        const stored = images.value.find(
          (i) => i.id === href || i.name === href,
        );
        const src = stored ? stored.data : href;
        const wm = text?.match(/w=(\d+)/),
          hm = text?.match(/h=(\d+)/);
        const alt = (text || "").replace(/[wh]=\d+/g, "").trim();
        let st = "max-width:100%";
        if (wm) st += `;width:${wm[1]}px`;
        if (hm) st += `;height:${hm[1]}px`;
        return `<figure><img src="${src}" alt="${alt}" style="${st};border-radius:var(--rad)"/>${title ? `<figcaption>${title}</figcaption>` : ""}</figure>`;
      };
      return r;
    };
    const processLatex = (src) => {
      src = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
        try {
          return `<div class="katex-block">${katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false })}</div>`;
        } catch (e) {
          return `<div class="katex-error">LaTeX: ${e.message}</div>`;
        }
      });
      src = src.replace(/\$([^\n$]+?)\$/g, (_, expr) => {
        try {
          return `<span class="katex-inline">${katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false })}</span>`;
        } catch (e) {
          return `<span class="katex-error">${expr}</span>`;
        }
      });
      return src;
    };
    const renderedHtml = computed(() => {
      try {
        marked.setOptions({
          renderer: buildRenderer(),
          breaks: true,
          gfm: true,
        });
        let src = processLatex(currentContent.value || "");
        let html = marked.parse(src);
        const ov = [];
        if (cColorText.value)
          ov.push(`#preview-page{color:${cColorText.value}!important}`);
        if (cColorHead.value)
          ov.push(
            `#preview-page h1,#preview-page h2,#preview-page h3,#preview-page h4{color:${cColorHead.value}!important}`,
          );
        if (cColorLink.value)
          ov.push(`#preview-page a{color:${cColorLink.value}!important}`);
        if (cHeadFont.value)
          ov.push(
            `#preview-page h1,#preview-page h2,#preview-page h3{font-family:${cHeadFont.value}!important}`,
          );
        if (cH1.value !== 2)
          ov.push(`#preview-page h1{font-size:${cH1.value}em!important}`);
        if (cH2.value !== 1.5)
          ov.push(`#preview-page h2{font-size:${cH2.value}em!important}`);
        if (cParaGap.value !== 0.75)
          ov.push(`#preview-page p{margin:${cParaGap.value}em 0!important}`);
        if (ov.length) html = `<style>${ov.join(" ")}</style>` + html;
        return html;
      } catch (e) {
        return `<p style="color:red">Render error: ${e.message}</p>`;
      }
    });
    const renderMermaidInPreview = async () => {
      await nextTick();
      if (typeof mermaid === "undefined") return;
      const els = document.querySelectorAll(
        "#preview-page .mermaid-block .mermaid, .focus-inner .mermaid",
      );
      if (els.length) {
        try {
          await mermaid.run({ nodes: Array.from(els) });
        } catch (e) {}
      }
    };
    watch(renderedHtml, () => setTimeout(renderMermaidInPreview, 80));

    /* ─── PERSISTENCE ─── */
    const SK = "mdstudio_v5";
    const persist = () => {
      try {
        localStorage.setItem(
          SK,
          JSON.stringify({
            files: files.value.map((f) => ({
              ...f,
              content:
                f.id === activeFileId.value ? currentContent.value : f.content,
            })),
            activeFileId: activeFileId.value,
            darkMode: darkMode.value,
            renderTheme: renderTheme.value,
            images: images.value,
            userTemplates: userTemplates.value,
          }),
        );
        unsaved.value = false;
      } catch (e) {
        notify("Storage full", "error");
      }
    };
    const hydrate = () => {
      try {
        const raw = localStorage.getItem(SK);
        if (!raw) return false;
        const d = JSON.parse(raw);
        if (d.files?.length) files.value = d.files;
        if (d.activeFileId) activeFileId.value = d.activeFileId;
        if (d.darkMode !== undefined) darkMode.value = d.darkMode;
        if (d.renderTheme) renderTheme.value = d.renderTheme;
        if (d.images) images.value = d.images;
        if (d.userTemplates) userTemplates.value = d.userTemplates;
        const af = files.value.find((f) => f.id === activeFileId.value);
        if (af) currentContent.value = af.content || "";
        return true;
      } catch (e) {
        return false;
      }
    };

    /* ─── FILES ─── */
    const newFile = () => {
      const id = mkid();
      files.value.push({
        id,
        name: `note-${files.value.length + 1}.md`,
        content: "",
      });
      switchFile(id);
    };
    const switchFile = (id) => {
      if (activeFileId.value) {
        const af = files.value.find((f) => f.id === activeFileId.value);
        if (af) af.content = currentContent.value;
      }
      activeFileId.value = id;
      const f = files.value.find((f) => f.id === id);
      currentContent.value = f?.content || "";
      undoStack.value = [];
      redoStack.value = [];
      unsaved.value = false;
    };
    const deleteFile = (id) => {
      if (files.value.length === 1) {
        notify("Keep at least one file", "warn");
        return;
      }
      if (!confirm("Delete this file?")) return;
      files.value = files.value.filter((f) => f.id !== id);
      if (activeFileId.value === id) switchFile(files.value[0].id);
      notify("Deleted", "info", 1500);
    };
    const duplicateFile = (id) => {
      const f = files.value.find((f) => f.id === id);
      if (!f) return;
      const nid = mkid();
      files.value.push({
        id: nid,
        name: f.name.replace(/(\.\w+)?$/, "-copy$1"),
        content: id === activeFileId.value ? currentContent.value : f.content,
      });
      switchFile(nid);
      notify("Duplicated", "success", 1500);
    };
    const saveFile = () => {
      if (activeFileId.value) {
        const af = files.value.find((f) => f.id === activeFileId.value);
        if (af) af.content = currentContent.value;
      }
      persist();
      notify("Saved ✓", "success", 1500);
    };
    const startRename = () => {
      if (!activeFile.value) return;
      renamingId.value = activeFileId.value;
      renameVal.value = activeFile.value.name;
      renamingFile.value = true;
      nextTick(() => renameInputRef.value?.select());
    };
    const startRenameById = (id) => {
      const f = files.value.find((f) => f.id === id);
      if (!f) return;
      const nm = prompt("Rename:", f.name);
      if (nm?.trim()) f.name = nm.trim();
    };
    const finishRename = () => {
      if (renameVal.value?.trim()) {
        const f = files.value.find((f) => f.id === renamingId.value);
        if (f) f.name = renameVal.value.trim();
      }
      renamingFile.value = false;
    };

    /* ─── UNDO/REDO ─── */
    const pushHistory = (c) => {
      if (skipHistory) return;
      undoStack.value.push(c);
      if (undoStack.value.length > 120) undoStack.value.shift();
      redoStack.value = [];
    };
    const undo = () => {
      if (!undoStack.value.length) return;
      redoStack.value.push(currentContent.value);
      skipHistory = true;
      currentContent.value = undoStack.value.pop();
      skipHistory = false;
    };
    const redo = () => {
      if (!redoStack.value.length) return;
      undoStack.value.push(currentContent.value);
      skipHistory = true;
      currentContent.value = redoStack.value.pop();
      skipHistory = false;
    };
    let inputTimer = null;
    const onInput = () => {
      unsaved.value = true;
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => pushHistory(currentContent.value), 700);
    };

    /* ─── KEYDOWN ─── */
    const onEditorKeydown = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "s") {
        e.preventDefault();
        saveFile();
        return;
      }
      if (ctrl && e.key === "b") {
        e.preventDefault();
        fmt("**", "**");
        return;
      }
      if (ctrl && e.key === "i") {
        e.preventDefault();
        fmt("*", "*");
        return;
      }
      if (ctrl && e.key === "h") {
        e.preventDefault();
        openFR();
        return;
      }
      if (ctrl && e.key === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (ctrl && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        redo();
        return;
      }
      if (ctrl && e.key === "n") {
        e.preventDefault();
        newFile();
        return;
      }
      if (ctrl && e.key === "m") {
        e.preventDefault();
        openLatexBuilder();
        return;
      }
      if (ctrl && e.key === "g") {
        e.preventDefault();
        openMermaidBuilder();
        return;
      }
      if (ctrl && e.key === "o") {
        e.preventDefault();
        activePanel.value =
          activePanel.value === "organizer" ? "editor" : "organizer";
        return;
      }
      if (ctrl && e.shiftKey && e.key === "F") {
        e.preventDefault();
        focusMode.value = true;
        return;
      }
      if (ctrl && e.key === "d") {
        e.preventDefault();
        const ta = editorRef.value;
        const pos = ta.selectionStart;
        const start = currentContent.value.lastIndexOf("\n", pos - 1) + 1;
        const end = currentContent.value.indexOf("\n", pos);
        const lineEnd = end === -1 ? currentContent.value.length : end;
        const line = currentContent.value.substring(start, lineEnd);
        currentContent.value =
          currentContent.value.substring(0, lineEnd) +
          "\n" +
          line +
          currentContent.value.substring(lineEnd);
        nextTick(() => {
          ta.selectionStart = ta.selectionEnd = lineEnd + 1 + line.length;
        });
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = editorRef.value;
        const s = ta.selectionStart,
          en = ta.selectionEnd;
        if (e.shiftKey) {
          const ls = currentContent.value.lastIndexOf("\n", s - 1) + 1;
          const line = currentContent.value.substring(ls, en);
          const nl = line.replace(/^ {1,2}/, "");
          currentContent.value =
            currentContent.value.substring(0, ls) +
            nl +
            currentContent.value.substring(en);
          nextTick(() => {
            ta.selectionStart = ta.selectionEnd =
              s - Math.min(2, line.length - nl.length);
          });
        } else {
          currentContent.value =
            currentContent.value.substring(0, s) +
            "  " +
            currentContent.value.substring(en);
          nextTick(() => {
            ta.selectionStart = ta.selectionEnd = s + 2;
          });
        }
        return;
      }
      if (e.key === "Escape" && focusMode.value) {
        focusMode.value = false;
        return;
      }
      if (e.key === "F11") {
        e.preventDefault();
        focusMode.value = !focusMode.value;
        return;
      }
      const pairs = {
        "(": ")",
        "[": "]",
        "{": "}",
        '"': '"',
        "'": "'",
        "`": "`",
      };
      if (pairs[e.key]) {
        const ta = editorRef.value;
        const s = ta.selectionStart,
          en = ta.selectionEnd;
        if (s !== en) {
          e.preventDefault();
          const sel = currentContent.value.substring(s, en);
          currentContent.value =
            currentContent.value.substring(0, s) +
            e.key +
            sel +
            pairs[e.key] +
            currentContent.value.substring(en);
          nextTick(() => {
            ta.selectionStart = s + 1;
            ta.selectionEnd = en + 1;
          });
        }
      }
    };

    /* ─── FORMATTING ─── */
    const fmt = (before, after) => {
      const ta = editorRef.value;
      if (!ta) return;
      const s = ta.selectionStart,
        e = ta.selectionEnd;
      const sel = currentContent.value.substring(s, e);
      if (
        currentContent.value.substring(s - before.length, s) === before &&
        currentContent.value.substring(e, e + after.length) === after
      ) {
        currentContent.value =
          currentContent.value.substring(0, s - before.length) +
          sel +
          currentContent.value.substring(e + after.length);
        nextTick(() => {
          ta.selectionStart = s - before.length;
          ta.selectionEnd = e - before.length;
          ta.focus();
        });
      } else {
        currentContent.value =
          currentContent.value.substring(0, s) +
          before +
          sel +
          after +
          currentContent.value.substring(e);
        nextTick(() => {
          ta.selectionStart = s + before.length;
          ta.selectionEnd = s + before.length + sel.length;
          ta.focus();
        });
      }
      unsaved.value = true;
    };
    const fmtLine = (prefix) => {
      const ta = editorRef.value;
      if (!ta) return;
      const pos = ta.selectionStart;
      const start = currentContent.value.lastIndexOf("\n", pos - 1) + 1;
      const end = currentContent.value.indexOf("\n", pos);
      const lineEnd = end === -1 ? currentContent.value.length : end;
      const line = currentContent.value.substring(start, lineEnd);
      if (line.startsWith(prefix)) {
        currentContent.value =
          currentContent.value.substring(0, start) +
          line.slice(prefix.length) +
          currentContent.value.substring(lineEnd);
        nextTick(() => {
          ta.selectionStart = ta.selectionEnd = Math.max(
            start,
            pos - prefix.length,
          );
          ta.focus();
        });
      } else {
        currentContent.value =
          currentContent.value.substring(0, start) +
          prefix +
          line +
          currentContent.value.substring(lineEnd);
        nextTick(() => {
          ta.selectionStart = ta.selectionEnd = pos + prefix.length;
          ta.focus();
        });
      }
      unsaved.value = true;
    };
    const fmtBlock = (before, after) => {
      const ta = editorRef.value;
      if (!ta) return;
      const s = ta.selectionStart;
      const sel = currentContent.value.substring(s, ta.selectionEnd) || "code";
      currentContent.value =
        currentContent.value.substring(0, s) +
        before +
        sel +
        after +
        currentContent.value.substring(ta.selectionEnd);
      unsaved.value = true;
    };
    const insertLink = () => {
      const ta = editorRef.value;
      if (!ta) return;
      const sel = currentContent.value.substring(
        ta.selectionStart,
        ta.selectionEnd,
      );
      const url = prompt("URL:", "https://");
      if (!url) return;
      const text = sel || prompt("Link text:", "Link") || url;
      const ins = `[${text}](${url})`;
      const s = ta.selectionStart;
      currentContent.value =
        currentContent.value.substring(0, s) +
        ins +
        currentContent.value.substring(ta.selectionEnd);
      unsaved.value = true;
    };
    const insertTable = () => {
      const ta = editorRef.value;
      if (!ta) return;
      const s = ta.selectionStart;
      const tbl =
        "\n| Col 1 | Col 2 | Col 3 |\n|-------|-------|-------|\n| A     | B     | C     |\n";
      currentContent.value =
        currentContent.value.substring(0, s) +
        tbl +
        currentContent.value.substring(s);
      unsaved.value = true;
    };
    const insertMermaidSnippet = () => {
      const ta = editorRef.value;
      if (!ta) return;
      const s = ta.selectionStart;
      const d =
        "\n```mermaid\nflowchart LR\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Result]\n  B -->|No| D[Other]\n```\n";
      currentContent.value =
        currentContent.value.substring(0, s) +
        d +
        currentContent.value.substring(s);
      unsaved.value = true;
    };
    const insertMathSnippet = () => {
      const ta = editorRef.value;
      if (!ta) return;
      const s = ta.selectionStart;
      const m = "\n$$\n\\sum_{i=1}^{n} x_i = \\frac{n(n+1)}{2}\n$$\n";
      currentContent.value =
        currentContent.value.substring(0, s) +
        m +
        currentContent.value.substring(s);
      unsaved.value = true;
    };
    const insertImageFromLib = () => {
      if (images.value.length) showImgManager.value = true;
      else triggerImgUpload();
    };
    const doSelectAll = () => {
      editorRef.value?.select();
    };
    const doCopy = () => {
      const ta = editorRef.value;
      if (!ta) return;
      const sel = currentContent.value.substring(
        ta.selectionStart,
        ta.selectionEnd,
      );
      navigator.clipboard?.writeText(sel || currentContent.value);
      notify("Copied", "success", 1200);
    };
    const clearEditor = () => {
      if (confirm("Clear all content?")) {
        pushHistory(currentContent.value);
        currentContent.value = "";
        unsaved.value = true;
      }
    };

    /* ─── DARK MODE ─── */
    const toggleDark = () => {
      darkMode.value = !darkMode.value;
      document.documentElement.setAttribute(
        "data-theme",
        darkMode.value ? "dark" : "",
      );
      document.getElementById("hljs-theme").href = darkMode.value
        ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
        : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
      if (typeof mermaid !== "undefined") {
        mermaid.initialize({
          startOnLoad: false,
          theme: darkMode.value ? "dark" : "default",
          securityLevel: "loose",
        });
        setTimeout(renderMermaidInPreview, 100);
      }
    };

    /* ─── RESIZER ─── */
    let rsing = false,
      rsX = 0,
      rsW0 = 0;
    const startResize = (e) => {
      rsing = true;
      rsX = e.clientX;
      rsW0 = editorWidth.value;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
      document.getElementById("resizer").classList.add("dragging");
      const onMove = (ev) => {
        if (!rsing) return;
        editorWidth.value = Math.max(
          180,
          Math.min(rsW0 + (ev.clientX - rsX), window.innerWidth - 280),
        );
      };
      const onUp = () => {
        rsing = false;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        document.getElementById("resizer").classList.remove("dragging");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    /* ─── FILE UPLOAD ─── */
    const triggerMdUpload = () => mdFileInput.value?.click();
    const onMdFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const id = mkid();
        files.value.push({ id, name: file.name, content: ev.target.result });
        switchFile(id);
        notify(`Opened: ${file.name}`, "success");
      };
      reader.readAsText(file);
      e.target.value = "";
    };

    /* ─── IMAGES ─── */
    const triggerImgUpload = () => imgFileInput.value?.click();
    const openImgManager = () => {
      showImgManager.value = true;
    };
    const toggleImgSel = (id) => {
      const i = selectedImgs.value.indexOf(id);
      i === -1 ? selectedImgs.value.push(id) : selectedImgs.value.splice(i, 1);
    };
    const onImgUpload = (e) => {
      const fls = Array.from(e.target.files);
      let loaded = 0;
      fls.forEach((file) => {
        const rdr = new FileReader();
        rdr.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            images.value.push({
              id: mkid(),
              name: file.name,
              data: ev.target.result,
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
            loaded++;
            if (loaded === fls.length) {
              persist();
              notify(`${fls.length} image(s) uploaded`, "success");
            }
          };
          img.src = ev.target.result;
        };
        rdr.readAsDataURL(file);
      });
      e.target.value = "";
    };
    const deleteSelected = () => {
      images.value = images.value.filter(
        (i) => !selectedImgs.value.includes(i.id),
      );
      selectedImgs.value = [];
      persist();
      notify("Deleted", "info");
    };
    const insertSelected = () => {
      selectedImgs.value.forEach((id) => {
        const img = images.value.find((i) => i.id === id);
        if (img) insertOneImage(img);
      });
      selectedImgs.value = [];
      showImgManager.value = false;
    };
    const insertOneImage = (img) => {
      const ta = editorRef.value;
      const pos = ta ? ta.selectionStart : currentContent.value.length;
      const ins = `\n![${img.name}](${img.id})\n`;
      currentContent.value =
        currentContent.value.substring(0, pos) +
        ins +
        currentContent.value.substring(pos);
      unsaved.value = true;
      notify("Image inserted", "success", 1500);
    };
    const openResize = (img) => {
      resizeTgt.value = { ...img };
      resW.value = img.width;
      resH.value = img.height;
      showResize.value = true;
    };
    const onRW = () => {
      if (resLock.value && resizeTgt.value)
        resH.value = Math.round(
          resW.value * (resizeTgt.value.height / resizeTgt.value.width),
        );
    };
    const onRH = () => {
      if (resLock.value && resizeTgt.value)
        resW.value = Math.round(
          resH.value * (resizeTgt.value.width / resizeTgt.value.height),
        );
    };
    const applyResize = () => {
      const c = document.createElement("canvas");
      c.width = resW.value;
      c.height = resH.value;
      const ctx = c.getContext("2d");
      const img = new Image();
      img.src = resizeTgt.value.data;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, resW.value, resH.value);
        const nd = c.toDataURL("image/jpeg", resQ.value);
        const idx = images.value.findIndex((i) => i.id === resizeTgt.value.id);
        if (idx !== -1) {
          images.value[idx] = {
            ...images.value[idx],
            data: nd,
            width: resW.value,
            height: resH.value,
          };
          persist();
        }
        showResize.value = false;
        notify("Resized", "success");
      };
    };
    const openCrop = (img) => {
      cropTgt.value = { ...img };
      cropX.value = 0;
      cropY.value = 0;
      cropW.value = img.width;
      cropH.value = img.height;
      showCrop.value = true;
    };
    const initCropDisplay = () => {
      if (!cropImgRef.value || !cropTgt.value) return;
      cropScale.value = cropImgRef.value.offsetWidth / cropTgt.value.width;
    };
    const cropDisplayRect = computed(() => {
      if (!cropImgRef.value || !cropTgt.value || !cropWrapRef.value)
        return null;
      const s = cropScale.value;
      const ir = cropImgRef.value.getBoundingClientRect();
      const cr = cropWrapRef.value.getBoundingClientRect();
      return {
        left: ir.left - cr.left + cropX.value * s + "px",
        top: ir.top - cr.top + cropY.value * s + "px",
        width: Math.max(2, cropW.value * s) + "px",
        height: Math.max(2, cropH.value * s) + "px",
      };
    });
    const applyCropPreset = (p) => {
      if (!cropTgt.value) return;
      const { width: ow, height: oh } = cropTgt.value;
      const ratios = {
        "1:1": 1,
        "4:3": 4 / 3,
        "16:9": 16 / 9,
        "3:4": 3 / 4,
        "A4 portrait": 1 / Math.sqrt(2),
      };
      const ratio = ratios[p];
      if (!ratio) {
        cropX.value = 0;
        cropY.value = 0;
        cropW.value = ow;
        cropH.value = oh;
        return;
      }
      let w = ow,
        h = Math.round(ow / ratio);
      if (h > oh) {
        h = oh;
        w = Math.round(oh * ratio);
      }
      cropX.value = Math.round((ow - w) / 2);
      cropY.value = Math.round((oh - h) / 2);
      cropW.value = w;
      cropH.value = h;
    };
    const onCropMouseDown = (e) => {
      if (!cropImgRef.value) return;
      e.preventDefault();
      const ir = cropImgRef.value.getBoundingClientRect();
      const s = cropScale.value;
      const sx = (e.clientX - ir.left) / s,
        sy = (e.clientY - ir.top) / s;
      const onMove = (ev) => {
        const cx = (ev.clientX - ir.left) / s,
          cy = (ev.clientY - ir.top) / s;
        cropX.value = Math.max(0, Math.min(sx, cx));
        cropY.value = Math.max(0, Math.min(sy, cy));
        cropW.value = Math.abs(cx - sx);
        cropH.value = Math.abs(cy - sy);
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
    const applyCrop = () => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(cropW.value));
      c.height = Math.max(1, Math.round(cropH.value));
      const ctx = c.getContext("2d");
      const img = new Image();
      img.src = cropTgt.value.data;
      img.onload = () => {
        ctx.drawImage(
          img,
          cropX.value,
          cropY.value,
          cropW.value,
          cropH.value,
          0,
          0,
          c.width,
          c.height,
        );
        const nd = c.toDataURL("image/png");
        const idx = images.value.findIndex((i) => i.id === cropTgt.value.id);
        if (idx !== -1) {
          images.value[idx] = {
            ...images.value[idx],
            data: nd,
            width: c.width,
            height: c.height,
          };
          persist();
        }
        showCrop.value = false;
        notify("Cropped", "success");
      };
    };

    /* ─── TEMPLATES ─── */
    const openTemplates = () => {
      showTemplates.value = true;
    };
    const loadTemplate = (t) => {
      renderTheme.value = t.theme || "default";
      currentContent.value = t.content.replace(/\{\{date\}\}/g, today());
      unsaved.value = true;
      notify(`Template: ${t.name}`, "success");
    };
    const loadUserTemplate = (t) => {
      renderTheme.value = t.theme || "default";
      if (t.content) currentContent.value = t.content;
      unsaved.value = true;
      notify(`Template: ${t.name}`, "success");
    };
    const saveAsTheme = () => {
      showSaveTpl.value = true;
      newTplName.value = "";
      newTplDesc.value = "";
    };
    const saveAsUserTemplate = () => {
      if (!newTplName.value.trim()) {
        notify("Enter a name", "warn");
        return;
      }
      userTemplates.value.push({
        id: mkid(),
        name: newTplName.value.trim(),
        desc: newTplDesc.value.trim(),
        theme: renderTheme.value,
        content: tplInclude.value ? currentContent.value : "",
      });
      persist();
      showSaveTpl.value = false;
      notify("Template saved", "success");
    };
    const deleteUserTpl = (id) => {
      userTemplates.value = userTemplates.value.filter((t) => t.id !== id);
      persist();
    };

    /* ─── FIND/REPLACE ─── */
    const openFR = () => {
      showFR.value = true;
      frCount.value = null;
      nextTick(() => frFindRef.value?.focus());
    };
    const frBuildRe = () => {
      let pat = frFind.value;
      if (!frRegex.value) pat = pat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (frWhole.value) pat = `\\b${pat}\\b`;
      return new RegExp(pat, frCase.value ? "g" : "gi");
    };
    const frDoFind = () => {
      if (!frFind.value) return;
      try {
        const ms = currentContent.value.match(frBuildRe());
        frCount.value = ms ? ms.length : 0;
      } catch (e) {
        notify("Invalid regex", "error");
      }
    };
    const frReplaceOne = () => {
      if (!frFind.value) return;
      try {
        let p = frFind.value;
        if (!frRegex.value) p = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (frWhole.value) p = `\\b${p}\\b`;
        currentContent.value = currentContent.value.replace(
          new RegExp(p, frCase.value ? "" : "i"),
          frReplace.value,
        );
        unsaved.value = true;
        frDoFind();
      } catch (e) {
        notify("Invalid regex", "error");
      }
    };
    const frReplaceAll = () => {
      if (!frFind.value) return;
      try {
        const re = frBuildRe();
        const cnt = (currentContent.value.match(re) || []).length;
        currentContent.value = currentContent.value.replace(
          re,
          frReplace.value,
        );
        unsaved.value = true;
        frCount.value = 0;
        notify(`Replaced ${cnt} occurrence(s)`, "success");
      } catch (e) {
        notify("Invalid regex", "error");
      }
    };

    /* ─── STYLE RESET ─── */
    const resetStyle = () => {
      customFont.value = "";
      cFontSize.value = 16;
      cLineH.value = 1.7;
      cParaGap.value = 0.75;
      cWidth.value = 740;
      cPadH.value = 48;
      cPadV.value = 40;
      cColorText.value = "";
      cColorHead.value = "";
      cColorLink.value = "";
      cColorBg.value = "";
      cHeadFont.value = "";
      cH1.value = 2;
      cH2.value = 1.5;
      notify("Style reset", "info", 1500);
    };

    /* ─── EXPORT ─── */
    const openExport = () => {
      showExport.value = true;
      showPdfSettings.value = false;
      exportTitle.value =
        activeFile.value?.name?.replace(/\.\w+$/, "") || "Document";
    };
    const dlBlob = (blob, name) => {
      const u = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = u;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(u), 1000);
    };
    const fname = (ext) =>
      (activeFile.value?.name?.replace(/\.\w+$/, "") || "document") + "." + ext;
    const copyHtml = () => {
      navigator.clipboard?.writeText(renderedHtml.value);
      notify("HTML copied", "success", 1500);
    };
    const copyText = () => {
      const d = document.createElement("div");
      d.innerHTML = renderedHtml.value;
      navigator.clipboard?.writeText(d.textContent || "");
      notify("Text copied", "success", 1500);
    };
    const exportMarkdown = () => {
      dlBlob(
        new Blob([currentContent.value], { type: "text/markdown" }),
        fname("md"),
      );
      notify("Markdown exported", "success");
    };
    const exportTxt = () => {
      const d = document.createElement("div");
      d.innerHTML = renderedHtml.value;
      dlBlob(
        new Blob([d.textContent || ""], { type: "text/plain" }),
        fname("txt"),
      );
      notify("Text exported", "success");
    };
    const exportJSON = () => {
      dlBlob(
        new Blob(
          [
            JSON.stringify(
              {
                title: exportTitle.value,
                author: exportAuthor.value,
                keywords: exportKeywords.value,
                date: exportDate.value,
                theme: renderTheme.value,
                content: currentContent.value,
                wordCount: wordCount.value,
                exported: new Date().toISOString(),
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
        fname("json"),
      );
      notify("JSON exported", "success");
    };
    const exportHTML = () => {
      let allStyles = "";
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules || [])
            allStyles += rule.cssText + "\n";
        } catch (e) {}
      }
      const doc = `<!DOCTYPE html>\n<html lang="en" data-theme="${darkMode.value ? "dark" : ""}">\n<head>\n<meta charset="UTF-8"/><title>${exportTitle.value || "Document"}</title>\n<link rel="preconnect" href="https://fonts.googleapis.com"/>\n<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,400&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&family=Raleway:wght@300;400;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${darkMode.value ? "github-dark" : "github"}.min.css"/>\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"/>\n<style>\n${allStyles}\nbody{background:var(--bg1)}\n</style>\n</head>\n<body>\n<div id="preview-page" class="md-body theme-${renderTheme.value}" style="${Object.entries(
        previewPageStyle.value,
      )
        .map(
          ([k, v]) =>
            k.replace(/([A-Z])/g, (m) => "-" + m.toLowerCase()) + ":" + v,
        )
        .join(
          ";",
        )}">\n${renderedHtml.value}\n</div>\n<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>\n<script>mermaid.initialize({startOnLoad:true,theme:'${darkMode.value ? "dark" : "default"}',securityLevel:'loose'});<\/script>\n</body>\n</html>`;
      dlBlob(new Blob([doc], { type: "text/html" }), fname("html"));
      notify("HTML exported", "success");
    };
    const exportDocx = () => {
      const wh = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset="UTF-8"/><title>${exportTitle.value}</title><style>@page{margin:2cm 2.5cm}body{font-family:Calibri,sans-serif;font-size:12pt;line-height:1.6}h1{font-size:22pt}h2{font-size:16pt}h3{font-size:13pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:5pt}th{background:#e8e8e8;font-weight:bold}code,pre{font-family:Courier New,monospace;background:#f0f0f0}blockquote{margin-left:18pt;border-left:3px solid #ccc;padding-left:9pt;color:#555}</style></head><body>${renderedHtml.value}</body></html>`;
      dlBlob(
        new Blob(["\ufeff" + wh], { type: "application/msword" }),
        fname("doc"),
      );
      notify("Word exported", "success");
    };
    const exportPDF = () => {
      showExport.value = false;
      const marginMap = {
        normal: "2cm",
        narrow: "1cm",
        wide: "3cm",
        none: "0",
      };
      const el = document.createElement("style");
      el.id = "pdf-print-override";
      el.textContent = `@page{size:${pdfPaperSize.value} ${pdfOrientation.value};margin:${marginMap[pdfMargins.value] || "2cm"}}@media print{html,body{height:auto!important;overflow:visible!important}#vue-root,#app-body,#main,#preview-pane,#preview-scroller{overflow:visible!important;height:auto!important;display:block!important}#topbar,#statusbar,#sidebar,#editor-pane,#resizer,.pane-toolbar,#ctx-menu,#notif-area,.style-panel,.focus-toolbar,#style-panel-wrap{display:none!important}#preview-pane{display:block!important;border:none!important;overflow:visible!important}#preview-scroller{overflow:visible!important;height:auto!important}#preview-page{max-width:100%!important;padding:0!important;margin:0!important;min-height:0!important;background:white!important;zoom:${pdfScale.value}%}${!pdfBg.value ? "*{background:transparent!important;box-shadow:none!important}" : ""}}`;
      document.head.appendChild(el);
      notify("Opening print dialog… All pages included", "info");
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          const rem = document.getElementById("pdf-print-override");
          if (rem) rem.remove();
        }, 2000);
      }, 400);
    };
    const exportSingle = (id) => {
      const f = files.value.find((f) => f.id === id);
      if (!f) return;
      dlBlob(
        new Blob(
          [id === activeFileId.value ? currentContent.value : f.content],
          { type: "text/markdown" },
        ),
        f.name,
      );
      notify("Downloaded", "success", 1500);
    };

    /* ─── CTX MENU ─── */
    const openEditorCtx = (e) => {
      e.preventDefault();
      posCtx(e, { type: "editor" });
    };
    const openPreviewCtx = (e) => {
      e.preventDefault();
      posCtx(e, { type: "preview" });
    };
    const openFileCtx = (e, f) => {
      e.preventDefault();
      posCtx(e, { type: "file", fileId: f.id });
    };
    const posCtx = (e, extra) => {
      closeCtx();
      const x = Math.min(e.clientX, window.innerWidth - 210);
      const y = Math.min(e.clientY, window.innerHeight - 380);
      ctxMenu.value = { show: true, x, y, ...extra };
      const close = (ev) => {
        if (!ev.target.closest("#ctx-menu")) {
          closeCtx();
          document.removeEventListener("click", close);
        }
      };
      nextTick(() => document.addEventListener("click", close));
    };
    const closeCtx = () => {
      ctxMenu.value.show = false;
    };

    const scrollToHeading = (slug) => {
      nextTick(() => {
        const el = document
          .getElementById("preview-scroller")
          ?.querySelector(`#${slug}`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    const onGlobalKey = (e) => {
      if (e.key === "Escape") {
        if (focusMode.value) {
          focusMode.value = false;
          return;
        }
        closeCtx();
        if (blockTypeMenuOpen.value) blockTypeMenuOpen.value = false;
      }
      if (e.key === "F11") {
        e.preventDefault();
        focusMode.value = !focusMode.value;
      }
    };

    let autoSaveTimer = null;
    watch(currentContent, () => {
      unsaved.value = true;
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        if (activeFileId.value) {
          const af = files.value.find((f) => f.id === activeFileId.value);
          if (af) af.content = currentContent.value;
        }
        persist();
      }, 6000);
    });

    onMounted(async () => {
      const ok = hydrate();
      if (!ok) {
        const id = mkid();
        files.value = [{ id, name: "welcome.md", content: DEMO_MD }];
        activeFileId.value = id;
        currentContent.value = DEMO_MD;
      }
      if (darkMode.value) {
        document.documentElement.setAttribute("data-theme", "dark");
        document.getElementById("hljs-theme").href =
          "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";
      }
      document.addEventListener("keydown", onGlobalKey);
      if (typeof mermaid !== "undefined") {
        mermaid.initialize({
          startOnLoad: false,
          theme: darkMode.value ? "dark" : "default",
          securityLevel: "loose",
        });
        setTimeout(renderMermaidInPreview, 300);
      }
    });

    return {
      darkMode,
      sidebarOpen,
      viewMode,
      focusMode,
      wordWrap,
      unsaved,
      showStylePanel,
      activePanel,
      files,
      activeFileId,
      currentContent,
      activeFile,
      renamingFile,
      renameVal,
      renameInputRef,
      editorRef,
      editorFontSize,
      editorLineHeight,
      editorWidth,
      mdFileInput,
      renderTheme,
      renderThemes,
      currentThemeName,
      customFont,
      cFontSize,
      cLineH,
      cParaGap,
      cWidth,
      cPadH,
      cPadV,
      cColorText,
      cColorHead,
      cColorLink,
      cColorBg,
      cHeadFont,
      cH1,
      cH2,
      fontChoices,
      previewPageStyle,
      blocks,
      blockTypeMenuOpen,
      blockTypeMenuTarget,
      blockTypeMenuPos,
      blockTypeSearch,
      filteredBlockTypes,
      editingBlockIdx,
      images,
      selectedImgs,
      imgFileInput,
      showImgManager,
      showResize,
      showCrop,
      resizeTgt,
      resW,
      resH,
      resLock,
      resQ,
      cropTgt,
      cropX,
      cropY,
      cropW,
      cropH,
      cropWrapRef,
      cropImgRef,
      cropDisplayRect,
      cropPresets,
      showExport,
      showPdfSettings,
      exportTitle,
      exportAuthor,
      exportKeywords,
      exportDate,
      pdfPaperSize,
      pdfOrientation,
      pdfMargins,
      pdfScale,
      pdfBg,
      TEMPLATES,
      userTemplates,
      showTemplates,
      tplTab,
      showSaveTpl,
      newTplName,
      newTplDesc,
      tplInclude,
      showFR,
      frFind,
      frReplace,
      frCase,
      frRegex,
      frWhole,
      frCount,
      frFindRef,
      showLatex,
      latexInput,
      latexMode,
      latexCat,
      latexRendered,
      latexTemplates,
      LATEX_CATS,
      showMermaid,
      mermaidCode,
      mermaidDiagramType,
      mermaidRendered,
      mermaidError,
      MERMAID_TEMPLATES,
      ctxMenu,
      showShortcuts,
      shortcuts,
      wordCount,
      charCount,
      lineCount,
      readTime,
      headings,
      renderedHtml,
      notifications,
      BLOCK_TYPES,
      newFile,
      switchFile,
      deleteFile,
      duplicateFile,
      saveFile,
      startRename,
      startRenameById,
      finishRename,
      undo,
      redo,
      onInput,
      onEditorKeydown,
      fmt,
      fmtLine,
      fmtBlock,
      insertLink,
      insertTable,
      insertMermaidSnippet,
      insertMathSnippet,
      insertImageFromLib,
      doSelectAll,
      doCopy,
      clearEditor,
      toggleDark,
      startResize,
      triggerMdUpload,
      onMdFileUpload,
      openImgManager,
      triggerImgUpload,
      toggleImgSel,
      onImgUpload,
      deleteSelected,
      insertSelected,
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
      loadUserTemplate,
      saveAsTheme,
      saveAsUserTemplate,
      deleteUserTpl,
      openFR,
      frDoFind,
      frReplaceOne,
      frReplaceAll,
      resetStyle,
      copyHtml,
      copyText,
      openExport,
      exportMarkdown,
      exportTxt,
      exportJSON,
      exportHTML,
      exportDocx,
      exportPDF,
      exportSingle,
      notify,
      openEditorCtx,
      openPreviewCtx,
      openFileCtx,
      closeCtx,
      scrollToHeading,
      parseBlocks,
      blocksToContent,
      addBlock,
      deleteBlock,
      duplicateBlock,
      moveBlock,
      openBlockTypeMenu,
      onBlockDragStart,
      onBlockDragOver,
      onBlockDrop,
      onBlockDragEnd,
      insertLatexSym,
      onLatexInputChange,
      onLatexKeyUp,
      insertLatexToEditor,
      openLatexBuilder,
      openMermaidBuilder,
      loadMermaidTemplate,
      insertMermaidToEditor,
      renderMermaidPreview,
    };
  },
});
appInstance.mount("#vue-root");
