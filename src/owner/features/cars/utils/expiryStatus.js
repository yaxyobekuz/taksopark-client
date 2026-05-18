export const getExpiryStatus = (date) => {
  if (!date) return "unset";
  const diffDays = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  if (diffDays < 0) return "expired";
  if (diffDays <= 30) return "expiring_soon";
  return "valid";
};

export const getDaysLeft = (date) =>
  Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
