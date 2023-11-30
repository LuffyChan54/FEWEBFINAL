export const getNextExpiresTime = (expiresIn: number): string => {
  const currentDate = new Date();
  const expiresTimeDate = new Date(currentDate.getTime() + expiresIn * 1000);
  const expiresTime = expiresTimeDate.toString();
  return expiresTime;
};

export const isTokenStillValid = (expiresTime: string): boolean => {
  if (expiresTime.trim().length == 0) return false;
  const now = new Date();
  const expiresDate = new Date(expiresTime);
  return now < expiresDate;
};
