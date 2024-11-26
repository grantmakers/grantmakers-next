interface Config {
  monthsThreshold: number;
}

const config: Config = {
  monthsThreshold: 36,
};

const calculateMonthsBetween = (fyeDate: number, currentDate: Date): number => {
  const fyeYear = Math.floor(fyeDate / 100);
  const fyeMonth = fyeDate % 100;

  if (fyeDate < 100000 || fyeDate > 999999 || fyeMonth < 1 || fyeMonth > 12) {
    throw new Error('fyeDate is expected to be in IRS tax period format YYYYMM');
  }

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  return (currentYear - fyeYear) * 12 + (currentMonth - fyeMonth);
};

export const isLikelyInactive = (eobmfStatus: boolean, taxPeriod: number): boolean => {
  const monthsSinceFye = calculateMonthsBetween(taxPeriod, new Date());
  if (eobmfStatus === false) {
    if (monthsSinceFye >= config.monthsThreshold) {
      return true;
    }
  }
  return false;
};
