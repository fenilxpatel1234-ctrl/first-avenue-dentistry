// Shared date helpers used by the booking form and the AI concierge.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function monthIndex(name: string): number | null {
  const first3 = name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
  const m = MONTHS.indexOf(first3);
  return m === -1 ? null : m;
}

// Parses many common date formats the patient might type (e.g. "2026-08-15",
// "August 15, 2026", "15 Aug 2026", "08/15/2026", "tomorrow"). Returns a Date at
// 00:00 local time, or null if the text is not a recognizable date.
export function parseFlexibleDate(input: string): Date | null {
  const text = String(input || '').trim();
  if (!text) return null;

  // Relative dates
  if (/^(today)$/i.test(text)) return startOfDay(new Date());
  if (/^tomorrow$/i.test(text)) return addDays(startOfDay(new Date()), 1);
  if (/^day after tomorrow$/i.test(text)) return addDays(startOfDay(new Date()), 2);
  if (/^(next|this)\s+week/i.test(text)) return addDays(startOfDay(new Date()), 7);

  // "2026-08-15" or "2026-8-15"
  let m = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) return buildDate(+m[1], +m[2], +m[3]);

  // "08/15/2026" (US mm/dd/yyyy) or "15/08/2026" (dd/mm/yyyy)
  m = text.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  if (m) {
    const a = +m[1], b = +m[2], y = +m[3];
    return a > 12 ? buildDate(y, b, a) : buildDate(y, a, b);
  }
  // "15-08-2026" (dd-mm-yyyy)
  m = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (m) {
    const a = +m[1], b = +m[2], y = +m[3];
    return a > 12 ? buildDate(y, b, a) : buildDate(y, a, b);
  }

  // "August 15, 2026" / "Aug 15 2026" / "August 15th, 2026"
  m = text.match(/^([a-zA-Z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/);
  if (m) {
    const month = monthIndex(m[1]);
    if (month !== null) return buildDate(+m[3], month + 1, +m[2]);
  }

  // "15 August 2026" / "15th August 2026"
  m = text.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+),?\s+(\d{4})$/);
  if (m) {
    const month = monthIndex(m[2]);
    if (month !== null) return buildDate(+m[3], month + 1, +m[1]);
  }

  return null;
}

function buildDate(year: number, month: number, day: number): Date | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
}

function addDays(d: Date, n: number): Date {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}

export function startOfDay(d: Date): Date {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

// Local yyyy-mm-dd (used by <input type="date"> and stored in the backend)
export function toSlug(d: Date): string {
  const y = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

export function todaySlug(): string {
  return toSlug(new Date());
}

export function isDateInPast(slug: string): boolean {
  return slug < todaySlug();
}

// "Saturday, August 15, 2026"
export function formatFriendlyDate(d: Date): string {
  return d.toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}