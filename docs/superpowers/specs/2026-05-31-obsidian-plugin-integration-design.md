# Obsidian Plugin Integration — Lemonade Vault

**Date:** 2026-05-31  
**Status:** Approved  
**Scope:** Integrate Dataview, Obsidian Charts, DataviewJS, Templater, Tasks, and Tracker into the existing single-file vault structure (Option A).

---

## Context

The Lemonade vault tracks health, medications, seizures, vet visits, and care guidance for a 6-year-old male Golden Retriever with confirmed idiopathic epilepsy and bilateral carpal/toe osteoarthritis. The vault uses a single-file-per-topic structure (one `Seizure Log.md`, one `Medications.md`, etc.) rather than one-note-per-event. All plugin integrations must respect this structure and conform to the existing style guide.

Installed plugins: `dataview`, `obsidian-charts`, `obsidian-tasks-plugin`, `obsidian-tracker`, `templater-obsidian`, `calendar`.

---

## Changes

### 1. `Seizure Log.md` — DataviewJS stats block + Charts

**What:** Replace the existing `xychart-beta` Mermaid block in the `## Trends` section with:
1. A DataviewJS stats block immediately above the chart
2. An Obsidian Charts bar chart replacing the Mermaid block

**DataviewJS block** — hardcoded seizure data array (updated manually when a new seizure is logged). Calculates and renders:
- Total seizure count
- Date of last seizure
- Days since last seizure (live, relative to today)
- Average inter-seizure interval in days
- Estimated next window (last date + average interval)

The data array lives at the top of the script block so it is easy to update without touching the calculation logic.

**Charts block** — bar chart of inter-seizure intervals in days. Labels are `["S1 → S2", "S2 → S3"]`, data `[55, 105]`. Uses the `obsidian-charts` YAML code block syntax. Replaces Mermaid because `xychart-beta` rendering is inconsistent across Obsidian versions.

**How to update when a new seizure occurs:**
1. Add the detail entry and summary table row as normal
2. Add the new date to the DataviewJS data array
3. Add the new interval to the Charts data array and labels

---

### 2. `Lemonade.md` — Dataview active conditions (hub)

**What:** In `## Quick Facts`, remove the static `**Known conditions:** [[Bilateral Carpal and Toe Osteoarthritis]], [[Idiopathic Epilepsy]]` line entirely and replace it with a Dataview query block. The query renders a small table inline — no surrounding prose label is needed since the section heading makes the context clear.

**Query:** `TABLE WITHOUT ID ("[[" + file.name + "]]") AS "Condition", date_diagnosed AS "Diagnosed", severity AS "Severity" FROM "/" WHERE type = "diagnosis" AND status = "active" SORT date_diagnosed ASC`

**Effect:** As new diagnoses are added or conditions change status, the hub updates automatically.

---

### 3. `Diagnoses.md` — Dataview active conditions index

**What:** Add a Dataview query at the top of `## Active` that renders a live table of active diagnoses from frontmatter. The handwritten prose entries below each condition (clinical context, seizure count, etc.) are retained — they are not queryable from frontmatter and provide important context not captured in YAML.

**Query:** Same as #2 but rendered as a full table with condition, date_diagnosed, severity, and status columns.

---

### 4. `Medications.md` — Tasks reminders section

**What:** Add a new `## Reminders` section at the bottom of `Medications.md` (before `## Reserved / Future Options`) containing Tasks-formatted items for periodic and time-sensitive obligations.

**Recurring tasks (Tasks plugin syntax with 🔁):**
- Simparica Trio dose — every month
- Cytopoint injection check — every 3 months
- Anal gland expression check — every 3 months

**One-off tasks (from the May 2026 specialist visit):**
- Arrange K-laser physiotherapy via local vet
- 1-month reassessment with specialist

Due dates are set to the next expected occurrence based on known history or the May 2026 visit date.

---

### 5. `_templates/` — Templater date auto-fill

