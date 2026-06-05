const DEMO_MD = `# Welcome to Markdown Studio ✦

## Features: Mermaid · LaTeX · Drag Blocks · 16 Themes

---

### Mermaid Diagram

\`\`\`mermaid
flowchart LR
  A([Start]) --> B{Is it\nmarkdown?}
  B -->|Yes| C[Render it]
  B -->|No| D[Plain text]
  C --> E([Output])
  D --> E
\`\`\`

### Sequence Diagram

\`\`\`mermaid
sequenceDiagram
  participant U as User
  participant E as Editor
  participant P as Preview
  U->>E: Types markdown
  E->>P: Live render
  P-->>U: Beautiful output
\`\`\`

### LaTeX — Inline & Block

Einstein's famous equation: $E = mc^2$

Maxwell's equations in integral form:

$$\oint_{\partial \Omega} \mathbf{E} \cdot d\mathbf{A} = \frac{Q_{\text{enc}}}{\varepsilon_0}$$

The quadratic formula: $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

Euler's identity: $e^{i\pi} + 1 = 0$

### Code Highlight

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n terms."""
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]
\`\`\`

### Table

| Theme | Style | Best for |
|-------|-------|----------|
| Research | Serif, indented | Academic papers |
| IEEE | Two-column | Engineering journals |
| APA | Double-spaced | Social sciences |
| HBS | Crimson red | Business cases |
| Medical | Clinical green | Health reports |
| Legal | Justified serif | Contracts |
| Startup | Dark gradient | Pitch decks |
| Newspaper | Three-column | News layouts |
| Book | Baskerville | Long-form prose |

> **Tip:** Switch themes from the dropdown. Right-click for context menu. Use the block editor tab for drag-and-drop paragraphs.
`

const TEMPLATES = [
  {id:'research',name:'Research Paper',icon:'ti-school',desc:'Academic — citations',theme:'research',content:`# Paper Title\n\n**Author** · Institution · {{date}}\n\n---\n\n## Abstract\n\nWrite abstract here.\n\n## 1. Introduction\n\nIntroduce your research.\n\n## 2. Methodology\n\nDescribe methods.\n\n## 3. Results\n\nPresent findings.\n\n| Variable | Group A | Group B | p-value |\n|----------|---------|---------|--------|\n| Metric   | 0.82    | 0.76    | 0.03   |\n\n## 4. Discussion\n\nInterpret results.\n\n## 5. Conclusion\n\nSummarize contributions.\n\n## References\n\n1. Author, A. (Year). *Title*. Journal.\n`},
  {id:'ieee',name:'IEEE Paper',icon:'ti-cpu',desc:'Engineering journal',theme:'ieee',content:`# Title of the Paper\n\n<div class="author-block">Author One, Author Two · Department, University · email@example.com</div>\n\n---\n\n## Abstract\n\nThis paper presents …\n\n**Keywords:** keyword1, keyword2, keyword3\n\n## I. Introduction\n\nIntroduction text.\n\n## II. Related Work\n\nPrior art review.\n\n## III. Methodology\n\nDescribe the approach.\n\n## IV. Results\n\nPresent evaluation.\n\n## V. Conclusion\n\nConclusion text.\n\n## References\n\n[1] A. Author, "Title," *Journal*, vol. 1, pp. 1–10, {{date}}.\n`},
  {id:'apa',name:'APA Style',icon:'ti-notes',desc:'Social sciences',theme:'apa',content:`# Running Head: SHORT TITLE\n\n# Full Title of the Paper\n\nAuthor Name\n\nInstitution\n\n---\n\n## Abstract\n\nAbstract text (150–250 words).\n\n*Keywords:* keyword1, keyword2\n\n## Introduction\n\nIntroduction paragraph.\n\n## Method\n\n### Participants\n\nParticipant description.\n\n### Procedure\n\nProcedure description.\n\n## Results\n\nResults narrative.\n\n## Discussion\n\nDiscussion and implications.\n\n## References\n\nAuthor, A. A., & Author, B. B. ({{date}}). *Title of work*. Publisher.\n`},
  {id:'cv',name:'Professional CV',icon:'ti-id-badge',desc:'Resume / CV',theme:'cv',content:`# Your Name\n\n> email@example.com · +1 234 567 8900 · City, Country\n\n## Profile\n\nResults-driven professional with X years in [field].\n\n## Experience\n\n### Senior Role · Company Name\n#### Jan 2022 – Present\n\n- Achieved [result] by implementing [solution]\n- Led team of X to deliver [project]\n\n### Previous Role · Previous Company\n#### Jan 2020 – Dec 2021\n\n- Key accomplishment 1\n- Key accomplishment 2\n\n## Education\n\n### Degree Name · University\n#### 2016 – 2020\n\n## Skills\n\n**Technical:** Skill 1 · Skill 2 · Skill 3\n\n**Languages:** English (Native) · French (Professional)\n`},
  {id:'legal',name:'Legal Document',icon:'ti-gavel',desc:'Contracts & law',theme:'legal',content:`# CONTRACT AGREEMENT\n\n**Effective Date:** {{date}}\n\n**Between:** Party A ("Client") and Party B ("Provider")\n\n---\n\n## 1. DEFINITIONS\n\nFor purposes of this Agreement:\n\n- **"Services"** means the professional services described herein.\n- **"Deliverables"** means all work product created under this Agreement.\n\n## 2. SCOPE OF SERVICES\n\nProvider agrees to perform the following services:\n\n1. Service description one\n2. Service description two\n\n## 3. COMPENSATION\n\nClient shall pay Provider the sum of $[AMOUNT].\n\n## 4. TERM AND TERMINATION\n\nThis Agreement commences on the Effective Date and continues until completion.\n\n## 5. GOVERNING LAW\n\nThis Agreement shall be governed by the laws of [Jurisdiction].\n\n---\n\n**Signatures:**\n\n| Party A | Party B |\n|---------|--------|\n| _______ | _______ |\n`},
  {id:'medical',name:'Clinical Report',icon:'ti-stethoscope',desc:'Medical / health',theme:'medical',content:`# Clinical Case Report\n\n**Institution:** Hospital / Clinic Name\n**Date:** {{date}}\n**Physician:** Dr. Name\n\n---\n\n## Patient Information\n\n| Field | Details |\n|-------|--------|\n| Age / Sex | 45 / M |\n| Chief Complaint | Presenting symptom |\n| Duration | X days |\n\n## History of Present Illness\n\nNarrative of illness onset and progression.\n\n## Physical Examination\n\n- **Vital Signs:** BP 120/80, HR 72, T 98.6°F\n- **General:** Alert and oriented ×3\n- **Relevant finding:** Description\n\n## Assessment & Plan\n\n> **Diagnosis:** Primary diagnosis\n\n1. Treatment step one\n2. Treatment step two\n\n## Follow-up\n\nScheduled for follow-up in X weeks.\n`},
  {id:'hbs',name:'Business Case',icon:'ti-briefcase',desc:'HBS case study',theme:'hbs',content:`# Company Name: Situation Title\n\n**Harvard Business School Case** · Prepared by Author · {{date}}\n\n---\n\n## Executive Summary\n\nBrief overview of the situation and key decision.\n\n## Background\n\nCompany background and industry context.\n\n## The Situation\n\nDetailed description of the business challenge.\n\n## Key Issues\n\n1. **Issue One** — Description and implications\n2. **Issue Two** — Description and implications\n3. **Issue Three** — Description and implications\n\n## Financial Overview\n\n| Metric | FY2022 | FY2023 | FY2024E |\n|--------|--------|--------|--------|\n| Revenue | $100M | $120M | $145M |\n| EBITDA | $20M | $26M | $33M |\n\n## Options\n\n### Option A: Description\n\nPros and cons.\n\n### Option B: Description\n\nPros and cons.\n\n## Recommendation\n\nRecommended course of action with rationale.\n`},
  {id:'startup',name:'Pitch Deck',icon:'ti-rocket',desc:'Startup pitch prose',theme:'startup',content:`# Company Name\n\n> *Tagline — One sentence that captures the vision*\n\n---\n\n## The Problem\n\nDescribe the pain point. Make it visceral. Who suffers and how much?\n\n## Our Solution\n\nHow you solve it. Simple, clear, compelling.\n\n## Market Opportunity\n\n- **TAM:** $X billion total addressable market\n- **SAM:** $X billion serviceable market\n- **SOM:** $X million realistic target\n\n## Traction\n\n| Metric | Value |\n|--------|-------|\n| MRR | $X,XXX |\n| Users | X,XXX |\n| Growth | X% MoM |\n\n## Business Model\n\nHow you make money.\n\n## Team\n\n| Name | Role | Background |\n|------|------|------------|\n| Founder | CEO | Previously at … |\n\n## The Ask\n\nRaising **$XM** to achieve [milestone] in [timeframe].\n`},
  {id:'book',name:'Book Chapter',icon:'ti-book',desc:'Long-form prose',theme:'book',content:`# Chapter One\n\n## The Beginning of Everything\n\nIt was on a Tuesday, unremarkable in every outward way, that everything changed. The morning light came through the curtains at the usual angle, landing on the same worn patch of floorboard it had touched for twenty years.\n\nShe had not expected to find the letter. Nobody ever expects the letter that changes them.\n\n---\n\nThe town of Millhaven sat between two hills like something forgotten, the kind of place where strangers were noticed and gossip traveled faster than truth. She had lived there all her life without ever quite feeling she belonged.\n\n> *"We carry our histories with us,"* her grandmother had said once, *"the way rivers carry silt—invisibly, until the water clears."*\n\nIt was not until she held the paper in her hands that she understood what that meant.\n`},
  {id:'newspaper',name:'Newspaper',icon:'ti-news',desc:'Multi-column news',theme:'newspaper',content:`# BREAKING: Major Development Reshapes Industry\n\n*By Staff Reporter* · Published {{date}}\n\nIn a development that analysts are calling transformative, industry leaders announced today that significant changes would be implemented across the sector beginning next quarter.\n\nThe announcement, made at a press conference in the capital, drew reactions from across the political spectrum and set off a wave of speculation about long-term implications.\n\n## Experts Weigh In\n\nLeading analysts offered mixed assessments of the news.\n\n"This is unprecedented," said Dr. Jane Smith of the Institute for Policy Studies. "We haven't seen anything like it since the reforms of 2015."\n\nOthers were more cautious in their assessment.\n\n## Market Reaction\n\nFinancial markets reacted sharply to the announcement, with major indices moving significantly in early trading.\n\n| Index | Change | Volume |\n|-------|--------|--------|\n| Main | +2.3% | High |\n| Tech | +3.1% | Very High |\n\n## What Comes Next\n\nObservers will be watching closely for further developments in the coming weeks as the situation continues to unfold.\n`},
  {id:'technical',name:'Tech Docs',icon:'ti-code',desc:'API / README',theme:'technical',content:`# Project Name\n\nBrief one-line description.\n\n## Installation\n\n\`\`\`bash\nnpm install your-package\n\`\`\`\n\n## Quick Start\n\n\`\`\`javascript\nimport { create } from 'your-package';\nconst instance = create({ option: 'value' });\nawait instance.run();\n\`\`\`\n\n## API Reference\n\n### \`create(options)\`\n\n| Parameter | Type | Default | Description |\n|-----------|------|---------|-------------|\n| \`option\` | string | 'default' | Option desc |\n\n**Returns:** \`Promise<Instance>\`\n\n> **Note:** Always initialize before calling run().\n\n## License\n\nMIT © Your Name\n`},
  {id:'meeting',name:'Meeting Notes',icon:'ti-notes',desc:'Minutes & actions',theme:'default',content:`# Meeting Notes\n\n**Date:** {{date}}  \n**Facilitator:** Name  \n**Location:** Room / Link\n\n## Attendees\n\n- Person One (Role)\n- Person Two (Role)\n\n## Agenda & Discussion\n\n### Item 1: Topic\n\nDiscussion summary. **Decision:** What was decided.\n\n### Item 2: Topic\n\nDiscussion summary. **Decision:** What was decided.\n\n## Action Items\n\n| Task | Owner | Due |\n|------|-------|-----|\n| Task description | Person | Date |\n\n## Next Meeting\n\n**Date:** ___________\n`},
  {id:'minimal',name:'Minimal Note',icon:'ti-note',desc:'Clean blank canvas',theme:'minimal',content:`# Title\n\nWrite here…\n`},
  {id:'editorial',name:'Editorial',icon:'ti-feather',desc:'Magazine / article',theme:'editorial',content:`# The Headline That Captures Attention\n\n### Section · Kicker Label\n\n*By Author Name · Publication · {{date}}*\n\n---\n\nThe opening paragraph should draw readers in with a compelling hook — a striking fact, an anecdote, or a provocative question.\n\nThe second paragraph builds on the hook, providing context and narrative momentum.\n\n> The most powerful sentence is often the simplest one.\n\n## Developing the Story\n\nHere you develop the main argument. Great editorial writing balances narrative with factual grounding. Each paragraph should pull the reader forward.\n\n## Conclusion\n\nEnd with impact. Circle back to the opening or land on a note that resonates.\n\n---\n\n*Author Name is a [title] at [publication].*\n`},
  {id:'latex',name:'LaTeX Style',icon:'ti-math-function',desc:'Math / theory',theme:'latex',content:`# Document Title\n\n**Author One** and **Author Two**\n\n*Department of Mathematics*\n\n---\n\n## Abstract\n\nThis document demonstrates LaTeX-inspired rendering suitable for mathematical writing.\n\n## 1. Introduction\n\nLet $G = (V, E)$ be a graph. We say that $S \\subseteq V$ is *independent* if no two vertices in $S$ are adjacent.\n\n**Theorem 1.1.** *Every planar graph is four-colorable.*\n\n## 2. Main Result\n\n$$\\sum_{i=1}^{n} x_i^2 \\geq \\frac{1}{n}\\left(\\sum_{i=1}^{n} x_i\\right)^2$$\n\nThis follows from Cauchy–Schwarz. $\\square$\n\n## References\n\n[1] Appel, K. and Haken, W. (1976). Every planar map is four colorable. *Bull. Amer. Math. Soc.*\n`},
];

