/**
 * Determines if a private foundation shows strong indicators of inactivity
 * based on regulatory data sources and filing patterns.
 *
 * Primary indicators evaluated:
 * - Presence in EOBMF (IRS master list of tax-exempt organizations)
 * - Presence in Publication 78 (optional, organizations eligible for tax-deductible contributions)
 * - Currency of latest Form 990-PF filing (default threshold 36 months)
 *
 * The algorithm takes a conservative approach, only indicating likely inactivity when:
 * 1. The foundation is absent from EOBMF (core tax-exempt status list), or
 * 2. Latest filing is significantly delayed (36+ months by default)
 *
 * Publication 78 status is configurable but not used by default, as private foundations
 * typically don't rely on receiving tax-deductible contributions.
 */

interface InactivityConfig {
  monthsThreshold: number;
  requireEobmf: boolean;
  requirePub78: boolean;
}

interface Foundation {
  inCurrentEobmf: boolean;
  inCurrentPub78: boolean;
  latestFiling?: {
    fyeDate: Date;
  };
}

const DEFAULT_CONFIG: InactivityConfig = {
  monthsThreshold: 36,
  requireEobmf: true,
  requirePub78: false, // Changed to false based on our discussion
};

const calculateMonthsBetween = (fyeDate: Date, currentDate: Date): number => {
  const yearDiff = currentDate.getFullYear() - fyeDate.getFullYear();
  const monthDiff = currentDate.getMonth() - fyeDate.getMonth();
  return yearDiff * 12 + monthDiff;
};

export const isLikelyInactive = (foundation: Foundation, config: InactivityConfig = DEFAULT_CONFIG): boolean => {
  // EOBMF check - fundamental to tax-exempt status
  if (config.requireEobmf && !foundation.inCurrentEobmf) {
    return true;
  }

  // Pub78 check - optional based on config
  if (config.requirePub78 && !foundation.inCurrentPub78) {
    return true;
  }

  // Filing delay check
  if (foundation.latestFiling?.fyeDate) {
    const monthsSinceFye = calculateMonthsBetween(foundation.latestFiling.fyeDate, new Date());
    if (monthsSinceFye >= config.monthsThreshold) {
      return true;
    }
  }

  return false;
};