**What:** Update all existing template files to replace static `YYYY-MM-DD` frontmatter placeholders with Templater expressions.

| Placeholder | Replacement |
|---|---|
| `date_created: YYYY-MM-DD` | `date_created: <% tp.date.now("YYYY-MM-DD") %>` |
| `date_updated: YYYY-MM-DD` | `date_updated: <% tp.date.now("YYYY-MM-DD") %>` |

Templates affected: `Care Note.md`, `Diagnosis.md`, `History Note.md`, `Hub.md`, `Imaging.md`, `Medications.md`, `Seizure Log.md`, `Vet Visits.md`.

**New template: `_templates/New Seizure Entry.md`**

A self-contained snippet (not a full note template) for quickly logging a new seizure event into `Seizure Log.md`. Contains:
- A pre-filled H3 heading: `### <% tp.date.now("YYYY-MM-DD") %> — {{TBD time}}`
- All detail entry fields (`Duration`, `Type`, `Pre-ictal`, `Description`, `Post-ictal`, `Possible triggers`, `Medications that day`, `Recovery time`) pre-filled with `{{TBD}}`

Usage: open the template via Templater, copy the rendered output, paste it into the Detail Entries section of `Seizure Log.md`.

---

### 6. `Weight Log.md` — Tracker weight chart (new note)

**What:** Create a new note `Weight Log.md` to track Lemonade's weight over time. Weight is flagged by the specialist as one of the two most important factors in arthritis management, but is currently only recorded as a single point-in-time value in `Lemonade.md`.

**Structure:**
- Frontmatter: `type: care`, tags include `lemonade`, `care`, `diet`
- `## Log` — dated H3 entries, one per weigh-in (format: `### YYYY-MM-DD`), each containing `weight: 35` on its own line. Tracker reads H3 headings as dates and extracts the `weight:` value beneath them.
- `## Chart` — an Obsidian Tracker block that scans this note for `weight:` values under H3 date headings and plots them as a line chart

**Tracker config:** `searchType: text`, `searchTarget: weight`, `dateType: header`, `dateFormatPrefix: "### "`, `dateFormat: YYYY-MM-DD`, renders as `line` chart.

**Log entry format:**
```
### 2026-05-13
weight: 35
```

The starting entry is seeded from the known May 2026 weight (35 kg).

**`Diet and Supplements.md`** — add a `## Weight Monitoring` section linking to `Weight Log.md` and noting the specialist's guidance on lean body condition.

---

## Files Changed

| File | Change |
|---|---|
| `Seizure Log.md` | DataviewJS stats block + Charts bar chart (replaces Mermaid) |
| `Lemonade.md` | Dataview active conditions query in Quick Facts |
| `Diagnoses.md` | Dataview active conditions table in ## Active |
| `Medications.md` | New ## Reminders section with Tasks items |
| `Diet and Supplements.md` | New ## Weight Monitoring section linking to Weight Log |
| `_templates/Care Note.md` | Templater date expressions |
| `_templates/Diagnosis.md` | Templater date expressions |
| `_templates/History Note.md` | Templater date expressions |
| `_templates/Hub.md` | Templater date expressions |
| `_templates/Imaging.md` | Templater date expressions |
| `_templates/Medications.md` | Templater date expressions |
| `_templates/Seizure Log.md` | Templater date expressions |
| `_templates/Vet Visits.md` | Templater date expressions |

## Files Created

| File | Purpose |
|---|---|
| `Weight Log.md` | Weight tracking note with Tracker visualisation |
| `_templates/New Seizure Entry.md` | Templater snippet for quickly logging a new seizure |

---

## Out of Scope

- Changing the single-file vault structure to per-event notes
- Adding daily notes or a daily journalling workflow
- Modifying `Seizure Log.md`'s table structure or detail entry format
- Any changes to `_meta/STYLE_GUIDE.md` (all changes conform to the existing guide)
