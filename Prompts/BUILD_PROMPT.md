# TLM Website Builder — System Prompt

> **Purpose:** Use this prompt to generate a complete, interactive Teaching Learning Material (TLM) website from any course syllabus. Feed this prompt along with your syllabus to an AI coding assistant to produce a fully functional educational web application.

---

## INPUT REQUIRED

To generate the website, provide:

1. **Syllabus document** (text or markdown) containing:
   - Course title and code
   - Unit/unit-wise topic breakdown (5 units preferred)
   - Any prescribed textbooks or references

2. **This prompt file** (`BUILD_PROMPT.md`) as the system instruction

---

## WHAT TO BUILD

Generate a **single-folder static website** (no build tools, no frameworks — pure HTML/CSS/JS) with the following structure:

```
project-folder/
  index.html              Course dashboard
  unit1.html              Unit 1 Theory
  unit1-case.html         Unit 1 Case Studies
  unit1-act.html          Unit 1 Activity (30 questions)
  unit2.html              Unit 2 Theory
  unit2-case.html         Unit 2 Case Studies
  unit2-act.html          Unit 2 Activity (30 questions)
  unit3.html              Unit 3 Theory
  unit3-case.html         Unit 3 Case Studies
  unit3-act.html          Unit 3 Activity (30 questions)
  unit4.html              Unit 4 Theory
  unit4-case.html         Unit 4 Case Studies
  unit4-act.html          Unit 4 Activity (30 questions)
  unit5.html              Unit 5 Theory
  unit5-case.html         Unit 5 Case Studies
  unit5-act.html          Unit 5 Activity (30 questions)
  lab.html                Lab Manual (9 experiments)
  annexure.html           Glossary + Key Formulas
  progress.js             Progress engine (chain lock, localStorage)
  dm-platform.js          Accessibility, content protection, touch controls
  dm-engagement.js        Case study panel, streaks, confetti, keyboard nav
  case-studies.js         15 case studies (3 per unit) data module
  diagram-theme.css       Enhanced Mermaid diagram styling
```

---

## DESIGN SYSTEM

### Color Theme (Light — per unit)

Each unit gets a unique accent color. Apply via CSS variables in `:root`:

| Unit | Primary | Light | Dark | Body BG | Container Border |
|------|---------|-------|------|---------|-----------------|
| 1 | `#2563eb` | `#3b82f6` | `#1d4ed8` | `#f0f4fa` | `#e9edf4` |
| 2 | `#7c3aed` | `#8b5cf6` | `#6d28d9` | `#f5f0ff` | `#ddd6fe` |
| 3 | `#0891b2` | `#06b6d4` | ``0e7490` | `#f0fdfa` | `#99f6e4` |
| 4 | `#d97706` | `#f59e0b` | `#b45309` | `#fffbeb` | ``fde68a` |
| 5 | `#dc2626` | `#ef4444` | `#b91c1c` | `#fef2f2` | `#fecaca` |

### Global CSS Variables

```css
:root {
  --primary: #2563eb;
  --primary-light: #3b82f6;
  --primary-dark: #1d4ed8;
  --secondary: #2d8f7a;
  --accent: #e8845a;
  --bg-body: #f0f4fa;
  --bg-white: #ffffff;
  --bg-card: #f7f9fc;
  --bg-highlight: #eef3fc;
  --text-dark: #1a2a3a;
  --text-muted: #4a5a6a;
  --text-light: #6a7a8a;
  --border-light: #dce3ed;
  --border-medium: #bcc9db;
  --shadow-sm: 0 4px 14px rgba(42, 75, 124, 0.06);
  --shadow-md: 0 8px 28px rgba(42, 75, 124, 0.10);
  --radius-lg: 32px;
  --radius-md: 20px;
  --radius-sm: 14px;
  --transition: 0.2s ease;
}
```

### Layout Patterns

**Header:**
```css
.header {
  background: linear-gradient(145deg, var(--primary-dark), var(--primary));
  color: white;
  padding: 1.8rem 2.5rem;
  border-radius: var(--radius-lg);
  margin-bottom: 2.2rem;
  box-shadow: 0 8px 30px rgba(26, 52, 88, 0.25);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
```

