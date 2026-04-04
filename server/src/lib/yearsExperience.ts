/** Career start (April 2023), aligned with DappLooker role. */
const CAREER_START = new Date(2023, 3, 1);

export function computeYearsExperience(referenceDate: Date = new Date()): number {
  let years = referenceDate.getFullYear() - CAREER_START.getFullYear();
  const monthDiff = referenceDate.getMonth() - CAREER_START.getMonth();
  const dayDiff = referenceDate.getDate() - CAREER_START.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years -= 1;
  }
  return Math.max(0, years);
}
