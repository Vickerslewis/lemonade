import { getCollection } from 'astro:content';
import { seizures, prodromes, formatDuration } from './data';

// Events for the lane timeline, from the first seizure onwards.
export async function laneEvents() {
  const first = seizures.map((s) => s.date).sort()[0];
  const visits = (await getCollection('visits')).filter((v) => v.data.date >= first);
  return [
    ...seizures.map((s) => ({
      lane: 'seizure',
      date: s.date,
      title: `Seizure ${s.number}${s.time ? ' · ' + s.time : ''}`,
      detail: `${formatDuration(s.duration_seconds)}${s.cluster_with ? ' · cluster' : ''}`,
    })),
    ...prodromes.map((p) => ({
      lane: 'prodrome',
      date: p.date,
      title: 'Warning signs',
      detail: p.seizure_followed ? 'seizure followed' : 'no seizure followed',
    })),
    ...visits.map((v) => ({ lane: 'vet', date: v.data.date, title: v.data.title, detail: v.data.location })),
  ];
}