**Navigation (pill bar):**
```css
.nav-top {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1.2rem;
  background: var(--bg-white);
  padding: 0.6rem 1.8rem;
  border-radius: 60px;
  margin-bottom: 2rem;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}
```

**Content module:**
```css
.module {
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: 1.8rem 2.2rem;
  margin-bottom: 2.2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}
```

### External Dependencies (CDN only)

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
```

---

## PAGE SPECIFICATIONS

### 1. Dashboard (`index.html`)

- Gradient header with course title and badge
- Syllabus block with unit cards in a responsive grid
- Each unit card shows: unit number, title, topic list, links to Theory, Case Studies, Activity
- Unit cards use color-coded top borders (Unit 1 = blue, Unit 2 = purple, etc.)
- Resources section with textbook references, lab manual link, annexure link
- Footer with course info
- Calls `DM.applyPageLock(1)` on load

### 2. Theory Pages (`unitN.html`)

Each theory page must contain:
- Gradient header with unit title
- Pill-shaped nav bar: Theory (active) | Case Studies | Activity | Next Unit
- 4-6 content sections (`.module`) covering all syllabus topics
- At least **3 Mermaid diagrams** per unit with:
  - Dark background wrapper (`#0f172a`)
  - Numbered badge (top-left)
  - Zoom controls (+, -, fit-to-screen)
  - Diagram title
  - classDef styles for nodes
  - 18px font size for classroom projection
  - Explanatory note below each diagram
- Key point boxes with left border accent
- Unit navigation (previous/next)
- Footer note

**Mermaid diagram requirements:**
```javascript
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#fff',
    primaryBorderColor: '#818cf8',
    lineColor: '#94a3b8',
    fontFamily: 'Segoe UI, system-ui, sans-serif',
    fontSize: '18px'
  },
  flowchart: { curve: 'basis', padding: 20, htmlLabels: true }
});
```

Use these `classDef` styles in diagrams:
```
classDef decision fill:#6366f1,stroke:#818cf8,color:#fff,font-size:18px,font-weight:bold
classDef process fill:#0ea5e9,stroke:#38bdf8,color:#fff,font-size:18px,font-weight:bold
classDef success fill:#22c55e,stroke:#4ade80,color:#fff,font-size:18px,font-weight:bold
classDef warning fill:#f59e0b,stroke:#fbbf24,color:#1e1b4b,font-size:18px,font-weight:bold
classDef info fill:#8b5cf6,stroke:#a78bfa,color:#fff,font-size:18px,font-weight:bold
```

### 3. Case Study Pages (`unitN-case.html`)

Each case study page must contain:
- 3 real-world case studies per unit
- Each case has:
  - Theme tag (colored badge)
  - Title
  - Scenario paragraph (2-3 sentences)
  - Key facts list (4-5 bullet points)
  - Focus question with 4 multiple-choice options
  - Tip box with green left border
- Calls `DM.markCaseViewed(N)` on load

**Case study content requirements:**
- Must be real-world industry examples
- Must relate directly to the unit's theory topics
- Focus questions must test understanding, not just recall
- Tips must connect the case to the theory

### 4. Activity Pages (`unitN-act.html`)

Each activity page must contain:
- SCORM-style layout with progress bar, question counter, score display
- **30 questions** randomly selected from a pool of 40+ questions
- **5 question types** (use all types across the 30 questions):
  1. **Multiple Choice (MCQ):** 4 options (A-D), one correct
  2. **True/False:** Binary choice
  3. **Fill in the Blank:** Text input, case-insensitive comparison
  4. **Match Terms:** Dropdown selects pairing terms to definitions
  5. **Formula/Timeline:** Slider or sequence ordering

**Quiz engine behavior:**
- Questions shuffled on each attempt
- One question displayed at a time (sequential format)
- Submit button per question → shows correct/incorrect feedback
- Next button appears after submission
- Score updates in real-time
- After question 30: show results panel
- **Pass threshold: 12 out of 30**
- On pass: show confetti, "Proceed to Unit N+1" button, record result
- On fail: show "Retry" button, record result
- All progress saved to localStorage via `DM.recordResult(N, score)`

