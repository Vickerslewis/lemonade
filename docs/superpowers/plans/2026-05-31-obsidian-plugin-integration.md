# Obsidian Plugin Integration — Lemonade Vault Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate six Obsidian community plugins (Dataview, Charts, Templater, Tasks, Tracker, Calendar) into the Lemonade vault to add live statistics, visualisations, recurring reminders, and improved note creation.

**Architecture:** Single-file vault structure preserved. Dataview and DataviewJS queries operate on existing frontmatter. Charts replaces the existing Mermaid xychart block in Seizure Log. Templater replaces static YYYY-MM-DD placeholders in all templates. Tasks adds structured reminders for periodic treatments and follow-ups. Tracker visualises weight over time in a new dedicated note. Calendar requires no note changes — it reads vault dates automatically.

**Tech Stack:** Obsidian vault (Markdown), Dataview plugin (DQL + DataviewJS), Obsidian Charts plugin, Templater plugin, Obsidian Tasks plugin, Obsidian Tracker plugin.

---

## File Map

**Modified:**
- `Seizure Log.md` — DataviewJS stats block + Charts bar chart (replaces Mermaid)
- `Lemonade.md` — Dataview active conditions query (replaces static Known conditions bullet)
- `Diagnoses.md` — Dataview live table at top of `## Active`
- `Medications.md` — new `## Reminders` section with Tasks items
- `Diet and Supplements.md` — new `## Weight Monitoring` section
- `_templates/Care Note.md`, `Diagnosis.md`, `History Note.md`, `Hub.md`, `Imaging.md`, `Medications.md`, `Seizure Log.md`, `Vet Visits.md` — Templater date expressions

**Created:**
- `Weight Log.md` — weight tracking note with Tracker chart
- `_templates/New Seizure Entry.md` — Templater snippet for logging a new seizure

---

### Task 1: Seizure Log — DataviewJS Statistics Block

**Files:**
- Modify: `Seizure Log.md`

- [ ] **Step 1: Locate the insertion point**

  Open `Seizure Log.md`. Find the `## Trends` section, then `### Inter-Seizure Intervals`. The DataviewJS block goes immediately after that heading, before the existing Mermaid block.

- [ ] **Step 2: Insert the DataviewJS block**

  Add the following after `### Inter-Seizure Intervals`:

  ````markdown
  ```dataviewjs
  // Update seizureDates when a new seizure is recorded
  const seizureDates = [
    new Date("2025-11-19"),
    new Date("2026-01-13"),
    new Date("2026-04-28")
  ];

  const today = new Date();
  const last = seizureDates[seizureDates.length - 1];
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSince = Math.floor((today - last) / msPerDay);

  const intervals = [];
  for (let i = 1; i < seizureDates.length; i++) {
    intervals.push(Math.floor((seizureDates[i] - seizureDates[i - 1]) / msPerDay));
  }
  const avgInterval = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);

  const nextWindow = new Date(last);
  nextWindow.setDate(nextWindow.getDate() + avgInterval);

  const fmt = d => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  dv.paragraph(
    `| Stat | Value |\n` +
    `|---|---|\n` +
    `| **Total seizures** | ${seizureDates.length} |\n` +
    `| **Last seizure** | ${fmt(last)} |\n` +
    `| **Days since last** | ${daysSince} |\n` +
    `| **Average interval** | ${avgInterval} days |\n` +
    `| **Estimated next window** | around ${fmt(nextWindow)} *(small sample — do not draw conclusions)* |`
  );
  ```
  ````

- [ ] **Step 3: Verify in Obsidian**

  Open `Seizure Log.md` in reading view. Confirm:
  - A 5-row table renders (Total, Last seizure, Days since, Average interval, Estimated next window)
  - Total seizures = 3
  - Last seizure = 28 April 2026
  - Days since last = a positive integer
  - Average interval = 80 days
  - Estimated next window = around 17 July 2026
  - No Dataview error banner

- [ ] **Step 4: Commit**

  ```bash
  git add "Seizure Log.md"
  git commit -m "feat: add DataviewJS seizure statistics block"
  ```

