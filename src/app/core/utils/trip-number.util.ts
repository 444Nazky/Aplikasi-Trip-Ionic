/** Generates trip number in format TRP-DDMMYY-SEQ, e.g. TRP-120524-001 */
export function generateTripNumber(seqToday: number, date: Date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const seq = String(seqToday).padStart(3, '0');
  return `TRP-${dd}${mm}${yy}-${seq}`;
}
