---
title: Style Guide
type: meta
date_created: 2026-05-13
date_updated: 2026-05-13
tags: [lemonade, meta]
---

# Style Guide

This document defines the authoritative format and style for every note in this vault. All new notes and any edits to existing notes must conform to it.

---

## 1. YAML Frontmatter

Every note begins with a YAML frontmatter block. Fields are case-sensitive and must appear in the order shown.

### Required Fields (all notes)

| Field | Type | Description |
|---|---|---|
| `title` | string | Exact note title — must match the H1 heading and the filename |
| `type` | enum | Note type (see allowed values below) |
| `date_created` | YYYY-MM-DD | Date the note was first created |
| `date_updated` | YYYY-MM-DD | Date the note was last substantively updated |
| `tags` | list | From the controlled vocabulary only (§ 4) |

### Allowed `type` Values

| Value | Use for |
|---|---|
| `hub` | Main Map of Content / hub note |
| `diagnosis` | Individual condition or diagnosis detail note |
| `medications` | Medication log |
| `vet-visits` | Vet visit log |
| `imaging` | Imaging study log |
| `seizure-log` | Seizure event log |
| `care` | Care and lifestyle guidance notes |
| `history` | Historical context, timeline, and background notes |
| `meta` | Vault management (style guide, README, etc.) |

### Optional / Type-Specific Fields

Append these after the required fields only when applicable.

**Hub notes only:**

```yaml
species: Dog
breed: Golden Retriever
sex: Male
neutered: false
date_of_birth: YYYY-MM-DD
weight_kg: 35
owner: Lewis Vickers
```

**Diagnosis notes only:**

```yaml
condition: kebab-case-slug     # e.g. idiopathic-epilepsy
status: active                 # active | historical | ruled-out
date_diagnosed: YYYY-MM-DD     # or YYYY-MM if day unknown
severity: free text            # e.g. severe left fifth toe, mild-moderate bilateral
```

### Complete Example (diagnosis note)

```yaml
---
title: Idiopathic Epilepsy
type: diagnosis
date_created: 2026-05-13
date_updated: 2026-05-13
tags: [lemonade, health, diagnosis, epilepsy, neurology]
condition: idiopathic-epilepsy
status: active
date_diagnosed: 2026-05
---
```

---

## 2. Date Format

**In frontmatter:** Always ISO 8601.

| Known precision | Format | Example |
|---|---|---|
| Full date | `YYYY-MM-DD` | `2026-05-13` |
| Month only | `YYYY-MM` | `2026-05` |
| Year only | `YYYY` | `2026` |

**In prose:** Use `DD Month YYYY` (e.g., 16 November 2019) when the exact date is known, or `Month YYYY` (e.g., May 2026) when only the month is known. Avoid `DD/MM/YYYY` and `Month DD, YYYY`.

**In tables:** Use `YYYY-MM-DD` for exact dates; `YYYY-MM` for month-only; `{{TBD}}` when unknown.

---

## 3. Heading Hierarchy

- **H1** — note title only. Exactly one per note. Must match `title` frontmatter and filename.
- **H2** — major sections.
- **H3** — subsections within an H2.
- **H4** — used sparingly for deeply nested items. Never use H5 or H6.
- Never skip levels (e.g., no H3 directly under H1).

A brief italicised description or blockquote may appear between the H1 and the first H2.

---

## 4. Tag Taxonomy

All tags must come from this controlled list. Do not invent new tags; do not use synonyms or near-duplicates.

| Tag | Applied to |
|---|---|
| `lemonade` | Every note in the vault — required on all notes |
| `moc` | Hub and navigation notes |
| `health` | All clinical and health-related notes |
| `diagnosis` | Individual condition/diagnosis notes |
| `medications` | Drug and supplement records |
| `imaging` | Imaging study records (X-ray, CT, MRI) |
| `vet-visits` | Vet appointment records |
| `seizure-log` | Seizure event records |
| `epilepsy` | Epilepsy-related notes |
| `neurology` | Neurological domain notes |
| `orthopaedic` | Orthopaedic/musculoskeletal domain notes |
| `arthritis` | Arthritis-specific notes |
| `care` | Care and lifestyle guidance |
| `diet` | Nutrition, diet, and supplements |
| `exercise` | Physical activity and exercise |
| `physiotherapy` | Rehabilitation and physiotherapy |
| `history` | Historical records and timelines |
| `background` | Personal history and temperament |
| `meta` | Vault management notes |