const BLOCK_TYPES = [
  {type:'paragraph',label:'Paragraph',icon:'ti-align-left',placeholder:'Write a paragraph…'},
  {type:'heading1',label:'Heading 1',icon:'ti-h-1',placeholder:'Heading 1'},
  {type:'heading2',label:'Heading 2',icon:'ti-h-2',placeholder:'Heading 2'},
  {type:'heading3',label:'Heading 3',icon:'ti-h-3',placeholder:'Heading 3'},
  {type:'bullet',label:'Bullet List',icon:'ti-list',placeholder:'- Item'},
  {type:'numbered',label:'Numbered List',icon:'ti-list-numbers',placeholder:'1. Item'},
  {type:'blockquote',label:'Quote',icon:'ti-blockquote',placeholder:'> Quotation…'},
  {type:'code',label:'Code Block',icon:'ti-code',placeholder:'```language\ncode here\n```'},
  {type:'mermaid',label:'Mermaid Diagram',icon:'ti-topology-star',placeholder:'```mermaid\nflowchart LR\n  A --> B\n```'},
  {type:'math',label:'Math / LaTeX',icon:'ti-math-function',placeholder:'$$\n\\sum_{i=0}^{n} x_i\n$$'},
  {type:'table',label:'Table',icon:'ti-table',placeholder:'| Col 1 | Col 2 |\n|-------|-------|\n| A     | B     |'},
  {type:'divider',label:'Divider',icon:'ti-minus',placeholder:'---'},
  {type:'image',label:'Image',icon:'ti-photo',placeholder:'![alt](url)'},
];

const {createApp,ref,computed,watch,onMounted,nextTick} = Vue;

/* ── helpers ── */
const mkid = () => Math.random().toString(36).slice(2,9);
const today = () => new Date().toLocaleDateString();

