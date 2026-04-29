/** Shared, practical validation for profile, period, and auth forms. */

export type ValidResult = { ok: true };
export type InvalidResult = { ok: false; message: string };
export type FieldResult = ValidResult | InvalidResult;

export const HEIGHT_CM_MIN = 120;
export const HEIGHT_CM_MAX = 220;

export const AGE_MIN = 13;
export const AGE_MAX = 100;

export const PERIOD_MAX_SPAN_DAYS = 21;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export function validateHeightCm(cm: number): FieldResult {
  if (!Number.isFinite(cm)) return { ok: false, message: "Enter a valid height in cm." };
  if (cm < HEIGHT_CM_MIN) return { ok: false, message: `Height must be at least ${HEIGHT_CM_MIN} cm.` };
  if (cm > HEIGHT_CM_MAX) return { ok: false, message: `Height must be at most ${HEIGHT_CM_MAX} cm.` };
  return { ok: true };
}

export function validateAgeYears(age: number): FieldResult {
  if (!Number.isFinite(age)) return { ok: false, message: "Enter a valid age." };
  if (age < AGE_MIN) return { ok: false, message: `Age must be at least ${AGE_MIN}.` };
  if (age > AGE_MAX) return { ok: false, message: `Age must be at most ${AGE_MAX}.` };
  return { ok: true };
}

export function validateEmail(email: string): FieldResult {
  const e = email.trim();
  if (!e) return { ok: false, message: "Enter your email." };
  if (e.length > 254) return { ok: false, message: "That email looks too long." };
  const simple = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!simple.test(e)) return { ok: false, message: "Enter a valid email address." };
  return { ok: true };
}

export function validateSignupPassword(password: string): FieldResult {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` };
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { ok: false, message: "Password is too long." };
  }
  return { ok: true };
}

export function validateLoginPassword(password: string): FieldResult {
  if (!password) return { ok: false, message: "Enter your password." };
  return { ok: true };
}

/** Optional run / route distance in km */
export function validateOptionalDistanceKm(km: number | undefined): FieldResult {
  if (km == null || Number.isNaN(km)) return { ok: true };
  if (km < 0) return { ok: false, message: "Distance cannot be negative." };
  if (km > 200) return { ok: false, message: "Distance over 200 km is not supported for a single log." };
  if (km > 0 && km < 0.05) return { ok: false, message: "If you add distance, use at least 0.05 km (50 m)." };
  return { ok: true };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Period / cycle log: end must be on or after start; inclusive span capped for typo safety.
 */
export function validatePeriodDates(startDate: string, endDate: string): { ok: true; endResolved: string } | InvalidResult {
  if (!startDate || !ISO_DATE.test(startDate)) {
    return { ok: false, message: "Choose a valid start date." };
  }
  if (endDate && !ISO_DATE.test(endDate)) {
    return { ok: false, message: "End date is not valid." };
  }
  const endResolved = endDate && endDate.length > 0 ? endDate : startDate;
  if (endResolved < startDate) {
    return { ok: false, message: "End date must be on or after the start date." };
  }
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endResolved}T12:00:00`);
  const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  if (diffDays > PERIOD_MAX_SPAN_DAYS) {
    return {
      ok: false,
      message: `That range is longer than ${PERIOD_MAX_SPAN_DAYS} days — please check the dates.`,
    };
  }
  return { ok: true, endResolved };
}

/** Reminder time input (HTML time → HH:mm) */
export function validateReminderTime(time: string): FieldResult {
  if (!time || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return { ok: false, message: "Use a valid time like 09:00 or 17:30." };
  }
  return { ok: true };
}