### Retired Tags

Do not use these. They appear in older notes and are superseded by the controlled vocabulary above.

| Old tag | Replaced by |
|---|---|
| `diagnoses` | `diagnosis` |
| `supplements` | `diet` |
| `nutrition` | `diet` |
| `activity` | `exercise` |
| `rehab` | `physiotherapy` |
| `timeline` | `history` |
| `readme` | `meta` |
| `pet` | *(removed — redundant in single-pet vault)* |
| `dog` | *(removed — redundant)* |

---

## 5. Section Order by Note Type

### Hub / MOC

1. Brief description as a blockquote (below H1)
2. `## Quick Facts`
3. `## Map of Content` (H3 sub-sections by category: Health, Care, History)
4. `## Recent Updates` (reverse-chronological bullet list)

### Diagnosis

1. One-sentence summary as a blockquote (below H1)
2. `## Summary`
3. `## Diagnostic Findings`
4. `## Clinical Signs`
5. `## Management` (H3 sub-sections: Medications, Physical, Diet and Supplements, Reserved Options)
6. `## Prognosis`
7. `## Related Notes`

### Medications

1. `## Current Regimen` (structured table)
2. `## Daily Schedule` (table)
3. `## Clinical Notes`
4. `## Past Medications` (table)
5. `## Reserved / Future Options`

### Vet Visits

1. `## Visit Log` (summary table: Date / Type / Location / Summary / Detail)
2. Detail entries in reverse-chronological order (H2 per visit, H3 for sub-sections)

### Imaging

1. `## Imaging Log` (summary table: Date / Modality / Region / Outcome)
2. Detail entries in reverse-chronological order (H2 per study)

### Seizure Log

1. `## Emergency Thresholds` (callout block)
2. `## Seizure Log` (summary table: Date / Time / Duration / Type / Recovery)
3. `## How to Log` (field definitions)
4. Detail entries in reverse-chronological order (H3 per event: `### YYYY-MM-DD — HH:MM`)
5. `## Patterns to Watch For`

### Care / Lifestyle

1. Brief description as a blockquote (below H1)
2. `## Current Approach`
3. `## Guidelines` (H3 sub-sections as needed)
4. `## Observations`
5. `## Long-term / Future Options`

### History / Background

1. `## [YYYY]` — H2 for each year (newest first)
   - H3 for month or period within year
2. `## Earlier` — for pre-record events

---

## 6. Wiki-Link Conventions

- Use the file's exact title (after renaming): `[[Bilateral Carpal and Toe Osteoarthritis]]`
- Use a display alias when the full title is long in running prose: `[[Bilateral Carpal and Toe Osteoarthritis|osteoarthritis]]`
- For section anchors: `[[Note Name#Section Heading]]`
- Every wiki-link must resolve to an actual file. After any rename, update all links that reference it.
- Canonical link targets by topic:
  - Drug or dose details → `[[Medications]]`
  - Seizure event records → `[[Seizure Log]]`
  - Imaging results → `[[Imaging History]]`
  - Condition detail → individual diagnosis note (e.g., `[[Idiopathic Epilepsy]]`)

---

## 7. Callout Conventions

Use Obsidian callout blocks for emphasis. Do not use non-standard callout types.

| Type | When to use |
|---|---|
| `> [!note]` | Supplementary information, caveats, clarifications |
| `> [!info]` | Background context, explanatory material |
| `> [!warning]` | Drug safety warnings, clinical cautions |
| `> [!important]` | Critical thresholds and must-not-miss items |
| `> [!tip]` | Practical owner guidance |

---

## 8. Table Conventions

Use tables for structured, repeating data (medications, visits, imaging, seizure events). Use prose for explanations, narratives, and clinical context.

- Left-align all columns.
- Use `{{TBD}}` for data that is unknown and needs to be filled in.
- Use `—` (em dash, Option+Shift+Hyphen on Mac) for fields that genuinely do not apply.
- Keep table rows concise; link to a detail section or sub-note for lengthy entries.