---

### Task 2: Seizure Log — Replace Mermaid Chart with Obsidian Charts

**Files:**
- Modify: `Seizure Log.md`

- [ ] **Step 1: Delete the existing Mermaid block**

  In `Seizure Log.md`, locate and remove the entire block below (including the triple-backtick fences):

  ```
  xychart-beta
      title "Days Between Seizures"
      x-axis ["S1 → S2 (Nov–Jan)", "S2 → S3 (Jan–Apr)"]
      y-axis "Days" 0 --> 120
      bar [55, 105]
      line [55, 105]
  ```

- [ ] **Step 2: Insert the Charts block in its place**

  ````markdown
  ```chart
  type: bar
  labels: ["S1 → S2 (Nov–Jan)", "S2 → S3 (Jan–Apr)"]
  series:
    - title: Days Between Seizures
      data: [55, 105]
  tension: 0.2
  width: 80%
  labelColors: false
  fill: false
  beginAtZero: true
  ```
  ````

- [ ] **Step 3: Verify in Obsidian**

  Open `Seizure Log.md` in reading view. Confirm:
  - A bar chart renders with two bars
  - Labels read "S1 → S2 (Nov–Jan)" and "S2 → S3 (Jan–Apr)"
  - Bar heights visually reflect ~55 and ~105 days
  - The blockquote `> Average interval: **80 days**...` is still visible below the chart
  - No plugin error message

- [ ] **Step 4: Commit**

  ```bash
  git add "Seizure Log.md"
  git commit -m "feat: replace Mermaid xychart with Obsidian Charts bar chart"
  ```

---

### Task 3: Lemonade.md — Dataview Active Conditions Query

**Files:**
- Modify: `Lemonade.md`

- [ ] **Step 1: Remove the static Known conditions bullet**

  In `Lemonade.md` in `## Quick Facts`, delete this line in its entirety:

  ```
  - **Known conditions:** [[Bilateral Carpal and Toe Osteoarthritis]], [[Idiopathic Epilepsy]]
  ```

- [ ] **Step 2: Add the Dataview block after the Quick Facts list**

  Immediately after the `- **Temperament:** ...` bullet (the last item in the list), add:

  ````markdown
  **Active conditions:**

  ```dataview
  TABLE WITHOUT ID file.link AS "Condition", date_diagnosed AS "Diagnosed", severity AS "Severity"
  FROM "/"
  WHERE type = "diagnosis" AND status = "active"
  SORT date_diagnosed ASC
  ```
  ````

- [ ] **Step 3: Verify in Obsidian**

  Open `Lemonade.md` in reading view. Confirm:
  - A table renders with columns Condition, Diagnosed, Severity
  - Two rows appear: Bilateral Carpal and Toe Osteoarthritis, Idiopathic Epilepsy
  - Condition links navigate to their notes
  - No Dataview error

- [ ] **Step 4: Commit**

  ```bash
  git add Lemonade.md
  git commit -m "feat: add Dataview active conditions query to hub"
  ```

---

### Task 4: Diagnoses.md — Dataview Live Table

**Files:**
- Modify: `Diagnoses.md`

- [ ] **Step 1: Insert the Dataview block at the top of `## Active`**

  In `Diagnoses.md`, add the following immediately after the `## Active` heading and before the first `### [[Bilateral...]]` H3:

  ````markdown
  ```dataview
  TABLE WITHOUT ID file.link AS "Condition", date_diagnosed AS "Diagnosed", severity AS "Severity", status AS "Status"
  FROM "/"
  WHERE type = "diagnosis" AND status = "active"
  SORT date_diagnosed ASC
  ```
  ````

- [ ] **Step 2: Verify in Obsidian**

  Open `Diagnoses.md` in reading view. Confirm:
  - A table renders at the top of `## Active` with four columns
  - Two rows, matching the two active diagnoses
  - The handwritten H3 entries below are unaffected

- [ ] **Step 3: Commit**

  ```bash
  git add Diagnoses.md
  git commit -m "feat: add Dataview live table to Diagnoses index"
  ```

