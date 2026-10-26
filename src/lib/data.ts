import yaml from 'js-yaml';
import seizuresRaw from '../data/seizures.yaml?raw';
import prodromesRaw from '../data/prodromes.yaml?raw';
import profileRaw from '../data/profile.yaml?raw';
import weightRaw from '../data/weight.yaml?raw';
import contactsRaw from '../data/contacts.yaml?raw';
import medicationsRaw from '../data/medications.yaml?raw';
import timelineRaw from '../data/timeline.yaml?raw';
import openQuestionsRaw from '../data/open-questions.yaml?raw';

// YAML turns bare dates into Date objects; keep every date as a plain ISO string.
function normaliseDates<T>(value: T): T {
  if (value instanceof Date) return value.toISOString().slice(0, 10) as T;
  if (Array.isArray(value)) return value.map(normaliseDates) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normaliseDates(v)])) as T;
  }
  return value;
}

const load = <T>(raw: string): T => normaliseDates(yaml.load(raw) as T);

export interface Seizure {
  number: number;
  date: string;
  time?: string;
  duration_seconds: number;
  type: string;
  cluster_with?: number;
  prodrome?: string;
  description?: string;
  post_ictal?: string;
  recovery?: string;
  triggers?: string;
  medications?: string;
  context?: string;
  video?: string;
}

export interface Prodrome {
  date: string;
  start?: string;
  signs: string;
  levetiracetam: string;
  seizure_followed: boolean;
  notes?: string;
}

export interface TimelineEntry {
  date: string;
  kind: 'seizure' | 'prodrome' | 'vet' | 'treatment' | 'life';
  text: string;
  link?: string;
}

export const seizures = load<Seizure[]>(seizuresRaw).sort((a, b) => b.number - a.number);
export const prodromes = load<Prodrome[]>(prodromesRaw).sort((a, b) => b.date.localeCompare(a.date));
export const profile = load<Record<string, any>>(profileRaw);
export const weights = load<{ date: string; kg: number }[]>(weightRaw).sort((a, b) => b.date.localeCompare(a.date));
export interface Contact {
  role: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  urgent?: boolean;
}

export const contacts = load<Contact[]>(contactsRaw);
export const medications = load<Record<string, any>>(medicationsRaw);
export const timeline = load<TimelineEntry[]>(timelineRaw).sort((a, b) => b.date.localeCompare(a.date));
export const openQuestions = load<Record<string, any>>(openQuestionsRaw);

const DAY = 86_400_000;
const toTime = (iso: string) => Date.parse(iso + 'T00:00:00Z');

export function daysBetween(a: string, b: string) {
  return Math.round((toTime(b) - toTime(a)) / DAY);
}

// Seizures on the same day (a cluster) count as one episode for gap statistics.
export function seizureStats() {
  const episodeDates = [...new Set(seizures.map((s) => s.date))].sort();
  const gaps = episodeDates.slice(1).map((d, i) => ({
    from: episodeDates[i],
    to: d,
    days: daysBetween(episodeDates[i], d),
  }));
  const total = gaps.reduce((sum, g) => sum + g.days, 0);
  return {
    count: seizures.length,
    episodes: episodeDates.length,
    clusters: seizures.filter((s) => s.cluster_with).length,
    first: episodeDates[0],
    last: episodeDates[episodeDates.length - 1],
    gaps,
    averageGap: gaps.length ? Math.round(total / gaps.length) : null,
    longestGap: gaps.length ? Math.max(...gaps.map((g) => g.days)) : null,
  };
}

export function withoutTbd(text: string) {
  return text.replace(/\{\{TBD\}\}/g, 'not recorded');
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (!m) return `~${s} sec`;
  return s ? `~${m} min ${s} sec` : `~${m} min`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Handles YYYY-MM-DD, YYYY-MM and YYYY.
export function formatDate(iso: string, short = false) {
  const [y, m, d] = iso.split('-').map(Number);
  if (!m) return String(y);
  const month = short ? MONTHS[m - 1].slice(0, 3) : MONTHS[m - 1];
  return d ? `${d} ${month} ${y}` : `${month} ${y}`;
}

export function ageOn(dob: string, onIso: string) {
  const [y1, m1, d1] = dob.split('-').map(Number);
  const [y2, m2, d2] = onIso.split('-').map(Number);
  return y2 - y1 - (m2 < m1 || (m2 === m1 && d2 < d1) ? 1 : 0);
}
