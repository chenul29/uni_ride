import type { SVGProps } from 'react'

type IconName = 'dashboard' | 'students' | 'wallet' | 'ticket' | 'feedback' | 'reports' | 'settings' | 'logout' | 'menu' | 'close' | 'bell' | 'chevron' | 'trend' | 'activity' | 'star' | 'download' | 'plus' | 'check' | 'alert' | 'clock'

const paths: Record<IconName, string> = {
  dashboard: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  students: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  wallet: 'M20 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0 0 4h16v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5M16 13h2',
  ticket: 'M3 8a3 3 0 0 0 3-3h12a3 3 0 0 0 3 3v8a3 3 0 0 0-3 3H6a3 3 0 0 0-3-3zM13 5v14M9 9h1M9 13h1M9 17h1',
  feedback: 'M21 11.5a8.38 8.38 0 0 1-9 8.5 9.42 9.42 0 0 1-4-.9L3 21l1.9-4A8.38 8.38 0 1 1 21 11.5z',
  reports: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.4 1.4-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-1.4-1.4.06-.06A1.65 1.65 0 0 0 9.6 15a1.65 1.65 0 0 0-1.51-1H8v-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06 1.4-1.4.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V6h2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 1.4 1.4-.06.06A1.65 1.65 0 0 0 19.4 10a1.65 1.65 0 0 0 1.51 1H21v2h-.09a1.65 1.65 0 0 0-1.51 1z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  menu: 'M3 6h18M3 12h18M3 18h18', close: 'M18 6 6 18M6 6l12 12', bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4', chevron: 'm6 9 6 6 6-6', trend: 'm3 17 6-6 4 4 8-9M17 6h4v4', activity: 'M3 12h4l2-6 4 12 2-6h6', star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z', download: 'M12 3v12M7 10l5 5 5-5M5 21h14', plus: 'M12 5v14M5 12h14', check: 'm5 12 4 4L19 6', alert: 'M12 9v4M12 17h.01M10.3 3.8 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z', clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
}

export function AdminIcon({ name, size = 18, ...props }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>
}