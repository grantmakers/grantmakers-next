export const isValidEin = (ein: string): boolean => {
  const isValidRegex = /^\d{9}$/.test(ein);
  return isValidRegex;
};