---

### Task 5: Medications.md — Tasks Reminders Section

**Files:**
- Modify: `Medications.md`

- [ ] **Step 1: Insert the `## Reminders` section**

  In `Medications.md`, add the following between `## Supplements and Other Products` and `## Past Medications`:

  ```markdown
  ## Reminders

  > [!note]
  > Check off when done. Recurring tasks reset automatically. View all outstanding reminders vault-wide via a Tasks query.

  ### Periodic Treatments

  - [ ] Simparica Trio — monthly dose 🔁 every month 📅 2026-06-13
  - [ ] Cytopoint injection — check if flare-up warrants dose 🔁 every 3 months 📅 2026-08-13
  - [ ] Anal gland expression — check if needed 🔁 every 3 months 📅 2026-08-13

  ### Follow-ups from May 2026 Specialist Visit

  - [ ] Arrange K-laser physiotherapy via local vet 📅 2026-06-07
  - [ ] 1-month reassessment with specialist 📅 2026-06-14
  ```

- [ ] **Step 2: Verify in Obsidian**

  Open `Medications.md` in reading view. Confirm:
  - Five checkboxes render with due date badges
  - The three periodic tasks show the 🔁 recurrence icon
  - Test recurring behaviour: check the Simparica Trio task, confirm a new instance is created dated 2026-07-13, then undo/uncheck to restore the original

- [ ] **Step 3: Commit**

  ```bash
  git add Medications.md
  git commit -m "feat: add Tasks reminders section to Medications"
  ```

---

### Task 6: Weight Log.md — New Note with Tracker Chart

**Files:**
- Create: `Weight Log.md`

- [ ] **Step 1: Create the note**

  Create `Weight Log.md` at the vault root. The file has three parts: frontmatter, a Tracker chart block, and a log section.

  **Frontmatter:**
  ```yaml
  ---
  title: Weight Log
  type: care
  date_created: 2026-05-31
  date_updated: 2026-05-31
  tags: [lemonade, care, diet]
  ---
  ```

  **Body — paste this after the frontmatter:**
  ```markdown
  # Weight Log

  > Weight records for monitoring lean body condition — one of the two most important factors in managing [[Bilateral Carpal and Toe Osteoarthritis]]. Record at each vet visit or home weigh-in.

  ## Chart
  ```

  **Tracker block — paste this immediately after the `## Chart` heading (use triple backticks as the code fence, language `tracker`):**
  ```
  searchType: text
  searchTarget: weight
  folder: /
  specifiedFilesOnly: true
  file: Weight Log
  dateType: header
  dateFormat: YYYY-MM-DD
  line:
    title: Lemonade's Weight (kg)
    yAxisLabel: Weight (kg)
    yMin: 30
    yMax: 40
  ```

  **Log section — paste this after the closing fence of the Tracker block:**
  ```markdown
  ## Log

  *Most recent first. Add a new H3 heading with the date, then `weight: <value>` on the next line.*

  ### 2026-05-13
  weight: 35
  ```

- [ ] **Step 2: Verify in Obsidian**

  Open `Weight Log.md` in reading view. Confirm:
  - The Tracker block renders a line chart with a single data point at 35 kg on 2026-05-13
  - Y-axis spans 30–40 kg
  - Chart title shows "Lemonade's Weight (kg)"
  - If Tracker renders an error, check: (a) the `file:` value matches the exact note name without `.md`; (b) Tracker plugin settings → confirm it has permission to read all files

- [ ] **Step 3: Commit**

  ```bash
  git add "Weight Log.md"
  git commit -m "feat: create Weight Log note with Tracker chart"
  ```

---

### Task 7: Diet and Supplements.md — Weight Monitoring Section

**Files:**
- Modify: `Diet and Supplements.md`

- [ ] **Step 1: Add the Weight Monitoring section**

  In `Diet and Supplements.md`, add the following immediately after the existing `## Weight Management` section:

  ```markdown
  ## Weight Monitoring

  Lemonade's weight is recorded over time in [[Weight Log]] — update it at each vet visit or home weigh-in.

  > [!tip]
  > Maintaining lean body condition is one of the two most important factors in arthritis management (alongside activity). Even 1–2 kg above ideal meaningfully increases joint load.
  ```