**Activity page color scheme:**
- Body background matches unit theme
- Container has unit-specific border color
- Button colors match unit accent

### 5. Lab Manual (`lab.html`)

- 9 hands-on experiments covering all 5 units
- Each experiment has:
  - Experiment number badge
  - Title
  - Description paragraph
  - Tools/technologies tags
  - Procedure steps (numbered list)
- Experiments should cover: data exploration, preprocessing, decision trees, Naive Bayes, k-NN, K-Means, hierarchical clustering, Apriori, FP-Growth

### 6. Annexure (`annexure.html`)

- Search box for filtering terms
- Unit filter tabs (All, Unit 1-5)
- **Glossary section:** 40+ terms with unit tags and definitions
- **Formulas section:** 15+ formulas with:
  - Formula title
  - Math display (monospace or styled)
  - Description
  - Unit tag
- Both sections filterable by unit and search term

---

## JAVASCRIPT MODULES

### `progress.js` — Progress Engine

```javascript
// Namespace: window.DM
// Storage key: 'dm_progress_v1'
// Pass score: 12 out of 30

DM.getProgress()        // Returns progress object
DM.recordResult(unit, score)  // Saves score, marks completed if >= 12
DM.markCaseViewed(unit)       // Marks case study as viewed
DM.isUnlocked(unit)           // Chain lock: unit N requires unit N-1 complete
DM.isCompleted(unit)          // Check if unit passed
DM.getBest(unit)              // Get best score for unit
DM.isCaseViewed(unit)         // Check if case studies viewed
DM.applyPageLock(unit)        // Shows lock overlay if locked, updates nav
DM.resetAll()                 // Reset all progress
```

**Chain lock rule:** Unit 1 always unlocked. Unit N (N>1) unlocked only when Unit N-1 completed (score >= 12).

**Lock overlay:** Full-screen overlay with lock icon, message, "Go to Activity" button, "Dashboard" button.

**Nav lock:** Greyed-out links for locked units, lock icon inserted.

### `dm-platform.js` — Accessibility & Security

```javascript
// Namespace: window.DMPlatform

// Features:
// - Right-click disabled with toast notification
// - Skip-to-content link for keyboard users
// - Accessibility toolbar (fixed bottom-right):
//   - Font size adjustment (80%-160%)
//   - High contrast mode toggle
//   - Read aloud (text-to-speech)
// - Touch device detection
// - Touch navigation deck (Back/Submit/Finish buttons)
// - Swipe navigation between pages
// - Security meta tags (no-referrer, nosniff, no-store)
```

### `dm-engagement.js` — Engagement Layer

```javascript
// Namespace: window.DMEngagement
// Runs ONLY on activity pages with case studies

// Features:
// - Case study panel (purple gradient, inserted above quiz)
//   - Shows 3 case studies from case-studies.js
//   - Expandable "Key Facts" sections
//   - Focus questions with instant feedback
//   - "Skip to Quiz" and "Start Quiz" buttons
// - Streak tracker (consecutive correct answers)
// - Confetti animation on pass (physics-based, 90 particles)
// - Score pop animation on score change
// - Attention pulse on new question
// - Keyboard shortcuts (ArrowRight = next, Enter = submit)
// - Observer for result panel (auto-triggers confetti)
```

### `case-studies.js` — Case Study Data

```javascript
// Namespace: window.DM_CASE_STUDIES
// Structure: { 1: [...], 2: [...], 3: [...], 4: [...], 5: [...] }
// Each case study object:
{
  title: 'String',
  theme: 'String (short tag)',
  scenario: 'String (2-3 sentences)',
  facts: ['String', 'String', ...],  // 4-5 items
  focusQuestions: [
    {
      q: 'String (question)',
      options: ['A', 'B', 'C', 'D'],  // 4 options
      answer: 0  // index of correct answer
    }
  ],
  tip: 'String (connects case to theory)'
}
```

### `diagram-theme.css` — Mermaid Diagram Styling

