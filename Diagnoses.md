---
title: Diagnoses
type: hub
date_created: 2026-05-13
date_updated: 2026-05-31
tags: [lemonade, health, diagnosis, moc]
---

# Diagnoses

## Active

```dataview
TABLE WITHOUT ID file.link AS "Condition", date_diagnosed AS "Diagnosed", severity AS "Severity", status AS "Status"
FROM ""
WHERE type = "diagnosis" AND status = "active" AND !contains(file.path, "_templates")
SORT date_diagnosed ASC
```

### [[Bilateral Carpal and Toe Osteoarthritis]]
- **Diagnosed:** 2026-05 (confirmed by CT)
- **Severity:** Severe on left fifth toe knuckle joint; milder bilateral changes in multiple knuckle joints
- **Cause (suspected):** Wear-and-tear from active lifestyle, with an acute flare from a suspected jarring injury ~3 weeks prior
- **Status:** Managed conservatively

### [[Idiopathic Epilepsy]]
- **Diagnosed:** 2026-05 (confirmed by brain MRI — no structural cause)
- **Seizures to date:** 5, including a cluster on 2026-10-22 (see [[Seizure Log]])
- **Status:** Levetiracetam for 5 days whenever the prodrome is recognised; no daily medication (Northwest, 2026-10-26). See [[Seizure Action Plan]]

## Managed (Ongoing)

### Allergies
- Receives Cytopoint (lokivetmab) 40 mg SC injections 2–3 times per year to manage flare-ups
- Believed to be pollen-related
- Responds well to treatment
- See [[Medications]] for full dosing details

### Anal Gland Impaction
- Requires manual expression approximately every 3 months
- No complications recorded

## Historical / Incidental

### Old Panosteitis (Left Humerus)
- Noted as an incidental finding on CT (2026-05)
- Bone marrow shows old changes consistent with juvenile panosteitis ("growing pains")
- Not currently causing issues; no treatment required
- Small focal area only — most panosteitis cases involve the whole bone marrow

## Ruled Out

- **Osteosarcoma / bone cancer** — ruled out by CT (additive changes, bilateral distribution — inconsistent with neoplasia)
- **Tumours of any kind** — no evidence on CT or MRI
- **Brain tumour / structural epilepsy cause** — ruled out by MRI
- **Elbow dysplasia** — ruled out by CT (elbows normal, no arthritis)
- **Hip dysplasia** — no dysplastic joint morphology on pelvis X-ray (2022-10-20); bilateral coxofemoral arthrosis was noted as a separate finding (see [[Imaging History]])
- **Toe ligament rupture / instability** — ruled out on examination (conscious and under anaesthesia)
