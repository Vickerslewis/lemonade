---
title: Seizure Log
type: seizure-log
date_created: 2026-05-13
date_updated: 2026-05-13
tags: [lemonade, health, epilepsy, seizure-log]
---

# Seizure Log

> [!important]
> **Seek emergency vet care immediately if:**
> - Any single seizure lasts longer than 5 minutes
> - Two or more seizures occur within 24 hours
> - He does not recover normally between seizures
> - New neurological signs (weakness, blindness, behaviour change) persist

## Seizure Log

| #   | Date       | Time    | Duration      | Type        | Pre-ictal summary                                                                                     | Post-ictal summary                            | Recovery |
| --- | ---------- | ------- | ------------- | ----------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------- | -------- |
| 3   | 2026-04-28 | ~03:00  | ~50 sec       | Generalised | 2h anxiety, noisce sensitivity, pacing, staring. Lemonade was under general anaesthesia 14 hour prior | Calm, no aggression                           | ~20 mins |
| 2   | 2026-01-13 | {{TBD}} | ~1 min 20 sec | Generalised | 24 h anxiety, noise sensitivity, pacing, staring                                                      | Confused, aggressive, did not recognise owner | ~20 min  |
| 1   | 2025-11-19 | {{TBD}} | ~1 min        | Generalised | 24 h nervous, jumpy, staring                                                                          | Aggressive barking and biting 3–6 min         | ~30 min  |

---

## Trends

### Inter-Seizure Intervals

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

```chart
type: bar
labels: ["S1 → S2 (Nov–Jan)", "S2 → S3 (Jan–Apr)"]
series:
  - title: Days Between Seizures
    data: [55, 105]
width: 80%
labelColors: false
beginAtZero: true
```

---

## How to Log

For each new event, record:

- **Date and time** — as precisely as possible
- **Duration** — start to end of active seizure movements
- **Type** — focal (one body part) or generalised (whole body)
- **Pre-ictal signs** — anything unusual in the hours before: restlessness, hiding, staring, anxiety, pacing, vocalisation, sound sensitivity
- **Description** — what the seizure looked like in detail
- **Post-ictal signs** — confusion, blindness, hunger, exhaustion, aggression; note duration
- **Possible triggers** — stress, exercise, missed medications, sleep disruption, sound/light sensitivity
- **Medications that day** — confirm all doses given on time
- **Recovery time** — how long until fully back to normal

---

## Detail Entries

### 2026-04-28 — ~03:00

- **Duration:** ~50 seconds
- **Type:** Generalised
- **Pre-ictal:** 2h anxiety, noisce sensitivity, pacing, staring. Lemonade was under general anaesthesia 14 hour prior
- **Description:** Occurred during sleep
- **Post-ictal:** Calm on waking; no aggression
- **Possible triggers:** General Anaesthesia
- **Medications that day:** General Anaesthesia
- **Recovery time:** 20 minutes
- **Context:** Night of the X-ray appointment at the local vet (same day)

---

### 2026-01-13 — {{TBD}}

- **Duration:** ~1 minute 20 seconds
- **Type:** Generalised
- **Pre-ictal (24 h prior):** Very nervous throughout the night for 3–4 hours; fearful of normal household sounds (especially wind); pacing for long periods; staring at the ceiling; could not settle
- **Description:** Full body seizure; started when asleep; urinated during seizure
- **Post-ictal:** Very confused; barking, growling, defensive behaviour; did not recognise owner initially; resolved after ~20 minutes
- **Possible triggers:** Sound sensitivity — wind
- **Recovery time:** ~20 minutes to calm; fully normal afterwards

---

### 2025-11-19 — {{TBD}}

- **Duration:** ~1 minute
- **Type:** Generalised
- **Pre-ictal (24 h prior):** Nervous, jumpy, unsettled; staring into the distance (presumed fearful of something in the flat)
- **Description:** Full body convulsions; drooling; stiffening; complete loss of awareness; did not urinate or defecate
- **Post-ictal:** Aggressively barking and biting for 3–6 minutes
- **Possible triggers:** Unknown
- **Recovery time:** ~30 minutes to fully normal
- **Vet evaluation:** Full physical exam normal; reflex/neuro exam normal; bloodwork normal. Vet recommendation: monitor; treat if recurrence within 3 months.

---

## Patterns to Watch For

- **Time of day:** All three seizures occurred at night or during sleep
- **Inter-seizure interval:** Episode 1→2: 55 days; episode 2→3: 105 days (small sample — do not draw conclusions yet)
- **Pre-ictal window:** Episodes 1 and 2 preceded by ~24 hours of heightened anxiety and abnormal behaviour — possible prodrome
- **Post-ictal aggression:** Significant after episodes 1 and 2; absent after episode 3
- **No known toxin exposure, diet changes, or missed medications** for any episode
- **Sound sensitivity** (wind, household noises) may correlate with pre-seizure periods (episodes 1 and 2)
- **Cluster events** (two or more within 24 hours) — emergency threshold
