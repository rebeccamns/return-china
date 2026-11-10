export function matchesScan(scanned: string, expected: string) {
  return scanned.trim().toLowerCase() === expected.trim().toLowerCase();
}
