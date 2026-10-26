---
title: Seizure Log
type: seizure-log
date_created: 2026-05-13
date_updated: 2026-10-26
tags: [lemonade, health, epilepsy, seizure-log]
---

# Seizure Log

> [!important]
> **Seek emergency vet care immediately if:**
> - Any single seizure lasts longer than 3 minutes (give rectal diazepam first — see [[Seizure Action Plan]])
> - Two or more seizures occur within 24 hours
> - He does not recover normally between seizures
> - New neurological signs (weakness, blindness, behaviour change) persist

## Seizure Log

| #   | Date       | Time  | Duration      | Type        | Pre-ictal summary                                                                                      | Post-ictal summary                                              | Recovery   |
| --- | ---------- | ----- | ------------- | ----------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ---------- |
| 5   | 2026-10-22 | 06:21 | ~1 min 20 sec | Generalised | **Cluster event** — occurred ~5h 47m after seizure 4; still post-ictal from prior episode             | Erratic behaviour; calmed after 10–15 min; stayed asleep after | ~10–15 min |
| 4   | 2026-10-22 | 00:34 | ~1 min        | Generalised | ~20h pacing, staring, not settling; woke carer at 4AM                                                 | Barking; settled after 15–20 min; drank heavily; then excited  | ~15–20 min |
| 3   | 2026-04-28 | ~03:00 | ~50 sec      | Generalised | 2h anxiety, noise sensitivity, pacing, staring. Lemonade was under general anaesthesia 14 hours prior | Calm, no aggression                                             | ~20 mins   |
| 2   | 2026-01-13 | {{TBD}} | ~1 min 20 sec | Generalised | 24h anxiety, noise sensitivity, pacing, staring                                                      | Confused, aggressive, did not recognise owner                   | ~20 min    |
| 1   | 2025-11-19 | {{TBD}} | ~1 min      | Generalised | 24h nervous, jumpy, staring                                                                            | Aggressive barking and biting 3–6 min                          | ~30 min    |

---

## Trends

### Inter-Seizure Intervals

```dataviewjs
// Update seizureDates when a new seizure is recorded (one entry per seizure)
const seizureDates = [
  new Date("2025-11-19"),
  new Date("2026-01-13"),
  new Date("2026-04-28"),
  new Date("2026-10-22"),
  new Date("2026-10-22")
];

const today = new Date();
const last = seizureDates[seizureDates.length - 1];
const msPerDay = 1000 * 60 * 60 * 24;
const daysSince = Math.floor((today - last) / msPerDay);

// Same-day seizures (clusters) count as one episode for intervals
const episodeDates = [...new Set(seizureDates.map(d => d.getTime()))].map(t => new Date(t));
const intervals = [];
for (let i = 1; i < episodeDates.length; i++) {
  intervals.push(Math.floor((episodeDates[i] - episodeDates[i - 1]) / msPerDay));
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
labels: ["S1 → S2 (Nov–Jan)", "S2 → S3 (Jan–Apr)", "S3 → S4 (Apr–Oct)"]
series:
  - title: Days Between Seizures
    data: [55, 105, 177]
width: 80%
labelColors: false
beginAtZero: true
```

> Seizures 4 and 5 (2026-10-22) were a cluster, 5 h 47 min apart, so they count as one episode in the intervals above.

---

## Prodrome Log

Northwest asked for a record of every prodrome, not just seizures, so they can judge whether prodrome-triggered levetiracetam is working over time.

| Date | Start time | Signs | Levetiracetam started? | Seizure followed? | Notes |
| ---- | ---------- | ----- | ---------------------- | ----------------- | ----- |
| 2026-10-21 | ~04:00 | Pacing, staring, not settling; woke carer | No (not yet prescribed) | Yes — seizures 4 and 5 | Owner abroad |
| 2026-05-31 | before 08:27 | Pre-seizure behaviour; blinds closed, quiet environment | No | No | |

---

## How to Log

> [!tip]
> Use the **New Seizure Entry** template to pre-fill today's date. Open the Templater modal (command palette → "Templater: Open insert template modal"), select `New Seizure Entry`, and paste the output at the top of the Detail Entries section. Then update the DataviewJS data array in `## Trends` with the new date.

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

### 2026-10-22 — 06:21 (Seizure 5 — Cluster)

- **Duration:** ~1 minute 20 seconds
- **Type:** Generalised
- **Pre-ictal:** Cluster event — occurred ~5h 47m after seizure 4; no distinct new prodrome
- **Description:** Occurred during sleep; Lemonade did not get up immediately after — remained asleep for ~1 minute before waking
- **Post-ictal:** Erratic behaviour; calmed after 10–15 minutes
- **Possible triggers:** Cluster following seizure 4
- **Medications:** Short-term anticonvulsant prescribed by emergency vet following this event (every 8 hours; loading dose 3 pills, maintenance 1.5 pills); may cause drowsiness
- **Recovery time:** ~10–15 minutes
- **Context:** Emergency vet attended — vitals and neurological response checks clear; discharged with medication pending specialist review in Liverpool

---

### 2026-10-22 — 00:34 (Seizure 4)

- **Duration:** ~1 minute
- **Type:** Generalised
- **Pre-ictal (~20h prior):** Pacing, staring, unable to settle; woke carer (Paola) at ~04:00 on 21st October by bringing toys and not settling — owner identified this as consistent with his prodrome
- **Description:** Occurred during sleep, in a tight space between the bed and the wall; kicking the wall woke the carer
- **Post-ictal:** Barking; did not immediately recognise surroundings; settled after 15–20 minutes; drank heavily; then alert and excited
- **Possible triggers:** Unknown
- **Medications that day:** Unknown — confirm with carer
- **Recovery time:** ~15–20 minutes
- **Context:** Owner was abroad (India); Lemonade being cared for by Paola

---

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

- **Time of day:** All five seizures occurred at night or during sleep
- **Inter-seizure interval:** S1→S2: 55 days; S2→S3: 105 days; S3→S4: 177 days — was trending longer; S4→S5: same day (cluster)
- **Cluster event:** Seizures 4 and 5 occurred ~5h 47m apart on 2026-10-22 — emergency vet attended; vitals clear; short-term anticonvulsant prescribed
- **Pre-ictal window:** Episodes 1, 2 and 4 preceded by ~20–24 hours of heightened anxiety, pacing and staring — consistent prodrome
- **Post-ictal aggression:** Significant after episodes 1, 2 and 4; absent after episodes 3 and 5
- **No known toxin exposure, diet changes, or missed medications** for any episode
- **Sound sensitivity** (wind, household noises) may correlate with pre-seizure periods (episodes 1 and 2)
- **Cluster events** (two or more within 24 hours) — emergency threshold met on 2026-10-22