- [ ] **Step 2: Verify in Obsidian**

  Open `Diet and Supplements.md` in reading view. Confirm:
  - The new section appears after `## Weight Management`
  - `[[Weight Log]]` resolves as a working link (no broken link highlight)

- [ ] **Step 3: Commit**

  ```bash
  git add "Diet and Supplements.md"
  git commit -m "feat: add Weight Monitoring section linking to Weight Log"
  ```

---

### Task 8: Templates — Templater Date Expressions

**Files:**
- Modify: `_templates/Care Note.md`, `_templates/Diagnosis.md`, `_templates/History Note.md`, `_templates/Hub.md`, `_templates/Imaging.md`, `_templates/Medications.md`, `_templates/Seizure Log.md`, `_templates/Vet Visits.md`

- [ ] **Step 1: Confirm Templater folder setting**

  In Obsidian → Settings → Templater → Template folder location, confirm it is set to `_templates`. If not, set it now before proceeding.

- [ ] **Step 2: Update date_created and date_updated in all 8 templates**

  In each of the 8 template files, replace:

  ```yaml
  date_created: YYYY-MM-DD
  date_updated: YYYY-MM-DD
  ```

  With:

  ```yaml
  date_created: <% tp.date.now("YYYY-MM-DD") %>
  date_updated: <% tp.date.now("YYYY-MM-DD") %>
  ```

  Also replace any other bare `YYYY-MM-DD` date placeholders in table cells or prose within each template (not in field name keys or example values in comments).

- [ ] **Step 3: Verify one template**

  Use Templater to insert `_templates/Diagnosis` into a new scratch note (Templater hotkey or command palette → "Templater: Open insert template modal"). Confirm:
  - `date_created` and `date_updated` are populated with today's date (e.g. `2026-05-31`)
  - No literal `<% %>` syntax appears anywhere in the rendered note
  - Delete the test note after verification

- [ ] **Step 4: Commit**

  ```bash
  git add _templates/
  git commit -m "feat: add Templater date expressions to all templates"
  ```

---

### Task 9: New Seizure Entry Template

**Files:**
- Create: `_templates/New Seizure Entry.md`
- Modify: `Seizure Log.md`

- [ ] **Step 1: Create the template**

  Create `_templates/New Seizure Entry.md` with the following content:

  ```markdown
  ### <% tp.date.now("YYYY-MM-DD") %> — {{TBD time}}

  - **Duration:** {{TBD}}
  - **Type:** Generalised / Focal
  - **Pre-ictal (24 h prior):** {{TBD}}
  - **Description:** {{TBD}}
  - **Post-ictal:** {{TBD}}
  - **Possible triggers:** {{TBD}}
  - **Medications that day:** {{TBD}}
  - **Recovery time:** {{TBD}}
  - **Notes:** {{TBD}}

  ---
  ```

- [ ] **Step 2: Verify the template**

  Insert `_templates/New Seizure Entry` into a scratch note via the Templater modal. Confirm:
  - The H3 heading shows today's date followed by `— {{TBD time}}`
  - All fields are present with `{{TBD}}` placeholders
  - No literal `<% %>` appears
  - Delete the scratch content

- [ ] **Step 3: Add usage tip to Seizure Log.md**

  In `Seizure Log.md`, in the `## How to Log` section, insert the following callout at the very top of that section (before the existing bullet list):

  ```markdown
  > [!tip]
  > Use the **New Seizure Entry** template to pre-fill today's date. Open the Templater modal (command palette → "Templater: Open insert template modal"), select `New Seizure Entry`, and paste the output at the top of the Detail Entries section. Then update the DataviewJS data array in `## Trends` with the new date.
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add "_templates/New Seizure Entry.md" "Seizure Log.md"
  git commit -m "feat: add New Seizure Entry Templater snippet"
  ```