---

## 9. Placeholder Convention

Use `{{TBD}}` uniformly for any data that is missing and must be filled in later.

**Do not use:** `TODO`, `TBC`, `?`, `*(record...)*`, `*(Add...)*`, or blank fields.

Searching `{{TBD}}` in the vault will find every outstanding gap at a glance.

---

## 10. Voice and Tense

| Context | Rule |
|---|---|
| Ongoing conditions | Present tense: "Lemonade has bilateral osteoarthritis affecting…" |
| Historical events | Past tense: "The MRI showed no structural abnormality." |
| Clinical content | Objective third-person: "he", "Lemonade" — not "my dog" |
| Owner speech | First-person, in blockquote with attribution |
| Advice/guidance | Second-person is acceptable in care notes ("Build up gradually…") |

**Spelling:** British English throughout — anaesthesia, anaesthetic, orthopaedic, paediatric, behaviour, colour, specialise, recognise, manoeuvre, grey.

---

## 11. File Naming

- Title Case, matching the H1 heading and the `title` frontmatter field exactly.
- Spaces are allowed (standard Obsidian practice).
- No special characters:
  - `&` → `and`
  - `–` or `—` → omit or replace with a word
- No leading numbers, dates, or status prefixes in filenames.
- Template files live in `_templates/` and are named after the note type they represent.
- Archived notes live in `_archive/`.

---

## 12. Navigation Rules

- Every note must be reachable from `[[Lemonade]]` (the hub) within two clicks.
- Condition notes must link to the medications used for them (via `[[Medications]]`).
- `[[Medications]]` must link back to the condition each drug treats.
- New vet visits: update `[[Vet Visits]]`, `[[Timeline]]`, and the relevant condition note.
- New seizure: update `[[Seizure Log]]` and `[[Idiopathic Epilepsy]]`.
- New imaging: update `[[Imaging History]]` and the relevant condition note.

---

## 13. Canonical Locations (Duplication Rules)

When the same information could reasonably belong in multiple notes, the canonical location is:

| Information | Canonical location | Other notes should… |
|---|---|---|
| Drug name, dose, frequency, schedule | `[[Medications]]` | Link to `[[Medications]]` |
| Seizure event details | `[[Seizure Log]]` | Link to `[[Seizure Log]]` |
| Imaging findings | `[[Imaging History]]` | Quote summary only; link for detail |
| Diagnosis detail | Individual diagnosis note | Link to it; don't re-explain |
| Diet and supplement details | `[[Diet and Supplements]]` | Link to it |
| Exercise guidance | `[[Exercise and Activity]]` | Link to it |
| Physio and rehab guidance | `[[Physiotherapy and Rehab]]` | Link to it |

---

## 14. Files Included in This Vault

| Filename | Type | Notes |
|---|---|---|
| `Lemonade.md` | hub | Main entry point |
| `Diagnoses.md` | hub | Condition index |
| `Bilateral Carpal and Toe Osteoarthritis.md` | diagnosis | Renamed from `Bilateral Carpal & Toe Osteoarthritis.md` |
| `Idiopathic Epilepsy.md` | diagnosis | |
| `Medications.md` | medications | |
| `Vet Visits.md` | vet-visits | |
| `Imaging History.md` | imaging | |
| `Seizure Log.md` | seizure-log | |
| `Diet and Supplements.md` | care | Renamed from `Diet & Supplements.md` |
| `Exercise and Activity.md` | care | Renamed from `Exercise & Activity.md` |
| `Physiotherapy and Rehab.md` | care | Renamed from `Physiotherapy & Rehab.md` |
| `Seizure Action Plan.md` | care | Added 2026-10-26 |
| `Timeline.md` | history | |
| `Childhood and Background.md` | history | |
| `README.md` | meta | Simplified to short "start here" note |
| `STYLE_GUIDE.md` | meta | This file |
| `REVIEW_NEEDED.md` | meta | Flags for owner review |
| `_templates/` | — | Template files; not searchable notes |
| `_archive/` | — | Legacy documents; preserved but not active |
