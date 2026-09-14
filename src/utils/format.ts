import type { Period } from '../models/resume.model';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Label for an open-ended period. The site uppercases it via CSS. */
export const PRESENT = 'Present';

/** En dash with spaces, e.g. "Mar 2026 – Present". */
export const PERIOD_SEPARATOR = ' – ';

/** Separator between stack items, e.g. "React · Redux". */
export const STACK_SEPARATOR = ' · ';

/** "2026-03" -> "Mar 2026" */
export function formatMonth(iso: string): string {
    const [year, month] = iso.split('-');
    const label = MONTHS[Number(month) - 1];
    if (!label || !year) throw new Error(`Invalid ISO month: "${iso}"`);
    return `${label} ${year}`;
}

/** "2023-02".."2025-02" -> "Feb 2023 – Feb 2025"; open end -> "Mar 2026 – Present" */
export function formatPeriod(period: Period): string {
    const end = period.end ? formatMonth(period.end) : PRESENT;
    return `${formatMonth(period.start)}${PERIOD_SEPARATOR}${end}`;
}

export function formatStack(stack: string[]): string {
    return stack.join(STACK_SEPARATOR);
}