```css
/* Enhanced diagram visibility for classroom projection */
/* - 18px+ fonts */
/* - High-contrast dark background */
/* - Zoom controls */
/* - Numbered badges */
/* - Diagram titles */
/* - Explanatory notes */
/* - Print styles */
/* - Mobile responsive */
```

---

## CONTENT REQUIREMENTS

### Per Theory Unit

Write **4-6 theory sections** covering all topics from the syllabus unit. Each section must:
- Have a clear heading with icon
- Include 2-4 paragraphs of explanatory text
- Use bullet points or numbered lists for key concepts
- Include at least one "key point" highlighted box
- Reference at least one diagram

### Per Case Study Set

Write **3 case studies per unit** that:
- Are based on real-world industry scenarios
- Cover different application domains (e.g., healthcare, finance, retail)
- Include specific data points and statistics
- Have focus questions that test conceptual understanding
- Include tips connecting the case to unit theory

### Per Activity

Write **40+ questions per unit** (30 will be randomly selected). Distribute across types:
- 15-18 MCQ questions
- 8-10 True/False questions
- 4-5 Fill-in-the-blank questions
- 3-4 Match-the-terms questions
- 2-3 Formula/Timeline questions

All questions must be sourced from the unit's theory content. No external knowledge required.

---

## QUALITY CHECKLIST

Before delivering, verify:

- [ ] All 23 files present in output folder
- [ ] All pages use consistent light theme with unit-specific colors
- [ ] Dashboard shows all 5 units with correct links
- [ ] Each theory page has 3+ Mermaid diagrams with zoom controls
- [ ] Each activity page has exactly 30 questions (randomized from 40+ pool)
- [ ] Activity pages pass >= 12/30 threshold works correctly
- [ ] Chain lock prevents accessing Unit N without completing Unit N-1
- [ ] Lock overlay appears on locked unit pages
- [ ] Nav links grey out for locked units
- [ ] Confetti fires on passing an activity
- [ ] Case study panel appears on activity pages before quiz
- [ ] Streak tracker works during quiz
- [ ] Keyboard navigation works (ArrowRight, Enter)
- [ ] Touch controls appear on mobile devices
- [ ] Font size adjustment works (80%-160%)
- [ ] High contrast mode toggles correctly
- [ ] Right-click is disabled with toast notification
- [ ] Search and filter work on annexure page
- [ ] All CDN links are valid (Font Awesome, Mermaid)
- [ ] No console errors in browser
- [ ] Responsive layout works on mobile screens

---

## SYLLABUS FORMAT

Provide the syllabus in this format for best results:

```markdown
Course: [Course Name]
Code: [Course Code]
Semester: [Semester]

Unit 1: [Unit Title]
- Topic 1.1: [Topic Name]
- Topic 1.2: [Topic Name]
- Topic 1.3: [Topic Name]

Unit 2: [Unit Title]
- Topic 2.1: [Topic Name]
- Topic 2.2: [Topic Name]
- Topic 2.3: [Topic Name]

Unit 3: [Unit Title]
- Topic 3.1: [Topic Name]
- Topic 3.2: [Topic Name]
- Topic 3.3: [Topic Name]

Unit 4: [Unit Title]
- Topic 4.1: [Topic Name]
- Topic 4.2: [Topic Name]
- Topic 4.3: [Topic Name]

Unit 5: [Unit Title]
- Topic 5.1: [Topic Name]
- Topic 5.2: [Topic Name]
- Topic 5.3: [Topic Name]

Textbooks:
1. [Author, Title, Publisher]
2. [Author, Title, Publisher]
```

---

## USAGE

1. Save this prompt as `BUILD_PROMPT.md`
2. Prepare your syllabus in the format above
3. Feed both to an AI coding assistant with the instruction:
   > "Using BUILD_PROMPT.md as system instructions, generate a complete TLM website from the following syllabus: [paste syllabus]"
4. The AI will output all 23 files
5. Save files to a folder and open `index.html` in a browser

---

*Prompt version: 1.0 | Compatible with any 5-unit course syllabus*
