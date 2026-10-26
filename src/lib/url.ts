const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('#')) return path;
  return base + (path.startsWith('/') ? path : '/' + path);
}

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/contact/', label: 'Contact' },
  { href: '/seizures/', label: 'Seizures', also: ['/action-plan/'] },
  { href: '/medications/', label: 'Medications' },
  { href: '/visits/', label: 'Appointment notes' },
  { href: '/conditions/', label: 'Conditions' },
  { href: '/imaging/', label: 'Imaging' },
  { href: '/care/', label: 'Care' },
  { href: '/timeline/', label: 'Timeline' },
];