app = createApp({
setup() {
  /* ─── ui state ─── */
  const darkMode = ref(false);
  const sidebarOpen = ref(true);
  const viewMode = ref('split'); // split | editor | preview
  const editorMode = ref('text'); // text | blocks
  const focusMode = ref(false);
  const wordWrap = ref(true);
  const unsaved = ref(false);
  const showStylePanel = ref(false);

  /* ─── files ─── */
  const files = ref([]);
  const activeFileId = ref(null);
  const currentContent = ref(DEMO_MD);
  const renamingFile = ref(false);
  const renameVal = ref('');
  const renameInputRef = ref(null);
  const renamingId = ref(null);

  /* ─── editor ─── */
  const editorRef = ref(null);
  const editorFontSize = ref(13);
  const editorLineHeight = ref(1.75);
  const editorWidth = ref(500);
  const mdFileInput = ref(null);

  /* ─── undo/redo ─── */
  const undoStack = ref([]);
  const redoStack = ref([]);
  let skipHistory = false;

  /* ─── blocks (drag-and-drop editor) ─── */
  const blocks = ref([]);
  const blockPickerOpen = ref(false);
  const blockPickerIdx = ref(-1);
  const blockPickerPos = ref({x:0,y:0});
  let dragSrcIdx = -1;
  let dragOverIdx = -1;
  let dragOverSide = ''; // top | bottom

  /* ─── render ─── */
  const renderTheme = ref('default');
  const renderThemes = [
    {id:'default',name:'Clean Article'},
    {id:'research',name:'Research Paper'},
    {id:'scientific',name:'Scientific Report'},
    {id:'ieee',name:'IEEE / Engineering'},
    {id:'apa',name:'APA Style'},
    {id:'cv',name:'Professional CV'},
    {id:'latex',name:'LaTeX Style'},
    {id:'hbs',name:'Harvard Business'},
    {id:'legal',name:'Legal Document'},
    {id:'medical',name:'Medical / Clinical'},
    {id:'startup',name:'Startup / Pitch'},
    {id:'editorial',name:'Editorial Magazine'},
    {id:'technical',name:'Technical Docs'},
    {id:'book',name:'Book / Novel'},
    {id:'newspaper',name:'Newspaper'},
    {id:'minimal',name:'Minimal'},
  ];
  const currentThemeName = computed(() => renderThemes.find(t=>t.id===renderTheme.value)?.name||'');

  /* ─── style panel ─── */
  const customFont = ref('');
  const cFontSize = ref(16);
  const cLineH = ref(1.7);
  const cParaGap = ref(0.75);
  const cWidth = ref(740);
  const cPadH = ref(48);
  const cPadV = ref(40);
  const cColorText = ref('');
  const cColorHead = ref('');
  const cColorLink = ref('');
  const cColorBg = ref('');
  const cHeadFont = ref('');
  const cH1 = ref(2);
  const cH2 = ref(1.5);
  const fontChoices = [
    {name:'DM Sans',val:"'DM Sans',sans-serif"},
    {name:'IBM Plex',val:"'IBM Plex Sans',sans-serif"},
    {name:'Raleway',val:"'Raleway',sans-serif"},
    {name:'Crimson',val:"'Crimson Pro',serif"},
    {name:'Src Serif',val:"'Source Serif 4',serif"},
    {name:'Playfair',val:"'Playfair Display',serif"},
    {name:'Georgia',val:"Georgia,serif"},
    {name:'Space Mono',val:"'Space Mono',monospace"},
  ];
  const previewPageStyle = computed(() => {
    const s = {};
    if (customFont.value) s.fontFamily = customFont.value;
    if (cFontSize.value !== 16) s.fontSize = cFontSize.value + 'px';
    if (cLineH.value !== 1.7) s.lineHeight = cLineH.value;
    if (cColorText.value) s.color = cColorText.value;
    if (cColorBg.value) s.background = cColorBg.value;
    s.maxWidth = cWidth.value + 'px';
    s.paddingLeft = cPadH.value + 'px';
    s.paddingRight = cPadH.value + 'px';
    s.paddingTop = cPadV.value + 'px';
    s.paddingBottom = (cPadV.value + 40) + 'px';
    return s;
  });

  /* ─── images ─── */
  const images = ref([]);
  const selectedImgs = ref([]);
  const imgFileInput = ref(null);
  const showImgManager = ref(false);
  const showResize = ref(false);
  const showCrop = ref(false);
  const resizeTgt = ref(null);
  const resW = ref(0), resH = ref(0), resLock = ref(true), resQ = ref(.92);
  const cropTgt = ref(null);
  const cropX = ref(0), cropY = ref(0), cropW = ref(0), cropH = ref(0);
  const cropWrapRef = ref(null), cropImgRef = ref(null);
  const cropScale = ref(1);
  const cropPresets = ['Free','1:1','4:3','16:9','3:4','A4 portrait'];

  /* ─── export ─── */
  const showExport = ref(false);
  const showPdfSettings = ref(false);
  const exportTitle = ref('');
  const exportAuthor = ref('');
  const exportKeywords = ref('');
  const exportDate = ref(new Date().toISOString().slice(0,10));
  const pdfPaperSize = ref('A4');
  const pdfOrientation = ref('portrait');
  const pdfMargins = ref('normal');
  const pdfScale = ref('100');
  const pdfBg = ref(true);

  /* ─── templates ─── */
  const userTemplates = ref([]);
  const showTemplates = ref(false);
  const tplTab = ref('builtin');
  const showSaveTpl = ref(false);
  const newTplName = ref('');
  const newTplDesc = ref('');
  const tplInclude = ref(true);

  /* ─── find/replace ─── */
  const showFR = ref(false);
  const frFind = ref('');
  const frReplace = ref('');
  const frCase = ref(false);
  const frRegex = ref(false);
  const frWhole = ref(false);
  const frCount = ref(null);
  const frFindRef = ref(null);

  /* ─── context menu ─── */
  const ctxMenu = ref({show:false, x:0, y:0, type:'editor', fileId:null});

  /* ─── shortcuts modal ─── */
  const showShortcuts = ref(false);
  const shortcuts = [
    {key:'Ctrl+S',desc:'Save'},{key:'Ctrl+N',desc:'New file'},
    {key:'Ctrl+B',desc:'Bold'},{key:'Ctrl+I',desc:'Italic'},
    {key:'Ctrl+H',desc:'Find & Replace'},{key:'Ctrl+Z',desc:'Undo'},
    {key:'Ctrl+Y',desc:'Redo'},{key:'Ctrl+D',desc:'Duplicate line'},
    {key:'Tab',desc:'Indent / autocomplete'},{key:'Shift+Tab',desc:'Outdent'},
    {key:'Ctrl+Shift+F',desc:'Focus mode'},{key:'F11',desc:'Fullscreen'},
    {key:'Esc',desc:'Close modal / exit focus'},
  ];

  /* ─── notifications ─── */
  const notifications = ref([]);
  let nid = 0;
  const notify = (msg, type='info', dur=2800) => {
    const id = ++nid;
    notifications.value.push({id, msg, type});
    setTimeout(() => { notifications.value = notifications.value.filter(n=>n.id!==id); }, dur);
  };

  /* ════════════ COMPUTED ════════════ */
  const activeFile = computed(() => files.value.find(f=>f.id===activeFileId.value));
  const wordCount = computed(() => { const t=currentContent.value.trim(); return t ? t.split(/\s+/).length : 0; });
  const charCount = computed(() => currentContent.value.length);
  const lineCount = computed(() => currentContent.value.split('\n').length);
  const readTime = computed(() => Math.max(1, Math.ceil(wordCount.value/200)));

  const headings = computed(() => {
    const re = /^(#{1,6})\s+(.+)$/gm;
    const out = []; let m;
    while ((m=re.exec(currentContent.value)) !== null) {
      const text = m[2].replace(/[*_`]/g,'').trim();
      const slug = text.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');
      out.push({level:m[1].length, text, slug});
    }
    return out;
  });

  /* ─── Marked renderer with Mermaid + KaTeX hooks ─── */
  const buildRenderer = () => {
    const r = new marked.Renderer();
    r.heading = (text, level) => {
      const slug = text.replace(/<[^>]*>/g,'').toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');
      return `<h${level} id="${slug}">${text}</h${level}>`;
    };
    r.code = (code, lang) => {
      if (lang === 'mermaid') {
        const id = 'mm-' + mkid();
        return `<div class="mermaid-block" id="${id}" data-mermaid="${encodeURIComponent(code)}"><div class="mermaid">${code}</div></div>`;
      }
      let highlighted = code;
      if (lang && hljs.getLanguage(lang)) {
        try { highlighted = hljs.highlight(code, {language:lang}).value; } catch(e) {}
      } else {
        try { highlighted = hljs.highlightAuto(code).value; } catch(e) {}
      }
      return `<pre><code class="hljs ${lang||''}">${highlighted}</code></pre>`;
    };
    r.image = (href, title, text) => {
      const stored = images.value.find(i=>i.id===href||i.name===href);
      const src = stored ? stored.data : href;
      const wMatch = text?.match(/w=(\d+)/);
      const hMatch = text?.match(/h=(\d+)/);
      const alt = (text||'').replace(/[wh]=\d+/g,'').trim();
      let st = 'max-width:100%';
      if (wMatch) st += `;width:${wMatch[1]}px`;
      if (hMatch) st += `;height:${hMatch[1]}px`;
      return `<figure><img src="${src}" alt="${alt}" style="${st};border-radius:var(--rad)"/>${title?`<figcaption>${title}</figcaption>`:''}</figure>`;
    };
    return r;
  };

  /* ─── Process LaTeX before marked ─── */
  const processLatex = (src) => {
    // Block math $$...$$
    src = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
      try {
        return `<div class="katex-block">${katex.renderToString(expr.trim(), {displayMode:true, throwOnError:false})}</div>`;
      } catch(e) { return `<div class="katex-error">LaTeX error: ${e.message}</div>`; }
    });
    // Inline math $...$
    src = src.replace(/\$([^\n$]+?)\$/g, (_, expr) => {
      try {
        return `<span class="katex-inline">${katex.renderToString(expr.trim(), {displayMode:false, throwOnError:false})}</span>`;
      } catch(e) { return `<span class="katex-error">${expr}</span>`; }
    });
    return src;
  };

  const renderedHtml = computed(() => {
    try {
      marked.setOptions({renderer: buildRenderer(), breaks: true, gfm: true});
      let src = currentContent.value || '';
      // Process LaTeX first (before marked parses $)
      src = processLatex(src);
      let html = marked.parse(src);
      // Custom style overrides
      const ov = [];
      if (cColorText.value) ov.push(`#preview-page{color:${cColorText.value}!important}`);
      if (cColorHead.value) ov.push(`#preview-page h1,#preview-page h2,#preview-page h3,#preview-page h4{color:${cColorHead.value}!important}`);
      if (cColorLink.value) ov.push(`#preview-page a{color:${cColorLink.value}!important}`);
      if (cHeadFont.value) ov.push(`#preview-page h1,#preview-page h2,#preview-page h3{font-family:${cHeadFont.value}!important}`);
      if (cH1.value!==2) ov.push(`#preview-page h1{font-size:${cH1.value}em!important}`);
      if (cH2.value!==1.5) ov.push(`#preview-page h2{font-size:${cH2.value}em!important}`);
      if (cParaGap.value!==0.75) ov.push(`#preview-page p{margin:${cParaGap.value}em 0!important}`);
      if (ov.length) html = `<style>${ov.join(' ')}</style>` + html;
      return html;
    } catch(e) { return `<p style="color:red">Render error: ${e.message}</p>`; }
  });

  /* ─── Mermaid render after DOM update ─── */
  const renderMermaid = async () => {
    await nextTick();
    if (typeof mermaid === 'undefined') return;
    const els = document.querySelectorAll('#preview-page .mermaid-block .mermaid');
    if (!els.length) return;
    try {
      await mermaid.run({nodes: Array.from(els)});
    } catch(e) {}
    // Focus mode
    const els2 = document.querySelectorAll('.focus-inner .mermaid');
    if (els2.length) {
      try { await mermaid.run({nodes: Array.from(els2)}); } catch(e) {}
    }
  };

  watch(renderedHtml, () => { setTimeout(renderMermaid, 80); });

  /* ════════════ PERSISTENCE ════════════ */
  const SK = 'mdstudio_v4';
  const persist = () => {
    try {
      const data = {
        files: files.value.map(f => ({...f, content: f.id===activeFileId.value ? currentContent.value : f.content})),
        activeFileId: activeFileId.value,
        darkMode: darkMode.value,
        renderTheme: renderTheme.value,
        images: images.value,
        userTemplates: userTemplates.value,
        blocks: blocks.value,
      };
      localStorage.setItem(SK, JSON.stringify(data));
      unsaved.value = false;
    } catch(e) { notify('Storage full — cannot auto-save','error'); }
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
      if (d.blocks) blocks.value = d.blocks;
      const af = files.value.find(f=>f.id===activeFileId.value);
      if (af) currentContent.value = af.content || '';
      return true;
    } catch(e) { return false; }
  };

  /* ════════════ FILES ════════════ */
  const newFile = () => {
    const id = mkid();
    files.value.push({id, name:`note-${files.value.length+1}.md`, content:''});
    switchFile(id);
  };
  const switchFile = (id) => {
    if (activeFileId.value) {
      const af = files.value.find(f=>f.id===activeFileId.value);
      if (af) af.content = currentContent.value;
    }
    activeFileId.value = id;
    const f = files.value.find(f=>f.id===id);
    currentContent.value = f?.content || '';
    undoStack.value = []; redoStack.value = [];
    syncBlocksFromContent();
    unsaved.value = false;
  };
  const deleteFile = (id) => {
    if (files.value.length===1) { notify('Keep at least one file','warn'); return; }
    if (!confirm('Delete this file?')) return;
    files.value = files.value.filter(f=>f.id!==id);
    if (activeFileId.value===id) switchFile(files.value[0].id);
    notify('Deleted','info',1500);
  };
  const duplicateFile = (id) => {
    const f = files.value.find(f=>f.id===id);
    if (!f) return;
    const nid = mkid();
    const content = id===activeFileId.value ? currentContent.value : f.content;
    files.value.push({id:nid, name:f.name.replace(/(\.\w+)?$/,'-copy$1'), content});
    switchFile(nid);
    notify('Duplicated','success',1500);
  };
  const saveFile = () => {
    if (activeFileId.value) {
      const af = files.value.find(f=>f.id===activeFileId.value);
      if (af) af.content = currentContent.value;
    }
    persist();
    notify('Saved ✓','success',1500);
  };

  /* rename */
  const startRename = () => {
    if (!activeFile.value) return;
    renamingId.value = activeFileId.value;
    renameVal.value = activeFile.value.name;
    renamingFile.value = true;
    nextTick(() => renameInputRef.value?.select());
  };
  const startRenameById = (id) => {
    const f = files.value.find(f=>f.id===id);
    if (!f) return;
    const nm = prompt('Rename:', f.name);
    if (nm?.trim()) f.name = nm.trim();
  };
  const finishRename = () => {
    if (renameVal.value?.trim()) {
      const f = files.value.find(f=>f.id===renamingId.value);
      if (f) f.name = renameVal.value.trim();
    }
    renamingFile.value = false;
  };

  /* ════════════ UNDO / REDO ════════════ */
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

  /* ════════════ BLOCK EDITOR ════════════ */
  const syncBlocksFromContent = () => {
    // Split content into blocks by blank lines
    const paragraphs = currentContent.value.split(/\n{2,}/);
    blocks.value = paragraphs.filter(p=>p.trim()).map(p => {
      const t = p.trim();
      let type = 'paragraph';
      if (/^#{1}\s/.test(t)) type='heading1';
      else if (/^#{2}\s/.test(t)) type='heading2';
      else if (/^#{3}\s/.test(t)) type='heading3';
      else if (/^>/.test(t)) type='blockquote';
      else if (/^```mermaid/.test(t)) type='mermaid';
      else if (/^```/.test(t)) type='code';
      else if (/^\$\$/.test(t)) type='math';
      else if (/^[-*]\s/.test(t)||/^-\s/.test(t)) type='bullet';
      else if (/^\d+\.\s/.test(t)) type='numbered';
      else if (/^\|/.test(t)) type='table';
      else if (/^---$/.test(t)) type='divider';
      else if (/^!\[/.test(t)) type='image';
      return {id:mkid(), type, content:t};
    });
    if (!blocks.value.length) blocks.value = [{id:mkid(),type:'paragraph',content:''}];
  };
  const syncContentFromBlocks = () => {
    currentContent.value = blocks.value.map(b=>b.content).join('\n\n');
    unsaved.value = true;
  };
  const addBlock = (idx, type='paragraph') => {
    const bt = BLOCK_TYPES.find(b=>b.type===type);
    const newBlock = {id:mkid(), type, content: bt?.placeholder||''};
    blocks.value.splice(idx+1, 0, newBlock);
    blockPickerOpen.value = false;
    syncContentFromBlocks();
    nextTick(() => {
      const el = document.getElementById('bce-'+newBlock.id);
      if (el) { el.focus(); const r=document.createRange();r.selectNodeContents(el);r.collapse(false);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(r); }
    });
  };
  const deleteBlock = (idx) => {
    if (blocks.value.length===1) { blocks.value[0].content=''; syncContentFromBlocks(); return; }
    blocks.value.splice(idx,1);
    syncContentFromBlocks();
  };
  const duplicateBlock = (idx) => {
    const b = {...blocks.value[idx], id:mkid()};
    blocks.value.splice(idx+1,0,b);
    syncContentFromBlocks();
  };
  const onBlockInput = (idx, e) => {
    blocks.value[idx].content = e.target.innerText;
    syncContentFromBlocks();
  };
  const openBlockPicker = (idx, e) => {
    blockPickerIdx.value = idx;
    blockPickerOpen.value = true;
    blockPickerPos.value = {x: e.clientX, y: e.clientY};
  };

  /* ─ drag & drop ─ */
  const onBlockDragStart = (e, idx) => {
    dragSrcIdx = idx;
    e.dataTransfer.effectAllowed = 'move';
    nextTick(() => {
      const el = document.querySelectorAll('.block-item')[idx];
      if (el) el.classList.add('dragging-src');
    });
  };
  const onBlockDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const items = document.querySelectorAll('.block-item');
    items.forEach(el => el.classList.remove('drag-over-top','drag-over-bottom'));
    const el = items[idx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    dragOverIdx = idx;
    dragOverSide = e.clientY < mid ? 'top' : 'bottom';
    el.classList.add(dragOverSide==='top' ? 'drag-over-top' : 'drag-over-bottom');
  };
  const onBlockDrop = (e, idx) => {
    e.preventDefault();
    document.querySelectorAll('.block-item').forEach(el => el.classList.remove('drag-over-top','drag-over-bottom','dragging-src'));
    if (dragSrcIdx === -1 || dragSrcIdx === idx) return;
    const moved = blocks.value.splice(dragSrcIdx, 1)[0];
    let insertAt = idx;
    if (dragSrcIdx < idx) insertAt--;
    if (dragOverSide === 'bottom') insertAt++;
    insertAt = Math.max(0, Math.min(insertAt, blocks.value.length));
    blocks.value.splice(insertAt, 0, moved);
    syncContentFromBlocks();
    dragSrcIdx = -1;
  };
  const onBlockDragEnd = () => {
    document.querySelectorAll('.block-item').forEach(el => el.classList.remove('drag-over-top','drag-over-bottom','dragging-src'));
    dragSrcIdx = -1;
  };

  /* watch mode switch */
  watch(editorMode, (m) => {
    if (m==='blocks') syncBlocksFromContent();
  });

  /* ════════════ EDITOR KEYDOWN ════════════ */
  const onEditorKeydown = (e) => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && e.key==='s') { e.preventDefault(); saveFile(); return; }
    if (ctrl && e.key==='b') { e.preventDefault(); fmt('**','**'); return; }
    if (ctrl && e.key==='i') { e.preventDefault(); fmt('*','*'); return; }
    if (ctrl && e.key==='h') { e.preventDefault(); openFR(); return; }
    if (ctrl && e.key==='z') { e.preventDefault(); undo(); return; }
    if (ctrl && (e.key==='y'||e.key==='Y')) { e.preventDefault(); redo(); return; }
    if (ctrl && e.key==='n') { e.preventDefault(); newFile(); return; }
    if (ctrl && e.shiftKey && e.key==='F') { e.preventDefault(); focusMode.value=true; return; }
    if (ctrl && e.key==='d') {
      e.preventDefault();
      const ta = editorRef.value;
      const pos = ta.selectionStart;
      const start = currentContent.value.lastIndexOf('\n', pos-1)+1;
      const end = currentContent.value.indexOf('\n', pos);
      const lineEnd = end===-1 ? currentContent.value.length : end;
      const line = currentContent.value.substring(start, lineEnd);
      currentContent.value = currentContent.value.substring(0,lineEnd)+'\n'+line+currentContent.value.substring(lineEnd);
      nextTick(() => { ta.selectionStart = ta.selectionEnd = lineEnd+1+line.length; });
      return;
    }
    if (e.key==='Tab') {
      e.preventDefault();
      const ta = editorRef.value;
      const s = ta.selectionStart, en = ta.selectionEnd;
      if (e.shiftKey) {
        const lineStart = currentContent.value.lastIndexOf('\n',s-1)+1;
        const line = currentContent.value.substring(lineStart, en);
        const nl = line.replace(/^ {1,2}/,'');
        currentContent.value = currentContent.value.substring(0,lineStart)+nl+currentContent.value.substring(en);
        nextTick(()=>{ ta.selectionStart=ta.selectionEnd=s-Math.min(2,line.length-nl.length); });
      } else {
        currentContent.value = currentContent.value.substring(0,s)+'  '+currentContent.value.substring(en);
        nextTick(()=>{ ta.selectionStart=ta.selectionEnd=s+2; });
      }
      return;
    }
    if (e.key==='Escape' && focusMode.value) { focusMode.value=false; return; }
    if (e.key==='F11') { e.preventDefault(); focusMode.value=!focusMode.value; return; }
    // auto-pair
    const pairs = {'(':')','[':']','{':'}','"':'"',"'":"'",'`':'`'};
    if (pairs[e.key]) {
      const ta = editorRef.value;
      const s=ta.selectionStart, en=ta.selectionEnd;
      if (s!==en) {
        e.preventDefault();
        const sel = currentContent.value.substring(s,en);
        currentContent.value = currentContent.value.substring(0,s)+e.key+sel+pairs[e.key]+currentContent.value.substring(en);
        nextTick(()=>{ ta.selectionStart=s+1; ta.selectionEnd=en+1; });
      }
    }
  };

  /* ════════════ FORMATTING ════════════ */
  const fmt = (before, after) => {
    const ta = editorRef.value; if (!ta) return;
    const s=ta.selectionStart, e=ta.selectionEnd;
    const sel = currentContent.value.substring(s,e);
    if (currentContent.value.substring(s-before.length,s)===before && currentContent.value.substring(e,e+after.length)===after) {
      currentContent.value = currentContent.value.substring(0,s-before.length)+sel+currentContent.value.substring(e+after.length);
      nextTick(()=>{ ta.selectionStart=s-before.length; ta.selectionEnd=e-before.length; ta.focus(); });
    } else {
      currentContent.value = currentContent.value.substring(0,s)+before+sel+after+currentContent.value.substring(e);
      nextTick(()=>{ ta.selectionStart=s+before.length; ta.selectionEnd=s+before.length+sel.length; ta.focus(); });
    }
    unsaved.value=true;
  };
  const fmtLine = (prefix) => {
    const ta = editorRef.value; if (!ta) return;
    const pos=ta.selectionStart;
    const start=currentContent.value.lastIndexOf('\n',pos-1)+1;
    const end=currentContent.value.indexOf('\n',pos);
    const lineEnd=end===-1?currentContent.value.length:end;
    const line=currentContent.value.substring(start,lineEnd);
    if (line.startsWith(prefix)) {
      currentContent.value=currentContent.value.substring(0,start)+line.slice(prefix.length)+currentContent.value.substring(lineEnd);
      nextTick(()=>{ ta.selectionStart=ta.selectionEnd=Math.max(start,pos-prefix.length); ta.focus(); });
    } else {
      currentContent.value=currentContent.value.substring(0,start)+prefix+line+currentContent.value.substring(lineEnd);
      nextTick(()=>{ ta.selectionStart=ta.selectionEnd=pos+prefix.length; ta.focus(); });
    }
    unsaved.value=true;
  };
  const fmtBlock = (before, after) => {
    const ta=editorRef.value; if(!ta) return;
    const s=ta.selectionStart;
    const sel=currentContent.value.substring(s,ta.selectionEnd)||'code here';
    currentContent.value=currentContent.value.substring(0,s)+before+sel+after+currentContent.value.substring(ta.selectionEnd);
    unsaved.value=true;
  };
  const insertLink = () => {
    const ta=editorRef.value; if(!ta) return;
    const sel=currentContent.value.substring(ta.selectionStart,ta.selectionEnd);
    const url=prompt('URL:','https://'); if(!url) return;
    const text=sel||prompt('Link text:','Link')||url;
    const ins=`[${text}](${url})`;
    const s=ta.selectionStart;
    currentContent.value=currentContent.value.substring(0,s)+ins+currentContent.value.substring(ta.selectionEnd);
    unsaved.value=true;
  };
  const insertTable = () => {
    const ta=editorRef.value; if(!ta) return;
    const s=ta.selectionStart;
    const tbl='\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n';
    currentContent.value=currentContent.value.substring(0,s)+tbl+currentContent.value.substring(s);
    unsaved.value=true; notify('Table inserted','info',1500);
  };
  const insertMermaid = () => {
    const ta=editorRef.value; if(!ta) return;
    const s=ta.selectionStart;
    const diagram='\n```mermaid\nflowchart LR\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Result]\n  B -->|No| D[Other]\n```\n';
    currentContent.value=currentContent.value.substring(0,s)+diagram+currentContent.value.substring(s);
    unsaved.value=true; notify('Mermaid diagram inserted','info',1500);
  };
  const insertMath = () => {
    const ta=editorRef.value; if(!ta) return;
    const s=ta.selectionStart;
    const math='\n$$\n\\sum_{i=1}^{n} x_i = \\frac{n(n+1)}{2}\n$$\n';
    currentContent.value=currentContent.value.substring(0,s)+math+currentContent.value.substring(s);
    unsaved.value=true; notify('LaTeX block inserted','info',1500);
  };
  const insertImageFromLib = () => { if(images.value.length) showImgManager.value=true; else triggerImgUpload(); };
  const doSelectAll = () => { editorRef.value?.select(); };
  const doCopy = () => {
    const ta=editorRef.value; if(!ta) return;
    const sel=currentContent.value.substring(ta.selectionStart,ta.selectionEnd);
    navigator.clipboard?.writeText(sel||currentContent.value);
    notify('Copied','success',1200);
  };
  const clearEditor = () => {
    if(confirm('Clear all content?')) { pushHistory(currentContent.value); currentContent.value=''; unsaved.value=true; }
  };

  /* ════════════ DARK MODE ════════════ */
  const toggleDark = () => {
    darkMode.value = !darkMode.value;
    document.documentElement.setAttribute('data-theme', darkMode.value?'dark':'');
    document.getElementById('hljs-theme').href = darkMode.value
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    // re-init mermaid theme
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({startOnLoad:false, theme: darkMode.value?'dark':'default', securityLevel:'loose'});
      setTimeout(renderMermaid, 100);
    }
  };

  /* ════════════ RESIZER ════════════ */
  let rsing=false, rsX=0, rsW0=0;
  const startResize = (e) => {
    rsing=true; rsX=e.clientX; rsW0=editorWidth.value;
    document.body.style.userSelect='none'; document.body.style.cursor='col-resize';
    document.getElementById('resizer').classList.add('dragging');
    const onMove = (ev) => { if(!rsing)return; editorWidth.value=Math.max(180,Math.min(rsW0+(ev.clientX-rsX),window.innerWidth-280)); };
    const onUp = () => { rsing=false; document.body.style.userSelect=''; document.body.style.cursor=''; document.getElementById('resizer').classList.remove('dragging'); document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); };
    document.addEventListener('mousemove',onMove);
    document.addEventListener('mouseup',onUp);
  };

  /* ════════════ FILE UPLOAD ════════════ */
  const triggerMdUpload = () => mdFileInput.value?.click();
  const onMdFileUpload = (e) => {
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const id=mkid();
      files.value.push({id, name:file.name, content:ev.target.result});
      switchFile(id);
      notify(`Opened: ${file.name}`,'success');
    };
    reader.readAsText(file); e.target.value='';
  };

  /* ════════════ IMAGES ════════════ */
  const triggerImgUpload = () => imgFileInput.value?.click();
  const openImgManager = () => { showImgManager.value=true; };
  const toggleImgSel = (id) => { const i=selectedImgs.value.indexOf(id); i===-1?selectedImgs.value.push(id):selectedImgs.value.splice(i,1); };
  const onImgUpload = (e) => {
    const fls=Array.from(e.target.files); let loaded=0;
    fls.forEach(file=>{
      const rdr=new FileReader(); rdr.onload=(ev)=>{
        const img=new Image(); img.onload=()=>{
          images.value.push({id:mkid(),name:file.name,data:ev.target.result,width:img.naturalWidth,height:img.naturalHeight});
          loaded++; if(loaded===fls.length){persist();notify(`${fls.length} image(s) uploaded`,'success');}
        }; img.src=ev.target.result;
      }; rdr.readAsDataURL(file);
    }); e.target.value='';
  };
  const deleteSelected = () => { images.value=images.value.filter(i=>!selectedImgs.value.includes(i.id)); selectedImgs.value=[]; persist(); notify('Deleted','info'); };
  const insertSelected = () => { selectedImgs.value.forEach(id=>{const img=images.value.find(i=>i.id===id);if(img)insertOneImage(img);}); selectedImgs.value=[]; showImgManager.value=false; };
  const insertOneImage = (img) => {
    const ta=editorRef.value;
    const pos=ta?ta.selectionStart:currentContent.value.length;
    const ins=`\n![${img.name}](${img.id})\n`;
    currentContent.value=currentContent.value.substring(0,pos)+ins+currentContent.value.substring(pos);
    unsaved.value=true; notify('Image inserted','success',1500);
  };

  /* resize */
  const openResize=(img)=>{resizeTgt.value={...img};resW.value=img.width;resH.value=img.height;showResize.value=true;};
  const onRW=()=>{if(resLock.value&&resizeTgt.value)resH.value=Math.round(resW.value*(resizeTgt.value.height/resizeTgt.value.width));};
  const onRH=()=>{if(resLock.value&&resizeTgt.value)resW.value=Math.round(resH.value*(resizeTgt.value.width/resizeTgt.value.height));};
  const applyResize=()=>{
    const c=document.createElement('canvas');c.width=resW.value;c.height=resH.value;
    const ctx=c.getContext('2d');const img=new Image();img.src=resizeTgt.value.data;
    img.onload=()=>{ctx.drawImage(img,0,0,resW.value,resH.value);const nd=c.toDataURL('image/jpeg',resQ.value);const idx=images.value.findIndex(i=>i.id===resizeTgt.value.id);if(idx!==-1){images.value[idx]={...images.value[idx],data:nd,width:resW.value,height:resH.value};persist();}showResize.value=false;notify('Resized','success');};
  };

  /* crop */
  const openCrop=(img)=>{cropTgt.value={...img};cropX.value=0;cropY.value=0;cropW.value=img.width;cropH.value=img.height;showCrop.value=true;};
  const initCropDisplay=()=>{if(!cropImgRef.value||!cropTgt.value)return;cropScale.value=cropImgRef.value.offsetWidth/cropTgt.value.width;};
  const cropDisplayRect=computed(()=>{
    if(!cropImgRef.value||!cropTgt.value||!cropWrapRef.value)return null;
    const s=cropScale.value;const ir=cropImgRef.value.getBoundingClientRect();const cr=cropWrapRef.value.getBoundingClientRect();
    return {left:(ir.left-cr.left+cropX.value*s)+'px',top:(ir.top-cr.top+cropY.value*s)+'px',width:Math.max(2,cropW.value*s)+'px',height:Math.max(2,cropH.value*s)+'px'};
  });
  const applyCropPreset=(p)=>{
    if(!cropTgt.value)return;const {width:ow,height:oh}=cropTgt.value;
    const ratios={'1:1':1,'4:3':4/3,'16:9':16/9,'3:4':3/4,'A4 portrait':1/Math.sqrt(2)};
    const ratio=ratios[p];if(!ratio){cropX.value=0;cropY.value=0;cropW.value=ow;cropH.value=oh;return;}
    let w=ow,h=Math.round(ow/ratio);if(h>oh){h=oh;w=Math.round(oh*ratio);}
    cropX.value=Math.round((ow-w)/2);cropY.value=Math.round((oh-h)/2);cropW.value=w;cropH.value=h;
  };
  const onCropMouseDown=(e)=>{
    if(!cropImgRef.value)return;e.preventDefault();const ir=cropImgRef.value.getBoundingClientRect();const s=cropScale.value;
    const sx=(e.clientX-ir.left)/s,sy=(e.clientY-ir.top)/s;
    const onMove=(ev)=>{const cx=(ev.clientX-ir.left)/s,cy=(ev.clientY-ir.top)/s;cropX.value=Math.max(0,Math.min(sx,cx));cropY.value=Math.max(0,Math.min(sy,cy));cropW.value=Math.abs(cx-sx);cropH.value=Math.abs(cy-sy);};
    const onUp=()=>{document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);};
    document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onUp);
  };
  const applyCrop=()=>{
    const c=document.createElement('canvas');c.width=Math.max(1,Math.round(cropW.value));c.height=Math.max(1,Math.round(cropH.value));
    const ctx=c.getContext('2d');const img=new Image();img.src=cropTgt.value.data;
    img.onload=()=>{ctx.drawImage(img,cropX.value,cropY.value,cropW.value,cropH.value,0,0,c.width,c.height);const nd=c.toDataURL('image/png');const idx=images.value.findIndex(i=>i.id===cropTgt.value.id);if(idx!==-1){images.value[idx]={...images.value[idx],data:nd,width:c.width,height:c.height};persist();}showCrop.value=false;notify('Cropped','success');};
  };

  /* ════════════ TEMPLATES ════════════ */
  const openTemplates = () => { showTemplates.value=true; };
  const loadTemplate = (t) => {
    renderTheme.value = t.theme||'default';
    currentContent.value = t.content.replace(/\{\{date\}\}/g, today());
    unsaved.value=true; notify(`Template: ${t.name}`,'success');
  };
  const loadUserTemplate = (t) => { renderTheme.value=t.theme||'default'; if(t.content)currentContent.value=t.content; unsaved.value=true; notify(`Template: ${t.name}`,'success'); };
  const saveAsTheme = () => { showSaveTpl.value=true; newTplName.value=''; newTplDesc.value=''; };
  const saveAsUserTemplate = () => {
    if(!newTplName.value.trim()){notify('Enter a name','warn');return;}
    userTemplates.value.push({id:mkid(),name:newTplName.value.trim(),desc:newTplDesc.value.trim(),theme:renderTheme.value,content:tplInclude.value?currentContent.value:''});
    persist(); showSaveTpl.value=false; notify('Template saved','success');
  };
  const deleteUserTpl = (id) => { userTemplates.value=userTemplates.value.filter(t=>t.id!==id); persist(); };

  /* ════════════ FIND / REPLACE ════════════ */
  const openFR = () => { showFR.value=true; frCount.value=null; nextTick(()=>frFindRef.value?.focus()); };
  const frBuildRe = () => {
    let pat=frFind.value;
    if(!frRegex.value) pat=pat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    if(frWhole.value) pat=`\\b${pat}\\b`;
    return new RegExp(pat, frCase.value?'g':'gi');
  };
  const frDoFind = () => { if(!frFind.value)return; try{const ms=currentContent.value.match(frBuildRe());frCount.value=ms?ms.length:0;}catch(e){notify('Invalid regex','error');} };
  const frReplaceOne = () => {
    if(!frFind.value)return;
    try{let p=frFind.value;if(!frRegex.value)p=p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');if(frWhole.value)p=`\\b${p}\\b`;currentContent.value=currentContent.value.replace(new RegExp(p,frCase.value?'':'i'),frReplace.value);unsaved.value=true;frDoFind();}catch(e){notify('Invalid regex','error');}
  };
  const frReplaceAll = () => {
    if(!frFind.value)return;
    try{const re=frBuildRe();const cnt=(currentContent.value.match(re)||[]).length;currentContent.value=currentContent.value.replace(re,frReplace.value);unsaved.value=true;frCount.value=0;notify(`Replaced ${cnt} occurrence(s)`,'success');}catch(e){notify('Invalid regex','error');}
  };

  /* ════════════ STYLE RESET ════════════ */
  const resetStyle = () => {
    customFont.value='';cFontSize.value=16;cLineH.value=1.7;cParaGap.value=0.75;
    cWidth.value=740;cPadH.value=48;cPadV.value=40;
    cColorText.value='';cColorHead.value='';cColorLink.value='';cColorBg.value='';
    cHeadFont.value='';cH1.value=2;cH2.value=1.5;
    notify('Style reset','info',1500);
  };

  /* ════════════ COPY HELPERS ════════════ */
  const copyHtml = () => { navigator.clipboard?.writeText(renderedHtml.value); notify('HTML copied','success',1500); };
  const copyText = () => { const d=document.createElement('div');d.innerHTML=renderedHtml.value;navigator.clipboard?.writeText(d.textContent||'');notify('Text copied','success',1500); };

  /* ════════════ EXPORT ════════════ */
  const openExport = () => { showExport.value=true; showPdfSettings.value=false; exportTitle.value=activeFile.value?.name?.replace(/\.\w+$/,'')||'Document'; };
  const dlBlob = (blob,name) => { const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),1000); };
  const fname = (ext) => (activeFile.value?.name?.replace(/\.\w+$/,'')||'document')+'.'+ext;

  const exportMarkdown = () => { dlBlob(new Blob([currentContent.value],{type:'text/markdown'}),fname('md')); notify('Markdown exported','success'); };
  const exportTxt = () => { const d=document.createElement('div');d.innerHTML=renderedHtml.value;dlBlob(new Blob([d.textContent||''],{type:'text/plain'}),fname('txt'));notify('Text exported','success'); };
  const exportJSON = () => {
    const data={title:exportTitle.value,author:exportAuthor.value,keywords:exportKeywords.value,date:exportDate.value,theme:renderTheme.value,content:currentContent.value,wordCount:wordCount.value,charCount:charCount.value,exported:new Date().toISOString()};
    dlBlob(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),fname('json'));notify('JSON exported','success');
  };
  const exportHTML = () => {
    let allStyles='';
    for(const sheet of document.styleSheets){try{for(const rule of sheet.cssRules||[])allStyles+=rule.cssText+'\n';}catch(e){}}
    const htmlDoc=`<!DOCTYPE html>\n<html lang="en" data-theme="${darkMode.value?'dark':''}">\n<head>\n<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>\n<title>${exportTitle.value||'Document'}</title>\n<link rel="preconnect" href="https://fonts.googleapis.com"/>\n<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,400&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&family=Raleway:wght@300;400;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${darkMode.value?'github-dark':'github'}.min.css"/>\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"/>\n<style>\n${allStyles}\nbody{background:var(--bg1)}\n</style>\n</head>\n<body>\n<div id="preview-page" class="md-body theme-${renderTheme.value}" style="${Object.entries(previewPageStyle.value).map(([k,v])=>k.replace(/([A-Z])/g,m=>'-'+m.toLowerCase())+':'+v).join(';')}">\n${renderedHtml.value}\n</div>\n<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\/script>\n<script>mermaid.initialize({startOnLoad:true,theme:'${darkMode.value?'dark':'default'}',securityLevel:'loose'});<\/script>\n</body>\n</html>`;
    dlBlob(new Blob([htmlDoc],{type:'text/html'}),fname('html'));notify('HTML exported','success');
  };
  const exportDocx = () => {
    const wordHtml=`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>\n<head><meta charset="UTF-8"/><title>${exportTitle.value}</title>\n<style>@page{margin:2cm 2.5cm}body{font-family:Calibri,sans-serif;font-size:12pt;line-height:1.6}h1{font-size:22pt}h2{font-size:16pt}h3{font-size:13pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:5pt}th{background:#e8e8e8;font-weight:bold}code,pre{font-family:Courier New,monospace;background:#f0f0f0}blockquote{margin-left:18pt;border-left:3px solid #ccc;padding-left:9pt;color:#555}</style>\n</head>\n<body>${renderedHtml.value}</body>\n</html>`;
    dlBlob(new Blob(['\ufeff'+wordHtml],{type:'application/msword'}),fname('doc'));notify('Word exported','success');
  };
  const exportPDF = () => {
    showExport.value=false;
    const marginMap={normal:'2cm',narrow:'1cm',wide:'3cm',none:'0'};
    const margin=marginMap[pdfMargins.value]||'2cm';
    const el=document.createElement('style'); el.id='pdf-print-override';
    el.textContent=`@page{size:${pdfPaperSize.value} ${pdfOrientation.value};margin:${margin}}@media print{html,body{height:auto!important;overflow:visible!important}#vue-root,#app-body,#main,#preview-pane,#preview-scroller{overflow:visible!important;height:auto!important;display:block!important}#topbar,#statusbar,#sidebar,#editor-pane,#resizer,.pane-toolbar,#ctx-menu,#notif-area,.style-panel,.focus-toolbar,#style-panel-wrap{display:none!important}#preview-pane{display:block!important;border:none!important;overflow:visible!important}#preview-scroller{overflow:visible!important;height:auto!important}#preview-page{max-width:100%!important;padding:0!important;margin:0!important;min-height:0!important;background:white!important;zoom:${pdfScale.value}%}${!pdfBg.value?'*{background:transparent!important;box-shadow:none!important}':''}}`;
    document.head.appendChild(el);
    notify('Opening print dialog… All pages will be included','info');
    setTimeout(()=>{ window.print(); setTimeout(()=>{ const rem=document.getElementById('pdf-print-override'); if(rem)rem.remove(); },2000); },400);
  };
  const exportSingle = (id,ext) => { const f=files.value.find(f=>f.id===id); if(!f)return; const content=id===activeFileId.value?currentContent.value:f.content; dlBlob(new Blob([content],{type:'text/markdown'}),f.name); notify('Downloaded','success',1500); };

  /* ════════════ CONTEXT MENU ════════════ */
  const openEditorCtx = (e) => { e.preventDefault(); posCtx(e,{type:'editor'}); };
  const openPreviewCtx = (e) => { e.preventDefault(); posCtx(e,{type:'preview'}); };
  const openFileCtx = (e,f) => { e.preventDefault(); posCtx(e,{type:'file',fileId:f.id}); };
  const posCtx = (e,extra) => {
    closeCtx();
    const x=Math.min(e.clientX,window.innerWidth-210);
    const y=Math.min(e.clientY,window.innerHeight-360);
    ctxMenu.value={show:true,x,y,...extra};
    const close=(ev)=>{ if(!ev.target.closest('#ctx-menu')){closeCtx();document.removeEventListener('click',close);} };
    nextTick(()=>document.addEventListener('click',close));
  };
  const closeCtx = () => { ctxMenu.value.show=false; };

  /* ════════════ SCROLL TO HEADING ════════════ */
  const scrollToHeading = (slug) => {
    nextTick(()=>{ const el=document.getElementById('preview-scroller')?.querySelector(`#${slug}`); el?.scrollIntoView({behavior:'smooth',block:'start'}); });
  };

  /* ════════════ GLOBAL KEYDOWN ════════════ */
  const onGlobalKey = (e) => {
    if (e.key==='Escape') { if(focusMode.value){focusMode.value=false;return;} closeCtx(); if(blockPickerOpen.value)blockPickerOpen.value=false; }
    if (e.key==='F11') { e.preventDefault(); focusMode.value=!focusMode.value; }
  };

  /* ════════════ AUTO-SAVE ════════════ */
  let autoSaveTimer = null;
  watch(currentContent, () => {
    unsaved.value = true;
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      if (activeFileId.value) { const af=files.value.find(f=>f.id===activeFileId.value); if(af)af.content=currentContent.value; }
      persist();
    }, 6000);
  });

  /* ════════════ MOUNT ════════════ */
  onMounted(async () => {
    const ok = hydrate();
    if (!ok) {
      const id=mkid();
      files.value=[{id,name:'welcome.md',content:DEMO_MD}];
      activeFileId.value=id;
      currentContent.value=DEMO_MD;
    }
    if (darkMode.value) {
      document.documentElement.setAttribute('data-theme','dark');
      document.getElementById('hljs-theme').href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
    }
    document.addEventListener('keydown', onGlobalKey);
    // Init mermaid
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({startOnLoad:false, theme:darkMode.value?'dark':'default', securityLevel:'loose'});
      setTimeout(renderMermaid, 300);
    }
  });

  return {
    darkMode,sidebarOpen,viewMode,editorMode,focusMode,wordWrap,unsaved,showStylePanel,
    files,activeFileId,currentContent,activeFile,
    renamingFile,renameVal,renameInputRef,
    editorRef,editorFontSize,editorLineHeight,editorWidth,mdFileInput,
    renderTheme,renderThemes,currentThemeName,
    customFont,cFontSize,cLineH,cParaGap,cWidth,cPadH,cPadV,
    cColorText,cColorHead,cColorLink,cColorBg,cHeadFont,cH1,cH2,fontChoices,
    previewPageStyle,
    blocks,blockPickerOpen,blockPickerIdx,blockPickerPos,BLOCK_TYPES,
    images,selectedImgs,imgFileInput,showImgManager,showResize,showCrop,
    resizeTgt,resW,resH,resLock,resQ,
    cropTgt,cropX,cropY,cropW,cropH,cropWrapRef,cropImgRef,cropDisplayRect,cropPresets,
    showExport,showPdfSettings,exportTitle,exportAuthor,exportKeywords,exportDate,
    pdfPaperSize,pdfOrientation,pdfMargins,pdfScale,pdfBg,
    TEMPLATES,userTemplates,showTemplates,tplTab,showSaveTpl,newTplName,newTplDesc,tplInclude,
    showFR,frFind,frReplace,frCase,frRegex,frWhole,frCount,frFindRef,
    ctxMenu,showShortcuts,shortcuts,
    wordCount,charCount,lineCount,readTime,headings,renderedHtml,notifications,
    // methods
    newFile,switchFile,deleteFile,duplicateFile,saveFile,
    startRename,startRenameById,finishRename,
    undo,redo,onInput,onEditorKeydown,
    fmt,fmtLine,fmtBlock,insertLink,insertTable,insertMermaid,insertMath,insertImageFromLib,doSelectAll,doCopy,clearEditor,
    toggleDark,startResize,
    triggerMdUpload,onMdFileUpload,
    openImgManager,triggerImgUpload,toggleImgSel,onImgUpload,deleteSelected,insertSelected,insertOneImage,
    openResize,onRW,onRH,applyResize,
    openCrop,initCropDisplay,onCropMouseDown,applyCropPreset,applyCrop,cropDisplayRect,
    openTemplates,loadTemplate,loadUserTemplate,saveAsTheme,saveAsUserTemplate,deleteUserTpl,
    openFR,frDoFind,frReplaceOne,frReplaceAll,
    resetStyle,copyHtml,copyText,
    openExport,exportMarkdown,exportTxt,exportJSON,exportHTML,exportDocx,exportPDF,exportSingle,
    openEditorCtx,openPreviewCtx,openFileCtx,closeCtx,
    scrollToHeading,
    addBlock,deleteBlock,duplicateBlock,onBlockInput,openBlockPicker,
    onBlockDragStart,onBlockDragOver,onBlockDrop,onBlockDragEnd,
  };
}
});
app.mount('#vue-root');