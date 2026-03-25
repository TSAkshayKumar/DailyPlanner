export const getISTDate = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split("T")[0];
};

export const getNextSundayIST = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);

  const day = ist.getDay(); // 0 = Sunday
  const daysToAdd = day === 0 ? 7 : 7 - day;

  ist.setDate(ist.getDate() + daysToAdd);
  return ist.toISOString().split("T")[0];
};