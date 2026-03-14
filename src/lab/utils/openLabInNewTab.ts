import type { LabPageId } from '../labRoutes';

/**
 * Open a lab page in a new browser tab via hash-based routing.
 * The new tab loads lab.html with a hash like `#page=visual-novel&eventId=xxx`,
 * and LabRoot reads that hash on mount to auto-navigate.
 */
export function openLabInNewTab(
  page: LabPageId,
  config: Record<string, string | number | undefined>,
): void {
  const params = Object.entries(config)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  const url = `/lab.html#page=${page}${params ? '&' + params : ''}`;
  window.open(url, '_blank');
}
