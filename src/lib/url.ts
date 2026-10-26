const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('#')) return path;
  return base + (path.startsWith('/') ? path : '/' + path);
}

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/action-plan/', label: 'Action plan', urgent: true },
  { href: '/seizures/', label: 'Seizures' },
  { href: '/medications/', label: 'Medications' },
  { href: '/visits/', label: 'Vet visits' },
  { href: '/conditions/', label: 'Conditions' },
  { href: '/imaging/', label: 'Imaging' },
  { href: '/care/', label: 'Care' },
  { href: '/timeline/', label: 'Timeline' },
  { href: '/about/', label: 'About' },
];
